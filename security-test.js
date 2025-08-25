// Script de Teste para o Módulo de Segurança ADLN Broker
// Execute este script no console do navegador para testar as funcionalidades

(function() {
    'use strict';

    console.log('🔒 Iniciando testes do módulo de segurança...');

    // Função para criar dados de teste
    function createTestData() {
        const testUsers = {
            '123.456.789-00': {
                nome: 'Usuário Teste',
                email: 'teste@adln.com',
                senha: 'Teste123'
            }
        };
        
        localStorage.setItem('adln_usuarios', JSON.stringify(testUsers));
        console.log('✅ Dados de teste criados');
    }

    // Função para testar autenticação
    function testAuthentication() {
        console.log('\n🧪 Testando autenticação...');
        
        // Teste 1: Usuário não logado
        console.log('Teste 1 - Usuário não logado:');
        console.log('ADLNAuth.isLoggedIn():', window.ADLNAuth ? window.ADLNAuth.isLoggedIn() : 'Módulo não encontrado');
        
        // Teste 2: Login bem-sucedido
        console.log('\nTeste 2 - Login bem-sucedido:');
        if (window.ADLNAuth && window.ADLNAuth.login) {
            const loginResult = window.ADLNAuth.login('123.456.789-00', 'Teste123');
            console.log('Login resultado:', loginResult);
            console.log('ADLNAuth.isLoggedIn():', window.ADLNAuth.isLoggedIn());
        }
        
        // Teste 3: Login falhado
        console.log('\nTeste 3 - Login falhado:');
        if (window.ADLNAuth && window.ADLNAuth.login) {
            const loginResult = window.ADLNAuth.login('123.456.789-00', 'SenhaErrada');
            console.log('Login resultado:', loginResult);
        }
    }

    // Função para testar módulo de segurança
    function testSecurityModule() {
        console.log('\n🛡️ Testando módulo de segurança...');
        
        if (!window.ADLNSecurity) {
            console.log('❌ Módulo de segurança não encontrado');
            return;
        }
        
        // Teste 1: Verificar se está autenticado
        console.log('Teste 1 - Status de autenticação:');
        console.log('ADLNSecurity.isAuthenticated():', window.ADLNSecurity.isAuthenticated());
        
        // Teste 2: Verificar se a sessão é válida
        console.log('\nTeste 2 - Validade da sessão:');
        console.log('ADLNSecurity.isSessionValid():', window.ADLNSecurity.isSessionValid());
        
        // Teste 3: Verificar se está bloqueado
        console.log('\nTeste 3 - Status de bloqueio:');
        console.log('ADLNSecurity.isBlocked():', window.ADLNSecurity.isBlocked());
        
        // Teste 4: Simular tentativas de login
        console.log('\nTeste 4 - Simulando tentativas de login:');
        for (let i = 1; i <= 4; i++) {
            window.ADLNSecurity.recordLoginAttempt(false);
            console.log(`Tentativa ${i}: Bloqueado = ${window.ADLNSecurity.isBlocked()}`);
        }
        
        // Teste 5: Reset com login bem-sucedido
        console.log('\nTeste 5 - Reset com login bem-sucedido:');
        window.ADLNSecurity.recordLoginAttempt(true);
        console.log('Bloqueado após reset:', window.ADLNSecurity.isBlocked());
    }

    // Função para testar proteção de páginas
    function testPageProtection() {
        console.log('\n📄 Testando proteção de páginas...');
        
        if (!window.ADLNSecurity) {
            console.log('❌ Módulo de segurança não encontrado');
            return;
        }
        
        // Simular estar em página protegida
        const originalPathname = window.location.pathname;
        Object.defineProperty(window.location, 'pathname', {
            value: '/dashboard.html',
            writable: true
        });
        
        console.log('Simulando acesso a página protegida...');
        console.log('ADLNSecurity.performCheck():', window.ADLNSecurity.performCheck());
        
        // Restaurar pathname original
        Object.defineProperty(window.location, 'pathname', {
            value: originalPathname,
            writable: true
        });
    }

    // Função para testar monitoramento de atividade
    function testActivityMonitoring() {
        console.log('\n🖱️ Testando monitoramento de atividade...');
        
        if (!window.ADLNSecurity) {
            console.log('❌ Módulo de segurança não encontrado');
            return;
        }
        
        console.log('Simulando atividade do usuário...');
        window.ADLNSecurity.updateActivity();
        console.log('Atividade registrada');
        
        // Verificar se o monitoramento está ativo
        console.log('Monitoramento ativo:', window.ADLNSecurity.securityCheckInterval !== null);
    }

    // Função para testar logout
    function testLogout() {
        console.log('\n🚪 Testando logout...');
        
        if (window.ADLNAuth && window.ADLNAuth.logout) {
            console.log('Executando logout...');
            // Não executar realmente para não redirecionar
            console.log('Logout simulado - função disponível');
        } else {
            console.log('❌ Função de logout não encontrada');
        }
    }

    // Função para limpar dados de teste
    function cleanupTestData() {
        console.log('\n🧹 Limpando dados de teste...');
        localStorage.removeItem('adln_usuarios');
        localStorage.removeItem('adln_usuario_atual');
        localStorage.removeItem('adln_session_start');
        localStorage.removeItem('adln_last_activity');
        console.log('✅ Dados de teste removidos');
    }

    // Função principal de teste
    function runAllTests() {
        console.log('🚀 Iniciando suite de testes completa...\n');
        
        try {
            // Preparar dados de teste
            createTestData();
            
            // Executar testes
            testAuthentication();
            testSecurityModule();
            testPageProtection();
            testActivityMonitoring();
            testLogout();
            
            console.log('\n✅ Todos os testes concluídos!');
            
        } catch (error) {
            console.error('❌ Erro durante os testes:', error);
        } finally {
            // Limpar dados de teste
            cleanupTestData();
        }
    }

    // Função para mostrar status atual
    function showCurrentStatus() {
        console.log('\n📊 Status atual do sistema:');
        console.log('URL atual:', window.location.href);
        console.log('Módulo ADLNAuth disponível:', !!window.ADLNAuth);
        console.log('Módulo ADLNSecurity disponível:', !!window.ADLNSecurity);
        
        if (window.ADLNAuth) {
            console.log('Usuário logado:', window.ADLNAuth.isLoggedIn());
        }
        
        if (window.ADLNSecurity) {
            console.log('Autenticado:', window.ADLNSecurity.isAuthenticated());
            console.log('Sessão válida:', window.ADLNSecurity.isSessionValid());
            console.log('Bloqueado:', window.ADLNSecurity.isBlocked());
        }
    }

    // Expor funções globalmente para uso no console
    window.SecurityTest = {
        runAllTests: runAllTests,
        showStatus: showCurrentStatus,
        testAuth: testAuthentication,
        testSecurity: testSecurityModule,
        testPages: testPageProtection,
        testActivity: testActivityMonitoring,
        testLogout: testLogout,
        cleanup: cleanupTestData
    };

    // Executar status inicial
    showCurrentStatus();
    
    console.log('\n🔧 Funções de teste disponíveis:');
    console.log('- SecurityTest.runAllTests() - Executar todos os testes');
    console.log('- SecurityTest.showStatus() - Mostrar status atual');
    console.log('- SecurityTest.testAuth() - Testar autenticação');
    console.log('- SecurityTest.testSecurity() - Testar módulo de segurança');
    console.log('- SecurityTest.testPages() - Testar proteção de páginas');
    console.log('- SecurityTest.testActivity() - Testar monitoramento');
    console.log('- SecurityTest.testLogout() - Testar logout');
    console.log('- SecurityTest.cleanup() - Limpar dados de teste');

})();
