// Landing Page JavaScript - Versão Simplificada e Robusta
console.log('Carregando landing.js...');

// Aguardar o DOM estar completamente carregado
document.addEventListener("DOMContentLoaded", function() {
    // Limpar dados de teste antigos do localStorage
    let usuariosExistentes = JSON.parse(localStorage.getItem("adln_usuarios")) || {};
    if (usuariosExistentes["442.442.442-42"]) {
        delete usuariosExistentes["442.442.442-42"];
        localStorage.setItem("adln_usuarios", JSON.stringify(usuariosExistentes));
        console.log("Usuário de teste 442.442.442-42 removido do localStorage (landing.js).");
    }

    console.log("DOM carregado, inicializando modais...");
    
    // Elementos dos modais
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const welcomeModal = document.getElementById('welcomeModal');
    
    // Botões que abrem os modais
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnLoginHero = document.getElementById('btn-login-hero');
    const btnRegisterHero = document.getElementById('btn-register-hero');
    
    // Botões de fechar
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeRegisterModal = document.getElementById('close-register-modal');
    const closeWelcomeModal = document.getElementById('close-welcome-modal');
    
    console.log('Elementos encontrados:', {
        loginModal: !!loginModal,
        registerModal: !!registerModal,
        btnLogin: !!btnLogin,
        btnRegister: !!btnRegister
    });
    
    // Função para abrir modal
    function openModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.zIndex = '9999';
            modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            console.log('Modal aberto:', modal.id);
        }
    }
    
    // Função para fechar modal
    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            console.log('Modal fechado:', modal.id);
        }
    }
    
    // Event listeners para abrir modais
    if (btnLogin && loginModal) {
        btnLogin.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão login clicado');
            openModal(loginModal);
        });
        console.log('Event listener anexado ao botão login');
    }
    
    if (btnRegister && registerModal) {
        btnRegister.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão register clicado');
            openModal(registerModal);
        });
        console.log('Event listener anexado ao botão register');
    }
    
    if (btnLoginHero && loginModal) {
        btnLoginHero.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão login hero clicado');
            openModal(loginModal);
        });
    }
    
    if (btnRegisterHero && registerModal) {
        btnRegisterHero.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão register hero clicado');
            openModal(registerModal);
        });
    }
    
    // Event listeners para fechar modais
    if (closeLoginModal && loginModal) {
        closeLoginModal.addEventListener('click', function() {
            closeModal(loginModal);
        });
    }
    
    if (closeRegisterModal && registerModal) {
        closeRegisterModal.addEventListener('click', function() {
            closeModal(registerModal);
        });
    }
    
    if (closeWelcomeModal && welcomeModal) {
        closeWelcomeModal.addEventListener('click', function() {
            closeModal(welcomeModal);
        });
    }
    
    // Fechar modal clicando fora
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            closeModal(loginModal);
        }
        if (event.target === registerModal) {
            closeModal(registerModal);
        }
        if (event.target === welcomeModal) {
            closeModal(welcomeModal);
        }
    });
    
    // Formatação de CPF
    function formatCPF(value) {
        value = value.replace(/\D/g, "");
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }
        return value;
    }
    
    // Formatação de telefone
    function formatPhone(value) {
        value = value.replace(/\D/g, "");
        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value.replace(/(\d{1,2})/, "($1");
            } else if (value.length <= 7) {
                value = value.replace(/(\d{2})(\d{1,5})/, "($1) $2");
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
            }
        }
        return value;
    }
    
    // Validação de CPF
    function validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }
    
    // Função para filtrar apenas letras e espaços no campo nome
    function filtrarApenasLetras(input) {
        // Remove qualquer caractere que não seja letra (incluindo acentos) ou espaço
        var valor = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
        input.value = valor;
    }

    // Aplicar formatação aos campos
    const loginCpfField = document.getElementById("loginCpf");
    const registerCpfField = document.getElementById("registerCpf");
    const registerPhoneField = document.getElementById("registerPhone");
    const registerNameField = document.getElementById("registerName");

    if (loginCpfField) {
        loginCpfField.addEventListener("input", function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    }

    if (registerCpfField) {
        registerCpfField.addEventListener("input", function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    }

    if (registerPhoneField) {
        registerPhoneField.addEventListener("input", function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }

    if (registerNameField) {
        registerNameField.addEventListener("input", function(e) {
            filtrarApenasLetras(e.target);
        });
    }

    // Lógica de login - usando as mesmas funções do sistema.js
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cpf = document.getElementById('loginCpf').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!cpf || !password) {
                alert('Preencha todos os campos');
                return;
            }
            
            // Carregar dados usando a mesma estrutura do sistema.js
            const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
            
            // Verificar usuário
            if (!usuarios[cpf]) {
                alert('Usuário não encontrado. Cadastre-se para continuar.');
                return;
            }
            
            if (usuarios[cpf].senha !== password) {
                alert('CPF ou senha incorretos. Tente novamente.');
                return;
            }
            
            // Login bem-sucedido - usar a mesma estrutura do sistema.js
            localStorage.setItem('adln_usuario_atual', cpf);
            
            closeModal(loginModal);
            
            // Redirecionar diretamente para o dashboard (sem popup de boas-vindas)
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        });
    }
    
    // Lógica de cadastro - usando as mesmas funções do sistema.js
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value.trim();
            const cpf = document.getElementById('registerCpf').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const phone = document.getElementById('registerPhone').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validações usando as mesmas regras do sistema.js
            if (!name || name.length < 3 || !/^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*$/.test(name)) {
                alert('O nome deve conter apenas letras e no mínimo 3 caracteres.');
                return;
            }
            
            if (!validateCPF(cpf)) {
                alert('CPF inválido. Digite novamente no formato 000.000.000-00.');
                return;
            }
            
            if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/.test(email)) {
                alert('Digite um e-mail válido.');
                return;
            }
            
            if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
                alert('Senha deve ter 8+ caracteres, 1 maiúscula e 1 número');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Senhas não coincidem');
                return;
            }
            
            // Carregar dados usando a mesma estrutura do sistema.js
            const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
            
            // Verificar duplicatas
            if (usuarios[cpf]) {
                alert('CPF já cadastrado. Por favor, utilize outro CPF ou faça login.');
                return;
            }
            
            for (var userCpf in usuarios) {
                if (usuarios[userCpf].email === email) {
                    alert('E-mail já cadastrado. Por favor, utilize outro e-mail.');
                    return;
                }
            }
            
            // Criar usuário usando a mesma estrutura do sistema.js
            usuarios[cpf] = {
                nome: name,
                cpf: cpf,
                email: email,
                celular: phone,
                senha: password,
                saldo: 100000,
                dataCadastro: new Date().toISOString()
            };
            
            // Salvar dados
            localStorage.setItem('adln_usuarios', JSON.stringify(usuarios));
            localStorage.setItem('adln_usuario_atual', cpf);
            
            closeModal(registerModal);
            
            // Redirecionar diretamente para o dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        });
    }
    
    console.log('Modais inicializados com sucesso');
});

console.log('landing.js carregado completamente');

