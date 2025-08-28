// ===== FUNCIONALIDADES DO MENU E MODAIS =====

// Função para alternar o menu hambúrguer
function toggleMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  
  hamburgerBtn.classList.toggle('active');
  dropdownMenu.classList.toggle('show');
}

// Fechar menu ao clicar fora
document.addEventListener('click', function(event) {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const dropdownMenu = document.getElementById('dropdown-menu');
  
  if (!hamburgerMenu.contains(event.target)) {
    document.querySelector('.hamburger-btn').classList.remove('active');
    dropdownMenu.classList.remove('show');
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
    
    // Fechar modal após 2 segundos
    setTimeout(() => {
      closeModal('password-modal');
    }, 2000);
  } else {
    showPasswordMessage('Erro ao salvar nova senha. Tente novamente.', 'error');
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

