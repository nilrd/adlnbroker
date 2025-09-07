// ===== GRAFICO.JS - PÁGINA DEDICADA AO GRÁFICO DE ATIVOS =====

// Dados dos ativos (sincronizados com sistema.js)
let assetsData = {};

// Função para inicializar dados dos ativos sincronizados com o sistema principal
function initializeAssetsData() {
    // Obter preços do sistema principal
    const precosSistema = window.precos || {};
    
    // Preços de referência para cálculo de variação
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
    
    // Mapa de logos
    const logoMap = {
        'PETR4': 'commons ativos/petro.svg',
        'VALE3': 'commons ativos/vale-logo-1.svg',
        'ITUB4': 'commons ativos/itau.svg',
        'BBDC4': 'commons ativos/bradesco.svg',
        'ABEV3': 'commons ativos/Ambev_logo.svg',
        'MGLU3': 'commons ativos/magalu-logo.svg',
        'BBAS3': 'commons ativos/banco-do-brasil-seeklogo.svg',
        'LREN3': 'commons ativos/lojasrenner.svg',
        'WEGE3': 'commons ativos/wege3.svg',
        'B3SA3': 'commons ativos/b3sa3.svg',
        'COGN3': 'commons ativos/cogn3.svg',
        'ITSA4': 'commons ativos/itsa4.svg'
    };
    
    // Nomes dos ativos
    const assetNames = {
        'PETR4': 'Petróleo Brasileiro S.A.',
        'VALE3': 'Vale S.A.',
        'ITUB4': 'Itaú Unibanco Holding S.A.',
        'BBDC4': 'Banco Bradesco S.A.',
        'ABEV3': 'Ambev S.A.',
        'MGLU3': 'Magazine Luiza S.A.',
        'BBAS3': 'Banco do Brasil S.A.',
        'LREN3': 'Lojas Renner S.A.',
        'WEGE3': 'WEG S.A.',
        'B3SA3': 'B3 S.A. - Brasil, Bolsa, Balcão',
        'COGN3': 'Cogna Educação S.A.',
        'ITSA4': 'Itaúsa S.A.'
    };
    
    // Inicializar dados dos ativos
    Object.keys(assetNames).forEach(symbol => {
        const price = precosSistema[symbol] || 0;
        const basePrice = precosReferencia[symbol] || price;
        const change = price - basePrice;
        const changePercent = basePrice > 0 ? (change / basePrice) * 100 : 0;
        
        assetsData[symbol] = {
            name: assetNames[symbol],
            price: price,
            change: change,
            changePercent: changePercent,
            logo: logoMap[symbol] || 'favicon.png'
        };
    });
    
    console.log('Dados dos ativos inicializados:', assetsData);
}

// Sistema de Velas em Tempo Real
const RealtimeCandleSystem = {
    // Velas ativas por ativo e timeframe
    activeCandles: {},
    
    // Histórico de velas fechadas
    closedCandles: {},
    
    // Intervalos de atualização
    updateIntervals: {},
    
    // Inicializar sistema para um ativo/timeframe
    initialize(asset, timeframe) {
        const key = `${asset}_${timeframe}`;
        
        // Limpar intervalos anteriores
        if (this.updateIntervals[key]) {
            clearInterval(this.updateIntervals[key]);
        }
        
        // Inicializar estruturas de dados
        if (!this.activeCandles[key]) {
            this.activeCandles[key] = null;
        }
        if (!this.closedCandles[key]) {
            this.closedCandles[key] = [];
        }
        
        // Iniciar vela atual
        this.startNewCandle(asset, timeframe);
        
        // Configurar atualização em tempo real
        this.startRealtimeUpdates(asset, timeframe);
        
        console.log(`🕯️ Sistema de velas em tempo real inicializado: ${asset} - ${timeframe}`);
    },
    
    // Iniciar nova vela
    startNewCandle(asset, timeframe) {
        const key = `${asset}_${timeframe}`;
        const currentPrice = assetsData[asset]?.price || 0;
        const now = new Date();
        
        // Fechar vela anterior se existir
        if (this.activeCandles[key]) {
            this.closeCandle(asset, timeframe);
        }
        
        // Criar nova vela
        this.activeCandles[key] = {
            open: currentPrice,
            high: currentPrice,
            low: currentPrice,
            close: currentPrice,
            volume: 0,
            timestamp: now,
            timeframe: timeframe,
            asset: asset,
            isActive: true
        };
        
        console.log(`🕯️ Nova vela iniciada: ${asset} - Abertura: R$ ${currentPrice.toFixed(2)}`);
    },
    
    // Atualizar vela ativa com novo preço
    updateActiveCandle(asset, timeframe, newPrice) {
        const key = `${asset}_${timeframe}`;
        const candle = this.activeCandles[key];
        
        if (!candle || !candle.isActive) {
            return;
        }
        
        // Atualizar valores da vela
        candle.high = Math.max(candle.high, newPrice);
        candle.low = Math.min(candle.low, newPrice);
        candle.close = newPrice;
        candle.volume += 1; // Simular volume
        
        // Atualizar gráfico em tempo real
        this.updateChartRealtime(asset, timeframe, candle);
    },
    
    // Fechar vela atual
    closeCandle(asset, timeframe) {
        const key = `${asset}_${timeframe}`;
        const candle = this.activeCandles[key];
        
        if (!candle || !candle.isActive) {
            return;
        }
        
        // Marcar como fechada
        candle.isActive = false;
        candle.closeTime = new Date();
        
        // Adicionar ao histórico
        this.closedCandles[key].push({...candle});
        
        // Manter apenas últimas 100 velas no histórico
        if (this.closedCandles[key].length > 100) {
            this.closedCandles[key] = this.closedCandles[key].slice(-100);
        }
        
        console.log(`🕯️ Vela fechada: ${asset} - OHLC: ${candle.open.toFixed(2)}/${candle.high.toFixed(2)}/${candle.low.toFixed(2)}/${candle.close.toFixed(2)}`);
        
        // Limpar vela ativa
        this.activeCandles[key] = null;
    },
    
    // Verificar se deve fechar vela baseado no timeframe
    shouldCloseCandle(asset, timeframe) {
        const key = `${asset}_${timeframe}`;
        const candle = this.activeCandles[key];
        
        if (!candle || !candle.isActive) {
            return false;
        }
        
        const now = new Date();
        const candleStart = candle.timestamp;
        const intervalMs = this.getTimeframeIntervalMs(timeframe);
        
        return (now - candleStart) >= intervalMs;
    },
    
    // Obter intervalo em milissegundos
    getTimeframeIntervalMs(timeframe) {
        const intervals = {
            '1M': 60 * 1000,        // 1 minuto
            '5M': 5 * 60 * 1000,    // 5 minutos
            '30M': 30 * 60 * 1000,  // 30 minutos
            '1H': 60 * 60 * 1000    // 1 hora
        };
        return intervals[timeframe] || intervals['1M'];
    },
    
    // Iniciar atualizações em tempo real
    startRealtimeUpdates(asset, timeframe) {
        const key = `${asset}_${timeframe}`;
        
        // Atualizar a cada 2 segundos
        this.updateIntervals[key] = setInterval(() => {
            const currentPrice = assetsData[asset]?.price || 0;
            
            if (currentPrice > 0) {
                // Verificar se deve fechar vela
                if (this.shouldCloseCandle(asset, timeframe)) {
                    this.closeCandle(asset, timeframe);
                    this.startNewCandle(asset, timeframe);
                } else {
                    // Atualizar vela ativa
                    this.updateActiveCandle(asset, timeframe, currentPrice);
                }
            }
        }, 2000);
    },
    
    // Atualizar gráfico em tempo real
    updateChartRealtime(asset, timeframe, candle) {
        // Se TradingView estiver disponível, atualizar via API
        if (ChartController.widget && typeof ChartController.widget.chart === 'function') {
            try {
                // Converter para formato TradingView
                const tvCandle = {
                    time: Math.floor(candle.timestamp.getTime() / 1000),
                    open: candle.open,
                    high: candle.high,
                    low: candle.low,
                    close: candle.close,
                    volume: candle.volume
                };
                
                // Atualizar último candle no gráfico
                ChartController.widget.chart().executeActionById('drawing_toolbar');
                // Nota: TradingView não permite atualização direta de candles via API
                // O comportamento será simulado visualmente
                
            } catch (error) {
                console.warn('Erro ao atualizar gráfico TradingView:', error);
            }
        }
        
        // Atualizar display de informações da vela
        this.updateCandleInfoDisplay(asset, candle);
    },
    
    // Atualizar display de informações da vela
    updateCandleInfoDisplay(asset, candle) {
        const infoElement = document.getElementById('candle-info');
        if (infoElement) {
            const change = candle.close - candle.open;
            const changePercent = candle.open > 0 ? (change / candle.open) * 100 : 0;
            const changeColor = change >= 0 ? '#00c851' : '#ff4444';
            
            infoElement.innerHTML = `
                <div style="color: #F0B90B; font-weight: bold; margin-bottom: 10px;">
                    🕯️ Vela Ativa - ${asset}
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                    <div><strong>Abertura:</strong> <span style="color: #fff;">R$ ${candle.open.toFixed(2)}</span></div>
                    <div><strong>Máxima:</strong> <span style="color: #00c851;">R$ ${candle.high.toFixed(2)}</span></div>
                    <div><strong>Mínima:</strong> <span style="color: #ff4444;">R$ ${candle.low.toFixed(2)}</span></div>
                    <div><strong>Atual:</strong> <span style="color: ${changeColor};">R$ ${candle.close.toFixed(2)}</span></div>
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #888;">
                    Variação: <span style="color: ${changeColor};">${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)</span>
                </div>
            `;
        }
    },
    
    // Parar atualizações
    stop(asset, timeframe) {
        const key = `${asset}_${timeframe}`;
        
        if (this.updateIntervals[key]) {
            clearInterval(this.updateIntervals[key]);
            delete this.updateIntervals[key];
        }
        
        // Fechar vela ativa
        if (this.activeCandles[key]) {
            this.closeCandle(asset, timeframe);
        }
        
        console.log(`🕯️ Sistema de velas parado: ${asset} - ${timeframe}`);
    },
    
    // Obter dados da vela ativa
    getActiveCandle(asset, timeframe) {
        const key = `${asset}_${timeframe}`;
        return this.activeCandles[key];
    },
    
    // Obter histórico de velas
    getCandleHistory(asset, timeframe) {
        const key = `${asset}_${timeframe}`;
        return this.closedCandles[key] || [];
    }
};

// Namespace para evitar conflitos com chart-modal.js
const GraficoCompleto = {
    // Variáveis de controle
    currentAsset: 'PETR4',
    currentTimeframe: '1M',
    currentChartType: 'candlestick',
    tradingViewWidget: null,
    
    // Dados dos ativos
    assetsData: {},
    
    // Sistema de velas em tempo real
    candleSystem: RealtimeCandleSystem
};

// Variáveis globais (compatibilidade)
let currentAsset = 'PETR4';
let currentChartType = 'candlestick'; // Sempre candlestick
let currentTimeframe = '1M';
let tradingViewWidget = null;
let currentOrderType = 'buy';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando página de gráfico...');
    
    // Inicializar dados dos ativos primeiro
    initializeAssetsData();
    
    // Verificar se há parâmetro de ativo na URL
    const urlParams = new URLSearchParams(window.location.search);
    const assetParam = urlParams.get('asset');
    
    if (assetParam && assetsData[assetParam]) {
        currentAsset = assetParam;
        console.log('Ativo selecionado via URL:', currentAsset);
    }
    
    // Mostrar loading
    showLoading();
    
    // Inicializar componentes
    initializeAssetSelector();
    initializeChartControls();
    initializeTradingPanel();
    
    // Inicializar gráfico usando ChartController
    ChartController.initialize(currentAsset, currentTimeframe);
    
    // Simular dados de saldo (mock)
    updateBalanceDisplay();
    
    // Iniciar atualizações de preços
    startPriceUpdates();
    
    // Ocultar loading após carregamento
    setTimeout(() => {
        hideLoading();
    }, 2000);
});

// ===== FUNÇÕES DE INICIALIZAÇÃO =====

function initializeAssetSelector() {
    const assetsList = document.getElementById('assetsList');
    const searchInput = document.getElementById('assetSearch');
    
    // Renderizar lista de ativos
    renderAssetsList();
    
    // Event listener para busca
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterAssets(searchTerm);
    });
}

function renderAssetsList() {
    const assetsList = document.getElementById('assetsList');
    if (!assetsList) {
        console.warn('Elemento assetsList não encontrado');
        return;
    }
    
    assetsList.innerHTML = '';
    
    Object.keys(assetsData).forEach(symbol => {
        const asset = assetsData[symbol];
        if (!asset) return;
        
        const assetItem = document.createElement('div');
        assetItem.className = `asset-item ${symbol === currentAsset ? 'active' : ''}`;
        assetItem.onclick = () => selectAsset(symbol);
        
        const changeClass = (asset.change || 0) >= 0 ? 'positive' : 'negative';
        const changeSign = (asset.change || 0) >= 0 ? '+' : '';
        
        assetItem.innerHTML = `
            <img src="${asset.logo || 'favicon.png'}" alt="${symbol}" class="asset-logo">
            <div class="asset-info">
                <div class="asset-symbol">${symbol}</div>
                <div class="asset-name">${asset.name || 'Nome não disponível'}</div>
            </div>
            <div class="asset-price">
                <div class="price">R$ ${(asset.price || 0).toFixed(2)}</div>
                <div class="change ${changeClass}">${changeSign}${(asset.change || 0).toFixed(2)} (${changeSign}${(asset.changePercent || 0).toFixed(2)}%)</div>
            </div>
        `;
        
        assetsList.appendChild(assetItem);
    });
}

function filterAssets(searchTerm) {
    const assetItems = document.querySelectorAll('.asset-item');
    
    assetItems.forEach(item => {
        const symbol = item.querySelector('.asset-symbol').textContent;
        const name = item.querySelector('.asset-name').textContent;
        
        if (symbol.toLowerCase().includes(searchTerm) || name.toLowerCase().includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function initializeChartControls() {
    // Apenas controles de timeframe - tipo de gráfico fixo em candlestick
    
    // Timeframe controls
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const timeframe = this.getAttribute('data-timeframe');
            setTimeframe(timeframe);
        });
    });
}

function initializeTradingPanel() {
    // Tab controls
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            setOrderType(tab);
        });
    });
    
    // Form controls
    const quantityInput = document.getElementById('orderQuantity');
    const priceInput = document.getElementById('orderPrice');
    
    quantityInput.addEventListener('input', updateOrderTotal);
    priceInput.addEventListener('input', updateOrderTotal);
    
    // Send order button
    document.getElementById('sendOrderBtn').addEventListener('click', sendOrder);
    
    // Asset selector in trading panel
    document.getElementById('orderAsset').addEventListener('change', function() {
        const selectedAsset = this.value;
        updateTradingPanelAsset(selectedAsset);
    });
}

// ===== FUNÇÕES DE SELEÇÃO DE ATIVOS =====

function selectAsset(symbol) {
    console.log('Selecionando ativo:', symbol);
    
    // Atualizar ativo atual
    currentAsset = symbol;
    
    // Atualizar interface
    updateAssetDisplay(symbol);
    updateAssetSelector(symbol);
    updateTradingPanelAsset(symbol);
    
    // Atualizar apenas símbolo do gráfico (sem recarregar)
    ChartController.updateSymbol(symbol);
}

function updateAssetDisplay(symbol) {
    if (!assetsData[symbol]) {
        console.warn('Ativo não encontrado:', symbol);
        return;
    }
    
    const asset = assetsData[symbol];
    
    // Sincronizar com preços do sistema principal se disponível
    if (window.precos && window.precos[symbol]) {
        const newPrice = window.precos[symbol];
        const oldPrice = asset.price;
        asset.price = newPrice;
        
        // Recalcular variação baseada no preço de referência
        const precosReferencia = {
            'PETR4': 25.00, 'VALE3': 65.00, 'ITUB4': 28.00, 'BBDC4': 14.00,
            'ABEV3': 11.00, 'MGLU3': 7.50, 'BBAS3': 35.00, 'LREN3': 20.00,
            'WEGE3': 35.00, 'B3SA3': 11.00, 'COGN3': 16.00, 'ITSA4': 8.50
        };
        
        const basePrice = precosReferencia[symbol] || oldPrice;
        asset.change = newPrice - basePrice;
        asset.changePercent = basePrice > 0 ? (asset.change / basePrice) * 100 : 0;
    }
    
    const changeClass = asset.change >= 0 ? 'positive' : 'negative';
    const changeSign = asset.change >= 0 ? '+' : '';
    
    // Atualizar logo e informações com validação
    const logoElement = document.getElementById('selectedAssetLogo');
    const symbolElement = document.getElementById('selectedAssetSymbol');
    const nameElement = document.getElementById('selectedAssetName');
    const priceElement = document.getElementById('selectedAssetPrice');
    const changeElement = document.getElementById('selectedAssetChange');
    
    if (logoElement) logoElement.src = asset.logo;
    if (logoElement) logoElement.alt = symbol;
    if (symbolElement) symbolElement.textContent = symbol;
    if (nameElement) nameElement.textContent = asset.name;
    if (priceElement) priceElement.textContent = `R$ ${(asset.price || 0).toFixed(2)}`;
    if (changeElement) {
        changeElement.textContent = `${changeSign}${(asset.change || 0).toFixed(2)} (${changeSign}${(asset.changePercent || 0).toFixed(2)}%)`;
        changeElement.className = `change ${changeClass}`;
    }
    
    // Atualizar também o painel de trading
    updateTradingPanelAsset(symbol);
    
    console.log('Display do ativo atualizado:', symbol, asset);
}

// Função para atualizar apenas informações do ativo (sem recarregar gráfico)
function updateAssetInfoOnly(symbol) {
    if (!assetsData[symbol]) {
        console.warn('Ativo não encontrado:', symbol);
        return;
    }
    
    const asset = assetsData[symbol];
    const changeClass = asset.change >= 0 ? 'positive' : 'negative';
    const changeSign = asset.change >= 0 ? '+' : '';
    
    // Atualizar apenas preço e variação (sem recarregar gráfico)
    const priceElement = document.getElementById('selectedAssetPrice');
    const changeElement = document.getElementById('selectedAssetChange');
    
    if (priceElement) priceElement.textContent = `R$ ${(asset.price || 0).toFixed(2)}`;
    if (changeElement) {
        changeElement.textContent = `${changeSign}${(asset.change || 0).toFixed(2)} (${changeSign}${(asset.changePercent || 0).toFixed(2)}%)`;
        changeElement.className = `change ${changeClass}`;
    }
    
    // Atualizar painel de trading sem recarregar gráfico
    updateTradingPanelAssetInfoOnly(symbol);
}

function updateAssetSelector(symbol) {
    // Remover classe active de todos os itens
    document.querySelectorAll('.asset-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adicionar classe active ao item selecionado
    const selectedItem = document.querySelector(`.asset-item .asset-symbol`);
    if (selectedItem && selectedItem.textContent === symbol) {
        selectedItem.closest('.asset-item').classList.add('active');
    }
}

function updateTradingPanelAsset(symbol) {
    const asset = assetsData[symbol];
    document.getElementById('orderAsset').value = symbol;
    document.getElementById('currentPriceHint').textContent = `R$ ${asset.price.toFixed(2)}`;
    document.getElementById('orderPrice').value = asset.price.toFixed(2);
    updateOrderTotal();
}

// Função para atualizar apenas informações do painel de trading (sem recarregar gráfico)
function updateTradingPanelAssetInfoOnly(symbol) {
    const asset = assetsData[symbol];
    if (!asset) return;
    
    // Atualizar apenas preço atual no hint
    const priceHint = document.getElementById('currentPriceHint');
    if (priceHint) {
        priceHint.textContent = `R$ ${asset.price.toFixed(2)}`;
    }
    
    // Atualizar total da ordem se necessário
    updateOrderTotal();
}

// ===== FUNÇÕES DE CONTROLE DO GRÁFICO =====

// Função setChartType removida - sempre candlestick

function setTimeframe(timeframe) {
    console.log('Alterando timeframe para:', timeframe);
    currentTimeframe = timeframe;
    
    // Atualizar botões
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-timeframe="${timeframe}"]`).classList.add('active');
    
    // Atualizar apenas timeframe do gráfico (sem recarregar)
    ChartController.updateTimeframe(timeframe);
}

// Funções antigas removidas - agora usando ChartController

function getTimeframeInterval(timeframe) {
    const intervals = {
        '1M': '1',
        '5M': '5',
        '30M': '30',
        '1H': '60'
    };
    return intervals[timeframe] || '1';
}

// Função createMockChart removida - agora no ChartController

// ===== FUNÇÕES DO PAINEL DE TRADING =====

function setOrderType(type) {
    console.log('Alterando tipo de ordem para:', type);
    currentOrderType = type;
    
    // Atualizar botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${type}"]`).classList.add('active');
    
    // Atualizar cor do botão de envio
    const sendBtn = document.getElementById('sendOrderBtn');
    if (type === 'buy') {
        sendBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
    } else {
        sendBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
    }
}

function updateOrderTotal() {
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 0;
    const price = parseFloat(document.getElementById('orderPrice').value) || 0;
    const total = quantity * 100 * price; // 100 ações por lote
    
    document.getElementById('orderTotal').textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    // Validar ordem
    validateOrder();
}

function validateOrder() {
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 0;
    const price = parseFloat(document.getElementById('orderPrice').value) || 0;
    const sendBtn = document.getElementById('sendOrderBtn');
    
    let isValid = true;
    let errorMessage = '';
    
    // RN-003: Validação de quantidade - múltiplos de 100 obrigatórios
    if (quantity < 1) {
        isValid = false;
        errorMessage = 'Quantidade mínima: 1 lote';
    }
    
    // RN-003: Validação de preço - limites absolutos
    if (price < 0.10 || price > 1000.00) {
        isValid = false;
        errorMessage = 'Preço deve estar entre R$ 0,10 e R$ 1.000,00';
    }
    
    // RN-004/005: Validação de saldo/posição (mock)
    if (currentOrderType === 'buy') {
        const total = quantity * 100 * price;
        const balance = 100000; // Mock
        if (total > balance) {
            isValid = false;
            errorMessage = 'Saldo insuficiente';
        }
    }
    
    // Atualizar estado do botão
    sendBtn.disabled = !isValid;
    sendBtn.title = errorMessage;
}

// ===== REGRAS DE NEGÓCIO IMPLEMENTADAS =====

// RN-011: Timer de Abertura e Fechamento da Bolsa
function isMarketOpen() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    
    // Verificar se é dia útil (Segunda a Sexta)
    if (day === 0 || day === 6) {
        return false;
    }
    
    // Verificar horário (10h00 às 18h00)
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 100 + minute;
    
    return currentTime >= 1000 && currentTime <= 1800;
}

function getMarketStatus() {
    if (isMarketOpen()) {
        return {
            open: true,
            message: 'Mercado Aberto',
            nextOpen: null
        };
    } else {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        
        return {
            open: false,
            message: 'Mercado Fechado',
            nextOpen: tomorrow
        };
    }
}

// RN-003: Validação de Boleta de Compra e Venda
function validateOrderAdvanced(quantity, price, asset, orderType) {
    const errors = [];
    
    // Validação de quantidade - múltiplos de 100 obrigatórios
    if (quantity < 1) {
        errors.push('Quantidade mínima: 1 lote');
    } else if (quantity % 1 !== 0) {
        errors.push('Quantidade deve ser um número inteiro');
    }
    
    // Validação de preço - limites absolutos
    if (price < 0.10) {
        errors.push('Preço mínimo: R$ 0,10');
    } else if (price > 1000.00) {
        errors.push('Preço máximo: R$ 1.000,00');
    }
    
    // Validação de diferença de preço
    const currentPrice = assetsData[asset].price;
    const priceDifference = Math.abs(price - currentPrice);
    const priceDifferencePercent = (priceDifference / currentPrice) * 100;
    
    if (priceDifferencePercent > 2) {
        errors.push('Diferença de preço muito alta (>2%). Verifique os campos e tente novamente.');
    }
    
    // RN-004: Validação de saldo para compra
    if (orderType === 'buy') {
        const total = quantity * 100 * price;
        const balance = 100000; // Mock - em produção viria do sistema
        
        if (total > balance) {
            errors.push('Saldo insuficiente para realizar a compra.');
        }
    }
    
    // RN-005: Validação de ativos para venda
    if (orderType === 'sell') {
        const totalQuantity = quantity * 100;
        const availableQuantity = 1000; // Mock - em produção viria da carteira
        
        if (totalQuantity > availableQuantity) {
            errors.push('Você não possui ativos suficientes para realizar a venda.');
        }
    }
    
    // RN-011: Verificar se mercado está aberto
    if (!isMarketOpen()) {
        const status = getMarketStatus();
        errors.push(`Mercado fechado. Tente novamente no próximo pregão. Próxima abertura: ${status.nextOpen.toLocaleString('pt-BR')}`);
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        orderStatus: getOrderStatus(priceDifferencePercent)
    };
}

// Determinar status da ordem baseado na diferença de preço
function getOrderStatus(priceDifferencePercent) {
    if (priceDifferencePercent === 0) {
        return 'executada'; // Igual à cotação
    } else if (priceDifferencePercent <= 0.5) {
        return 'executada'; // Diferença ≤ 0.5%
    } else if (priceDifferencePercent <= 2) {
        return 'aceita'; // Diferença ≤ 2% (pendente)
    } else {
        return 'rejeitada'; // Diferença > 2%
    }
}

function sendOrder() {
    const asset = document.getElementById('orderAsset').value;
    const quantity = parseInt(document.getElementById('orderQuantity').value);
    const price = parseFloat(document.getElementById('orderPrice').value);
    const total = quantity * 100 * price;
    
    console.log('Enviando ordem:', {
        type: currentOrderType,
        asset: asset,
        quantity: quantity,
        price: price,
        total: total
    });
    
    // Validar ordem usando as regras de negócio avançadas
    const validation = validateOrderAdvanced(quantity, price, asset, currentOrderType);
    
    if (!validation.isValid) {
        // Mostrar modal de erro
        showErrorModal(validation.errors);
        return;
    }
    
    // Simular envio da ordem
    showSuccessModal({
        type: currentOrderType === 'buy' ? 'Compra' : 'Venda',
        asset: asset,
        quantity: quantity * 100,
        price: price,
        total: total,
        status: validation.orderStatus
    });
    
    // Resetar formulário
    document.getElementById('orderQuantity').value = 1;
    document.getElementById('orderPrice').value = assetsData[asset].price.toFixed(2);
    updateOrderTotal();
}

// ===== FUNÇÕES AUXILIARES =====

function updateBalanceDisplay() {
    // Mock - em produção viria do sistema
    const balance = 100000;
    document.getElementById('availableBalance').textContent = `R$ ${balance.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showSuccessModal(orderDetails) {
    const modal = document.getElementById('successModal');
    const detailsElement = document.getElementById('orderDetails');
    
    let statusText = '';
    if (orderDetails.status === 'executada') {
        statusText = '<br><span style="color: #4caf50; font-weight: bold;">✓ Ordem Executada</span>';
    } else if (orderDetails.status === 'aceita') {
        statusText = '<br><span style="color: #FF9800; font-weight: bold;">⏳ Ordem Aceita (Pendente)</span>';
    }
    
    detailsElement.innerHTML = `
        <strong>${orderDetails.type}</strong> de <strong>${orderDetails.quantity.toLocaleString('pt-BR')} ações</strong> de <strong>${orderDetails.asset}</strong><br>
        Preço: <strong>R$ ${orderDetails.price.toFixed(2)}</strong><br>
        Total: <strong>R$ ${orderDetails.total.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>${statusText}
    `;
    
    modal.style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// ===== FUNÇÕES DE INTEGRAÇÃO COM DASHBOARD =====

// Função para receber ativo selecionado do dashboard
function openWithAsset(symbol) {
    if (assetsData[symbol]) {
        selectAsset(symbol);
    }
}

// Expor função globalmente para integração
window.openWithAsset = openWithAsset;
window.closeSuccessModal = closeSuccessModal;

// ===== SISTEMA DE GRÁFICO OTIMIZADO E ESTÁVEL =====

let priceUpdateInterval = null;
let chartInitialized = false;
let chartReloadCount = 0;

// Sistema de controle de recarregamentos
const ChartController = {
    isInitialized: false,
    currentSymbol: null,
    currentTimeframe: null,
    widget: null,
    
    // Inicializar gráfico apenas uma vez
    initialize(symbol, timeframe) {
        if (this.isInitialized && this.currentSymbol === symbol && this.currentTimeframe === timeframe) {
            console.log('Gráfico já inicializado para este símbolo/timeframe');
            return;
        }
        
        console.log(`🎯 Inicializando gráfico: ${symbol} - ${timeframe}`);
        this.currentSymbol = symbol;
        this.currentTimeframe = timeframe;
        this.isInitialized = true;
        
        // Inicializar sistema de velas em tempo real
        RealtimeCandleSystem.initialize(symbol, timeframe);
        
        this.createWidget();
    },
    
    // Criar widget TradingView
    createWidget() {
        const chartContainer = document.getElementById('tradingview-chart');
        if (!chartContainer) {
            console.error('Container do gráfico não encontrado');
            return;
        }
        
        // Limpar container
        chartContainer.innerHTML = '';
        
        // Verificar se TradingView está disponível
        if (typeof TradingView === 'undefined') {
            console.warn('TradingView não disponível, usando gráfico mockado');
            this.createMockChart();
            return;
        }
        
        // Destruir widget anterior se existir
        if (this.widget && typeof this.widget.remove === 'function') {
            try {
                this.widget.remove();
            } catch (e) {
                console.warn('Erro ao remover widget anterior:', e);
            }
        }
        
        // Configuração otimizada do widget
        const widgetConfig = {
            symbol: `BMFBOVESPA:${this.currentSymbol}`,
            interval: getTimeframeInterval(this.currentTimeframe),
            timezone: 'America/Sao_Paulo',
            theme: 'dark',
            style: 1, // Sempre candlestick
            locale: 'pt_BR',
            toolbar_bg: '#1e1e2f',
            enable_publishing: false,
            allow_symbol_change: false,
            container_id: 'tradingview-chart',
            width: '100%',
            height: '100%',
            autosize: true,
            overrides: {
                'paneProperties.background': '#1e1e2f',
                'paneProperties.vertGridProperties.color': '#2a2a3d',
                'paneProperties.horzGridProperties.color': '#2a2a3d',
                'symbolWatermarkProperties.transparency': 90,
                'scalesProperties.textColor': '#ffffff',
                'mainSeriesProperties.candleStyle.upColor': '#00c851',
                'mainSeriesProperties.candleStyle.downColor': '#ff4444',
                'mainSeriesProperties.candleStyle.borderUpColor': '#00c851',
                'mainSeriesProperties.candleStyle.borderDownColor': '#ff4444',
                'mainSeriesProperties.candleStyle.wickUpColor': '#00c851',
                'mainSeriesProperties.candleStyle.wickDownColor': '#ff4444'
            },
            disabled_features: [
                'use_localstorage_for_settings',
                'volume_force_overlay',
                'create_volume_indicator_by_default',
                'header_symbol_search',
                'header_compare',
                'header_screenshot',
                'header_widget_dom_node'
            ],
            enabled_features: [
                'study_templates'
            ],
            loading_screen: {
                backgroundColor: '#1e1e2f',
                foregroundColor: '#F0B90B'
            }
        };
        
        try {
            this.widget = new TradingView.widget(widgetConfig);
            chartReloadCount++;
            console.log(`✅ Widget TradingView criado (Recarregamento #${chartReloadCount})`);
            
            // Fallback para gráfico mockado se TradingView falhar
            setTimeout(() => {
                if (!this.widget) {
                    console.warn('TradingView não carregou, usando gráfico mockado');
                    this.createMockChart();
                }
            }, 5000);
        } catch (error) {
            console.error('Erro ao criar widget TradingView:', error);
            this.createMockChart();
        }
    },
    
    // Atualizar apenas símbolo (sem recarregar)
    updateSymbol(symbol) {
        if (this.widget && typeof this.widget.chart === 'function' && this.currentSymbol !== symbol) {
            try {
                console.log(`🔄 Atualizando símbolo: ${this.currentSymbol} → ${symbol}`);
                
                // Parar sistema de velas do ativo anterior
                if (this.currentSymbol) {
                    RealtimeCandleSystem.stop(this.currentSymbol, this.currentTimeframe);
                }
                
                this.widget.chart().setSymbol(`BMFBOVESPA:${symbol}`, () => {
                    console.log('✅ Símbolo atualizado com sucesso');
                    this.currentSymbol = symbol;
                    
                    // Inicializar sistema de velas para novo ativo
                    RealtimeCandleSystem.initialize(symbol, this.currentTimeframe);
                });
            } catch (e) {
                console.warn('Erro ao atualizar símbolo, recriando widget:', e);
                this.initialize(symbol, this.currentTimeframe);
            }
        }
    },
    
    // Atualizar apenas timeframe (sem recarregar)
    updateTimeframe(timeframe) {
        if (this.widget && typeof this.widget.chart === 'function' && this.currentTimeframe !== timeframe) {
            try {
                console.log(`🔄 Atualizando timeframe: ${this.currentTimeframe} → ${timeframe}`);
                
                // Parar sistema de velas do timeframe anterior
                if (this.currentSymbol && this.currentTimeframe) {
                    RealtimeCandleSystem.stop(this.currentSymbol, this.currentTimeframe);
                }
                
                const interval = getTimeframeInterval(timeframe);
                this.widget.chart().setResolution(interval, () => {
                    console.log('✅ Timeframe atualizado com sucesso');
                    this.currentTimeframe = timeframe;
                    
                    // Inicializar sistema de velas para novo timeframe
                    if (this.currentSymbol) {
                        RealtimeCandleSystem.initialize(this.currentSymbol, timeframe);
                    }
                });
            } catch (e) {
                console.warn('Erro ao atualizar timeframe, recriando widget:', e);
                this.initialize(this.currentSymbol, timeframe);
            }
        }
    },
    
    // Criar gráfico mockado
    createMockChart() {
        const chartContainer = document.getElementById('tradingview-chart');
        chartContainer.innerHTML = `
            <div style="
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(30, 30, 47, 0.8);
                border-radius: 8px;
                color: #888;
                font-size: 16px;
            ">
                <div style="text-align: center;">
                    <i class="fa-solid fa-chart-candlestick" style="font-size: 48px; margin-bottom: 20px; color: #F0B90B;"></i>
                    <p>Gráfico de ${this.currentSymbol}</p>
                    <p style="font-size: 14px; margin-top: 10px;">Timeframe: ${this.currentTimeframe}</p>
                    <p style="font-size: 12px; margin-top: 10px; color: #666;">TradingView não disponível</p>
                </div>
            </div>
        `;
    },
    
    // Destruir widget
    destroy() {
        // Parar sistema de velas em tempo real
        if (this.currentSymbol && this.currentTimeframe) {
            RealtimeCandleSystem.stop(this.currentSymbol, this.currentTimeframe);
        }
        
        if (this.widget && typeof this.widget.remove === 'function') {
            try {
                this.widget.remove();
                this.widget = null;
                this.isInitialized = false;
                console.log('Widget TradingView destruído');
            } catch (e) {
                console.warn('Erro ao destruir widget:', e);
            }
        }
    }
};

// Função para atualizar preços (sem afetar gráfico)
function updatePrices() {
    if (!assetsData || Object.keys(assetsData).length === 0) {
        console.warn('Dados dos ativos não inicializados');
        return;
    }
    
    Object.keys(assetsData).forEach(symbol => {
        const asset = assetsData[symbol];
        if (!asset) return;
        
        // Sincronizar com preços do sistema principal se disponível
        if (window.precos && window.precos[symbol]) {
            const newPrice = window.precos[symbol];
            if (newPrice !== asset.price) {
                asset.price = newPrice;
                
                // Recalcular variação
                const precosReferencia = {
                    'PETR4': 25.00, 'VALE3': 65.00, 'ITUB4': 28.00, 'BBDC4': 14.00,
                    'ABEV3': 11.00, 'MGLU3': 7.50, 'BBAS3': 35.00, 'LREN3': 20.00,
                    'WEGE3': 35.00, 'B3SA3': 11.00, 'COGN3': 16.00, 'ITSA4': 8.50
                };
                
                const basePrice = precosReferencia[symbol] || asset.price;
                asset.change = newPrice - basePrice;
                asset.changePercent = basePrice > 0 ? (asset.change / basePrice) * 100 : 0;
            }
        }
    });
    
    // Atualizar apenas informações (SEM recarregar gráfico)
    if (currentAsset && assetsData[currentAsset]) {
        updateAssetInfoOnly(currentAsset);
        renderAssetsList();
    }
}

// Iniciar atualização de preços
function startPriceUpdates() {
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
    }
    
    priceUpdateInterval = setInterval(updatePrices, 10000); // A cada 10 segundos
}

// Parar atualização de preços
function stopPriceUpdates() {
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
        priceUpdateInterval = null;
    }
}

// Funções de debug
window.getChartReloadCount = () => chartReloadCount;
window.resetChartReloadCount = () => { chartReloadCount = 0; };
window.getChartControllerStatus = () => ({
    isInitialized: ChartController.isInitialized,
    currentSymbol: ChartController.currentSymbol,
    currentTimeframe: ChartController.currentTimeframe,
    reloadCount: chartReloadCount
});

// Expor namespace para evitar conflitos
window.GraficoCompleto = GraficoCompleto;

// Expor sistema de velas para debug
window.RealtimeCandleSystem = RealtimeCandleSystem;

// Funções de debug para sistema de velas
window.getActiveCandle = (asset, timeframe) => {
    return RealtimeCandleSystem.getActiveCandle(asset || currentAsset, timeframe || currentTimeframe);
};

window.getCandleHistory = (asset, timeframe) => {
    return RealtimeCandleSystem.getCandleHistory(asset || currentAsset, timeframe || currentTimeframe);
};

window.forceNewCandle = (asset, timeframe) => {
    RealtimeCandleSystem.closeCandle(asset || currentAsset, timeframe || currentTimeframe);
    RealtimeCandleSystem.startNewCandle(asset || currentAsset, timeframe || currentTimeframe);
    console.log('🕯️ Nova vela forçada');
};

// Limpar recursos quando a página for fechada
window.addEventListener('beforeunload', function() {
    stopPriceUpdates();
    ChartController.destroy();
});

console.log('grafico.js carregado com sucesso!');
