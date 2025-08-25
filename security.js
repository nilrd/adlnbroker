// Módulo de Segurança ADLN Broker
// Sistema de proteção contra acesso não autorizado ao dashboard
// Desenvolvido por Nilson Brites

(function() {
    'use strict';

    // Configurações de segurança
    const SECURITY_CONFIG = {
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
        CHECK_INTERVAL: 5000, // Verificar a cada 5 segundos
        MAX_LOGIN_ATTEMPTS: 3,
        BLOCK_DURATION: 15 * 60 * 1000, // 15 minutos de bloqueio
        SECURE_PAGES: ['dashboard.html', '/dashboard', 'dashboard'],
        LOGIN_PAGE: 'index.html'
    };

    // Estado da segurança
    let securityState = {
        isAuthenticated: false,
        sessionStartTime: null,
        lastActivity: null,
        loginAttempts: 0,
        blockedUntil: null,
        securityCheckInterval: null,
        pageLoadTime: Date.now()
    };

    // Função para verificar se o usuário está autenticado
    function isUserAuthenticated() {
        const usuarioAtual = localStorage.getItem('adln_usuario_atual');
        if (!usuarioAtual) {
            return false;
        }

        const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
        return usuarios[usuarioAtual] !== undefined;
    }

    // Função para verificar se a sessão ainda é válida
    function isSessionValid() {
        if (!securityState.sessionStartTime) {
            return false;
        }

        const now = Date.now();
        const sessionAge = now - securityState.sessionStartTime;
        const timeSinceLastActivity = now - securityState.lastActivity;

        // Verificar timeout da sessão
        if (sessionAge > SECURITY_CONFIG.SESSION_TIMEOUT) {
            console.log('Sessão expirada por timeout');
            return false;
        }

        // Verificar inatividade
        if (timeSinceLastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
            console.log('Sessão expirada por inatividade');
            return false;
        }

        return true;
    }

    // Função para verificar se está em uma página protegida
    function isProtectedPage() {
        const currentPath = window.location.pathname;
        const currentHref = window.location.href;
        
        return SECURITY_CONFIG.SECURE_PAGES.some(page => 
            currentPath.includes(page) || currentHref.includes(page)
        );
    }

    // Função para verificar se está bloqueado por tentativas de login
    function isBlocked() {
        if (!securityState.blockedUntil) {
            return false;
        }
        
        if (Date.now() < securityState.blockedUntil) {
            return true;
        }
        
        // Reset do bloqueio se já expirou
        securityState.blockedUntil = null;
        securityState.loginAttempts = 0;
        return false;
    }

    // Função para registrar atividade do usuário
    function updateUserActivity() {
        securityState.lastActivity = Date.now();
        localStorage.setItem('adln_last_activity', securityState.lastActivity.toString());
    }

    // Função para limpar dados de sessão
    function clearSessionData() {
        localStorage.removeItem('adln_usuario_atual');
        localStorage.removeItem('adln_last_activity');
        localStorage.removeItem('adln_session_start');
        securityState.isAuthenticated = false;
        securityState.sessionStartTime = null;
        securityState.lastActivity = null;
        console.log('Dados de sessão limpos');
    }

    // Função para redirecionar para login
    function redirectToLogin(reason = '') {
        console.log('Redirecionando para login:', reason);
        
        // Limpar dados de sessão
        clearSessionData();
        
        // Parar verificações de segurança
        if (securityState.securityCheckInterval) {
            clearInterval(securityState.securityCheckInterval);
        }
        
        // Redirecionar para página de login
        const currentPath = window.location.pathname;
        if (!currentPath.includes('index.html') && currentPath !== '/') {
            window.location.href = SECURITY_CONFIG.LOGIN_PAGE;
        }
    }

    // Função para mostrar tela de bloqueio
    function showBlockScreen() {
        const blockScreen = document.createElement('div');
        blockScreen.id = 'security-block-screen';
        blockScreen.innerHTML = `
            <div class="block-content">
                <div class="block-icon">🔒</div>
                <h2>Acesso Bloqueado</h2>
                <p>Muitas tentativas de login inválidas.</p>
                <p>Tente novamente em alguns minutos.</p>
                <div class="block-timer" id="block-timer"></div>
            </div>
        `;
        
        blockScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #181A20 0%, #2A2D35 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        const blockContent = blockScreen.querySelector('.block-content');
        blockContent.style.cssText = `
            text-align: center;
            color: white;
            padding: 40px;
            border-radius: 15px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid #F0B90B;
        `;
        
        const blockIcon = blockScreen.querySelector('.block-icon');
        blockIcon.style.cssText = `
            font-size: 48px;
            margin-bottom: 20px;
            display: block;
        `;
        
        document.body.appendChild(blockScreen);
        
        // Atualizar timer
        updateBlockTimer();
    }

    // Função para atualizar timer de bloqueio
    function updateBlockTimer() {
        const timerElement = document.getElementById('block-timer');
        if (!timerElement || !securityState.blockedUntil) return;
        
        const now = Date.now();
        const remaining = Math.max(0, securityState.blockedUntil - now);
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (remaining > 0) {
            setTimeout(updateBlockTimer, 1000);
        } else {
            const blockScreen = document.getElementById('security-block-screen');
            if (blockScreen) {
                blockScreen.remove();
            }
        }
    }

    // Função para verificar segurança
    function performSecurityCheck() {
        // Verificar se está bloqueado
        if (isBlocked()) {
            if (!document.getElementById('security-block-screen')) {
                showBlockScreen();
            }
            return false;
        }

        // Se não estiver em página protegida, não precisa verificar
        if (!isProtectedPage()) {
            return true;
        }

        // Verificar autenticação
        if (!isUserAuthenticated()) {
            redirectToLogin('Usuário não autenticado');
            return false;
        }

        // Restaurar dados de sessão se necessário
        if (!securityState.sessionStartTime) {
            restoreSessionData();
        }

        // Verificar validade da sessão
        if (!isSessionValid()) {
            redirectToLogin('Sessão expirada');
            return false;
        }

        // Atualizar atividade
        updateUserActivity();
        
        return true;
    }

    // Função para restaurar dados de sessão do localStorage
    function restoreSessionData() {
        const sessionStart = localStorage.getItem('adln_session_start');
        const lastActivity = localStorage.getItem('adln_last_activity');
        
        if (sessionStart && lastActivity) {
            securityState.sessionStartTime = parseInt(sessionStart);
            securityState.lastActivity = parseInt(lastActivity);
            securityState.isAuthenticated = true;
            console.log('Dados de sessão restaurados do localStorage');
            return true;
        }
        return false;
    }

    // Função para inicializar sessão
    function initializeSession() {
        if (isUserAuthenticated()) {
            securityState.isAuthenticated = true;
            securityState.sessionStartTime = Date.now();
            securityState.lastActivity = Date.now();
            
            localStorage.setItem('adln_session_start', securityState.sessionStartTime.toString());
            localStorage.setItem('adln_last_activity', securityState.lastActivity.toString());
            
            console.log('Sessão de segurança inicializada');
        }
    }

    // Função para registrar tentativa de login
    function recordLoginAttempt(success) {
        if (success) {
            securityState.loginAttempts = 0;
            securityState.blockedUntil = null;
            initializeSession();
        } else {
            securityState.loginAttempts++;
            
            if (securityState.loginAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
                securityState.blockedUntil = Date.now() + SECURITY_CONFIG.BLOCK_DURATION;
                console.log('Conta bloqueada por múltiplas tentativas de login');
            }
        }
    }

    // Função para iniciar monitoramento de segurança
    function startSecurityMonitoring() {
        // Verificação inicial
        if (!performSecurityCheck()) {
            return;
        }

        // Iniciar verificações periódicas
        securityState.securityCheckInterval = setInterval(() => {
            performSecurityCheck();
        }, SECURITY_CONFIG.CHECK_INTERVAL);

        // Monitorar eventos de atividade
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        activityEvents.forEach(event => {
            document.addEventListener(event, updateUserActivity, true);
        });

        // Monitorar mudanças de foco da janela
        window.addEventListener('focus', updateUserActivity);
        window.addEventListener('blur', updateUserActivity);

        // Monitorar navegação
        window.addEventListener('beforeunload', () => {
            updateUserActivity();
        });

        // Monitorar botão voltar do navegador
        window.addEventListener('popstate', () => {
            if (isProtectedPage()) {
                performSecurityCheck();
            }
        });

        console.log('Monitoramento de segurança iniciado');
    }

    // Função para parar monitoramento de segurança
    function stopSecurityMonitoring() {
        if (securityState.securityCheckInterval) {
            clearInterval(securityState.securityCheckInterval);
            securityState.securityCheckInterval = null;
        }
    }

    // Função para fazer logout seguro
    function secureLogout() {
        clearSessionData();
        stopSecurityMonitoring();
        redirectToLogin('Logout realizado');
    }

    // Inicialização quando o DOM estiver carregado
    function initializeSecurity() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeSecurity);
            return;
        }

        // Verificar se está em página protegida
        if (isProtectedPage()) {
            console.log('Página protegida detectada, iniciando verificações de segurança...');
            
            // Restaurar dados de sessão se o usuário estiver autenticado
            if (isUserAuthenticated()) {
                restoreSessionData();
            }
            
            // Verificação inicial
            if (performSecurityCheck()) {
                startSecurityMonitoring();
            }
        } else {
            console.log('Página não protegida, verificações de segurança não necessárias');
        }
    }

    // Inicializar segurança
    initializeSecurity();

    // Expor funções globalmente
    window.ADLNSecurity = {
        isAuthenticated: () => securityState.isAuthenticated,
        isSessionValid: isSessionValid,
        isBlocked: isBlocked,
        recordLoginAttempt: recordLoginAttempt,
        secureLogout: secureLogout,
        updateActivity: updateUserActivity,
        performCheck: performSecurityCheck,
        startMonitoring: startSecurityMonitoring,
        stopMonitoring: stopSecurityMonitoring
    };

    // Interceptar tentativas de acesso direto ao dashboard
    if (isProtectedPage()) {
        // Verificar se veio de uma página autorizada
        const referrer = document.referrer;
        const currentOrigin = window.location.origin;
        
        if (!referrer || !referrer.startsWith(currentOrigin)) {
            console.log('Acesso direto detectado, verificando autenticação...');
            // A verificação será feita pela função performSecurityCheck
        }
    }

})();
