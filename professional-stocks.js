// JavaScript Profissional para Stocks - Padrão Profit Pro

// Dados das empresas com informações completas
const PROFESSIONAL_STOCKS_DATA = {
  'PETR4': {
    name: 'Petróleo Brasileiro S.A.',
    shortName: 'PETROBRAS',
    sector: 'Petróleo e Gás',
    icon: '⛽',
    color: '#4a9eff'
  },
  'VALE3': {
    name: 'Vale S.A.',
    shortName: 'VALE',
    sector: 'Mineração',
    icon: '⛏️',
    color: '#d4a574'
  },
  'ITUB4': {
    name: 'Itaú Unibanco Holding S.A.',
    shortName: 'ITAU UNIBANCO',
    sector: 'Bancos',
    icon: '🏦',
    color: '#ff8c00'
  },
  'BBDC4': {
    name: 'Banco Bradesco S.A.',
    shortName: 'BRADESCO',
    sector: 'Bancos',
    icon: '🏛️',
    color: '#ff4444'
  },
  'ABEV3': {
    name: 'Ambev S.A.',
    shortName: 'AMBEV',
    sector: 'Bebidas',
    icon: '🍺',
    color: '#44aaff'
  },
  'MGLU3': {
    name: 'Magazine Luiza S.A.',
    shortName: 'MAGAZINE LUIZA',
    sector: 'Varejo',
    icon: '🛒',
    color: '#ff44ff'
  },
  'BBAS3': {
    name: 'Banco do Brasil S.A.',
    shortName: 'BANCO DO BRASIL',
    sector: 'Bancos',
    icon: '🏦',
    color: '#ffff44'
  },
  'LREN3': {
    name: 'Lojas Renner S.A.',
    shortName: 'LOJAS RENNER',
    sector: 'Varejo',
    icon: '👗',
    color: '#aa44ff'
  }
};

// Classe para gerenciar os stocks profissionalmente
class ProfessionalStocksManager {
  constructor() {
    this.selectedStock = null;
    this.stocksContainer = null;
    this.updateInterval = null;
  }

  init() {
    console.log('Inicializando Professional Stocks Manager...');
    
    // Aguardar DOM estar pronto
    setTimeout(() => {
      this.stocksContainer = document.querySelector('.stocks-list-expanded');
      if (this.stocksContainer) {
        this.render();
        this.startUpdates();
        console.log('Professional Stocks Manager inicializado com sucesso');
      } else {
        console.error('Container de stocks não encontrado');
      }
    }, 100);
  }

  render() {
    if (!this.stocksContainer) return;

    // Limpar container
    this.stocksContainer.innerHTML = '';

    // Renderizar cada ação
    ativos.forEach((symbol, index) => {
      const stockData = PROFESSIONAL_STOCKS_DATA[symbol];
      if (!stockData) return;

      const stockElement = this.createStockElement(symbol, stockData, index === 0);
      this.stocksContainer.appendChild(stockElement);
    });

    // Selecionar primeira ação por padrão
    if (ativos.length > 0) {
      this.selectStock(ativos[0]);
    }
  }

  createStockElement(symbol, stockData, isActive = false) {
    const price = precos[symbol] || 0;
    const change = (Math.random() - 0.5) * 2; // Simulação
    const percent = price > 0 ? (change / price) * 100 : 0;

    const element = document.createElement('div');
    element.className = `stock-item-expanded ${isActive ? 'active' : ''}`;
    element.setAttribute('data-symbol', symbol);

    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeSymbol = change >= 0 ? '+' : '';

    element.innerHTML = `
      <div class="stock-main-info">
        <div class="stock-icon"></div>
        <div class="stock-text-info">
          <div class="stock-symbol-large">${symbol}</div>
          <div class="stock-name-small">${stockData.shortName}</div>
        </div>
      </div>
      <div class="stock-price-info">
        <div class="price-large">R$ <span class="price-value">${price.toFixed(2)}</span></div>
        <div class="change-info">
          <span class="change ${changeClass}">${changeSymbol}${change.toFixed(2)}</span>
          <span class="change-percent ${changeClass}">(${changeSymbol}${percent.toFixed(2)}%)</span>
        </div>
      </div>
    `;

    // Adicionar evento de clique
    element.addEventListener('click', () => {
      this.selectStock(symbol);
    });

    return element;
  }

  selectStock(symbol) {
    // Remover seleção anterior
    const activeItems = this.stocksContainer.querySelectorAll('.stock-item-expanded.active');
    activeItems.forEach(item => item.classList.remove('active'));

    // Adicionar seleção atual
    const selectedItem = this.stocksContainer.querySelector(`[data-symbol="${symbol}"]`);
    if (selectedItem) {
      selectedItem.classList.add('active');
    }

    this.selectedStock = symbol;
    this.updateChartInfo(symbol);

    // Chamar função original se existir
    if (typeof selectStock === 'function') {
      try {
        selectStock(symbol);
      } catch (error) {
        console.log('Erro ao chamar selectStock original:', error);
      }
    }

    console.log('Stock selecionado:', symbol);
  }

  updateChartInfo(symbol) {
    const stockData = PROFESSIONAL_STOCKS_DATA[symbol];
    if (!stockData) return;

    // Atualizar informações do gráfico
    const elements = {
      symbol: document.getElementById('selectedStockSymbol'),
      name: document.getElementById('selectedStockName'),
      price: document.getElementById('selectedStockPrice'),
      change: document.getElementById('selectedStockChange')
    };

    if (elements.symbol) elements.symbol.textContent = symbol;
    if (elements.name) elements.name.textContent = stockData.name;
    if (elements.price) elements.price.textContent = `R$ ${(precos[symbol] || 0).toFixed(2)}`;

    if (elements.change) {
      const change = (Math.random() - 0.5) * 2;
      const price = precos[symbol] || 1;
      const percent = (change / price) * 100;
      const changeClass = change >= 0 ? 'positive' : 'negative';
      const changeSymbol = change >= 0 ? '+' : '';

      elements.change.textContent = `${changeSymbol}${change.toFixed(2)} (${changeSymbol}${percent.toFixed(2)}%)`;
      elements.change.className = `change-main-v2 ${changeClass}`;
    }
  }

  updatePrices(newPrices) {
    Object.keys(newPrices).forEach(symbol => {
      const stockElement = this.stocksContainer.querySelector(`[data-symbol="${symbol}"]`);
      if (!stockElement) return;

      const priceElement = stockElement.querySelector('.price-value');
      const changeElement = stockElement.querySelector('.change');
      const percentElement = stockElement.querySelector('.change-percent');

      if (priceElement) {
        const oldPrice = parseFloat(priceElement.textContent) || 0;
        const newPrice = newPrices[symbol];
        const change = newPrice - oldPrice;
        const percent = oldPrice > 0 ? (change / oldPrice) * 100 : 0;

        // Animar mudança de preço
        priceElement.style.transition = 'color 0.3s ease';
        priceElement.style.color = change >= 0 ? '#00D4AA' : '#FF4444';

        setTimeout(() => {
          priceElement.style.color = '#FFFFFF';
        }, 1000);

        // Atualizar valores
        priceElement.textContent = newPrice.toFixed(2);

        if (changeElement && percentElement) {
          const changeClass = change >= 0 ? 'positive' : 'negative';
          const changeSymbol = change >= 0 ? '+' : '';

          changeElement.textContent = `${changeSymbol}${change.toFixed(2)}`;
          changeElement.className = `change ${changeClass}`;

          percentElement.textContent = `(${changeSymbol}${percent.toFixed(2)}%)`;
          percentElement.className = `change-percent ${changeClass}`;
        }
      }
    });

    // Atualizar gráfico se necessário
    if (this.selectedStock && newPrices[this.selectedStock]) {
      this.updateChartInfo(this.selectedStock);
    }
  }

  startUpdates() {
    // Atualizar preços a cada 5 segundos
    this.updateInterval = setInterval(() => {
      const simulatedPrices = {};
      ativos.forEach(symbol => {
        const currentPrice = precos[symbol] || 0;
        const variation = (Math.random() - 0.5) * 0.1; // Variação de -5% a +5%
        simulatedPrices[symbol] = Math.max(0.01, currentPrice * (1 + variation));
      });
      
      // Atualizar preços globais
      Object.assign(precos, simulatedPrices);
      
      // Atualizar interface
      this.updatePrices(simulatedPrices);
    }, 5000);
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// Instância global
let professionalStocksManager = null;

// Função para inicializar
function initProfessionalStocks() {
  if (professionalStocksManager) {
    professionalStocksManager.destroy();
  }
  
  professionalStocksManager = new ProfessionalStocksManager();
  professionalStocksManager.init();
}

// Exportar para uso global
window.ProfessionalStocks = {
  init: initProfessionalStocks,
  manager: () => professionalStocksManager,
  data: PROFESSIONAL_STOCKS_DATA
};

console.log('Professional Stocks carregado');

