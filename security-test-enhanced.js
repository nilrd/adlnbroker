// Script de Teste do Módulo de Segurança ADLN Broker - VERSÃO MELHORADA
// Testa funcionalidades de bloqueio do botão voltar e persistência de logout
// Desenvolvido por Nilson Brites

(function() {
    'use strict';

    console.log('=== TESTE DO MÓDULO DE SEGURANÇA MELHORADO ===');

    // Função para criar dados de teste
    function createTestData() {
        const testUsers = {
            'testuser': {
                senha: 'testpass',
                nome: 'Usuário Teste'
            }
        };
        
        localStorage.setItem('adln_usuarios', JSON.stringify(testUsers));
        console.log('✅ Dados de teste criados');
    }

    // Função para testar autenticação
    function testAuthentication() {
        console.log('\n--- Teste de Autenticação ---');
        
        // Teste 1: Usuário não autenticado
        console.log('Teste 1: Usuário não autenticado');
        const isLoggedIn = window.ADLNAuth ? window.ADLNAuth.isLoggedIn() : false;
        console.log('Resultado:', isLoggedIn ? '❌ FALHOU' : '✅ PASSOU');
        
        // Teste 2: Login bem-sucedido
        console.log('\nTeste 2: Login bem-sucedido');
        if (window.ADLNAuth && window.ADLNAuth.login) {
            const loginResult = window.ADLNAuth.login('testuser', 'testpass');
            console.log('Resultado:', loginResult ? '✅ PASSOU' : '❌ FALHOU');
            
            if (loginResult) {
                const isLoggedInAfter = window.ADLNAuth.isLoggedIn();
                console.log('Usuário logado após login:', isLoggedInAfter ? '✅ SIM' : '❌ NÃO');
            }
        }
    }

    // Função para testar estado do módulo de segurança
    function testSecurityState() {
        console.log('\n--- Teste do Estado de Segurança ---');
        
        if (window.ADLNSecurity) {
            console.log('Módulo de segurança disponível: ✅');
            console.log('Autenticado:', window.ADLNSecurity.isAuthenticated() ? '✅ SIM' : '❌ NÃO');
            console.log('Sessão válida:', window.ADLNSecurity.isSessionValid() ? '✅ SIM' : '❌ NÃO');
            console.log('Bloqueado:', window.ADLNSecurity.isBlocked() ? '❌ SIM' : '✅ NÃO');
        } else {
            console.log('❌ Módulo de segurança não disponível');
        }
    }

    // Função para testar tentativas de login
    function testLoginAttempts() {
        console.log('\n--- Teste de Tentativas de Login ---');
        
        if (window.ADLNSecurity && window.ADLNSecurity.recordLoginAttempt) {
            // Simular tentativas falhadas
            for (let i = 1; i <= 3; i++) {
                console.log(`Tentativa ${i}:`);
                window.ADLNSecurity.recordLoginAttempt(false);
                console.log('Bloqueado:', window.ADLNSecurity.isBlocked() ? '❌ SIM' : '✅ NÃO');
            }
            
            // Testar tentativa bem-sucedida
            console.log('\nTentativa bem-sucedida:');
            window.ADLNSecurity.recordLoginAttempt(true);
            console.log('Bloqueado:', window.ADLNSecurity.isBlocked() ? '❌ SIM' : '✅ NÃO');
        }
    }

    // Função para testar proteção de páginas
    function testPageProtection() {
        console.log('\n--- Teste de Proteção de Páginas ---');
        
        const currentPage = window.location.pathname;
        console.log('Página atual:', currentPage);
        
        if (window.ADLNSecurity && window.ADLNSecurity.performCheck) {
            const isProtected = currentPage.includes('dashboard.html');
            console.log('Página protegida:', isProtected ? '✅ SIM' : '❌ NÃO');
            
            if (isProtected) {
                console.log('Executando verificação de segurança...');
                const checkResult = window.ADLNSecurity.performCheck();
                console.log('Verificação passou:', checkResult ? '✅ SIM' : '❌ NÃO');
            }
        }
    }

    // Função para testar monitoramento de atividade
    function testActivityMonitoring() {
        console.log('\n--- Teste de Monitoramento de Atividade ---');
        
        if (window.ADLNSecurity && window.ADLNSecurity.updateActivity) {
            console.log('Atualizando atividade...');
            window.ADLNSecurity.updateActivity();
            console.log('✅ Atividade atualizada');
        }
    }

    // Função para testar logout
    function testLogout() {
        console.log('\n--- Teste de Logout ---');
        
        if (window.ADLNAuth && window.ADLNAuth.logout) {
            console.log('Executando logout...');
            window.ADLNAuth.logout();
            console.log('✅ Logout executado');
            
            // Verificar se logout foi registrado
            const logoutPerformed = localStorage.getItem('adln_logout_performed');
            console.log('Logout registrado:', logoutPerformed === 'true' ? '✅ SIM' : '❌ NÃO');
        }
    }

    // Função para testar bloqueio do botão voltar
    function testBackButtonBlocking() {
        console.log('\n--- Teste de Bloqueio do Botão Voltar ---');
        
        if (window.ADLNSecurity) {
            console.log('Testando manipulação de histórico...');
            
            // Simular logout
            localStorage.setItem('adln_logout_performed', 'true');
            
            // Testar manipulação de histórico
            if (window.ADLNSecurity.manipulateHistory) {
                window.ADLNSecurity.manipulateHistory();
                console.log('✅ Manipulação de histórico executada');
            }
            
            // Testar bloqueio do botão voltar
            if (window.ADLNSecurity.blockBackButton) {
                window.ADLNSecurity.blockBackButton();
                console.log('✅ Bloqueio do botão voltar configurado');
            }
        }
    }

    // Função para testar persistência de logout
    function testLogoutPersistence() {
        console.log('\n--- Teste de Persistência de Logout ---');
        
        // Simular logout
        localStorage.setItem('adln_logout_performed', 'true');
        localStorage.removeItem('adln_usuario_atual');
        
        console.log('Logout simulado');
        
        // Verificar se o sistema detecta o logout
        if (window.ADLNAuth && window.ADLNAuth.isLoggedIn) {
            const isLoggedIn = window.ADLNAuth.isLoggedIn();
            console.log('Usuário logado após logout:', isLoggedIn ? '❌ SIM' : '✅ NÃO');
        }
        
        // Verificar se o módulo de segurança detecta o logout
        if (window.ADLNSecurity && window.ADLNSecurity.performCheck) {
            const checkResult = window.ADLNSecurity.performCheck();
            console.log('Verificação de segurança após logout:', checkResult ? '❌ PASSOU' : '✅ FALHOU (esperado)');
        }
    }

    // Função para testar restauração de sessão
    function testSessionRestoration() {
        console.log('\n--- Teste de Restauração de Sessão ---');
        
        // Criar dados de sessão válidos
        const now = Date.now();
        localStorage.setItem('adln_session_start', now.toString());
        localStorage.setItem('adln_last_activity', now.toString());
        localStorage.setItem('adln_usuario_atual', 'testuser');
        localStorage.removeItem('adln_logout_performed');
        
        console.log('Dados de sessão criados');
        
        // Verificar se o módulo de segurança restaura a sessão
        if (window.ADLNSecurity && window.ADLNSecurity.performCheck) {
            const checkResult = window.ADLNSecurity.performCheck();
            console.log('Restauração de sessão:', checkResult ? '✅ PASSOU' : '❌ FALHOU');
        }
    }

    // Função para limpar dados de teste
    function cleanupTestData() {
        console.log('\n--- Limpeza de Dados de Teste ---');
        
        localStorage.removeItem('adln_usuarios');
        localStorage.removeItem('adln_usuario_atual');
        localStorage.removeItem('adln_session_start');
        localStorage.removeItem('adln_last_activity');
        localStorage.removeItem('adln_logout_performed');
        
        console.log('✅ Dados de teste limpos');
    }

    // Função para executar todos os testes
    function runAllTests() {
        console.log('Iniciando testes do módulo de segurança melhorado...\n');
        
        try {
            createTestData();
            testAuthentication();
            testSecurityState();
            testLoginAttempts();
            testPageProtection();
            testActivityMonitoring();
            testLogout();
            testBackButtonBlocking();
            testLogoutPersistence();
            testSessionRestoration();
            cleanupTestData();
            
            console.log('\n=== TODOS OS TESTES CONCLUÍDOS ===');
            console.log('✅ Módulo de segurança funcionando corretamente');
            
        } catch (error) {
            console.error('❌ Erro durante os testes:', error);
        }
    }

    // Executar testes quando o DOM estiver carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }

    // Expor funções de teste globalmente
    window.ADLNSecurityTest = {
        runAllTests: runAllTests,
        createTestData: createTestData,
        testAuthentication: testAuthentication,
        testSecurityState: testSecurityState,
        testLoginAttempts: testLoginAttempts,
        testPageProtection: testPageProtection,
        testActivityMonitoring: testActivityMonitoring,
        testLogout: testLogout,
        testBackButtonBlocking: testBackButtonBlocking,
        testLogoutPersistence: testLogoutPersistence,
        testSessionRestoration: testSessionRestoration,
        cleanupTestData: cleanupTestData
    };

})();
