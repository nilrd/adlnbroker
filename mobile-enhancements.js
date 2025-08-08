// ===== MELHORIAS MOBILE PARA O DASHBOARD =====

class MobileEnhancements {
  constructor() {
    this.isModalOpen = false;
    this.originalStocks = [];
    this.filteredStocks = [];
    this.init();
  }

  init() {
    this.setupStockSearch();
    this.setupChartModal();
    this.setupMobileOptimizations();
    console.log('Mobile Enhancements inicializadas');
  }

  // Configurar pesquisa de stocks
  setupStockSearch() {
    // Criar campo de pesquisa
    const stocksCard = document.querySelector('.stocks-card-expanded');
    if (!stocksCard) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'stocks-search';
    searchContainer.innerHTML = `
      <input type="text" id="stockSearch" placeholder="🔍 Pesquisar ação..." autocomplete="off">
    `;

    // Inserir antes da lista de stocks
    const stocksList = document.querySelector('.stocks-list-expanded');
    if (stocksList) {
      stocksList.parentNode.insertBefore(searchContainer, stocksList);
    }

    // Configurar evento de pesquisa
    const searchInput = document.getElementById('stockSearch');
    if (searchInput) {
      // Salvar lista original de stocks
      this.originalStocks = Array.from(document.querySelectorAll('.stock-item-expanded'));
      
      searchInput.addEventListener('input', (e) => {
        this.filterStocks(e.target.value);
      });

      // Limpar pesquisa ao focar
      searchInput.addEventListener('focus', () => {
        if (searchInput.value === '') {
          this.showAllStocks();
        }
      });
    }
  }

  // Filtrar stocks baseado na pesquisa
  filterStocks(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    this.originalStocks.forEach(stock => {
      const symbol = stock.querySelector('.stock-symbol-large')?.textContent.toLowerCase() || '';
      const name = stock.querySelector('.stock-name-small')?.textContent.toLowerCase() || '';
      
      if (term === '' || symbol.includes(term) || name.includes(term)) {
        stock.style.display = 'flex';
      } else {
        stock.style.display = 'none';
      }
    });
  }

  // Mostrar todos os stocks
  showAllStocks() {
    this.originalStocks.forEach(stock => {
      stock.style.display = 'flex';
    });
  }

  // Configurar modal do gráfico
  setupChartModal() {
    // Criar modal
    const modal = document.createElement('div');
    modal.id = 'chartModal';
    modal.className = 'chart-modal';
    modal.innerHTML = `
      <div class="chart-modal-header">
        <div class="chart-modal-title">
          <span id="modalStockSymbol">PETR4</span> - Gráfico Expandido
        </div>
        <button class="chart-modal-close" onclick="mobileEnhancements.closeChartModal()">
          ✕ Fechar
        </button>
      </div>
      <div class="chart-modal-content">
        <div class="chart-modal-chart">
          <canvas id="modalChart" width="800" height="400"></canvas>
        </div>
        <div class="chart-modal-controls">
          <div class="chart-type-controls">
            <button class="chart-type-btn active" onclick="mobileEnhancements.setModalChartType('line')" data-type="line">
              📈 Linha
            </button>
            <button class="chart-type-btn" onclick="mobileEnhancements.setModalChartType('candlestick')" data-type="candlestick">
              📊 Candlestick
            </button>
          </div>
          <div class="chart-periods-v2">
            <button class="period-btn-v2 active" onclick="mobileEnhancements.setModalChartPeriod('1D')">1D</button>
            <button class="period-btn-v2" onclick="mobileEnhancements.setModalChartPeriod('1M')">1M</button>
            <button class="period-btn-v2" onclick="mobileEnhancements.setModalChartPeriod('1Y')">1Y</button>
          </div>
        </div>
        <div class="chart-modal-trading">
          <button class="btn-buy-improved" onclick="mobileEnhancements.openTradeFromModal('buy')">
            <span class="btn-icon">💰</span>
            <span class="btn-text">COMPRAR</span>
          </button>
          <button class="btn-sell-improved" onclick="mobileEnhancements.openTradeFromModal('sell')">
            <span class="btn-icon">💸</span>
            <span class="btn-text">VENDER</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Adicionar botão maximizar ao gráfico principal
    const chartContainer = document.querySelector('.chart-container-main-v2');
    if (chartContainer) {
      const maximizeBtn = document.createElement('button');
      maximizeBtn.className = 'chart-maximize-btn';
      maximizeBtn.innerHTML = '⛶ Maximizar';
      maximizeBtn.onclick = () => this.openChartModal();
      chartContainer.appendChild(maximizeBtn);
    }
  }

  // Abrir modal do gráfico
  openChartModal() {
    const modal = document.getElementById('chartModal');
    if (!modal) return;

    this.isModalOpen = true;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Atualizar título do modal
    const modalTitle = document.getElementById('modalStockSymbol');
    if (modalTitle && window.chartManager) {
      modalTitle.textContent = window.chartManager.currentSymbol;
    }

    // Criar gráfico no modal
    setTimeout(() => {
      this.createModalChart();
    }, 100);
  }

  // Fechar modal do gráfico
  closeChartModal() {
    const modal = document.getElementById('chartModal');
    if (!modal) return;

    this.isModalOpen = false;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Destruir gráfico do modal
    if (this.modalChart) {
      this.modalChart.destroy();
      this.modalChart = null;
    }
  }

  // Criar gráfico no modal
  createModalChart() {
    if (!window.chartManager) return;

    const canvas = document.getElementById('modalChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const stockInfo = window.chartManager.stockData[window.chartManager.currentSymbol];

    // Destruir gráfico anterior se existir
    if (this.modalChart) {
      this.modalChart.destroy();
    }

    // Criar novo gráfico
    if (window.chartManager.currentType === 'line') {
      this.modalChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: stockInfo.data.labels,
          datasets: [{
            label: window.chartManager.currentSymbol,
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
        options: this.getModalChartOptions('line')
      });
    } else {
      // Implementar candlestick para modal se necessário
      this.createModalCandlestickChart(ctx, stockInfo);
    }
  }

  // Opções do gráfico do modal
  getModalChartOptions(type) {
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
              size: 12
            }
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
              size: 12
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

  // Definir tipo de gráfico no modal
  setModalChartType(type) {
    if (!window.chartManager) return;

    window.chartManager.currentType = type;

    // Atualizar botões
    document.querySelectorAll('#chartModal .chart-type-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-type') === type) {
        btn.classList.add('active');
      }
    });

    this.createModalChart();
  }

  // Definir período do gráfico no modal
  setModalChartPeriod(period) {
    if (!window.chartManager) return;

    window.chartManager.setPeriod(period);

    // Atualizar botões
    document.querySelectorAll('#chartModal .period-btn-v2').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent === period) {
        btn.classList.add('active');
      }
    });

    this.createModalChart();
  }

  // Abrir trading do modal
  openTradeFromModal(type) {
    if (!window.chartManager) return;

    const symbol = window.chartManager.currentSymbol;
    const action = type.toUpperCase();
    
    // Fechar modal
    this.closeChartModal();
    
    // Rolar para a seção de trading
    const tradingSection = document.querySelector('.trading-section');
    if (tradingSection) {
      tradingSection.scrollIntoView({ behavior: 'smooth' });
      
      // Pré-selecionar o tipo de operação
      setTimeout(() => {
        const tipoSelect = document.getElementById('tipo');
        const ativoSelect = document.getElementById('ativo');
        
        if (tipoSelect) {
          tipoSelect.value = type === 'buy' ? 'Compra' : 'Venda';
        }
        
        if (ativoSelect) {
          // Encontrar e selecionar o ativo atual
          for (let option of ativoSelect.options) {
            if (option.value === symbol) {
              ativoSelect.value = symbol;
              break;
            }
          }
        }
      }, 500);
    }
  }

  // Configurar otimizações mobile
  setupMobileOptimizations() {
    // Prevenir zoom em inputs no iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        if (input.style.fontSize === '' || parseInt(input.style.fontSize) < 16) {
          input.style.fontSize = '16px';
        }
      });
    }

    // Melhorar performance de scroll
    const scrollElements = document.querySelectorAll('.table-wrapper, .stocks-list-expanded');
    scrollElements.forEach(element => {
      element.style.webkitOverflowScrolling = 'touch';
    });

    // Adicionar feedback tátil para botões (se suportado)
    if ('vibrate' in navigator) {
      const buttons = document.querySelectorAll('button, .stock-item-expanded');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          navigator.vibrate(50); // Vibração suave de 50ms
        });
      });
    }

    // Otimizar redimensionamento de gráfico
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (window.chartManager && window.chartManager.chart) {
          window.chartManager.chart.resize();
        }
        if (this.modalChart) {
          this.modalChart.resize();
        }
      }, 100);
    });
  }

  // Método para detectar se está em mobile
  isMobile() {
    return window.innerWidth <= 768;
  }

  // Método para detectar orientação
  isLandscape() {
    return window.innerWidth > window.innerHeight;
  }
}

// Instância global
let mobileEnhancements;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Aguardar um pouco para garantir que outros scripts foram carregados
  setTimeout(() => {
    mobileEnhancements = new MobileEnhancements();
    
    // Tornar disponível globalmente
    window.mobileEnhancements = mobileEnhancements;
    
    console.log('Mobile Enhancements carregadas');
  }, 1000);
});

// Fechar modal ao pressionar ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && window.mobileEnhancements && window.mobileEnhancements.isModalOpen) {
    window.mobileEnhancements.closeChartModal();
  }
});

// Fechar modal ao clicar fora
document.addEventListener('click', function(e) {
  const modal = document.getElementById('chartModal');
  if (modal && modal.classList.contains('active') && e.target === modal) {
    window.mobileEnhancements.closeChartModal();
  }
});

