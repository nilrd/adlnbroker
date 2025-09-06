// ===== SISTEMA DE TRADUÇÃO CENTRALIZADO =====
// Este arquivo contém todas as traduções do sistema

const TRANSLATIONS = {
  pt: {
    // Header
    welcome: "Bem-vindo,",
    balance: "Saldo:",
    hideBalance: "Ocultar saldo",
    showBalance: "Mostrar saldo",
    wallet: "Carteira/Portfólio",
    language: "Alternar Idioma",
    profile: "Perfil/Configurações",
    menu: "Menu",
    
    // Menu Items
    myAccount: "Minha Conta",
    deposit: "Depositar",
    wallet: "Carteira",
    changePassword: "Alterar Senha",
    logout: "Logout",
    
    // Wallet Modal
    walletTitle: "Carteira",
    currentBalance: "Saldo Atual",
    portfolio: "Portfólio",
    pendingOrders: "Ordens Pendentes",
    transactions: "Transações",
    totalAssets: "Total de Ativos",
    availableBalance: "Saldo Disponível",
    investedAmount: "Valor Investido",
    profitLoss: "Lucro/Prejuízo",
    
    // Trading Form
    buy: "Comprar",
    sell: "Vender",
    quantity: "Quantidade",
    price: "Preço",
    total: "Total",
    orderType: "Tipo de Ordem",
    marketOrder: "Ordem a Mercado",
    limitOrder: "Ordem Limitada",
    stopOrder: "Ordem Stop",
    sendOrder: "Enviar Ordem",
    cancelOrder: "Cancelar Ordem",
    
    // Business Rules Messages
    insufficientBalance: "Saldo insuficiente para realizar a compra",
    insufficientAssets: "Você não possui ativos suficientes para realizar a venda",
    marketClosed: "Mercado fechado. Tente novamente no próximo pregão",
    invalidPrice: "Preço inválido. Verifique os campos e tente novamente",
    invalidQuantity: "Quantidade inválida. Mínimo: 1 lote (100 unidades)",
    priceRangeError: "Preço fora do intervalo permitido (R$0.10 - R$1.000.00)",
    
    // Chart
    chart: "Gráfico",
    candlestick: "Candlestick",
    line: "Linha",
    timeframe: "Timeframe",
    oneMinute: "1 Minuto",
    fiveMinutes: "5 Minutos",
    thirtyMinutes: "30 Minutos",
    oneHour: "1 Hora",
    
    // Assets
    selectAsset: "Selecionar Ativo",
    searchAssets: "Buscar ativos...",
    noAssetsFound: "Nenhum ativo encontrado",
    assetPrice: "Preço",
    assetChange: "Variação",
    assetVolume: "Volume",
    
    // Market Status
    marketOpen: "Mercado Aberto",
    marketClosed: "Mercado Fechado",
    nextOpening: "Próxima abertura",
    nextClosing: "Próximo fechamento",
    
    // Common
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    confirm: "Confirmar",
    cancel: "Cancelar",
    save: "Salvar",
    edit: "Editar",
    delete: "Excluir",
    close: "Fechar",
    back: "Voltar",
    next: "Próximo",
    previous: "Anterior",
    
    // Time
    updatedAt: "Atualizado em",
    today: "Hoje",
    yesterday: "Ontem",
    thisWeek: "Esta semana",
    thisMonth: "Este mês",
    thisYear: "Este ano",
    
    // Dashboard
    dashboard: "Dashboard",
    overview: "Visão Geral",
    performance: "Performance",
    portfolio: "Portfólio",
    orders: "Ordens",
    history: "Histórico",
    
    // Trading
    trading: "Trading",
    orderBook: "Book de Ofertas",
    orderHistory: "Histórico de Ordens",
    activeOrders: "Ordens Ativas",
    filledOrders: "Ordens Executadas",
    cancelledOrders: "Ordens Canceladas",
    
    // Alerts & Notifications
    alert: "Alerta",
    notification: "Notificação",
    warning: "Aviso",
    info: "Informação",
    success: "Sucesso",
    error: "Erro",
    
    // Form Labels
    username: "Nome de Usuário",
    password: "Senha",
    email: "E-mail",
    phone: "Telefone",
    address: "Endereço",
    city: "Cidade",
    state: "Estado",
    country: "País",
    zipCode: "CEP",
    
    // Validation Messages
    required: "Campo obrigatório",
    invalidFormat: "Formato inválido",
    minLength: "Mínimo de {min} caracteres",
    maxLength: "Máximo de {max} caracteres",
    passwordMismatch: "Senhas não coincidem",
    emailExists: "E-mail já cadastrado",
    
    // Market Data
    lastPrice: "Último Preço",
    change: "Variação",
    volume: "Volume",
    high: "Máximo",
    low: "Mínimo",
    open: "Abertura",
    close: "Fechamento",
    
    // Order Status
    pending: "Pendente",
    filled: "Executada",
    cancelled: "Cancelada",
    rejected: "Rejeitada",
    partial: "Parcial",
    
    // Time & Date
    time: "Hora",
    date: "Data",
    now: "Agora",
    ago: "atrás",
    minutes: "minutos",
    hours: "horas",
    days: "dias",
    
    // Navigation
    home: "Início",
    settings: "Configurações",
    help: "Ajuda",
    about: "Sobre",
    contact: "Contato",
    support: "Suporte",
    
    // Actions
    add: "Adicionar",
    remove: "Remover",
    edit: "Editar",
    view: "Visualizar",
    download: "Baixar",
    upload: "Enviar",
    export: "Exportar",
    import: "Importar",
    
    // Status
    active: "Ativo",
    inactive: "Inativo",
    enabled: "Habilitado",
    disabled: "Desabilitado",
    online: "Online",
    offline: "Offline",
    
    // Financial
    currency: "Moeda",
    amount: "Valor",
    balance: "Saldo",
    credit: "Crédito",
    debit: "Débito",
    interest: "Juros",
    tax: "Imposto",
    fee: "Taxa"
  },
  
  en: {
    // Header
    welcome: "Welcome,",
    balance: "Balance:",
    hideBalance: "Hide balance",
    showBalance: "Show balance",
    wallet: "Wallet/Portfolio",
    language: "Toggle Language",
    profile: "Profile/Settings",
    menu: "Menu",
    
    // Menu Items
    myAccount: "My Account",
    deposit: "Deposit",
    wallet: "Wallet",
    changePassword: "Change Password",
    logout: "Logout",
    
    // Wallet Modal
    walletTitle: "Wallet",
    currentBalance: "Current Balance",
    portfolio: "Portfolio",
    pendingOrders: "Pending Orders",
    transactions: "Transactions",
    totalAssets: "Total Assets",
    availableBalance: "Available Balance",
    investedAmount: "Invested Amount",
    profitLoss: "Profit/Loss",
    
    // Trading Form
    buy: "Buy",
    sell: "Sell",
    quantity: "Quantity",
    price: "Price",
    total: "Total",
    orderType: "Order Type",
    marketOrder: "Market Order",
    limitOrder: "Limit Order",
    stopOrder: "Stop Order",
    sendOrder: "Send Order",
    cancelOrder: "Cancel Order",
    
    // Business Rules Messages
    insufficientBalance: "Insufficient balance to complete the purchase",
    insufficientAssets: "You don't have enough assets to complete the sale",
    marketClosed: "Market closed. Try again on the next trading day",
    invalidPrice: "Invalid price. Check the fields and try again",
    invalidQuantity: "Invalid quantity. Minimum: 1 lot (100 units)",
    priceRangeError: "Price outside allowed range ($0.10 - $1,000.00)",
    
    // Chart
    chart: "Chart",
    candlestick: "Candlestick",
    line: "Line",
    timeframe: "Timeframe",
    oneMinute: "1 Minute",
    fiveMinutes: "5 Minutes",
    thirtyMinutes: "30 Minutes",
    oneHour: "1 Hour",
    
    // Assets
    selectAsset: "Select Asset",
    searchAssets: "Search assets...",
    noAssetsFound: "No assets found",
    assetPrice: "Price",
    assetChange: "Change",
    assetVolume: "Volume",
    
    // Market Status
    marketOpen: "Market Open",
    marketClosed: "Market Closed",
    nextOpening: "Next opening",
    nextClosing: "Next closing",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    confirm: "Confirm",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    
    // Time
    updatedAt: "Updated at",
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This week",
    thisMonth: "This month",
    thisYear: "This year",
    
    // Dashboard
    dashboard: "Dashboard",
    overview: "Overview",
    performance: "Performance",
    portfolio: "Portfolio",
    orders: "Orders",
    history: "History",
    
    // Trading
    trading: "Trading",
    orderBook: "Order Book",
    orderHistory: "Order History",
    activeOrders: "Active Orders",
    filledOrders: "Filled Orders",
    cancelledOrders: "Cancelled Orders",
    
    // Alerts & Notifications
    alert: "Alert",
    notification: "Notification",
    warning: "Warning",
    info: "Information",
    success: "Success",
    error: "Error",
    
    // Form Labels
    username: "Username",
    password: "Password",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    state: "State",
    country: "Country",
    zipCode: "ZIP Code",
    
    // Validation Messages
    required: "Required field",
    invalidFormat: "Invalid format",
    minLength: "Minimum {min} characters",
    maxLength: "Maximum {max} characters",
    passwordMismatch: "Passwords don't match",
    emailExists: "Email already registered",
    
    // Market Data
    lastPrice: "Last Price",
    change: "Change",
    volume: "Volume",
    high: "High",
    low: "Low",
    open: "Open",
    close: "Close",
    
    // Order Status
    pending: "Pending",
    filled: "Filled",
    cancelled: "Cancelled",
    rejected: "Rejected",
    partial: "Partial",
    
    // Time & Date
    time: "Time",
    date: "Date",
    now: "Now",
    ago: "ago",
    minutes: "minutes",
    hours: "hours",
    days: "days",
    
    // Navigation
    home: "Home",
    settings: "Settings",
    help: "Help",
    about: "About",
    contact: "Contact",
    support: "Support",
    
    // Actions
    add: "Add",
    remove: "Remove",
    edit: "Edit",
    view: "View",
    download: "Download",
    upload: "Upload",
    export: "Export",
    import: "Import",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    enabled: "Enabled",
    disabled: "Disabled",
    online: "Online",
    offline: "Offline",
    
    // Financial
    currency: "Currency",
    amount: "Amount",
    balance: "Balance",
    credit: "Credit",
    debit: "Debit",
    interest: "Interest",
    tax: "Tax",
    fee: "Fee"
  }
};

// Função para obter tradução com fallback inteligente
function getTranslation(key, language = null) {
  const currentLang = language || window.currentLanguage || 'pt';
  
  // Tentar obter tradução no idioma solicitado
  let translation = TRANSLATIONS[currentLang]?.[key];
  
  // Se não encontrar e for inglês, tentar português como fallback
  if (!translation && currentLang === 'en') {
    translation = TRANSLATIONS['pt']?.[key];
    if (translation) {
      console.log(`Fallback para português: ${key}`);
    }
  }
  
  // Se ainda não encontrar, usar a chave como fallback
  if (!translation) {
    console.warn(`Translation key not found: ${key} for language: ${currentLang}`);
    return key;
  }
  
  return translation;
}

// Função para obter tradução com formatação
function getFormattedTranslation(key, params = {}, language = null) {
  let translation = getTranslation(key, language);
  
  // Substituir parâmetros na tradução
  Object.keys(params).forEach(param => {
    translation = translation.replace(`{${param}}`, params[param]);
  });
  
  return translation;
}

// Função para atualizar idioma global
function setGlobalLanguage(language) {
  if (TRANSLATIONS[language]) {
    window.currentLanguage = language;
    localStorage.setItem('systemLanguage', language);
    
    // Disparar evento para notificar mudança de idioma
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: language } 
    }));
    
    console.log(`Idioma do sistema alterado para: ${language}`);
    return true;
  } else {
    console.error(`Idioma não suportado: ${language}`);
    return false;
  }
}

// Função para obter idioma atual
function getCurrentLanguage() {
  return window.currentLanguage || 'pt';
}

// Função para carregar idioma salvo
function loadSavedLanguage() {
  const savedLanguage = localStorage.getItem('systemLanguage');
  
  // Verificar se o idioma salvo é válido
  if (savedLanguage && TRANSLATIONS[savedLanguage]) {
    setGlobalLanguage(savedLanguage);
    console.log(`Idioma carregado: ${savedLanguage === 'pt' ? 'Português (pt-BR)' : 'English (en-US)'}`);
  } else {
    // Forçar português como padrão
    setGlobalLanguage('pt');
    localStorage.setItem('systemLanguage', 'pt'); // Garantir que seja salvo
    console.log('Idioma padrão definido: Português (pt-BR)');
  }
}

// Função para traduzir todos os elementos da página
function translatePage(language = null) {
  const currentLang = language || getCurrentLanguage();
  
  // Traduzir elementos com atributo data-translate
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = getTranslation(key, currentLang);
    if (translation) {
      element.textContent = translation;
    }
  });
  
  // Traduzir elementos com atributos data-en e data-pt
  document.querySelectorAll('[data-en][data-pt]').forEach(element => {
    if (currentLang === 'pt') {
      element.textContent = element.getAttribute('data-pt');
    } else {
      element.textContent = element.getAttribute('data-en');
    }
  });
  
  // Traduzir placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    const translation = getTranslation(key, currentLang);
    if (translation) {
      element.placeholder = translation;
    }
  });
  
  // Traduzir títulos
  document.querySelectorAll('[data-translate-title]').forEach(element => {
    const key = element.getAttribute('data-translate-title');
    const translation = getTranslation(key, currentLang);
    if (translation) {
      element.title = translation;
    }
  });
  
  // Traduzir labels de formulários
  document.querySelectorAll('label[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = getTranslation(key, currentLang);
    if (translation) {
      element.textContent = translation;
    }
  });
  
  // Traduzir botões
  document.querySelectorAll('button[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = getTranslation(key, currentLang);
    if (translation) {
      element.textContent = translation;
    }
  });
  
  // Traduzir mensagens de validação
  document.querySelectorAll('[data-translate-validation]').forEach(element => {
    const key = element.getAttribute('data-translate-validation');
    const translation = getTranslation(key, currentLang);
    if (translation) {
      element.textContent = translation;
    }
  });
  
  // Traduzir tooltips e aria-labels
  document.querySelectorAll('[data-translate-tooltip]').forEach(element => {
    const key = element.getAttribute('data-translate-tooltip');
    const translation = getTranslation(key, currentLang);
    if (translation) {
      element.setAttribute('title', translation);
      element.setAttribute('aria-label', translation);
    }
  });
  
  console.log(`Página traduzida para: ${currentLang}`);
}

// Função para traduzir elemento específico
function translateElement(element, key, language = null) {
  if (element && key) {
    const translation = getTranslation(key, language);
    if (translation) {
      element.textContent = translation;
    }
  }
}

// Função para traduzir múltiplos elementos
function translateElements(translations, language = null) {
  Object.keys(translations).forEach(selector => {
    const key = translations[selector];
    const element = document.querySelector(selector);
    if (element) {
      translateElement(element, key, language);
    }
  });
}

// Inicialização automática
if (typeof window !== 'undefined') {
  // Carregar idioma salvo quando a página carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSavedLanguage);
  } else {
    loadSavedLanguage();
  }
  
  // Escutar mudanças de idioma
  window.addEventListener('languageChanged', (event) => {
    translatePage(event.detail.language);
  });
  
  // Expor funções globalmente
  window.getTranslation = getTranslation;
  window.getFormattedTranslation = getFormattedTranslation;
  window.setGlobalLanguage = setGlobalLanguage;
  window.getCurrentLanguage = getCurrentLanguage;
  window.translatePage = translatePage;
  window.translateElement = translateElement;
  window.translateElements = translateElements;
  window.TRANSLATIONS = TRANSLATIONS;
}

console.log('Sistema de tradução centralizado carregado!');
