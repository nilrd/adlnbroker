class NewChartManager {
  constructor() {
    this.chart = null;
    this.currentSymbol = 'PETR4';
    this.currentType = 'line'; // 'line' ou 'candlestick'
    this.currentPeriod = '1D';
    this.stockData = {}; // Será preenchido com dados reais ou simulados
    this.bookData = {}; // Será preenchido com dados do book de ofertas
    this.updateInterval = 10000; // 10 segundos conforme regra de negócio
    this.intervalId = null;
  }

  init() {
    const canvas = document.getElementById('mainChart');
    if (!canvas) {
      console.error('Canvas mainChart não encontrado');
      return;
    }
    this.initializeStockData();
    this.createChart();
    this.startRealtimeUpdates();
    console.log('NewChartManager inicializado');
  }

  createChart() {
    const canvas = document.getElementById('mainChart');
    const ctx = canvas.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    if (this.currentType === 'line') {
      this.createLineChart(ctx);
    } else {
      this.createCandlestickChart(ctx);
    }
  }

  createLineChart(ctx) {
    const data = this.stockData[this.currentSymbol] ? this.stockData[this.currentSymbol].history : [];
    const labels = data.map(item => item.time);
    const prices = data.map(item => item.price);

    // Determinar cor baseada na tendência atual
    const currentStock = this.stockData[this.currentSymbol];
    const isPositive = currentStock && currentStock.change >= 0;
    const lineColor = isPositive ? '#00c851' : '#ff4444';
    const fillColor = isPositive ? 'rgba(0, 200, 81, 0.1)' : 'rgba(255, 68, 68, 0.1)';

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: this.currentSymbol,
          data: prices,
          borderColor: lineColor,
          backgroundColor: fillColor,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: lineColor,
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2
        }]
      },
      options: this.getChartOptions()
    });
  }

  createCandlestickChart(ctx) {
    const ohlcData = this.stockData[this.currentSymbol] ? this.stockData[this.currentSymbol].ohlcData : [];
    const labels = ohlcData.map(item => item.time);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'High-Low',
          data: ohlcData.map(item => [item.low, item.high]),
          backgroundColor: ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444'),
          borderColor: ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444'),
          borderWidth: 1,
          barThickness: 2
        }, {
          label: 'Open-Close',
          data: ohlcData.map(item => [Math.min(item.open, item.close), Math.max(item.open, item.close)]),
          backgroundColor: ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444'),
          borderColor: ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444'),
          borderWidth: 1,
          barThickness: 8
        }]
      },
      options: this.getCandlestickOptions()
    });
  }

  getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(26, 31, 46, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#f0b90b',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: function(context) {
              return context[0].label;
            },
            label: function(context) {
              return `R$ ${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: '#888888',
            font: {
              size: 11
            },
            maxTicksLimit: 8
          }
        },
        y: {
          display: true,
          position: 'right',
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: '#888888',
            font: {
              size: 11
            },
            callback: function(value) {
              return 'R$ ' + value.toFixed(2);
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      elements: {
        point: {
          hoverRadius: 10
        }
      }
    };
  }

  getCandlestickOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(26, 31, 46, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#f0b90b',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: function(context) {
              return context[0].label;
            },
            label: function(context) {
              const dataIndex = context.dataIndex;
              const ohlcData = newChartManager.stockData[newChartManager.currentSymbol].ohlcData[dataIndex];
              return [
                `Abertura: R$ ${ohlcData.open.toFixed(2)}`,
                `Máxima: R$ ${ohlcData.high.toFixed(2)}`,
                `Mínima: R$ ${ohlcData.low.toFixed(2)}`,
                `Fechamento: R$ ${ohlcData.close.toFixed(2)}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: '#888888',
            font: {
              size: 11
            },
            maxTicksLimit: 8
          }
        },
        y: {
          display: true,
          position: 'right',
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: '#888888',
            font: {
              size: 11
            },
            callback: function(value) {
              return 'R$ ' + value.toFixed(2);
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    };
  }

  // Obter intervalo em milissegundos baseado no período
  getIntervalInMs() {
    switch (this.currentPeriod) {
      case '1D': // 1 minuto
        return 60 * 1000;
      case '5M': // 5 minutos
        return 5 * 60 * 1000;
      case '30M': // 30 minutos
        return 30 * 60 * 1000;
      case '1H': // 1 hora
        return 60 * 60 * 1000;
      default:
        return 60 * 1000; // Padrão: 1 minuto
    }
  }

  startRealtimeUpdates() {
    // Parar atualizações anteriores se existirem
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Usar o intervalo correto baseado na seleção do usuário - BUG 2 CORRIGIDO
    const intervalMs = this.getIntervalInMs();
    
    this.intervalId = setInterval(() => {
      this.updateStockPrices();
      this.updateBookOfOffers();
      this.updateChart();
      this.updateStocksDisplay();
    }, intervalMs);
    
    console.log(`Atualizações em tempo real iniciadas com intervalo de ${intervalMs/1000} segundos (${this.currentPeriod})`);
  }

  updateStockPrices() {
    // Simulação de atualização de preços conforme regra de negócio
    // Variação de R$0,01 por ciclo, simulando mercado em movimento
    for (const symbol in this.stockData) {
      let currentPrice = this.stockData[symbol].price;
      const variation = (Math.random() - 0.5) * 0.02; // Variação de R$0,01 por ciclo
      currentPrice = currentPrice + variation;
      
      // Garantir que o preço não seja negativo
      if (currentPrice < 0.01) currentPrice = 0.01;
      
      this.stockData[symbol].price = parseFloat(currentPrice.toFixed(2));

      // Calcular mudança em relação ao preço base
      const priceChange = this.stockData[symbol].price - this.stockData[symbol].basePrice;
      const percentChange = (priceChange / this.stockData[symbol].basePrice) * 100;
      
      this.stockData[symbol].change = parseFloat(priceChange.toFixed(2));
      this.stockData[symbol].changePercent = parseFloat(percentChange.toFixed(2));

      // Atualizar histórico para o gráfico de linha
      const now = new Date();
      const timeLabel = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      this.stockData[symbol].history.push({ 
        time: timeLabel, 
        price: this.stockData[symbol].price 
      });
      
      // Gerar dados OHLC para candlestick
      const open = this.stockData[symbol].lastPrice || this.stockData[symbol].price;
      const close = this.stockData[symbol].price;
      const high = Math.max(open, close, close * (1 + Math.random() * 0.01));
      const low = Math.min(open, close, close * (1 - Math.random() * 0.01));
      
      this.stockData[symbol].ohlcData.push({
        time: timeLabel,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2))
      });
      
      this.stockData[symbol].lastPrice = this.stockData[symbol].price;
      
      // Manter apenas os últimos 60 pontos para o gráfico (10 minutos de histórico)
      if (this.stockData[symbol].history.length > 60) {
        this.stockData[symbol].history.shift();
      }
      if (this.stockData[symbol].ohlcData.length > 60) {
        this.stockData[symbol].ohlcData.shift();
      }
    }
  }

  updateBookOfOffers() {
    // Atualização do book de ofertas com os mesmos preços dos stocks
    // Garantindo sincronia conforme solicitado
    for (const symbol in this.stockData) {
      this.bookData[symbol] = {
        price: this.stockData[symbol].price,
        variation: this.stockData[symbol].changePercent,
        volume: Math.floor(Math.random() * 1000) + 100 // Volume simulado
      };
    }
    this.renderBookOfOffers();
  }

  renderBookOfOffers() {
    const bookTableBody = document.querySelector('#book tbody');
    if (!bookTableBody) return;
    
    bookTableBody.innerHTML = ''; // Limpar tabela existente

    for (const symbol in this.bookData) {
      const data = this.bookData[symbol];
      const row = bookTableBody.insertRow();
      
      // Ativo
      const cellSymbol = row.insertCell();
      cellSymbol.textContent = symbol;
      cellSymbol.style.fontWeight = '600';
      cellSymbol.style.color = '#ffffff';
      
      // Preço
      const cellPrice = row.insertCell();
      cellPrice.textContent = `R$ ${data.price.toFixed(2)}`;
      cellPrice.style.fontWeight = '600';
      cellPrice.style.color = '#ffffff';
      
      // Variação
      const cellVariation = row.insertCell();
      cellVariation.textContent = `${data.variation >= 0 ? '+' : ''}${data.variation.toFixed(2)}%`;
      cellVariation.style.color = data.variation >= 0 ? '#00c851' : '#ff4444';
      cellVariation.style.fontWeight = '600';
      
      // Volume
      const cellVolume = row.insertCell();
      cellVolume.textContent = data.volume;
      cellVolume.style.color = '#888';
      cellVolume.style.fontSize = '12px';
    }
    
    // Atualizar timestamp da última atualização
    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('pt-BR');
  }

  updateChart() {
    if (!this.chart) return;
    
    if (this.currentType === 'line') {
      const data = this.stockData[this.currentSymbol] ? this.stockData[this.currentSymbol].history : [];
      this.chart.data.labels = data.map(item => item.time);
      this.chart.data.datasets[0].data = data.map(item => item.price);
      
      // Atualizar cores baseadas na tendência atual
      const currentStock = this.stockData[this.currentSymbol];
      const isPositive = currentStock && currentStock.change >= 0;
      const lineColor = isPositive ? '#00c851' : '#ff4444';
      const fillColor = isPositive ? 'rgba(0, 200, 81, 0.1)' : 'rgba(255, 68, 68, 0.1)';
      
      this.chart.data.datasets[0].borderColor = lineColor;
      this.chart.data.datasets[0].backgroundColor = fillColor;
      this.chart.data.datasets[0].pointHoverBackgroundColor = lineColor;
    } else {
      // Para candlestick, recriar o gráfico com novos dados
      this.createChart();
      return;
    }
    
    this.chart.update('none');

    // Atualizar informações do stock selecionado no cabeçalho do gráfico
    this.updateSelectedStockInfo();
  }

  updateStocksDisplay() {
    // Atualizar a exibição na seção de Stocks com os mesmos valores
    for (const symbol in this.stockData) {
      const stock = this.stockData[symbol];
      
      // Atualizar preço
      const priceElement = document.getElementById(`price-${symbol}`);
      if (priceElement) {
        priceElement.textContent = stock.price.toFixed(2);
      }
      
      // Atualizar variação
      const changeElement = document.getElementById(`change-${symbol}`);
      if (changeElement) {
        changeElement.textContent = `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}`;
        changeElement.className = `change ${stock.change >= 0 ? 'positive' : 'negative'}`;
      }
      
      // Atualizar percentual
      const percentElement = document.getElementById(`percent-${symbol}`);
      if (percentElement) {
        percentElement.textContent = `(${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`;
        percentElement.className = `change-percent ${stock.change >= 0 ? 'positive' : 'negative'}`;
      }
    }
  }

  updateSelectedStockInfo() {
    const stock = this.stockData[this.currentSymbol];
    if (stock) {
      document.getElementById('selectedStockSymbol').textContent = this.currentSymbol;
      document.getElementById('selectedStockName').textContent = stock.name;
      document.getElementById('selectedStockPrice').textContent = `R$ ${stock.price.toFixed(2)}`;
      
      const changeElement = document.getElementById('selectedStockChange');
      if (changeElement) {
        changeElement.textContent = `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`;
        changeElement.className = `change-main-v2 ${stock.change >= 0 ? 'positive' : 'negative'}`;
      }
    }
  }

  selectStock(symbol) {
    if (!this.stockData[symbol]) {
      console.error('Símbolo não encontrado:', symbol);
      return;
    }
    this.currentSymbol = symbol;
    this.createChart(); // Recriar gráfico com nova cor baseada na tendência
    this.updateSelectedStockInfo();
    this.updateStockSelection(symbol);
  }

  setChartType(type) {
    this.currentType = type;
    
    // Atualizar botões de tipo
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
      if (btn.getAttribute('data-type') === type) {
        btn.classList.add('active');
      }
    });
    
    this.createChart();
  }

  setChartPeriod(period) {
    this.currentPeriod = period;
    
    // Atualizar botões de período
    document.querySelectorAll('.period-btn-v2').forEach(btn => {
      btn.classList.remove('active');
    });
    
    document.querySelectorAll('.period-btn-v2').forEach(btn => {
      if (btn.textContent === period) {
        btn.classList.add('active');
      }
    });
    
    // Regenerar dados para o período (simulação)
    const stock = this.stockData[this.currentSymbol];
    let days;
    switch(period) {
      case '1D': days = 30; break;
      case '5M': days = 60; break;
      case '30M': days = 90; break;
      case '1H': days = 120; break;
      default: days = 30;
    }
    
    // Regenerar histórico com base no período
    this.regenerateHistoryForPeriod(this.currentSymbol, days);
    this.createChart();
    
    // Reiniciar atualizações em tempo real com o novo intervalo - BUG 2 CORRIGIDO
    this.startRealtimeUpdates();
  }

  regenerateHistoryForPeriod(symbol, points) {
    const stock = this.stockData[symbol];
    stock.history = [];
    stock.ohlcData = [];
    
    let currentPrice = stock.price;
    for (let i = 0; i < points; i++) {
      const variation = (Math.random() - 0.5) * 0.02;
      currentPrice = currentPrice + variation;
      if (currentPrice < 0.01) currentPrice = 0.01;
      
      const time = new Date(Date.now() - (points - i) * 10000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      // Dados para linha
      stock.history.push({ time: time, price: parseFloat(currentPrice.toFixed(2)) });
      
      // Dados OHLC para candlestick
      const open = i === 0 ? currentPrice : stock.ohlcData[i-1]?.close || currentPrice;
      const close = currentPrice;
      const high = Math.max(open, close, close * (1 + Math.random() * 0.01));
      const low = Math.min(open, close, close * (1 - Math.random() * 0.01));
      
      stock.ohlcData.push({
        time: time,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2))
      });
    }
  }

  updateStockSelection(symbol) {
    document.querySelectorAll('.stock-item-expanded').forEach(item => {
      item.classList.remove('active');
    });
    const stockItems = document.querySelectorAll('.stock-item-expanded');
    stockItems.forEach(item => {
      if (item.getAttribute('onclick').includes(symbol)) {
        item.classList.add('active');
      }
    });
  }

  // Função para inicializar os dados dos stocks
  initializeStockData() {
    this.stockData = {
      'PETR4': {
        name: 'Petróleo Brasileiro S.A.',
        price: 28.50,
        basePrice: 28.50, // Preço base para calcular variação
        change: -0.28,
        changePercent: -0.98,
        history: [],
        ohlcData: [],
        lastPrice: 28.50
      },
      'VALE3': {
        name: 'Vale S.A.',
        price: 72.30,
        basePrice: 72.30,
        change: -0.29,
        changePercent: -0.40,
        history: [],
        ohlcData: [],
        lastPrice: 72.30
      },
      'ITUB4': {
        name: 'Itaú Unibanco Holding S.A.',
        price: 31.20,
        basePrice: 31.20,
        change: 0.29,
        changePercent: 0.93,
        history: [],
        ohlcData: [],
        lastPrice: 31.20
      },
      'BBDC4': {
        name: 'Banco Bradesco S.A.',
        price: 27.80,
        basePrice: 27.80,
        change: 0.10,
        changePercent: 0.36,
        history: [],
        ohlcData: [],
        lastPrice: 27.80
      },
      'ABEV3': {
        name: 'Ambev S.A.',
        price: 14.25,
        basePrice: 14.25,
        change: -0.06,
        changePercent: -0.44,
        history: [],
        ohlcData: [],
        lastPrice: 14.25
      },
      'MGLU3': {
        name: 'Magazine Luiza S.A.',
        price: 3.45,
        basePrice: 3.45,
        change: 0.02,
        changePercent: 0.52,
        history: [],
        ohlcData: [],
        lastPrice: 3.45
      }
    };
    
    // Preencher histórico inicial para cada stock
    for (const symbol in this.stockData) {
      this.regenerateHistoryForPeriod(symbol, 60); // 10 minutos de dados iniciais
    }
  }

  // Método para parar as atualizações
  stopUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

let newChartManager;

document.addEventListener('DOMContentLoaded', function() {
  newChartManager = new NewChartManager();
  newChartManager.init();

  window.newChartManager = newChartManager; // Torna disponível globalmente

  // Sobrescrever as funções globais existentes para usar o newChartManager
  window.selectStock = function(symbol) {
    newChartManager.selectStock(symbol);
  };

  // Adicionar funções para os botões de tipo e período
  window.setChartType = function(type) {
    newChartManager.setChartType(type);
  };

  window.setChartInterval = function(period) {
    newChartManager.setChartPeriod(period);
  };

  // Chamar a renderização inicial do book de ofertas
  setTimeout(() => {
    newChartManager.renderBookOfOffers();
  }, 1000);
});


