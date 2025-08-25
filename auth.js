// Sistema de autenticação frontend para ADLN Broker - VERSÃO INTEGRADA COM SEGURANÇA
// Desenvolvido por Nilson Brites

(function() {
    'use strict';

    // Flag para evitar verificações múltiplas
    let authChecked = false;

    // Função para verificar se o usuário está logado
    function isUserLoggedIn() {
        const usuarioAtual = localStorage.getItem('adln_usuario_atual');
        if (!usuarioAtual) {
            return false;
        }

        // Verificar se o usuário existe no localStorage
        const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
        return usuarios[usuarioAtual] !== undefined;
    }

    // Função para redirecionar para a página de login
    function redirectToLogin() {
        // Limpar dados de sessão
        localStorage.removeItem('adln_usuario_atual');
        
        // Redirecionar para a página inicial apenas se não estiver já lá
        const currentPath = window.location.pathname;
        if (!currentPath.includes('index.html') && currentPath !== '/') {
            console.log('Redirecionando para login...');
            window.location.href = 'index.html';
        }
    }

    // Função para verificar autenticação no dashboard (compatibilidade)
    function checkDashboardAuth() {
        // Evitar verificações múltiplas
        if (authChecked) {
            return true;
        }
        
        authChecked = true;
        
        if (!isUserLoggedIn()) {
            console.log('Usuário não autenticado, redirecionando...');
            redirectToLogin();
            return false;
        }
        
        console.log('Usuário autenticado no dashboard');
        return true;
    }

    // Função para fazer logout
    function logout() {
        localStorage.removeItem('adln_usuario_atual');
        authChecked = false; // Reset flag
        
        // Usar logout seguro se o módulo de segurança estiver disponível
        if (window.ADLNSecurity && window.ADLNSecurity.secureLogout) {
            window.ADLNSecurity.secureLogout();
        } else {
            redirectToLogin();
        }
    }

    // Função para fazer login com registro de tentativa
    function login(username, password) {
        const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
        
        if (usuarios[username] && usuarios[username].senha === password) {
            // Login bem-sucedido
            localStorage.setItem('adln_usuario_atual', username);
            
            // Registrar tentativa bem-sucedida no módulo de segurança
            if (window.ADLNSecurity && window.ADLNSecurity.recordLoginAttempt) {
                window.ADLNSecurity.recordLoginAttempt(true);
            }
            
            return true;
        } else {
            // Login falhou
            if (window.ADLNSecurity && window.ADLNSecurity.recordLoginAttempt) {
                window.ADLNSecurity.recordLoginAttempt(false);
            }
            return false;
        }
    }

    // Verificar se estamos na página do dashboard (compatibilidade)
    if (window.location.pathname.includes('dashboard.html')) {
        // Aguardar o DOM estar carregado antes de verificar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(checkDashboardAuth, 100); // Pequeno delay para garantir que tudo carregou
            });
        } else {
            setTimeout(checkDashboardAuth, 100);
        }
    }

    // Expor funções globalmente se necessário
    window.ADLNAuth = {
        isLoggedIn: isUserLoggedIn,
        logout: logout,
        login: login,
        checkAuth: checkDashboardAuth
    };

})();

