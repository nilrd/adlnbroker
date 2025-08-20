// Correção completa da funcionalidade dos stocks
// Este arquivo substitui a funcionalidade problemática dos stocks

// Dados das empresas
const COMPANY_DATA = {
  'PETR4': {
    name: 'Petróleo Brasileiro S.A.',
    shortName: 'PETROBRAS',
    sector: 'Petróleo e Gás',
    icon: '🛢️'
  },
  'VALE3': {
    name: 'Vale S.A.',
    shortName: 'VALE',
    sector: 'Mineração',
    icon: '⛏️'
  },
  'ITUB4': {
    name: 'Itaú Unibanco Holding S.A.',
    shortName: 'ITAU UNIBANCO',
    sector: 'Bancos',
    icon: '🏦'
  },
  'BBDC4': {
    name: 'Banco Bradesco S.A.',
    shortName: 'BRADESCO',
    sector: 'Bancos',
    icon: '🏛️'
  },
  'ABEV3': {
    name: 'Ambev S.A.',
    shortName: 'AMBEV',
    sector: 'Bebidas',
    icon: '🍺'
  },
  'MGLU3': {
    name: 'Magazine Luiza S.A.',
    shortName: 'MAGAZINE LUIZA',
    sector: 'Varejo',
    icon: '🛒'
  },
  'BBAS3': {
    name: 'Banco do Brasil S.A.',
    shortName: 'BANCO DO BRASIL',
    sector: 'Bancos',
    icon: '🏦'
  },
  'LREN3': {
    name: 'Lojas Renner S.A.',
    shortName: 'LOJAS RENNER',
    sector: 'Varejo',
    icon: '👗'
  }
};

// Função para renderizar a lista de stocks corrigida
function renderFixedStocksList() {
  const stocksList = document.querySelector('.stocks-list-expanded');
  if (!stocksList) {
    console.log('Lista de stocks não encontrada');
    return;
  }
  
  // Limpar conteúdo existente
  stocksList.innerHTML = '';
  
  // Renderizar cada ação
  ativos.forEach((symbol, index) => {
    const companyData = COMPANY_DATA[symbol];
    if (!companyData) return;
    
    const price = precos[symbol] || 0;
    const change = (Math.random() - 0.5) * 2; // Variação simulada
    const percent = price > 0 ? (change / price) * 100 : 0;
    
    const stockItem = document.createElement('div');
    stockItem.className = `stock-item-expanded ${index === 0 ? 'active' : ''}`;
    stockItem.setAttribute('data-symbol', symbol);
    
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeSymbol = change >= 0 ? '+' : '';
    
    stockItem.innerHTML = `
      <div class="stock-main-info">
        <div class="stock-icon">
          <div class="icon-fallback">${companyData.icon}</div>
        </div>
        <div class="stock-text-info">
          <div class="stock-symbol-large">${symbol}</div>
          <div class="stock-name-small">${companyData.shortName}</div>
        </div>
      </div>
      <div class="stock-price-info">
        <div class="price-large">R$ <span id="price-${symbol}">${price.toFixed(2)}</span></div>
        <div class="change-info">
          <span id="change-${symbol}" class="change ${changeClass}">${changeSymbol}${change.toFixed(2)}</span>
          <span id="percent-${symbol}" class="change-percent ${changeClass}">(${changeSymbol}${percent.toFixed(2)}%)</span>
        </div>
      </div>
    `;
    
    // Adicionar evento de clique
    stockItem.addEventListener('click', () => {
      selectStockFixed(symbol);
    });
    
    stocksList.appendChild(stockItem);
  });
  
  console.log('Lista de stocks renderizada com sucesso');
}

// Função para selecionar ação corrigida
function selectStockFixed(symbol) {
  console.log('Selecionando ação:', symbol);
  
  // Remover classe active de todos os itens
  const stockItems = document.querySelectorAll('.stock-item-expanded');
  stockItems.forEach(item => item.classList.remove('active'));
  
  // Adicionar classe active ao item selecionado
  const selectedItem = document.querySelector(`[data-symbol="${symbol}"]`);
  if (selectedItem) {
    selectedItem.classList.add('active');
  }
  
  // Atualizar informações do gráfico
  updateChartInfoFixed(symbol);
  
  // Chamar função original se existir
  if (typeof selectStock === 'function') {
    try {
      selectStock(symbol);
    } catch (error) {
      console.log('Erro ao chamar selectStock original:', error);
    }
  }
}

// Função para atualizar informações do gráfico
function updateChartInfoFixed(symbol) {
  const companyData = COMPANY_DATA[symbol];
  if (!companyData) return;
  
  const symbolElement = document.getElementById('selectedStockSymbol');
  const nameElement = document.getElementById('selectedStockName');
  const priceElement = document.getElementById('selectedStockPrice');
  const changeElement = document.getElementById('selectedStockChange');
  
  if (symbolElement) symbolElement.textContent = symbol;
  if (nameElement) nameElement.textContent = companyData.name;
  if (priceElement) priceElement.textContent = `R$ ${(precos[symbol] || 0).toFixed(2)}`;
  
  if (changeElement) {
    const change = (Math.random() - 0.5) * 2;
    const price = precos[symbol] || 1;
    const percent = (change / price) * 100;
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeSymbol = change >= 0 ? '+' : '';
    
    changeElement.textContent = `${changeSymbol}${change.toFixed(2)} (${changeSymbol}${percent.toFixed(2)}%)`;
    changeElement.className = `change-main-v2 ${changeClass}`;
  }
}

// Função para atualizar preços com animação melhorada
function updateStockPricesFixed(newPrices) {
  Object.keys(newPrices).forEach(symbol => {
    const priceElement = document.getElementById(`price-${symbol}`);
    const changeElement = document.getElementById(`change-${symbol}`);
    const percentElement = document.getElementById(`percent-${symbol}`);
    
    if (priceElement) {
      const oldPrice = parseFloat(priceElement.textContent) || 0;
      const newPrice = newPrices[symbol];
      const change = newPrice - oldPrice;
      const percent = oldPrice > 0 ? (change / oldPrice) * 100 : 0;
      
      // Animar mudança de preço
      priceElement.style.transition = 'color 0.3s ease';
      priceElement.style.color = change >= 0 ? '#00D4AA' : '#F84960';
      
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
}

// Função para inicializar as correções dos stocks
function initStocksFix() {
  console.log('Inicializando correções dos stocks...');
  
  // Aguardar um pouco para garantir que o DOM esteja pronto
  setTimeout(() => {
    renderFixedStocksList();
    
    // Selecionar primeira ação por padrão
    if (ativos && ativos.length > 0) {
      selectStockFixed(ativos[0]);
    }
    
    console.log('Correções dos stocks aplicadas com sucesso');
  }, 500);
}

// Sobrescrever funções globais se necessário
window.selectStockFixed = selectStockFixed;
window.updateStockPricesFixed = updateStockPricesFixed;
window.renderFixedStocksList = renderFixedStocksList;

// Exportar para uso global
window.StocksFix = {
  init: initStocksFix,
  renderList: renderFixedStocksList,
  selectStock: selectStockFixed,
  updatePrices: updateStockPricesFixed,
  companyData: COMPANY_DATA
};

console.log('StocksFix carregado');

