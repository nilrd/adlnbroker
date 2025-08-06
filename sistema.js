// ===== SISTEMA ADLN HOME BROKER - VERSÃO CORRIGIDA FINAL =====
// Com popup estilizado e dashboard funcional

// Variáveis globais
var usuarios = {};
var usuarioAtual = null;
var carteira = {};
var extrato = [];
var ordens = [];

// Preços dos ativos
var precos = {
  PETR4: 28.50,
  VALE3: 72.30,
  ITUB4: 31.20,
  BBDC4: 27.80,
  ABEV3: 14.25,
  MGLU3: 3.45,
  BBAS3: 49.10,
  LREN3: 18.30
};

var ativos = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3', 'MGLU3', 'BBAS3', 'LREN3'];

// Função para debug
function debug(msg, data) {
  console.log('[ADLN] ' + msg, data || '');
}

// Função para criar popup estilizado
function criarPopupEstilizado(titulo, mensagem, callback) {
  // Remover popup existente se houver
  var popupExistente = document.getElementById('popup-overlay');
  if (popupExistente) {
    popupExistente.remove();
  }
  
  // Criar overlay
  var overlay = document.createElement('div');
  overlay.id = 'popup-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;
  
  // Criar popup
  var popup = document.createElement('div');
  popup.style.cssText = `
    background: linear-gradient(135deg, #181A20 0%, #2A2D35 100%);
    border: 2px solid #F0B90B;
    border-radius: 15px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease;
    position: relative;
  `;
  
  // Criar conteúdo do popup
  popup.innerHTML = `
    <div style="margin-bottom: 20px;">
      <img src="logo.png" alt="ADLN Logo" style="width: 60px; height: 60px; margin-bottom: 15px;">
    </div>
    <h2 style="color: #F0B90B; margin: 0 0 15px 0; font-size: 24px; font-weight: bold;">${titulo}</h2>
    <p style="color: #FFFFFF; margin: 0 0 25px 0; font-size: 16px; line-height: 1.5;">${mensagem}</p>
    <button id="popup-btn" style="
      background: linear-gradient(135deg, #F0B90B 0%, #FFD700 100%);
      color: #181A20;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(240, 185, 11, 0.3);
    ">OK</button>
  `;
  
  // Adicionar estilos de animação
  var style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(-50px) scale(0.9); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    #popup-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(240, 185, 11, 0.4);
    }
  `;
  document.head.appendChild(style);
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  
  // Configurar botão
  var btn = document.getElementById('popup-btn');
  btn.onclick = function() {
    overlay.style.animation = 'fadeOut 0.3s ease';
    setTimeout(function() {
      overlay.remove();
      if (callback) callback();
    }, 300);
  };
  
  // Adicionar animação de saída
  style.textContent += `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
}

// Função para formatar CPF
function formatarCPF(input) {
  var v = input.value.replace(/\D/g, '');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

// Função para validar CPF
function validarCPF(cpf) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
}

// Função para validar email
function validarEmail(email) {
  return email.indexOf('@') > -1 && email.indexOf('.') > -1;
}

// Função para validar senha
function validarSenha(senha) {
  return senha.length >= 8 && /[A-Z]/.test(senha) && /\d/.test(senha);
}

// Função para carregar dados do localStorage
function carregarDados() {
  try {
    var dadosUsuarios = localStorage.getItem('adln_usuarios');
    if (dadosUsuarios) {
      usuarios = JSON.parse(dadosUsuarios);
      debug('Usuários carregados', usuarios);
    }
    
    var usuarioAtualStorage = localStorage.getItem('adln_usuario_atual');
    if (usuarioAtualStorage) {
      usuarioAtual = usuarioAtualStorage;
      debug('Usuário atual carregado', usuarioAtual);
      
      // Carregar dados específicos do usuário
      var carteiraData = localStorage.getItem('adln_carteira_' + usuarioAtual);
      if (carteiraData) carteira = JSON.parse(carteiraData);
      
      var extratoData = localStorage.getItem('adln_extrato_' + usuarioAtual);
      if (extratoData) extrato = JSON.parse(extratoData);
      
      var ordensData = localStorage.getItem('adln_ordens_' + usuarioAtual);
      if (ordensData) ordens = JSON.parse(ordensData);
    }
  } catch (e) {
    debug('Erro ao carregar dados', e);
  }
}

// Função para salvar dados no localStorage
function salvarDados() {
  try {
    localStorage.setItem('adln_usuarios', JSON.stringify(usuarios));
    if (usuarioAtual) {
      localStorage.setItem('adln_usuario_atual', usuarioAtual);
      localStorage.setItem('adln_carteira_' + usuarioAtual, JSON.stringify(carteira));
      localStorage.setItem('adln_extrato_' + usuarioAtual, JSON.stringify(extrato));
      localStorage.setItem('adln_ordens_' + usuarioAtual, JSON.stringify(ordens));
    }
    debug('Dados salvos com sucesso');
    return true;
  } catch (e) {
    debug('Erro ao salvar dados', e);
    return false;
  }
}

// Função para mostrar mensagem
function mostrarMensagem(elementId, texto, tipo) {
  var elemento = document.getElementById(elementId);
  if (elemento) {
    elemento.textContent = texto;
    elemento.className = tipo || 'error';
    debug('Mensagem exibida: ' + texto);
  }
}

// Função de cadastro
function realizarCadastro() {
  debug('Iniciando cadastro');
  
  var nome = document.getElementById('nome').value.trim();
  var cpf = document.getElementById('cpf').value.trim();
  var email = document.getElementById('email').value.trim();
  var celular = document.getElementById('celular').value.trim();
  var senha = document.getElementById('senha').value;
  var confirmarSenha = document.getElementById('confirmarSenha').value;
  
  // Validações
  if (!nome || !cpf || !email || !celular || !senha || !confirmarSenha) {
    mostrarMensagem('msgCadastro', 'Preencha todos os campos', 'error');
    return;
  }
  
  if (!validarCPF(cpf)) {
    mostrarMensagem('msgCadastro', 'CPF inválido', 'error');
    return;
  }
  
  if (!validarEmail(email)) {
    mostrarMensagem('msgCadastro', 'E-mail inválido', 'error');
    return;
  }
  
  if (!validarSenha(senha)) {
    mostrarMensagem('msgCadastro', 'Senha deve ter 8+ caracteres, 1 maiúscula e 1 número', 'error');
    return;
  }
  
  if (senha !== confirmarSenha) {
    mostrarMensagem('msgCadastro', 'Senhas não coincidem', 'error');
    return;
  }
  
  // Carregar dados existentes
  carregarDados();
  
  // Verificar duplicatas
  if (usuarios[cpf]) {
    mostrarMensagem('msgCadastro', 'CPF já cadastrado', 'error');
    return;
  }
  
  for (var userCpf in usuarios) {
    if (usuarios[userCpf].email === email) {
      mostrarMensagem('msgCadastro', 'E-mail já cadastrado', 'error');
      return;
    }
  }
  
  // Criar usuário
  usuarios[cpf] = {
    nome: nome,
    cpf: cpf,
    email: email,
    celular: celular,
    senha: senha,
    saldo: 100000,
    dataCadastro: new Date().toISOString()
  };
  
  // Definir como usuário atual
  usuarioAtual = cpf;
  carteira = {};
  extrato = [];
  ordens = [];
  
  // Salvar dados
  if (salvarDados()) {
    mostrarMensagem('msgCadastro', 'Cadastro realizado com sucesso! Redirecionando...', 'success');
    debug('Usuário cadastrado com sucesso', usuarios[cpf]);
    
    setTimeout(function() {
      window.location.href = 'dashboard.html';
    }, 2000);
  } else {
    mostrarMensagem('msgCadastro', 'Erro ao salvar dados. Tente novamente.', 'error');
  }
}

// Função de login
function realizarLogin() {
  debug('Iniciando login');
  
  var cpf = document.getElementById('cpfLogin').value.trim();
  var senha = document.getElementById('senhaLogin').value;
  
  if (!cpf || !senha) {
    mostrarMensagem('loginMsg', 'Preencha todos os campos', 'error');
    return;
  }
  
  // Carregar dados
  carregarDados();
  
  // Verificar usuário
  if (!usuarios[cpf]) {
    mostrarMensagem('loginMsg', 'Usuário não encontrado', 'error');
    debug('Usuário não encontrado para CPF: ' + cpf);
    debug('CPFs disponíveis:', Object.keys(usuarios));
    return;
  }
  
  if (usuarios[cpf].senha !== senha) {
    mostrarMensagem('loginMsg', 'Senha incorreta', 'error');
    return;
  }
  
  // Login bem-sucedido
  usuarioAtual = cpf;
  
  // Carregar dados específicos do usuário
  var carteiraData = localStorage.getItem('adln_carteira_' + usuarioAtual);
  if (carteiraData) carteira = JSON.parse(carteiraData);
  else carteira = {};
  
  var extratoData = localStorage.getItem('adln_extrato_' + usuarioAtual);
  if (extratoData) extrato = JSON.parse(extratoData);
  else extrato = [];
  
  var ordensData = localStorage.getItem('adln_ordens_' + usuarioAtual);
  if (ordensData) ordens = JSON.parse(ordensData);
  else ordens = [];
  
  // Salvar usuário atual
  localStorage.setItem('adln_usuario_atual', usuarioAtual);
  
  mostrarMensagem('loginMsg', 'Login realizado com sucesso!', 'success');
  debug('Login bem-sucedido para', usuarios[cpf]);
  
  // Popup estilizado de boas-vindas
  criarPopupEstilizado(
    'Bem-vindo!',
    'Olá, ' + usuarios[cpf].nome + '!<br><br>Você foi logado com sucesso no ADLN Home Broker.',
    function() {
      window.location.href = 'dashboard.html';
    }
  );
}

// Função de logout
function logout() {
  usuarioAtual = null;
  carteira = {};
  extrato = [];
  ordens = [];
  localStorage.removeItem('adln_usuario_atual');
  debug('Logout realizado');
  window.location.href = 'index.html';
}

// Função para executar ordem
function executarOrdem() {
  debug('Executando ordem');
  
  var tipo = document.getElementById('tipo').value;
  var ativo = document.getElementById('ativo').value;
  var quantidade = parseInt(document.getElementById('quantidade').value);
  var valor = parseFloat(document.getElementById('valor').value);
  
  // Validações
  if (!ativo || !quantidade || !valor) {
    mostrarMensagem('mensagem', 'Preencha todos os campos', 'error');
    return;
  }
  
  if (quantidade % 100 !== 0) {
    mostrarMensagem('mensagem', 'Quantidade deve ser múltiplo de 100', 'error');
    return;
  }
  
  if (quantidade <= 0 || valor <= 0) {
    mostrarMensagem('mensagem', 'Quantidade e valor devem ser positivos', 'error');
    return;
  }
  
  var valorTotal = quantidade * valor;
  var usuario = usuarios[usuarioAtual];
  
  if (tipo === 'Compra') {
    if (usuario.saldo < valorTotal) {
      mostrarMensagem('mensagem', 'Saldo insuficiente', 'error');
      return;
    }
    
    // Executar compra
    usuario.saldo -= valorTotal;
    carteira[ativo] = (carteira[ativo] || 0) + quantidade;
    
    // Adicionar ao extrato
    extrato.push({
      tipo: 'Compra',
      ativo: ativo,
      quantidade: quantidade,
      valorTotal: valorTotal.toFixed(2),
      data: new Date().toLocaleString()
    });
    
    mostrarMensagem('mensagem', 'Compra realizada com sucesso!', 'success');
  } else {
    // Venda
    if (!carteira[ativo] || carteira[ativo] < quantidade) {
      mostrarMensagem('mensagem', 'Quantidade insuficiente na carteira', 'error');
      return;
    }
    
    // Executar venda
    usuario.saldo += valorTotal;
    carteira[ativo] -= quantidade;
    
    if (carteira[ativo] === 0) {
      delete carteira[ativo];
    }
    
    // Adicionar ao extrato
    extrato.push({
      tipo: 'Venda',
      ativo: ativo,
      quantidade: quantidade,
      valorTotal: valorTotal.toFixed(2),
      data: new Date().toLocaleString()
    });
    
    mostrarMensagem('mensagem', 'Venda realizada com sucesso!', 'success');
  }
  
  // Adicionar ordem
  ordens.push({
    tipo: tipo,
    ativo: ativo,
    quantidade: quantidade,
    valor: valor.toFixed(2),
    cotacao: precos[ativo].toFixed(2),
    status: 'Aceita',
    data: new Date().toLocaleString()
  });
  
  // Salvar dados
  salvarDados();
  
  // Atualizar interface
  atualizarDashboard();
  
  // Limpar formulário
  document.getElementById('quantidade').value = '';
  document.getElementById('valor').value = '';
}

// Função para alterar senha
function alterarSenha() {
  var novaSenha = document.getElementById('novaSenha').value.trim();
  
  if (!novaSenha || novaSenha.length < 3) {
    mostrarMensagem('senhaMsg', 'Senha deve ter pelo menos 3 caracteres', 'error');
    return;
  }
  
  usuarios[usuarioAtual].senha = novaSenha;
  salvarDados();
  
  mostrarMensagem('senhaMsg', 'Senha alterada com sucesso!', 'success');
  document.getElementById('novaSenha').value = '';
}

// Função para atualizar dashboard
function atualizarDashboard() {
  if (!usuarioAtual || !usuarios[usuarioAtual]) return;
  
  var usuario = usuarios[usuarioAtual];
  
  // Atualizar informações do usuário
  var usernameEl = document.getElementById('username');
  var saldoEl = document.getElementById('saldo');
  
  if (usernameEl) usernameEl.textContent = usuario.nome;
  if (saldoEl) saldoEl.textContent = usuario.saldo.toFixed(2);
  
  // Mostrar dashboard
  var dashboardEl = document.getElementById('dashboard');
  if (dashboardEl) {
    dashboardEl.style.display = 'block';
    dashboardEl.style.opacity = '1';
  }
  
  // Atualizar book de ofertas
  atualizarBookOfertas();
  
  // Atualizar carteira
  atualizarCarteira();
  
  // Atualizar extrato
  atualizarExtrato();
  
  // Atualizar ordens
  atualizarOrdens();
}

// Função para atualizar book de ofertas
function atualizarBookOfertas() {
  var tbody = document.querySelector('#book tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  for (var i = 0; i < ativos.length; i++) {
    var ativo = ativos[i];
    var preco = precos[ativo];
    var variacao = ((Math.random() - 0.5) * 2).toFixed(2);
    var isPositive = parseFloat(variacao) >= 0;
    
    var row = tbody.insertRow();
    row.innerHTML = '<td>' + ativo + '</td>' +
                   '<td>R$ ' + preco.toFixed(2) + '</td>' +
                   '<td class="' + (isPositive ? 'positive' : 'negative') + '">' +
                   (isPositive ? '+' : '') + variacao + '%</td>';
  }
}

// Função para atualizar carteira
function atualizarCarteira() {
  var valorTotal = 0;
  for (var ativo in carteira) {
    valorTotal += carteira[ativo] * precos[ativo];
  }
  
  var valorTotalEl = document.getElementById('valorTotal');
  if (valorTotalEl) {
    valorTotalEl.textContent = 'R$ ' + valorTotal.toFixed(2);
  }
  
  var emptyWallet = document.getElementById('portfolioEmpty');
  var tableWrapper = document.querySelector('.wallet-card .table-wrapper');
  var tbody = document.querySelector('#carteira tbody');
  
  var hasAtivos = Object.keys(carteira).length > 0;
  
  if (emptyWallet) emptyWallet.style.display = hasAtivos ? 'none' : 'flex';
  if (tableWrapper) tableWrapper.style.display = hasAtivos ? 'block' : 'none';
  
  if (tbody && hasAtivos) {
    tbody.innerHTML = '';
    for (var ativo in carteira) {
      var quantidade = carteira[ativo];
      var precoAtual = precos[ativo];
      var valorTotalAtivo = quantidade * precoAtual;
      
      var row = tbody.insertRow();
      row.innerHTML = '<td>' + ativo + '</td>' +
                     '<td>' + quantidade + '</td>' +
                     '<td>R$ ' + precoAtual.toFixed(2) + '</td>' +
                     '<td>R$ ' + valorTotalAtivo.toFixed(2) + '</td>';
    }
  }
}

// Função para atualizar extrato
function atualizarExtrato() {
  var tbody = document.querySelector('#extrato tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  var extratoRecente = extrato.slice(-10).reverse();
  for (var i = 0; i < extratoRecente.length; i++) {
    var operacao = extratoRecente[i];
    var row = tbody.insertRow();
    row.innerHTML = '<td>' + operacao.tipo + '</td>' +
                   '<td>' + operacao.ativo + '</td>' +
                   '<td>' + operacao.quantidade + '</td>' +
                   '<td>R$ ' + operacao.valorTotal + '</td>';
  }
}

// Função para atualizar ordens
function atualizarOrdens() {
  var tbody = document.querySelector('#ordens tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  var ordensRecentes = ordens.slice(-10).reverse();
  for (var i = 0; i < ordensRecentes.length; i++) {
    var ordem = ordensRecentes[i];
    var row = tbody.insertRow();
    var cancelBtn = ordem.status === 'Aceita' ? 
      '<button class="btn-cancel" onclick="cancelarOrdem(' + (ordens.length - 1 - i) + ')">Cancelar</button>' : '';
    
    row.innerHTML = '<td>' + ordem.tipo + '</td>' +
                   '<td>' + ordem.ativo + '</td>' +
                   '<td>' + ordem.quantidade + '</td>' +
                   '<td>R$ ' + ordem.valor + '</td>' +
                   '<td>R$ ' + ordem.cotacao + '</td>' +
                   '<td>' + ordem.status + '</td>' +
                   '<td>' + cancelBtn + '</td>';
  }
}

// Função para cancelar ordem
function cancelarOrdem(index) {
  if (ordens[index] && ordens[index].status === 'Aceita') {
    ordens[index].status = 'Cancelada';
    salvarDados();
    atualizarOrdens();
    mostrarMensagem('mensagem', 'Ordem cancelada com sucesso!', 'success');
  }
}

// Função para preencher select de ativos
function preencherAtivos() {
  var ativoSelect = document.getElementById('ativo');
  if (ativoSelect) {
    ativoSelect.innerHTML = '';
    for (var i = 0; i < ativos.length; i++) {
      var option = document.createElement('option');
      option.value = ativos[i];
      option.textContent = ativos[i];
      ativoSelect.appendChild(option);
    }
  }
}

// Função para atualizar preços (simulação)
function atualizarPrecos() {
  for (var i = 0; i < ativos.length; i++) {
    var ativo = ativos[i];
    var variacao = (Math.random() - 0.5) * 0.02;
    precos[ativo] *= (1 + variacao);
    precos[ativo] = Math.max(0.01, precos[ativo]);
  }
  atualizarBookOfertas();
  atualizarCarteira();
}

// Função para toggle da senha
function toggleSenha() {
  var input = document.getElementById('novaSenha');
  var toggle = document.getElementById('toggleSenha');
  
  if (input && toggle) {
    if (input.type === 'password') {
      input.type = 'text';
      toggle.textContent = '🙈';
    } else {
      input.type = 'password';
      toggle.textContent = '👁️';
    }
  }
}

// Função para verificar localStorage
function verificarLocalStorage() {
  console.log('=== DEBUG LOCALSTORAGE ===');
  console.log('adln_usuarios:', localStorage.getItem('adln_usuarios'));
  console.log('adln_usuario_atual:', localStorage.getItem('adln_usuario_atual'));
  
  var users = JSON.parse(localStorage.getItem('adln_usuarios') || '{}');
  console.log('Usuários cadastrados:', Object.keys(users));
  
  for (var cpf in users) {
    console.log('Usuário ' + cpf + ':', users[cpf]);
  }
}

// Expor função de debug
window.verificarLocalStorage = verificarLocalStorage;

debug('Sistema ADLN carregado com sucesso');

