// ===== CHART-TRADINGVIEW.JS - IMPLEMENTAÇÃO PROFISSIONAL COMPLETA =====
// Usando TradingView Lightweight Charts para análise técnica avançada

let tradingViewChartInstance = null;
let chartContainer = null;
let resizeObserver = null;

// Séries de dados
let candleSeries = null;
let lineSeries = null;
let rsiSeries = null;
let smaSeries = null;
let emaSeries = null;

// Ferramentas de desenho
let drawingTools = {
    supportLines: [],
    resistanceLines: [],
    trendLines: []
};

// Configurações do gráfico
const chartConfig = {
    layout: {
        background: { type: 'solid', color: '#1a1f2e' },
        textColor: '#ffffff',
        fontSize: 12,
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    grid: {
        vertLines: { color: 'rgba(42, 42, 61, 0.3)' },
        horzLines: { color: 'rgba(42, 42, 61, 0.3)' }
    },
    crosshair: {
        mode: 1, // 0 = disabled, 1 = magnet, 2 = normal
        vertLine: {
            color: '#F0B90B',
            width: 1,
            style: 2, // 0 = solid, 1 = dotted, 2 = dashed
            labelBackgroundColor: '#F0B90B'
        },
        horzLine: {
            color: '#F0B90B',
            width: 1,
            style: 2,
            labelBackgroundColor: '#F0B90B'
        }
    },
    rightPriceScale: {
        borderColor: 'rgba(42, 42, 61, 0.5)',
        textColor: '#888888',
        fontSize: 11,
        scaleMargins: {
            top: 0.1,
            bottom: 0.1
        }
    },
    leftPriceScale: {
        visible: true,
        borderColor: 'rgba(42, 42, 61, 0.5)',
        textColor: '#888888',
        fontSize: 11,
        scaleMargins: {
            top: 0.1,
            bottom: 0.1
        }
    },
    timeScale: {
        borderColor: 'rgba(42, 42, 61, 0.5)',
        textColor: '#888888',
        fontSize: 11,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12,
        barSpacing: 3
    }
};

// Cores profissionais para candles e indicadores
const chartColors = {
    candles: {
        up: '#10B981',      // Verde para alta
        down: '#EF4444',    // Vermelho para baixa
        border: {
            up: '#10B981',
            down: '#EF4444'
        }
    },
    indicators: {
        rsi: '#FF6B6B',     // RSI
        sma: '#4ECDC4',     // Média móvel simples
        ema: '#45B7D1',     // Média móvel exponencial
        support: '#00D4AA',  // Linha de suporte
        resistance: '#FF6B6B' // Linha de resistência
    }
};

// Função para inicializar o gráfico
function initTradingViewChart(containerId) {
    console.log('Inicializando TradingView Lightweight Chart com análise técnica...');
    
    // Limpar instância anterior se existir
    if (tradingViewChartInstance) {
        cleanupTradingViewChart();
    }
    
    chartContainer = document.getElementById(containerId);
    if (!chartContainer) {
        console.error('Container do gráfico não encontrado:', containerId);
        return false;
    }
    
    try {
        // Verificar se TradingView Lightweight Charts está disponível
        if (typeof LightweightCharts === 'undefined') {
            console.error('TradingView Lightweight Charts não está disponível');
            return false;
        }
        
        // Verificar se a biblioteca tem os métodos necessários
        if (typeof LightweightCharts.createChart !== 'function') {
            console.error('TradingView Lightweight Charts não tem método createChart');
            return false;
        }
        
        // Criar instância do gráfico
        tradingViewChartInstance = LightweightCharts.createChart(chartContainer, chartConfig);
        
        // Verificar se a instância foi criada corretamente
        if (!tradingViewChartInstance || typeof tradingViewChartInstance.addCandlestickSeries !== 'function') {
            console.error('Instância do gráfico não foi criada corretamente');
            return false;
        }
        
        // Configurar dimensões iniciais
        const containerRect = chartContainer.getBoundingClientRect();
        tradingViewChartInstance.applyOptions({
            width: containerRect.width,
            height: containerRect.height
        });
        
        // Configurar ResizeObserver para responsividade
        setupResizeObserver();
        
        // Configurar tooltip avançado
        setupAdvancedTooltip();
        
        // Configurar ferramentas de desenho
        setupDrawingTools();
        
        // Configurar indicadores
        setupIndicators();
        
        console.log('TradingView Chart com análise técnica inicializado com sucesso');
        return true;
        
    } catch (error) {
        console.error('Erro ao inicializar TradingView Chart:', error);
        return false;
    }
}

// Configurar ResizeObserver para responsividade
function setupResizeObserver() {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
    
    resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            if (tradingViewChartInstance && width > 0 && height > 0) {
                tradingViewChartInstance.applyOptions({
                    width: width,
                    height: height
                });
            }
        }
    });
    
    resizeObserver.observe(chartContainer);
}

// Configurar tooltip avançado para candles
function setupAdvancedTooltip() {
    if (!tradingViewChartInstance) return;
    
    // Tooltip para candles com informações completas
    tradingViewChartInstance.subscribeCrosshairMove(param => {
        if (param.time && param.seriesData) {
            const candleData = param.seriesData.get(candleSeries);
            if (candleData) {
                showAdvancedTooltip(param, candleData);
            } else {
                removeTooltip();
            }
        }
    });
    
    // Remover tooltip quando sair do gráfico
    tradingViewChartInstance.subscribeCrosshairMove(param => {
        if (!param.time) {
            removeTooltip();
        }
    });
}

// Exibir tooltip avançado
function showAdvancedTooltip(param, candleData) {
    // Remover tooltip anterior
    removeTooltip();
    
    if (!candleData) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip-advanced';
    tooltip.innerHTML = `
        <div class="tooltip-header">
            <strong>${formatTime(param.time)}</strong>
        </div>
        <div class="tooltip-content">
            <div class="tooltip-row">
                <span class="tooltip-label">Abertura:</span>
                <span class="tooltip-value">R$ ${candleData.open.toFixed(2)}</span>
            </div>
            <div class="tooltip-row">
                <span class="tooltip-label">Máxima:</span>
                <span class="tooltip-value">R$ ${candleData.high.toFixed(2)}</span>
            </div>
            <div class="tooltip-row">
                <span class="tooltip-label">Mínima:</span>
                <span class="tooltip-value">R$ ${candleData.low.toFixed(2)}</span>
            </div>
            <div class="tooltip-row">
                <span class="tooltip-label">Fechamento:</span>
                <span class="tooltip-value">R$ ${candleData.close.toFixed(2)}</span>
            </div>
            <div class="tooltip-row">
                <span class="tooltip-label">Volume:</span>
                <span class="tooltip-value">${formatVolume(candleData.volume || 0)}</span>
            </div>
        </div>
    `;
    
    // Posicionar tooltip
    const containerRect = chartContainer.getBoundingClientRect();
    const mouseX = param.point?.x || 0;
    const mouseY = param.point?.y || 0;
    
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${mouseX + 15}px`;
    tooltip.style.top = `${mouseY - 15}px`;
    tooltip.style.zIndex = '1000';
    
    chartContainer.appendChild(tooltip);
}

// Formatar tempo para exibição em BRT (Brasília Time)
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    
    // Converter para BRT (UTC-3)
    const brtOffset = -3 * 60; // -3 horas em minutos
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
    const brtTime = new Date(utcTime + (brtOffset * 60000));
    
    return brtTime.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Formatar volume
function formatVolume(volume) {
    if (volume >= 1000000) {
        return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
        return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
}

// Remover tooltip
function removeTooltip() {
    const existingTooltip = chartContainer.querySelector('.chart-tooltip-advanced');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}

// Configurar ferramentas de desenho
function setupDrawingTools() {
    if (!tradingViewChartInstance) return;
    
    // Adicionar botões de ferramentas
    addDrawingToolButtons();
    
    // Configurar eventos de mouse para desenho
    setupDrawingEvents();
}

// Adicionar botões de ferramentas de desenho
function addDrawingToolButtons() {
    const chartHeader = document.querySelector('.chart-header');
    if (!chartHeader) return;
    
    const drawingControls = document.createElement('div');
    drawingControls.className = 'chart-drawing-controls';
    drawingControls.innerHTML = `
        <button class="drawing-btn" data-tool="support" title="Linha de Suporte">
            <i class="fas fa-arrow-up"></i> Suporte
        </button>
        <button class="drawing-btn" data-tool="resistance" title="Linha de Resistência">
            <i class="fas fa-arrow-down"></i> Resistência
        </button>
        <button class="drawing-btn" data-tool="trend" title="Linha de Tendência">
            <i class="fas fa-chart-line"></i> Tendência
        </button>
        <button class="drawing-btn" data-tool="clear" title="Limpar Desenhos">
            <i class="fas fa-trash"></i> Limpar
        </button>
    `;
    
    chartHeader.appendChild(drawingControls);
    
    // Adicionar eventos aos botões
    drawingControls.querySelectorAll('.drawing-btn').forEach(btn => {
        btn.addEventListener('click', handleDrawingToolClick);
    });
}

// Configurar eventos de desenho
function setupDrawingEvents() {
    let isDrawing = false;
    let currentTool = null;
    let startPoint = null;
    
    chartContainer.addEventListener('mousedown', (e) => {
        if (!currentTool || currentTool === 'clear') return;
        
        isDrawing = true;
        const rect = chartContainer.getBoundingClientRect();
        startPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    });
    
    chartContainer.addEventListener('mousemove', (e) => {
        if (!isDrawing || !startPoint) return;
        
        // Atualizar linha de preview
        updateDrawingPreview(e);
    });
    
    chartContainer.addEventListener('mouseup', (e) => {
        if (!isDrawing || !startPoint) return;
        
        const rect = chartContainer.getBoundingClientRect();
        const endPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        finishDrawing(startPoint, endPoint, currentTool);
        
        isDrawing = false;
        startPoint = null;
        currentTool = null;
    });
}

// Atualizar preview do desenho
function updateDrawingPreview(e) {
    // Implementar preview em tempo real
}

// Finalizar desenho
function finishDrawing(start, end, tool) {
    if (!tradingViewChartInstance) return;
    
    const line = {
        id: Date.now(),
        tool: tool,
        start: start,
        end: end,
        color: getToolColor(tool)
    };
    
    // Adicionar linha ao gráfico
    addLineToChart(line);
    
    // Salvar na lista apropriada
    if (tool === 'support') {
        drawingTools.supportLines.push(line);
    } else if (tool === 'resistance') {
        drawingTools.resistanceLines.push(line);
    } else if (tool === 'trend') {
        drawingTools.trendLines.push(line);
    }
}

// Adicionar linha ao gráfico
function addLineToChart(line) {
    if (!tradingViewChartInstance) return;
    
    try {
        // Criar série de linha para o desenho
        const lineSeries = tradingViewChartInstance.addLineSeries({
            color: line.color,
            lineWidth: 2,
            crosshairMarkerVisible: false,
            lastValueVisible: false,
            priceLineVisible: false,
            title: `${line.tool.charAt(0).toUpperCase() + line.tool.slice(1)} Line`
        });
        
        // Converter coordenadas de tela para dados do gráfico
        const timeScale = tradingViewChartInstance.timeScale();
        const priceScale = tradingViewChartInstance.priceScale('right');
        
        // Obter dados OHLC para referência de tempo
        const ohlcData = generateOHLCData(chartModalCurrentAsset || 'PETR4', chartModalCurrentTimeframe || '1M');
        
        if (ohlcData && ohlcData.length > 0) {
            // Criar dados da linha
            const lineData = [
                {
                    time: ohlcData[0].time,
                    value: line.start.y
                },
                {
                    time: ohlcData[ohlcData.length - 1].time,
                    value: line.end.y
                }
            ];
            
            lineSeries.setData(lineData);
            
            // Salvar referência da série
            line.series = lineSeries;
            
            console.log('Linha adicionada ao gráfico:', line);
        }
        
    } catch (error) {
        console.error('Erro ao adicionar linha ao gráfico:', error);
    }
}

// Obter cor da ferramenta
function getToolColor(tool) {
    switch (tool) {
        case 'support': return chartColors.indicators.support;
        case 'resistance': return chartColors.indicators.resistance;
        case 'trend': return chartColors.indicators.sma;
        default: return '#F0B90B';
    }
}

// Configurar indicadores técnicos
function setupIndicators() {
    if (!tradingViewChartInstance) return;
    
    // Adicionar botões de indicadores
    addIndicatorButtons();
}

// Adicionar botões de indicadores
function addIndicatorButtons() {
    const chartHeader = document.querySelector('.chart-header');
    if (!chartHeader) return;
    
    const indicatorControls = document.createElement('div');
    indicatorControls.className = 'chart-indicator-controls';
    indicatorControls.innerHTML = `
        <button class="indicator-btn" data-indicator="rsi" title="RSI">
            <i class="fas fa-chart-area"></i> RSI
        </button>
        <button class="indicator-btn" data-indicator="sma" title="Média Móvel Simples">
            <i class="fas fa-chart-line"></i> SMA
        </button>
        <button class="indicator-btn" data-indicator="ema" title="Média Móvel Exponencial">
            <i class="fas fa-chart-line"></i> EMA
        </button>
    `;
    
    chartHeader.appendChild(indicatorControls);
    
    // Adicionar eventos aos botões
    indicatorControls.querySelectorAll('.indicator-btn').forEach(btn => {
        btn.addEventListener('click', handleIndicatorClick);
    });
}

// Função para carregar dados OHLC
function loadOHLCData(assetSymbol, timeframe, historicalData = []) {
    console.log(`Carregando dados OHLC para ${assetSymbol} - ${timeframe}`);
    
    if (!tradingViewChartInstance) {
        console.error('Gráfico não inicializado');
        return false;
    }
    
    // Verificar se a instância tem os métodos necessários
    if (typeof tradingViewChartInstance.addCandlestickSeries !== 'function') {
        console.error('Método addCandlestickSeries não disponível');
        return false;
    }
    
    try {
        // Gerar dados mockados baseados no timeframe
        let data = generateOHLCData(assetSymbol, timeframe);
        
        // Se temos dados históricos, mesclá-los com os novos dados
        if (historicalData && historicalData.length > 0) {
            // Filtrar dados históricos para o mesmo timeframe
            const filteredHistorical = historicalData.filter(d => {
                const dataTime = new Date(d.time * 1000);
                const now = new Date();
                const timeDiff = now.getTime() - dataTime.getTime();
                const maxAge = getTimeInterval(timeframe) * getDataPointsForTimeframe(timeframe);
                return timeDiff <= maxAge;
            });
            
            // Mesclar dados históricos com novos dados
            if (filteredHistorical.length > 0) {
                data = [...filteredHistorical, ...data];
                console.log(`Dados históricos preservados: ${filteredHistorical.length} candles`);
            }
        }
        
        if (!data || data.length === 0) {
            console.error('Dados OHLC inválidos ou vazios');
            return false;
        }
        
        // Limpar série anterior de forma segura
        if (candleSeries && tradingViewChartInstance && typeof tradingViewChartInstance.removeSeries === 'function') {
            try {
                tradingViewChartInstance.removeSeries(candleSeries);
            } catch (e) {
                console.warn('Erro ao remover série anterior:', e);
            }
        }
        candleSeries = null;
        
        // Criar nova série de candles
        candleSeries = tradingViewChartInstance.addCandlestickSeries({
            upColor: chartColors.candles.up,
            downColor: chartColors.candles.down,
            borderUpColor: chartColors.candles.border.up,
            borderDownColor: chartColors.candles.border.down,
            wickUpColor: chartColors.candles.up,
            wickDownColor: chartColors.candles.down
        });
        
        // Verificar se a série foi criada
        if (!candleSeries || typeof candleSeries.setData !== 'function') {
            console.error('Série de candles não foi criada corretamente');
            return false;
        }
        
        // Definir dados
        candleSeries.setData(data);
        
        // Ajustar escala para mostrar todos os dados
        if (typeof tradingViewChartInstance.timeScale === 'function') {
            tradingViewChartInstance.timeScale().fitContent();
        }
        
        console.log(`Dados OHLC carregados: ${data.length} candles`);
        return true;
        
    } catch (error) {
        console.error('Erro ao carregar dados OHLC:', error);
        return false;
    }
}

// Gerar dados OHLC mockados com volume e tempo BRT
function generateOHLCData(assetSymbol, timeframe) {
    const asset = chartModalAssetsData[assetSymbol];
    if (!asset) return [];
    
    const basePrice = asset.price;
    const dataPoints = getDataPointsForTimeframe(timeframe);
    const data = [];
    
    let currentPrice = basePrice;
    
    // Usar tempo BRT (Brasília Time)
    const now = new Date();
    const brtOffset = -3 * 60; // -3 horas em minutos
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const brtNow = new Date(utcTime + (brtOffset * 60000));
    
    for (let i = dataPoints - 1; i >= 0; i--) {
        const timestamp = new Date(brtNow.getTime() - (i * getTimeInterval(timeframe)));
        
        // Gerar variação realista baseada no timeframe
        const variation = getVariationForTimeframe(timeframe);
        const open = currentPrice;
        const close = open * (1 + (Math.random() - 0.5) * variation);
        
        // Calcular high e low baseados na variação
        const range = Math.abs(close - open) * (1 + Math.random() * 0.5);
        const high = Math.max(open, close) + range * Math.random();
        const low = Math.min(open, close) - range * Math.random();
        
        // Gerar volume realista
        const baseVolume = 1000000; // 1M base
        const volumeVariation = 0.3;
        const volume = baseVolume * (1 + (Math.random() - 0.5) * volumeVariation);
        
        data.push({
            time: Math.floor(timestamp.getTime() / 1000),
            open: open,
            high: high,
            low: low,
            close: close,
            volume: Math.floor(volume)
        });
        
        currentPrice = close;
    }
    
    return data;
}

// Obter número de pontos de dados baseado no timeframe
function getDataPointsForTimeframe(timeframe) {
    const points = {
        '1M': 60,   // 1 minuto - 60 pontos
        '5M': 72,   // 5 minutos - 72 pontos
        '30M': 48,  // 30 minutos - 48 pontos
        '1H': 24    // 1 hora - 24 pontos
    };
    return points[timeframe] || 60;
}

// Obter intervalo de tempo em milissegundos
function getTimeInterval(timeframe) {
    const intervals = {
        '1M': 60 * 1000,        // 1 minuto
        '5M': 5 * 60 * 1000,    // 5 minutos
        '30M': 30 * 60 * 1000,  // 30 minutos
        '1H': 60 * 60 * 1000    // 1 hora
    };
    return intervals[timeframe] || 60 * 1000;
}

// Obter variação baseada no timeframe
function getVariationForTimeframe(timeframe) {
    const variations = {
        '1M': 0.0005,   // ±0.05%
        '5M': 0.001,    // ±0.1%
        '30M': 0.002,   // ±0.2%
        '1H': 0.005     // ±0.5%
    };
    return variations[timeframe] || 0.001;
}

// Função para limpar o gráfico
function cleanupTradingViewChart() {
    console.log('Limpando TradingView Chart...');
    
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
    
    // Limpar séries de forma segura
    const seriesToRemove = [candleSeries, lineSeries, rsiSeries, smaSeries, emaSeries];
    seriesToRemove.forEach(series => {
        if (series && tradingViewChartInstance && typeof tradingViewChartInstance.removeSeries === 'function') {
            try {
                tradingViewChartInstance.removeSeries(series);
            } catch (e) {
                console.warn('Erro ao remover série durante limpeza:', e);
            }
        }
    });
    
    // Limpar variáveis
    candleSeries = null;
    lineSeries = null;
    rsiSeries = null;
    smaSeries = null;
    emaSeries = null;
    
    if (tradingViewChartInstance && typeof tradingViewChartInstance.remove === 'function') {
        try {
            tradingViewChartInstance.remove();
        } catch (e) {
            console.warn('Erro ao remover instância do gráfico:', e);
        }
        tradingViewChartInstance = null;
    }
    
    // Limpar ferramentas de desenho
    drawingTools.supportLines = [];
    drawingTools.resistanceLines = [];
    drawingTools.trendLines = [];
    
    // Não limpar o chartContainer aqui, pois pode ser reutilizado
    // chartContainer = null;
}

// Função para alternar entre candles e linha
function toggleTradingViewChartType(type) {
    if (!tradingViewChartInstance) {
        console.error('Gráfico não inicializado para alternar tipo');
        return false;
    }
    
    // Verificar se a instância tem os métodos necessários
    if (typeof tradingViewChartInstance.addCandlestickSeries !== 'function' || 
        typeof tradingViewChartInstance.addLineSeries !== 'function') {
        console.error('Métodos de série não disponíveis');
        return false;
    }
    
    try {
        // Preservar dados históricos existentes de ambas as séries
        let historicalData = [];
        
        // Tentar obter dados da série ativa
        if (candleSeries && typeof candleSeries.data === 'function') {
            try {
                historicalData = candleSeries.data();
            } catch (e) {
                console.warn('Erro ao obter dados históricos de candles:', e);
            }
        } else if (lineSeries && typeof lineSeries.data === 'function') {
            try {
                historicalData = lineSeries.data();
            } catch (e) {
                console.warn('Erro ao obter dados históricos de linha:', e);
            }
        }
        
        // Remover séries anteriores de forma segura
        if (candleSeries && tradingViewChartInstance && typeof tradingViewChartInstance.removeSeries === 'function') {
            try {
                tradingViewChartInstance.removeSeries(candleSeries);
            } catch (e) {
                console.warn('Erro ao remover série de candles:', e);
            }
            candleSeries = null;
        }
        
        if (lineSeries && tradingViewChartInstance && typeof tradingViewChartInstance.removeSeries === 'function') {
            try {
                tradingViewChartInstance.removeSeries(lineSeries);
            } catch (e) {
                console.warn('Erro ao remover série de linha:', e);
            }
            lineSeries = null;
        }
        
        if (type === 'candlestick') {
            // Criar série de candles
            candleSeries = tradingViewChartInstance.addCandlestickSeries({
                upColor: chartColors.candles.up,
                downColor: chartColors.candles.down,
                borderUpColor: chartColors.candles.border.up,
                borderDownColor: chartColors.candles.border.down,
                wickUpColor: chartColors.candles.up,
                wickDownColor: chartColors.candles.down
            });
            
            // Verificar se a série foi criada
            if (!candleSeries) {
                console.error('Falha ao criar série de candles');
                return false;
            }
        } else {
            // Criar série de linha
            lineSeries = tradingViewChartInstance.addLineSeries({
                color: '#F0B90B',
                lineWidth: 2,
                crosshairMarkerVisible: true,
                lastValueVisible: false
            });
            
            // Verificar se a série foi criada
            if (!lineSeries) {
                console.error('Falha ao criar série de linha');
                return false;
            }
        }
        
        // Recarregar dados com o tipo selecionado, preservando histórico
        const currentAsset = chartModalCurrentAsset || 'PETR4';
        const currentTimeframe = chartModalCurrentTimeframe || '1M';
        
        if (type === 'candlestick') {
            return loadOHLCData(currentAsset, currentTimeframe, historicalData);
        } else {
            // Para gráfico de linha, usar dados de fechamento
            return loadLineData(currentAsset, currentTimeframe, historicalData);
        }
        
    } catch (error) {
        console.error('Erro ao alternar tipo de gráfico:', error);
        return false;
    }
}

// Função para carregar dados de linha
function loadLineData(assetSymbol, timeframe, historicalData = []) {
    console.log(`Carregando dados de linha para ${assetSymbol} - ${timeframe}`);
    
    if (!tradingViewChartInstance) {
        console.error('Gráfico não inicializado');
        return false;
    }
    
    // Verificar se a instância tem os métodos necessários
    if (typeof tradingViewChartInstance.addLineSeries !== 'function') {
        console.error('Método addLineSeries não disponível');
        return false;
    }
    
    try {
        // Gerar dados OHLC primeiro
        let ohlcData = generateOHLCData(assetSymbol, timeframe);
        
        // Se temos dados históricos, mesclá-los com os novos dados
        if (historicalData && historicalData.length > 0) {
            // Filtrar dados históricos para o mesmo timeframe
            const filteredHistorical = historicalData.filter(d => {
                const dataTime = new Date(d.time * 1000);
                const now = new Date();
                const timeDiff = now.getTime() - dataTime.getTime();
                const maxAge = getTimeInterval(timeframe) * getDataPointsForTimeframe(timeframe);
                return timeDiff <= maxAge;
            });
            
            // Mesclar dados históricos com novos dados
            if (filteredHistorical.length > 0) {
                ohlcData = [...filteredHistorical, ...ohlcData];
                console.log(`Dados históricos preservados: ${filteredHistorical.length} pontos`);
            }
        }
        
        if (!ohlcData || ohlcData.length === 0) {
            console.error('Dados OHLC inválidos ou vazios');
            return false;
        }
        
        // Converter para dados de linha (usar preço de fechamento)
        const lineData = ohlcData.map(d => ({
            time: d.time,
            value: d.close
        }));
        
        // Limpar série anterior de forma segura
        if (lineSeries && tradingViewChartInstance && typeof tradingViewChartInstance.removeSeries === 'function') {
            try {
                tradingViewChartInstance.removeSeries(lineSeries);
            } catch (e) {
                console.warn('Erro ao remover série anterior:', e);
            }
        }
        
        // Criar série de linha
        lineSeries = tradingViewChartInstance.addLineSeries({
            color: '#F0B90B',
            lineWidth: 2,
            crosshairMarkerVisible: true,
            lastValueVisible: false
        });
        
        // Verificar se a série foi criada
        if (!lineSeries || typeof lineSeries.setData !== 'function') {
            console.error('Série de linha não foi criada corretamente');
            return false;
        }
        // Definir dados
        lineSeries.setData(lineData);
        
        // Ajustar escala para mostrar todos os dados
        if (typeof tradingViewChartInstance.timeScale === 'function') {
            tradingViewChartInstance.timeScale().fitContent();
        }
        
        console.log(`Dados de linha carregados: ${lineData.length} pontos`);
        return true;
        
    } catch (error) {
        console.error('Erro ao carregar dados de linha:', error);
        return false;
    }
}

// Handlers para eventos
function handleDrawingToolClick(e) {
    const tool = e.currentTarget.dataset.tool;
    
    if (tool === 'clear') {
        clearAllDrawings();
        return;
    }
    
    // Ativar ferramenta selecionada
    document.querySelectorAll('.drawing-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    currentTool = tool;
}

function handleIndicatorClick(e) {
    const indicator = e.currentTarget.dataset.indicator;
    
    // Toggle do indicador
    if (e.currentTarget.classList.contains('active')) {
        removeIndicator(indicator);
        e.currentTarget.classList.remove('active');
    } else {
        addIndicator(indicator);
        e.currentTarget.classList.add('active');
    }
}

// Adicionar indicador
function addIndicator(type) {
    if (!tradingViewChartInstance || !candleSeries) return;
    
    switch (type) {
        case 'rsi':
            addRSI();
            break;
        case 'sma':
            addSMA();
            break;
        case 'ema':
            addEMA();
            break;
    }
}

// Remover indicador
function removeIndicator(type) {
    switch (type) {
        case 'rsi':
            if (rsiSeries) {
                tradingViewChartInstance.removeSeries(rsiSeries);
                rsiSeries = null;
            }
            break;
        case 'sma':
            if (smaSeries) {
                tradingViewChartInstance.removeSeries(smaSeries);
                smaSeries = null;
            }
            break;
        case 'ema':
            if (emaSeries) {
                tradingViewChartInstance.removeSeries(emaSeries);
                emaSeries = null;
            }
            break;
    }
}

// Adicionar RSI
function addRSI() {
    if (!tradingViewChartInstance || !candleSeries) return;
    
    try {
        // Obter dados OHLC atuais
        const ohlcData = generateOHLCData(chartModalCurrentAsset || 'PETR4', chartModalCurrentTimeframe || '1M');
        
        if (!ohlcData || ohlcData.length < 14) {
            console.warn('Dados insuficientes para calcular RSI (mínimo 14 períodos)');
            return;
        }
        
        // Calcular RSI
        const rsiData = calculateRSI(ohlcData, 14);
        
        // Criar série RSI se não existir
        if (!rsiSeries) {
            rsiSeries = tradingViewChartInstance.addLineSeries({
                color: chartColors.indicators.rsi,
                lineWidth: 2,
                crosshairMarkerVisible: true,
                lastValueVisible: false,
                priceLineVisible: false,
                title: 'RSI (14)'
            });
        }
        
        // Definir dados RSI
        rsiSeries.setData(rsiData);
        
        console.log('RSI adicionado com sucesso');
        
    } catch (error) {
        console.error('Erro ao adicionar RSI:', error);
    }
}

// Adicionar SMA
function addSMA() {
    if (!tradingViewChartInstance || !candleSeries) return;
    
    try {
        // Obter dados OHLC atuais
        const ohlcData = generateOHLCData(chartModalCurrentAsset || 'PETR4', chartModalCurrentTimeframe || '1M');
        
        if (!ohlcData || ohlcData.length < 20) {
            console.warn('Dados insuficientes para calcular SMA (mínimo 20 períodos)');
            return;
        }
        
        // Calcular SMA
        const smaData = calculateSMA(ohlcData.map(d => d.close), 20);
        
        // Criar série SMA se não existir
        if (!smaSeries) {
            smaSeries = tradingViewChartInstance.addLineSeries({
                color: chartColors.indicators.sma,
                lineWidth: 2,
                crosshairMarkerVisible: true,
                lastValueVisible: false,
                priceLineVisible: false,
                title: 'SMA (20)'
            });
        }
        
        // Mapear dados para o formato correto
        const smaFormatted = smaData.map((value, index) => ({
            time: ohlcData[index + 19].time, // 20 períodos de atraso
            value: value
        }));
        
        // Definir dados SMA
        smaSeries.setData(smaFormatted);
        
        console.log('SMA (20) adicionada com sucesso');
        
    } catch (error) {
        console.error('Erro ao adicionar SMA:', error);
    }
}

// Adicionar EMA
function addEMA() {
    if (!tradingViewChartInstance || !candleSeries) return;
    
    try {
        // Obter dados OHLC atuais
        const ohlcData = generateOHLCData(chartModalCurrentAsset || 'PETR4', chartModalCurrentTimeframe || '1M');
        
        if (!ohlcData || ohlcData.length < 20) {
            console.warn('Dados insuficientes para calcular EMA (mínimo 20 períodos)');
            return;
        }
        
        // Calcular EMA
        const emaData = calculateEMA(ohlcData.map(d => d.close), 20);
        
        // Criar série EMA se não existir
        if (!emaSeries) {
            emaSeries = tradingViewChartInstance.addLineSeries({
                color: chartColors.indicators.ema,
                lineWidth: 2,
                crosshairMarkerVisible: true,
                lastValueVisible: false,
                priceLineVisible: false,
                title: 'EMA (20)'
            });
        }
        
        // Mapear dados para o formato correto
        const emaFormatted = emaData.map((value, index) => ({
            time: ohlcData[index + 19].time, // 20 períodos de atraso
            value: value
        }));
        
        // Definir dados EMA
        emaSeries.setData(emaFormatted);
        
        console.log('EMA (20) adicionada com sucesso');
        
    } catch (error) {
        console.error('Erro ao adicionar EMA:', error);
    }
}

// Limpar todos os desenhos
function clearAllDrawings() {
    // Remover todas as linhas do gráfico
    const allLines = [
        ...drawingTools.supportLines,
        ...drawingTools.resistanceLines,
        ...drawingTools.trendLines
    ];
    
    allLines.forEach(line => {
        if (line.series && tradingViewChartInstance) {
            try {
                tradingViewChartInstance.removeSeries(line.series);
            } catch (e) {
                console.warn('Erro ao remover linha:', e);
            }
        }
    });
    
    // Limpar arrays
    drawingTools.supportLines = [];
    drawingTools.resistanceLines = [];
    drawingTools.trendLines = [];
    
    console.log('Todos os desenhos foram limpos');
}

// ===== FUNÇÕES DE CÁLCULO DOS INDICADORES =====

// Calcular RSI (Relative Strength Index)
function calculateRSI(ohlcData, period = 14) {
    if (ohlcData.length < period + 1) return [];
    
    const gains = [];
    const losses = [];
    
    // Calcular ganhos e perdas
    for (let i = 1; i < ohlcData.length; i++) {
        const change = ohlcData[i].close - ohlcData[i - 1].close;
        gains.push(change > 0 ? change : 0);
        losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    // Calcular médias móveis dos ganhos e perdas
    const avgGain = calculateEMA(gains, period);
    const avgLoss = calculateEMA(losses, period);
    
    const rsiData = [];
    
    for (let i = 0; i < avgGain.length; i++) {
        if (avgLoss[i] === 0) {
            rsiData.push({
                time: ohlcData[i + period].time,
                value: 100
            });
        } else {
            const rs = avgGain[i] / avgLoss[i];
            const rsi = 100 - (100 / (1 + rs));
            rsiData.push({
                time: ohlcData[i + period].time,
                value: rsi
            });
        }
    }
    
    return rsiData;
}

// Calcular EMA (Exponential Moving Average)
function calculateEMA(data, period) {
    const ema = [];
    const multiplier = 2 / (period + 1);
    
    // Primeiro valor é SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
        sum += data[i];
    }
    ema.push(sum / period);
    
    // Calcular EMA para os demais valores
    for (let i = period; i < data.length; i++) {
        const currentEMA = (data[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier));
        ema.push(currentEMA);
    }
    
    return ema;
}

// Calcular SMA (Simple Moving Average)
function calculateSMA(data, period) {
    const sma = [];
    
    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j];
        }
        sma.push(sum / period);
    }
    
    return sma;
}

// Função para atualizações em tempo real
function updateTradingViewChartRealtime() {
    if (!tradingViewChartInstance || !candleSeries) return;
    
    try {
        // Obter dados atuais do ativo
        const currentAsset = chartModalCurrentAsset || 'PETR4';
        const currentTimeframe = chartModalCurrentTimeframe || '1M';
        
        // Gerar novo candle em tempo real
        const newCandle = generateRealtimeCandle(currentAsset, currentTimeframe);
        
        if (newCandle) {
            // Adicionar novo candle à série
            candleSeries.update(newCandle);
            
            // Atualizar indicadores se estiverem ativos
            updateIndicatorsRealtime();
            
            console.log('Gráfico atualizado em tempo real:', newCandle);
        }
        
    } catch (error) {
        console.error('Erro ao atualizar gráfico em tempo real:', error);
    }
}

// Gerar candle em tempo real
function generateRealtimeCandle(assetSymbol, timeframe) {
    const asset = chartModalAssetsData[assetSymbol];
    if (!asset) return null;
    
    const now = new Date();
    const brtOffset = -3 * 60;
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const brtNow = new Date(utcTime + (brtOffset * 60000));
    
    // Gerar variação realista baseada no timeframe
    const variation = getVariationForTimeframe(timeframe);
    const open = asset.price;
    const close = open * (1 + (Math.random() - 0.5) * variation);
    
    // Calcular high e low
    const range = Math.abs(close - open) * (1 + Math.random() * 0.5);
    const high = Math.max(open, close) + range * Math.random();
    const low = Math.min(open, close) - range * Math.random();
    
    // Gerar volume
    const baseVolume = 1000000;
    const volumeVariation = 0.3;
    const volume = baseVolume * (1 + (Math.random() - 0.5) * volumeVariation);
    
    return {
        time: Math.floor(brtNow.getTime() / 1000),
        open: open,
        high: high,
        low: low,
        close: close,
        volume: Math.floor(volume)
    };
}

// Atualizar indicadores em tempo real
function updateIndicatorsRealtime() {
    if (!tradingViewChartInstance) return;
    
    // Atualizar RSI se ativo
    if (rsiSeries) {
        const currentAsset = chartModalCurrentAsset || 'PETR4';
        const currentTimeframe = chartModalCurrentTimeframe || '1M';
        const ohlcData = generateOHLCData(currentAsset, currentTimeframe);
        if (ohlcData.length >= 14) {
            const rsiData = calculateRSI(ohlcData, 14);
            rsiSeries.setData(rsiData);
        }
    }
    
    // Atualizar SMA se ativo
    if (smaSeries) {
        const currentAsset = chartModalCurrentAsset || 'PETR4';
        const currentTimeframe = chartModalCurrentTimeframe || '1M';
        const ohlcData = generateOHLCData(currentAsset, currentTimeframe);
        if (ohlcData.length >= 20) {
            const smaData = calculateSMA(ohlcData.map(d => d.close), 20);
            const smaFormatted = smaData.map((value, index) => ({
                time: ohlcData[index + 19].time,
                value: value
            }));
            smaSeries.setData(smaFormatted);
        }
    }
    
    // Atualizar EMA se ativo
    if (emaSeries) {
        const currentAsset = chartModalCurrentAsset || 'PETR4';
        const currentTimeframe = chartModalCurrentTimeframe || '1M';
        const ohlcData = generateOHLCData(currentAsset, currentTimeframe);
        if (ohlcData.length >= 20) {
            const emaData = calculateEMA(ohlcData.map(d => d.close), 20);
            const emaFormatted = emaData.map((value, index) => ({
                time: ohlcData[index + 19].time,
                value: value
            }));
            emaSeries.setData(emaFormatted);
        }
    }
}

// Expor funções globalmente
window.initTradingViewChart = initTradingViewChart;
window.loadOHLCData = loadOHLCData;
window.loadLineData = loadLineData;
window.toggleTradingViewChartType = toggleTradingViewChartType;
window.cleanupTradingViewChart = cleanupTradingViewChart;
window.updateTradingViewChartRealtime = updateTradingViewChartRealtime;

// Verificar se a biblioteca foi carregada corretamente
if (typeof LightweightCharts === 'undefined') {
    console.warn('TradingView Lightweight Charts não foi carregado. Usando fallback Chart.js');
} else {
    console.log('TradingView Lightweight Charts carregado com sucesso!');
    console.log('Versão:', LightweightCharts.version || 'N/A');
}

console.log('chart-tradingview.js com análise técnica carregado com sucesso!');
