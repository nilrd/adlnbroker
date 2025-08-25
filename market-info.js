// ===== FUNÇÕES PARA SEÇÃO DE INFORMAÇÕES DE MERCADO =====

// Função para atualizar informações de mercado
function atualizarInformacoesMercado() {
  try {
    // Atualizar status do mercado
    var statusMercado = getStatusMercado();
    var statusElement = document.getElementById('market-status-info');
    var timeElement = document.getElementById('market-time-info');
    var nextEventElement = document.getElementById('market-next-event');
    
    if (statusElement) {
      statusElement.textContent = statusMercado.texto;
      statusElement.parentElement.querySelector('.status-dot').className = 
        'status-dot ' + (statusMercado.status === 'open' ? '' : 'closed');
    }
    
    // Atualizar horário atual
    if (timeElement) {
      var agora = new Date();
      timeElement.textContent = agora.toLocaleTimeString('pt-BR');
    }
    
    // Atualizar próximo evento
    if (nextEventElement && statusMercado.proximaAbertura) {
      var proximoEvento = statusMercado.status === 'open' ? 'Fechamento' : 'Abertura';
      nextEventElement.textContent = proximoEvento + ' em breve';
    }
    
    // Atualizar estatísticas de ações
    atualizarEstatisticasAcoes();
    
  } catch (e) {
    console.warn('Erro ao atualizar informações de mercado:', e);
  }
}

// Função para atualizar estatísticas de ações (alta, baixa, estável)
function atualizarEstatisticasAcoes() {
  try {
    var stocksUp = 0;
    var stocksDown = 0;
    var stocksStable = 0;
    
    // Contar ações por variação
    ativos.forEach(function(ativo) {
      var changeElement = document.getElementById('change-' + ativo);
      if (changeElement) {
        var changeText = changeElement.textContent;
        var changeValue = parseFloat(changeText.replace(/[^\d.-]/g, ''));
        
        if (changeValue > 0) {
          stocksUp++;
        } else if (changeValue < 0) {
          stocksDown++;
        } else {
          stocksStable++;
        }
      }
    });
    
    // Atualizar elementos na interface
    var upElement = document.getElementById('stocks-up');
    var downElement = document.getElementById('stocks-down');
    var stableElement = document.getElementById('stocks-stable');
    
    if (upElement) upElement.textContent = stocksUp;
    if (downElement) downElement.textContent = stocksDown;
    if (stableElement) stableElement.textContent = stocksStable;
    
  } catch (e) {
    console.warn('Erro ao atualizar estatísticas de ações:', e);
  }
}

// Função para sincronizar informações de mercado com o relógio da bolsa
function sincronizarInformacoesMercado() {
  // Sincronizar com elementos existentes do relógio da bolsa
  var marketStatusText = document.getElementById('market-status-text');
  var marketTime = document.getElementById('market-time');
  var marketCountdown = document.getElementById('market-countdown');
  
  var marketStatusInfo = document.getElementById('market-status-info');
  var marketTimeInfo = document.getElementById('market-time-info');
  var marketNextEvent = document.getElementById('market-next-event');
  
  if (marketStatusText && marketStatusInfo) {
    marketStatusInfo.textContent = marketStatusText.textContent;
  }
  
  if (marketTime && marketTimeInfo) {
    marketTimeInfo.textContent = marketTime.textContent;
  }
  
  if (marketCountdown && marketNextEvent) {
    marketNextEvent.textContent = marketCountdown.textContent;
  }
}

// Função para inicializar a seção de informações de mercado
function inicializarInformacoesMercado() {
  debug('Inicializando seção de informações de mercado');
  
  // Atualizar informações iniciais
  atualizarInformacoesMercado();
  
  // Configurar atualização automática a cada 5 segundos
  setInterval(function() {
    atualizarInformacoesMercado();
    sincronizarInformacoesMercado();
  }, 5000);
  
  debug('Seção de informações de mercado inicializada');
}

// Adicionar ao evento de carregamento do dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Aguardar um pouco para garantir que outros elementos foram carregados
  setTimeout(inicializarInformacoesMercado, 1000);
});

// Expor funções globalmente para uso em outros scripts
window.atualizarInformacoesMercado = atualizarInformacoesMercado;
window.sincronizarInformacoesMercado = sincronizarInformacoesMercado;

