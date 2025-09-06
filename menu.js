// ===== FUNCIONALIDADES DO MENU E MODAIS =====

// Função para alternar o menu hambúrguer
function toggleMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  
  if (hamburgerBtn && dropdownMenu) {
    hamburgerBtn.classList.toggle('active');
    dropdownMenu.classList.toggle('show');
  }
}

// Fechar menu ao clicar fora
document.addEventListener('click', function(event) {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const dropdownMenu = document.getElementById('dropdown-menu');
  
  if (hamburgerMenu && !hamburgerMenu.contains(event.target)) {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove('active');
    }
    if (dropdownMenu) {
      dropdownMenu.classList.remove('show');
    }
  }
});

// Função para abrir modal da conta
function openAccountModal() {
  if (!usuarioAtual || !usuarios[usuarioAtual]) {
    // Removido alert - usuário não encontrado
    console.log('Erro: usuário não encontrado');
    return;
  }
  
  const user = usuarios[usuarioAtual];
  
  // Preencher informações da conta
  document.getElementById('account-name').textContent = user.nome;
  document.getElementById('account-surname').textContent = user.sobrenome || '-';
  document.getElementById('account-cpf').textContent = user.cpf;
  document.getElementById('account-email').textContent = user.email;
  document.getElementById('account-phone').textContent = user.celular;
  
  // Formatar data de cadastro
  const date = new Date(user.dataCadastro);
  document.getElementById('account-date').textContent = date.toLocaleDateString('pt-BR');
  
  showModal('account-modal');
  toggleMenu(); // Fechar menu
}

// Função para abrir modal de depósito
function openDepositModal() {
  showModal('deposit-modal');
  toggleMenu(); // Fechar menu
}

// Função para abrir modal de alterar senha
function openPasswordModal() {
  // Limpar formulário
  document.getElementById('password-form').reset();
  document.getElementById('password-message').textContent = '';
  document.getElementById('password-message').className = 'feedback-message';
  
  showModal('password-modal');
  toggleMenu(); // Fechar menu
}

// Função para mostrar modal
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
  }
}

// Função para fechar modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restaurar scroll
  }
}

// Fechar modal ao clicar fora do conteúdo
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
});

// Função para alternar visibilidade da senha
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const toggle = input.nextElementSibling;
  
  if (input.type === 'password') {
    input.type = 'text';
    toggle.textContent = '🙈';
  } else {
    input.type = 'password';
    toggle.textContent = '👁️';
  }
}

// Função para alterar senha
function changePassword(event) {
  event.preventDefault();
  
  if (!usuarioAtual || !usuarios[usuarioAtual]) {
    showPasswordMessage('Erro: usuário não encontrado', 'error');
    return;
  }
  
  const currentPassword = document.getElementById('current-password').value.trim();
  const newPassword = document.getElementById('new-password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();
  
  const user = usuarios[usuarioAtual];
  
  // Validar senha atual ou email
  if (currentPassword !== user.senha && currentPassword !== user.email) {
    showPasswordMessage('Senha atual ou e-mail incorreto', 'error');
    return;
  }
  
  // Validar nova senha
  if (!validarSenha(newPassword)) {
    showPasswordMessage("Nova senha deve ter 8+ caracteres, 1 maiúscula e 1 número", "error");
    return;
  }
  
  // Validar se a nova senha é diferente da senha atual
  if (newPassword === user.senha) {
    showPasswordMessage('A nova senha deve ser diferente da senha atual', 'error');
    return;
  }
  
  // Validar confirmação
  if (newPassword !== confirmPassword) {
    showPasswordMessage('Nova senha e confirmação não coincidem', 'error');
    return;
  }
  
  // Alterar senha
  user.senha = newPassword;
  
  // Salvar dados
  if (salvarDados()) {
    showPasswordMessage('Senha alterada com sucesso!', 'success');
    
    // Limpar campos
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    
    // Fechar modal após 2 segundos
    setTimeout(() => {
      closeModal('password-modal');
    }, 2000);
  } else {
    showPasswordMessage('Erro ao salvar nova senha. Tente novamente.', 'error');
  }
}

// Função para validar senha em tempo real
function validatePasswordRealTime() {
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const submitButton = document.querySelector('#password-form button[type="submit"]');
  const messageEl = document.getElementById('password-message');
  
  // Limpar mensagens anteriores
  if (messageEl) {
    messageEl.textContent = '';
    messageEl.className = 'feedback-message';
  }
  
  // Verificar se há usuário logado
  if (!usuarioAtual || !usuarios[usuarioAtual]) {
    if (submitButton) submitButton.disabled = true;
    return;
  }
  
  const user = usuarios[usuarioAtual];
  let isValid = true;
  let message = '';
  
  // Validar nova senha
  if (newPassword && !validarSenha(newPassword)) {
    isValid = false;
    message = 'Nova senha deve ter 8+ caracteres, 1 maiúscula e 1 número';
  }
  
  // Validar se é diferente da senha atual
  if (newPassword && newPassword === user.senha) {
    isValid = false;
    message = 'A nova senha deve ser diferente da senha atual';
  }
  
  // Validar confirmação
  if (confirmPassword && newPassword !== confirmPassword) {
    isValid = false;
    message = 'Nova senha e confirmação não coincidem';
  }
  
  // Habilitar/desabilitar botão
  if (submitButton) {
    submitButton.disabled = !isValid || !newPassword || !confirmPassword;
  }
  
  // Mostrar mensagem
  if (message && messageEl) {
    messageEl.textContent = message;
    messageEl.className = 'feedback-message error';
  } else if (newPassword && confirmPassword && isValid && messageEl) {
    messageEl.textContent = 'Senha válida!';
    messageEl.className = 'feedback-message success';
  }
}

// Função para mostrar mensagem no modal de senha
function showPasswordMessage(message, type) {
  const messageEl = document.getElementById('password-message');
  messageEl.textContent = message;
  messageEl.className = `feedback-message ${type}`;
}

// Função para validar senha (mantendo compatibilidade)
function validarSenhaSimples(senha) {
  return senha.length >= 3;
}

// Função de alterar senha simplificada (para compatibilidade com sistema.js)
function alterarSenha() {
  // Esta função foi movida para o modal, mas mantemos para compatibilidade
  openPasswordModal();
}

// Função para abrir modal de senha com limpeza
function openPasswordModal() {
  // Limpar campos e mensagens
  const currentPassword = document.getElementById('current-password');
  const newPassword = document.getElementById('new-password');
  const confirmPassword = document.getElementById('confirm-password');
  const messageEl = document.getElementById('password-message');
  const submitButton = document.querySelector('#password-form button[type="submit"]');
  
  if (currentPassword) currentPassword.value = '';
  if (newPassword) newPassword.value = '';
  if (confirmPassword) confirmPassword.value = '';
  if (messageEl) {
    messageEl.textContent = '';
    messageEl.className = 'feedback-message';
  }
  if (submitButton) submitButton.disabled = true;
  
  // Abrir modal
  showModal('password-modal');
}

// Função para abrir modal do usuário teste
function openTestUserModal() {
  showModal('test-user-modal');
}

// Função para copiar texto para a área de transferência
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.select();
    element.setSelectionRange(0, 99999); // Para dispositivos móveis
    
    try {
      document.execCommand('copy');
      
      // Feedback visual
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = '✅';
      button.style.background = '#2ecc71';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 1500);
      
      console.log('📋 Dados copiados para a área de transferência');
    } catch (err) {
      console.error('Erro ao copiar dados:', err);
      
      // Fallback: mostrar o valor em um alert
      alert(`Dados: ${element.value}`);
    }
  }
}

// Função para alternar visibilidade da senha no modal de teste
function togglePasswordVisibilityTest(inputId) {
  const input = document.getElementById(inputId);
  const toggle = event.target;
  
  if (input.type === 'password') {
    input.type = 'text';
    toggle.textContent = '🙈';
  } else {
    input.type = 'password';
    toggle.textContent = '👁️';
  }
}

// Expor funções globalmente para uso em outros scripts
window.openAccountModal = openAccountModal;
window.openPasswordModal = openPasswordModal;
window.openDepositModal = openDepositModal;
window.openTestUserModal = openTestUserModal;
window.copyToClipboard = copyToClipboard;
window.togglePasswordVisibilityTest = togglePasswordVisibilityTest;
window.showModal = showModal;
window.closeModal = closeModal;
window.toggleMenu = toggleMenu;

