// ===== GRÁFICOS DE COTAÇÕES EM TEMPO REAL =====
// Implementação usando TradingView Lightweight Charts

class ChartManager {
  constructor() {
    this.chart = null;
    this.candlestickSeries = null;
    this.lineSeries = null;
    this.currentSymbol = 'PETR4';
    this.currentInterval = '1D';
    this.currentChartType = 'candlestick';
    this.isRealTimeEnabled = false;
    this.realTimeInterval = null;
    this.apiKey = null; // Será configurado quando necessário
    
    // Dados simulados para demonstração
    this.simulatedData = this.generateSimulatedData();
  }

  // Inicializar o gráfico
  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error("Container não encontrado:", containerId);
      return;
    }

    // Garante que o container do gráfico esteja visível antes de inicializar
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';

    // Configurações do gráfico
    this.chart = LightweightCharts.createChart(container, {
      width: container.clientWidth,
      height: 400,
      layout: {
        background: { color: '#181A20' },
        textColor: '#FFFFFF',
      },
      grid: {
        vertLines: { color: '#2A2D35' },
        horzLines: { color: '#2A2D35' },
      },
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#2A2D35',
      },
      timeScale: {
        borderColor: '#2A2D35',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Adicionar séries
    this.candlestickSeries = this.chart.addCandlestickSeries({
      upColor: '#00C851',
      downColor: '#FF4444',
      borderDownColor: '#FF4444',
      borderUpColor: '#00C851',
      wickDownColor: '#FF4444',
      wickUpColor: '#00C851',
    });

    this.lineSeries = this.chart.addLineSeries({
      color: '#F0B90B',
      lineWidth: 2,
    });

    // Configurar dados iniciais
    this.updateChart();

    // Configurar responsividade
    this.setupResponsive(container);

    // Iniciar atualizações em tempo real
    this.startRealTimeUpdates();
  }

  // Gerar dados simulados para demonstração
  generateSimulatedData() {
    const data = [];
    const basePrice = 30.0;
    let currentPrice = basePrice;
    const now = new Date();
    
    // Gerar dados dos últimos 30 dias
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const open = currentPrice;
      const change = (Math.random() - 0.5) * 2; // Variação de -1 a +1
      const close = Math.max(0.1, open + change);
      const high = Math.max(open, close) + Math.random() * 0.5;
      const low = Math.min(open, close) - Math.random() * 0.5;
      
      data.push({
        time: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
      });
      
      currentPrice = close;
    }
    
    return data;
  }

  // Atualizar o gráfico com novos dados
  updateChart() {
    if (!this.chart) return;

    if (this.currentChartType === 'candlestick') {
      this.candlestickSeries.setData(this.simulatedData);
      this.lineSeries.setData([]);
    } else {
      const lineData = this.simulatedData.map(item => ({
        time: item.time,
        value: item.close
      }));
      this.lineSeries.setData(lineData);
      this.candlestickSeries.setData([]);
    }
  }

  // Alternar tipo de gráfico
  setChartType(type) {
    this.currentChartType = type;
    this.updateChart();
  }

  // Definir símbolo
  setSymbol(symbol) {
    this.currentSymbol = symbol;
    // Aqui você pode buscar dados reais da API
    this.updateChart();
  }

  // Definir intervalo
  setInterval(interval) {
    this.currentInterval = interval;
    // Aqui você pode buscar dados com o novo intervalo
    this.updateChart();
  }

  // Configurar responsividade
  setupResponsive(container) {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== container) return;
      const newRect = entries[0].contentRect;
      this.chart.applyOptions({ width: newRect.width, height: 400 });
    });

    resizeObserver.observe(container);
  }

  // Iniciar atualizações em tempo real
  startRealTimeUpdates() {
    if (this.realTimeInterval) {
      clearInterval(this.realTimeInterval);
    }

    this.realTimeInterval = setInterval(() => {
      this.updateRealTimeData();
    }, 5000); // Atualizar a cada 5 segundos
  }

  // Atualizar dados em tempo real
  updateRealTimeData() {
    if (!this.simulatedData.length) return;

    const lastData = this.simulatedData[this.simulatedData.length - 1];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Se é o mesmo dia, atualizar o último candle
    if (lastData.time === today) {
      const change = (Math.random() - 0.5) * 0.5;
      const newClose = Math.max(0.1, lastData.close + change);
      const newHigh = Math.max(lastData.high, newClose);
      const newLow = Math.min(lastData.low, newClose);

      const updatedData = {
        ...lastData,
        high: parseFloat(newHigh.toFixed(2)),
        low: parseFloat(newLow.toFixed(2)),
        close: parseFloat(newClose.toFixed(2)),
      };

      this.simulatedData[this.simulatedData.length - 1] = updatedData;

      if (this.currentChartType === 'candlestick') {
        this.candlestickSeries.update(updatedData);
      } else {
        this.lineSeries.update({
          time: updatedData.time,
          value: updatedData.close
        });
      }

      // Atualizar preços na interface
      this.updatePriceDisplay(updatedData);
    }
  }

  // Atualizar exibição de preços
  updatePriceDisplay(data) {
    // Atualizar preços no book de ofertas se existir
    if (typeof atualizarPrecoAtivo === 'function') {
      atualizarPrecoAtivo(this.currentSymbol, data.close);
    }
  }

  // Parar atualizações em tempo real
  stopRealTimeUpdates() {
    if (this.realTimeInterval) {
      clearInterval(this.realTimeInterval);
      this.realTimeInterval = null;
    }
  }

  // Destruir o gráfico
  destroy() {
    this.stopRealTimeUpdates();
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }
  }
}

// Instância global do gerenciador de gráficos
let chartManager = null;

// Função para inicializar os gráficos
function initializeCharts() {
  if (!window.LightweightCharts) {
    console.error('TradingView Lightweight Charts não carregado');
    return;
  }

  chartManager = new ChartManager();
  chartManager.init('trading-chart');
}

// Funções para controle dos gráficos
function setChartType(type) {
  if (chartManager) {
    chartManager.setChartType(type);
  }
}

function setChartSymbol(symbol) {
  if (chartManager) {
    chartManager.setSymbol(symbol);
  }
}

function setChartInterval(interval) {
  if (chartManager) {
    chartManager.setInterval(interval);
  }
}

// Função para atualizar preço de um ativo específico
function atualizarPrecoAtivo(symbol, price) {
  // Atualizar no objeto global de preços
  if (typeof precos !== 'undefined' && precos[symbol]) {
    precos[symbol] = price;
  }

  // Atualizar na interface se for o ativo atual
  if (chartManager && chartManager.currentSymbol === symbol) {
    // Atualizar displays de preço se existirem
    const priceElements = document.querySelectorAll(`[data-symbol="${symbol}"]`);
    priceElements.forEach(element => {
      element.textContent = `R$ ${price.toFixed(2)}`;
    });
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Aguardar um pouco para garantir que outras bibliotecas carregaram
  setTimeout(initializeCharts, 1000);
});

