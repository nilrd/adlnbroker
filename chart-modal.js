// ===== CHART-MODAL.JS - MODAL DO GRÁFICO DE ATIVOS =====

// Dados dos ativos (sincronizados EXCLUSIVAMENTE com Price Engine Central)
let chartModalAssetsData = {};

// Widget TradingView do modal (independente do gráfico completo)
let chartModalTradingViewWidget = null;

// Namespace para evitar conflitos com grafico.js
const ChartModal = {
    // Dados dos ativos (independentes do gráfico completo)
    assetsData: {},
    
    // Widget TradingView do modal (independente do gráfico completo)
    tradingViewWidget: null,
    
    // Variáveis de controle
    currentAsset: 'PETR4',
    currentTimeframe: '1M',
    currentChartType: 'candlestick'
};

// Função para sincronizar dados dos ativos com o sistema principal (independente)
function syncChartModalAssetsData() {
    // Obter preços do sistema principal (window.precos)
    const precosSistema = window.precos || {};
    
    // Preços de referência para cálculo de variação
    const precosReferencia = {
        'PETR4': 25.00, 'VALE3': 65.00, 'ITUB4': 28.00, 'BBDC4': 14.00,
        'ABEV3': 11.00, 'MGLU3': 7.50, 'BBAS3': 35.00, 'LREN3': 20.00,
        'WEGE3': 35.00, 'B3SA3': 11.00, 'COGN3': 16.00, 'ITSA4': 8.50
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
    
    // Sincronizar dados dos ativos
    Object.keys(assetNames).forEach(symbol => {
        const price = precosSistema[symbol] || 0;
        const basePrice = precosReferencia[symbol] || price;
        const change = price - basePrice;
        const changePercent = basePrice > 0 ? (change / basePrice) * 100 : 0;
        
        // Usar namespace para evitar conflitos
        ChartModal.assetsData[symbol] = {
            name: assetNames[symbol],
            price: price,
            change: change,
            changePercent: changePercent,
            logo: logoMap[symbol] || 'favicon.png'
        };
        
        // Manter compatibilidade com código existente
        chartModalAssetsData[symbol] = ChartModal.assetsData[symbol];
    });
    
    console.log('Dados do modal sincronizados com sistema principal (namespace ChartModal)');
}

// Função crítica para atualizar dados do gráfico em tempo real
// Flag para evitar recursão infinita
let isUpdatingChartData = false;

function updateChartModalChartData() {
    if (!chartModalCurrentAsset || isUpdatingChartData) return;
    
    isUpdatingChartData = true;
    
    try {
        // Verificar se os preços estão sincronizados
        const currentAsset = chartModalAssetsData[chartModalCurrentAsset];
        const systemPrice = window.precos ? window.precos[chartModalCurrentAsset] : null;
        
        if (currentAsset && systemPrice && Math.abs(currentAsset.price - systemPrice) > 0.05) {
            console.warn(`Desincronização detectada para ${chartModalCurrentAsset}: Chart=${currentAsset.price}, Sistema=${systemPrice}`);
            
            // NÃO chamar syncChartModalAssetsData() aqui para evitar recursão
            // Apenas atualizar o preço local
            currentAsset.price = systemPrice;
            
            // Atualizar interface
            updateChartModalAssetDisplay(chartModalCurrentAsset);
            renderChartModalAssetsList();
            
            // Atualizar gráfico se TradingView estiver disponível
            if (typeof updateTradingViewChartRealtime === 'function') {
                updateTradingViewChartRealtime();
            }
        }
        
        // Sincronizar dados no sistema centralizado se estiver disponível
        if (currentAsset && window.DataSyncSystem && window.DataSyncSystem.isReady()) {
            window.DataSyncSystem.updateData(chartModalCurrentAsset, {
                listPrice: currentAsset.price,
                lastUpdate: Date.now(),
                assetInfo: currentAsset
            });
        }
        
        // Log de verificação
        console.log(`Verificação de sincronização: ${chartModalCurrentAsset} = R$ ${currentAsset?.price?.toFixed(2)}`);
        
    } catch (error) {
        console.error('Erro ao verificar sincronização:', error);
    } finally {
        isUpdatingChartData = false;
    }
}

// Função para obter tempo BRT atual (Brasília Time)
function getCurrentBRTTime() {
    const now = new Date();
    const brtOffset = -3 * 60; // -3 horas em minutos
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const brtTime = new Date(utcTime + (brtOffset * 60000));
    return brtTime;
}

// Função para verificar sincronização de tempo
function verifyTimeSynchronization() {
    try {
        const brtTime = getCurrentBRTTime();
        const systemTime = new Date();
        
        // Verificar se o tempo está dentro de uma margem aceitável (5 segundos)
        const timeDiff = Math.abs(brtTime.getTime() - systemTime.getTime());
        
        if (timeDiff > 5000) {
            console.warn(`Desincronização de tempo detectada: BRT=${brtTime.toLocaleString('pt-BR')}, Sistema=${systemTime.toLocaleString('pt-BR')}`);
        }
        
        // Log de verificação de tempo
        console.log(`Tempo BRT atual: ${brtTime.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
        
        return brtTime;
        
    } catch (error) {
        console.error('Erro ao verificar sincronização de tempo:', error);
        return new Date();
    }
}

// Função para obter nome do ativo
function getAssetName(symbol) {
    const names = {
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
    return names[symbol] || symbol;
}

// Função para obter logo do ativo
function getAssetLogo(symbol) {
    const logos = {
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
    return logos[symbol] || 'favicon.png';
}

// Variáveis globais do modal (independentes do gráfico completo)
let chartModalCurrentAsset = 'PETR4';
let chartModalCurrentChartType = 'candlestick';
let chartModalCurrentTimeframe = '1M';

// Renomear variáveis para evitar conflitos com grafico.js
const modalCurrentAsset = chartModalCurrentAsset;
const modalCurrentTimeframe = chartModalCurrentTimeframe;
let chartModalChart = null; // Variável para armazenar o gráfico Chart.js
let chartModalCurrentOrderType = 'buy';
let chartModalTradingViewAvailable = false;
let chartModalResizeObserver = null;
let chartModalUpdateInterval = null;
let chartModalUserBalance = 100000; // Saldo do usuário
let chartModalUserPortfolio = {}; // Carteira do usuário

// Configurações de mercado
const MARKET_CONFIG = {
    openTime: { hour: 10, minute: 0 },
    closeTime: { hour: 18, minute: 0 },
    minPrice: 0.10,
    maxPrice: 1000.00,
    minQuantity: 100, // 1 lote
    quantityMultiplier: 100
};

// Regras de negócio (RN-003, RN-004, RN-005, RN-009, RN-011)
const BUSINESS_RULES = {
    // RN-003: Validação de ordens
    orderValidation: {
        executed: 0.005, // ≤ 0.5% - executada
        accepted: 0.02,  // ≤ 2% - aceita (pendente)
        rejected: 0.02   // > 2% - rejeitada
    },
    
    // RN-011: Horário de funcionamento
    marketHours: {
        open: { hour: 10, minute: 0 },
        close: { hour: 18, minute: 0 },
        days: [1, 2, 3, 4, 5] // Segunda a Sexta
    },
    
    // RN-004 & RN-005: Validações de compra e venda
    trading: {
        minBalance: 100, // Saldo mínimo para operações
        minPortfolio: 100 // Quantidade mínima no portfólio
    }
};

// Função de inicialização do modal
function initChartModal(selectedAsset = 'PETR4') {
    console.log('Inicializando modal de gráfico com ativo:', selectedAsset);
    
    // Inicializar sistemas de sincronização primeiro
    try {
        initializeDataSyncSystem();
        initializeTimeframeUpdateSystem();
        console.log('Sistemas de sincronização inicializados');
    } catch (error) {
        console.error('Erro ao inicializar sistemas de sincronização:', error);
        // Continuar mesmo com erro para não quebrar o modal
    }
    
    // Verificar sincronização de tempo
    verifyTimeSynchronization();
    
    // Sincronizar dados dos ativos
    syncChartModalAssetsData();
    
    // Verificar se TradingView está disponível
    if (typeof TradingView !== 'undefined') {
        chartModalTradingViewAvailable = true;
        console.log('TradingView disponível');
    } else {
        chartModalTradingViewAvailable = false;
        console.log('TradingView não disponível, usando gráfico mockado');
    }
    
    // Definir ativo atual
    chartModalCurrentAsset = selectedAsset;
    
    // Restaurar preferências salvas do usuário
    restoreChartModalPreferences();
    
    // Inicializar componentes
    initChartModalAssetSelector();
    initChartModalChartControls();
    initChartModalTradingPanel();
    initMarketStatus(); // Inicializar status do mercado
    
    // Carregar gráfico inicial
    loadChartModalChart();
    
    // Atualizar display
    updateChartModalAssetDisplay(selectedAsset);
    updateChartModalBalanceDisplay();
    
    // Salvar dados históricos após inicializar
    saveChartModalHistory();
    
    console.log('Modal do gráfico inicializado com sucesso');
}

// Função para restaurar preferências salvas
function restoreChartModalPreferences() {
    // Restaurar tipo de gráfico
    const savedChartType = localStorage.getItem('chartModalChartType');
    if (savedChartType && (savedChartType === 'candlestick' || savedChartType === 'line')) {
        chartModalCurrentChartType = savedChartType;
        // Atualizar botão ativo
        document.querySelectorAll('.chart-type-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-type="${savedChartType}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    // Restaurar timeframe
    const savedTimeframe = localStorage.getItem('chartModalTimeframe');
    if (savedTimeframe && ['1M', '5M', '30M', '1H'].includes(savedTimeframe)) {
        chartModalCurrentTimeframe = savedTimeframe;
        // Atualizar botão ativo
        document.querySelectorAll('.chart-timeframe-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-timeframe="${savedTimeframe}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    // Restaurar dados históricos se disponível
    const savedHistory = localStorage.getItem('chartModalHistory');
    if (savedHistory) {
        try {
            const historyData = JSON.parse(savedHistory);
            if (historyData && historyData[chartModalCurrentAsset]) {
                console.log('Dados históricos restaurados:', historyData[chartModalCurrentAsset]);
            }
        } catch (e) {
            console.warn('Erro ao restaurar dados históricos:', e);
        }
    }
}

// Função para salvar dados históricos
function saveChartModalHistory() {
    try {
        const historyData = JSON.parse(localStorage.getItem('chartModalHistory') || '{}');
        
        // Salvar dados do ativo atual
        if (chartModalCurrentAsset) {
            historyData[chartModalCurrentAsset] = {
                timestamp: Date.now(),
                asset: chartModalCurrentAsset,
                timeframe: chartModalCurrentTimeframe,
                chartType: chartModalCurrentChartType,
                lastUpdate: new Date().toISOString()
            };
        }
        
        localStorage.setItem('chartModalHistory', JSON.stringify(historyData));
        console.log('Dados históricos salvos:', historyData);
        
    } catch (error) {
        console.error('Erro ao salvar dados históricos:', error);
    }
}

// Função de limpeza do modal
function cleanupChartModal() {
    console.log('Limpando modal de gráfico...');
    
    // Destruir widget TradingView se existir (namespace)
    if (ChartModal.tradingViewWidget && ChartModal.tradingViewWidget.remove) {
        try {
            ChartModal.tradingViewWidget.remove();
        } catch (e) {
            console.warn('Erro ao remover widget (namespace):', e);
        }
    }
    
    // Destruir widget TradingView se existir (compatibilidade)
    if (chartModalTradingViewWidget && chartModalTradingViewWidget.remove) {
        try {
            chartModalTradingViewWidget.remove();
        } catch (e) {
            console.warn('Erro ao remover widget (compatibilidade):', e);
        }
    }
    
    // Limpar namespace
    ChartModal.tradingViewWidget = null;
    chartModalTradingViewWidget = null;

    // Limpar TradingView Chart se existir
    if (typeof cleanupTradingViewChart === 'function') {
        cleanupTradingViewChart();
    }
    
    // Destruir gráfico Chart.js se existir
    if (chartModalChart) {
        try {
            chartModalChart.destroy();
        } catch (error) {
            console.warn('Erro ao destruir gráfico:', error);
        }
    }
    chartModalChart = null;
    
    // Remover observer de redimensionamento se existir
    const chartContainer = document.getElementById('chart-tradingview-chart');
    if (chartContainer && chartContainer._resizeObserver) {
        chartContainer._resizeObserver.disconnect();
        delete chartContainer._resizeObserver;
    }
}

// ===== FUNÇÕES DE INICIALIZAÇÃO =====

function initChartModalAssetSelector() {
    const assetsList = document.getElementById('chartAssetsList');
    const searchInput = document.getElementById('chartAssetSearch');
    
    // Renderizar lista de ativos
    renderChartModalAssetsList();
    
    // Event listener para busca
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterChartModalAssets(searchTerm);
        });
    }
}

function renderChartModalAssetsList() {
    const assetsList = document.getElementById('chartAssetsList');
    if (!assetsList) return;
    
    assetsList.innerHTML = '';
    
    Object.keys(chartModalAssetsData).forEach(symbol => {
        const asset = chartModalAssetsData[symbol];
        const assetItem = document.createElement('div');
        assetItem.className = `chart-asset-item ${symbol === chartModalCurrentAsset ? 'active' : ''}`;
        assetItem.onclick = () => selectChartModalAsset(symbol);
        
        const changeClass = asset.change >= 0 ? 'positive' : 'negative';
        const changeSign = asset.change >= 0 ? '+' : '';
        
        assetItem.innerHTML = `
            <img src="${asset.logo}" alt="${symbol}" class="chart-asset-logo">
            <div class="chart-asset-info">
                <div class="chart-asset-symbol">${symbol}</div>
                <div class="chart-asset-name">${asset.name}</div>
            </div>
            <div class="chart-asset-price">
                <div class="chart-price">R$ ${asset.price.toFixed(2)}</div>
                <div class="chart-change ${changeClass}">${changeSign}${asset.change.toFixed(2)} (${changeSign}${asset.changePercent.toFixed(2)}%)</div>
            </div>
        `;
        
        assetsList.appendChild(assetItem);
    });
}

function filterChartModalAssets(searchTerm) {
    const assetItems = document.querySelectorAll('.chart-asset-item');
    
    assetItems.forEach(item => {
        const symbol = item.querySelector('.chart-asset-symbol').textContent;
        const name = item.querySelector('.chart-asset-name').textContent;
        
        if (symbol.toLowerCase().includes(searchTerm) || name.toLowerCase().includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function initChartModalChartControls() {
    // Chart type controls
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            setChartModalChartType(type);
        });
    });
    
    // Timeframe controls
    document.querySelectorAll('.chart-timeframe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const timeframe = this.getAttribute('data-timeframe');
            setChartModalTimeframe(timeframe);
        });
    });
}

function initChartModalTradingPanel() {
    // Tab controls
    document.querySelectorAll('.chart-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            setChartModalOrderType(tab);
        });
    });
    
    // Form controls
    const quantityInput = document.getElementById('chartOrderQuantity');
    const priceInput = document.getElementById('chartOrderPrice');
    
    if (quantityInput) {
        quantityInput.addEventListener('input', () => {
            updateChartModalOrderTotal();
            validateChartModalOrder();
        });
    }
    
    if (priceInput) {
        priceInput.addEventListener('input', () => {
            updateChartModalOrderTotal();
            validateChartModalOrder();
        });
    }
    
    // Send order button
    const sendBtn = document.getElementById('chartSendOrderBtn');
    if (sendBtn) sendBtn.addEventListener('click', sendChartModalOrder);
    
    // Asset selector in trading panel
    const assetSelect = document.getElementById('chartOrderAsset');
    if (assetSelect) {
        assetSelect.addEventListener('change', function() {
            const selectedAsset = this.value;
            updateChartModalTradingPanelAsset(selectedAsset);
            validateChartModalOrder(); // Revalidar após mudança de ativo
        });
    }
    
    // Configurar validação inicial
    setTimeout(() => {
        validateChartModalOrder();
    }, 100);
    
    // Registrar componente para sincronização se o sistema estiver disponível
    if (window.DataSyncSystem && window.DataSyncSystem.isReady()) {
        window.DataSyncSystem.registerComponent('TradingPanel', (assetSymbol, data) => {
            console.log(`TradingPanel recebeu atualização para ${assetSymbol}:`, data);
            // Atualizar preços e validações
            if (assetSymbol === chartModalCurrentAsset) {
                updateChartModalTradingPanelAsset(assetSymbol);
            }
        });
    } else {
        // Tentar novamente quando o sistema estiver disponível
        setTimeout(() => {
            if (window.DataSyncSystem && window.DataSyncSystem.isReady()) {
                window.DataSyncSystem.registerComponent('TradingPanel', (assetSymbol, data) => {
                    console.log(`TradingPanel recebeu atualização para ${assetSymbol}:`, data);
                    if (assetSymbol === chartModalCurrentAsset) {
                        updateChartModalTradingPanelAsset(assetSymbol);
                    }
                });
            }
        }, 500);
    }
}

// ===== FUNÇÕES DE SELEÇÃO DE ATIVOS =====

function selectChartModalAsset(symbol) {
    console.log('Selecionando ativo no modal:', symbol);
    
    // Verificar sincronização de tempo
    verifyTimeSynchronization();
    
    // Sincronizar dados dos ativos antes de selecionar
    syncChartModalAssetsData();
    
    // Verificar se os preços estão sincronizados
    updateChartModalChartData();
    
    // Atualizar ativo atual
    chartModalCurrentAsset = symbol;
    
    // Atualizar interface
    updateChartModalAssetDisplay(symbol);
    updateChartModalAssetSelector(symbol);
    updateChartModalTradingPanelAsset(symbol);
    
    // Recarregar gráfico
    loadChartModalChart();
    
    // Salvar dados históricos após selecionar
    saveChartModalHistory();
}

function updateChartModalAssetDisplay(symbol) {
    const asset = chartModalAssetsData[symbol];
    const changeClass = asset.change >= 0 ? 'positive' : 'negative';
    const changeSign = asset.change >= 0 ? '+' : '';
    
    // Atualizar logo e informações
    const logoEl = document.getElementById('chartSelectedAssetLogo');
    const symbolEl = document.getElementById('chartSelectedAssetSymbol');
    const nameEl = document.getElementById('chartSelectedAssetName');
    const priceEl = document.getElementById('chartSelectedAssetPrice');
    const changeEl = document.getElementById('chartSelectedAssetChange');
    
    if (logoEl) logoEl.src = asset.logo;
    if (logoEl) logoEl.alt = symbol;
    if (symbolEl) symbolEl.textContent = symbol;
    if (nameEl) nameEl.textContent = asset.name;
    if (priceEl) priceEl.textContent = `R$ ${asset.price.toFixed(2)}`;
    if (changeEl) {
        changeEl.textContent = `${changeSign}${asset.change.toFixed(2)} (${changeSign}${asset.changePercent.toFixed(2)}%)`;
        changeEl.className = `chart-change ${changeClass}`;
    }
}

function updateChartModalAssetSelector(symbol) {
    // Remover classe active de todos os itens
    document.querySelectorAll('.chart-asset-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adicionar classe active ao item selecionado
    const assetItems = document.querySelectorAll('.chart-asset-item');
    assetItems.forEach(item => {
        const symbolEl = item.querySelector('.chart-asset-symbol');
        if (symbolEl && symbolEl.textContent === symbol) {
            item.classList.add('active');
        }
    });
}

// Flag para evitar recursão infinita
let isUpdatingTradingPanel = false;

function updateChartModalTradingPanelAsset(symbol) {
    // Evitar recursão infinita
    if (isUpdatingTradingPanel) {
        console.log('Evitando recursão em updateChartModalTradingPanelAsset');
        return;
    }
    
    isUpdatingTradingPanel = true;
    
    try {
        const asset = chartModalAssetsData[symbol];
        if (!asset) return;
        
        const assetSelect = document.getElementById('chartOrderAsset');
        const priceHint = document.getElementById('chartCurrentPriceHint');
        const priceInput = document.getElementById('chartOrderPrice');
        
        if (assetSelect) assetSelect.value = symbol;
        
        // Usar preço do sistema centralizado se disponível
        let currentPrice = asset.price;
        if (window.DataSyncSystem && window.DataSyncSystem.isReady()) {
            const syncData = window.DataSyncSystem.getData(symbol);
            currentPrice = syncData?.listPrice || asset.price;
            
            // NÃO modificar dados sincronizados durante notificação para evitar recursão
            // Apenas ler os dados, não escrever
        }
        
        if (priceHint) priceHint.textContent = `R$ ${currentPrice.toFixed(2)}`;
        if (priceInput) priceInput.value = currentPrice.toFixed(2);
        
        updateChartModalOrderTotal();
    } finally {
        // Sempre resetar a flag
        isUpdatingTradingPanel = false;
    }
}

// ===== FUNÇÕES DE CONTROLE DO GRÁFICO =====

function setChartModalChartType(type) {
    console.log('Alterando tipo de gráfico no modal para:', type);
    
    // Salvar dados históricos antes de alterar
    saveChartModalHistory();
    
    chartModalCurrentChartType = type;
    
    // Atualizar botões
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-type="${type}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Salvar preferência no localStorage para persistência
    localStorage.setItem('chartModalChartType', type);
    
    // Usar TradingView Lightweight Charts se disponível
    if (typeof toggleTradingViewChartType === 'function') {
        if (!toggleTradingViewChartType(type)) {
            console.warn('Falha ao alternar tipo no TradingView, usando Chart.js');
            loadChartModalChart();
        }
    } else {
        // Fallback para Chart.js
        loadChartModalChart();
    }
    
    // Salvar dados históricos após alterar
    saveChartModalHistory();
}

function setChartModalTimeframe(timeframe) {
    console.log('Alterando timeframe no modal para:', timeframe);
    
    // Salvar dados históricos antes de alterar
    saveChartModalHistory();
    
    // Parar atualizações do timeframe anterior se o sistema estiver disponível
    if (window.TimeframeUpdateSystem && window.TimeframeUpdateSystem.isReady()) {
        window.TimeframeUpdateSystem.stopUpdates(chartModalCurrentTimeframe);
    }
    
    chartModalCurrentTimeframe = timeframe;
    
    // Atualizar botões
    document.querySelectorAll('.chart-timeframe-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-timeframe="${timeframe}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Salvar preferência no localStorage para persistência
    localStorage.setItem('chartModalTimeframe', timeframe);
    
    // Preservar o tipo de gráfico atual ao mudar timeframe
    const currentChartType = chartModalCurrentChartType;
    
    // Usar TradingView Lightweight Charts se disponível
    if (typeof loadOHLCData === 'function') {
        if (!loadOHLCData(chartModalCurrentAsset, timeframe)) {
            console.warn('Falha ao carregar dados OHLC, usando Chart.js');
            loadChartModalChart();
        }
    } else {
        // Fallback para Chart.js
        loadChartModalChart();
    }
    
    // Garantir que o tipo de gráfico seja mantido
    if (currentChartType !== chartModalCurrentChartType) {
        setChartModalChartType(currentChartType);
    }
    
    // Iniciar atualizações para o novo timeframe se o sistema estiver disponível
    if (window.TimeframeUpdateSystem && window.TimeframeUpdateSystem.isReady()) {
        window.TimeframeUpdateSystem.startUpdates(timeframe, chartModalCurrentAsset);
    }
    
    // Salvar dados históricos após alterar
    saveChartModalHistory();
}

function loadChartModalChart() {
    console.log('Carregando gráfico no modal para:', chartModalCurrentAsset);
    
    // Verificar sincronização de tempo
    verifyTimeSynchronization();
    
    // Sincronizar dados dos ativos antes de carregar o gráfico
    syncChartModalAssetsData();
    
    // Verificar se os preços estão sincronizados
    updateChartModalChartData();
    
    // Limpar container primeiro para evitar múltiplos gráficos
    const chartContainer = document.getElementById('chart-tradingview-chart');
    if (chartContainer) {
        chartContainer.innerHTML = '';
    }
    
    // Tentar usar TradingView Lightweight Charts primeiro
    if (typeof LightweightCharts !== 'undefined') {
        console.log('TradingView Lightweight Charts disponível, inicializando...');
        if (initTradingViewChart('chart-tradingview-chart')) {
            // Carregar dados OHLC
            if (loadOHLCData(chartModalCurrentAsset, chartModalCurrentTimeframe)) {
                console.log('TradingView Chart carregado com sucesso');
                
                // Iniciar atualizações baseadas no timeframe se estiver disponível
                if (window.TimeframeUpdateSystem && window.TimeframeUpdateSystem.isReady()) {
                    window.TimeframeUpdateSystem.startUpdates(chartModalCurrentTimeframe, chartModalCurrentAsset);
                }
                
                // Sincronizar dados do gráfico no sistema centralizado se estiver disponível
                const currentAsset = chartModalAssetsData[chartModalCurrentAsset];
                if (currentAsset && window.DataSyncSystem && window.DataSyncSystem.isReady()) {
                    window.DataSyncSystem.updateData(chartModalCurrentAsset, {
                        chartPrice: currentAsset.price,
                        chartLastUpdate: Date.now(),
                        chartTimeframe: chartModalCurrentTimeframe,
                        chartType: chartModalCurrentChartType
                    });
                }
                
                // Salvar dados históricos após carregar
                saveChartModalHistory();
                return;
            } else {
                console.warn('Falha ao carregar dados OHLC, usando fallback Chart.js');
            }
        }
    }
    
    // Fallback para Chart.js se TradingView não estiver disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está disponível');
        createChartModalFallback();
        return;
    }

    console.log('Chart.js está disponível, versão:', Chart.version);
    
    // Verificar se o ativo atual existe
    if (!chartModalAssetsData[chartModalCurrentAsset]) {
        console.error('Ativo não encontrado:', chartModalCurrentAsset);
        createChartModalFallback();
        return;
    }
    
    if (!chartContainer) {
        console.error('Container do gráfico não encontrado');
        return;
    }
    
    // Limpar conteúdo anterior
    chartContainer.innerHTML = '';
    
    // Criar canvas com dimensões responsivas
    const canvas = document.createElement('canvas');
    canvas.id = 'chartCanvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.minHeight = '400px';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    
    // Definir dimensões do canvas para alta resolução
    const containerRect = chartContainer.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerRect.width * dpr;
    canvas.height = containerRect.height * dpr;
    canvas.style.width = containerRect.width + 'px';
    canvas.style.height = containerRect.height + 'px';
    
    // Escalar o contexto para alta resolução
    const tempCtx = canvas.getContext('2d');
    if (tempCtx) {
        tempCtx.scale(dpr, dpr);
    }
    
    chartContainer.appendChild(canvas);
    
    // Destruir gráfico anterior se existir
    if (chartModalChart) {
        try {
            chartModalChart.destroy();
        } catch (error) {
            console.warn('Erro ao destruir gráfico anterior:', error);
        }
    }
    
    // Gerar dados mockados para o gráfico
    const chartData = generateChartModalData();
    console.log('Dados gerados:', chartData);
    
    // Verificar se os dados são válidos
    if (!chartData || !chartData.datasets || !chartData.datasets[0] || !chartData.datasets[0].data) {
        console.error('Dados do gráfico inválidos');
        createChartModalFallback();
        return;
    }
    
    // Criar gráfico com Chart.js
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Contexto 2D não disponível');
        createChartModalFallback();
        return;
    }
    
    let config;
    
    if (chartModalCurrentChartType === 'candlestick') {
        // Configuração para candlestick usando plugin personalizado
        config = {
            type: 'scatter',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: chartModalCurrentAsset,
                    data: chartData.datasets[0]._ohlc.map((d, i) => ({
                        x: i,
                        y: d.c
                    })),
                    backgroundColor: chartData.datasets[0]._ohlc.map(d => 
                        d.c >= d.o ? '#4caf50' : '#f44336'
                    ),
                    borderColor: chartData.datasets[0]._ohlc.map(d => 
                        d.c >= d.o ? '#4caf50' : '#f44336'
                    ),
                    borderWidth: 2,
                    pointRadius: 0,
                    _ohlc: chartData.datasets[0]._ohlc
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                layout: {
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                    axis: 'x'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(30, 30, 47, 0.95)',
                        titleColor: '#F0B90B',
                        bodyColor: '#ffffff',
                        borderColor: '#F0B90B',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            title: function(context) {
                                const ohlcData = context.dataset._ohlc[context.dataIndex];
                                if (ohlcData) {
                                    const time = chartData.labels[context.dataIndex];
                                    return `${chartModalCurrentAsset} - ${time}`;
                                }
                                return chartModalCurrentAsset;
                            },
                            label: function(context) {
                                const ohlcData = context.dataset._ohlc[context.dataIndex];
                                if (ohlcData && ohlcData.o !== undefined) {
                                    const change = ohlcData.c - ohlcData.o;
                                    const changePercent = (change / ohlcData.o) * 100;
                                    const changeSign = change >= 0 ? '+' : '';
                                    const isGreen = change >= 0;
                                    
                                    return [
                                        `📊 **Dados OHLC**`,
                                        `🟢 Abertura: R$ ${ohlcData.o.toFixed(2)}`,
                                        `🔴 Fechamento: R$ ${ohlcData.c.toFixed(2)}`,
                                        `📈 Máxima: R$ ${ohlcData.h.toFixed(2)}`,
                                        `📉 Mínima: R$ ${ohlcData.l.toFixed(2)}`,
                                        `💰 Variação: ${changeSign}R$ ${Math.abs(change).toFixed(2)} (${changeSign}${changePercent.toFixed(2)}%)`,
                                        `🎯 ${isGreen ? 'Alta' : 'Baixa'}`
                                    ];
                                }
                                return `R$ ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(42, 42, 61, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#888',
                            maxRotation: 0,
                            callback: function(value, index) {
                                return chartData.labels[index] || '';
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(42, 42, 61, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#888',
                            callback: function(value) {
                                if (value !== null && value !== undefined && !isNaN(value)) {
                                    return 'R$ ' + value.toFixed(2);
                                }
                                return 'R$ 0,00';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        backgroundColor: function(context) {
                            const ohlcData = context.dataset._ohlc[context.dataIndex];
                            if (ohlcData && ohlcData.o !== undefined && ohlcData.c !== undefined) {
                                return ohlcData.c >= ohlcData.o ? '#4caf50' : '#f44336';
                            }
                            return '#F0B90B';
                        },
                        borderColor: function(context) {
                            const ohlcData = context.dataset._ohlc[context.dataIndex];
                            if (ohlcData && ohlcData.o !== undefined && ohlcData.c !== undefined) {
                                return ohlcData.c >= ohlcData.o ? '#4caf50' : '#f44336';
                            }
                            return '#F0B90B';
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            },
            plugins: [{
                id: 'candlestick',
                afterDraw: function(chart) {
                    const ctx = chart.ctx;
                    const dataset = chart.data.datasets[0];
                    const ohlcData = dataset._ohlc;
                    
                    if (!ohlcData) return;
                    
                    const meta = chart.getDatasetMeta(0);
                    const xAxis = chart.scales.x;
                    const yAxis = chart.scales.y;
                    
                    ohlcData.forEach((d, i) => {
                        const x = meta.data[i].x;
                        const openY = yAxis.getPixelForValue(d.o);
                        const closeY = yAxis.getPixelForValue(d.c);
                        const highY = yAxis.getPixelForValue(d.h);
                        const lowY = yAxis.getPixelForValue(d.l);
                        
                        const isGreen = d.c >= d.o;
                        const color = isGreen ? '#4caf50' : '#f44336';
                        
                        // Desenhar linha vertical (máxima-mínima) - wick
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(x, highY);
                        ctx.lineTo(x, lowY);
                        ctx.stroke();
                        
                        // Desenhar corpo do candle com proporção responsiva
                        const bodyWidth = Math.max(4, (xAxis.width / ohlcData.length) * 0.6);
                        const bodyHeight = Math.abs(closeY - openY);
                        
                        if (bodyHeight > 0) {
                            // Corpo preenchido
                            ctx.fillStyle = color;
                            ctx.fillRect(
                                x - bodyWidth/2,
                                Math.min(openY, closeY),
                                bodyWidth,
                                bodyHeight
                            );
                            
                            // Borda do corpo
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 0.5;
                            ctx.strokeRect(
                                x - bodyWidth/2,
                                Math.min(openY, closeY),
                                bodyWidth,
                                bodyHeight
                            );
                        } else {
                            // Candle doji (abertura = fechamento) - linha horizontal
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(x - bodyWidth/2, openY);
                            ctx.lineTo(x + bodyWidth/2, openY);
                            ctx.stroke();
                        }
                    });
                }
            }]
        };
    } else {
        // Configuração para gráfico de linha
        config = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(30, 30, 47, 0.95)',
                        titleColor: '#F0B90B',
                        bodyColor: '#ffffff',
                        borderColor: '#F0B90B',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed?.y;
                                if (value !== null && value !== undefined && !isNaN(value)) {
                                    return `R$ ${value.toFixed(2)}`;
                                }
                                return 'R$ 0,00';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(42, 42, 61, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#888',
                            maxRotation: 0
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(42, 42, 61, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#888',
                            callback: function(value) {
                                if (value !== null && value !== undefined && !isNaN(value)) {
                                    return 'R$ ' + value.toFixed(2);
                                }
                                return 'R$ 0,00';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        backgroundColor: '#F0B90B',
                        borderColor: '#F0B90B',
                        borderWidth: 2,
                        radius: 4,
                        hoverRadius: 6
                    },
                    line: {
                        borderColor: '#F0B90B',
                        borderWidth: 2,
                        backgroundColor: 'rgba(240, 185, 11, 0.1)',
                        tension: 0.4
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        };
    }
    
    try {
        console.log('Criando gráfico com configuração:', config);
        chartModalChart = new Chart(ctx, config);
        console.log('Gráfico criado com sucesso');
        
        // Adicionar listener de redimensionamento para responsividade
        const resizeObserver = new ResizeObserver(() => {
            if (chartModalChart) {
                chartModalChart.resize();
            }
        });
        resizeObserver.observe(chartContainer);
        
        // Armazenar observer para limpeza posterior
        chartContainer._resizeObserver = resizeObserver;
        
    } catch (error) {
        console.error('Erro ao criar gráfico:', error);
        createChartModalFallback();
    }
}

function generateChartModalData() {
    // Verificar se o ativo atual existe
    if (!chartModalAssetsData[chartModalCurrentAsset]) {
        console.error('Ativo não encontrado para geração de dados:', chartModalCurrentAsset);
        return null;
    }
    
    const asset = chartModalAssetsData[chartModalCurrentAsset];
    
    // Verificar se o ativo tem preço válido
    if (!asset.price || isNaN(asset.price)) {
        console.error('Preço inválido para o ativo:', asset);
        return null;
    }
    
    const basePrice = parseFloat(asset.price);
    const dataPoints = getChartModalDataPoints();
    const labels = [];
    const data = [];
    
    // Gerar dados baseados no timeframe
    for (let i = 0; i < dataPoints; i++) {
        const date = new Date();
        
        // Ajustar data baseado no timeframe
        if (chartModalCurrentTimeframe === '1H') {
            date.setHours(date.getHours() - (dataPoints - i - 1));
            const label = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            labels.push(label);
        } else if (chartModalCurrentTimeframe === '30M') {
            date.setMinutes(date.getMinutes() - (dataPoints - i - 1) * 30);
            const label = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            labels.push(label);
        } else if (chartModalCurrentTimeframe === '5M') {
            date.setMinutes(date.getMinutes() - (dataPoints - i - 1) * 5);
            const label = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            labels.push(label);
        } else { // 1M
            date.setMinutes(date.getMinutes() - (dataPoints - i - 1));
            const label = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            labels.push(label);
        }
        
        if (chartModalCurrentChartType === 'candlestick') {
            // Dados para candlestick (OHLC) com variação mais realista e consistente
            let open, close, high, low;
            
            if (i === 0) {
                // Primeiro candle: usar preço base como abertura
                open = basePrice;
            } else {
                // Candles subsequentes: usar fechamento do candle anterior como abertura
                open = data[i-1].c;
            }
            
            // Variação mais realista baseada no timeframe e preço base
            const timeframeMultiplier = chartModalCurrentTimeframe === '1M' ? 0.0005 : 
                                      chartModalCurrentTimeframe === '5M' ? 0.001 :
                                      chartModalCurrentTimeframe === '30M' ? 0.002 : 0.005;
            
            // Variação baseada no preço atual para maior realismo
            const priceVariation = (Math.random() - 0.5) * timeframeMultiplier;
            close = open * (1 + priceVariation);
            
            // Garantir que close não seja negativo
            close = Math.max(close, open * 0.95);
            
            // Máxima e mínima baseadas na abertura e fechamento com lógica realista
            const bodyRange = Math.abs(close - open);
            const wickRange = bodyRange * (0.5 + Math.random() * 0.5); // 50-100% do corpo
            
            if (close >= open) {
                // Candle de alta (verde)
                high = close + wickRange * Math.random();
                low = open - wickRange * Math.random();
            } else {
                // Candle de baixa (vermelho)
                high = open + wickRange * Math.random();
                low = close - wickRange * Math.random();
            }
            
            // Garantir que low não seja negativo
            low = Math.max(low, Math.min(open, close) * 0.95);
            
            data.push({
                x: labels[labels.length - 1],
                o: open,
                h: high,
                l: low,
                c: close
            });
        } else {
            // Dados para linha
            const variation = (Math.random() - 0.5) * 0.02; // ±1% de variação
            const price = basePrice * (1 + variation);
            data.push(price);
        }
    }
    
    if (chartModalCurrentChartType === 'candlestick') {
        return {
            labels: labels,
            datasets: [{
                label: chartModalCurrentAsset,
                data: data.map(d => d.c), // Usar preço de fechamento para altura da barra
                backgroundColor: data.map(d => {
                    if (d && d.c !== undefined && d.o !== undefined) {
                        return d.c >= d.o ? '#4caf50' : '#f44336';
                    }
                    return '#F0B90B';
                }),
                borderColor: data.map(d => {
                    if (d && d.c !== undefined && d.o !== undefined) {
                        return d.c >= d.o ? '#4caf50' : '#f44336';
                    }
                    return '#F0B90B';
                }),
                borderWidth: 1,
                borderRadius: 2,
                // Adicionar dados OHLC para tooltip
                _ohlc: data
            }]
        };
    } else {
        return {
            labels: labels,
            datasets: [{
                label: chartModalCurrentAsset,
                data: data,
                fill: true,
                tension: 0.4,
                borderColor: '#F0B90B',
                backgroundColor: 'rgba(240, 185, 11, 0.1)',
                borderWidth: 2
            }]
        };
    }
}

function getChartModalDataPoints() {
    const timeframes = {
        '1M': 30,   // 1 minuto - 30 pontos (reduzido para melhor visualização)
        '5M': 24,   // 5 minutos - 24 pontos (reduzido para melhor visualização)
        '30M': 16,  // 30 minutos - 16 pontos (reduzido para melhor visualização)
        '1H': 12    // 1 hora - 12 pontos (reduzido para melhor visualização)
    };
    return timeframes[chartModalCurrentTimeframe] || 30;
}

function getChartModalTimeframeInterval(timeframe) {
    const intervals = {
        '1M': '1M',
        '5M': '5M',
        '30M': '30M',
        '1H': '1H'
    };
    return intervals[timeframe] || '1M';
}

function createChartModalFallback() {
    const chartContainer = document.getElementById('chart-tradingview-chart');
    if (!chartContainer) return;
    
    const asset = chartModalAssetsData[chartModalCurrentAsset];
    const changeClass = asset.change >= 0 ? 'positive' : 'negative';
    const changeSign = asset.change >= 0 ? '+' : '';
    
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
            padding: 20px;
        ">
            <div style="text-align: center; max-width: 400px;">
                <i class="fa-solid fa-chart-line" style="font-size: 64px; margin-bottom: 20px; color: #F0B90B;"></i>
                <h3 style="color: #F0B90B; margin-bottom: 15px; font-size: 24px;">${chartModalCurrentAsset}</h3>
                <p style="color: #ffffff; margin-bottom: 10px; font-size: 18px;">${asset.name}</p>
                <div style="background: rgba(20, 20, 30, 0.5); padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p style="color: #ffffff; font-size: 20px; font-weight: bold; margin-bottom: 5px;">R$ ${asset.price.toFixed(2)}</p>
                    <p style="color: ${changeClass === 'positive' ? '#4caf50' : '#f44336'}; font-size: 16px;">
                        ${changeSign}${asset.change.toFixed(2)} (${changeSign}${asset.changePercent.toFixed(2)}%)
                    </p>
                </div>
                <div style="margin-top: 20px; padding: 10px; background: rgba(240, 185, 11, 0.1); border-radius: 6px;">
                    <p style="font-size: 14px; color: #F0B90B; margin-bottom: 5px;">Configuração do Gráfico</p>
                    <p style="font-size: 12px; color: #888;">Tipo: ${chartModalCurrentChartType === 'candlestick' ? 'Candlestick' : 'Linha'}</p>
                    <p style="font-size: 12px; color: #888;">Timeframe: ${chartModalCurrentTimeframe}</p>
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                    <i class="fa-solid fa-info-circle"></i> Gráfico mockado - Chart.js não disponível
                </p>
            </div>
        </div>
    `;
}

// ===== FUNÇÕES DO PAINEL DE TRADING =====

function setChartModalOrderType(type) {
    console.log('Alterando tipo de ordem no modal para:', type);
    chartModalCurrentOrderType = type;
    
    // Atualizar botões
    document.querySelectorAll('.chart-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-tab="${type}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Atualizar cor do botão de envio
    const sendBtn = document.getElementById('chartSendOrderBtn');
    if (sendBtn) {
        if (type === 'buy') {
            sendBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
        } else {
            sendBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
        }
    }
}

function updateChartModalOrderTotal() {
    const quantity = parseInt(document.getElementById('chartOrderQuantity')?.value) || 0;
    const price = parseFloat(document.getElementById('chartOrderPrice')?.value) || 0;
    const total = quantity * 100 * price; // 100 ações por lote
    
    const totalEl = document.getElementById('chartOrderTotal');
    if (totalEl) {
        totalEl.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // Validar ordem
    validateChartModalOrder();
}

function validateChartModalOrder() {
    const quantity = parseInt(document.getElementById('chartOrderQuantity')?.value) || 0;
    const price = parseFloat(document.getElementById('chartOrderPrice')?.value) || 0;
    const sendBtn = document.getElementById('chartSendOrderBtn');
    
    if (!sendBtn) return;
    
    let isValid = true;
    let errorMessage = '';
    
    // RN-003: Validação de quantidade - múltiplos de 100 obrigatórios
    if (quantity < 1 || quantity % 1 !== 0) {
        isValid = false;
        errorMessage = 'Quantidade deve ser um número inteiro de lotes';
    } else if (quantity * 100 < MARKET_CONFIG.minQuantity) {
        isValid = false;
        errorMessage = 'Quantidade mínima: 1 lote (100 ações)';
    }
    
    // RN-003: Validação de preço - limites absolutos
    if (price < MARKET_CONFIG.minPrice || price > MARKET_CONFIG.maxPrice) {
        isValid = false;
        errorMessage = 'Preço deve estar entre R$ 0,10 e R$ 1.000,00';
    }
    
    // RN-011: Validação de horário de mercado
    if (!isMarketOpen()) {
        isValid = false;
        errorMessage = 'Mercado fechado. Tente novamente no próximo pregão.';
    }
    
    // RN-004/005: Validação de saldo/posição
    if (chartModalCurrentOrderType === 'buy') {
        const total = quantity * 100 * price;
        if (total > chartModalUserBalance) {
            isValid = false;
            errorMessage = 'Saldo insuficiente para realizar a compra';
        }
    } else if (chartModalCurrentOrderType === 'sell') {
        const totalQuantity = quantity * 100;
        const userPortfolio = chartModalUserPortfolio[chartModalCurrentAsset] || 0;
        if (totalQuantity > userPortfolio) {
            isValid = false;
            errorMessage = 'Você não possui ativos suficientes para realizar a venda';
        }
    }
    
    // Atualizar estado do botão
    sendBtn.disabled = !isValid;
    sendBtn.title = errorMessage;
    
    // Mostrar/ocultar mensagem de erro
    let errorElement = document.getElementById('chartOrderError');
    if (!errorElement && errorMessage) {
        errorElement = document.createElement('div');
        errorElement.id = 'chartOrderError';
        errorElement.className = 'chart-order-error';
        errorElement.textContent = errorMessage;
        
        const orderForm = document.querySelector('.chart-order-form');
        if (orderForm) {
            orderForm.appendChild(errorElement);
        }
    } else if (errorElement && !errorMessage) {
        errorElement.remove();
    } else if (errorElement && errorMessage) {
        errorElement.textContent = errorMessage;
    }
}

function sendChartModalOrder() {
    const asset = document.getElementById('chartOrderAsset')?.value || 'PETR4';
    const quantity = parseInt(document.getElementById('chartOrderQuantity')?.value) || 1;
    const price = parseFloat(document.getElementById('chartOrderPrice')?.value) || 0;
    
    console.log('Enviando ordem do modal:', {
        type: chartModalCurrentOrderType,
        asset: asset,
        quantity: quantity,
        price: price
    });
    
    // Validar campos obrigatórios
    if (!asset || !quantity || !price) {
        showModernOrderAlert(chartModalCurrentOrderType, asset, quantity, price, 0, 'rejected', 
            'Verifique os campos e tente novamente.');
        return;
    }
    
    // Processar ordem com validação completa das regras de negócio
    const success = processOrderWithValidation(chartModalCurrentOrderType, asset, quantity, price);
    
    if (success) {
        // Resetar formulário apenas se a ordem foi processada com sucesso
        const quantityInput = document.getElementById('chartOrderQuantity');
        const priceInput = document.getElementById('chartOrderPrice');
        
        if (quantityInput) quantityInput.value = 1;
        if (priceInput) priceInput.value = chartModalAssetsData[asset].price.toFixed(2);
        
        updateChartModalOrderTotal();
    }
}

// Função para mostrar alerta moderno de ordem
function showModernOrderAlert(orderType, asset, quantity, price, total, status = 'success', message = '') {
    // Remover alerta anterior se existir
    const existingAlert = document.querySelector('.modern-order-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Determinar estilo baseado no status
    const statusClass = status === 'success' ? 'success' : 
                       status === 'pending' ? 'pending' : 
                       status === 'rejected' ? 'rejected' : 'success';
    
    const statusIcon = status === 'success' ? 'fa-check-circle' : 
                      status === 'pending' ? 'fa-clock' : 
                      status === 'rejected' ? 'fa-times-circle' : 'fa-check-circle';
    
    const statusText = status === 'success' ? 'Ordem executada' : 
                      status === 'pending' ? 'Ordem aceita (pendente)' : 
                      status === 'rejected' ? 'Ordem rejeitada' : 'Ordem processada';
    
    // Criar modal de alerta
    const alertModal = document.createElement('div');
    alertModal.className = 'modern-order-alert';
    alertModal.innerHTML = `
        <div class="alert-content">
            <div class="alert-header ${orderType === 'buy' ? 'buy-header' : 'sell-header'}">
                <i class="fas ${orderType === 'buy' ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                <h3>Ordem ${orderType === 'buy' ? 'de Compra' : 'de Venda'} ${status === 'rejected' ? 'Rejeitada' : 'Processada'}!</h3>
            </div>
            <div class="alert-body">
                <div class="order-details">
                    <div class="detail-row">
                        <span class="label">Ativo:</span>
                        <span class="value">${asset}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Quantidade:</span>
                        <span class="value">${quantity * 100} ações</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Preço:</span>
                        <span class="value">R$ ${price.toFixed(2)}</span>
                    </div>
                    <div class="detail-row total-row">
                        <span class="label">Total:</span>
                        <span class="value">R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 0.2})}</span>
                    </div>
                </div>
                <div class="order-status">
                    <div class="status-indicator ${statusClass}">
                        <i class="fas ${statusIcon}"></i>
                        <span>${statusText}</span>
                    </div>
                    ${message ? `<div class="status-message">${message}</div>` : ''}
                </div>
            </div>
            <div class="alert-footer">
                <button class="btn-close" onclick="this.closest('.modern-order-alert').remove()">
                    <i class="fas fa-times"></i>
                    Fechar
                </button>
            </div>
        </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(alertModal);
    
    // Auto-remover após 8 segundos para ordens rejeitadas
    const autoRemoveTime = status === 'rejected' ? 8000 : 5000;
    setTimeout(() => {
        if (alertModal.parentNode) {
            alertModal.remove();
        }
    }, autoRemoveTime);
    
    // Salvar dados históricos da ordem
    saveChartModalHistory();
}

// ===== FUNÇÕES DE VALIDAÇÃO DAS REGRAS DE NEGÓCIO =====

// RN-011: Verificar se o mercado está aberto
function isMarketOpen() {
    const now = new Date();
    const brtTime = getCurrentBRTTime();
    
    // Verificar se é dia útil (Segunda a Sexta)
    const dayOfWeek = brtTime.getDay();
    if (!BUSINESS_RULES.marketHours.days.includes(dayOfWeek)) {
        return false;
    }
    
    // Verificar horário (10:00 - 18:00 BRT)
    const currentHour = brtTime.getHours();
    const currentMinute = brtTime.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const openTime = BUSINESS_RULES.marketHours.open.hour * 60 + BUSINESS_RULES.marketHours.open.minute;
    const closeTime = BUSINESS_RULES.marketHours.close.hour * 60 + BUSINESS_RULES.marketHours.close.minute;
    
    return currentTime >= openTime && currentTime < closeTime;
}

// RN-003: Validar ordem conforme regras de negócio
function validateOrder(orderType, asset, quantity, price) {
    const currentAsset = chartModalAssetsData[asset];
    if (!currentAsset) {
        return { valid: false, status: 'rejected', message: 'Ativo não encontrado.' };
    }
    
    const currentPrice = currentAsset.price;
    const priceDifference = Math.abs(price - currentPrice) / currentPrice;
    
    // Validar quantidade (múltiplos de 100)
    if (quantity < 1 || quantity % 1 !== 0) {
        return { valid: false, status: 'rejected', message: 'Quantidade deve ser um número inteiro de lotes.' };
    }
    
    const totalQuantity = quantity * MARKET_CONFIG.quantityMultiplier;
    if (totalQuantity < MARKET_CONFIG.minQuantity) {
        return { valid: false, status: 'rejected', message: 'Quantidade mínima: 1 lote (100 ações).' };
    }
    
    // Validar preço absoluto
    if (price < MARKET_CONFIG.minPrice || price > MARKET_CONFIG.maxPrice) {
        return { valid: false, status: 'rejected', message: 'Preço deve estar entre R$0,10 e R$1.000,00.' };
    }
    
    // RN-004: Validar saldo para compra
    if (orderType === 'buy') {
        const totalCost = totalQuantity * price;
        if (totalCost > chartModalUserBalance) {
            return { valid: false, status: 'rejected', message: 'Saldo insuficiente para realizar a compra.' };
        }
    }
    
    // RN-005: Validar portfólio para venda
    if (orderType === 'sell') {
        const userPortfolio = chartModalUserPortfolio[asset] || 0;
        if (totalQuantity > userPortfolio) {
            return { valid: false, status: 'rejected', message: 'Você não possui ativos suficientes para realizar a venda.' };
        }
    }
    
    // Determinar status da ordem baseado na diferença de preço
    let status, message;
    
    if (priceDifference === 0 || priceDifference <= BUSINESS_RULES.orderValidation.executed) {
        status = 'executed';
        message = 'Ordem executada imediatamente.';
    } else if (priceDifference <= BUSINESS_RULES.orderValidation.accepted) {
        status = 'pending';
        message = 'Ordem aceita e pendente de execução.';
    } else {
        status = 'rejected';
        message = 'Diferença de preço muito alta (>2%).';
    }
    
    return { valid: true, status, message };
}

// Função para processar ordem com validação completa
function processOrderWithValidation(orderType, asset, quantity, price) {
    // Verificar se o mercado está aberto
    if (!isMarketOpen()) {
        showModernOrderAlert(orderType, asset, quantity, price, 0, 'rejected', 
            'Mercado fechado. Tente novamente no próximo pregão.');
        return false;
    }
    
    // Validar ordem
    const validation = validateOrder(orderType, asset, quantity, price);
    if (!validation.valid) {
        showModernOrderAlert(orderType, asset, quantity, price, 0, 'rejected', validation.message);
        return false;
    }
    
    // Processar ordem baseada no status
    const total = quantity * MARKET_CONFIG.quantityMultiplier * price;
    
    if (validation.status === 'executed') {
        // Executar ordem imediatamente
        executeOrder(orderType, asset, quantity, price, total);
        showModernOrderAlert(orderType, asset, quantity, price, total, 'success', validation.message);
    } else if (validation.status === 'pending') {
        // Aceitar ordem como pendente
        acceptOrderAsPending(orderType, asset, quantity, price, total);
        showModernOrderAlert(orderType, asset, quantity, price, total, 'pending', validation.message);
    } else {
        // Rejeitar ordem
        showModernOrderAlert(orderType, asset, quantity, price, total, 'rejected', validation.message);
        return false;
    }
    
    return true;
}

// Função para executar ordem imediatamente
function executeOrder(orderType, asset, quantity, price, total) {
    const totalQuantity = quantity * MARKET_CONFIG.quantityMultiplier;
    
    if (orderType === 'buy') {
        // Deduzir saldo
        chartModalUserBalance -= total;
        
        // Adicionar ao portfólio
        if (!chartModalUserPortfolio[asset]) {
            chartModalUserPortfolio[asset] = 0;
        }
        chartModalUserPortfolio[asset] += totalQuantity;
        
        console.log(`Compra executada: ${totalQuantity} ações de ${asset} por R$ ${total.toFixed(2)}`);
        
        // Atualizar sistema de sincronização se estiver disponível
        if (window.DataSyncSystem && window.DataSyncSystem.isReady()) {
            window.DataSyncSystem.updateData(asset, {
                portfolioQuantity: chartModalUserPortfolio[asset],
                lastTransaction: {
                    type: 'buy',
                    quantity: totalQuantity,
                    price: price,
                    total: total,
                    timestamp: Date.now()
                }
            });
        }
        
        // Atualizar Order Book (simulado)
        updateOrderBook(asset, 'executed', orderType, quantity, price, total);
        
    } else {
        // Adicionar saldo
        chartModalUserBalance += total;
        
        // Deduzir do portfólio
        chartModalUserPortfolio[asset] -= totalQuantity;
        
        console.log(`Venda executada: ${totalQuantity} ações de ${asset} por R$ ${total.toFixed(2)}`);
        
        // Atualizar sistema de sincronização se estiver disponível
        if (window.DataSyncSystem && window.DataSyncSystem.isReady()) {
            window.DataSyncSystem.updateData(asset, {
                portfolioQuantity: chartModalUserPortfolio[asset],
                lastTransaction: {
                    type: 'sell',
                    quantity: totalQuantity,
                    price: price,
                    total: total,
                    timestamp: Date.now()
                }
            });
            }
        
        // Atualizar Order Book (simulado)
        updateOrderBook(asset, 'executed', orderType, quantity, price, total);
    }
    
    // Atualizar display
    updateChartModalBalanceDisplay();
    
    // Atualizar histórico de transações
    updateTransactionHistory(orderType, asset, quantity, price, total);
}

// Função para atualizar Order Book
function updateOrderBook(asset, status, orderType, quantity, price, total) {
    // Aqui você implementaria a lógica real do Order Book
    console.log(`Order Book atualizado: ${asset} - ${status} - ${orderType} - ${quantity} lotes a R$ ${price}`);
    
    // Em uma implementação real, você salvaria a ordem no sistema de ordens
    // e atualizaria o status conforme as regras de negócio
}

// Função para atualizar histórico de transações
function updateTransactionHistory(orderType, asset, quantity, price, total) {
    // Aqui você implementaria a lógica real do histórico
    console.log(`Histórico atualizado: ${orderType} ${quantity} lotes de ${asset} a R$ ${price}`);
    
    // Em uma implementação real, você salvaria a transação no banco de dados
    // para exibição no extrato do usuário
}

// Função para aceitar ordem como pendente
function acceptOrderAsPending(orderType, asset, quantity, price, total) {
    // Aqui você implementaria a lógica para adicionar a ordem ao book de ordens
    // Por enquanto, apenas logamos
    console.log(`Ordem ${orderType} aceita como pendente: ${quantity} lotes de ${asset} a R$ ${price}`);
    
    // Em uma implementação real, você salvaria a ordem em um array/objeto de ordens pendentes
    // e implementaria a lógica de execução quando o preço atingir o valor da ordem
}

// RN-009: Cancelar ordem pendente
function cancelPendingOrder(orderId) {
    // Aqui você implementaria a lógica para cancelar a ordem do book
    // Por enquanto, apenas logamos
    console.log(`Ordem ${orderId} cancelada com sucesso`);
    
    // Em uma implementação real:
    // 1. Remover a ordem do book de ordens pendentes
    // 2. NÃO alterar carteira ou saldo (ordem não foi executada)
    // 3. Retornar confirmação de cancelamento
    
    return true;
}

// Função para atualizar status do mercado em tempo real
function updateMarketStatus() {
    const marketStatusElement = document.getElementById('market-status');
    if (!marketStatusElement) return;
    
    const isOpen = isMarketOpen();
    const brtTime = getCurrentBRTTime();
    
    if (isOpen) {
        marketStatusElement.innerHTML = `
            <span class="market-open">
                <i class="fas fa-circle"></i>
                Mercado Aberto
            </span>
            <span class="market-time">
                ${brtTime.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo'
                })} BRT
            </span>
        `;
        marketStatusElement.className = 'market-status open';
    } else {
        marketStatusElement.innerHTML = `
            <span class="market-closed">
                <i class="fas fa-circle"></i>
                Mercado Fechado
            </span>
            <span class="market-time">
                ${brtTime.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo'
                })} BRT
            </span>
        `;
        marketStatusElement.className = 'market-status closed';
    }
}

// Função para inicializar status do mercado
function initMarketStatus() {
    // Criar elemento de status do mercado se não existir
    let marketStatusElement = document.getElementById('market-status');
    if (!marketStatusElement) {
        marketStatusElement = document.createElement('div');
        marketStatusElement.id = 'market-status';
        marketStatusElement.className = 'market-status';
        
        // Inserir no header do modal
        const modalHeader = document.querySelector('.chart-modal-header');
        if (modalHeader) {
            modalHeader.appendChild(marketStatusElement);
        }
    }
    
    // Atualizar status inicial
    updateMarketStatus();
    
    // Atualizar a cada minuto
    setInterval(updateMarketStatus, 60000);
}

// ===== FUNÇÕES AUXILIARES =====

function updateChartModalBalanceDisplay() {
    // Mock - em produção viria do sistema
    const balance = 100000;
    const balanceEl = document.getElementById('chartAvailableBalance');
    if (balanceEl) {
        balanceEl.textContent = `R$ ${balance.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}

// ===== ATUALIZAÇÃO DE PREÇOS EM TEMPO REAL (SINCRONIZADA) =====

// Flag para evitar múltiplas execuções simultâneas
let isUpdatingPrices = false;

function updateChartModalPrices() {
    if (isUpdatingPrices) {
        console.log('Evitando execução simultânea de updateChartModalPrices');
        return;
    }
    
    isUpdatingPrices = true;
    
    try {
        // Verificar sincronização de tempo primeiro
        verifyTimeSynchronization();
        
        // Sincronizar com preços do sistema principal
        syncChartModalAssetsData();
        
        // Verificar se os preços estão sincronizados
        updateChartModalChartData();
        
        // Atualizar display se necessário
        if (chartModalCurrentAsset) {
            updateChartModalAssetDisplay(chartModalCurrentAsset);
            renderChartModalAssetsList();
        }
        
        // Atualizar gráfico em tempo real se TradingView estiver disponível
        if (typeof updateTradingViewChartRealtime === 'function') {
            updateTradingViewChartRealtime();
        }
    } catch (error) {
        console.error('Erro em updateChartModalPrices:', error);
    } finally {
        isUpdatingPrices = false;
    }
}

// Função para atualizar gráfico TradingView em tempo real (se disponível)
function updateTradingViewChartRealtime() {
    // Função placeholder - implementar se necessário
    // Por enquanto, apenas log para debug
    if (ChartModal.tradingViewWidget && typeof ChartModal.tradingViewWidget.chart === 'function') {
        console.log('Atualizando gráfico TradingView em tempo real (namespace)');
    } else if (chartModalTradingViewWidget && typeof chartModalTradingViewWidget.chart === 'function') {
        console.log('Atualizando gráfico TradingView em tempo real (compatibilidade)');
    }
}

// Atualizar preços a cada 10 segundos
setInterval(updateChartModalPrices, 10000);

// Sincronizar com sistema principal a cada 5 segundos
setInterval(() => {
    if (window.sincronizarDadosSistema) {
        window.sincronizarDadosSistema();
    }
    syncChartModalAssetsData();
}, 5000);

// Expor funções globalmente
window.initChartModal = initChartModal;
window.cleanupChartModal = cleanupChartModal;

// Expor namespace para evitar conflitos
window.ChartModal = ChartModal;
window.syncChartModalAssetsData = syncChartModalAssetsData;
window.updateChartModalPrices = updateChartModalPrices;
window.updateChartModalChartData = updateChartModalChartData;
window.verifyTimeSynchronization = verifyTimeSynchronization;
window.getCurrentBRTTime = getCurrentBRTTime;
window.saveChartModalHistory = saveChartModalHistory;
window.isMarketOpen = isMarketOpen;
window.validateOrder = validateOrder;
window.processOrderWithValidation = processOrderWithValidation;
window.updateMarketStatus = updateMarketStatus;
window.cancelPendingOrder = cancelPendingOrder;
window.updateOrderBook = updateOrderBook;
window.updateTransactionHistory = updateTransactionHistory;
window.isDOMSafe = isDOMSafe;
window.safeDOMExecute = safeDOMExecute;
window.initializeDataSyncSystem = initializeDataSyncSystem;
window.initializeTimeframeUpdateSystem = initializeTimeframeUpdateSystem;

console.log('chart-modal.js carregado com sucesso!');

// Inicialização automática quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM carregado, inicializando sistemas de sincronização...');
        try {
            initializeDataSyncSystem();
            initializeTimeframeUpdateSystem();
            console.log('Sistemas de sincronização inicializados automaticamente');
            
            // Teste de funcionamento
            setTimeout(() => {
                if (window.DataSyncSystem && window.DataSyncSystem.isReady()) {
                    console.log('✅ DataSyncSystem funcionando corretamente');
                } else {
                    console.warn('⚠️ DataSyncSystem não está funcionando');
                }
                
                if (window.TimeframeUpdateSystem && window.TimeframeUpdateSystem.isReady()) {
                    console.log('✅ TimeframeUpdateSystem funcionando corretamente');
                } else {
                    console.warn('⚠️ TimeframeUpdateSystem não está funcionando');
                }
            }, 1000);
            
        } catch (error) {
            console.error('Erro na inicialização automática:', error);
        }
    });
} else {
    // DOM já está pronto
    console.log('DOM já pronto, inicializando sistemas de sincronização...');
    try {
        initializeDataSyncSystem();
        initializeTimeframeUpdateSystem();
        console.log('Sistemas de sincronização inicializados automaticamente');
        
        // Teste de funcionamento
        setTimeout(() => {
            if (window.DataSyncSystem && window.DataSyncSystem.isReady()) {
                console.log('✅ DataSyncSystem funcionando corretamente');
            } else {
                console.warn('⚠️ DataSyncSystem não está funcionando');
            }
            
            if (window.TimeframeUpdateSystem && window.TimeframeUpdateSystem.isReady()) {
                console.log('✅ TimeframeUpdateSystem funcionando corretamente');
            } else {
                console.warn('⚠️ TimeframeUpdateSystem não está funcionando');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Erro na inicialização automática:', error);
    }
}

// ===== SISTEMA DE SINCRONIZAÇÃO CENTRALIZADO =====
// Declarado no topo para garantir inicialização antes do uso

// Função para verificar se o DOM está seguro para manipulação
function isDOMSafe() {
    return document.readyState === 'complete' || document.readyState === 'interactive';
}

// Função para executar com segurança no DOM
function safeDOMExecute(callback, fallback = null) {
    if (isDOMSafe()) {
        try {
            return callback();
        } catch (error) {
            console.error('Erro na execução segura do DOM:', error);
            if (fallback) return fallback();
            return false;
        }
    } else {
        // Aguardar DOM estar pronto
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(callback, 50);
        });
        return false;
    }
}

// Função para inicializar o sistema de sincronização
function initializeDataSyncSystem() {
    // Verificar se já existe uma instância global
    if (window.DataSyncSystem && window.DataSyncSystem.isReady) {
        console.log('DataSyncSystem já inicializado globalmente');
        return window.DataSyncSystem;
    }
    
    console.log('Inicializando DataSyncSystem...');
    
    const DataSyncSystem = {
        // Cache de dados sincronizados
        synchronizedData: {},
        
        // Última atualização
        lastUpdate: null,
        
        // Status de inicialização
        isInitialized: false,
        
        // Callbacks de componentes para atualização
        componentCallbacks: new Map(),
        
        // Inicializar sistema
        init() {
            this.isInitialized = true;
            console.log('DataSyncSystem inicializado com sucesso');
        },
        
        // Verificar se está inicializado
        isReady() {
            return this.isInitialized;
        },
        
        // Registrar callback de componente
        registerComponent(componentName, callback) {
            if (!this.isInitialized) {
                console.warn('DataSyncSystem não inicializado. Tentando novamente...');
                setTimeout(() => this.registerComponent(componentName, callback), 100);
                return;
            }
            
            this.componentCallbacks.set(componentName, callback);
            console.log(`Componente ${componentName} registrado para sincronização`);
        },
        
        // Atualizar dados centralizados
        updateData(assetSymbol, newData) {
            if (!this.isInitialized) {
                console.warn('DataSyncSystem não inicializado. Dados não podem ser atualizados.');
                return false;
            }
            
            // Evitar recursão infinita
            if (this.isNotifying) {
                console.log('Evitando updateData durante notificação para prevenir recursão');
                return false;
            }
            
            if (!this.synchronizedData[assetSymbol]) {
                this.synchronizedData[assetSymbol] = {};
            }
            
            // Mesclar novos dados
            Object.assign(this.synchronizedData[assetSymbol], newData);
            this.lastUpdate = Date.now();
            
            console.log(`Dados sincronizados para ${assetSymbol}:`, this.synchronizedData[assetSymbol]);
            
            // Notificar todos os componentes
            this.notifyComponents(assetSymbol);
            return true;
        },
        
        // Obter dados sincronizados
        getData(assetSymbol) {
            if (!this.isInitialized) {
                console.warn('DataSyncSystem não inicializado. Retornando dados locais.');
                return null;
            }
            return this.synchronizedData[assetSymbol] || null;
        },
        
        // Notificar componentes sobre mudanças
        notifyComponents(assetSymbol) {
            // Flag para evitar recursão infinita
            if (this.isNotifying) {
                console.log('Evitando recursão infinita em notifyComponents');
                return;
            }
            
            this.isNotifying = true;
            
            try {
                this.componentCallbacks.forEach((callback, componentName) => {
                    try {
                        callback(assetSymbol, this.synchronizedData[assetSymbol]);
                    } catch (error) {
                        console.error(`Erro ao notificar componente ${componentName}:`, error);
                    }
                });
            } finally {
                this.isNotifying = false;
            }
        },
        
        // Verificar consistência de dados
        verifyConsistency(assetSymbol) {
            if (!this.isInitialized) {
                console.warn('DataSyncSystem não inicializado. Consistência não pode ser verificada.');
                return false;
            }
            
            const data = this.synchronizedData[assetSymbol];
            if (!data) return false;
            
            // Verificar se preços estão consistentes
            const chartPrice = data.chartPrice;
            const listPrice = data.listPrice;
            const formPrice = data.formPrice;
            
            // Tolerância mais realista para preços (0.10 = 10 centavos)
            const tolerance = 0.10;
            
            // Verificar diferenças significativas apenas (maior que 10 centavos)
            if (chartPrice && listPrice && Math.abs(chartPrice - listPrice) > tolerance) {
                // Throttle para evitar spam - só logar a cada 60 segundos
                const now = Date.now();
                const lastLogKey = `consistency_log_${assetSymbol}`;
                if (!this[lastLogKey] || (now - this[lastLogKey]) > 60000) {
                    console.warn(`Inconsistência significativa detectada em ${assetSymbol}: Chart=${chartPrice}, List=${listPrice} (diferença: ${Math.abs(chartPrice - listPrice).toFixed(3)})`);
                    this[lastLogKey] = now;
                }
                return false;
            }
            
            if (chartPrice && formPrice && Math.abs(chartPrice - formPrice) > tolerance) {
                // Throttle para evitar spam - só logar a cada 60 segundos
                const now = Date.now();
                const lastLogKey = `consistency_log_form_${assetSymbol}`;
                if (!this[lastLogKey] || (now - this[lastLogKey]) > 60000) {
                    console.warn(`Inconsistência significativa detectada em ${assetSymbol}: Chart=${chartPrice}, Form=${formPrice} (diferença: ${Math.abs(chartPrice - formPrice).toFixed(3)})`);
                    this[lastLogKey] = now;
                }
                return false;
            }
            
            // Não logar pequenas diferenças para evitar spam no console
            return true;
        }
    };
    
    // Inicializar o sistema
    DataSyncSystem.init();
    
    // Atribuir à variável global
    window.DataSyncSystem = DataSyncSystem;
    
    return DataSyncSystem;
}

// Função para verificar sincronização em tempo real
function startCriticalSynchronization() {
    console.log('Iniciando sincronização crítica...');
    
    // Verificar sincronização a cada 10 segundos (reduzido de 2s para evitar spam)
    setInterval(() => {
        if (chartModalCurrentAsset) {
            // Verificar tempo
            verifyTimeSynchronization();
            
            // Verificar preços
            updateChartModalChartData();
            
            // Verificar consistência de dados apenas ocasionalmente (a cada 30s)
            if (window.DataSyncSystem && window.DataSyncSystem.isReady()) {
                // Verificar consistência apenas se não foi verificado recentemente
                const now = Date.now();
                if (!window.lastConsistencyCheck || (now - window.lastConsistencyCheck) > 30000) {
                    window.DataSyncSystem.verifyConsistency(chartModalCurrentAsset);
                    window.lastConsistencyCheck = now;
                }
            }
            
            // Salvar histórico
            saveChartModalHistory();
        }
    }, 10000); // Aumentado de 2000ms para 10000ms
    
    console.log('Sincronização crítica ativada');
}

// Função para forçar sincronização completa
function forceCompleteSynchronization() {
    console.log('Forçando sincronização completa...');
    
    try {
        // Sincronizar tempo
        const currentTime = verifyTimeSynchronization();
        console.log('Tempo BRT atual:', currentTime.toLocaleString('pt-BR'));
        
        // Sincronizar preços
        syncChartModalAssetsData();
        
        // Verificar dados do gráfico
        updateChartModalChartData();
        
        // Salvar histórico
        saveChartModalHistory();
        
        console.log('Sincronização completa realizada');
        return true;
        
    } catch (error) {
        console.error('Erro na sincronização completa:', error);
        return false;
    }
}

// Sistema de atualizações baseado em timeframe
function initializeTimeframeUpdateSystem() {
    // Verificar se já existe uma instância global
    if (window.TimeframeUpdateSystem && window.TimeframeUpdateSystem.isReady) {
        console.log('TimeframeUpdateSystem já inicializado globalmente');
        return window.TimeframeUpdateSystem;
    }
    
    console.log('Inicializando TimeframeUpdateSystem...');
    
    const TimeframeUpdateSystem = {
        // Intervalos de atualização por timeframe
        updateIntervals: {
            '1M': 60000,    // 1 minuto
            '5M': 300000,   // 5 minutos
            '30M': 1800000, // 30 minutos
            '1H': 3600000   // 1 hora
        },
        
        // Timers ativos
        activeTimers: new Map(),
        
        // Status de inicialização
        isInitialized: false,
        
        // Inicializar sistema
        init() {
            this.isInitialized = true;
            console.log('TimeframeUpdateSystem inicializado com sucesso');
        },
        
        // Verificar se está inicializado
        isReady() {
            return this.isInitialized;
        },
        
        // Iniciar atualizações para um timeframe
        startUpdates(timeframe, assetSymbol) {
            if (!this.isInitialized) {
                console.warn('TimeframeUpdateSystem não inicializado. Tentando novamente...');
                setTimeout(() => this.startUpdates(timeframe, assetSymbol), 100);
                return;
            }
            
            // Parar timer anterior se existir
            this.stopUpdates(timeframe);
            
            const interval = this.updateIntervals[timeframe];
            if (!interval) {
                console.warn(`Timeframe ${timeframe} não suportado`);
                return;
            }
            
            const timer = setInterval(() => {
                this.performTimeframeUpdate(timeframe, assetSymbol);
            }, interval);
            
            this.activeTimers.set(timeframe, timer);
            console.log(`Atualizações iniciadas para ${timeframe} - ${assetSymbol} a cada ${interval/1000}s`);
        },
        
        // Parar atualizações para um timeframe
        stopUpdates(timeframe) {
            const timer = this.activeTimers.get(timeframe);
            if (timer) {
                clearInterval(timer);
                this.activeTimers.delete(timeframe);
                console.log(`Atualizações paradas para ${timeframe}`);
            }
        },
        
        // Parar todas as atualizações
        stopAllUpdates() {
            this.activeTimers.forEach((timer, timeframe) => {
                clearInterval(timer);
            });
            this.activeTimers.clear();
            console.log('Todas as atualizações de timeframe paradas');
        },
        
        // Executar atualização baseada no timeframe
        performTimeframeUpdate(timeframe, assetSymbol) {
            console.log(`Executando atualização de timeframe: ${timeframe} para ${assetSymbol}`);
            
            try {
                // Verificar se o mercado está aberto
                if (!isMarketOpen()) {
                    console.log('Mercado fechado, pulando atualização');
                    return;
                }
                
                // Sincronizar dados do sistema
                syncChartModalAssetsData();
                
                // Atualizar gráfico com novos dados
                if (typeof updateTradingViewChartRealtime === 'function') {
                    updateTradingViewChartRealtime();
                }
                
                // Atualizar interface
                updateChartModalAssetDisplay(assetSymbol);
                renderChartModalAssetsList();
                
                // Verificação de consistência removida para evitar spam no console
                // A verificação será feita apenas no intervalo principal
                
            } catch (error) {
                console.error(`Erro na atualização de timeframe ${timeframe}:`, error);
            }
        }
    };
    
    // Inicializar o sistema
    TimeframeUpdateSystem.init();
    
    // Atribuir à variável global
    window.TimeframeUpdateSystem = TimeframeUpdateSystem;
    
    return TimeframeUpdateSystem;
}

// Iniciar sincronização crítica quando o modal estiver ativo
if (typeof window !== 'undefined') {
    window.startCriticalSynchronization = startCriticalSynchronization;
    window.forceCompleteSynchronization = forceCompleteSynchronization;
}

// Iniciar sincronização crítica automaticamente
setTimeout(() => {
    if (typeof startCriticalSynchronization === 'function') {
        startCriticalSynchronization();
    }
}, 1000);
