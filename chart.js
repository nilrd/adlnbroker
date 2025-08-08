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
    container.style.width = '100%';
    container.style.height = '400px';

    // Aguardar um momento para garantir que o container esteja renderizado
    setTimeout(() => {
      console.log("Dentro do setTimeout de init.");
      const containerWidth = container.clientWidth || 800;
      const containerHeight = 400;

      console.log("Tentando criar o gráfico LightweightCharts...");
      console.log("LightweightCharts object:", LightweightCharts);
      try {
        const newChart = LightweightCharts.createChart(container, {
          width: containerWidth,
          height: containerHeight,
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
        this.chart = newChart;
        console.log('Gráfico criado com sucesso:', this.chart);

        // Adicionar séries e configurar o gráfico
        if (this.chart) {
          console.log('Gráfico criado, configurando séries...');
          
          // Tentar adicionar séries com diferentes abordagens
          try {
            // Primeira tentativa - método padrão
            this.candlestickSeries = this.chart.addCandlestickSeries({
              upColor: '#00C851',
              downColor: '#FF4444',
              borderDownColor: '#FF4444',
              borderUpColor: '#00C851',
              wickDownColor: '#FF4444',
              wickUpColor: '#00C851',
            });
            console.log('Candlestick series criada com sucesso');
          } catch (e) {
            console.log('Método padrão falhou, tentando alternativa...');
            // Segunda tentativa - verificar se existe método alternativo
            if (this.chart.addSeries) {
              try {
                this.candlestickSeries = this.chart.addSeries('candlestick', {
                  upColor: '#00C851',
                  downColor: '#FF4444',
                  borderDownColor: '#FF4444',
                  borderUpColor: '#00C851',
                  wickDownColor: '#FF4444',
                  wickUpColor: '#00C851',
                });
                console.log('Candlestick series criada com método alternativo');
              } catch (e2) {
                console.error('Erro ao criar candlestick series:', e2);
              }
            }
          }

          try {
            this.lineSeries = this.chart.addLineSeries({
              color: '#F0B90B',
              lineWidth: 2,
            });
            console.log('Line series criada com sucesso');
          } catch (e) {
            console.log('Método padrão para linha falhou, tentando alternativa...');
            if (this.chart.addSeries) {
              try {
                this.lineSeries = this.chart.addSeries('line', {
                  color: '#F0B90B',
                  lineWidth: 2,
                });
                console.log('Line series criada com método alternativo');
              } catch (e2) {
                console.error('Erro ao criar line series:', e2);
              }
            }
          }

          // Configurar dados iniciais
          this.updateChart();

          // Configurar responsividade
          this.setupResponsive(document.getElementById('trading-chart'));

          // Iniciar atualizações em tempo real
          this.startRealTimeUpdates();
          
          console.log('Gráfico configurado completamente');
        } else {
          console.error('this.chart é nulo após a criação. Não foi possível configurar.');
        }
      } catch (e) {
        console.error('Erro ao criar o gráfico LightweightCharts:', e);
      }
    }, 3000);
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
        time: date.getTime() / 1000, // Unix timestamp em segundos
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
      if (this.candlestickSeries) {
        this.candlestickSeries.setData(this.simulatedData);
      }
      if (this.lineSeries) {
        this.lineSeries.setData([]);
      }
    } else {
      const lineData = this.simulatedData.map(item => ({
        time: item.time,
        value: item.close
      }));
      if (this.lineSeries) {
        this.lineSeries.setData(lineData);
      }
      if (this.candlestickSeries) {
        this.candlestickSeries.setData([]);
      }
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
        if (this.chart && this.chart instanceof LightweightCharts.IChartApi) {
      this.chart.remove();
      this.chart = null;
    }
  }
}

// Instância global do gerenciador de gráficos
let chartManager = null;

// Função para inicializar os gráficos
function initializeCharts() {
  console.log("Iniciando inicialização dos gráficos...");
  
  // Verificar se LightweightCharts está disponível globalmente
  if (typeof LightweightCharts === "undefined" || !LightweightCharts.createChart) {
    console.error("TradingView Lightweight Charts não carregado ou API não disponível.");
    // Tentar novamente após um pequeno atraso
    setTimeout(initializeCharts, 500);
    return;
  }

  // Verificar se o container existe
  const container = document.getElementById("trading-chart");
  if (!container) {
    console.error("Container trading-chart não encontrado");
    return;
  }

  console.log("Container encontrado, criando ChartManager...");
  if (chartManager) {
    chartManager.destroy(); // Destruir instância anterior se existir
  }
  chartManager = new ChartManager();
  chartManager.init("trading-chart");
  
  console.log("ChartManager inicializado:", chartManager);
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
  console.log('DOM carregado, aguardando para inicializar gráficos...');
  // Aguardar um pouco mais para garantir que outras bibliotecas carregaram
  setTimeout(() => {
    console.log('Iniciando gráficos após timeout...');
    initializeCharts();
  }, 2000);
});

// Também tentar inicializar quando a página estiver completamente carregada
window.addEventListener('load', function() {
  console.log('Página completamente carregada');
  if (!chartManager) {
    console.log('ChartManager não existe, tentando inicializar novamente...');
    setTimeout(initializeCharts, 1000);
  }
});

