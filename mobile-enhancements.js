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

  // Configurar modal do gráfico - REMOVIDO
  setupChartModal() {
    // Funcionalidade de maximização removida conforme solicitado
    console.log('Funcionalidade de maximização do gráfico removida');
  }

  // Funções do modal removidas - funcionalidade de maximização desabilitada

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

// Event listeners para modal removidos - funcionalidade de maximização desabilitada

