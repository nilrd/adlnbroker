// Sistema de autenticação frontend para ADLN Broker - VERSÃO CORRIGIDA
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

    // Função para verificar autenticação no dashboard
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
        redirectToLogin();
    }

    // Verificar se estamos na página do dashboard
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
        checkAuth: checkDashboardAuth
    };

})();

