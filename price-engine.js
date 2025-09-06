// ===== PRICE ENGINE CENTRAL (CPE) - SISTEMA ADLN =====
// ÚNICA FONTE DE VERDADE PARA TODOS OS PREÇOS DO SISTEMA

class PriceEngineCentral {
  constructor() {
    // Estado central dos preços
    this.prices = {
      'PETR4': 28.50,
      'VALE3': 72.30,
      'ITUB4': 31.20,
      'BBDC4': 27.80,
      'ABEV3': 14.25,
      'MGLU3': 3.45,
      'BBAS3': 49.10,
      'LREN3': 18.30,
      'COGN3': 12.80,
      'ITSA4': 8.95
    };
    
    // Preços base para cálculo de variações
    this.basePrices = { ...this.prices };
    
    // Controle de timing
    this.updateTimer = null;
    this.lastUpdate = 0;
    this.cycleCount = 0;
    
    // Sistema de eventos (EventEmitter)
    this.eventListeners = new Map();
    
    // Histórico para gráficos
    this.priceHistory = new Map();
    this.initializePriceHistory();
    
    // Inicializar sistema
    this.initialize();
  }
  
  // ===== INICIALIZAÇÃO DO SISTEMA =====
  initialize() {
    console.log('🚀 Iniciando Price Engine Central (CPE)...');
    
    // Calcular próximo ciclo de 10 segundos
    const now = Date.now();
    const nextCycle = Math.ceil(now / 10000) * 10000;
    const initialDelay = nextCycle - now;
    
    console.log(`⏰ Primeira atualização em: ${new Date(nextCycle).toLocaleTimeString("pt-BR")} (delay: ${initialDelay}ms)`);
    
    // Primeira execução no momento exato
    setTimeout(() => {
      this.executePriceUpdate();
      
      // Configurar timer para execução a cada 10 segundos
      this.updateTimer = setInterval(() => {
        this.executePriceUpdate();
      }, 10000);
      
      console.log('✅ Price Engine Central ativado - atualização a cada 10 segundos exatos');
    }, initialDelay);
  }
  
  // ===== SISTEMA DE EVENTOS (PUBLISHER) =====
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }
  
  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Erro no listener do evento ${event}:`, error);
        }
      });
    }
  }
  
  // ===== ATUALIZAÇÃO DE PREÇOS (RN-002) =====
  executePriceUpdate() {
    const now = Date.now();
    this.cycleCount++;
    
    console.log(`🔄 Executando ciclo de preços #${this.cycleCount} em: ${new Date().toLocaleTimeString("pt-BR")}`);
    
    try {
      // RN-002: Variação EXATA de R$0,01 por ciclo
      for (let symbol in this.prices) {
        const previousPrice = this.prices[symbol];
        
        // Seed determinístico baseado no ciclo e símbolo
        const seed = this.cycleCount + symbol.charCodeAt(0);
        const randomValue = Math.sin(seed) * 0.5 + 0.5;
        const variation = (randomValue < 0.5 ? -1 : 1) * 0.01; // Variação EXATA de R$0,01
        
        // Aplicar variação
        this.prices[symbol] = parseFloat((this.prices[symbol] + variation).toFixed(2));
        
        // Garantir que o preço não fique negativo
        if (this.prices[symbol] < 0.01) {
          this.prices[symbol] = 0.01;
        }
        
        // Adicionar ao histórico para gráficos
        this.addToPriceHistory(symbol, this.prices[symbol], now);
        
        console.log(`📊 ${symbol}: R$ ${previousPrice.toFixed(2)} → R$ ${this.prices[symbol].toFixed(2)} (${variation > 0 ? '+' : ''}${variation.toFixed(2)})`);
      }
      
      this.lastUpdate = now;
      
      // Publicar atualização para todos os consumidores
      this.emit('pricesUpdated', {
        prices: { ...this.prices },
        timestamp: now,
        cycle: this.cycleCount
      });
      
      console.log(`✅ Ciclo de preços #${this.cycleCount} concluído`);
      
    } catch (error) {
      console.error('❌ Erro ao atualizar preços:', error);
      this.emit('priceUpdateError', { error, timestamp: now });
    }
  }
  
  // ===== HISTÓRICO PARA GRÁFICOS =====
  initializePriceHistory() {
    for (let symbol in this.prices) {
      this.priceHistory.set(symbol, []);
    }
  }
  
  addToPriceHistory(symbol, price, timestamp) {
    if (!this.priceHistory.has(symbol)) {
      this.priceHistory.set(symbol, []);
    }
    
    const history = this.priceHistory.get(symbol);
    history.push({ price, timestamp });
    
    // Manter apenas os últimos 1000 registros por performance
    if (history.length > 1000) {
      history.shift();
    }
  }
  
  // ===== MÉTODOS PÚBLICOS PARA CONSUMIDORES =====
  
  // Obter preços atuais
  getCurrentPrices() {
    return { ...this.prices };
  }
  
  // Obter preço específico
  getPrice(symbol) {
    return this.prices[symbol] || null;
  }
  
  // Obter histórico para gráficos
  getPriceHistory(symbol, interval = '1M') {
    const history = this.priceHistory.get(symbol) || [];
    if (history.length === 0) return [];
    
    const intervals = {
      '1M': 60000,    // 1 minuto
      '5M': 300000,   // 5 minutos
      '30M': 1800000, // 30 minutos
      '1H': 3600000   // 1 hora
    };
    
    const intervalMs = intervals[interval] || 60000;
    const now = Date.now();
    const filteredHistory = history.filter(entry => (now - entry.timestamp) <= intervalMs);
    
    return filteredHistory;
  }
  
  // Obter candles para gráficos
  getCandles(symbol, interval = '1M') {
    const history = this.getPriceHistory(symbol, interval);
    if (history.length === 0) return [];
    
    const candles = [];
    const intervalMs = this.getIntervalMs(interval);
    
    // Agrupar dados por intervalo
    const grouped = new Map();
    
    history.forEach(entry => {
      const groupKey = Math.floor(entry.timestamp / intervalMs) * intervalMs;
      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, []);
      }
      grouped.get(groupKey).push(entry.price);
    });
    
    // Criar candles
    grouped.forEach((prices, timestamp) => {
      const open = prices[0];
      const close = prices[prices.length - 1];
      const high = Math.max(...prices);
      const low = Math.min(...prices);
      const volume = prices.length; // Simulado
      
      candles.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume
      });
    });
    
    return candles.sort((a, b) => a.timestamp - b.timestamp);
  }
  
  getIntervalMs(interval) {
    const intervals = {
      '1M': 60000,    // 1 minuto
      '5M': 300000,   // 5 minutos
      '30M': 1800000, // 30 minutos
      '1H': 3600000   // 1 hora
    };
    return intervals[interval] || 60000;
  }
  
  // Obter estatísticas
  getStats() {
    return {
      lastUpdate: this.lastUpdate,
      cycleCount: this.cycleCount,
      isActive: !!this.updateTimer,
      nextUpdate: this.lastUpdate + 10000
    };
  }
  
  // Parar sistema (para debug)
  stop() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
      console.log('🛑 Price Engine Central parado');
    }
  }
  
  // Reiniciar sistema (para debug)
  restart() {
    this.stop();
    setTimeout(() => this.initialize(), 1000);
  }
}

// ===== INSTÂNCIA GLOBAL DO PRICE ENGINE =====
const priceEngine = new PriceEngineCentral();

// ===== EXPORTAÇÃO GLOBAL =====
window.priceEngine = priceEngine;
window.PriceEngineCentral = PriceEngineCentral;

console.log('🎯 Price Engine Central (CPE) carregado e ativo!');
