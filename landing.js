// Landing Page JavaScript - Versão Simplificada e Robusta
console.log('Carregando landing.js...');

// Aguardar o DOM estar completamente carregado
document.addEventListener("DOMContentLoaded", function() {
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
    
    // Função para mostrar mensagem inline
    function showInlineMessage(elementId, message, type = 'error') {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `error-message ${type}`;
            element.style.display = 'block';
            element.style.color = type === 'error' ? '#ff4757' : '#2ed573';
            element.style.fontSize = '14px';
            element.style.marginTop = '5px';
        }
    }
    
    // Função para limpar mensagens inline
    function clearInlineMessages(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const errorElements = form.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
                element.style.display = 'none';
            });
        }
    }
    
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
            
            // Limpar mensagens ao abrir modal
            if (modal.id === 'loginModal') {
                clearInlineMessages('loginForm');
            } else if (modal.id === 'registerModal') {
                clearInlineMessages('registerForm');
            }
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
    
    // Formatação de CPF melhorada
    function formatCPF(value) {
        // Remove tudo que não é dígito
        value = value.replace(/\D/g, "");
        
        // Limita a 11 dígitos
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        // Aplica a formatação
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
    
    // Validação de telefone
    function validatePhone(phone) {
        // Remove formatação para validar apenas números
        const cleanPhone = phone.replace(/\D/g, "");
        // Verifica se tem 10 ou 11 dígitos (formato brasileiro)
        return cleanPhone.length === 10 || cleanPhone.length === 11;
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
    const registerSurnameField = document.getElementById("registerSurname");

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

    if (registerSurnameField) {
        registerSurnameField.addEventListener("input", function(e) {
            filtrarApenasLetras(e.target);
        });
    }

    // Função para verificar força da senha
    function checkPasswordStrength(password) {
        let strength = 0;
        let feedback = [];
        
        if (password.length >= 8) strength++;
        else feedback.push("mínimo 8 caracteres");
        
        if (/[A-Z]/.test(password)) strength++;
        else feedback.push("1 letra maiúscula");
        
        if (/[a-z]/.test(password)) strength++;
        else feedback.push("1 letra minúscula");
        
        if (/\d/.test(password)) strength++;
        else feedback.push("1 número");
        
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        return { strength, feedback };
    }

    // Aplicar verificação de força da senha
    const passwordField = document.getElementById("registerPassword");
    const strengthFill = document.getElementById("strengthFill");
    const strengthText = document.getElementById("strengthText");
    const passwordStrengthDiv = document.querySelector(".password-strength");

    if (passwordField && strengthFill && strengthText) {
        passwordField.addEventListener("input", function(e) {
            const password = e.target.value;
            const { strength, feedback } = checkPasswordStrength(password);
            
            // Remover classes anteriores
            passwordStrengthDiv.classList.remove("strength-weak", "strength-medium", "strength-strong");
            
            if (password.length === 0) {
                strengthText.textContent = "Digite uma senha";
                strengthFill.style.width = "0%";
                strengthFill.style.backgroundColor = "#2A2D35";
            } else if (strength <= 2) {
                passwordStrengthDiv.classList.add("strength-weak");
                strengthText.textContent = `Fraca - Adicione: ${feedback.join(", ")}`;
            } else if (strength <= 3) {
                passwordStrengthDiv.classList.add("strength-medium");
                strengthText.textContent = `Média - Adicione: ${feedback.join(", ")}`;
            } else {
                passwordStrengthDiv.classList.add("strength-strong");
                strengthText.textContent = "Forte - Senha segura!";
            }
        });
    }

    // Lógica de login - usando validação específica de CPF
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Inicializar validação de CPF
        if (typeof initCPFValidation === 'function') {
            initCPFValidation();
        }
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Limpar mensagens anteriores
            clearInlineMessages('loginForm');
            if (typeof clearLoginErrors === 'function') {
                clearLoginErrors();
            }
            
            const cpf = document.getElementById('loginCpf').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            // Validação específica com mensagens detalhadas
            if (!validateLoginWithSpecificMessages(cpf, password, (message) => {
                showInlineMessage('loginCpfError', message);
            })) {
                return;
            }
            
            // Carregar dados usando a mesma estrutura do sistema.js
            const usuarios = JSON.parse(localStorage.getItem("adln_usuarios")) || {};
            
            // Verificar usuário e senha
            if (!usuarios[cpf] || usuarios[cpf].senha !== password) {
                showInlineMessage("loginGeneralError", "CPF ou senha incorretos. Tente novamente.");
                return;
            }
            
            // Login bem-sucedido - usar a mesma estrutura do sistema.js
            localStorage.setItem('adln_usuario_atual', cpf);
            
            showInlineMessage('loginGeneralError', 'Login realizado com sucesso! Redirecionando...', 'success');
            
            setTimeout(() => {
                closeModal(loginModal);
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
    
    // Lógica de cadastro - usando as mesmas funções do sistema.js
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Limpar mensagens anteriores
            clearInlineMessages('registerForm');
            
            const name = document.getElementById('registerName').value.trim();
            const surname = document.getElementById('registerSurname').value.trim();
            const cpf = document.getElementById('registerCpf').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const phone = document.getElementById('registerPhone').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validações usando as mesmas regras do sistema.js
            if (!name || name.length < 2 || !/^[A-Za-zÀ-ÿ]+$/.test(name)) {
                showInlineMessage('registerNameError', 'O nome deve conter apenas letras e no mínimo 2 caracteres.');
                return;
            }
            
            // Validação do sobrenome (não obrigatório, mas se preenchido deve ser válido)
            if (surname && (surname.length < 2 || !/^[A-Za-zÀ-ÿ\s]+$/.test(surname))) {
                showInlineMessage('registerSurnameError', 'O sobrenome deve conter apenas letras e no mínimo 2 caracteres.');
                return;
            }
            
            if (!validateCPF(cpf)) {
                showInlineMessage('registerCpfError', 'CPF inválido. Digite novamente no formato 000.000.000-00.');
                return;
            }
            
            if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/.test(email)) {
                showInlineMessage('registerEmailError', 'Digite um e-mail válido.');
                return;
            }
            
            if (!validatePhone(phone)) {
                showInlineMessage('registerPhoneError', 'Digite um telefone válido no formato (xx) xxxxx-xxxx.');
                return;
            }
            
            if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
                showInlineMessage('registerPasswordError', 'Senha deve ter 8+ caracteres, 1 maiúscula e 1 número');
                return;
            }
            
            if (password !== confirmPassword) {
                showInlineMessage('registerConfirmPasswordError', 'Senhas não coincidem');
                return;
            }
            
            // Carregar dados usando a mesma estrutura do sistema.js
            const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
            
            // Verificar duplicatas
            if (usuarios[cpf]) {
                showInlineMessage('registerCpfError', 'CPF já cadastrado. Por favor, utilize outro CPF ou faça login.');
                return;
            }
            
            for (var userCpf in usuarios) {
                if (usuarios[userCpf].email === email) {
                    showInlineMessage('registerEmailError', 'E-mail já cadastrado. Por favor, utilize outro e-mail.');
                    return;
                }
            }
            
            // Criar usuário usando a mesma estrutura do sistema.js
            usuarios[cpf] = {
                nome: name,
                sobrenome: surname || '',
                cpf: cpf,
                email: email,
                celular: phone,
                senha: password,
                saldo: 100000,
                dataCadastro: new Date().toISOString()
            };
            
            // Salvar dados
            localStorage.setItem('adln_usuarios', JSON.stringify(usuarios));
            
            showInlineMessage('registerGeneralError', 'Cadastro realizado com sucesso! Abrindo tela de login...', 'success');
            
            setTimeout(() => {
                closeModal(registerModal);
                // Abrir modal de login automaticamente
                openModal(loginModal);
                // Pré-preencher o CPF no modal de login
                const loginCpfField = document.getElementById('loginCpf');
                if (loginCpfField) {
                    loginCpfField.value = cpf;
                }
                // Mostrar mensagem de sucesso no modal de login
                showInlineMessage('loginGeneralError', 'Cadastro realizado! Agora faça seu primeiro login.', 'success');
            }, 1500);
        });
    }
    
    console.log('Modais inicializados com sucesso');
});

console.log('landing.js carregado completamente');

