// ===== GRAFICO.JS - PÁGINA DEDICADA AO GRÁFICO DE ATIVOS =====

// Dados dos ativos (sincronizados com sistema.js)
const assetsData = {
    'PETR4': {
        name: 'Petróleo Brasileiro S.A.',
        price: 28.50,
        change: 3.50,
        changePercent: 14.00,
        logo: 'commons ativos/petro.svg'
    },
    'VALE3': {
        name: 'Vale S.A.',
        price: 72.30,
        change: 7.30,
        changePercent: 11.23,
        logo: 'commons ativos/vale-logo-1.svg'
    },
    'ITUB4': {
        name: 'Itaú Unibanco Holding S.A.',
        price: 31.20,
        change: 3.20,
        changePercent: 11.43,
        logo: 'commons ativos/itau.svg'
    },
    'BBDC4': {
        name: 'Banco Bradesco S.A.',
        price: 27.80,
        change: 13.80,
        changePercent: 98.57,
        logo: 'commons ativos/bradesco.svg'
    },
    'ABEV3': {
        name: 'Ambev S.A.',
        price: 14.25,
        change: 3.25,
        changePercent: 29.55,
        logo: 'commons ativos/Ambev_logo.svg'
    },
    'MGLU3': {
        name: 'Magazine Luiza S.A.',
        price: 3.45,
        change: -4.05,
        changePercent: -54.00,
        logo: 'commons ativos/magalu-logo.svg'
    },
    'BBAS3': {
        name: 'Banco do Brasil S.A.',
        price: 49.10,
        change: 14.10,
        changePercent: 40.29,
        logo: 'commons ativos/banco-do-brasil-seeklogo.svg'
    },
    'LREN3': {
        name: 'Lojas Renner S.A.',
        price: 18.30,
        change: -1.70,
        changePercent: -8.50,
        logo: 'commons ativos/lojasrenner.svg'
    },
    'WEGE3': {
        name: 'WEG S.A.',
        price: 37.85,
        change: 2.85,
        changePercent: 8.14,
        logo: 'commons ativos/wege3.svg'
    },
    'B3SA3': {
        name: 'B3 S.A. - Brasil, Bolsa, Balcão',
        price: 12.50,
        change: 1.50,
        changePercent: 13.64,
        logo: 'commons ativos/b3sa3.svg'
    },
    'COGN3': {
        name: 'Cogna Educação S.A.',
        price: 17.50,
        change: 1.50,
        changePercent: 9.38,
        logo: 'commons ativos/cogn3.svg'
    },
    'ITSA4': {
        name: 'Itaúsa S.A.',
        price: 9.10,
        change: 0.60,
        changePercent: 7.06,
        logo: 'commons ativos/itsa4.svg'
    }
};

// Variáveis globais
let currentAsset = 'PETR4';
let currentChartType = 'candlestick'; // Sempre candlestick
let currentTimeframe = '1M';
let tradingViewWidget = null;
let currentOrderType = 'buy';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando página de gráfico...');
    
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
    
    // Carregar gráfico inicial
    loadTradingViewChart();
    
    // Simular dados de saldo (mock)
    updateBalanceDisplay();
    
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
    assetsList.innerHTML = '';
    
    Object.keys(assetsData).forEach(symbol => {
        const asset = assetsData[symbol];
        const assetItem = document.createElement('div');
        assetItem.className = `asset-item ${symbol === currentAsset ? 'active' : ''}`;
        assetItem.onclick = () => selectAsset(symbol);
        
        const changeClass = asset.change >= 0 ? 'positive' : 'negative';
        const changeSign = asset.change >= 0 ? '+' : '';
        
        assetItem.innerHTML = `
            <img src="${asset.logo}" alt="${symbol}" class="asset-logo">
            <div class="asset-info">
                <div class="asset-symbol">${symbol}</div>
                <div class="asset-name">${asset.name}</div>
            </div>
            <div class="asset-price">
                <div class="price">R$ ${asset.price.toFixed(2)}</div>
                <div class="change ${changeClass}">${changeSign}${asset.change.toFixed(2)} (${changeSign}${asset.changePercent.toFixed(2)}%)</div>
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
    
    // Recarregar gráfico
    loadTradingViewChart();
}

function updateAssetDisplay(symbol) {
    const asset = assetsData[symbol];
    
    // Sincronizar com preços do sistema principal se disponível
    if (window.precos && window.precos[symbol]) {
        asset.price = window.precos[symbol];
        // Calcular variação baseada no preço anterior
        const previousPrice = asset.price - asset.change;
        asset.changePercent = (asset.change / previousPrice) * 100;
    }
    
    const changeClass = asset.change >= 0 ? 'positive' : 'negative';
    const changeSign = asset.change >= 0 ? '+' : '';
    
    // Atualizar logo e informações
    document.getElementById('selectedAssetLogo').src = asset.logo;
    document.getElementById('selectedAssetLogo').alt = symbol;
    document.getElementById('selectedAssetSymbol').textContent = symbol;
    document.getElementById('selectedAssetName').textContent = asset.name;
    document.getElementById('selectedAssetPrice').textContent = `R$ ${asset.price.toFixed(2)}`;
    document.getElementById('selectedAssetChange').textContent = `${changeSign}${asset.change.toFixed(2)} (${changeSign}${asset.changePercent.toFixed(2)}%)`;
    document.getElementById('selectedAssetChange').className = `change ${changeClass}`;
    
    // Atualizar também o painel de trading
    updateTradingPanelAsset(symbol);
    
    console.log('Display do ativo atualizado:', symbol, asset);
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
    
    // Recarregar gráfico
    loadTradingViewChart();
}

function loadTradingViewChart() {
    console.log('Carregando gráfico TradingView para:', currentAsset);
    
    // Limpar container primeiro
    const chartContainer = document.getElementById('tradingview-chart');
    chartContainer.innerHTML = '';
    
    // Verificar se TradingView está disponível
    if (typeof TradingView === 'undefined') {
        console.warn('TradingView não está disponível, usando gráfico mockado');
        createMockChart();
        return;
    }
    
    // Destruir widget anterior se existir
    if (tradingViewWidget && tradingViewWidget.remove) {
        try {
            tradingViewWidget.remove();
        } catch (e) {
            console.warn('Erro ao remover widget anterior:', e);
        }
    }
    
    // Configurações do widget
    const widgetConfig = {
        symbol: `BMFBOVESPA:${currentAsset}`, // Usando BMF Bovespa para ativos brasileiros
        interval: getTimeframeInterval(currentTimeframe),
        timezone: 'America/Sao_Paulo',
        theme: 'dark',
        style: 1, // Sempre candlestick
        locale: 'pt_BR',
        toolbar_bg: '#1e1e2f',
        enable_publishing: false,
        allow_symbol_change: false,
        container_id: 'tradingview-chart',
        // Configurações melhoradas para candlestick
        studies_overrides: {
            'volume.volume.color.0': '#ff4444',
            'volume.volume.color.1': '#00c851',
            'volume.volume.transparency': 70
        },
        overrides: {
            'paneProperties.background': '#1e1e2f',
            'paneProperties.vertGridProperties.color': '#3a3a50',
            'paneProperties.horzGridProperties.color': '#3a3a50',
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.textColor': '#e0e0e0',
            'mainSeriesProperties.candleStyle.upColor': '#00c851',
            'mainSeriesProperties.candleStyle.downColor': '#ff4444',
            'mainSeriesProperties.candleStyle.borderUpColor': '#00c851',
            'mainSeriesProperties.candleStyle.borderDownColor': '#ff4444',
            'mainSeriesProperties.candleStyle.wickUpColor': '#00c851',
            'mainSeriesProperties.candleStyle.wickDownColor': '#ff4444'
        },
        width: '100%',
        height: '100%',
        studies: [
            'SMA@tv-basicstudies',
            'EMA@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
        ],
        disabled_features: [
            'use_localstorage_for_settings',
            'volume_force_overlay',
            'create_volume_indicator_by_default'
        ],
        enabled_features: [
            'study_templates'
        ],
        overrides: {
            'paneProperties.background': '#1e1e2f',
            'paneProperties.vertGridProperties.color': '#2a2a3d',
            'paneProperties.horzGridProperties.color': '#2a2a3d',
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.textColor': '#ffffff'
        },
        loading_screen: {
            backgroundColor: '#1e1e2f',
            foregroundColor: '#F0B90B'
        }
    };
    
    // Criar widget com try-catch
    try {
        tradingViewWidget = new TradingView.widget(widgetConfig);
        
        // Fallback para dados mockados se TradingView falhar
        setTimeout(() => {
            if (!tradingViewWidget || !tradingViewWidget.chart) {
                console.warn('TradingView não carregou, usando gráfico mockado');
                createMockChart();
            }
        }, 3000);
    } catch (error) {
        console.error('Erro ao criar widget TradingView:', error);
        createMockChart();
    }
}

function getTimeframeInterval(timeframe) {
    const intervals = {
        '1M': '1',
        '5M': '5',
        '30M': '30',
        '1H': '60'
    };
    return intervals[timeframe] || '1';
}

function createMockChart() {
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
                <p>Gráfico de ${currentAsset}</p>
                <p style="font-size: 14px; margin-top: 10px;">Tipo: ${currentChartType} | Timeframe: ${currentTimeframe}</p>
            </div>
        </div>
    `;
}

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

// ===== ATUALIZAÇÃO DE PREÇOS EM TEMPO REAL (MOCK) =====

function updatePrices() {
    Object.keys(assetsData).forEach(symbol => {
        const asset = assetsData[symbol];
        const variation = (Math.random() - 0.5) * 0.02; // ±1% de variação
        asset.price += asset.price * variation;
        asset.change = (Math.random() - 0.5) * 0.5;
        asset.changePercent = (asset.change / asset.price) * 100;
    });
    
    // Atualizar display se necessário
    if (currentAsset) {
        updateAssetDisplay(currentAsset);
        renderAssetsList();
    }
}

// Atualizar preços a cada 10 segundos
setInterval(updatePrices, 10000);

console.log('grafico.js carregado com sucesso!');
