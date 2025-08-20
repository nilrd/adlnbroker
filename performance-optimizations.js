// Performance Optimizations for ADLNBroker Dashboard
// Arquivo criado para melhorar a performance e fluidez do dashboard

// Debounce function para otimizar atualizações frequentes
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function para limitar frequência de execução
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Cache para elementos DOM frequentemente acessados
const DOMCache = {
  elements: new Map(),
  
  get(selector) {
    if (!this.elements.has(selector)) {
      this.elements.set(selector, document.querySelector(selector));
    }
    return this.elements.get(selector);
  },
  
  getAll(selector) {
    if (!this.elements.has(selector + '_all')) {
      this.elements.set(selector + '_all', document.querySelectorAll(selector));
    }
    return this.elements.get(selector + '_all');
  },
  
  clear() {
    this.elements.clear();
  }
};

// Otimizador de atualizações de preços
const PriceUpdater = {
  lastUpdate: 0,
  updateInterval: 1000, // Mínimo 1 segundo entre atualizações
  pendingUpdates: new Map(),
  
  scheduleUpdate(symbol, price, change, percent) {
    this.pendingUpdates.set(symbol, { price, change, percent });
    
    const now = Date.now();
    if (now - this.lastUpdate >= this.updateInterval) {
      this.flushUpdates();
    }
  },
  
  flushUpdates() {
    if (this.pendingUpdates.size === 0) return;
    
    // Batch DOM updates
    const fragment = document.createDocumentFragment();
    
    this.pendingUpdates.forEach((data, symbol) => {
      this.updatePriceElement(symbol, data);
    });
    
    this.pendingUpdates.clear();
    this.lastUpdate = Date.now();
  },
  
  updatePriceElement(symbol, data) {
    const priceElement = DOMCache.get(`#price-${symbol}`);
    const changeElement = DOMCache.get(`#change-${symbol}`);
    const percentElement = DOMCache.get(`#percent-${symbol}`);
    
    if (priceElement) priceElement.textContent = data.price.toFixed(2);
    if (changeElement) {
      changeElement.textContent = (data.change >= 0 ? '+' : '') + data.change.toFixed(2);
      changeElement.className = `change ${data.change >= 0 ? 'positive' : 'negative'}`;
    }
    if (percentElement) {
      percentElement.textContent = `(${data.change >= 0 ? '+' : ''}${data.percent.toFixed(2)}%)`;
      percentElement.className = `change-percent ${data.change >= 0 ? 'positive' : 'negative'}`;
    }
  }
};

// Otimizador de renderização de tabelas
const TableRenderer = {
  renderBookOffers(data) {
    const tbody = DOMCache.get('#book tbody');
    if (!tbody) return;
    
    // Use DocumentFragment para melhor performance
    const fragment = document.createDocumentFragment();
    
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="asset-cell">
          <div class="asset-info">
            <div class="asset-icon">${this.getAssetIcon(item.symbol)}</div>
            <div class="asset-details">
              <span class="asset-symbol">${item.symbol}</span>
              <span class="asset-name">${item.name}</span>
            </div>
          </div>
        </td>
        <td class="price-cell">R$ ${item.price.toFixed(2)}</td>
        <td class="change-cell ${item.change >= 0 ? 'positive' : 'negative'}">
          ${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)} (${item.change >= 0 ? '+' : ''}${item.percent.toFixed(2)}%)
        </td>
        <td class="volume-cell">${this.formatVolume(item.volume)}</td>
      `;
      fragment.appendChild(row);
    });
    
    // Single DOM update
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
  },
  
  getAssetIcon(symbol) {
    const icons = {
      'PETR4': '🛢️',
      'VALE3': '⛏️',
      'ITUB4': '🏦',
      'BBDC4': '🏦',
      'ABEV3': '🍺',
      'MGLU3': '🛒',
      'BBAS3': '🏦',
      'LREN3': '🏪'
    };
    return icons[symbol] || '📈';
  },
  
  formatVolume(volume) {
    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toString();
  }
};

// Lazy loading para componentes pesados
const LazyLoader = {
  observers: new Map(),
  
  observe(element, callback) {
    if (!('IntersectionObserver' in window)) {
      // Fallback para navegadores antigos
      callback();
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(element);
    this.observers.set(element, observer);
  },
  
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
};

// Gerenciador de animações otimizado
const AnimationManager = {
  activeAnimations: new Set(),
  
  animate(element, keyframes, options = {}) {
    const animation = element.animate(keyframes, {
      duration: 300,
      easing: 'ease-out',
      ...options
    });
    
    this.activeAnimations.add(animation);
    
    animation.addEventListener('finish', () => {
      this.activeAnimations.delete(animation);
    });
    
    return animation;
  },
  
  cancelAll() {
    this.activeAnimations.forEach(animation => animation.cancel());
    this.activeAnimations.clear();
  }
};

// Otimizações de scroll
const ScrollOptimizer = {
  init() {
    // Smooth scrolling para navegação
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Otimizar scroll em tabelas grandes
    const tables = DOMCache.getAll('.table-wrapper');
    tables.forEach(table => {
      table.style.willChange = 'scroll-position';
    });
  }
};

// Inicialização das otimizações
function initPerformanceOptimizations() {
  ScrollOptimizer.init();
  
  // Limpar cache DOM quando necessário
  window.addEventListener('resize', debounce(() => {
    DOMCache.clear();
  }, 250));
  
  // Cleanup ao sair da página
  window.addEventListener('beforeunload', () => {
    LazyLoader.cleanup();
    AnimationManager.cancelAll();
    DOMCache.clear();
  });
}

// Exportar para uso global
window.PerformanceOptimizations = {
  debounce,
  throttle,
  DOMCache,
  PriceUpdater,
  TableRenderer,
  LazyLoader,
  AnimationManager,
  ScrollOptimizer,
  init: initPerformanceOptimizations
};

