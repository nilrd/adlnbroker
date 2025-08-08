// Sistema de gráfico avançado com linha e candlestick usando Chart.js
class AdvancedChartManager {
  constructor() {
    this.chart = null;
    this.currentSymbol = 'PETR4';
    this.currentPeriod = '1D';
    this.currentType = 'line'; // 'line' ou 'candlestick'
    this.stockData = {
      'PETR4': {
        name: 'Petróleo Brasileiro S.A.',
        price: 28.50,
        change: -0.28,
        changePercent: -0.98,
        data: this.generateSampleData(28.50, 30),
        ohlcData: this.generateOHLCData(28.50, 30)
      },
      'VALE3': {
        name: 'Vale S.A.',
        price: 72.30,
        change: -0.29,
        changePercent: -0.40,
        data: this.generateSampleData(72.30, 30),
        ohlcData: this.generateOHLCData(72.30, 30)
      },
      'ITUB4': {
        name: 'Itaú Unibanco Holding S.A.',
        price: 31.20,
        change: 0.29,
        changePercent: 0.93,
        data: this.generateSampleData(31.20, 30),
        ohlcData: this.generateOHLCData(31.20, 30)
      },
      'BBDC4': {
        name: 'Banco Bradesco S.A.',
        price: 27.80,
        change: 0.10,
        changePercent: 0.36,
        data: this.generateSampleData(27.80, 30),
        ohlcData: this.generateOHLCData(27.80, 30)
      },
      'ABEV3': {
        name: 'Ambev S.A.',
        price: 14.25,
        change: -0.06,
        changePercent: -0.44,
        data: this.generateSampleData(14.25, 30),
        ohlcData: this.generateOHLCData(14.25, 30)
      },
      'MGLU3': {
        name: 'Magazine Luiza S.A.',
        price: 3.45,
        change: 0.02,
        changePercent: 0.52,
        data: this.generateSampleData(3.45, 30),
        ohlcData: this.generateOHLCData(3.45, 30)
      }
    };
  }

  generateSampleData(basePrice, days) {
    const data = [];
    const labels = [];
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }));
      
      // Simular variação de preço
      const variation = (Math.random() - 0.5) * 0.1; // Variação de -5% a +5%
      currentPrice = currentPrice * (1 + variation);
      data.push(parseFloat(currentPrice.toFixed(2)));
    }
    
    return { labels, data };
  }

  generateOHLCData(basePrice, days) {
    const data = [];
    const labels = [];
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }));
      
      // Gerar dados OHLC realistas
      const open = currentPrice;
      const variation1 = (Math.random() - 0.5) * 0.08;
      const variation2 = (Math.random() - 0.5) * 0.08;
      const variation3 = (Math.random() - 0.5) * 0.08;
      
      const high = Math.max(open, open * (1 + Math.abs(variation1)), open * (1 + Math.abs(variation2)));
      const low = Math.min(open, open * (1 - Math.abs(variation1)), open * (1 - Math.abs(variation2)));
      const close = open * (1 + variation3);
      
      data.push({
        x: labels[labels.length - 1],
        o: parseFloat(open.toFixed(2)),
        h: parseFloat(high.toFixed(2)),
        l: parseFloat(low.toFixed(2)),
        c: parseFloat(close.toFixed(2))
      });
      
      currentPrice = close;
    }
    
    return { labels, data };
  }

  init() {
    const canvas = document.getElementById('mainChart');
    if (!canvas) {
      console.error('Canvas mainChart não encontrado');
      return;
    }

    this.createChart();
    console.log('AdvancedChartManager inicializado');
  }

  createChart() {
    const canvas = document.getElementById('mainChart');
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico existente se houver
    if (this.chart) {
      this.chart.destroy();
    }

    const stockInfo = this.stockData[this.currentSymbol];
    
    if (this.currentType === 'line') {
      this.createLineChart(ctx, stockInfo);
    } else {
      this.createCandlestickChart(ctx, stockInfo);
    }
  }

  createLineChart(ctx, stockInfo) {
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: stockInfo.data.labels,
        datasets: [{
          label: this.currentSymbol,
          data: stockInfo.data.data,
          borderColor: stockInfo.change >= 0 ? '#00c851' : '#ff4444',
          backgroundColor: stockInfo.change >= 0 ? 'rgba(0, 200, 81, 0.1)' : 'rgba(255, 68, 68, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: stockInfo.change >= 0 ? '#00c851' : '#ff4444',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 3
        }]
      },
      options: this.getChartOptions('line')
    });
  }

  createCandlestickChart(ctx, stockInfo) {
    // Para candlestick, vamos usar um gráfico de barras customizado
    const ohlcData = stockInfo.ohlcData.data;
    
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stockInfo.ohlcData.labels,
        datasets: [{
          label: 'High-Low',
          data: ohlcData.map(item => ({ x: item.x, y: [item.l, item.h] })),
          backgroundColor: ohlcData.map(item => item.c >= item.o ? '#00c851' : '#ff4444'),
          borderColor: ohlcData.map(item => item.c >= item.o ? '#00c851' : '#ff4444'),
          borderWidth: 1,
          barThickness: 2
        }, {
          label: 'Open-Close',
          data: ohlcData.map(item => ({ x: item.x, y: [Math.min(item.o, item.c), Math.max(item.o, item.c)] })),
          backgroundColor: ohlcData.map(item => item.c >= item.o ? '#00c851' : '#ff4444'),
          borderColor: ohlcData.map(item => item.c >= item.o ? '#00c851' : '#ff4444'),
          borderWidth: 1,
          barThickness: 8
        }]
      },
      options: this.getChartOptions('candlestick')
    });
  }

  getChartOptions(type) {
    const baseOptions = {
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
              if (type === 'line') {
                return `R$ ${context.parsed.y.toFixed(2)}`;
              } else {
                // Para candlestick, mostrar OHLC
                const dataIndex = context.dataIndex;
                const ohlcData = chartManager.stockData[chartManager.currentSymbol].ohlcData.data[dataIndex];
                return [
                  `Abertura: R$ ${ohlcData.o.toFixed(2)}`,
                  `Máxima: R$ ${ohlcData.h.toFixed(2)}`,
                  `Mínima: R$ ${ohlcData.l.toFixed(2)}`,
                  `Fechamento: R$ ${ohlcData.c.toFixed(2)}`
                ];
              }
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

    return baseOptions;
  }

  selectStock(symbol) {
    if (!this.stockData[symbol]) {
      console.error('Símbolo não encontrado:', symbol);
      return;
    }

    this.currentSymbol = symbol;
    
    // Atualizar informações na interface
    this.updateStockInfo(symbol);
    
    // Atualizar gráfico
    this.createChart();
    
    // Atualizar seleção na sidebar
    this.updateStockSelection(symbol);
  }

  updateStockInfo(symbol) {
    const stock = this.stockData[symbol];
    
    document.getElementById('selectedStockSymbol').textContent = symbol;
    document.getElementById('selectedStockName').textContent = stock.name;
    document.getElementById('selectedStockPrice').textContent = `R$ ${stock.price.toFixed(2)}`;
    
    const changeElement = document.getElementById('selectedStockChange');
    const changeText = `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`;
    changeElement.textContent = changeText;
    changeElement.className = `change-main-v2 ${stock.change >= 0 ? 'positive' : 'negative'}`;
  }

  updateStockSelection(symbol) {
    // Remove seleção anterior
    document.querySelectorAll('.stock-item-expanded').forEach(item => {
      item.classList.remove('active');
    });
    
    // Adiciona seleção atual
    const stockItems = document.querySelectorAll('.stock-item-expanded');
    stockItems.forEach(item => {
      if (item.getAttribute('onclick').includes(symbol)) {
        item.classList.add('active');
      }
    });
  }

  setType(type) {
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

  setPeriod(period) {
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
    const days = period === '1D' ? 30 : period === '1M' ? 90 : 365;
    stock.data = this.generateSampleData(stock.price, days);
    stock.ohlcData = this.generateOHLCData(stock.price, days);
    
    this.createChart();
  }
}

// Instância global do gerenciador de gráfico
let chartManager;

// Funções globais para interação
function selectStock(symbol) {
  if (chartManager) {
    chartManager.selectStock(symbol);
  }
}

function setChartType(type) {
  if (chartManager) {
    chartManager.setType(type);
  }
}

function setChartPeriod(period) {
  if (chartManager) {
    chartManager.setPeriod(period);
  }
}

function openTradeModal(type) {
  // Implementar modal de trading futuramente
  alert(`${type.toUpperCase()} - ${chartManager.currentSymbol}\nFuncionalidade em desenvolvimento`);
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Aguardar um pouco para garantir que tudo foi carregado
  setTimeout(() => {
    chartManager = new AdvancedChartManager();
    chartManager.init();
    
    // Tornar disponível globalmente
    window.chartManager = chartManager;
    
    console.log('AdvancedChartManager inicializado');
  }, 500);
});

