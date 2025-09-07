class NewChartManager {
  constructor() {
    this.chart = null;
    this.currentSymbol = 'PETR4';
    this.currentType = 'line'; // 'line' ou 'candlestick'
    this.currentPeriod = '1M'; // Padrão: 1 minuto
    this.stockData = {}; // Será preenchido com dados reais ou simulados
    this.bookData = {}; // Será preenchido com dados do book de ofertas
    this.REFRESH_MS = 10000; // 10 segundos para Book e Stocks
    this.CHART_UPDATE_MS = 10000; // 10 segundos para atualização do gráfico
    this.intervalId = null;
    this.chartIntervalId = null;
    this.paddingPercent = 0.1; // 10% de padding automático (configurável)
    this.lastPeriodBoundary = Date.now(); // Controle de mudança de período
    this.lastCandleUpdate = Date.now(); // Controle de atualização de candles
    this.lastChartUpdate = Date.now(); // Controle de atualização do gráfico
    this.tickData = []; // Dados de ticks para agregação em candles
    this.currentCandle = null; // Candle atual sendo formado
  }

  init() {
    const canvas = document.getElementById('mainChart');
    if (!canvas) {
      console.error('Canvas mainChart não encontrado');
      return;
    }
    this.initializeStockData();
    this.syncInitialData();
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
    let ohlcData = this.stockData[this.currentSymbol] ? this.stockData[this.currentSymbol].ohlcData : [];
    
    // Aplicar downsampling se necessário
    const maxPoints = this.getMaxPointsForPeriod(this.currentPeriod);
    ohlcData = this.downsampleData(ohlcData, maxPoints);
    
    const labels = ohlcData.map(item => item.time);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'High-Low (Wicks)',
          data: ohlcData.map(item => [item.low, item.high]),
          backgroundColor: ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444'),
          borderColor: ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444'),
          borderWidth: 1,
          barThickness: 'flex',
          barPercentage: 0.4, // 40% da categoria para wicks (mais grossos)
          categoryPercentage: 1.0, // 100% da categoria disponível
          order: 2
        }, {
          label: 'Open-Close (Body)',
          data: ohlcData.map(item => [Math.min(item.open, item.close), Math.max(item.open, item.close)]),
          backgroundColor: ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444'),
          borderColor: ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444'),
          borderWidth: 1,
          barThickness: 'flex',
          barPercentage: 0.9, // 90% da categoria para o corpo do candle (mais grosso)
          categoryPercentage: 1.0, // 100% da categoria disponível
          order: 1
        }]
      },
      options: this.getCandlestickOptions()
    });
  }

  getChartOptions() {
    // Calcular escala dinâmica do eixo Y baseada nos dados de preço
    const data = this.stockData[this.currentSymbol] ? this.stockData[this.currentSymbol].history : [];
    let minPrice, maxPrice;
    
    if (data.length > 0) {
      minPrice = Math.min(...data.map(item => item.price));
      maxPrice = Math.max(...data.map(item => item.price));
      
      // Adicionar margem de 1% acima e abaixo dos valores extremos para melhor visualização
      minPrice = minPrice * 0.99; // 1% abaixo do menor valor
      maxPrice = maxPrice * 1.01; // 1% acima do maior valor
    } else {
      // Valores padrão caso não haja dados
      minPrice = 0;
      maxPrice = 100;
    }

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
          min: minPrice,
          max: maxPrice,
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
    // Calcular escala dinâmica do eixo Y baseada nos dados OHLC
    const ohlcData = this.stockData[this.currentSymbol] ? this.stockData[this.currentSymbol].ohlcData : [];
    let minPrice, maxPrice;
    
    if (ohlcData.length > 0) {
      minPrice = Math.min(...ohlcData.map(item => item.low));
      maxPrice = Math.max(...ohlcData.map(item => item.high));
      
      // Adicionar margem de 1% acima e abaixo dos valores extremos para melhor visualização
      minPrice = minPrice * 0.99; // 1% abaixo do menor valor
      maxPrice = maxPrice * 1.01; // 1% acima do maior valor
    } else {
      // Valores padrão caso não haja dados
      minPrice = 0;
      maxPrice = 100;
    }

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
              const change = ohlcData.close - ohlcData.open;
              const changePercent = (change / ohlcData.open) * 100;
              const changeColor = change >= 0 ? '#00c851' : '#ff4444';
              
              return [
                `Abertura: R$ ${ohlcData.open.toFixed(2)}`,
                `Máxima: R$ ${ohlcData.high.toFixed(2)}`,
                `Mínima: R$ ${ohlcData.low.toFixed(2)}`,
                `Fechamento: R$ ${ohlcData.close.toFixed(2)}`,
                `Variação: ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#888888',
            font: {
              size: 10
            },
            maxTicksLimit: 12,
            maxRotation: 0
          }
        },
        y: {
          display: true,
          position: 'right',
          min: minPrice,
          max: maxPrice,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#888888',
            font: {
              size: 10
            },
            callback: function(value) {
              return 'R$ ' + value.toFixed(2);
            },
            maxTicksLimit: 8
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      elements: {
        bar: {
          borderRadius: 0
        }
      }
    };
  }

  // Obter intervalo em milissegundos baseado no período
  getIntervalInMs() {
    switch (this.currentPeriod) {
      case '1M': // 1 minuto
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

  // Formatar tempo baseado no período
  formatTimeForPeriod(timestamp) {
    const date = new Date(timestamp);
    
    switch (this.currentPeriod) {
      case '1M':
      case '5M':
      case '30M':
        return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      case '1H':
        return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      default:
        return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
  }

  startRealtimeUpdates() {
    // Parar atualizações anteriores se existirem
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.chartIntervalId) {
      clearInterval(this.chartIntervalId);
    }
    
    // Intervalo para Book e Stocks (10 segundos) - conforme regras de negócio
    this.intervalId = setInterval(() => {
      this.updateBookAndStocks();
    }, this.REFRESH_MS);
    
    // Intervalo para verificação de candles (5 segundos) - para respeitar intervalos gráficos
    this.chartIntervalId = setInterval(() => {
      this.updateChartData();
    }, 5000); // Verificar a cada 5 segundos para candles precisos
    
    console.log(`Atualizações iniciadas - Book/Stocks: ${this.REFRESH_MS}ms, Verificação de candles: 5000ms`);
  }

  // Atualizar Book e Stocks (10 segundos) - SINCRONIZADO COM SISTEMA.JS
  updateBookAndStocks() {
    try {
      // RN-002: Sincronização EXCLUSIVA com Price Engine Central (CPE)
      if (window.priceEngine) {
        const precosCPE = window.priceEngine.getCurrentPrices();
        
        for (const symbol in this.stockData) {
          const stock = this.stockData[symbol];
          if (!stock) continue;
          
          // Obter preço EXCLUSIVAMENTE do CPE
          const precoCPE = precosCPE[symbol];
          if (precoCPE !== undefined) {
            // Atualizar dados do stock com preço do CPE
            stock.price = precoCPE;
            stock.change = precoCPE - stock.basePrice;
            stock.changePercent = (stock.change / stock.basePrice) * 100;
            
            // Adicionar tick aos dados para agregação (apenas para o ativo atual)
            if (symbol === this.currentSymbol) {
              this.addTickData(precoCPE);
            }
          }
        }
        
        console.log('Book/Stocks atualizados EXCLUSIVAMENTE com Price Engine Central');
      } else {
        console.warn('⚠️ Price Engine Central não disponível - aguardando...');
        // Não usar fallback - aguardar CPE estar disponível
        return;
      }
      
      // Atualizar Book e Stocks
      this.updateBookOfOffers();
      this.updateStocksDisplay();
      this.updateSelectedStockInfo(); // Sincronizar preço do gráfico com os outros ativos
      
    } catch (error) {
      console.error('Erro ao atualizar Book e Stocks:', error);
      // Exibir mensagem de erro ao usuário (RN-002)
      if (typeof mostrarMensagem === 'function') {
        mostrarMensagem("mensagem", "Não foi possível atualizar o Book de Ofertas no momento.", "error");
      }
    }
  }

  // Atualizar dados do gráfico (verificação contínua para candles)
  updateChartData() {
    const stock = this.stockData[this.currentSymbol];
    if (!stock) return;
    
    const now = Date.now();
    
    // SEMPRE verificar se é hora de atualizar candles baseado no período configurado
    // Isso é independente da frequência de atualização dos preços (10s)
    if (this.shouldUpdateCandles()) {
      this.updateCandlesFromTicks();
      
      // Atualizar gráfico quando um novo candle é criado
      if (this.chart) {
        this.updateChart();
        this.updateSelectedStockInfo();
      }
      
      console.log(`Novo candle criado para ${this.currentSymbol} - período ${this.currentPeriod}`);
    }
    
    // Atualizar gráfico a cada 10 segundos apenas para mostrar mudanças de preço em tempo real
    const timeSinceLastChartUpdate = now - this.lastChartUpdate;
    if (timeSinceLastChartUpdate >= this.CHART_UPDATE_MS) {
      if (this.chart) {
        this.updateChart();
        this.updateSelectedStockInfo();
      }
      this.lastChartUpdate = now;
      console.log(`Gráfico atualizado para ${this.currentSymbol} - preços em tempo real`);
    }
  }

  // Função getLatestPrice REMOVIDA - Agora usa apenas Price Engine Central (CPE)
  // Todos os preços vêm de uma única fonte: window.priceEngine.getPrice(symbol)

  // Adicionar tick aos dados para agregação
  addTickData(price) {
    const now = Date.now();
    this.tickData.push({
      price: price,
      timestamp: now
    });
    
    // Manter apenas os ticks dos últimos 24 horas para evitar acúmulo excessivo
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    this.tickData = this.tickData.filter(tick => tick.timestamp > oneDayAgo);
  }

  // Verificar se é hora de atualizar candles baseado no período
  shouldUpdateCandles() {
    const now = Date.now();
    
    // Se não há candle atual, sempre criar um novo
    if (!this.currentCandle) {
      return true;
    }
    
    // Calcular o início do período atual
    const intervalMs = this.getIntervalInMs();
    const currentPeriodStart = Math.floor(now / intervalMs) * intervalMs;
    
    // Calcular o início do período do candle atual
    const candlePeriodStart = Math.floor(this.lastCandleUpdate / intervalMs) * intervalMs;
    
    // Se estamos em um período diferente do candle atual, criar novo candle
    const shouldUpdate = currentPeriodStart > candlePeriodStart;
    
    if (shouldUpdate) {
      console.log(`🕐 Período de candle expirado - Atual: ${new Date(currentPeriodStart).toLocaleTimeString()}, Candle: ${new Date(candlePeriodStart).toLocaleTimeString()}`);
      console.log(`🕐 Intervalo: ${this.currentPeriod} (${intervalMs/1000}s), Diferença: ${(currentPeriodStart - candlePeriodStart)/1000}s`);
    }
    
    return shouldUpdate;
  }

  // Atualizar candles a partir dos ticks acumulados
  updateCandlesFromTicks() {
    const stock = this.stockData[this.currentSymbol];
    if (!stock) return;
    
    const now = Date.now();
    const intervalMs = this.getIntervalInMs();
    const currentPeriodStart = Math.floor(now / intervalMs) * intervalMs;
    
    // Inicializar candle atual se não existir
    if (!this.currentCandle) {
      this.currentCandle = {
        time: this.formatTimeForPeriod(currentPeriodStart),
        open: stock.price,
        high: stock.price,
        low: stock.price,
        close: stock.price
      };
      this.lastCandleUpdate = currentPeriodStart;
      console.log(`🕯️ Candle inicial criado para ${this.currentSymbol} - período ${this.currentPeriod} às ${this.currentCandle.time} (timestamp: ${currentPeriodStart})`);
    }
    
    // Atualizar candle atual com o preço mais recente
    this.currentCandle.close = stock.price;
    this.currentCandle.high = Math.max(this.currentCandle.high, stock.price);
    this.currentCandle.low = Math.min(this.currentCandle.low, stock.price);
    
    // Verificar se chegou ao fim do período
    if (this.shouldUpdateCandles()) {
      // Finalizar candle atual e adicionar ao histórico
      this.addCandleToStock(stock, this.currentCandle);
      
      // Iniciar novo candle no início do período atual
      this.currentCandle = {
        time: this.formatTimeForPeriod(currentPeriodStart),
        open: stock.price,
        high: stock.price,
        low: stock.price,
        close: stock.price
      };
      
      this.lastCandleUpdate = currentPeriodStart;
      console.log(`🕯️ Novo candle criado para ${this.currentSymbol} - período ${this.currentPeriod} às ${this.currentCandle.time} (timestamp: ${currentPeriodStart}) (OHLC: ${this.currentCandle.open.toFixed(2)}/${this.currentCandle.high.toFixed(2)}/${this.currentCandle.low.toFixed(2)}/${this.currentCandle.close.toFixed(2)})`);
    }
    
    // Atualizar histórico de linha com o último preço (independente dos candles)
    const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    if (stock.history.length > 0) {
      stock.history[stock.history.length - 1] = { time: time, price: stock.price };
    } else {
      stock.history.push({ time: time, price: stock.price });
    }
  }



  // Adicionar candle ao stock
  addCandleToStock(stock, candle) {
    // Adicionar novo candle
    stock.ohlcData.push(candle);
    
    // Manter apenas os candles necessários (limite por período)
    const maxPoints = this.getMaxPointsForPeriod(this.currentPeriod);
    if (stock.ohlcData.length > maxPoints) {
      stock.ohlcData = stock.ohlcData.slice(-maxPoints);
    }
    
    console.log(`Novo candle adicionado: ${JSON.stringify(candle)}`);
  }



  updateStockPrices() {
    // DESABILITADO: Atualização de preços agora é gerenciada pelo sistema principal
    // Esta função foi desabilitada para evitar conflitos de sincronização
    console.log('updateStockPrices desabilitado - usando sincronização centralizada');
  }

  updateBookOfOffers() {
    // Atualizar Book de Ofertas com todos os ativos
    const tbody = document.querySelector("#book tbody");
    if (!tbody) {
      console.warn('Elemento #book tbody não encontrado');
      return;
    }

    try {
      tbody.innerHTML = "";

      for (const symbol in this.stockData) {
        const stock = this.stockData[symbol];
        if (!stock) continue;

        // Validação e tratamento de valores undefined/null
        const currentPrice = stock.price || 0;
        const changePercent = stock.changePercent || 0;
        const isPositive = changePercent >= 0;

        // Verificar se os valores são números válidos antes de usar toFixed
        const formattedPrice = (typeof currentPrice === 'number' && !isNaN(currentPrice)) 
          ? currentPrice.toFixed(2) 
          : '0.00';
        const formattedChange = (typeof changePercent === 'number' && !isNaN(changePercent)) 
          ? changePercent.toFixed(2) 
          : '0.00';

        const row = tbody.insertRow();
        row.innerHTML = '<td>' + this.createAssetLogo(symbol, '20px') + symbol + '</td>' +
                       '<td>R$ ' + formattedPrice + '</td>' +
                       '<td class="' + (isPositive ? 'positive' : 'negative') + '">' +
                       (isPositive ? '+' : '') + formattedChange + '%</td>' +
                       '<td>' + (Math.floor(Math.random() * 1000) + 100) + '</td>';
      }

      // Atualizar timestamp da última atualização
      const lastUpdateEl = document.getElementById("lastUpdate");
      if (lastUpdateEl) {
        lastUpdateEl.textContent = new Date().toLocaleTimeString("pt-BR");
      }
    } catch (e) {
      console.error("Erro ao atualizar Book de Ofertas:", e);
      // Exibir mensagem de erro ao usuário (RN-002)
      if (typeof mostrarMensagem === 'function') {
        mostrarMensagem("mensagem", "Não foi possível atualizar o Book de Ofertas no momento.", "error");
      }
    }
  }

  renderBookOfOffers() {
    const bookData = this.bookData[this.currentSymbol];
    if (!bookData) return;
    
    // Aqui você pode implementar a renderização visual do book de ofertas
    // Por enquanto, apenas logamos os dados para debug
    console.log('Book de Ofertas atualizado:', {
      symbol: this.currentSymbol,
      lastPrice: bookData.lastPrice,
      bids: bookData.bids.length,
      asks: bookData.asks.length,
      updateTime: bookData.lastUpdate
    });
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
      
      // Calcular escala dinâmica com padding automático para gráfico de linha
      if (data.length > 0) {
        const minPrice = Math.min(...data.map(item => item.price));
        const maxPrice = Math.max(...data.map(item => item.price));
        const priceRange = maxPrice - minPrice;
        
        // Padding automático baseado na variação real (configurável)
        const padding = priceRange * this.paddingPercent;
        
        this.chart.options.scales.y.min = minPrice - padding;
        this.chart.options.scales.y.max = maxPrice + padding;
      }
    } else if (this.currentType === 'candlestick') {
      // Para candlestick, atualizar dados com distribuição automática
      let ohlcData = this.stockData[this.currentSymbol] ? this.stockData[this.currentSymbol].ohlcData : [];
      
      // Aplicar downsampling se necessário
      const maxPoints = this.getMaxPointsForPeriod(this.currentPeriod);
      ohlcData = this.downsampleData(ohlcData, maxPoints);
      
      const labels = ohlcData.map(item => item.time);
      
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = ohlcData.map(item => [item.low, item.high]);
      this.chart.data.datasets[0].backgroundColor = ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444');
      this.chart.data.datasets[0].borderColor = ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444');
      
      this.chart.data.datasets[1].data = ohlcData.map(item => [Math.min(item.open, item.close), Math.max(item.open, item.close)]);
      this.chart.data.datasets[1].backgroundColor = ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444');
      this.chart.data.datasets[1].borderColor = ohlcData.map(item => item.close >= item.open ? '#00c851' : '#ff4444');
      
      // Calcular escala dinâmica com padding automático para gráfico de candlestick
      if (ohlcData.length > 0) {
        const minPrice = Math.min(...ohlcData.map(item => item.low));
        const maxPrice = Math.max(...ohlcData.map(item => item.high));
        const priceRange = maxPrice - minPrice;
        
        // Padding automático baseado na variação real (configurável)
        const padding = priceRange * this.paddingPercent;
        
        this.chart.options.scales.y.min = minPrice - padding;
        this.chart.options.scales.y.max = maxPrice + padding;
      }
    }
    
    this.chart.update('none');

    // Atualizar informações do stock selecionado no cabeçalho do gráfico
    this.updateSelectedStockInfo();
  }

  updateStocksDisplay() {
    // Atualizar a exibição na seção de Stocks com os mesmos valores sincronizados
    for (const symbol in this.stockData) {
      const stock = this.stockData[symbol];
      
      // Atualizar preço com validação
      const priceElement = document.getElementById(`price-${symbol}`);
      if (priceElement) {
        const price = stock.price || 0;
        const formattedPrice = (typeof price === 'number' && !isNaN(price)) ? price.toFixed(2) : '0.00';
        priceElement.textContent = formattedPrice;
      }
      
      // Atualizar variação com validação
      const changeElement = document.getElementById(`change-${symbol}`);
      if (changeElement) {
        const change = stock.change || 0;
        const formattedChange = (typeof change === 'number' && !isNaN(change)) ? change.toFixed(2) : '0.00';
        changeElement.textContent = `${change >= 0 ? '+' : ''}${formattedChange}`;
        changeElement.className = `change ${change >= 0 ? 'positive' : 'negative'}`;
      }
      
      // Atualizar percentual com validação
      const percentElement = document.getElementById(`percent-${symbol}`);
      if (percentElement) {
        const changePercent = stock.changePercent || 0;
        const formattedPercent = (typeof changePercent === 'number' && !isNaN(changePercent)) ? changePercent.toFixed(2) : '0.00';
        percentElement.textContent = `(${changePercent >= 0 ? '+' : ''}${formattedPercent}%)`;
        percentElement.className = `change-percent ${changePercent >= 0 ? 'positive' : 'negative'}`;
      }
    }
  }

  updateSelectedStockInfo() {
    const stock = this.stockData[this.currentSymbol];
    if (stock) {
      document.getElementById('selectedStockSymbol').innerHTML = this.createAssetLogo(this.currentSymbol, '32px') + this.currentSymbol;
      document.getElementById('selectedStockName').textContent = stock.name;
      
      // Validação para preço
      const price = stock.price || 0;
      const formattedPrice = (typeof price === 'number' && !isNaN(price)) ? price.toFixed(2) : '0.00';
      document.getElementById('selectedStockPrice').textContent = `R$ ${formattedPrice}`;
      
      const changeElement = document.getElementById('selectedStockChange');
      if (changeElement) {
        const change = stock.change || 0;
        const changePercent = stock.changePercent || 0;
        const formattedChange = (typeof change === 'number' && !isNaN(change)) ? change.toFixed(2) : '0.00';
        const formattedChangePercent = (typeof changePercent === 'number' && !isNaN(changePercent)) ? changePercent.toFixed(2) : '0.00';
        
        changeElement.textContent = `${change >= 0 ? '+' : ''}${formattedChange} (${changePercent >= 0 ? '+' : ''}${formattedChangePercent}%)`;
        changeElement.className = `change-main-v2 ${change >= 0 ? 'positive' : 'negative'}`;
      }
    }
  }

  // Função para obter o caminho do logo do ativo
  getAssetLogo(symbol) {
    const logoMap = {
      'PETR4': 'commons ativos/petro.svg', // Petróleo Brasileiro - logo correto
      'VALE3': 'commons ativos/vale-logo-1.svg',
      'ITUB4': 'commons ativos/itau.svg',
      'BBDC4': 'commons ativos/bradesco.svg',
      'ABEV3': 'commons ativos/Ambev_logo.svg',
      'MGLU3': 'commons ativos/magalu-logo.svg',
      'BBAS3': 'commons ativos/banco-do-brasil-seeklogo.svg',
      'LREN3': 'commons ativos/lojasrenner.svg', // Lojas Renner - logo correto
      'WEGE3': 'commons ativos/wege3.svg', // WEG - logo correto
      'B3SA3': 'commons ativos/b3sa3.svg', // B3 - Bolsa Brasileira
      'COGN3': 'commons ativos/cogn3.svg', // Cogna Educação
      'ITSA4': 'commons ativos/itsa4.svg' // Itaúsa
    };
    
    console.log('getAssetLogo chamado para:', symbol, 'Resultado:', logoMap[symbol]);
    return logoMap[symbol] || null;
  }

  // Função para criar elemento de logo do ativo
  createAssetLogo(symbol, size = '20px') {
    const logoPath = this.getAssetLogo(symbol);
    console.log('createAssetLogo chamado para:', symbol, 'Logo path:', logoPath);
    if (!logoPath) {
      console.warn('Logo não encontrado para:', symbol);
      return '';
    }
    
    const imgHtml = `<img src="${logoPath}" alt="${symbol}" class="asset-logo" style="width: ${size}; height: ${size}; margin-right: 8px; vertical-align: middle; object-fit: contain;">`;
    console.log('HTML gerado para', symbol, ':', imgHtml);
    return imgHtml;
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
    
    // Calcular o início correto do período atual
    const now = Date.now();
    const intervalMs = this.getIntervalInMs();
    const currentPeriodStart = Math.floor(now / intervalMs) * intervalMs;
    
    // Resetar controles de período e candles com timestamp correto
    this.lastPeriodBoundary = currentPeriodStart;
    this.lastCandleUpdate = currentPeriodStart;
    
    // Limpar dados existentes para recriar com agregação correta
    const stock = this.stockData[this.currentSymbol];
    if (stock) {
      stock.ohlcData = [];
      stock.history = [];
    }
    
    // Limpar ticks antigos e candle atual
    this.tickData = [];
    this.currentCandle = null;
    
    // Gerar dados históricos para o novo período
    this.generateHistoricalData();
    
    this.createChart();
    
    console.log(`🕐 Período alterado para ${period} (${this.getIntervalInMs()/1000}s) - candles serão recriados com agregação correta`);
    console.log(`🕐 Início do período atual: ${new Date(currentPeriodStart).toLocaleTimeString()}`);
  }

  regenerateHistoryForPeriod(symbol, points) {
    const stock = this.stockData[symbol];
    stock.history = [];
    stock.ohlcData = [];
    
    let currentPrice = stock.price;
    for (let i = 0; i < points; i++) {
      // Variação mais realista baseada no preço atual
      const volatility = currentPrice * 0.01; // 1% de volatilidade
      const variation = (Math.random() - 0.5) * volatility;
      currentPrice = currentPrice + variation;
      if (currentPrice < 0.01) currentPrice = 0.01;
      
      const time = new Date(Date.now() - (points - i) * this.getIntervalInMs()).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      
      // Dados para linha
      stock.history.push({ time: time, price: parseFloat(currentPrice.toFixed(2)) });
      
      // Dados OHLC para candlestick - mais realistas
      const open = i === 0 ? currentPrice : stock.ohlcData[i-1]?.close || currentPrice;
      const close = currentPrice;
      
      // Calcular high e low de forma mais realista
      const priceRange = Math.abs(close - open) * 0.5; // Range baseado na diferença open-close
      const minRange = currentPrice * 0.002; // Mínimo 0.2% do preço
      const maxRange = currentPrice * 0.015; // Máximo 1.5% do preço
      
      const actualRange = Math.max(minRange, Math.min(maxRange, priceRange + (Math.random() * currentPrice * 0.01)));
      
      let high, low;
      if (close >= open) {
        // Candle verde (bullish)
        high = close + (Math.random() * actualRange * 0.7);
        low = open - (Math.random() * actualRange * 0.3);
      } else {
        // Candle vermelho (bearish)
        high = open + (Math.random() * actualRange * 0.3);
        low = close - (Math.random() * actualRange * 0.7);
      }
      
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

  // Função para inicializar os dados dos stocks - SINCRONIZADA COM SISTEMA.JS
  initializeStockData() {
    // Obter preços do sistema.js se disponível
    const precosSistema = window.precos || {
      PETR4: 28.50,
      VALE3: 72.30,
      ITUB4: 31.20,
      BBDC4: 27.80,
      ABEV3: 14.25,
      MGLU3: 3.45,
      BBAS3: 49.10,
      LREN3: 18.30,
      WEGE3: 37.85,
      B3SA3: 12.50,
      COGN3: 17.50,
      ITSA4: 9.10
    };

    // Preços de referência históricos para cálculo de performance
    const precosReferencia = {
      'PETR4': 25.00,
      'VALE3': 65.00,
      'ITUB4': 28.00,
      'BBDC4': 14.00,
      'ABEV3': 11.00,
      'MGLU3': 7.50,
      'BBAS3': 35.00,
      'LREN3': 20.00,
      'WEGE3': 35.00,
      'B3SA3': 11.00,
      'COGN3': 16.00,
      'ITSA4': 8.50
    };

    this.stockData = {
      'PETR4': {
        name: 'Petróleo Brasileiro S.A.',
        price: precosSistema.PETR4,
        basePrice: precosReferencia.PETR4,
        change: precosSistema.PETR4 - precosReferencia.PETR4,
        changePercent: ((precosSistema.PETR4 - precosReferencia.PETR4) / precosReferencia.PETR4) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.PETR4
      },
      'VALE3': {
        name: 'Vale S.A.',
        price: precosSistema.VALE3,
        basePrice: precosReferencia.VALE3,
        change: precosSistema.VALE3 - precosReferencia.VALE3,
        changePercent: ((precosSistema.VALE3 - precosReferencia.VALE3) / precosReferencia.VALE3) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.VALE3
      },
      'ITUB4': {
        name: 'Itaú Unibanco Holding S.A.',
        price: precosSistema.ITUB4,
        basePrice: precosReferencia.ITUB4,
        change: precosSistema.ITUB4 - precosReferencia.ITUB4,
        changePercent: ((precosSistema.ITUB4 - precosReferencia.ITUB4) / precosReferencia.ITUB4) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.ITUB4
      },
      'BBDC4': {
        name: 'Banco Bradesco S.A.',
        price: precosSistema.BBDC4,
        basePrice: precosReferencia.BBDC4,
        change: precosSistema.BBDC4 - precosReferencia.BBDC4,
        changePercent: ((precosSistema.BBDC4 - precosReferencia.BBDC4) / precosReferencia.BBDC4) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.BBDC4
      },
      'ABEV3': {
        name: 'Ambev S.A.',
        price: precosSistema.ABEV3,
        basePrice: precosReferencia.ABEV3,
        change: precosSistema.ABEV3 - precosReferencia.ABEV3,
        changePercent: ((precosSistema.ABEV3 - precosReferencia.ABEV3) / precosReferencia.ABEV3) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.ABEV3
      },
      'MGLU3': {
        name: 'Magazine Luiza S.A.',
        price: precosSistema.MGLU3,
        basePrice: precosReferencia.MGLU3,
        change: precosSistema.MGLU3 - precosReferencia.MGLU3,
        changePercent: ((precosSistema.MGLU3 - precosReferencia.MGLU3) / precosReferencia.MGLU3) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.MGLU3
      },
      'BBAS3': {
        name: 'Banco do Brasil S.A.',
        price: precosSistema.BBAS3,
        basePrice: precosReferencia.BBAS3,
        change: precosSistema.BBAS3 - precosReferencia.BBAS3,
        changePercent: ((precosSistema.BBAS3 - precosReferencia.BBAS3) / precosReferencia.BBAS3) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.BBAS3
      },
      'LREN3': {
        name: 'Lojas Renner S.A.',
        price: precosSistema.LREN3,
        basePrice: precosReferencia.LREN3,
        change: precosSistema.LREN3 - precosReferencia.LREN3,
        changePercent: ((precosSistema.LREN3 - precosReferencia.LREN3) / precosReferencia.LREN3) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.LREN3
      },
      'WEGE3': {
        name: 'WEG S.A.',
        price: precosSistema.WEGE3,
        basePrice: precosReferencia.WEGE3,
        change: precosSistema.WEGE3 - precosReferencia.WEGE3,
        changePercent: ((precosSistema.WEGE3 - precosReferencia.WEGE3) / precosReferencia.WEGE3) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.WEGE3
      },
      'B3SA3': {
        name: 'B3 S.A. - Brasil, Bolsa, Balcão',
        price: precosSistema.B3SA3,
        basePrice: precosReferencia.B3SA3,
        change: precosSistema.B3SA3 - precosReferencia.B3SA3,
        changePercent: ((precosSistema.B3SA3 - precosReferencia.B3SA3) / precosReferencia.B3SA3) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.B3SA3
      },
      'COGN3': {
        name: 'Cogna Educação S.A.',
        price: precosSistema.COGN3,
        basePrice: precosReferencia.COGN3,
        change: precosSistema.COGN3 - precosReferencia.COGN3,
        changePercent: ((precosSistema.COGN3 - precosReferencia.COGN3) / precosReferencia.COGN3) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.COGN3
      },
      'ITSA4': {
        name: 'Itaúsa S.A.',
        price: precosSistema.ITSA4,
        basePrice: precosReferencia.ITSA4,
        change: precosSistema.ITSA4 - precosReferencia.ITSA4,
        changePercent: ((precosSistema.ITSA4 - precosReferencia.ITSA4) / precosReferencia.ITSA4) * 100,
        history: [],
        ohlcData: [],
        lastPrice: precosSistema.ITSA4
      }
    };
    
    // Preencher histórico inicial para cada stock
    for (const symbol in this.stockData) {
      this.regenerateHistoryForPeriod(symbol, 60); // 60 pontos de dados iniciais (1 minuto)
    }
    
    console.log('Dados dos stocks inicializados e sincronizados com sistema.js');
  }

  // Método para obter o limite de pontos por período
  getMaxPointsForPeriod(period) {
    switch (period) {
      case '1M': return 30;   // 30 candles para 1 minuto (reduzido para melhor visualização)
      case '5M': return 24;   // 24 candles para 5 minutos (reduzido para melhor visualização)
      case '30M': return 16;  // 16 candles para 30 minutos (reduzido para melhor visualização)
      case '1H': return 12;   // 12 candles para 1 hora (reduzido para melhor visualização)
      default: return 30;
    }
  }

  // Método para fazer downsampling dos dados quando há muitos pontos
  downsampleData(data, maxPoints) {
    if (data.length <= maxPoints) {
      return data;
    }

    const step = Math.ceil(data.length / maxPoints);
    const downsampled = [];
    
    for (let i = 0; i < data.length; i += step) {
      downsampled.push(data[i]);
    }
    
    console.log(`Downsampling aplicado: ${data.length} → ${downsampled.length} pontos`);
    return downsampled;
  }

  // Sincronizar dados iniciais
  syncInitialData() {
    const stock = this.stockData[this.currentSymbol];
    if (!stock) return;
    
    // Gerar dados históricos iniciais
    this.generateHistoricalData();
    
    // Garantir que o último candle tenha o preço atual do stock
    if (stock.ohlcData && stock.ohlcData.length > 0) {
      const lastCandle = stock.ohlcData[stock.ohlcData.length - 1];
      lastCandle.close = stock.price;
      lastCandle.high = Math.max(lastCandle.high, stock.price);
      lastCandle.low = Math.min(lastCandle.low, stock.price);
    }
    
    // Garantir que o último item do histórico tenha o preço atual
    if (stock.history && stock.history.length > 0) {
      stock.history[stock.history.length - 1].price = stock.price;
    }
    
    // Inicializar candle atual
    this.currentCandle = {
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      open: stock.price,
      high: stock.price,
      low: stock.price,
      close: stock.price
    };
    
    // Atualizar interface imediatamente
    this.updateBookOfOffers();
    this.updateStocksDisplay();
    this.updateSelectedStockInfo();
    
    const price = stock.price || 0;
    const formattedPrice = (typeof price === 'number' && !isNaN(price)) ? price.toFixed(2) : '0.00';
    console.log(`Dados iniciais sincronizados para ${this.currentSymbol}: R$ ${formattedPrice}`);
  }

  // Método para sincronizar dados entre Stocks e Gráfico (mantido para compatibilidade)
  syncStockData() {
    // Este método agora é redundante - a sincronização é feita no tick()
    console.log('syncStockData chamado - sincronização agora é automática no tick()');
  }

  // Método para configurar o padding da escala
  setPaddingPercent(percent) {
    if (percent >= 0 && percent <= 1) {
      this.paddingPercent = percent;
      console.log(`Padding configurado para ${(percent * 100).toFixed(1)}%`);
    } else {
      console.error('Percentual de padding deve estar entre 0 e 1 (0% a 100%)');
    }
  }

  // Gerar dados históricos para o período selecionado
  generateHistoricalData() {
    const stock = this.stockData[this.currentSymbol];
    if (!stock) return;
    
    const maxPoints = this.getMaxPointsForPeriod(this.currentPeriod);
    const periodMs = this.getIntervalInMs();
    const now = Date.now();
    
    // Calcular o início do período atual para alinhar os dados históricos
    const currentPeriodStart = Math.floor(now / periodMs) * periodMs;
    
    // Gerar dados históricos baseados no período
    for (let i = 0; i < maxPoints; i++) {
      // Calcular timestamp alinhado com o período
      const timeOffset = (maxPoints - i - 1) * periodMs;
      const timestamp = currentPeriodStart - timeOffset;
      const time = this.formatTimeForPeriod(timestamp);
      
      // Simular preço histórico
      const volatility = stock.price * 0.01;
      const variation = (Math.random() - 0.5) * volatility;
      const historicalPrice = stock.price + variation;
      
      // Para linha
      stock.history.push({ time: time, price: parseFloat(historicalPrice.toFixed(2)) });
      
      // Para candlestick - gerar OHLC realista
      const open = i === 0 ? historicalPrice : stock.ohlcData[i-1]?.close || historicalPrice;
      const close = historicalPrice;
      const priceRange = Math.abs(close - open) * 0.5;
      const minRange = historicalPrice * 0.002;
      const maxRange = historicalPrice * 0.015;
      const actualRange = Math.max(minRange, Math.min(maxRange, priceRange + (Math.random() * historicalPrice * 0.01)));
      
      let high, low;
      if (close >= open) {
        high = close + (Math.random() * actualRange * 0.7);
        low = open - (Math.random() * actualRange * 0.3);
      } else {
        high = open + (Math.random() * actualRange * 0.3);
        low = close - (Math.random() * actualRange * 0.7);
      }
      
      stock.ohlcData.push({
        time: time,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2))
      });
    }
    
    console.log(`📊 Dados históricos gerados para ${this.currentSymbol} - ${maxPoints} pontos para período ${this.currentPeriod} (${periodMs/1000}s cada)`);
    console.log(`📊 Período atual alinhado: ${new Date(currentPeriodStart).toLocaleTimeString()}`);
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
    console.log('Função selectStock chamada para:', symbol);
    newChartManager.selectStock(symbol);
  };

  // Adicionar eventos de clique direto para debug
  setTimeout(() => {
    const stockItems = document.querySelectorAll('.stock-item-expanded');
    stockItems.forEach(item => {
      item.addEventListener('click', function(e) {
        const symbolElement = this.querySelector('.stock-symbol-large');
        // Pegar apenas o texto, removendo o logo e espaços em branco
        const symbol = symbolElement.textContent.trim();
        console.log('Clique detectado via addEventListener para:', symbol);
        selectStock(symbol);
      });
    });
  }, 1000);

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


