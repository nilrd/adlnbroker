// Sistema de sincronização em tempo real para preços de ações
class RealTimeDataManager {
  constructor() {
    this.isRunning = false;
    this.updateInterval = 3000; // 3 segundos
    this.intervalId = null;
    this.lastUpdate = new Date();
    
    // Referência ao chartManager
    this.chartManager = null;
    
    // Dados base das ações (serão atualizados em tempo real)
    this.stocksData = {
      'PETR4': { 
        basePrice: 28.50, 
        currentPrice: 28.50, 
        change: -0.28, 
        changePercent: -0.98,
        volume: '2.5M',
        trend: 'down' 
      },
      'VALE3': { 
        basePrice: 72.30, 
        currentPrice: 72.30, 
        change: -0.29, 
        changePercent: -0.40,
        volume: '1.8M',
        trend: 'down' 
      },
      'ITUB4': { 
        basePrice: 31.20, 
        currentPrice: 31.20, 
        change: 0.29, 
        changePercent: 0.93,
        volume: '3.2M',
        trend: 'up' 
      },
      'BBDC4': { 
        basePrice: 27.80, 
        currentPrice: 27.80, 
        change: 0.10, 
        changePercent: 0.36,
        volume: '2.1M',
        trend: 'up' 
      },
      'ABEV3': { 
        basePrice: 14.25, 
        currentPrice: 14.25, 
        change: -0.06, 
        changePercent: -0.44,
        volume: '4.5M',
        trend: 'down' 
      },
      'MGLU3': { 
        basePrice: 3.45, 
        currentPrice: 3.45, 
        change: 0.02, 
        changePercent: 0.52,
        volume: '8.7M',
        trend: 'up' 
      }
    };
  }

  init(chartManagerInstance) {
    this.chartManager = chartManagerInstance;
    this.start();
    console.log('RealTimeDataManager inicializado');
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.updatePrices();
    }, this.updateInterval);
    
    console.log('Sincronização em tempo real iniciada');
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('Sincronização em tempo real parada');
  }

  updatePrices() {
    // Atualizar timestamp
    this.lastUpdate = new Date();
    this.updateLastUpdateDisplay();
    
    // Atualizar preços de todas as ações
    Object.keys(this.stocksData).forEach(symbol => {
      this.updateStockPrice(symbol);
    });
    
    // Atualizar interfaces
    this.updateStocksInterface();
    this.updateBookInterface();
    this.updateChartData();
    
    console.log('Preços atualizados em tempo real:', this.lastUpdate.toLocaleTimeString());
  }

  updateStockPrice(symbol) {
    const stock = this.stocksData[symbol];
    
    // Simular variação realista de preço (-2% a +2%)
    const variation = (Math.random() - 0.5) * 0.04;
    const newPrice = stock.currentPrice * (1 + variation);
    
    // Calcular mudança em relação ao preço base
    const priceChange = newPrice - stock.basePrice;
    const percentChange = (priceChange / stock.basePrice) * 100;
    
    // Atualizar dados
    stock.currentPrice = parseFloat(newPrice.toFixed(2));
    stock.change = parseFloat(priceChange.toFixed(2));
    stock.changePercent = parseFloat(percentChange.toFixed(2));
    stock.trend = stock.change >= 0 ? 'up' : 'down';
    
    // Simular variação de volume
    const volumeVariation = (Math.random() - 0.5) * 0.2;
    const currentVolume = parseFloat(stock.volume.replace('M', ''));
    const newVolume = Math.max(0.1, currentVolume * (1 + volumeVariation));
    stock.volume = newVolume.toFixed(1) + 'M';
  }

  updateStocksInterface() {
    Object.keys(this.stocksData).forEach(symbol => {
      const stock = this.stocksData[symbol];
      
      // Atualizar preço
      const priceElement = document.getElementById(`price-${symbol}`);
      if (priceElement) {
        priceElement.textContent = stock.currentPrice.toFixed(2);
        this.animateChange(priceElement, stock.trend);
      }
      
      // Atualizar variação
      const changeElement = document.getElementById(`change-${symbol}`);
      if (changeElement) {
        changeElement.textContent = `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}`;
        changeElement.className = `change ${stock.trend === 'up' ? 'positive' : 'negative'}`;
      }
      
      // Atualizar percentual
      const percentElement = document.getElementById(`percent-${symbol}`);
      if (percentElement) {
        percentElement.textContent = `(${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`;
        percentElement.className = `change-percent ${stock.trend === 'up' ? 'positive' : 'negative'}`;
      }
    });
  }

  updateBookInterface() {
    const bookTable = document.querySelector('#book tbody');
    if (!bookTable) return;
    
    // Limpar tabela
    bookTable.innerHTML = '';
    
    // Adicionar dados atualizados
    Object.keys(this.stocksData).forEach(symbol => {
      const stock = this.stocksData[symbol];
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td style="font-weight: 600; color: #ffffff;">${symbol}</td>
        <td style="font-weight: 600; color: #ffffff;">R$ ${stock.currentPrice.toFixed(2)}</td>
        <td style="color: ${stock.trend === 'up' ? '#00c851' : '#ff4444'}; font-weight: 600;">
          ${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%
        </td>
        <td style="color: #888; font-size: 12px;">${stock.volume}</td>
      `;
      
      bookTable.appendChild(row);
    });
  }

  updateChartData() {
    if (!this.chartManager) return;
    
    const currentSymbol = this.chartManager.currentSymbol;
    const stock = this.stocksData[currentSymbol];
    
    if (!stock) return;
    
    // Atualizar dados do chartManager
    if (this.chartManager.stockData[currentSymbol]) {
      this.chartManager.stockData[currentSymbol].price = stock.currentPrice;
      this.chartManager.stockData[currentSymbol].change = stock.change;
      this.chartManager.stockData[currentSymbol].changePercent = stock.changePercent;
    }
    
    // Atualizar interface do gráfico principal
    this.updateMainChartInfo(currentSymbol, stock);
    
    // Adicionar novo ponto ao gráfico (simulação)
    this.addNewDataPoint(currentSymbol, stock);
  }

  updateMainChartInfo(symbol, stock) {
    // Atualizar preço principal
    const priceElement = document.getElementById('selectedStockPrice');
    if (priceElement) {
      priceElement.textContent = `R$ ${stock.currentPrice.toFixed(2)}`;
      this.animateChange(priceElement, stock.trend);
    }
    
    // Atualizar variação principal
    const changeElement = document.getElementById('selectedStockChange');
    if (changeElement) {
      changeElement.textContent = `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`;
      changeElement.className = `change-main-v2 ${stock.trend === 'up' ? 'positive' : 'negative'}`;
    }
  }

  addNewDataPoint(symbol, stock) {
    if (!this.chartManager || !this.chartManager.chart) return;
    
    const chart = this.chartManager.chart;
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Adicionar novo ponto (manter apenas os últimos 30 pontos)
    if (chart.data.labels.length >= 30) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
    
    chart.data.labels.push(timeLabel);
    chart.data.datasets[0].data.push(stock.currentPrice);
    
    // Atualizar cores baseadas na tendência
    const color = stock.trend === 'up' ? '#00c851' : '#ff4444';
    const bgColor = stock.trend === 'up' ? 'rgba(0, 200, 81, 0.1)' : 'rgba(255, 68, 68, 0.1)';
    
    chart.data.datasets[0].borderColor = color;
    chart.data.datasets[0].backgroundColor = bgColor;
    chart.data.datasets[0].pointHoverBackgroundColor = color;
    
    // Atualizar gráfico suavemente
    chart.update('none');
  }

  animateChange(element, trend) {
    if (!element) return;
    
    // Adicionar classe de animação
    element.classList.remove('price-up', 'price-down');
    element.classList.add(trend === 'up' ? 'price-up' : 'price-down');
    
    // Remover classe após animação
    setTimeout(() => {
      element.classList.remove('price-up', 'price-down');
    }, 1000);
  }

  updateLastUpdateDisplay() {
    const updateElement = document.getElementById('lastUpdate');
    if (updateElement) {
      updateElement.textContent = this.lastUpdate.toLocaleTimeString('pt-BR');
    }
  }

  // Método para obter dados atuais de uma ação
  getStockData(symbol) {
    return this.stocksData[symbol] || null;
  }

  // Método para pausar/retomar atualizações
  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }
}

// Instância global do gerenciador de dados em tempo real
let realTimeManager;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Aguardar o chartManager estar pronto
  setTimeout(() => {
    if (window.chartManager) {
      realTimeManager = new RealTimeDataManager();
      realTimeManager.init(window.chartManager);
      
      // Tornar disponível globalmente
      window.realTimeManager = realTimeManager;
    }
  }, 1000);
});

