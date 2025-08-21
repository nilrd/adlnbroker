// Sistema de autenticação frontend para ADLN Broker
// Desenvolvido por Nilson Brites

(function() {
    'use strict';

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
        
        // Redirecionar para a página inicial
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            window.location.href = 'index.html';
        }
    }

    // Função para verificar autenticação no dashboard
    function checkDashboardAuth() {
        if (!isUserLoggedIn()) {
            redirectToLogin();
            return false;
        }
        return true;
    }

    // Função para fazer logout
    function logout() {
        localStorage.removeItem('adln_usuario_atual');
        redirectToLogin();
    }

    // Verificar se estamos na página do dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        // Verificar autenticação imediatamente
        if (!checkDashboardAuth()) {
            return;
        }

        // Verificar periodicamente se o usuário ainda está logado
        setInterval(function() {
            if (!isUserLoggedIn()) {
                console.log('Usuário não logado detectado, redirecionando...');
                redirectToLogin();
            }
        }, 30000); // Verificar a cada 30 segundos (menos agressivo)
    }

    // Interceptar tentativas de acesso direto ao dashboard
    window.addEventListener('beforeunload', function() {
        // Se estamos saindo do dashboard, não fazer nada especial
        // A verificação será feita quando a página carregar novamente
    });

    // Interceptar o botão voltar do navegador
    window.addEventListener('popstate', function(event) {
        if (window.location.pathname.includes('dashboard.html')) {
            if (!checkDashboardAuth()) {
                return;
            }
        }
    });

    // Expor funções globalmente se necessário
    window.ADLNAuth = {
        isLoggedIn: isUserLoggedIn,
        logout: logout,
        checkAuth: checkDashboardAuth
    };

})();

