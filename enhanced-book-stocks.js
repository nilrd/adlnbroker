// Enhanced Book of Offers and Stocks with Icons
// Arquivo criado para aprimorar o book de ofertas e a seção de stocks

// Mapeamento de ícones para as ações
const ASSET_ICONS = {
  'PETR4': 'assets/icon-petr4.png',
  'VALE3': 'assets/icon-vale3.png',
  'ITUB4': 'assets/icon-itub4.png',
  'BBDC4': 'assets/icon-bbdc4.png',
  'ABEV3': 'assets/icon-abev3.png',
  'MGLU3': 'assets/icon-mglu3.png',
  'BBAS3': 'assets/icon-bbas3.png',
  'LREN3': 'assets/icon-lren3.png'
};

// Nomes completos das empresas
const ASSET_NAMES = {
  'PETR4': 'Petróleo Brasileiro S.A.',
  'VALE3': 'Vale S.A.',
  'ITUB4': 'Itaú Unibanco Holding S.A.',
  'BBDC4': 'Banco Bradesco S.A.',
  'ABEV3': 'Ambev S.A.',
  'MGLU3': 'Magazine Luiza S.A.',
  'BBAS3': 'Banco do Brasil S.A.',
  'LREN3': 'Lojas Renner S.A.'
};

// Função para obter ícone do ativo
function getAssetIcon(symbol) {
  return ASSET_ICONS[symbol] || 'assets/icon-default.png';
}

// Função para obter nome completo do ativo
function getAssetFullName(symbol) {
  return ASSET_NAMES[symbol] || symbol;
}

// Função para formatar volume
function formatVolume(volume) {
  if (volume >= 1000000000) {
    return (volume / 1000000000).toFixed(1) + 'B';
  } else if (volume >= 1000000) {
    return (volume / 1000000).toFixed(1) + 'M';
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + 'K';
  }
  return volume.toLocaleString('pt-BR');
}

// Função para gerar volume simulado
function generateSimulatedVolume(symbol) {
  const baseVolumes = {
    'PETR4': 15000000,
    'VALE3': 12000000,
    'ITUB4': 18000000,
    'BBDC4': 14000000,
    'ABEV3': 8000000,
    'MGLU3': 6000000,
    'BBAS3': 10000000,
    'LREN3': 4000000
  };
  
  const base = baseVolumes[symbol] || 5000000;
  const variation = 0.8 + (Math.random() * 0.4); // Variação de 80% a 120%
  return Math.floor(base * variation);
}

// Função aprimorada para renderizar o book de ofertas
function renderEnhancedBookOffers() {
  const bookTable = document.querySelector('#book tbody');
  if (!bookTable) return;
  
  // Limpar conteúdo existente
  bookTable.innerHTML = '';
  
  // Gerar dados simulados para o book
  const bookData = ativos.map(symbol => {
    const price = precos[symbol];
    const change = (Math.random() - 0.5) * 2; // Variação de -1 a +1
    const percent = (change / price) * 100;
    const volume = generateSimulatedVolume(symbol);
    
    return {
      symbol,
      name: getAssetFullName(symbol),
      price,
      change,
      percent,
      volume,
      icon: getAssetIcon(symbol)
    };
  });
  
  // Ordenar por volume (maior para menor)
  bookData.sort((a, b) => b.volume - a.volume);
  
  // Renderizar cada linha
  bookData.forEach(asset => {
    const row = document.createElement('tr');
    row.className = 'book-row';
    
    const changeClass = asset.change >= 0 ? 'positive' : 'negative';
    const changeSymbol = asset.change >= 0 ? '+' : '';
    
    row.innerHTML = `
      <td class="asset-cell">
        <div class="asset-info">
          <div class="asset-icon">
            <img src="${asset.icon}" alt="${asset.symbol}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="icon-fallback" style="display: none;">📈</div>
          </div>
          <div class="asset-details">
            <span class="asset-symbol">${asset.symbol}</span>
            <span class="asset-name">${asset.name}</span>
          </div>
        </div>
      </td>
      <td class="price-cell">R$ ${asset.price.toFixed(2)}</td>
      <td class="change-cell ${changeClass}">
        <div class="change-info">
          <span class="change-value">${changeSymbol}${asset.change.toFixed(2)}</span>
          <span class="change-percent">(${changeSymbol}${asset.percent.toFixed(2)}%)</span>
        </div>
      </td>
      <td class="volume-cell">${formatVolume(asset.volume)}</td>
    `;
    
    // Adicionar evento de clique para selecionar ação
    row.addEventListener('click', () => {
      selectStockFromBook(asset.symbol);
    });
    
    bookTable.appendChild(row);
  });
}

// Função para selecionar ação a partir do book
function selectStockFromBook(symbol) {
  // Atualizar ação selecionada
  if (typeof selectStock === 'function') {
    selectStock(symbol);
  }
  
  // Destacar linha selecionada
  const rows = document.querySelectorAll('#book tbody tr');
  rows.forEach(row => row.classList.remove('selected'));
  
  const selectedRow = Array.from(rows).find(row => 
    row.querySelector('.asset-symbol').textContent === symbol
  );
  
  if (selectedRow) {
    selectedRow.classList.add('selected');
  }
}

// Função aprimorada para renderizar a lista de stocks
function renderEnhancedStocksList() {
  const stocksList = document.querySelector('.stocks-list-expanded');
  if (!stocksList) return;
  
  // Limpar conteúdo existente
  stocksList.innerHTML = '';
  
  // Renderizar cada ação
  ativos.forEach((symbol, index) => {
    const price = precos[symbol];
    const change = (Math.random() - 0.5) * 2; // Variação simulada
    const percent = (change / price) * 100;
    
    const stockItem = document.createElement('div');
    stockItem.className = `stock-item-expanded ${index === 0 ? 'active' : ''}`;
    stockItem.setAttribute('data-symbol', symbol);
    
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeSymbol = change >= 0 ? '+' : '';
    
    stockItem.innerHTML = `
      <div class="stock-main-info">
        <div class="stock-icon">
          <img src="${getAssetIcon(symbol)}" alt="${symbol}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="icon-fallback" style="display: none;">📈</div>
        </div>
        <div class="stock-text-info">
          <div class="stock-symbol-large">${symbol}</div>
          <div class="stock-name-small">${getAssetFullName(symbol)}</div>
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
      selectStockEnhanced(symbol);
    });
    
    stocksList.appendChild(stockItem);
  });
}

// Função aprimorada para selecionar ação
function selectStockEnhanced(symbol) {
  // Remover classe active de todos os itens
  const stockItems = document.querySelectorAll('.stock-item-expanded');
  stockItems.forEach(item => item.classList.remove('active'));
  
  // Adicionar classe active ao item selecionado
  const selectedItem = document.querySelector(`[data-symbol="${symbol}"]`);
  if (selectedItem) {
    selectedItem.classList.add('active');
  }
  
  // Atualizar informações do gráfico
  updateChartInfo(symbol);
  
  // Chamar função original se existir
  if (typeof selectStock === 'function') {
    selectStock(symbol);
  }
}

// Função para atualizar informações do gráfico
function updateChartInfo(symbol) {
  const symbolElement = document.getElementById('selectedStockSymbol');
  const nameElement = document.getElementById('selectedStockName');
  const priceElement = document.getElementById('selectedStockPrice');
  const changeElement = document.getElementById('selectedStockChange');
  
  if (symbolElement) symbolElement.textContent = symbol;
  if (nameElement) nameElement.textContent = getAssetFullName(symbol);
  if (priceElement) priceElement.textContent = `R$ ${precos[symbol].toFixed(2)}`;
  
  if (changeElement) {
    const change = (Math.random() - 0.5) * 2;
    const percent = (change / precos[symbol]) * 100;
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeSymbol = change >= 0 ? '+' : '';
    
    changeElement.textContent = `${changeSymbol}${change.toFixed(2)} (${changeSymbol}${percent.toFixed(2)}%)`;
    changeElement.className = `change-main-v2 ${changeClass}`;
  }
}

// Função para adicionar estilos CSS específicos para os ícones
function addIconStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .stock-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--accent-dark, #3C4043);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      margin-right: 12px;
    }
    
    .stock-icon img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
    
    .icon-fallback {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    
    .asset-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      background: var(--accent-dark, #3C4043);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }
    
    .asset-icon img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    
    .stock-text-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .book-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .book-row:hover {
      background-color: rgba(240, 185, 11, 0.05);
    }
    
    .book-row.selected {
      background-color: rgba(240, 185, 11, 0.1);
      border-left: 3px solid var(--primary-gold, #F0B90B);
    }
    
    .change-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    @media (max-width: 768px) {
      .stock-icon {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      
      .stock-icon img {
        width: 24px;
        height: 24px;
      }
      
      .asset-icon {
        width: 24px;
        height: 24px;
      }
      
      .asset-icon img {
        width: 18px;
        height: 18px;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Função para inicializar as melhorias
function initEnhancedBookAndStocks() {
  // Adicionar estilos
  addIconStyles();
  
  // Renderizar componentes aprimorados
  renderEnhancedStocksList();
  renderEnhancedBookOffers();
  
  // Atualizar a cada 30 segundos
  setInterval(() => {
    renderEnhancedBookOffers();
  }, 30000);
  
  console.log('[ADLN] Enhanced Book and Stocks initialized');
}

// Função para atualizar preços com animação
function updatePricesWithAnimation(newPrices) {
  Object.keys(newPrices).forEach(symbol => {
    const priceElement = document.getElementById(`price-${symbol}`);
    const changeElement = document.getElementById(`change-${symbol}`);
    const percentElement = document.getElementById(`percent-${symbol}`);
    
    if (priceElement) {
      const oldPrice = parseFloat(priceElement.textContent);
      const newPrice = newPrices[symbol];
      const change = newPrice - oldPrice;
      const percent = (change / oldPrice) * 100;
      
      // Animar mudança de preço
      priceElement.style.transition = 'color 0.3s ease';
      priceElement.style.color = change >= 0 ? '#00D4AA' : '#F84960';
      
      setTimeout(() => {
        priceElement.style.color = '';
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
  
  // Atualizar book de ofertas
  renderEnhancedBookOffers();
}

// Exportar funções para uso global
window.EnhancedBookAndStocks = {
  init: initEnhancedBookAndStocks,
  renderBookOffers: renderEnhancedBookOffers,
  renderStocksList: renderEnhancedStocksList,
  selectStock: selectStockEnhanced,
  updatePrices: updatePricesWithAnimation,
  getAssetIcon,
  getAssetFullName,
  formatVolume
};

