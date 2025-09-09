// Landing Page JavaScript - Versão Simplificada e Robusta
console.log('Carregando landing.js...');

// Dados dos indicadores de mercado
const marketData = {
    ibov: { value: 127450, change: 1.2, baseValue: 127450 },
    usd: { value: 4.85, change: -0.3, baseValue: 4.85 },
    eur: { value: 5.32, change: 0.1, baseValue: 5.32 },
    selic: { value: 13.75, change: 0.0, baseValue: 13.75 },
    ipca: { value: 4.62, change: -0.1, baseValue: 4.62 },
    petr4: { value: 30.47, change: 0.59, baseValue: 30.47 },
    vale3: { value: 68.92, change: -1.23, baseValue: 68.92 },
    itub4: { value: 32.15, change: 0.87, baseValue: 32.15 },
    bbas3: { value: 20.50, change: 4.11, baseValue: 20.50 },
    b3sa3: { value: 12.34, change: -0.45, baseValue: 12.34 }
};

// Função para atualizar indicadores de mercado
function updateMarketIndicators() {
    Object.keys(marketData).forEach(indicator => {
        const data = marketData[indicator];
        
        // Simular variação realista
        const variation = (Math.random() - 0.5) * 0.2; // ±0.1%
        data.change += variation;
        
        // Calcular novo valor baseado na variação
        const changePercent = data.change / 100;
        data.value = data.baseValue * (1 + changePercent);
        
        // Atualizar elementos na tela
        const valueElement = document.getElementById(`${indicator}-value`);
        const changeElement = document.getElementById(`${indicator}-change`);
        const itemElement = document.querySelector(`[data-indicator="${indicator}"]`);
        
        if (valueElement && changeElement && itemElement) {
            // Adicionar classe de animação
            itemElement.classList.add('updating');
            changeElement.classList.add('updating');
            
            // Formatar valores
            let formattedValue, formattedChange;
            
            switch(indicator) {
                case 'ibov':
                    formattedValue = Math.round(data.value).toLocaleString('pt-BR');
                    break;
                case 'usd':
                case 'eur':
                    formattedValue = `R$ ${data.value.toFixed(2).replace('.', ',')}`;
                    break;
                case 'selic':
                case 'ipca':
                    formattedValue = `${data.value.toFixed(2).replace('.', ',')}%`;
                    break;
                default:
                    formattedValue = data.value.toFixed(2);
            }
            
            formattedChange = `${data.change >= 0 ? '+' : ''}${data.change.toFixed(1).replace('.', ',')}%`;
            
            // Atualizar com animação
            setTimeout(() => {
                valueElement.textContent = formattedValue;
                changeElement.textContent = formattedChange;
                
                // Atualizar classes de cor
                changeElement.className = `indicator-change ${data.change > 0 ? 'positive' : data.change < 0 ? 'negative' : 'neutral'}`;
                
                // Remover classes de animação
                setTimeout(() => {
                    itemElement.classList.remove('updating');
                    changeElement.classList.remove('updating');
                }, 400);
            }, 200);
        }
    });
}

// Aguardar o DOM estar completamente carregado
document.addEventListener("DOMContentLoaded", function() {
        console.log("DOM carregado, inicializando modais...");
    
    // Elementos dos modais
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const welcomeModal = document.getElementById('welcomeModal');
    
    // Botões que abrem os modais
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnLoginHero = document.getElementById('btn-login-hero');
    const btnRegisterHero = document.getElementById('btn-register-hero');
    
    // Botões de fechar
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeRegisterModal = document.getElementById('close-register-modal');
    const closeForgotPasswordModal = document.getElementById('close-forgot-password-modal');
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
    
    // Função para limpar mensagem específica
    function hideInlineMessage(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
            element.textContent = '';
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
    
    if (closeForgotPasswordModal && forgotPasswordModal) {
        closeForgotPasswordModal.addEventListener('click', function() {
            closeModal(forgotPasswordModal);
        });
    }
    
    if (closeWelcomeModal && welcomeModal) {
        closeWelcomeModal.addEventListener('click', function() {
            closeModal(welcomeModal);
        });
    }
    
    // Função para abrir modal de esqueci senha
    function openForgotPasswordModal() {
        // Fecha o modal de login
        closeModal(loginModal);
        // Abre o modal de recuperação de senha
        openModal(forgotPasswordModal);
    }
    
    // Função para abrir modal de cadastro
    function openRegisterModal() {
        closeModal(loginModal);
        setTimeout(() => {
            openModal(registerModal);
        }, 100);
    }
    
    // Função para voltar ao modal de login
    function openLoginModal() {
        closeModal(forgotPasswordModal);
        setTimeout(() => {
            openModal(loginModal);
        }, 100);
    }
    
    // Expor funções globalmente
    window.openForgotPasswordModal = openForgotPasswordModal;
    window.openRegisterModal = openRegisterModal;
    window.openLoginModal = openLoginModal;
    
    // Fechar modal clicando fora
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            closeModal(loginModal);
        }
        if (event.target === registerModal) {
            closeModal(registerModal);
        }
        if (event.target === forgotPasswordModal) {
            closeModal(forgotPasswordModal);
        }
        if (event.target === welcomeModal) {
            closeModal(welcomeModal);
        }
    });
    
    // Função para alternar visibilidade da senha
    function togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            if (input.type === 'password') {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        }
    }
    
    // Função para validar senha em tempo real
    function validatePasswordRealTime() {
        const newPassword = document.getElementById('forgot-new-password');
        const confirmPassword = document.getElementById('forgot-confirm-password');
        const submitButton = document.querySelector('#forgotPasswordForm .btn-primary');
        const messageDiv = document.getElementById('forgot-password-message');
        
        if (!newPassword || !confirmPassword || !submitButton) return;
        
        const password = newPassword.value;
        const confirm = confirmPassword.value;
        
        // Validar força da senha
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        // Validar se as senhas coincidem
        const passwordsMatch = password === confirm && password.length > 0;
        
        // Habilitar/desabilitar botão
        const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && passwordsMatch;
        submitButton.disabled = !isValid;
        
        // Só mostrar mensagens de senha se não há validação de identificador ativa
        const identifier = document.getElementById('forgot-identifier').value;
        if (identifier.trim() && messageDiv) {
            // Se há identificador, verificar se é válido antes de mostrar mensagens de senha
            const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
            const cpfLimpo = identifier.replace(/\D/g, '');
            let identifierValid = false;
            
            if (cpfLimpo.length === 11) {
                // Procurar CPF tanto formatado quanto sem formatação
                let cpfFormatado = formatCPF(cpfLimpo);
                if (usuarios[cpfFormatado] || usuarios[cpfLimpo]) {
                    identifierValid = true;
                }
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(identifier)) {
                    for (const cpf in usuarios) {
                        if (usuarios[cpf].email === identifier) {
                            identifierValid = true;
                            break;
                        }
                    }
                }
            }
            
            // Só mostrar mensagens de senha se o identificador for válido
            if (identifierValid) {
                if (password.length > 0) {
                    let errorMessage = '';
                    
                    if (!hasMinLength) errorMessage += '• Mínimo 8 caracteres\n';
                    if (!hasUpperCase) errorMessage += '• Pelo menos 1 letra maiúscula\n';
                    if (!hasLowerCase) errorMessage += '• Pelo menos 1 letra minúscula\n';
                    if (!hasNumber) errorMessage += '• Pelo menos 1 número\n';
                    
                    if (errorMessage) {
                        messageDiv.textContent = errorMessage.trim();
                        messageDiv.className = 'feedback-message error';
                    }
                }
                
                if (confirm.length > 0 && !passwordsMatch) {
                    messageDiv.textContent = 'As senhas não coincidem';
                    messageDiv.className = 'feedback-message error';
                }
                
                if (isValid) {
                    messageDiv.textContent = '✓ Senha válida!';
                    messageDiv.className = 'feedback-message success';
                }
            }
        }
    }
    
    // Função para processar alteração de senha
    function changePassword(event) {
        event.preventDefault();
        
        const identifier = document.getElementById('forgot-identifier').value;
        const newPassword = document.getElementById('forgot-new-password').value;
        const confirmPassword = document.getElementById('forgot-confirm-password').value;
        const messageDiv = document.getElementById('forgot-password-message');
        
        // Validações
        if (!identifier.trim()) {
            if (messageDiv) {
                messageDiv.textContent = 'CPF ou e-mail é obrigatório';
                messageDiv.className = 'feedback-message error';
            }
            return;
        }
        
        if (newPassword !== confirmPassword) {
            if (messageDiv) {
                messageDiv.textContent = 'As senhas não coincidem';
                messageDiv.className = 'feedback-message error';
            }
            return;
        }
        
        // Verificar se o CPF está cadastrado no localStorage
        const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
        const cpfLimpo = identifier.replace(/\D/g, ''); // Remove formatação do CPF
        
        // Verificar se é um CPF válido (11 dígitos) e se está cadastrado
        if (cpfLimpo.length === 11) {
            // Procurar CPF tanto formatado quanto sem formatação
            let cpfEncontrado = false;
            let cpfFormatado = formatCPF(cpfLimpo);
            
            // Verificar se existe com formatação (como está salvo no localStorage)
            if (usuarios[cpfFormatado]) {
                cpfEncontrado = true;
            }
            // Verificar se existe sem formatação (fallback)
            else if (usuarios[cpfLimpo]) {
                cpfEncontrado = true;
            }
            
            if (!cpfEncontrado) {
                if (messageDiv) {
                    messageDiv.textContent = 'CPF não encontrado. Verifique se está cadastrado no sistema.';
                    messageDiv.className = 'feedback-message error';
                }
                return;
            }
        } else {
            // Se não é CPF, verificar se é e-mail válido
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(identifier)) {
                if (messageDiv) {
                    messageDiv.textContent = 'Por favor, digite um CPF válido (11 dígitos) ou um e-mail válido.';
                    messageDiv.className = 'feedback-message error';
                }
                return;
            }
            
            // Verificar se o e-mail está cadastrado
            let emailEncontrado = false;
            for (const cpf in usuarios) {
                if (usuarios[cpf].email === identifier) {
                    emailEncontrado = true;
                    break;
                }
            }
            
            if (!emailEncontrado) {
                if (messageDiv) {
                    messageDiv.textContent = 'E-mail não encontrado. Verifique se está cadastrado no sistema.';
                    messageDiv.className = 'feedback-message error';
                }
                return;
            }
        }
        
        // Simular processamento
        if (messageDiv) {
            messageDiv.textContent = 'Processando recuperação de senha...';
            messageDiv.className = 'feedback-message';
        }
        
        // Simular sucesso após 2 segundos
        setTimeout(() => {
            if (messageDiv) {
                messageDiv.textContent = 'Senha alterada com sucesso! Redirecionando para o login...';
                messageDiv.className = 'feedback-message success';
            }
            
            // Limpar formulário e voltar ao login após 3 segundos
            setTimeout(() => {
                document.getElementById('forgotPasswordForm').reset();
                closeModal(forgotPasswordModal);
                openModal(loginModal);
            }, 3000);
        }, 2000);
    }
    
    // Função de debug para verificar localStorage
    function debugLocalStorage() {
        const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
        console.log('Usuários no localStorage:', usuarios);
        console.log('Chaves (CPFs):', Object.keys(usuarios));
        return usuarios;
    }
    
    // Expor funções globalmente
    window.togglePasswordVisibility = togglePasswordVisibility;
    window.validatePasswordRealTime = validatePasswordRealTime;
    window.changePassword = changePassword;
    window.debugLocalStorage = debugLocalStorage;
    
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
    
    // Função para validar campo de nome em tempo real
    function validateNameField(field, errorElementId) {
        const nome = field.value.trim().replace(/\s+/g, ' ');
        
        if (nome.length === 0) {
            // Campo vazio - não mostrar erro ainda
            hideInlineMessage(errorElementId);
            return;
        }
        
        if (nome.length < 2) {
            showInlineMessage(errorElementId, 'O nome deve conter apenas letras e no mínimo 2 caracteres.');
            return;
        }
        
        if (!/^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*$/.test(nome)) {
            showInlineMessage(errorElementId, 'O nome deve conter apenas letras e no mínimo 2 caracteres.');
            return;
        }
        
        // Nome válido - limpar erro
        hideInlineMessage(errorElementId);
    }
    
    // Função para validar campo de sobrenome em tempo real
    function validateSurnameField(field, errorElementId) {
        const sobrenome = field.value.trim().replace(/\s+/g, ' ');
        
        if (sobrenome.length === 0) {
            // Campo vazio - não mostrar erro (sobrenome é opcional)
            hideInlineMessage(errorElementId);
            return;
        }
        
        if (sobrenome.length < 2) {
            showInlineMessage(errorElementId, 'O sobrenome deve conter apenas letras e no mínimo 2 caracteres.');
            return;
        }
        
        if (!/^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*$/.test(sobrenome)) {
            showInlineMessage(errorElementId, 'O sobrenome deve conter apenas letras e no mínimo 2 caracteres.');
            return;
        }
        
        // Sobrenome válido - limpar erro
        hideInlineMessage(errorElementId);
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
    
    // Formatação de CPF para recuperação de senha (campo aceita CPF ou e-mail)
    const forgotIdentifierField = document.getElementById("forgot-identifier");
    if (forgotIdentifierField) {
        forgotIdentifierField.addEventListener("input", function(e) {
            // Se contém apenas números, aplicar formatação de CPF
            if (/^\d+$/.test(e.target.value.replace(/\D/g, ''))) {
                e.target.value = formatCPF(e.target.value);
            }
            
            // Validar se está cadastrado em tempo real
            validateIdentifierInRealTime(e.target.value);
        });
    }
    
    // Função para validar identificador em tempo real
    function validateIdentifierInRealTime(identifier) {
        const messageDiv = document.getElementById('forgot-password-message');
        if (!messageDiv || !identifier.trim()) {
            if (messageDiv) {
                messageDiv.textContent = '';
                messageDiv.className = 'feedback-message';
            }
            return;
        }
        
        const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
        const cpfLimpo = identifier.replace(/\D/g, '');
        
        // Verificar se é CPF
        if (cpfLimpo.length === 11) {
            // Procurar CPF tanto formatado quanto sem formatação
            let cpfEncontrado = false;
            let cpfFormatado = formatCPF(cpfLimpo);
            
            // Debug: mostrar o que está sendo procurado
            console.log('Procurando CPF:', {
                original: identifier,
                limpo: cpfLimpo,
                formatado: cpfFormatado,
                chavesDisponiveis: Object.keys(usuarios)
            });
            
            // Verificar se existe com formatação (como está salvo no localStorage)
            if (usuarios[cpfFormatado]) {
                cpfEncontrado = true;
                console.log('CPF encontrado com formatação:', cpfFormatado);
            }
            // Verificar se existe sem formatação (fallback)
            else if (usuarios[cpfLimpo]) {
                cpfEncontrado = true;
                console.log('CPF encontrado sem formatação:', cpfLimpo);
            }
            
            if (cpfEncontrado) {
                messageDiv.textContent = '✓ CPF encontrado no sistema';
                messageDiv.className = 'feedback-message success';
            } else {
                messageDiv.textContent = '⚠ CPF não encontrado no sistema';
                messageDiv.className = 'feedback-message error';
            }
        } else {
            // Verificar se é e-mail válido
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(identifier)) {
                let emailEncontrado = false;
                for (const cpf in usuarios) {
                    if (usuarios[cpf].email === identifier) {
                        emailEncontrado = true;
                        break;
                    }
                }
                
                if (emailEncontrado) {
                    messageDiv.textContent = '✓ E-mail encontrado no sistema';
                    messageDiv.className = 'feedback-message success';
                } else {
                    messageDiv.textContent = '⚠ E-mail não encontrado no sistema';
                    messageDiv.className = 'feedback-message error';
                }
            } else {
                messageDiv.textContent = 'Digite um CPF válido (11 dígitos) ou e-mail válido';
                messageDiv.className = 'feedback-message error';
            }
        }
    }

    if (registerPhoneField) {
        registerPhoneField.addEventListener("input", function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }

    if (registerNameField) {
        registerNameField.addEventListener("input", function(e) {
            filtrarApenasLetras(e.target);
            // Validação em tempo real
            validateNameField(e.target, 'registerNameError');
        });
        
        registerNameField.addEventListener("blur", function(e) {
            validateNameField(e.target, 'registerNameError');
        });
    }

    if (registerSurnameField) {
        registerSurnameField.addEventListener("input", function(e) {
            filtrarApenasLetras(e.target);
            // Validação em tempo real
            validateSurnameField(e.target, 'registerSurnameError');
        });
        
        registerSurnameField.addEventListener("blur", function(e) {
            validateSurnameField(e.target, 'registerSurnameError');
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
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage("loginGeneralError", "CPF ou senha incorretos. Tente novamente.");
                return;
            }
            
            // Login bem-sucedido - usar a mesma estrutura do sistema.js
            localStorage.setItem('adln_usuario_atual', cpf);
            
            // Remover flag de logout para permitir acesso ao dashboard
            localStorage.removeItem('adln_logout_performed');
            
            // Tocar som de sucesso
            if (typeof playSuccessSound === 'function') {
                playSuccessSound();
            }
            
            showInlineMessage('loginGeneralError', 'Login realizado com sucesso! Redirecionando...', 'success');
            
            setTimeout(() => {
                closeModal(loginModal);
                window.location.replace('dashboard.html');
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
            // Remover espaços extras e verificar se contém apenas letras e espaços (incluindo acentuação)
            const nomeLimpo = name.trim().replace(/\s+/g, ' ');
            
            if (!nomeLimpo || nomeLimpo.length < 2 || !/^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*$/.test(nomeLimpo)) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerNameError', 'O nome deve conter apenas letras e no mínimo 2 caracteres.');
                return;
            }
            
            // Validação do sobrenome (não obrigatório, mas se preenchido deve ser válido)
            if (surname) {
                const sobrenomeLimpo = surname.trim().replace(/\s+/g, ' ');
                if (sobrenomeLimpo.length < 2 || !/^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*$/.test(sobrenomeLimpo)) {
                    // Tocar som de erro
                    if (typeof playErrorSound === 'function') {
                        playErrorSound();
                    }
                    showInlineMessage('registerSurnameError', 'O sobrenome deve conter apenas letras e no mínimo 2 caracteres.');
                    return;
                }
            }
            
            if (!validateCPF(cpf)) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerCpfError', 'CPF inválido. Digite novamente no formato 000.000.000-00.');
                return;
            }
            
            // Validação robusta de email
            if (!email) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerEmailError', 'Digite um endereço de e-mail.');
                return;
            }
            
            // Verificar se contém @
            if (!email.includes('@')) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerEmailError', 'Por favor, insira um endereço de e-mail válido.');
                return;
            }
            
            // Verificar formato básico
            const basicRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
            if (!basicRegex.test(email)) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerEmailError', 'O domínio do e-mail é inválido. Por favor, insira um endereço de e-mail correto.');
                return;
            }
            
            // Extrair e validar TLD
            const domain = email.split('@')[1];
            const tld = domain.split('.').pop();
            
            // Verificar se o TLD tem apenas letras
            if (!/^[a-zA-Z]{2,10}$/.test(tld)) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerEmailError', 'O domínio do e-mail é inválido. Por favor, insira um endereço de e-mail correto.');
                return;
            }
            
            // Lista de TLDs válidos
            const validTLDs = [
                'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
                'br', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'es', 'it', 'pt',
                'jp', 'cn', 'in', 'ru', 'kr', 'mx', 'ar', 'cl', 'co', 'pe',
                'io', 'ai', 'app', 'dev', 'tech', 'online', 'digital', 'cloud'
            ];
            
            if (!validTLDs.includes(tld.toLowerCase())) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerEmailError', 'O domínio do e-mail é inválido. Por favor, insira um endereço de e-mail correto.');
                return;
            }
            
            if (!validatePhone(phone)) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerPhoneError', 'Digite um telefone válido no formato (xx) xxxxx-xxxx.');
                return;
            }
            
            if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerPasswordError', 'Senha deve ter 8+ caracteres, 1 maiúscula e 1 número');
                return;
            }
            
            if (password !== confirmPassword) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerConfirmPasswordError', 'Senhas não coincidem');
                return;
            }
            
            // Carregar dados usando a mesma estrutura do sistema.js
            const usuarios = JSON.parse(localStorage.getItem('adln_usuarios')) || {};
            
            // Verificar duplicatas
            if (usuarios[cpf]) {
                // Tocar som de erro
                if (typeof playErrorSound === 'function') {
                    playErrorSound();
                }
                showInlineMessage('registerCpfError', 'CPF já cadastrado. Por favor, utilize outro CPF ou faça login.');
                return;
            }
            
            for (var userCpf in usuarios) {
                if (usuarios[userCpf].email === email) {
                    // Tocar som de erro
                    if (typeof playErrorSound === 'function') {
                        playErrorSound();
                    }
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
            
            // Tocar som de sucesso
            if (typeof playSuccessSound === 'function') {
                playSuccessSound();
            }
            
            // Mostrar modal de boas-vindas
            const welcomeUserNameEl = document.getElementById('welcomeUserName');
            if (welcomeUserNameEl) {
                var nomeCompleto = name;
                if (surname && surname.trim() !== '') {
                    nomeCompleto += ' ' + surname;
                }
                welcomeUserNameEl.textContent = nomeCompleto;
            }
            
            // Fechar modal de cadastro e abrir modal de boas-vindas
            closeModal(registerModal);
            openModal(welcomeModal);
            
            // Após 3 segundos, fechar modal de boas-vindas e abrir login
            setTimeout(() => {
                closeModal(welcomeModal);
                openModal(loginModal);
                // Pré-preencher o CPF no modal de login
                const loginCpfField = document.getElementById('loginCpf');
                if (loginCpfField) {
                    loginCpfField.value = cpf;
                }
                // Mostrar mensagem de sucesso no modal de login
                showInlineMessage('loginGeneralError', 'Cadastro realizado! Agora faça seu primeiro login.', 'success');
            }, 3000);
        });
    }
    
    console.log('Modais inicializados com sucesso');
});

// Inicializar indicadores de mercado
console.log('Inicializando indicadores de mercado...');

// Atualizar indicadores a cada 5 segundos
setInterval(updateMarketIndicators, 5000);

// Atualizar indicadores a cada 30 segundos com variações maiores
setInterval(() => {
    Object.keys(marketData).forEach(indicator => {
        const data = marketData[indicator];
        // Variação maior a cada 30 segundos
        const variation = (Math.random() - 0.5) * 0.5; // ±0.25%
        data.change += variation;
    });
    updateMarketIndicators();
}, 30000);

// Event listeners para os indicadores (clique para atualizar manualmente)
document.querySelectorAll('.indicator-item').forEach(item => {
    item.addEventListener('click', function() {
        const indicator = this.getAttribute('data-indicator');
        if (indicator && marketData[indicator]) {
            // Variação manual ao clicar
            const data = marketData[indicator];
            const variation = (Math.random() - 0.5) * 0.3; // ±0.15%
            data.change += variation;
            updateMarketIndicators();
        }
    });
});

// Funcionalidade das abas do mercado
const marketTabs = document.querySelectorAll('.market-tabs .tab');
const marketLists = document.querySelectorAll('.market-list');

marketTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        
        // Remover classe active de todas as abas
        marketTabs.forEach(t => t.classList.remove('active'));
        marketLists.forEach(list => list.classList.remove('active'));
        
        // Adicionar classe active na aba clicada
        this.classList.add('active');
        
        // Mostrar lista correspondente
        const targetList = document.getElementById(targetTab);
        if (targetList) {
            targetList.classList.add('active');
            
            // Garantir que todos os ícones sejam visíveis
            const assetIcons = targetList.querySelectorAll('.asset-icon img');
            assetIcons.forEach(img => {
                if (img.complete) {
                    img.style.display = 'block';
                } else {
                    img.addEventListener('load', function() {
                        this.style.display = 'block';
                    });
                    img.addEventListener('error', function() {
                        // Fallback para ícones que falharam ao carregar
                        this.style.display = 'none';
                        const fallbackText = this.alt || '?';
                        const iconContainer = this.parentElement;
                        iconContainer.setAttribute('data-fallback', fallbackText);
                    });
                }
            });
        }
    });
});

// Função para inicializar ícones quando a página carrega
function initializeAssetIcons() {
    const allAssetIcons = document.querySelectorAll('.asset-icon img');
    allAssetIcons.forEach(img => {
        if (img.complete) {
            img.style.display = 'block';
        } else {
            img.addEventListener('load', function() {
                this.style.display = 'block';
            });
            img.addEventListener('error', function() {
                // Fallback para ícones que falharam ao carregar
                this.style.display = 'none';
                const fallbackText = this.alt || '?';
                const iconContainer = this.parentElement;
                iconContainer.setAttribute('data-fallback', fallbackText);
            });
        }
    });
}

// Inicializar ícones quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que as imagens tenham tempo de carregar
    setTimeout(initializeAssetIcons, 100);
    
    // Também inicializar quando a janela terminar de carregar
    window.addEventListener('load', initializeAssetIcons);
});

console.log('landing.js carregado completamente');

