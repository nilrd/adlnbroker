// Landing Page JavaScript - Versão Simplificada e Robusta
console.log('Carregando landing.js...');

// Aguardar o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando modais...');
    
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
    
    // Aplicar formatação aos campos
    const loginCpfField = document.getElementById('loginCpf');
    const registerCpfField = document.getElementById('registerCpf');
    const registerPhoneField = document.getElementById('registerPhone');
    
    if (loginCpfField) {
        loginCpfField.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    }
    
    if (registerCpfField) {
        registerCpfField.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    }
    
    if (registerPhoneField) {
        registerPhoneField.addEventListener('input', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }
    
    // Lógica de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cpf = document.getElementById('loginCpf').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!validateCPF(cpf)) {
                alert('CPF inválido');
                return;
            }
            
            if (!password) {
                alert('Senha é obrigatória');
                return;
            }
            
            // Verificar usuário no localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.cpf === cpf && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                closeModal(loginModal);
                
                // Mostrar modal de boas-vindas
                if (welcomeModal) {
                    const welcomeUserName = document.getElementById('welcomeUserName');
                    if (welcomeUserName) {
                        welcomeUserName.textContent = user.name.split(' ')[0];
                    }
                    openModal(welcomeModal);
                    
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 3000);
                }
            } else {
                alert('CPF ou senha incorretos');
            }
        });
    }
    
    // Lógica de cadastro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const cpf = document.getElementById('registerCpf').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validações básicas
            if (!name || name.length < 3) {
                alert('Nome deve ter pelo menos 3 caracteres');
                return;
            }
            
            if (!validateCPF(cpf)) {
                alert('CPF inválido');
                return;
            }
            
            if (!email || !email.includes('@')) {
                alert('E-mail inválido');
                return;
            }
            
            if (!password || password.length < 8) {
                alert('Senha deve ter pelo menos 8 caracteres');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('As senhas não coincidem');
                return;
            }
            
            // Verificar se usuário já existe
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.cpf === cpf)) {
                alert('CPF já cadastrado');
                return;
            }
            
            if (users.some(u => u.email === email)) {
                alert('E-mail já cadastrado');
                return;
            }
            
            // Criar novo usuário
            const newUser = {
                name: name,
                cpf: cpf,
                email: email,
                phone: phone,
                password: password,
                balance: 100000
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            closeModal(registerModal);
            
            // Mostrar modal de boas-vindas
            if (welcomeModal) {
                const welcomeUserName = document.getElementById('welcomeUserName');
                if (welcomeUserName) {
                    welcomeUserName.textContent = newUser.name.split(' ')[0];
                }
                openModal(welcomeModal);
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 3000);
            }
        });
    }
    
    console.log('Modais inicializados com sucesso');
});

console.log('landing.js carregado completamente');

