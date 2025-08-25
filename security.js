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
        pageLoadTime: Date.now(),
        logoutPerformed: false, // Nova flag para rastrear logout
        historyBlocked: false // Nova flag para rastrear bloqueio de histórico
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
        localStorage.removeItem('adln_logout_performed'); // Remover flag de logout
        securityState.isAuthenticated = false;
        securityState.sessionStartTime = null;
        securityState.lastActivity = null;
        securityState.logoutPerformed = true; // Marcar logout como realizado
        console.log('Dados de sessão limpos');
    }

    // Função para manipular histórico do navegador após logout
    function manipulateBrowserHistory() {
        if (securityState.historyBlocked) {
            return; // Evitar múltiplas manipulações
        }

        try {
            // Limpar todo o histórico do navegador
            window.history.go(-(window.history.length - 1));
            
            // Adicionar nova entrada no histórico apontando para login
            const loginUrl = new URL(SECURITY_CONFIG.LOGIN_PAGE, window.location.origin).href;
            window.history.replaceState(null, '', loginUrl);
            
            // Adicionar listener para interceptar navegação
            window.addEventListener('popstate', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Forçar redirecionamento para login
                if (!isUserAuthenticated()) {
                    window.location.replace(loginUrl);
                }
            }, true);

            securityState.historyBlocked = true;
            console.log('Histórico do navegador manipulado para bloquear navegação');
        } catch (error) {
            console.error('Erro ao manipular histórico do navegador:', error);
        }
    }

    // Função para bloquear navegação do botão voltar
    function blockBackButton() {
        // Interceptar evento popstate (botão voltar)
        window.addEventListener('popstate', function(e) {
            if (securityState.logoutPerformed || !isUserAuthenticated()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Forçar redirecionamento para login
                window.location.replace(SECURITY_CONFIG.LOGIN_PAGE);
                return false;
            }
        }, true);

        // Removido evento beforeunload para evitar alerts

        console.log('Botão voltar bloqueado após logout');
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
        
        // Manipular histórico do navegador
        manipulateBrowserHistory();
        
        // Bloquear botão voltar
        blockBackButton();
        
        // Redirecionar para página de login
        const currentPath = window.location.pathname;
        if (!currentPath.includes('index.html') && currentPath !== '/') {
            // Usar replace para evitar que o usuário volte
            window.location.replace(SECURITY_CONFIG.LOGIN_PAGE);
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
        // Verificar se logout foi realizado
        if (securityState.logoutPerformed) {
            redirectToLogin('Logout detectado');
            return false;
        }

        // Verificar se está bloqueado (não exibir tela durante logout)
        if (isBlocked() && !securityState.logoutPerformed) {
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
        const logoutPerformed = localStorage.getItem('adln_logout_performed');
        
        // Se logout foi realizado, não restaurar sessão
        if (logoutPerformed === 'true') {
            securityState.logoutPerformed = true;
            redirectToLogin('Logout anterior detectado');
            return false;
        }
        
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
            securityState.logoutPerformed = false; // Reset flag de logout
            
            localStorage.setItem('adln_session_start', securityState.sessionStartTime.toString());
            localStorage.setItem('adln_last_activity', securityState.lastActivity.toString());
            localStorage.removeItem('adln_logout_performed'); // Remover flag de logout
            
            console.log('Sessão de segurança inicializada');
        }
    }

    // Função para registrar tentativa de login
    function recordLoginAttempt(success) {
        if (success) {
            securityState.loginAttempts = 0;
            securityState.blockedUntil = null;
            securityState.logoutPerformed = false; // Reset flag de logout
            securityState.historyBlocked = false; // Reset flag de histórico
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

        // Monitorar navegação (removido beforeunload para evitar alerts)

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
        console.log('Executando logout seguro...');
        
        // Marcar logout como realizado
        securityState.logoutPerformed = true;
        localStorage.setItem('adln_logout_performed', 'true');
        
        // Limpar dados de sessão
        clearSessionData();
        
        // Parar monitoramento
        stopSecurityMonitoring();
        
        // Manipular histórico do navegador
        manipulateBrowserHistory();
        
        // Bloquear botão voltar
        blockBackButton();
        
        // Redirecionar para login
        redirectToLogin('Logout realizado');
    }

    // Inicialização quando o DOM estiver carregado
    function initializeSecurity() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeSecurity);
            return;
        }

        // Verificar se logout foi realizado anteriormente
        const logoutPerformed = localStorage.getItem('adln_logout_performed');
        if (logoutPerformed === 'true') {
            securityState.logoutPerformed = true;
            redirectToLogin('Logout anterior detectado');
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
        stopMonitoring: stopSecurityMonitoring,
        manipulateHistory: manipulateBrowserHistory,
        blockBackButton: blockBackButton
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
