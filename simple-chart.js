// Sistema de gráfico simples usando Chart.js
class SimpleChartManager {
  constructor() {
    this.chart = null;
    this.currentSymbol = 'PETR4';
    this.currentPeriod = '1D';
    this.stockData = {
      'PETR4': {
        name: 'Petróleo Brasileiro S.A.',
        price: 28.50,
        change: -0.28,
        changePercent: -0.98,
        data: this.generateSampleData(28.50, 30)
      },
      'VALE3': {
        name: 'Vale S.A.',
        price: 72.30,
        change: -0.29,
        changePercent: -0.40,
        data: this.generateSampleData(72.30, 30)
      },
      'ITUB4': {
        name: 'Itaú Unibanco Holding S.A.',
        price: 31.20,
        change: 0.29,
        changePercent: 0.93,
        data: this.generateSampleData(31.20, 30)
      },
      'BBDC4': {
        name: 'Banco Bradesco S.A.',
        price: 27.80,
        change: 0.10,
        changePercent: 0.36,
        data: this.generateSampleData(27.80, 30)
      },
      'ABEV3': {
        name: 'Ambev S.A.',
        price: 14.25,
        change: -0.06,
        changePercent: -0.44,
        data: this.generateSampleData(14.25, 30)
      },
      'MGLU3': {
        name: 'Magazine Luiza S.A.',
        price: 3.45,
        change: 0.02,
        changePercent: 0.52,
        data: this.generateSampleData(3.45, 30)
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

  init() {
    const canvas = document.getElementById('mainChart');
    if (!canvas) {
      console.error('Canvas mainChart não encontrado');
      return;
    }

    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico existente se houver
    if (this.chart) {
      this.chart.destroy();
    }

    const stockInfo = this.stockData[this.currentSymbol];
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: stockInfo.data.labels,
        datasets: [{
          label: this.currentSymbol,
          data: stockInfo.data.data,
          borderColor: stockInfo.change >= 0 ? '#00c851' : '#ff4444',
          backgroundColor: stockInfo.change >= 0 ? 'rgba(0, 200, 81, 0.1)' : 'rgba(255, 68, 68, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: stockInfo.change >= 0 ? '#00c851' : '#ff4444',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(26, 31, 46, 0.9)',
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
            hoverRadius: 8
          }
        }
      }
    });

    console.log('Gráfico Chart.js criado com sucesso');
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
    this.updateChart();
    
    // Atualizar seleção na sidebar
    this.updateStockSelection(symbol);
  }

  updateStockInfo(symbol) {
    const stock = this.stockData[symbol];
    
    document.getElementById('selectedStockSymbol').textContent = symbol;
    document.getElementById('selectedStockName').textContent = stock.name;
    document.getElementById('selectedStockPrice').textContent = stock.price.toFixed(2);
    
    const changeElement = document.getElementById('selectedStockChange');
    const changeText = `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.change >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`;
    changeElement.textContent = changeText;
    changeElement.className = `change-main ${stock.change >= 0 ? 'positive' : 'negative'}`;
  }

  updateChart() {
    if (!this.chart) return;

    const stock = this.stockData[this.currentSymbol];
    
    this.chart.data.labels = stock.data.labels;
    this.chart.data.datasets[0].data = stock.data.data;
    this.chart.data.datasets[0].label = this.currentSymbol;
    this.chart.data.datasets[0].borderColor = stock.change >= 0 ? '#00c851' : '#ff4444';
    this.chart.data.datasets[0].backgroundColor = stock.change >= 0 ? 'rgba(0, 200, 81, 0.1)' : 'rgba(255, 68, 68, 0.1)';
    this.chart.data.datasets[0].pointHoverBackgroundColor = stock.change >= 0 ? '#00c851' : '#ff4444';
    
    this.chart.update('none');
  }

  updateStockSelection(symbol) {
    // Remove seleção anterior
    document.querySelectorAll('.stock-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Adiciona seleção atual
    const stockItems = document.querySelectorAll('.stock-item');
    stockItems.forEach(item => {
      if (item.getAttribute('onclick').includes(symbol)) {
        item.classList.add('active');
      }
    });
  }

  setPeriod(period) {
    this.currentPeriod = period;
    
    // Atualizar botões de período
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    document.querySelectorAll('.period-btn').forEach(btn => {
      if (btn.textContent === period) {
        btn.classList.add('active');
      }
    });
    
    // Regenerar dados para o período (simulação)
    const stock = this.stockData[this.currentSymbol];
    const days = period === '1D' ? 30 : period === '1M' ? 90 : 365;
    stock.data = this.generateSampleData(stock.price, days);
    
    this.updateChart();
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
    chartManager = new SimpleChartManager();
    chartManager.init();
    console.log('SimpleChartManager inicializado');
  }, 500);
});

