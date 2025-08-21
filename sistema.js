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

// Função para validar preço no modal de trading
function validarPrecoTrade() {
  var precoInput = document.getElementById('tradePrice');
  var precoHint = document.getElementById('precoHint');
  var ativoSelect = document.getElementById('tradeAsset');
  var tipoSelect = document.getElementById('tradeType');
  
  if (!precoInput || !precoHint || !ativoSelect || !tipoSelect) return;
  
  var preco = parseFloat(precoInput.value);
  var ativo = ativoSelect.value;
  var tipo = tipoSelect.value;
  
  if (!preco || !ativo) return;
  
  var cotacaoAtual = precos[ativo];
  var variacaoMaxima = 0.05; // 5% de variação máxima permitida
  
  var mensagem = '';
  var isValid = true;
  
  if (tipo === 'buy') {
    var precoMinimo = cotacaoAtual * (1 - variacaoMaxima);
    if (preco < precoMinimo) {
      mensagem = `Preço muito baixo! Mínimo permitido: R$ ${precoMinimo.toFixed(2)}`;
      isValid = false;
    }
  } else if (tipo === 'sell') {
    var precoMaximo = cotacaoAtual * (1 + variacaoMaxima);
    if (preco > precoMaximo) {
      mensagem = `Preço muito alto! Máximo permitido: R$ ${precoMaximo.toFixed(2)}`;
      isValid = false;
    }
  }
  
  if (!isValid) {
    precoHint.textContent = mensagem;
    precoHint.style.display = 'block';
    precoInput.style.borderColor = '#e74c3c';
    precoInput.style.backgroundColor = '#fdf2f2';
  } else {
    precoHint.style.display = 'none';
    precoInput.style.borderColor = '';
    precoInput.style.backgroundColor = '';
  }
  
  return isValid;
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

// Função para filtrar apenas letras e espaços no campo nome
function filtrarApenasLetras(input) {
  // Remove qualquer caractere que não seja letra (incluindo acentos) ou espaço
  var valor = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
  input.value = valor;
}


// Função para validar CPF com dígitos verificadores
function validarCPF(cpf) {
  // Remover pontos e traços
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Verificar se tem exatamente 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }
  
  // Verificar se não é uma sequência de dígitos repetidos
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  // Validar dígitos verificadores
  let soma = 0;
  let resto;
  
  // Validar primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  // Validar segundo dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
}

// Função para validar nome
function validarNome(nome) {
  // Remover espaços extras e verificar se contém apenas letras e espaços (incluindo acentuação)
  nome = nome.trim().replace(/\s+/g, ' ');
  
  // Verificar se tem pelo menos 3 caracteres após remoção de espaços
  if (nome.length < 3) {
    return false;
  }
  
  // Verificar se contém apenas letras e espaços (incluindo acentuação)
  return nome.length >= 3 && /^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*$/.test(nome);
}

// Função para validar telefone
function validarTelefone(telefone) {
  // Remover todos os caracteres não numéricos
  telefone = telefone.replace(/[^\d]/g, '');
  
  // Verificar se tem 10 ou 11 dígitos (DDD + número)
  if (telefone.length !== 10 && telefone.length !== 11) {
    return false;
  }
  
  // Verificar se o DDD é válido (11 a 99)
  const ddd = parseInt(telefone.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return false;
  }
  
  return true;
}

// Função para validar email
function validarEmail(email) {
  // Regex para validar formato de e-mail mais robusto - aceita todas as extensões (.com, .com.br, .co.uk, etc.)
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/;
  return regex.test(email);
}

// Função para validar senha
function validarSenha(senha) {
  return senha.length >= 8 && /[A-Z]/.test(senha) && /\d/.test(senha);
}

// Função para carregar dados do localStorage
function carregarDados() {
  try {
    // Carregar dados de usuários do localStorage
    var dadosUsuarios = localStorage.getItem("adln_usuarios");
    if (dadosUsuarios) {
      usuarios = JSON.parse(dadosUsuarios);
      debug("Usuários carregados", usuarios);
    }

    var usuarioAtualStorage = localStorage.getItem("adln_usuario_atual");
    if (usuarioAtualStorage) {
      usuarioAtual = usuarioAtualStorage;
      debug("Usuário atual carregado", usuarioAtual);

      // Carregar dados específicos do usuário
      var carteiraData = localStorage.getItem("adln_carteira_" + usuarioAtual);
      if (carteiraData) carteira = JSON.parse(carteiraData);

      var extratoData = localStorage.getItem("adln_extrato_" + usuarioAtual);
      if (extratoData) extrato = JSON.parse(extratoData); else extrato = [];
      if (!Array.isArray(extrato)) extrato = [];

      var ordensData = localStorage.getItem("adln_ordens_" + usuarioAtual);
      if (ordensData) ordens = JSON.parse(ordensData);
    }
  } catch (e) {
    debug("Erro ao carregar dados", e);
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
  
  // Validação específica do nome
  if (!validarNome(nome)) {
    mostrarMensagem("msgCadastro", "O nome deve conter apenas letras e no mínimo 3 caracteres.", "error");
    return;
  }
  
    if (!validarCPF(cpf)) {
      mostrarMensagem("msgCadastro", "CPF inválido. Digite novamente no formato 000.000.000-00.", "error");
      return;
    }
  
  // Validação específica do telefone
  if (!validarTelefone(celular)) {
    mostrarMensagem("msgCadastro", "Telefone inválido. Verifique o DDD e o número.", "error");
    return;
  }
  
  if (!validarEmail(email)) {
    mostrarMensagem("msgCadastro", "Digite um e-mail válido.", "error");
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
    mostrarMensagem("msgCadastro", "CPF já cadastrado. Por favor, utilize outro CPF ou faça login.", "error");
    return;
  }
  
  for (var userCpf in usuarios) {
    if (usuarios[userCpf].email === email) {
      mostrarMensagem("msgCadastro", "E-mail já cadastrado. Por favor, utilize outro e-mail.", "error");
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
    mostrarMensagem("loginMsg", "CPF ou senha inválidos. Tente novamente.", "error");
    debug("Usuário não encontrado para CPF: " + cpf);
    debug("CPFs disponíveis:", Object.keys(usuarios));
    return;
  }
  
  if (usuarios[cpf].senha !== senha) {
    mostrarMensagem("loginMsg", "CPF ou senha inválidos. Tente novamente.", "error");
    return;
  }
  
  // Login bem-sucedido
  usuarioAtual = cpf;
  
  // Carregar dados específicos do usuário
  try {
    var carteiraData = localStorage.getItem("adln_carteira_" + usuarioAtual);
    if (carteiraData) carteira = JSON.parse(carteiraData);
    else carteira = {};
    
    var extratoData = localStorage.getItem("adln_extrato_" + usuarioAtual);
    if (extratoData) extrato = JSON.parse(extratoData);
    else extrato = [];
    if (!Array.isArray(extrato)) extrato = [];
    
    var ordensData = localStorage.getItem("adln_ordens_" + usuarioAtual);
    if (ordensData) ordens = JSON.parse(ordensData);
    else ordens = [];
  } catch (e) {
    console.error("Erro ao carregar dados do usuário após login:", e);
    mostrarMensagem("loginMsg", "Erro ao carregar seus dados. Tente novamente.", "error");
    return;
  }
  
  // Salvar usuário atual
  localStorage.setItem("adln_usuario_atual", usuarioAtual);
  
  mostrarMensagem("loginMsg", "Login realizado com sucesso! Redirecionando...", "success");
  debug("Login bem-sucedido para", usuarios[cpf]);
  
  setTimeout(function() {
    window.location.href = "dashboard.html";
  }, 2000);
}

// Função de logout
function logout() {
  usuarioAtual = null;
  carteira = {};
  extrato = [];
  ordens = [];
  localStorage.removeItem("adln_usuario_atual");
  debug("Logout realizado");
  
  // Usar a função de logout do sistema de autenticação
  if (window.ADLNAuth && window.ADLNAuth.logout) {
    window.ADLNAuth.logout();
  } else {
    window.location.href = "index.html";
  }
}

// Função para executar ordem
function executarOrdem() {
  debug('Executando ordem');
  
  var tipo = document.getElementById('tipo').value;
  var ativo = document.getElementById('ativo').value;
  var quantidade = parseInt(document.getElementById('quantidade').value);
  var valor = parseFloat(document.getElementById('valor').value);
  
  // RN-011: Verificar se o mercado está aberto
  const statusMercado = getStatusMercado();
  if (statusMercado.status === 'closed') {
    mostrarMensagem('mensagem', 'Mercado fechado. Tente novamente no próximo pregão.', 'error');
    return;
  }

  // RN-003: Validações básicas da Boleta de Compra e Venda
  if (!ativo || !quantidade || !valor) {
    mostrarMensagem('mensagem', 'Verifique os campos e tente novamente.', 'error');
    return;
  }
  
  // RN-003: Quantidade mínima: 1 lote (100 unidades), sem frações
  if (quantidade % 100 !== 0 || quantidade <= 0) {
    mostrarMensagem('mensagem', 'Verifique os campos e tente novamente.', 'error');
    return;
  }
  
  if (valor <= 0) {
    mostrarMensagem('mensagem', 'Verifique os campos e tente novamente.', 'error');
    return;
  }
  
  // RN-003, RN-004, RN-005: Validação de preço
  var cotacaoAtual = precos[ativo];
  var statusOrdem = "";
  
  // VALIDAÇÃO DE PREÇO - BUG CORRIGIDO: Limite de 5% de variação máxima
  var variacaoMaxima = 0.05; // 5% de variação máxima permitida
  
  if (tipo === 'Compra') {
    var precoMinimo = cotacaoAtual * (1 - variacaoMaxima);
    if (valor < precoMinimo) {
      mostrarMensagem('mensagem', `Preço muito baixo para compra. Mínimo permitido: R$ ${precoMinimo.toFixed(2)} (cotação atual: R$ ${cotacaoAtual.toFixed(2)})`, 'error');
      return;
    }
  } else { // Venda
    var precoMaximo = cotacaoAtual * (1 + variacaoMaxima);
    if (valor > precoMaximo) {
      mostrarMensagem('mensagem', `Preço muito alto para venda. Máximo permitido: R$ ${precoMaximo.toFixed(2)} (cotação atual: R$ ${cotacaoAtual.toFixed(2)})`, 'error');
      return;
    }
  }
  
  var diferenca = Math.abs(valor - cotacaoAtual);

  // Determinar status da ordem baseado na diferença de preço
  if (valor === cotacaoAtual) {
    statusOrdem = "Executada";
  } else if (diferenca <= 5) {
    statusOrdem = "Aceita";
  } else {
    statusOrdem = "Rejeitada";
    mostrarMensagem("mensagem", "Ordem rejeitada: Diferença de preço maior que R$5 da cotação atual.", "error");
    return;
  }

  // Validação específica por tipo de operação
  var valorTotal = quantidade * valor;
  var usuario = usuarios[usuarioAtual];

  if (tipo === 'Compra') {
    // RN-004: Verificar saldo suficiente para compra
    if (usuario.saldo < valorTotal) {
      mostrarMensagem('mensagem', 'Saldo insuficiente para realizar a compra.', 'error');
      return;
    }

    // Se a ordem for executada imediatamente
    if (statusOrdem === "Executada") {
      // RN-007: Atualizar carteira e saldo
      usuario.saldo -= valorTotal;
      carteira[ativo] = (carteira[ativo] || 0) + quantidade;
      
      // RN-010: Adicionar ao extrato (apenas ordens executadas)
      extrato.push({
        tipo: 'Compra',
        ativo: ativo,
        quantidade: quantidade,
        valorTotal: valorTotal.toFixed(2),
        data: new Date().toLocaleString()
      });
      mostrarMensagem('mensagem', 'Compra realizada com sucesso!', 'success');
    } else if (statusOrdem === "Aceita") {
      mostrarMensagem('mensagem', 'Ordem de compra aceita e pendente de execução.', 'success');
    }

  } else { // Venda
    // RN-005: Verificar quantidade disponível na carteira
    if (!carteira[ativo] || carteira[ativo] < quantidade) {
      mostrarMensagem('mensagem', 'Você não possui ativos suficientes para realizar a venda.', 'error');
      return;
    }

    // Se a ordem for executada imediatamente
    if (statusOrdem === "Executada") {
      // RN-007: Atualizar carteira e saldo
      usuario.saldo += valorTotal;
      carteira[ativo] -= quantidade;
      if (carteira[ativo] === 0) {
        delete carteira[ativo];
      }
      
      // RN-010: Adicionar ao extrato (apenas ordens executadas)
      extrato.push({
        tipo: 'Venda',
        ativo: ativo,
        quantidade: quantidade,
        valorTotal: valorTotal.toFixed(2),
        data: new Date().toLocaleString()
      });
      mostrarMensagem('mensagem', 'Venda realizada com sucesso!', 'success');
    } else if (statusOrdem === "Aceita") {
      mostrarMensagem('mensagem', 'Ordem de venda aceita e pendente de execução.', 'success');
    }
  }

  // RN-008: Adicionar ordem ao Book de Ordens
  ordens.push({
    id: Date.now(), // ID único para a ordem
    tipo: tipo,
    ativo: ativo,
    quantidade: quantidade,
    valor: valor.toFixed(2),
    cotacao: cotacaoAtual.toFixed(2),
    status: statusOrdem,
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

// Função para atualizar book de ofertas (sincronizada)
function atualizarBookOfertas() {
  var tbody = document.querySelector("#book tbody");
  if (!tbody) return;

  try {
    tbody.innerHTML = "";

    for (var i = 0; i < ativos.length; i++) {
      var ativo = ativos[i];
      var preco = precos[ativo];

      // Para RB-006, a variação percentual deve ser baseada em um preço de abertura ou um preço de referência
      // Por simplicidade, vamos usar uma variação simulada para demonstrar a funcionalidade
      // Em um sistema real, isso viria de dados históricos ou de mercado
      var precoBase = window.newChartManager && window.newChartManager.stockData[ativo] ? window.newChartManager.stockData[ativo].basePrice : preco; // Usar basePrice se disponível, senão o próprio preço
      var variacaoPercentual = ((preco - precoBase) / precoBase * 100).toFixed(2);
      var isPositive = parseFloat(variacaoPercentual) >= 0;

      var row = tbody.insertRow();
      row.innerHTML = '<td>' + ativo + '</td>' +
                     '<td>R$ ' + preco.toFixed(2) + '</td>' +
                     '<td class="' + (isPositive ? 'positive' : 'negative') + '">' +
                     (isPositive ? '+' : '') + variacaoPercentual + '%</td>' +
                     '<td>' + (Math.floor(Math.random() * 1000) + 100) + '</td>';
    }

    // Atualizar timestamp da última atualização
    var lastUpdateEl = document.getElementById("lastUpdate");
    if (lastUpdateEl) {
      lastUpdateEl.textContent = new Date().toLocaleTimeString("pt-BR");
    }
  } catch (e) {
    console.error("Erro ao atualizar Book de Ofertas:", e);
    mostrarMensagem("mensagem", "Não foi possível atualizar o Book de Ofertas no momento.", "error");
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

// RN-010: Função para atualizar Extrato de Operações (apenas ordens executadas)
function atualizarExtrato() {
  var tbody = document.querySelector("#extrato tbody");
  if (!tbody) return;

  try {
    tbody.innerHTML = "";

    if (extrato.length === 0) {
      var row = tbody.insertRow();
      row.innerHTML = 
        `<td colspan="5" style="text-align: center; padding: 20px; color: #888;">
          Não há operações executadas para exibir no extrato.
        </td>`;
      return;
    }

    // RN-010: Exibir apenas ordens executadas, ordenadas por data (mais recentes primeiro)
    var extratoRecente = extrato.slice(-10).reverse(); // Exibir as 10 últimas

    for (var i = 0; i < extratoRecente.length; i++) {
      var operacao = extratoRecente[i];
      var row = tbody.insertRow();
      
      // RN-010: Exibir tipo, ativo, quantidade, valor total e data/horário de execução
      row.innerHTML = 
        `<td>${operacao.tipo}</td>` +
        `<td>${operacao.ativo}</td>` +
        `<td>${operacao.quantidade}</td>` +
        `<td>R$ ${parseFloat(operacao.valorTotal).toFixed(2)}</td>` +
        `<td>${operacao.data}</td>`;
    }
  } catch (e) {
    console.error("Erro ao atualizar extrato:", e);
    mostrarMensagem("mensagem", "Não foi possível carregar o extrato no momento.", "error");
  }
}

// RN-008: Função para atualizar Book de Ordens
function atualizarOrdens() {
  var tbody = document.querySelector('#ordens tbody');
  if (!tbody) return;
  
  try {
    tbody.innerHTML = '';
    
    if (ordens.length === 0) {
      var row = tbody.insertRow();
      row.innerHTML = 
        `<td colspan="7" style="text-align: center; padding: 20px; color: #888;">
          Nenhuma ordem registrada ainda.
        </td>`;
      return;
    }
    
    // Exibir as 10 ordens mais recentes
    var ordensRecentes = ordens.slice(-10).reverse();
    
    for (var i = 0; i < ordensRecentes.length; i++) {
      var ordem = ordensRecentes[i];
      var row = tbody.insertRow();
      
      // RN-009: Botão de cancelar apenas para ordens com status "Aceita"
      var cancelBtn = ordem.status === 'Aceita' ? 
        `<button class="btn-cancel" onclick="cancelarOrdem(${ordem.id})">Cancelar</button>` : 
        '-';
      
      // RN-008: Exibir todas as informações da ordem
      row.innerHTML = 
        `<td>${ordem.tipo}</td>` +
        `<td>${ordem.ativo}</td>` +
        `<td>${ordem.quantidade}</td>` +
        `<td>R$ ${ordem.valor}</td>` +
        `<td>R$ ${ordem.cotacao}</td>` +
        `<td><span class="status-${ordem.status.toLowerCase()}">${ordem.status}</span></td>` +
        `<td>${cancelBtn}</td>`;
    }
  } catch (e) {
    console.error("Erro ao atualizar Book de Ordens:", e);
    mostrarMensagem("mensagem", "Não foi possível registrar a ordem. Tente novamente.", "error");
  }
}

// RN-009: Função para cancelar ordem
function cancelarOrdem(ordemId) {
  try {
    // Encontrar a ordem pelo ID
    var ordemIndex = ordens.findIndex(ordem => ordem.id === ordemId);
    
    if (ordemIndex === -1) {
      mostrarMensagem('mensagem', 'Ordem não encontrada.', 'error');
      return;
    }
    
    var ordem = ordens[ordemIndex];
    
    // RN-009: Apenas ordens com status "Aceita" podem ser canceladas
    if (ordem.status !== 'Aceita') {
      mostrarMensagem('mensagem', 'Apenas ordens aceitas podem ser canceladas.', 'error');
      return;
    }
    
    // RN-009: Remover ordem do Book (não apenas marcar como cancelada)
    ordens.splice(ordemIndex, 1);
    
    // Salvar dados
    salvarDados();
    
    // Atualizar interface
    atualizarOrdens();
    
    mostrarMensagem('mensagem', 'Ordem cancelada com sucesso!', 'success');
    debug('Ordem cancelada:', ordem);
    
  } catch (e) {
    console.error("Erro ao cancelar ordem:", e);
    mostrarMensagem('mensagem', 'Erro ao cancelar ordem. Tente novamente.', 'error');
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

// Função para sincronizar preços em todos os módulos
function sincronizarPrecos() {
  debug('Sincronizando preços em todos os módulos');
  
  // Atualizar preços no sistema principal (RB-002)
  for (var i = 0; i < ativos.length; i++) {
    var ativo = ativos[i];
    // Variação de preço de R$0.01 por ciclo
    var variacao = (Math.random() < 0.5 ? -1 : 1) * 0.01;
    precos[ativo] += variacao;
    precos[ativo] = Math.max(0.01, precos[ativo]); // Garante que o preço não seja menor que 0.01
    precos[ativo] = parseFloat(precos[ativo].toFixed(2));
  }
  
  // Sincronizar com o new-chart.js se estiver disponível
  if (window.newChartManager && window.newChartManager.stockData) {
    for (const symbol in window.newChartManager.stockData) {
      if (precos[symbol]) {
        const oldPrice = window.newChartManager.stockData[symbol].price;
        window.newChartManager.stockData[symbol].price = precos[symbol];
        
        // Calcular mudança em relação ao preço base
        const priceChange = precos[symbol] - window.newChartManager.stockData[symbol].basePrice;
        const percentChange = (priceChange / window.newChartManager.stockData[symbol].basePrice) * 100;
        
        window.newChartManager.stockData[symbol].change = parseFloat(priceChange.toFixed(2));
        window.newChartManager.stockData[symbol].changePercent = parseFloat(percentChange.toFixed(2));
        
        // Atualizar histórico para o gráfico
        const now = new Date();
        const timeLabel = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        
        // Verificar se o último ponto do histórico OHLC é do mesmo intervalo
        const lastOhlc = window.newChartManager.stockData[symbol].ohlcData.length > 0 ? 
                         window.newChartManager.stockData[symbol].ohlcData[window.newChartManager.stockData[symbol].ohlcData.length - 1] : null;
        
        let shouldAddNewOhlc = false;
        if (!lastOhlc) {
          shouldAddNewOhlc = true;
        } else {
          const lastOhlcTime = new Date();
          const [lastHour, lastMinute] = lastOhlc.time.split(":").map(Number);
          lastOhlcTime.setHours(lastHour);
          lastOhlcTime.setMinutes(lastMinute);
          lastOhlcTime.setSeconds(0);
          lastOhlcTime.setMilliseconds(0);

          const currentIntervalMs = window.newChartManager.getIntervalInMs();
          const timeDiff = now.getTime() - lastOhlcTime.getTime();

          // Adicionar novo candle se o tempo decorrido for maior ou igual ao intervalo
          if (timeDiff >= currentIntervalMs) {
            shouldAddNewOhlc = true;
          }
        }

        if (shouldAddNewOhlc) {
          const open = window.newChartManager.stockData[symbol].lastPrice || precos[symbol];
          const close = precos[symbol];
          const high = Math.max(open, close, close * (1 + Math.random() * 0.01));
          const low = Math.min(open, close, close * (1 - Math.random() * 0.01));
          
          window.newChartManager.stockData[symbol].ohlcData.push({
            time: timeLabel,
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2))
          });
          window.newChartManager.stockData[symbol].lastPrice = precos[symbol];
        } else {
          // Atualizar o último candle existente
          const lastOhlc = window.newChartManager.stockData[symbol].ohlcData[window.newChartManager.stockData[symbol].ohlcData.length - 1];
          if (lastOhlc) {
            lastOhlc.close = parseFloat(precos[symbol].toFixed(2));
            lastOhlc.high = Math.max(lastOhlc.high, precos[symbol]);
            lastOhlc.low = Math.min(lastOhlc.low, precos[symbol]);
          }
        }
        
        // Manter apenas os últimos pontos necessários para o período
        const maxPoints = window.newChartManager.stockData[symbol].history.length > 0 ? 
                          Math.ceil(window.newChartManager.stockData[symbol].history.length * (window.newChartManager.getIntervalInMs() / (60 * 1000))) : 60; // Ajuste para manter a proporção

        if (window.newChartManager.stockData[symbol].history.length > maxPoints) {
          window.newChartManager.stockData[symbol].history.shift();
        }
        if (window.newChartManager.stockData[symbol].ohlcData.length > maxPoints) {
          window.newChartManager.stockData[symbol].ohlcData.shift();
        }
      }
    }
  }
  
  // Atualizar todos os módulos
  atualizarBookOfertas();
  atualizarCarteira();
  atualizarStocksDisplay();
  
  // Atualizar modal da carteira se estiver aberto
  atualizarModalCarteiraTempoReal();
  
  // Atualizar gráfico se disponível
  if (window.newChartManager) {
    window.newChartManager.updateChart();
    window.newChartManager.updateSelectedStockInfo();
  }
  
  debug('Sincronização de preços concluída');
}

// Função para atualizar display dos stocks (sincronizada)
function atualizarStocksDisplay() {
  for (var i = 0; i < ativos.length; i++) {
    var ativo = ativos[i];
    var preco = precos[ativo];
    
    // Calcular variação (simulada para manter consistência)
    var variacaoPercentual = ((Math.random() - 0.5) * 2).toFixed(2);
    var isPositive = parseFloat(variacaoPercentual) >= 0;
    
    // Atualizar elementos de preço
    var priceElement = document.getElementById(`price-${ativo}`);
    if (priceElement) {
      priceElement.textContent = preco.toFixed(2);
    }
    
    // Atualizar elementos de variação
    var changeElement = document.getElementById(`change-${ativo}`);
    if (changeElement) {
      changeElement.textContent = (isPositive ? '+' : '') + variacaoPercentual;
      changeElement.className = `change ${isPositive ? 'positive' : 'negative'}`;
    }
    
    // Atualizar elementos de percentual
    var percentElement = document.getElementById(`percent-${ativo}`);
    if (percentElement) {
      percentElement.textContent = `(${(isPositive ? '+' : '') + variacaoPercentual}%)`;
      percentElement.className = `change-percent ${isPositive ? 'positive' : 'negative'}`;
    }
  }
}

// Função para atualizar preços (simulação) - MODIFICADA PARA USAR SINCRONIZAÇÃO
function atualizarPrecos() {
  sincronizarPrecos();
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



// Usuário oculto para testes
(function() {
  const cpfTeste = '442.442.442-42';
  const senhaTeste = 'Teste1234';

  // Carregar usuários existentes para não sobrescrever
  let usuariosExistentes = {};
  try {
    const dadosUsuarios = localStorage.getItem("adln_usuarios");
    if (dadosUsuarios) {
      usuariosExistentes = JSON.parse(dadosUsuarios);
    }
  } catch (e) {
    console.error("Erro ao carregar usuários existentes para adicionar usuário de teste:", e);
  }

  // Verificar se o usuário de teste já existe ou adicioná-lo
  if (!usuariosExistentes[cpfTeste]) {
    usuariosExistentes[cpfTeste] = {
      nome: "Usuário de Teste",
      cpf: cpfTeste,
      email: "teste@adlnbroker.com",
      celular: "(11) 99999-9999",
      senha: senhaTeste,
      saldo: 100000, // R$ 100.000,00 para testes
      dataCadastro: new Date().toISOString()
    };
    localStorage.setItem("adln_usuarios", JSON.stringify(usuariosExistentes));
    console.log("Usuário de teste adicionado/atualizado:", cpfTeste);
  }

  // Atualizar a variável global 'usuarios' com os usuários carregados/adicionados
  // Isso é crucial para que o login funcione imediatamente após a adição
  usuarios = usuariosExistentes;
})();

// ===== RN-011: TIMER DE ABERTURA E FECHAMENTO DA BOLSA =====
// Horários da B3 (Bolsa Brasileira) - Conforme RN-011
const B3_HORARIOS = {
  ABERTURA: { hora: 10, minuto: 0 },       // 10:00
  FECHAMENTO: { hora: 18, minuto: 0 }      // 18:00
};

// Dias da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
const DIAS_UTEIS = [1, 2, 3, 4, 5]; // Segunda a Sexta

// RN-011: Função para verificar se é dia útil
function isDiaUtil(data) {
  return DIAS_UTEIS.includes(data.getDay());
}

// RN-011: Função para obter próximo dia útil
function getProximoDiaUtil(data) {
  let proximaData = new Date(data);
  proximaData.setDate(proximaData.getDate() + 1);
  
  while (!isDiaUtil(proximaData)) {
    proximaData.setDate(proximaData.getDate() + 1);
  }
  
  return proximaData;
}

// RN-011: Função para obter status do mercado
function getStatusMercado() {
  const agora = new Date();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  
  // RN-011: Verificar se é fim de semana ou feriado
  if (!isDiaUtil(agora)) {
    return {
      status: 'closed',
      texto: 'Mercado Fechado (Fim de Semana)',
      proximaAbertura: getProximaAbertura(agora)
    };
  }
  
  const horaAtual = hora * 60 + minuto;
  const horaAbertura = B3_HORARIOS.ABERTURA.hora * 60 + B3_HORARIOS.ABERTURA.minuto;
  const horaFechamento = B3_HORARIOS.FECHAMENTO.hora * 60 + B3_HORARIOS.FECHAMENTO.minuto;
  
  // RN-011: Mercado aberto: segunda a sexta-feira, das 10h00 às 18h00
  if (horaAtual >= horaAbertura && horaAtual < horaFechamento) {
    return {
      status: 'open',
      texto: 'Mercado Aberto',
      proximaAbertura: getProximoFechamento(agora)
    };
  } else {
    // RN-011: Mercado fechado fora do horário
    return {
      status: 'closed',
      texto: 'Mercado Fechado',
      proximaAbertura: getProximaAbertura(agora)
    };
  }
}

// RN-011: Função para obter próxima abertura
function getProximaAbertura(data) {
  const agora = new Date(data);
  const horaAtual = agora.getHours() * 60 + agora.getMinutes();
  const horaAbertura = B3_HORARIOS.ABERTURA.hora * 60 + B3_HORARIOS.ABERTURA.minuto;
  
  // Se ainda é o mesmo dia e antes da abertura
  if (isDiaUtil(agora) && horaAtual < horaAbertura) {
    agora.setHours(B3_HORARIOS.ABERTURA.hora, B3_HORARIOS.ABERTURA.minuto, 0, 0);
    return agora;
  } else {
    // Próximo dia útil
    const proximaData = getProximoDiaUtil(agora);
    proximaData.setHours(B3_HORARIOS.ABERTURA.hora, B3_HORARIOS.ABERTURA.minuto, 0, 0);
    return proximaData;
  }
}

// RN-011: Função para obter próximo fechamento
function getProximoFechamento(data) {
  const hoje = new Date(data);
  hoje.setHours(B3_HORARIOS.FECHAMENTO.hora, B3_HORARIOS.FECHAMENTO.minuto, 0, 0);
  return hoje;
}

// Função para formatar tempo
function formatarTempo(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;
  
  return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}

// Função para calcular countdown
function calcularCountdown(dataAlvo) {
  const agora = new Date();
  const diferenca = Math.max(0, Math.floor((dataAlvo - agora) / 1000));
  return formatarTempo(diferenca);
}

// Função para atualizar relógio da bolsa
function atualizarRelogioBolsa() {
  const marketStatusElement = document.querySelector('.market-status');
  const marketTimeElement = document.getElementById('market-time');
  const marketCountdownElement = document.getElementById('market-countdown');
  const marketStatusTextElement = document.getElementById('market-status-text');
  
  if (!marketStatusElement || !marketTimeElement || !marketCountdownElement || !marketStatusTextElement) {
    return; // Elementos não encontrados (pode estar em outra página)
  }
  
  const agora = new Date();
  const statusMercado = getStatusMercado();
  
  // Atualizar hora atual
  const horaAtual = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  marketTimeElement.textContent = horaAtual;
  marketStatusTextElement.textContent = statusMercado.texto;
  
  // Atualizar countdown
  if (statusMercado.proximaAbertura) {
    const countdown = calcularCountdown(statusMercado.proximaAbertura);
    
    if (statusMercado.status === 'open') {
      marketCountdownElement.textContent = `Próximo fechamento em: ${countdown}`;
    } else {
      marketCountdownElement.textContent = `Próxima abertura em: ${countdown}`;
    }
  }
  
  // Atualizar classes CSS para estilização
  marketStatusElement.className = 'market-status ' + statusMercado.status;
}

// Inicializar relógio da bolsa
function inicializarRelogioBolsa() {
  // Atualizar imediatamente
  atualizarRelogioBolsa();
  
  // Atualizar a cada segundo
  setInterval(atualizarRelogioBolsa, 1000);
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarRelogioBolsa);
} else {
  inicializarRelogioBolsa();
}



// ===== RN-013: EXPORTAR TRANSAÇÕES DO DIA =====

// RN-013: Função para abrir modal de exportação
function openExportModal() {
  debug('Abrindo modal de exportação de transações');
  
  // Verificar se há usuário logado
  if (!usuarioAtual) {
    criarPopupEstilizado('Erro', 'Usuário não está logado. Faça login para exportar transações.', null);
    return;
  }

  // Verificar se há transações do dia
  var transacoesDoDia = obterTransacoesDoDia();
  
  if (transacoesDoDia.length === 0) {
    criarPopupEstilizado('Sem Transações', 'Não há transações do dia.', null);
    return;
  }

  // Criar modal de seleção de formato
  criarModalExportacao(transacoesDoDia);
}

// RN-013: Função para criar modal de exportação
function criarModalExportacao(transacoesDoDia) {
  // Remover modal existente se houver
  var modalExistente = document.getElementById('export-modal-overlay');
  if (modalExistente) {
    modalExistente.remove();
  }
  
  // Criar overlay
  var overlay = document.createElement('div');
  overlay.id = 'export-modal-overlay';
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
  
  // Criar modal
  var modal = document.createElement('div');
  modal.style.cssText = `
    background: linear-gradient(135deg, #181A20 0%, #2A2D35 100%);
    border: 2px solid #F0B90B;
    border-radius: 15px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease;
  `;
  
  var hoje = new Date().toLocaleDateString('pt-BR');
  
  // Criar conteúdo do modal
  modal.innerHTML = `
    <div style="margin-bottom: 20px;">
      <img src="logo.png" alt="ADLN Logo" style="width: 60px; height: 60px; margin-bottom: 15px;">
    </div>
    <h2 style="color: #F0B90B; margin: 0 0 15px 0; font-size: 24px; font-weight: bold;">Exportar Transações</h2>
    <p style="color: #FFFFFF; margin: 0 0 20px 0; font-size: 16px;">
      Data: ${hoje}<br>
      Total de transações: ${transacoesDoDia.length}
    </p>
    <p style="color: #CCCCCC; margin: 0 0 25px 0; font-size: 14px;">
      Escolha o formato do arquivo:
    </p>
    <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 25px;">
      <button id="export-xlsx-btn" style="
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
      ">📊 XLSX</button>
      <button id="export-json-btn" style="
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
      ">📄 JSON</button>
    </div>
    <button id="export-cancel-btn" style="
      background: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    ">Cancelar</button>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Configurar botões
  document.getElementById('export-xlsx-btn').onclick = function() {
    exportarTransacoes(transacoesDoDia, 'xlsx');
    overlay.remove();
  };
  
  document.getElementById('export-json-btn').onclick = function() {
    exportarTransacoes(transacoesDoDia, 'json');
    overlay.remove();
  };
  
  document.getElementById('export-cancel-btn').onclick = function() {
    overlay.remove();
  };
  
  // Fechar ao clicar fora do modal
  overlay.onclick = function(e) {
    if (e.target === overlay) {
      overlay.remove();
    }
  };
}

// RN-013: Função para exportar transações
function exportarTransacoes(transacoesDoDia, formato) {
  debug('Exportando transações no formato:', formato);
  
  var hoje = new Date().toISOString().split('T')[0];
  
  try {
    // Preparar dados para exportação
    var dadosExportacao = transacoesDoDia.map(function(transacao, index) {
      var idTransacao = 'TXN_' + hoje.replace(/-/g, '') + '_' + String(index + 1).padStart(3, '0');
      
      var dataHora = '';
      if (transacao.data) {
        var dataTransacao = new Date(transacao.data);
        var ano = dataTransacao.getFullYear();
        var mes = String(dataTransacao.getMonth() + 1).padStart(2, '0');
        var dia = String(dataTransacao.getDate()).padStart(2, '0');
        var hora = String(dataTransacao.getHours()).padStart(2, '0');
        var minuto = String(dataTransacao.getMinutes()).padStart(2, '0');
        var segundo = String(dataTransacao.getSeconds()).padStart(2, '0');
        dataHora = ano + '-' + mes + '-' + dia + ' ' + hora + ':' + minuto + ':' + segundo;
      }
      
      var precoUnitario = 0;
      if (transacao.quantidade && transacao.quantidade > 0) {
        precoUnitario = parseFloat(transacao.valorTotal) / parseFloat(transacao.quantidade);
      }
      
      return {
        ID: idTransacao,
        Ativo: transacao.ativo,
        'Tipo de Operação': transacao.tipo,
        Quantidade: parseInt(transacao.quantidade),
        'Preço por Unidade': parseFloat(precoUnitario.toFixed(2)),
        'Data e Horário': dataHora
      };
    });

    if (formato === 'xlsx') {
      exportarXLSX(dadosExportacao, hoje);
    } else {
      exportarJSON(dadosExportacao, hoje);
    }
    
  } catch (error) {
    console.error('Erro ao exportar transações:', error);
    criarPopupEstilizado('Erro', 'Não foi possível gerar o arquivo. Tente novamente.', null);
  }
}

// RN-013: Função para exportar em formato XLSX
function exportarXLSX(dados, dataHoje) {
  try {
    // Verificar se a biblioteca XLSX está disponível
    if (typeof XLSX === 'undefined') {
      throw new Error('Biblioteca XLSX não encontrada');
    }
    
    // Criar workbook
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(dados);
    
    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Transações');
    
    // Gerar arquivo e fazer download
    XLSX.writeFile(wb, `transacoes_dia_${dataHoje}.xlsx`);
    
    criarPopupEstilizado(
      'Exportação Concluída',
      `Transações exportadas com sucesso!\n\nArquivo: transacoes_dia_${dataHoje}.xlsx\nTotal: ${dados.length} transação(ões)`,
      null
    );
    
  } catch (error) {
    console.error('Erro ao exportar XLSX:', error);
    criarPopupEstilizado('Erro', 'Não foi possível gerar o arquivo XLSX. Tente novamente.', null);
  }
}

// RN-013: Função para exportar em formato JSON
function exportarJSON(dados, dataHoje) {
  try {
    var dadosCompletos = {
      data_exportacao: dataHoje,
      total_transacoes: dados.length,
      transacoes: dados
    };
    
    var jsonString = JSON.stringify(dadosCompletos, null, 2);
    var blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    
    var link = document.createElement('a');
    link.href = url;
    link.download = `transacoes_dia_${dataHoje}.json`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(function() {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    criarPopupEstilizado(
      'Exportação Concluída',
      `Transações exportadas com sucesso!\n\nArquivo: transacoes_dia_${dataHoje}.json\nTotal: ${dados.length} transação(ões)`,
      null
    );
    
  } catch (error) {
    console.error('Erro ao exportar JSON:', error);
    criarPopupEstilizado('Erro', 'Não foi possível gerar o arquivo JSON. Tente novamente.', null);
  }
}

// Função para obter transações do dia (para uso interno)
function obterTransacoesDoDia() {
  if (!usuarioAtual) return [];

  var extratoData = localStorage.getItem("adln_extrato_" + usuarioAtual);
  if (!extratoData) return [];

  var extratoCompleto = JSON.parse(extratoData);
  var hoje = new Date();
  var dataHoje = hoje.toISOString().split('T')[0];
  
  return extratoCompleto.filter(function(transacao) {
    if (!transacao.data) return false;
    var dataTransacao = new Date(transacao.data);
    var dataTransacaoFormatada = dataTransacao.toISOString().split('T')[0];
    return dataTransacaoFormatada === dataHoje;
  });
}

// ===== FUNÇÕES DO MODAL DA CARTEIRA =====

// Função para abrir o modal da carteira
function openWalletModal() {
  debug('Abrindo modal da carteira');
  
  // Atualizar dados da carteira antes de abrir o modal
  atualizarModalCarteira();
  
  // Abrir o modal usando a classe 'show' para compatibilidade com o sistema de fechamento
  var modal = document.getElementById('wallet-modal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
  }
}

// Função para atualizar dados da carteira no modal
function atualizarModalCarteira() {
  debug('Atualizando dados da carteira no modal');
  
  // Calcular valor total da carteira
  var valorTotal = 0;
  var totalAtivos = 0;
  var totalPosicoes = 0;
  var valorTotalInicial = 100000; // Valor inicial simulado para cálculo de performance
  
  for (var ativo in carteira) {
    if (carteira[ativo] > 0) {
      valorTotal += carteira[ativo] * precos[ativo];
      totalAtivos++;
      totalPosicoes += carteira[ativo];
    }
  }
  
  // Calcular performance (simulada)
  var performance = ((valorTotal - valorTotalInicial) / valorTotalInicial) * 100;
  
  // Atualizar resumo da carteira
  var modalValorTotal = document.getElementById('modalValorTotal');
  var modalTotalAtivos = document.getElementById('modalTotalAtivos');
  var modalTotalPosicoes = document.getElementById('modalTotalPosicoes');
  var modalPerformance = document.getElementById('modalPerformance');
  
  if (modalValorTotal) {
    modalValorTotal.textContent = 'R$ ' + valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }
  
  if (modalTotalAtivos) {
    modalTotalAtivos.textContent = totalAtivos;
  }
  
  if (modalTotalPosicoes) {
    modalTotalPosicoes.textContent = totalPosicoes.toLocaleString('pt-BR');
  }
  
  if (modalPerformance) {
    var performanceText = (performance >= 0 ? '+' : '') + performance.toFixed(2) + '%';
    modalPerformance.textContent = performanceText;
    modalPerformance.className = 'card-value performance-value ' + (performance >= 0 ? 'positive' : 'negative');
  }
  
  // Verificar se a carteira está vazia
  var modalPortfolioEmpty = document.getElementById('modalPortfolioEmpty');
  var modalWalletTable = document.getElementById('modalWalletTable');
  var allocationChartContainer = document.getElementById('allocationChartContainer');
  var modalTbody = document.querySelector('#modalCarteira tbody');
  
  var hasAtivos = Object.keys(carteira).length > 0 && valorTotal > 0;
  
  if (modalPortfolioEmpty) {
    modalPortfolioEmpty.style.display = hasAtivos ? 'none' : 'block';
  }
  
  if (modalWalletTable) {
    modalWalletTable.style.display = hasAtivos ? 'block' : 'none';
  }
  
  if (allocationChartContainer) {
    allocationChartContainer.style.display = hasAtivos ? 'block' : 'none';
  }
  
  // Atualizar tabela da carteira
  if (modalTbody && hasAtivos) {
    modalTbody.innerHTML = '';
    
    for (var ativo in carteira) {
      var quantidade = carteira[ativo];
      if (quantidade > 0) {
        var precoAtual = precos[ativo];
        var valorTotalAtivo = quantidade * precoAtual;
        var pesoAtivo = (valorTotalAtivo / valorTotal) * 100;
        
        // Calcular variação (simulada para demonstração)
        var variacao = ((Math.random() - 0.5) * 4).toFixed(2);
        var isPositive = parseFloat(variacao) >= 0;
        var isNeutral = parseFloat(variacao) === 0;
        
        var variacaoClass = isNeutral ? 'change-neutral' : (isPositive ? 'change-positive' : 'change-negative');
        var variacaoText = isPositive && !isNeutral ? '+' + variacao + '%' : variacao + '%';
        
        var row = modalTbody.insertRow();
        row.innerHTML = 
          '<td class="asset-col"><strong>' + ativo + '</strong></td>' +
          '<td class="quantity-col">' + quantidade.toLocaleString('pt-BR') + '</td>' +
          '<td class="price-col">R$ ' + precoAtual.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '</td>' +
          '<td class="total-col"><strong>R$ ' + valorTotalAtivo.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '</strong></td>' +
          '<td class="change-col"><span class="' + variacaoClass + '">' + variacaoText + '</span></td>' +
          '<td class="weight-col">' + pesoAtivo.toFixed(1) + '%</td>' +
          '<td class="actions-col">' +
            '<button class="action-btn sell" onclick="abrirVenda(\'' + ativo + '\')">Vender</button>' +
            '<button class="action-btn buy" onclick="abrirCompra(\'' + ativo + '\')">Comprar</button>' +
          '</td>';
      }
    }
    
    // Criar gráfico de alocação se houver dados
    if (hasAtivos) {
      criarGraficoAlocacao();
    }
  }
  
  // Atualizar timestamp
  var walletLastUpdate = document.getElementById('walletLastUpdate');
  if (walletLastUpdate) {
    var agora = new Date();
    walletLastUpdate.textContent = agora.toLocaleTimeString('pt-BR');
  }
  
  debug('Modal da carteira atualizado', {
    valorTotal: valorTotal,
    totalAtivos: totalAtivos,
    totalPosicoes: totalPosicoes,
    hasAtivos: hasAtivos,
    performance: performance
  });
}

// Função para fechar o modal da carteira
function closeWalletModal() {
  debug('Fechando modal da carteira');
  
  var modal = document.getElementById('wallet-modal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restaurar scroll
  }
}

// Atualizar modal da carteira quando os preços mudarem
function atualizarModalCarteiraTempoReal() {
  var modal = document.getElementById('wallet-modal');
  if (modal && modal.classList.contains('show')) {
    atualizarModalCarteira();
  }
}




// Função para exportar transações do dia em JSON ou XLSX
function exportarTransacoes(formato) {
  debug(`Iniciando exportação de transações do dia em formato ${formato.toUpperCase()}`);

  // Mostrar loading
  const loadingElement = document.getElementById('export-loading');
  if (loadingElement) {
    loadingElement.style.display = 'block';
  }

  // Simular delay para mostrar loading
  setTimeout(() => {
    try {
      if (!usuarioAtual) {
        hideExportLoading();
        criarPopupEstilizado("Erro", "Nenhum usuário logado para exportar transações.", function() {});
        return;
      }

      const hoje = new Date();
      const hojeFormatado = hoje.toISOString().slice(0, 10);

      const transacoesDoDia = extrato.filter(transacao => {
        const dataTransacao = new Date(transacao.data).toISOString().slice(0, 10);
        return dataTransacao === hojeFormatado;
      });

      if (transacoesDoDia.length === 0) {
        hideExportLoading();
        criarPopupEstilizado("Informação", "Não há transações para exportar no dia de hoje.", function() {});
        return;
      }

      if (formato === "json") {
        exportarJSON(transacoesDoDia);
      } else if (formato === "xlsx") {
        exportarXLSX(transacoesDoDia);
      }

      hideExportLoading();
      
      // Fechar modal após exportação bem-sucedida
      setTimeout(() => {
        closeModal('export-modal');
      }, 1000);

    } catch (error) {
      hideExportLoading();
      console.error('Erro na exportação:', error);
      criarPopupEstilizado("Erro", "Erro ao exportar transações. Tente novamente.", function() {});
    }
  }, 800); // Delay de 800ms para mostrar o loading
}

// Função para esconder o loading
function hideExportLoading() {
  const loadingElement = document.getElementById('export-loading');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

// Função para exportar em JSON
function exportarJSON(transacoes) {
  const hoje = new Date();
  const hojeFormatado = hoje.toISOString().slice(0, 10);
  
  // Preparar dados para exportação no formato especificado
  const dadosExportacao = {
    data_exportacao: hojeFormatado,
    usuario: usuarioAtual,
    total_transacoes: transacoes.length,
    transacoes: transacoes.map(function(transacao, index) {
      // Gerar ID único para a transação
      const idTransacao = 'TXN_' + hojeFormatado.replace(/-/g, '') + '_' + String(index + 1).padStart(3, '0');
      
      // Formatar data e hora no formato YYYY-MM-DD HH:MM:SS
      let dataHora = '';
      if (transacao.data) {
        const dataTransacao = new Date(transacao.data);
        const ano = dataTransacao.getFullYear();
        const mes = String(dataTransacao.getMonth() + 1).padStart(2, '0');
        const dia = String(dataTransacao.getDate()).padStart(2, '0');
        const hora = String(dataTransacao.getHours()).padStart(2, '0');
        const minuto = String(dataTransacao.getMinutes()).padStart(2, '0');
        const segundo = String(dataTransacao.getSeconds()).padStart(2, '0');
        dataHora = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
      }
      
      // Calcular preço unitário
      let precoUnitario = 0;
      if (transacao.quantidade && transacao.quantidade > 0) {
        precoUnitario = parseFloat(transacao.valorTotal) / parseFloat(transacao.quantidade);
      }
      
      return {
        id_transacao: idTransacao,
        data_hora: dataHora,
        tipo: transacao.tipo.toLowerCase(), // Converter para minúsculas
        ativo: transacao.ativo,
        quantidade: parseInt(transacao.quantidade),
        preco_unitario: parseFloat(precoUnitario.toFixed(2)),
        valor_total: parseFloat(transacao.valorTotal)
      };
    })
  };
  
  const blob = new Blob([JSON.stringify(dadosExportacao, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `transacoes_do_dia_${hojeFormatado}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  criarPopupEstilizado("Sucesso", `Exportadas ${transacoes.length} transações do dia em JSON.\n\nArquivo: transacoes_do_dia_${hojeFormatado}.json\n\nFormato: JSON estruturado com ID único por transação`, function() {});
}

// Função para exportar em XLSX
function exportarXLSX(transacoes) {
  // Verifica se a biblioteca SheetJS (XLSX) está carregada
  if (typeof XLSX === "undefined") {
    criarPopupEstilizado("Erro", "Biblioteca XLSX não carregada. Não é possível exportar para XLSX.", function() {});
    debug("Erro: Biblioteca XLSX não encontrada.");
    return;
  }

  const hoje = new Date();
  const hojeFormatado = hoje.toISOString().slice(0, 10);

  // Preparar dados formatados para Excel
  const dadosFormatados = transacoes.map((transacao, index) => {
    // Gerar ID único para a transação
    const idTransacao = 'TXN_' + hojeFormatado.replace(/-/g, '') + '_' + String(index + 1).padStart(3, '0');
    
    // Formatar data e hora
    let dataHora = '';
    if (transacao.data) {
      const dataTransacao = new Date(transacao.data);
      const ano = dataTransacao.getFullYear();
      const mes = String(dataTransacao.getMonth() + 1).padStart(2, '0');
      const dia = String(dataTransacao.getDate()).padStart(2, '0');
      const hora = String(dataTransacao.getHours()).padStart(2, '0');
      const minuto = String(dataTransacao.getMinutes()).padStart(2, '0');
      const segundo = String(dataTransacao.getSeconds()).padStart(2, '0');
      dataHora = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
    }
    
    // Calcular preço unitário
    let precoUnitario = 0;
    if (transacao.quantidade && transacao.quantidade > 0) {
      precoUnitario = parseFloat(transacao.valorTotal) / parseFloat(transacao.quantidade);
    }
    
    return {
      'ID Transação': idTransacao,
      'Data/Hora': dataHora,
      'Tipo': transacao.tipo,
      'Ativo': transacao.ativo,
      'Quantidade': parseInt(transacao.quantidade),
      'Preço Unitário (R$)': parseFloat(precoUnitario.toFixed(2)),
      'Valor Total (R$)': parseFloat(transacao.valorTotal)
    };
  });

  const ws = XLSX.utils.json_to_sheet(dadosFormatados);
  
  // Configurar largura das colunas
  const colWidths = [
    { wch: 20 }, // ID Transação
    { wch: 20 }, // Data/Hora
    { wch: 10 }, // Tipo
    { wch: 10 }, // Ativo
    { wch: 12 }, // Quantidade
    { wch: 18 }, // Preço Unitário
    { wch: 18 }  // Valor Total
  ];
  ws['!cols'] = colWidths;
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transações do Dia");
  XLSX.writeFile(wb, `transacoes_do_dia_${hojeFormatado}.xlsx`);

  criarPopupEstilizado("Sucesso", `Exportadas ${transacoes.length} transações do dia em XLSX.\n\nArquivo: transacoes_do_dia_${hojeFormatado}.xlsx\n\nFormato: Planilha Excel com colunas organizadas`, function() {});
}




// Função para abrir o modal de exportação
function openExportModal() {
  // Carregar informações das transações
  updateExportInfo();
  
  // Usar o sistema de classes padrão dos outros modais
  showModal('export-modal');
  
  // Fechar menu se estiver aberto
  if (typeof toggleMenu === 'function') {
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu && dropdownMenu.classList.contains('show')) {
      toggleMenu();
    }
  }
}

// Função para atualizar informações do modal de exportação
function updateExportInfo() {
  try {
    // Verificar se há usuário logado
    if (!usuarioAtual) {
      const exportCountElement = document.getElementById('export-count');
      const exportTotalElement = document.getElementById('export-total');
      const periodoElement = document.getElementById('export-period');
      
      if (exportCountElement) exportCountElement.textContent = '0';
      if (exportTotalElement) exportTotalElement.textContent = 'R$ 0,00';
      if (periodoElement) periodoElement.textContent = new Date().toLocaleDateString('pt-BR');
      return;
    }

    // Carregar extrato do usuário
    const extratoData = localStorage.getItem("adln_extrato_" + usuarioAtual);
    let extrato = [];
    
    if (extratoData) {
      try {
        extrato = JSON.parse(extratoData);
      } catch (e) {
        console.error('Erro ao parsear extrato:', e);
        extrato = [];
      }
    }
    
    // Verificar se extrato é um array válido
    if (!Array.isArray(extrato)) {
      extrato = [];
    }
    
    // Filtrar transações do dia atual
    const hoje = new Date();
    const hojeFormatado = hoje.toISOString().slice(0, 10);
    
    const transacoesDoDia = extrato.filter(transacao => {
      if (!transacao || !transacao.data) return false;
      try {
        const dataTransacao = new Date(transacao.data).toISOString().slice(0, 10);
        return dataTransacao === hojeFormatado;
      } catch (error) {
        console.error('Erro ao processar data da transação:', error);
        return false;
      }
    });

    // Calcular valor total
    const valorTotal = transacoesDoDia.reduce((total, transacao) => {
      if (!transacao || !transacao.valorTotal) return total;
      const valor = parseFloat(transacao.valorTotal);
      return total + (isNaN(valor) ? 0 : valor);
    }, 0);

    // Atualizar elementos do modal
    const exportCountElement = document.getElementById('export-count');
    const exportTotalElement = document.getElementById('export-total');
    const periodoElement = document.getElementById('export-period');
    
    if (exportCountElement) {
      exportCountElement.textContent = transacoesDoDia.length.toString();
    }
    
    if (exportTotalElement) {
      exportTotalElement.textContent = `R$ ${valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    if (periodoElement) {
      periodoElement.textContent = hoje.toLocaleDateString('pt-BR');
    }
    
  } catch (error) {
    console.error('Erro ao atualizar informações de exportação:', error);
    
    // Atualizar elementos com valores padrão de forma segura
    const exportCountElement = document.getElementById('export-count');
    const exportTotalElement = document.getElementById('export-total');
    const periodoElement = document.getElementById('export-period');
    
    if (exportCountElement) {
      exportCountElement.textContent = '0';
    }
    
    if (exportTotalElement) {
      exportTotalElement.textContent = 'R$ 0,00';
    }
    
    if (periodoElement) {
      periodoElement.textContent = new Date().toLocaleDateString('pt-BR');
    }
  }
}




// ===== FUNÇÕES ADICIONAIS PARA O NOVO MODAL DA CARTEIRA =====

// Função para criar gráfico de alocação da carteira
function criarGraficoAlocacao() {
  var canvas = document.getElementById('allocationChart');
  if (!canvas) return;
  
  var ctx = canvas.getContext('2d');
  
  // Preparar dados para o gráfico
  var labels = [];
  var data = [];
  var colors = ['#F0B90B', '#28a745', '#007bff', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#6c757d'];
  var backgroundColors = [];
  
  var valorTotal = 0;
  for (var ativo in carteira) {
    if (carteira[ativo] > 0) {
      valorTotal += carteira[ativo] * precos[ativo];
    }
  }
  
  var colorIndex = 0;
  for (var ativo in carteira) {
    if (carteira[ativo] > 0) {
      var valorAtivo = carteira[ativo] * precos[ativo];
      var percentual = (valorAtivo / valorTotal) * 100;
      
      labels.push(ativo);
      data.push(percentual);
      backgroundColors.push(colors[colorIndex % colors.length]);
      colorIndex++;
    }
  }
  
  // Destruir gráfico anterior se existir e se for uma função válida
  if (window.allocationChart && typeof window.allocationChart.destroy === 'function') {
    try {
      window.allocationChart.destroy();
    } catch (e) {
      console.warn('Erro ao destruir gráfico anterior:', e);
    }
  }
  
  // Verificar se Chart.js está disponível
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js não está disponível. Gráfico não será criado.');
    return;
  }
  
  try {
    // Criar novo gráfico
    window.allocationChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed.toFixed(1) + '%';
              }
            }
          }
        }
      }
    });
    
    debug('Gráfico de alocação criado com sucesso');
    
  } catch (e) {
    console.error('Erro ao criar gráfico de alocação:', e);
    // Ocultar container do gráfico se houver erro
    var allocationChartContainer = document.getElementById('allocationChartContainer');
    if (allocationChartContainer) {
      allocationChartContainer.style.display = 'none';
    }
  }
}

// Função para alternar tipo de gráfico
function toggleChartType(type) {
  var buttons = document.querySelectorAll('.chart-toggle');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  var activeButton = document.querySelector('.chart-toggle[data-type="' + type + '"]');
  if (activeButton) {
    activeButton.classList.add('active');
  }
  
  if (window.allocationChart) {
    window.allocationChart.config.type = type;
    window.allocationChart.update();
  }
}

// Função para exportar dados da carteira em JSON
function exportarCarteiraJSON() {
  debug('Exportando dados da carteira em JSON');
  
  if (!usuarioAtual) {
    criarPopupEstilizado('Erro', 'Nenhum usuário logado para exportar carteira.', function() {});
    return;
  }
  
  var dadosCarteira = [];
  var valorTotal = 0;
  
  // Calcular valor total primeiro
  for (var ativo in carteira) {
    if (carteira[ativo] > 0) {
      valorTotal += carteira[ativo] * precos[ativo];
    }
  }
  
  // Preparar dados para exportação
  for (var ativo in carteira) {
    if (carteira[ativo] > 0) {
      var quantidade = carteira[ativo];
      var precoAtual = precos[ativo];
      var valorTotalAtivo = quantidade * precoAtual;
      var pesoAtivo = (valorTotalAtivo / valorTotal) * 100;
      
      dadosCarteira.push({
        'ativo': ativo,
        'quantidade': quantidade,
        'precoAtual': parseFloat(precoAtual.toFixed(2)),
        'valorTotal': parseFloat(valorTotalAtivo.toFixed(2)),
        'peso': parseFloat(pesoAtivo.toFixed(2))
      });
    }
  }
  
  if (dadosCarteira.length === 0) {
    criarPopupEstilizado('Informação', 'Carteira vazia. Não há dados para exportar.', function() {});
    return;
  }
  
  try {
    var hoje = new Date().toISOString().slice(0, 10);
    var dadosExportacao = {
      'usuario': usuarioAtual,
      'dataExportacao': hoje,
      'horaExportacao': new Date().toLocaleTimeString(),
      'valorTotalCarteira': parseFloat(valorTotal.toFixed(2)),
      'totalAtivos': dadosCarteira.length,
      'posicoes': dadosCarteira
    };
    
    var jsonString = JSON.stringify(dadosExportacao, null, 2);
    var blob = new Blob([jsonString], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    
    var a = document.createElement('a');
    a.href = url;
    a.download = `carteira_${usuarioAtual}_${hoje}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    criarPopupEstilizado(
      'Exportação Concluída',
      `Carteira exportada em JSON com sucesso!\n\nArquivo: carteira_${usuarioAtual}_${hoje}.json\nTotal de ativos: ${dadosCarteira.length}\nValor total: R$ ${valorTotal.toFixed(2)}`,
      function() {}
    );
    
  } catch (error) {
    debug('Erro na exportação da carteira em JSON:', error);
    criarPopupEstilizado('Erro', 'Erro ao exportar carteira em JSON. Tente novamente.', function() {});
  }
}

// Função para exportar dados da carteira
function exportarCarteira() {
  debug('Exportando dados da carteira');
  
  if (!usuarioAtual) {
    criarPopupEstilizado('Erro', 'Nenhum usuário logado para exportar carteira.', function() {});
    return;
  }
  
  var dadosCarteira = [];
  var valorTotal = 0;
  
  // Calcular valor total primeiro
  for (var ativo in carteira) {
    if (carteira[ativo] > 0) {
      valorTotal += carteira[ativo] * precos[ativo];
    }
  }
  
  // Preparar dados para exportação
  for (var ativo in carteira) {
    if (carteira[ativo] > 0) {
      var quantidade = carteira[ativo];
      var precoAtual = precos[ativo];
      var valorTotalAtivo = quantidade * precoAtual;
      var pesoAtivo = (valorTotalAtivo / valorTotal) * 100;
      
      dadosCarteira.push({
        'Ativo': ativo,
        'Quantidade': quantidade,
        'Preço Atual (R$)': precoAtual.toFixed(2),
        'Valor Total (R$)': valorTotalAtivo.toFixed(2),
        'Peso (%)': pesoAtivo.toFixed(2)
      });
    }
  }
  
  if (dadosCarteira.length === 0) {
    criarPopupEstilizado('Informação', 'Carteira vazia. Não há dados para exportar.', function() {});
    return;
  }
  
  try {
    // Criar planilha Excel
    var ws = XLSX.utils.json_to_sheet(dadosCarteira);
    
    // Configurar largura das colunas
    var colWidths = [
      { wch: 10 }, // Ativo
      { wch: 12 }, // Quantidade
      { wch: 15 }, // Preço Atual
      { wch: 15 }, // Valor Total
      { wch: 10 }  // Peso
    ];
    ws['!cols'] = colWidths;
    
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Minha Carteira");
    
    var hoje = new Date().toISOString().slice(0, 10);
    var nomeArquivo = `carteira_${usuarioAtual}_${hoje}.xlsx`;
    
    XLSX.writeFile(wb, nomeArquivo);
    
    criarPopupEstilizado(
      'Exportação Concluída',
      `Carteira exportada com sucesso!\n\nArquivo: ${nomeArquivo}\nTotal de ativos: ${dadosCarteira.length}\nValor total: R$ ${valorTotal.toFixed(2)}`,
      function() {}
    );
    
  } catch (error) {
    debug('Erro na exportação da carteira:', error);
    criarPopupEstilizado('Erro', 'Erro ao exportar carteira. Tente novamente.', function() {});
  }
}

// Função para abrir modal de compra de um ativo específico
function abrirCompra(ativo) {
  debug('Abrindo modal de compra para:', ativo);
  
  // Fechar modal da carteira
  closeWalletModal();
  
  // Selecionar o ativo no formulário de trading
  var selectAtivo = document.getElementById('ativo');
  var selectTipo = document.getElementById('tipo');
  
  if (selectAtivo && selectTipo) {
    selectTipo.value = 'Compra';
    selectAtivo.value = ativo;
    
    // Scroll para a seção de trading
    var tradingSection = document.querySelector('.trading-section-bottom');
    if (tradingSection) {
      tradingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Função para abrir modal de venda de um ativo específico
function abrirVenda(ativo) {
  debug('Abrindo modal de venda para:', ativo);
  
  // Fechar modal da carteira
  closeWalletModal();
  
  // Selecionar o ativo no formulário de trading
  var selectAtivo = document.getElementById('ativo');
  var selectTipo = document.getElementById('tipo');
  
  if (selectAtivo && selectTipo) {
    selectTipo.value = 'Venda';
    selectAtivo.value = ativo;
    
    // Scroll para a seção de trading
    var tradingSection = document.querySelector('.trading-section-bottom');
    if (tradingSection) {
      tradingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Event listeners para os controles do gráfico
document.addEventListener('DOMContentLoaded', function() {
  var chartToggles = document.querySelectorAll('.chart-toggle');
  chartToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      var type = this.getAttribute('data-type');
      toggleChartType(type);
    });
  });
});



// ===== RN-002 e RN-006: Cotação de Ativos e Livro de Ofertas =====

// Função para atualizar os preços dos ativos e o Book de Ofertas
function atualizarCotacoesEBook() {
  debug("Atualizando cotações e book de ofertas...");
  let atualizadoComSucesso = true;

  try {
    // Atualizar preços dos ativos (RN-002)
    for (let ativo in precos) {
      const variacao = (Math.random() < 0.5 ? 1 : -1) * 0.01; // Variação de R$0,01
      precos[ativo] = parseFloat((precos[ativo] + variacao).toFixed(2));

      // Atualizar display no Stocks Section (RN-002)
      const priceElement = document.getElementById(`price-${ativo}`);
      const changeElement = document.getElementById(`change-${ativo}`);
      const percentElement = document.getElementById(`percent-${ativo}`);

      if (priceElement && changeElement && percentElement) {
        priceElement.textContent = precos[ativo].toFixed(2);
        // Recalcular variação e percentual (assumindo que temos um preço inicial para cada ativo)
        // Para simplificar, vamos apenas mostrar a variação de 0.01 ou -0.01 e um percentual fictício
        const changeValue = variacao.toFixed(2);
        const percentValue = ((variacao / (precos[ativo] - variacao)) * 100).toFixed(2);

        changeElement.textContent = changeValue;
        percentElement.textContent = `(${percentValue}%)`;

        if (variacao > 0) {
          changeElement.className = 'change positive';
          percentElement.className = 'change-percent positive';
        } else if (variacao < 0) {
          changeElement.className = 'change negative';
          percentElement.className = 'change-percent negative';
        } else {
          changeElement.className = 'change';
          percentElement.className = 'change-percent';
        }
      }
    }

    // Atualizar Book de Ofertas (RN-006)
    const bookTableBody = document.querySelector("#book tbody");
    if (bookTableBody) {
      bookTableBody.innerHTML = ''; // Limpar antes de preencher
      ativos.forEach(ativo => {
        const row = bookTableBody.insertRow();
        const cellAtivo = row.insertCell();
        const cellPreco = row.insertCell();
        const cellVariacao = row.insertCell();
        const cellVolume = row.insertCell();

        cellAtivo.textContent = ativo;
        cellPreco.textContent = precos[ativo].toFixed(2);
        
        // Para o Book de Ofertas, podemos usar uma variação e volume fictícios para demonstrar
        const variacaoBook = (Math.random() * 0.5 - 0.25).toFixed(2); // entre -0.25 e 0.25
        const volumeBook = (Math.floor(Math.random() * 100) + 1) * 100; // Múltiplos de 100

        cellVariacao.textContent = variacaoBook;
        cellVolume.textContent = volumeBook;

        if (parseFloat(variacaoBook) > 0) {
          cellVariacao.className = 'positive';
        } else if (parseFloat(variacaoBook) < 0) {
          cellVariacao.className = 'negative';
        }
      });
      // Atualizar timestamp da última atualização
      const lastUpdateElement = document.getElementById("lastUpdate");
      if (lastUpdateElement) {
        const now = new Date();
        lastUpdateElement.textContent = now.toLocaleTimeString("pt-BR");
      }
    }
  } catch (e) {
    console.error("Erro ao atualizar cotações ou book de ofertas:", e);
    atualizadoComSucesso = false;
  }

  if (!atualizadoComSucesso) {
    mostrarMensagem("mensagem", "Não foi possível atualizar as cotações no momento.", "error");
  }
}

// Chamar a função de atualização a cada 10 segundos
setInterval(atualizarCotacoesEBook, 10000);

// Chamar uma vez ao carregar a página para preencher inicialmente
document.addEventListener("DOMContentLoaded", atualizarCotacoesEBook);




// ===== MODAL DE TRADING AVANÇADO =====

// Função para abrir o modal de trading
function openTradeModal(type) {
  debug('Abrindo modal de trading:', type);
  
  // Verificar se há usuário logado
  if (!usuarioAtual) {
    criarPopupEstilizado('Erro', 'Faça login para realizar operações de compra e venda.', null);
    return;
  }
  
  // Verificar status do mercado
  var statusMercado = getStatusMercado();
  if (statusMercado.status !== 'open') {
    criarPopupEstilizado('Mercado Fechado', 'O mercado está fechado. Operações só podem ser realizadas durante o horário de funcionamento (10h às 18h, dias úteis).', null);
    return;
  }
  
  // Verificar se o modal existe
  var modal = document.getElementById('trade-modal');
  if (!modal) {
    console.error('Modal de trading não encontrado no DOM');
    criarPopupEstilizado('Erro', 'Modal de trading não está disponível. Recarregue a página.', null);
    return;
  }
  
  // Verificar se os elementos do modal existem
  var title = document.getElementById('tradeModalTitle');
  var subtitle = document.getElementById('tradeModalSubtitle');
  var typeSelect = document.getElementById('tradeType');
  var confirmBtn = document.getElementById('tradeConfirmBtn');
  
  if (!title || !subtitle || !typeSelect || !confirmBtn) {
    console.error('Elementos do modal de trading não encontrados:', {
      title: !!title,
      subtitle: !!subtitle,
      typeSelect: !!typeSelect,
      confirmBtn: !!confirmBtn
    });
    criarPopupEstilizado('Erro', 'Modal de trading não está completamente carregado. Recarregue a página.', null);
    return;
  }
  
  // Configurar modal baseado no tipo
  if (type === 'buy') {
    title.textContent = '💰 Comprar Ação';
    subtitle.textContent = 'Ordem de Compra';
    typeSelect.value = 'buy';
    confirmBtn.innerHTML = '<span class="btn-icon">💰</span><span class="btn-text">Confirmar Compra</span>';
    confirmBtn.className = 'btn-confirm';
  } else {
    title.textContent = '💸 Vender Ação';
    subtitle.textContent = 'Ordem de Venda';
    typeSelect.value = 'sell';
    confirmBtn.innerHTML = '<span class="btn-icon">💸</span><span class="btn-text">Confirmar Venda</span>';
    confirmBtn.className = 'btn-confirm sell';
  }
  
  // Atualizar informações do ativo selecionado (com verificação)
  try {
    updateTradeAssetInfo();
  } catch (e) {
    console.warn('Erro ao atualizar informações do ativo:', e);
  }
  
  // Limpar formulário (com verificação)
  var quantityInput = document.getElementById('tradeQuantity');
  var priceInput = document.getElementById('tradePrice');
  
  if (quantityInput) quantityInput.value = '';
  if (priceInput) priceInput.value = '';
  
  try {
    calculateTradeTotal();
  } catch (e) {
    console.warn('Erro ao calcular total:', e);
  }
  
  // Mostrar modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  debug('Modal de trading aberto com sucesso');
}

// Função para fechar o modal de trading
function closeTradeModal() {
  debug('Fechando modal de trading');
  
  var modal = document.getElementById('trade-modal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Função para atualizar tipo de operação
function updateTradeType() {
  var type = document.getElementById('tradeType').value;
  var title = document.getElementById('tradeModalTitle');
  var subtitle = document.getElementById('tradeModalSubtitle');
  var confirmBtn = document.getElementById('tradeConfirmBtn');
  var positionInfo = document.getElementById('tradePositionInfo');
  
  if (type === 'buy') {
    title.textContent = '💰 Comprar Ação';
    subtitle.textContent = 'Ordem de Compra';
    confirmBtn.innerHTML = '<span class="btn-icon">💰</span><span class="btn-text">Confirmar Compra</span>';
    confirmBtn.className = 'btn-confirm';
    positionInfo.style.display = 'none';
  } else {
    title.textContent = '💸 Vender Ação';
    subtitle.textContent = 'Ordem de Venda';
    confirmBtn.innerHTML = '<span class="btn-icon">💸</span><span class="btn-text">Confirmar Venda</span>';
    confirmBtn.className = 'btn-confirm sell';
    positionInfo.style.display = 'flex';
    updateTradePosition();
  }
  
  calculateTradeTotal();
}

// Função para atualizar ativo selecionado
function updateTradeAsset() {
  updateTradeAssetInfo();
  updateTradePosition();
  calculateTradeTotal();
}

// Função para atualizar informações do ativo
function updateTradeAssetInfo() {
  var assetSelect = document.getElementById('tradeAsset');
  var selectedAsset = assetSelect.value;
  
  // Atualizar símbolo e nome
  document.getElementById('tradeAssetSymbol').textContent = selectedAsset;
  
  var assetNames = {
    'PETR4': 'Petróleo Brasileiro S.A.',
    'VALE3': 'Vale S.A.',
    'ITUB4': 'Itaú Unibanco Holding S.A.',
    'BBDC4': 'Banco Bradesco S.A.',
    'ABEV3': 'Ambev S.A.',
    'MGLU3': 'Magazine Luiza S.A.',
    'BBAS3': 'Banco do Brasil S.A.',
    'LREN3': 'Lojas Renner S.A.'
  };
  
  document.getElementById('tradeAssetName').textContent = assetNames[selectedAsset] || selectedAsset;
  
  // Atualizar preço atual
  var currentPrice = precos[selectedAsset] || 0;
  document.getElementById('tradeCurrentPrice').textContent = 'R$ ' + currentPrice.toFixed(2);
  
  // Atualizar campo de preço no formulário
  document.getElementById('tradePrice').value = currentPrice.toFixed(2);
  
  // Simular variação (para demonstração)
  var change = ((Math.random() - 0.5) * 2).toFixed(2);
  var changePercent = ((change / currentPrice) * 100).toFixed(2);
  var isPositive = parseFloat(change) >= 0;
  
  var changeElement = document.querySelector('#tradePriceChange .change-value');
  changeElement.textContent = (isPositive ? '+' : '') + change + ' (' + (isPositive ? '+' : '') + changePercent + '%)';
  changeElement.className = 'change-value ' + (isPositive ? 'positive' : '');
}

// Função para atualizar posição atual do ativo
function updateTradePosition() {
  var selectedAsset = document.getElementById('tradeAsset').value;
  var currentPosition = carteira[selectedAsset] || 0;
  
  document.getElementById('tradeCurrentPosition').textContent = currentPosition.toLocaleString('pt-BR') + ' ações';
}

// Função para calcular total da operação
function calculateTradeTotal() {
  var quantity = parseInt(document.getElementById('tradeQuantity').value) || 0;
  var price = parseFloat(document.getElementById('tradePrice').value) || 0;
  var type = document.getElementById('tradeType').value;
  
  var total = quantity * price;
  var brokerage = 0; // Taxa de corretagem (pode ser implementada)
  var finalTotal = total + brokerage;
  
  document.getElementById('tradeTotal').textContent = 'R$ ' + total.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  document.getElementById('tradeFinalTotal').textContent = 'R$ ' + finalTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  
  // Atualizar saldo disponível
  var currentBalance = usuarios[usuarioAtual] ? usuarios[usuarioAtual].saldo : 0;
  document.getElementById('tradeAvailableBalance').textContent = 'R$ ' + currentBalance.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  
  // Validar se a operação é possível
  var confirmBtn = document.getElementById('tradeConfirmBtn');
  var isValid = true;
  var errorMessage = '';
  
  if (quantity < 100) {
    isValid = false;
    errorMessage = 'Quantidade mínima: 100 ações';
  } else if (type === 'buy' && finalTotal > currentBalance) {
    isValid = false;
    errorMessage = 'Saldo insuficiente';
  } else if (type === 'sell') {
    var selectedAsset = document.getElementById('tradeAsset').value;
    var currentPosition = carteira[selectedAsset] || 0;
    if (quantity > currentPosition) {
      isValid = false;
      errorMessage = 'Quantidade insuficiente na carteira';
    }
  }
  
  // VALIDAÇÃO DE PREÇO - BUG CORRIGIDO: Verificar se o preço está dentro do limite permitido
  if (isValid && price > 0) {
    var selectedAsset = document.getElementById('tradeAsset').value;
    var cotacaoAtual = precos[selectedAsset];
    var variacaoMaxima = 0.05; // 5% de variação máxima permitida
    
    if (type === 'buy') {
      var precoMinimo = cotacaoAtual * (1 - variacaoMaxima);
      if (price < precoMinimo) {
        isValid = false;
        errorMessage = `Preço muito baixo! Mínimo: R$ ${precoMinimo.toFixed(2)}`;
      }
    } else if (type === 'sell') {
      var precoMaximo = cotacaoAtual * (1 + variacaoMaxima);
      if (price > precoMaximo) {
        isValid = false;
        errorMessage = `Preço muito alto! Máximo: R$ ${precoMaximo.toFixed(2)}`;
      }
    }
  }
  
  if (isValid) {
    confirmBtn.disabled = false;
    confirmBtn.style.opacity = '1';
    confirmBtn.style.cursor = 'pointer';
  } else {
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = '0.5';
    confirmBtn.style.cursor = 'not-allowed';
    confirmBtn.title = errorMessage;
  }
}

// Função para confirmar a operação
function confirmTrade() {
  debug('Confirmando operação de trading');
  
  var type = document.getElementById('tradeType').value;
  var asset = document.getElementById('tradeAsset').value;
  var quantity = parseInt(document.getElementById('tradeQuantity').value);
  var price = parseFloat(document.getElementById('tradePrice').value);
  
  if (!quantity || !price) {
    criarPopupEstilizado('Erro', 'Preencha todos os campos obrigatórios.', null);
    return;
  }
  
  // VALIDAÇÃO DE PREÇO - BUG CORRIGIDO: Verificar se o preço está dentro do limite permitido
  var cotacaoAtual = precos[asset];
  var variacaoMaxima = 0.05; // 5% de variação máxima permitida
  
  if (type === 'buy') {
    var precoMinimo = cotacaoAtual * (1 - variacaoMaxima);
    if (price < precoMinimo) {
      criarPopupEstilizado('Erro', `Preço muito baixo para compra! Mínimo permitido: R$ ${precoMinimo.toFixed(2)} (cotação atual: R$ ${cotacaoAtual.toFixed(2)})`, null);
      return;
    }
  } else if (type === 'sell') {
    var precoMaximo = cotacaoAtual * (1 + variacaoMaxima);
    if (price > precoMaximo) {
      criarPopupEstilizado('Erro', `Preço muito alto para venda! Máximo permitido: R$ ${precoMaximo.toFixed(2)} (cotação atual: R$ ${cotacaoAtual.toFixed(2)})`, null);
      return;
    }
  }
  
  // Criar ordem usando a função existente
  var tipoOperacao = type === 'buy' ? 'Compra' : 'Venda';
  
  // Simular preenchimento dos campos da boleta existente
  var originalTipo = document.querySelector('select[onchange*="atualizarFormulario"]');
  var originalAtivo = originalTipo ? originalTipo.parentElement.parentElement.querySelector('select:nth-of-type(2)') : null;
  var originalQuantidade = document.querySelector('input[placeholder*="Múltiplos"]');
  var originalValor = document.querySelector('input[placeholder="0.00"]');
  
  if (originalTipo && originalAtivo && originalQuantidade && originalValor) {
    // Salvar valores originais
    var originalTipoValue = originalTipo.value;
    var originalAtivoValue = originalAtivo.value;
    var originalQuantidadeValue = originalQuantidade.value;
    var originalValorValue = originalValor.value;
    
    // Definir novos valores
    originalTipo.value = tipoOperacao;
    originalAtivo.value = asset;
    originalQuantidade.value = quantity;
    originalValor.value = price;
    
    // Executar ordem
    executarOrdem();
    
    // Restaurar valores originais
    originalTipo.value = originalTipoValue;
    originalAtivo.value = originalAtivoValue;
    originalQuantidade.value = originalQuantidadeValue;
    originalValor.value = originalValorValue;
  } else {
    // Fallback: executar ordem diretamente
    var ordem = {
      id: Date.now(),
      tipo: tipoOperacao,
      ativo: asset,
      quantidade: quantity,
      valor: price,
      cotacao: precos[asset],
      data: new Date().toLocaleString('pt-BR'),
      status: 'Pendente'
    };
    
    // Processar ordem
    processarOrdem(ordem);
  }
  
  // Fechar modal
  closeTradeModal();
  
  // Mostrar confirmação
  criarPopupEstilizado(
    'Ordem Enviada',
    `Ordem de ${tipoOperacao.toLowerCase()} de ${quantity} ações de ${asset} ao preço de R$ ${price.toFixed(2)} foi enviada com sucesso!`,
    null
  );
}

// Função auxiliar para processar ordem diretamente
function processarOrdem(ordem) {
  try {
    // VALIDAÇÃO DE PREÇO - BUG CORRIGIDO: Limite de 5% de variação máxima
    var variacaoMaxima = 0.05; // 5% de variação máxima permitida
    
    if (ordem.tipo === 'Compra') {
      var precoMinimo = ordem.cotacao * (1 - variacaoMaxima);
      if (ordem.valor < precoMinimo) {
        ordem.status = 'Rejeitada';
        debug('Ordem rejeitada: Preço muito baixo para compra', {
          valor: ordem.valor,
          precoMinimo: precoMinimo,
          cotacao: ordem.cotacao
        });
      }
    } else if (ordem.tipo === 'Venda') {
      var precoMaximo = ordem.cotacao * (1 + variacaoMaxima);
      if (ordem.valor > precoMaximo) {
        ordem.status = 'Rejeitada';
        debug('Ordem rejeitada: Preço muito alto para venda', {
          valor: ordem.valor,
          precoMaximo: precoMaximo,
          cotacao: ordem.cotacao
        });
      }
    }
    
    // Se não foi rejeitada pela validação de preço, verificar diferença
    if (ordem.status !== 'Rejeitada') {
    var diferenca = Math.abs(ordem.valor - ordem.cotacao);
    
    if (diferenca === 0) {
      ordem.status = 'Executada';
    } else if (diferenca <= 5) {
      ordem.status = 'Aceita';
    } else {
      ordem.status = 'Rejeitada';
      }
    }
    
    // Adicionar à lista de ordens
    ordens.push(ordem);
    
    // Se executada, atualizar carteira e extrato
    if (ordem.status === 'Executada') {
      var valorTotal = ordem.quantidade * ordem.valor;
      
      if (ordem.tipo === 'Compra') {
        usuarios[usuarioAtual].saldo -= valorTotal;
        carteira[ordem.ativo] = (carteira[ordem.ativo] || 0) + ordem.quantidade;
      } else {
        usuarios[usuarioAtual].saldo += valorTotal;
        carteira[ordem.ativo] = (carteira[ordem.ativo] || 0) - ordem.quantidade;
      }
      
      // Adicionar ao extrato
      extrato.push({
        tipo: ordem.tipo,
        ativo: ordem.ativo,
        quantidade: ordem.quantidade,
        valorTotal: valorTotal,
        data: new Date().toISOString()
      });
    }
    
    // Salvar dados
    salvarDados();
    
    // Atualizar interface
    atualizarSaldo();
    atualizarOrdens();
    atualizarExtrato();
    
    debug('Ordem processada:', ordem);
    
  } catch (e) {
    console.error('Erro ao processar ordem:', e);
    criarPopupEstilizado('Erro', 'Erro ao processar ordem. Tente novamente.', null);
  }
}

// Inicializar eventos do modal quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Adicionar eventos de mudança para recalcular total
  var quantityInput = document.getElementById('tradeQuantity');
  var priceInput = document.getElementById('tradePrice');
  
  if (quantityInput) {
    quantityInput.addEventListener('input', calculateTradeTotal);
  }
  
  if (priceInput) {
    priceInput.addEventListener('input', calculateTradeTotal);
  }
  
  // Fechar modal ao clicar fora
  var modal = document.getElementById('trade-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeTradeModal();
      }
    });
  }
});



// ===== FUNÇÕES PARA RELATÓRIO DE ORDENS =====

// Função para abrir modal de relatório de ordens
function abrirRelatorioOrdens() {
  debug('Abrindo relatório de ordens');
  
  if (!usuarioAtual) {
    criarPopupEstilizado('Erro', 'Nenhum usuário logado para visualizar relatório de ordens.', function() {});
    return;
  }
  
  // Mostrar modal
  var modal = document.getElementById('relatorio-ordens-modal');
  if (modal) {
    modal.style.display = 'block';
    atualizarRelatorioOrdens();
  } else {
    criarPopupEstilizado('Erro', 'Modal de relatório não encontrado.', function() {});
  }
}

// Função para fechar modal de relatório de ordens
function fecharRelatorioOrdens() {
  debug('Fechando relatório de ordens');
  var modal = document.getElementById('relatorio-ordens-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Função para atualizar dados do relatório de ordens
function atualizarRelatorioOrdens() {
  debug('Atualizando relatório de ordens');
  
  // Simular dados de ordens (já que não há sistema real de ordens)
  var ordensSimuladas = [
    {
      dataHora: '2025-08-20 08:30:15',
      ativo: 'PETR4',
      tipo: 'COMPRA',
      quantidade: 100,
      preco: 28.50,
      valorTotal: 2850.00,
      status: 'EXECUTADA'
    },
    {
      dataHora: '2025-08-20 09:15:30',
      ativo: 'VALE3',
      tipo: 'COMPRA',
      quantidade: 50,
      preco: 72.30,
      valorTotal: 3615.00,
      status: 'EXECUTADA'
    },
    {
      dataHora: '2025-08-20 10:45:22',
      ativo: 'ITUB4',
      tipo: 'VENDA',
      quantidade: 25,
      preco: 31.20,
      valorTotal: 780.00,
      status: 'PENDENTE'
    },
    {
      dataHora: '2025-08-20 11:20:10',
      ativo: 'BBDC4',
      tipo: 'COMPRA',
      quantidade: 75,
      preco: 27.80,
      valorTotal: 2085.00,
      status: 'CANCELADA'
    }
  ];
  
  // Atualizar resumo
  var totalOrdens = ordensSimuladas.length;
  var ordensExecutadas = ordensSimuladas.filter(o => o.status === 'EXECUTADA').length;
  var ordensPendentes = ordensSimuladas.filter(o => o.status === 'PENDENTE').length;
  var ordensCanceladas = ordensSimuladas.filter(o => o.status === 'CANCELADA').length;
  
  document.getElementById('totalOrdens').textContent = totalOrdens;
  document.getElementById('ordensExecutadas').textContent = ordensExecutadas;
  document.getElementById('ordensPendentes').textContent = ordensPendentes;
  document.getElementById('ordensCanceladas').textContent = ordensCanceladas;
  
  // Atualizar tabela
  var tbody = document.querySelector('#tabelaOrdens tbody');
  if (tbody) {
    tbody.innerHTML = '';
    
    ordensSimuladas.forEach(function(ordem) {
      var row = tbody.insertRow();
      
      row.insertCell(0).textContent = ordem.dataHora;
      row.insertCell(1).textContent = ordem.ativo;
      row.insertCell(2).textContent = ordem.tipo;
      row.insertCell(3).textContent = ordem.quantidade;
      row.insertCell(4).textContent = 'R$ ' + ordem.preco.toFixed(2);
      row.insertCell(5).textContent = 'R$ ' + ordem.valorTotal.toFixed(2);
      
      var statusCell = row.insertCell(6);
      statusCell.textContent = ordem.status;
      
      // Aplicar classes de estilo baseado no status
      if (ordem.status === 'EXECUTADA') {
        statusCell.className = 'change-positive';
      } else if (ordem.status === 'CANCELADA') {
        statusCell.className = 'change-negative';
      } else {
        statusCell.className = 'change-neutral';
      }
    });
  }
  
  // Atualizar timestamp
  document.getElementById('ordensLastUpdate').textContent = new Date().toLocaleTimeString();
}

// Função para exportar ordens em JSON
function exportarOrdensJSON() {
  debug('Exportando ordens em JSON');
  
  if (!usuarioAtual) {
    criarPopupEstilizado('Erro', 'Nenhum usuário logado para exportar ordens.', function() {});
    return;
  }
  
  try {
    // Simular dados de ordens para exportação
    var ordensParaExportar = [
      {
        dataHora: '2025-08-20 08:30:15',
        ativo: 'PETR4',
        tipo: 'COMPRA',
        quantidade: 100,
        preco: 28.50,
        valorTotal: 2850.00,
        status: 'EXECUTADA'
      },
      {
        dataHora: '2025-08-20 09:15:30',
        ativo: 'VALE3',
        tipo: 'COMPRA',
        quantidade: 50,
        preco: 72.30,
        valorTotal: 3615.00,
        status: 'EXECUTADA'
      },
      {
        dataHora: '2025-08-20 10:45:22',
        ativo: 'ITUB4',
        tipo: 'VENDA',
        quantidade: 25,
        preco: 31.20,
        valorTotal: 780.00,
        status: 'PENDENTE'
      },
      {
        dataHora: '2025-08-20 11:20:10',
        ativo: 'BBDC4',
        tipo: 'COMPRA',
        quantidade: 75,
        preco: 27.80,
        valorTotal: 2085.00,
        status: 'CANCELADA'
      }
    ];
    
    var hoje = new Date().toISOString().slice(0, 10);
    var dadosExportacao = {
      'usuario': usuarioAtual,
      'dataExportacao': hoje,
      'horaExportacao': new Date().toLocaleTimeString(),
      'totalOrdens': ordensParaExportar.length,
      'ordensExecutadas': ordensParaExportar.filter(o => o.status === 'EXECUTADA').length,
      'ordensPendentes': ordensParaExportar.filter(o => o.status === 'PENDENTE').length,
      'ordensCanceladas': ordensParaExportar.filter(o => o.status === 'CANCELADA').length,
      'ordens': ordensParaExportar
    };
    
    var jsonString = JSON.stringify(dadosExportacao, null, 2);
    var blob = new Blob([jsonString], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    
    var a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_ordens_${usuarioAtual}_${hoje}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    criarPopupEstilizado(
      'Exportação Concluída',
      `Relatório de ordens exportado em JSON com sucesso!\n\nArquivo: relatorio_ordens_${usuarioAtual}_${hoje}.json\nTotal de ordens: ${ordensParaExportar.length}`,
      function() {}
    );
    
  } catch (error) {
    debug('Erro na exportação de ordens em JSON:', error);
    criarPopupEstilizado('Erro', 'Erro ao exportar relatório de ordens em JSON. Tente novamente.', function() {});
  }
}

// Função para exportar ordens em XLSX
function exportarOrdensXLSX() {
  debug('Exportando ordens em XLSX');
  
  if (!usuarioAtual) {
    criarPopupEstilizado('Erro', 'Nenhum usuário logado para exportar ordens.', function() {});
    return;
  }
  
  if (typeof XLSX === 'undefined') {
    criarPopupEstilizado('Erro', 'Biblioteca XLSX não carregada. Não é possível exportar para XLSX.', function() {});
    return;
  }
  
  try {
    // Simular dados de ordens para exportação
    var ordensParaExportar = [
      {
        'Data/Hora': '2025-08-20 08:30:15',
        'Ativo': 'PETR4',
        'Tipo': 'COMPRA',
        'Quantidade': 100,
        'Preço (R$)': 28.50,
        'Valor Total (R$)': 2850.00,
        'Status': 'EXECUTADA'
      },
      {
        'Data/Hora': '2025-08-20 09:15:30',
        'Ativo': 'VALE3',
        'Tipo': 'COMPRA',
        'Quantidade': 50,
        'Preço (R$)': 72.30,
        'Valor Total (R$)': 3615.00,
        'Status': 'EXECUTADA'
      },
      {
        'Data/Hora': '2025-08-20 10:45:22',
        'Ativo': 'ITUB4',
        'Tipo': 'VENDA',
        'Quantidade': 25,
        'Preço (R$)': 31.20,
        'Valor Total (R$)': 780.00,
        'Status': 'PENDENTE'
      },
      {
        'Data/Hora': '2025-08-20 11:20:10',
        'Ativo': 'BBDC4',
        'Tipo': 'COMPRA',
        'Quantidade': 75,
        'Preço (R$)': 27.80,
        'Valor Total (R$)': 2085.00,
        'Status': 'CANCELADA'
      }
    ];
    
    var ws = XLSX.utils.json_to_sheet(ordensParaExportar);
    
    // Configurar largura das colunas
    var colWidths = [
      { wch: 18 }, // Data/Hora
      { wch: 10 }, // Ativo
      { wch: 10 }, // Tipo
      { wch: 12 }, // Quantidade
      { wch: 12 }, // Preço
      { wch: 15 }, // Valor Total
      { wch: 12 }  // Status
    ];
    ws['!cols'] = colWidths;
    
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório de Ordens");
    
    var hoje = new Date().toISOString().slice(0, 10);
    var nomeArquivo = `relatorio_ordens_${usuarioAtual}_${hoje}.xlsx`;
    
    XLSX.writeFile(wb, nomeArquivo);
    
    criarPopupEstilizado(
      'Exportação Concluída',
      `Relatório de ordens exportado em XLSX com sucesso!\n\nArquivo: ${nomeArquivo}\nTotal de ordens: ${ordensParaExportar.length}`,
      function() {}
    );
    
  } catch (error) {
    debug('Erro na exportação de ordens em XLSX:', error);
    criarPopupEstilizado('Erro', 'Erro ao exportar relatório de ordens em XLSX. Tente novamente.', function() {});
  }
}

