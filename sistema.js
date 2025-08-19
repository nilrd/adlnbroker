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
    // Limpar dados de teste antigos do localStorage
    var dadosUsuarios = localStorage.getItem("adln_usuarios");
    if (dadosUsuarios) {
      usuarios = JSON.parse(dadosUsuarios);
      // Remover explicitamente o usuário de teste se ele existir
      if (usuarios["442.442.442-42"]) {
        delete usuarios["442.442.442-42"];
        localStorage.setItem("adln_usuarios", JSON.stringify(usuarios)); // Salvar após remover
        debug("Usuário de teste 442.442.442-42 removido do localStorage.");
      }
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
      if (extratoData) extrato = JSON.parse(extratoData);

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
    mostrarMensagem("loginMsg", "Usuário não encontrado. Cadastre-se para continuar.", "error");
    debug('Usuário não encontrado para CPF: ' + cpf);
    debug('CPFs disponíveis:', Object.keys(usuarios));
    return;
  }
  
  if (usuarios[cpf].senha !== senha) {
    mostrarMensagem("loginMsg", "CPF ou senha incorretos. Tente novamente.", "error");
    return;
  }
  
  // Login bem-sucedido
  usuarioAtual = cpf;
  
  // Carregar dados específicos do usuário
  var carteiraData = localStorage.getItem("adln_carteira_" + usuarioAtual);
  if (carteiraData) carteira = JSON.parse(carteiraData);
  else carteira = {};
  
  var extratoData = localStorage.getItem("adln_extrato_" + usuarioAtual);
  if (extratoData) extrato = JSON.parse(extratoData);
  else extrato = [];
  
  var ordensData = localStorage.getItem("adln_ordens_" + usuarioAtual);
  if (ordensData) ordens = JSON.parse(ordensData);
  else ordens = [];
  
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
  
  // VALIDAÇÃO DE PREÇO - BUG 1 CORRIGIDO
  var cotacaoAtual = precos[ativo];
  var variacaoMaxima = 0.05; // 5% de variação máxima permitida
  
  if (tipo === 'Compra') {
    // Para compra, o preço não pode ser mais de 5% abaixo da cotação
    var precoMinimo = cotacaoAtual * (1 - variacaoMaxima);
    if (valor < precoMinimo) {
      mostrarMensagem('mensagem', `Preço muito baixo. Mínimo permitido: R$ ${precoMinimo.toFixed(2)} (cotação: R$ ${cotacaoAtual.toFixed(2)})`, 'error');
      return;
    }
  } else {
    // Para venda, o preço não pode ser mais de 5% acima da cotação
    var precoMaximo = cotacaoAtual * (1 + variacaoMaxima);
    if (valor > precoMaximo) {
      mostrarMensagem('mensagem', `Preço muito alto. Máximo permitido: R$ ${precoMaximo.toFixed(2)} (cotação: R$ ${cotacaoAtual.toFixed(2)})`, 'error');
      return;
    }
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

// Função para atualizar book de ofertas (sincronizada)
function atualizarBookOfertas() {
  var tbody = document.querySelector('#book tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  for (var i = 0; i < ativos.length; i++) {
    var ativo = ativos[i];
    var preco = precos[ativo];
    
    // Calcular variação percentual baseada no preço atual vs preço base
    var precoBase = 0;
    if (window.newChartManager && window.newChartManager.stockData[ativo]) {
      precoBase = window.newChartManager.stockData[ativo].basePrice;
    } else {
      // Fallback: usar preço atual como base se não houver dados do gráfico
      precoBase = preco;
    }
    
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
  var lastUpdateEl = document.getElementById('lastUpdate');
  if (lastUpdateEl) {
    lastUpdateEl.textContent = new Date().toLocaleTimeString('pt-BR');
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

// Função para sincronizar preços em todos os módulos
function sincronizarPrecos() {
  debug('Sincronizando preços em todos os módulos');
  
  // Atualizar preços no sistema principal
  for (var i = 0; i < ativos.length; i++) {
    var ativo = ativos[i];
    var variacao = (Math.random() - 0.5) * 0.02;
    precos[ativo] *= (1 + variacao);
    precos[ativo] = Math.max(0.01, precos[ativo]);
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
        const timeLabel = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        window.newChartManager.stockData[symbol].history.push({ 
          time: timeLabel, 
          price: precos[symbol] 
        });
        
        // Gerar dados OHLC para candlestick
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
        
        // Manter apenas os últimos 60 pontos
        if (window.newChartManager.stockData[symbol].history.length > 60) {
          window.newChartManager.stockData[symbol].history.shift();
        }
        if (window.newChartManager.stockData[symbol].ohlcData.length > 60) {
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

// ===== RELÓGIO DA BOLSA =====
// Horários da B3 (Bolsa Brasileira)
const B3_HORARIOS = {
  PRE_ABERTURA: { hora: 9, minuto: 0 },    // 09:00
  ABERTURA: { hora: 10, minuto: 0 },       // 10:00
  FECHAMENTO: { hora: 17, minuto: 0 },     // 17:00
  POS_FECHAMENTO: { hora: 18, minuto: 0 }  // 18:00
};

// Dias da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
const DIAS_UTEIS = [1, 2, 3, 4, 5]; // Segunda a Sexta

// Função para verificar se é dia útil
function isDiaUtil(data) {
  return DIAS_UTEIS.includes(data.getDay());
}

// Função para obter próximo dia útil
function getProximoDiaUtil(data) {
  let proximaData = new Date(data);
  proximaData.setDate(proximaData.getDate() + 1);
  
  while (!isDiaUtil(proximaData)) {
    proximaData.setDate(proximaData.getDate() + 1);
  }
  
  return proximaData;
}

// Função para obter status do mercado
function getStatusMercado() {
  const agora = new Date();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const diaSemana = agora.getDay();
  
  // Verificar se é fim de semana
  if (!isDiaUtil(agora)) {
    return {
      status: 'closed',
      texto: 'Mercado Fechado (Fim de Semana)',
      proximaAbertura: getProximaAbertura(agora)
    };
  }
  
  const horaAtual = hora * 60 + minuto;
  const horaPreAbertura = B3_HORARIOS.PRE_ABERTURA.hora * 60 + B3_HORARIOS.PRE_ABERTURA.minuto;
  const horaAbertura = B3_HORARIOS.ABERTURA.hora * 60 + B3_HORARIOS.ABERTURA.minuto;
  const horaFechamento = B3_HORARIOS.FECHAMENTO.hora * 60 + B3_HORARIOS.FECHAMENTO.minuto;
  const horaPosFechamento = B3_HORARIOS.POS_FECHAMENTO.hora * 60 + B3_HORARIOS.POS_FECHAMENTO.minuto;
  
  if (horaAtual < horaPreAbertura) {
    return {
      status: 'closed',
      texto: 'Mercado Fechado',
      proximaAbertura: getProximaAbertura(agora)
    };
  } else if (horaAtual < horaAbertura) {
    return {
      status: 'pre-open',
      texto: 'Pré-Abertura',
      proximaAbertura: getProximaAbertura(agora)
    };
  } else if (horaAtual < horaFechamento) {
    return {
      status: 'open',
      texto: 'Mercado Aberto',
      proximaAbertura: getProximoFechamento(agora)
    };
  } else if (horaAtual < horaPosFechamento) {
    return {
      status: 'after-hours',
      texto: 'After Hours',
      proximaAbertura: getProximaAbertura(agora)
    };
  } else {
    return {
      status: 'closed',
      texto: 'Mercado Fechado',
      proximaAbertura: getProximaAbertura(agora)
    };
  }
}

// Função para obter próxima abertura
function getProximaAbertura(data) {
  const proximaData = getProximoDiaUtil(data);
  proximaData.setHours(B3_HORARIOS.ABERTURA.hora, B3_HORARIOS.ABERTURA.minuto, 0, 0);
  return proximaData;
}

// Função para obter próximo fechamento
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



// ===== FUNÇÃO DE EXPORTAÇÃO DE TRANSAÇÕES DO DIA =====

// Função para exportar transações do dia em formato JSON
function exportarTransacoesDia() {
  debug('Iniciando exportação de transações do dia');
  debug('Usuário atual:', usuarioAtual);

  // Verificar se há usuário logado
  if (!usuarioAtual) {
    debug('Erro: Usuário não logado');
    criarPopupEstilizado('Erro', 'Usuário não está logado. Faça login para exportar transações.', null);
    return;
  }

  // Carregar extrato do usuário
  var extratoData = localStorage.getItem("adln_extrato_" + usuarioAtual);
  debug('Dados do extrato carregados:', extratoData ? 'Sim' : 'Não');

  if (!extratoData) {
    debug('Erro: Nenhum extrato encontrado');
    criarPopupEstilizado('Sem Transações', 'Nenhuma transação encontrada para exportar.', null);
    return;
  }

  var extratoCompleto = JSON.parse(extratoData);
  debug('Extrato completo carregado:', extratoCompleto);

  // Obter data de hoje
  var hoje = new Date();
  var dataHoje = hoje.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  debug('Filtrando transações do dia:', dataHoje);

  var transacoesDoDia = extratoCompleto.filter(function(transacao) {
    if (!transacao.data) {
      debug('Transação sem data:', transacao);
      return false;
    }

    // Converter data da transação para formato comparável
    var dataTransacao = new Date(transacao.data);
    var dataTransacaoFormatada = dataTransacao.toISOString().split('T')[0];
    debug('Comparando datas:', dataTransacaoFormatada, '==', dataHoje, '=', dataTransacaoFormatada === dataHoje);
    return dataTransacaoFormatada === dataHoje;
  });

  debug('Transações do dia encontradas:', transacoesDoDia);

  if (transacoesDoDia.length === 0) {
    debug('Erro: Nenhuma transação hoje');
    criarPopupEstilizado('Sem Transações Hoje', 'Nenhuma transação foi realizada hoje.', null);
    return;
  }

  // Preparar dados para exportação no formato especificado
  var dadosExportacao = {
    data_exportacao: dataHoje,
    transacoes: transacoesDoDia.map(function(transacao, index) {
      // Gerar ID único para a transação
      var idTransacao = 'TXN_' + dataHoje.replace(/-/g, '') + '_' + String(index + 1).padStart(3, '0');
      
      // Formatar data e hora no formato YYYY-MM-DD HH:MM:SS
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
      } else {
        // Fallback se não houver data
        var agora = new Date();
        dataHora = agora.getFullYear() + '-' + 
                  String(agora.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(agora.getDate()).padStart(2, '0') + ' ' +
                  String(agora.getHours()).padStart(2, '0') + ':' + 
                  String(agora.getMinutes()).padStart(2, '0') + ':' + 
                  String(agora.getSeconds()).padStart(2, '0');
      }
      
      // Calcular preço unitário
      var precoUnitario = 0;
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

  // Criar arquivo JSON para download
  var jsonString = JSON.stringify(dadosExportacao, null, 2);

  try {
    // Método 1: Usando Blob e download
    var blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);

    // Criar link de download
    var link = document.createElement('a');
    link.href = url;
    link.download = `transacoes_dia_${dataHoje}.json`;
    link.style.display = 'none';

    // Adicionar link ao DOM e clicar
    document.body.appendChild(link);
    link.click();

    // Limpar
    setTimeout(function() {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    debug('Download iniciado com sucesso');

  } catch (error) {
    debug('Erro no download automático:', error);

    // Método 2: Fallback - mostrar dados para copiar manualmente
    var dadosParaCopiar = JSON.stringify(dadosExportacao, null, 2);
    criarPopupEstilizado(
      'Download Falhou',
      `Erro no download automático. Copie os dados abaixo:\n\n${dadosParaCopiar}`,
      null
    );
    return;
  }

  // Mostrar mensagem de sucesso
  criarPopupEstilizado(
    'Exportação Concluída',
    `Transações do dia ${dataHoje} exportadas com sucesso!\n\nTotal: ${transacoesDoDia.length} transação(ões)\nArquivo: transacoes_dia_${dataHoje}.json\n\nFormato: JSON estruturado com ID único por transação`,
    null
  );

  debug('Exportação concluída', {
    usuario: usuarioAtual,
    data: dataHoje,
    totalTransacoes: transacoesDoDia.length
  });
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
  
  for (var ativo in carteira) {
    if (carteira[ativo] > 0) {
      valorTotal += carteira[ativo] * precos[ativo];
      totalAtivos++;
      totalPosicoes += carteira[ativo];
    }
  }
  
  // Atualizar resumo da carteira
  var modalValorTotal = document.getElementById('modalValorTotal');
  var modalTotalAtivos = document.getElementById('modalTotalAtivos');
  var modalTotalPosicoes = document.getElementById('modalTotalPosicoes');
  
  if (modalValorTotal) {
    modalValorTotal.textContent = 'R$ ' + valorTotal.toFixed(2);
  }
  
  if (modalTotalAtivos) {
    modalTotalAtivos.textContent = totalAtivos;
  }
  
  if (modalTotalPosicoes) {
    modalTotalPosicoes.textContent = totalPosicoes;
  }
  
  // Verificar se a carteira está vazia
  var modalPortfolioEmpty = document.getElementById('modalPortfolioEmpty');
  var modalWalletTable = document.getElementById('modalWalletTable');
  var modalTbody = document.querySelector('#modalCarteira tbody');
  
  var hasAtivos = Object.keys(carteira).length > 0 && valorTotal > 0;
  
  if (modalPortfolioEmpty) {
    modalPortfolioEmpty.style.display = hasAtivos ? 'none' : 'block';
  }
  
  if (modalWalletTable) {
    modalWalletTable.style.display = hasAtivos ? 'block' : 'none';
  }
  
  // Atualizar tabela da carteira
  if (modalTbody && hasAtivos) {
    modalTbody.innerHTML = '';
    
    for (var ativo in carteira) {
      var quantidade = carteira[ativo];
      if (quantidade > 0) {
        var precoAtual = precos[ativo];
        var valorTotalAtivo = quantidade * precoAtual;
        
        // Calcular variação (simulada para demonstração)
        var variacao = ((Math.random() - 0.5) * 2).toFixed(2);
        var isPositive = parseFloat(variacao) >= 0;
        
        var row = modalTbody.insertRow();
        row.innerHTML = '<td><strong>' + ativo + '</strong></td>' +
                       '<td>' + quantidade + '</td>' +
                       '<td>R$ ' + precoAtual.toFixed(2) + '</td>' +
                       '<td><strong>R$ ' + valorTotalAtivo.toFixed(2) + '</strong></td>' +
                       '<td class="' + (isPositive ? 'positive' : 'negative') + '">' +
                       (isPositive ? '+' : '') + variacao + '%</td>';
      }
    }
  }
  
  debug('Modal da carteira atualizado', {
    valorTotal: valorTotal,
    totalAtivos: totalAtivos,
    totalPosicoes: totalPosicoes,
    hasAtivos: hasAtivos
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
      document.getElementById('export-count').textContent = '0';
      document.getElementById('export-total').textContent = 'R$ 0,00';
      return;
    }

    // Carregar extrato do usuário
    const extratoData = localStorage.getItem("adln_extrato_" + usuarioAtual);
    
    if (!extratoData) {
      document.getElementById('export-count').textContent = '0';
      document.getElementById('export-total').textContent = 'R$ 0,00';
      return;
    }

    const extrato = JSON.parse(extratoData);
    
    // Filtrar transações do dia atual
    const hoje = new Date();
    const hojeFormatado = hoje.toISOString().slice(0, 10);
    
    const transacoesDoDia = extrato.filter(transacao => {
      const dataTransacao = new Date(transacao.data).toISOString().slice(0, 10);
      return dataTransacao === hojeFormatado;
    });

    // Calcular valor total
    const valorTotal = transacoesDoDia.reduce((total, transacao) => {
      return total + (parseFloat(transacao.valorTotal) || 0);
    }, 0);

    // Atualizar elementos do modal
    document.getElementById('export-count').textContent = transacoesDoDia.length.toString();
    document.getElementById('export-total').textContent = `R$ ${valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    // Atualizar período
    const periodoElement = document.getElementById('export-period');
    if (periodoElement) {
      periodoElement.textContent = hoje.toLocaleDateString('pt-BR');
    }
    
  } catch (error) {
    console.error('Erro ao atualizar informações de exportação:', error);
    document.getElementById('export-count').textContent = 'Erro';
    document.getElementById('export-total').textContent = 'Erro';
  }
}


