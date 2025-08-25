// Validação de CPF com mensagens específicas
// Arquivo dedicado para validação de CPF no login

// Função para validar CPF com mensagens específicas
function validateCPFWithMessages(cpf, showErrorCallback) {
    // Remove formatação
    const cpfLimpo = cpf.replace(/\D/g, "");
    
    // Verifica se está vazio
    if (!cpf || cpf.trim() === "") {
        showErrorCallback("Digite seu CPF para continuar.");
        return false;
    }
    
    // Verifica se tem menos de 11 dígitos
    if (cpfLimpo.length < 11) {
        showErrorCallback("Digite o CPF completo (11 dígitos).");
        return false;
    }
    
    // Verifica se tem exatamente 11 dígitos
    if (cpfLimpo.length !== 11) {
        showErrorCallback("CPF deve ter exatamente 11 dígitos.");
        return false;
    }
    
    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
        showErrorCallback("CPF inválido. Digite um CPF válido.");
        return false;
    }
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpfLimpo.charAt(9))) {
        showErrorCallback("CPF inválido. Verifique os números digitados.");
        return false;
    }
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpfLimpo.charAt(10))) {
        showErrorCallback("CPF inválido. Verifique os números digitados.");
        return false;
    }
    
    return true;
}

// Função para formatação automática do CPF
function autoFormatCPF(input) {
    let value = input.value.replace(/\D/g, "");
    
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
    
    input.value = value;
}

// Função para validar login com mensagens específicas
function validateLoginWithSpecificMessages(cpf, password, showErrorCallback) {
    // Validar campos vazios
    if (!cpf || cpf.trim() === "") {
        showErrorCallback("Digite seu CPF para continuar.");
        return false;
    }
    
    if (!password || password.trim() === "") {
        showErrorCallback("Digite sua senha para continuar.");
        return false;
    }
    
    // Validar CPF
    if (!validateCPFWithMessages(cpf, showErrorCallback)) {
        return false;
    }
    
    return true;
}

// Função para mostrar mensagens de erro específicas no login
function showLoginError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        element.style.color = '#ff4757';
        element.style.fontSize = '14px';
        element.style.marginTop = '5px';
        element.style.fontWeight = '500';
    }
}

// Função para limpar mensagens de erro
function clearLoginErrors() {
    const errorElements = ['loginCpfError', 'loginPasswordError', 'loginGeneralError'];
    errorElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    });
}

// Função para inicializar validação de CPF no campo de login
function initCPFValidation() {
    const loginCpfField = document.getElementById('loginCpf');
    const loginForm = document.getElementById('loginForm');
    
    if (loginCpfField) {
        // Formatação automática enquanto digita
        loginCpfField.addEventListener('input', function(e) {
            autoFormatCPF(e.target);
            // Limpar erro do CPF quando o usuário começar a digitar
            const errorElement = document.getElementById('loginCpfError');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
        
        // Validação quando sair do campo
        loginCpfField.addEventListener('blur', function(e) {
            const cpf = e.target.value.trim();
            if (cpf) {
                validateCPFWithMessages(cpf, (message) => {
                    showLoginError('loginCpfError', message);
                });
            }
        });
    }
    
    // Limpar erros quando começar a digitar a senha
    const loginPasswordField = document.getElementById('loginPassword');
    if (loginPasswordField) {
        loginPasswordField.addEventListener('input', function() {
            const errorElement = document.getElementById('loginPasswordError');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    }
}

// Exportar funções para uso global
if (typeof window !== 'undefined') {
    window.validateCPFWithMessages = validateCPFWithMessages;
    window.autoFormatCPF = autoFormatCPF;
    window.validateLoginWithSpecificMessages = validateLoginWithSpecificMessages;
    window.showLoginError = showLoginError;
    window.clearLoginErrors = clearLoginErrors;
    window.initCPFValidation = initCPFValidation;
}

