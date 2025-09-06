// ===== DASHBOARD HEADER FUNCTIONALITY =====
// Este arquivo contém apenas funcionalidades para o header do dashboard

// Sistema de idiomas integrado com o sistema global
var currentLanguage = 'pt'; // Padrão: Português

// Função para alternar idioma - Temporariamente desabilitada
function toggleLanguage() {
    // Mostrar modal informando que a funcionalidade está em desenvolvimento
    showTranslationDevelopmentModal();
    console.log('Funcionalidade de tradução em desenvolvimento');
}

// Função para mostrar modal de tradução em desenvolvimento - OTIMIZADA
function showTranslationDevelopmentModal() {
    // Criar modal se não existir
    let modal = document.getElementById('translation-dev-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'translation-dev-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🌍 Sistema de Tradução</h2>
                    <span class="close" onclick="closeTranslationDevModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; padding: 4px;">
                        <div style="font-size: 36px; margin-bottom: 12px; color: #F0B90B;">🚧</div>
                        <h3 style="margin: 0 0 10px 0; color: #F0B90B; font-size: 16px; font-weight: 600;">Em Desenvolvimento</h3>
                        <p style="margin: 0 0 16px 0; line-height: 1.4; color: #e0e0e0; font-size: 13px;">
                            A funcionalidade de tradução para múltiplos idiomas está sendo desenvolvida e será disponibilizada em breve.
                        </p>
                        <div style="background: rgba(240, 185, 11, 0.1); border: 1px solid rgba(240, 185, 11, 0.3); border-radius: 8px; padding: 12px; margin: 12px 0; text-align: left;">
                            <h4 style="margin: 0 0 10px 0; font-weight: 600; color: #F0B90B; font-size: 14px; text-align: center;">Funcionalidades Planejadas:</h4>
                            <ul style="margin: 0; padding-left: 12px; list-style: none;">
                                <li style="margin: 4px 0; color: #e0e0e0; font-size: 12px; line-height: 1.3;">🌐 Tradução completa do sistema</li>
                                <li style="margin: 4px 0; color: #e0e0e0; font-size: 12px; line-height: 1.3;">🇧🇷🇺🇸 Suporte a Português e Inglês</li>
                                <li style="margin: 4px 0; color: #e0e0e0; font-size: 12px; line-height: 1.3;">💾 Persistência de preferências</li>
                                <li style="margin: 4px 0; color: #e0e0e0; font-size: 12px; line-height: 1.3;">⚡ Tradução em tempo real</li>
                            </ul>
                        </div>
                        <div style="margin: 12px 0 0 0; padding: 10px; background: rgba(160, 160, 160, 0.1); border-radius: 6px; border: 1px solid rgba(160, 160, 160, 0.2);">
                            <p style="margin: 0; font-style: italic; color: #9CA3AF; font-size: 12px;">Por enquanto, o sistema permanecerá em Português.</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="closeTranslationDevModal()" class="btn-primary">Entendi</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Mostrar modal
    modal.style.display = 'block';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Adicionar evento para fechar ao clicar fora do modal (apenas uma vez)
    if (!modal.hasAttribute('data-click-listener')) {
        modal.setAttribute('data-click-listener', 'true');
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeTranslationDevModal();
            }
        });
    }
}

// Função para fechar modal de tradução em desenvolvimento
function closeTranslationDevModal() {
    const modal = document.getElementById('translation-dev-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Remover o modal do DOM para evitar acúmulo
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Função para atualizar exibição do idioma
function updateLanguageDisplay() {
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        const icon = languageToggle.querySelector('i');
        // Manter ícone de globo para indicar funcionalidade de idioma
        icon.className = 'fa-solid fa-globe';
        languageToggle.title = 'Sistema de Tradução em Desenvolvimento';
    }
    
    // Atualizar tooltips
    updateHeaderTooltips();
}

// Função para atualizar todos os elementos de idioma
function updateAllLanguageElements() {
    // Por enquanto, manter tudo em português
    const elements = document.querySelectorAll('[data-en][data-pt]');
    elements.forEach(element => {
        element.textContent = element.getAttribute('data-pt') || element.textContent;
    });
}

// Função para salvar preferência de idioma
function saveLanguagePreference() {
    localStorage.setItem('dashboardLanguage', currentLanguage);
}

// Função para carregar preferência de idioma
function loadLanguagePreference() {
    const savedLanguage = localStorage.getItem('dashboardLanguage');
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
        currentLanguage = savedLanguage;
    }
    updateLanguageDisplay();
    updateAllLanguageElements();
}

// Função para alternar visibilidade do saldo
function toggleBalanceVisibility() {
  console.log('🔄 toggleBalanceVisibility chamada');
  
  const balanceDisplay = document.getElementById('balanceDisplay');
  const balanceToggle = document.getElementById('balanceToggle');
  const saldoElement = document.getElementById('saldo');
  const balanceVariation = document.getElementById('balanceVariation');
  
  console.log('Elementos encontrados:', {
    balanceDisplay: !!balanceDisplay,
    balanceToggle: !!balanceToggle,
    saldoElement: !!saldoElement,
    balanceVariation: !!balanceVariation
  });
  
  if (!balanceDisplay || !balanceToggle || !saldoElement) {
    console.warn('❌ Elementos de saldo não encontrados');
    return;
  }
  
  const isHidden = balanceDisplay.classList.contains('balance-hidden');
  const toggleIcon = balanceToggle.querySelector('i');
  
  console.log('Estado atual:', { isHidden, toggleIcon: !!toggleIcon });
  
  if (isHidden) {
    // Mostrar saldo
    console.log('👁️ Mostrando saldo...');
    balanceDisplay.classList.remove('balance-hidden');
    balanceToggle.setAttribute('aria-pressed', 'false');
    balanceToggle.setAttribute('aria-label', 'Ocultar saldo');
    balanceToggle.title = 'Ocultar saldo';
    
    if (toggleIcon) {
      toggleIcon.className = 'fa-solid fa-eye';
      console.log('✅ Ícone alterado para olho aberto');
    }
    
    // Restaurar valor real do saldo
    if (window.usuarioAtual && window.usuarios && window.usuarios[window.usuarioAtual]) {
      const usuario = window.usuarios[window.usuarioAtual];
      const saldoFormatado = usuario.saldo.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      saldoElement.textContent = saldoFormatado;
      console.log('✅ Saldo restaurado:', saldoFormatado);
    } else {
      // Fallback para valor padrão
      saldoElement.textContent = '100.000,00';
      console.log('⚠️ Usando valor padrão do saldo');
    }
    
    // Mostrar variação se existir
    if (balanceVariation) {
      balanceVariation.style.display = 'flex';
      console.log('✅ Variação mostrada');
    }
    
    console.log('✅ Saldo revelado com sucesso');
  } else {
    // Ocultar saldo
    console.log('🙈 Ocultando saldo...');
    balanceDisplay.classList.add('balance-hidden');
    balanceToggle.setAttribute('aria-pressed', 'true');
    balanceToggle.setAttribute('aria-label', 'Mostrar saldo');
    balanceToggle.title = 'Mostrar saldo';
    
    if (toggleIcon) {
      toggleIcon.className = 'fa-solid fa-eye-slash';
      console.log('✅ Ícone alterado para olho fechado');
    }
    
    // Mascarar saldo
    saldoElement.textContent = '•••••••';
    console.log('✅ Saldo mascarado');
    
    // Ocultar variação
    if (balanceVariation) {
      balanceVariation.style.display = 'none';
      console.log('✅ Variação ocultada');
    }
    
    console.log('✅ Saldo ocultado com sucesso');
  }
  
  // Salvar preferência
  saveBalancePreference(!isHidden);
}

// Função para carregar preferência de visibilidade do saldo
function loadBalancePreference() {
  console.log('🔍 Carregando preferência de visibilidade do saldo...');
  const isHidden = localStorage.getItem('balanceHidden') === 'true';
  console.log('📋 Preferência de saldo oculto:', isHidden);
  
  if (isHidden) {
    console.log('🙈 Aplicando estado oculto do saldo...');
    // Aplicar estado oculto sem animação
    const balanceDisplay = document.getElementById('balanceDisplay');
    const balanceToggle = document.getElementById('balanceToggle');
    const saldoElement = document.getElementById('saldo');
    const balanceVariation = document.getElementById('balanceVariation');
    const toggleIcon = balanceToggle?.querySelector('i');
    
    if (balanceDisplay) {
      balanceDisplay.classList.add('balance-hidden');
    }
    
    if (balanceToggle) {
      balanceToggle.setAttribute('aria-pressed', 'true');
      balanceToggle.setAttribute('aria-label', 'Mostrar saldo');
      balanceToggle.title = 'Mostrar saldo';
    }
    
    if (toggleIcon) {
      toggleIcon.className = 'fa-solid fa-eye-slash';
    }
    
    if (saldoElement) {
      saldoElement.textContent = '•••••••';
    }
    
    if (balanceVariation) {
      balanceVariation.style.display = 'none';
    }
    
    console.log('✅ Preferência de saldo carregada: oculto');
  } else {
    console.log('✅ Preferência de saldo carregada: visível');
  }
}

// Função para salvar preferência de visibilidade do saldo
function saveBalancePreference(isHidden) {
  localStorage.setItem('balanceHidden', isHidden.toString());
  console.log(`💾 Preferência de saldo salva: ${isHidden ? 'oculto' : 'visível'}`);
}

// Função para alternar menu do header
function toggleHeaderMenu() {
    const dropdown = document.getElementById('header-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        
        // Fechar menu ao clicar fora
        if (dropdown.classList.contains('show')) {
            setTimeout(() => {
                document.addEventListener('click', closeHeaderMenu);
            }, 100);
        }
        
        console.log('Menu do header alternado');
    } else {
        console.warn('Dropdown do header não encontrado');
    }
}

// Função para fechar menu do header
function closeHeaderMenu() {
    const dropdown = document.getElementById('header-dropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
        console.log('Menu do header fechado');
    }
    document.removeEventListener('click', closeHeaderMenu);
}

// Função para atualizar informações do usuário no header
function updateHeaderUserInfo(username, balance, variation) {
    console.log('🔄 updateHeaderUserInfo chamada com:', { username, balance, variation });
    
    // Atualizar nome do usuário com fallback inteligente
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        console.log('✅ Elemento username encontrado para atualização');
        
        // Verificar se já tem um username válido e se o novo username é válido
        const currentText = usernameElement.textContent;
        const hasValidUsername = currentText && 
                               currentText.trim() !== '' && 
                               currentText !== 'Carregando...' && 
                               currentText !== 'Loading...' && 
                               currentText !== 'Bem-vindo!' && 
                               currentText !== 'Welcome!';
        
        if (username && username.trim() !== '') {
            // Username fornecido - usar diretamente
            console.log(`👤 Atualizando username para: ${username}`);
            usernameElement.textContent = username;
            usernameElement.classList.remove('loading-placeholder', 'skeleton-loading');
            usernameElement.setAttribute('aria-label', `Usuário: ${username}`);
            
            // Salvar username para uso futuro
            localStorage.setItem('userName', username);
            sessionStorage.setItem('userName', username);
            
            console.log(`✅ Username atualizado com sucesso: ${username}`);
        } else if (hasValidUsername) {
            console.log('✅ Username já está definido e válido, mantendo:', currentText);
            return; // Não sobrescrever se já tem um username válido
        } else {
            console.log('⚠️ Username não fornecido, tentando carregar de fontes alternativas...');
            // Tentar carregar de diferentes fontes
            const savedUsername = localStorage.getItem('userName') || 
                                sessionStorage.getItem('userName') ||
                                window.userName ||
                                window.currentUser?.name ||
                                window.sessionData?.userName;
            
            console.log('🔍 Fontes alternativas testadas:', {
                localStorage: localStorage.getItem('userName'),
                sessionStorage: sessionStorage.getItem('userName'),
                windowUserName: window.userName,
                windowCurrentUser: window.currentUser?.name,
                windowSessionData: window.sessionData?.userName
            });
            
            if (savedUsername && savedUsername.trim() !== '') {
                console.log(`✅ Username carregado do cache: ${savedUsername}`);
                usernameElement.textContent = savedUsername;
                usernameElement.classList.remove('loading-placeholder', 'skeleton-loading');
                usernameElement.setAttribute('aria-label', `Usuário: ${savedUsername}`);
            } else {
                console.log('❌ Username não encontrado em fontes alternativas, usando fallback genérico');
                // Fallback para placeholder genérico
                const fallbackText = currentLanguage === 'pt' ? 'Bem-vindo!' : 'Welcome!';
                usernameElement.textContent = fallbackText;
                usernameElement.classList.remove('loading-placeholder', 'skeleton-loading');
                usernameElement.setAttribute('aria-label', 'Usuário não identificado');
            }
        }
    }
    
    // Atualizar saldo
    const saldoElement = document.getElementById('saldo');
    if (saldoElement && balance !== undefined) {
        // Verificar se o saldo deve estar oculto
        const balanceDisplay = document.getElementById('balanceDisplay');
        const isHidden = balanceDisplay && (balanceDisplay.classList.contains('balance-hidden') || 
                                          balanceDisplay.classList.contains('hidden'));
        
        if (isHidden) {
            // Se estiver oculto, manter mascarado
            saldoElement.textContent = '•••••••';
        } else {
            // Se estiver visível, mostrar valor real
            saldoElement.textContent = balance.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        
        console.log(`💰 Saldo atualizado: ${balance.toLocaleString('pt-BR')} (oculto: ${isHidden})`);
    }
    
    // Atualizar variação - FUNCIONALIDADE REMOVIDA
    // if (variation !== undefined) {
    //     // Funcionalidade de variação removida
    // }
    
    // Atualizar timestamp
    const balanceDisplay = document.getElementById('balanceDisplay');
    if (balanceDisplay) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Usar sistema de tradução se disponível
        if (typeof getTranslation === 'function') {
            const updatedText = getTranslation('updatedAt', currentLanguage);
            balanceDisplay.title = `${updatedText}: ${timeString}`;
        } else {
            balanceDisplay.title = currentLanguage === 'pt' 
                ? `Atualizado em: ${timeString}` 
                : `Updated at: ${timeString}`;
        }
    }
}

// Função para atualizar mensagem de boas-vindas
function updateWelcomeMessage() {
    const welcomeText = document.querySelector('.welcome-text');
    if (welcomeText) {
        welcomeText.textContent = 'Bem-vindo,';
    }
}

// Função para preservar username ao trocar idioma
function preserveUsernameOnLanguageChange() {
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        // Verificar se já temos um username válido
        const currentUsername = usernameElement.textContent;
        const isPlaceholder = currentUsername === 'Carregando...' || 
                             currentUsername === 'Loading...' || 
                             currentUsername === 'Bem-vindo!' || 
                             currentUsername === 'Welcome!';
        
        if (!isPlaceholder) {
            // Preservar o username atual
            localStorage.setItem('userName', currentUsername);
            sessionStorage.setItem('userName', currentUsername);
            console.log(`Username preservado na troca de idioma: ${currentUsername}`);
        }
    }
}

// Função para atualizar variação do saldo no header - REMOVIDA COMPLETAMENTE
// function atualizarVariacaoBalanceHeader() {
//     // Funcionalidade removida do sistema
// }

// Função para sincronizar saldo com o sistema principal - REMOVIDA COMPLETAMENTE
// function sincronizarSaldoHeader() {
//     // Funcionalidade removida do sistema
// }

// Função para atualizar tooltips do header
function updateHeaderTooltips() {
    // Atualizar tooltip do botão de carteira
    const walletBtn = document.getElementById('walletBtn');
    if (walletBtn) {
        walletBtn.title = 'Carteira/Portfólio';
    }
    
    // Atualizar tooltip do botão de idioma
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.title = 'Sistema de Tradução em Desenvolvimento';
    }
    
    // Atualizar tooltip do botão de perfil
    const profileBtn = document.querySelector('.header-action-btn[onclick*="openAccountModal"]');
    if (profileBtn) {
        profileBtn.title = 'Perfil/Configurações';
    }
    
    // Atualizar tooltip do botão de menu
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.title = 'Menu';
    }
}

// Variável para controlar se já foi inicializado
var headerInitialized = false;

// Função para inicializar funcionalidades do header
function initDashboardHeader() {
  if (headerInitialized) {
    console.log('⚠️ Header já foi inicializado, pulando inicialização dupla');
    return;
  }
  
  console.log('🚀 Inicializando funcionalidades do header...');
  headerInitialized = true;
  
  // Carregar preferências
  loadLanguagePreference();
  loadBalancePreference(); // Reativada a funcionalidade
  
  // Tentar carregar username da sessão
  console.log('👤 Iniciando carregamento do username...');
  loadUsernameFromSession();
  
  // Toggle de saldo - FUNCIONALIDADE REATIVADA
  const balanceToggle = document.getElementById('balanceToggle');
  if (balanceToggle) {
    // Verificar se já tem event listener
    if (!balanceToggle.hasAttribute('data-listener-added')) {
      balanceToggle.addEventListener('click', function(e) {
        console.log('🖱️ Clique no toggle de saldo detectado');
        e.preventDefault();
        e.stopPropagation();
        toggleBalanceVisibility();
      });
      
      // Marcar que o listener foi adicionado
      balanceToggle.setAttribute('data-listener-added', 'true');
      
      console.log('✅ Toggle de saldo configurado com sucesso');
    } else {
      console.log('✅ Toggle de saldo já configurado');
    }
    
    console.log('🔍 Elemento balanceToggle:', balanceToggle);
  } else {
    console.warn('❌ Elemento balanceToggle não encontrado durante inicialização');
  }
  
  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    const menuBtn = document.querySelector('.menu-btn');
    const dropdown = document.getElementById('header-dropdown');
    
    if (dropdown && !menuBtn?.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
      console.log('Menu fechado ao clicar fora');
    }
  });
  
  // Atualizar idioma ao carregar a página
  updateAllLanguageElements();
  
  // Atualizar tooltips
  updateHeaderTooltips();
  
  console.log('Header inicializado com sucesso!');
}

// Função para carregar username da sessão
function loadUsernameFromSession() {
  console.log('🔍 Carregando username da sessão...');
  const usernameElement = document.getElementById('username');
  if (!usernameElement) {
    console.warn('❌ Elemento username não encontrado');
    return;
  }
  
  console.log('✅ Elemento username encontrado:', usernameElement);
  
  // Verificar se já tem um username válido (não é placeholder)
  const currentText = usernameElement.textContent;
  const isValidUsername = currentText && 
                         currentText.trim() !== '' && 
                         currentText !== 'Carregando...' && 
                         currentText !== 'Loading...' && 
                         currentText !== 'Bem-vindo!' && 
                         currentText !== 'Welcome!';
  
  if (isValidUsername) {
    console.log('✅ Username já está definido:', currentText);
    return; // Não sobrescrever se já tem um username válido
  }
  
  // Mostrar skeleton loading inicialmente
  usernameElement.textContent = currentLanguage === 'pt' ? 'Carregando...' : 'Loading...';
  usernameElement.classList.add('skeleton-loading');
  usernameElement.setAttribute('aria-label', 'Carregando usuário...');
  
  // Tentar diferentes fontes de dados do usuário
  const possibleUsernameSources = [
    { name: 'window.userName', source: () => window.userName },
    { name: 'window.currentUser?.name', source: () => window.currentUser?.name },
    { name: 'window.sessionData?.userName', source: () => window.sessionData?.userName },
    { name: 'localStorage.userName', source: () => localStorage.getItem('userName') },
    { name: 'sessionStorage.userName', source: () => sessionStorage.getItem('userName') },
    { name: 'data-username attribute', source: () => document.querySelector('[data-username]')?.getAttribute('data-username') },
    { name: 'window.usuarios[usuarioAtual]?.nome', source: () => window.usuarioAtual ? window.usuarios?.[window.usuarioAtual]?.nome : null }
  ];
  
  console.log('🔍 Testando fontes de username...');
  let username = null;
  for (const { name, source } of possibleUsernameSources) {
    try {
      const result = source();
      console.log(`📋 ${name}:`, result);
      if (result && result.trim() !== '') {
        username = result;
        console.log(`✅ Username encontrado em: ${name}`);
        break;
      }
    } catch (e) {
      console.log(`❌ Erro ao testar ${name}:`, e.message);
    }
  }
  
  if (username && username.trim() !== '') {
    updateHeaderUserInfo(username);
    console.log(`✅ Username carregado da sessão: ${username}`);
  } else {
    console.log('⚠️ Username não encontrado na sessão, usando fallback');
    // Usar fallback mais amigável
    const fallbackText = currentLanguage === 'pt' ? 'Bem-vindo!' : 'Welcome!';
    usernameElement.textContent = fallbackText;
    usernameElement.classList.remove('skeleton-loading');
    usernameElement.setAttribute('aria-label', 'Usuário não identificado');
    
    // Tentar novamente após um delay para ver se as variáveis globais foram definidas
    setTimeout(() => {
      console.log('🔄 Tentando carregar username novamente após delay...');
      const retryUsername = window.userName || 
                           window.currentUser?.name ||
                           window.sessionData?.userName ||
                           localStorage.getItem('userName') ||
                           sessionStorage.getItem('userName');
      
      if (retryUsername && retryUsername.trim() !== '') {
        console.log(`✅ Username encontrado no retry: ${retryUsername}`);
        updateHeaderUserInfo(retryUsername);
      } else {
        console.log('❌ Username ainda não encontrado no retry');
      }
    }, 500);
  }
}

// Função para aplicar tema escuro ao header
function applyHeaderDarkTheme() {
    const header = document.getElementById('dashboard-header');
    if (header) {
        header.classList.add('dark-theme');
    }
}

// Função para remover tema escuro do header
function removeHeaderDarkTheme() {
    const header = document.getElementById('dashboard-header');
    if (header) {
        header.classList.remove('dark-theme');
    }
}

// Função para tornar header compacto
function makeHeaderCompact() {
    const header = document.getElementById('dashboard-header');
    if (header) {
        header.classList.add('header-compact');
    }
}

// Função para remover compactação do header
function removeHeaderCompact() {
    const header = document.getElementById('dashboard-header');
    if (header) {
        header.classList.remove('header-compact');
    }
}

// Função para ocultar header
function hideHeader() {
    const header = document.getElementById('dashboard-header');
    if (header) {
        header.classList.add('header-hidden');
    }
}

// Função para mostrar header
function showHeader() {
    const header = document.getElementById('dashboard-header');
    if (header) {
        header.classList.remove('header-hidden');
    }
}

// Sistema de scroll inteligente para o header
var headerLastScrollTop = 0;
var headerScrollThreshold = 100;

function handleHeaderScroll() {
    const header = document.getElementById('dashboard-header');
    if (!header) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = scrollTop - headerLastScrollTop;
    
    // Tornar header compacto ao fazer scroll para baixo
    if (scrollTop > headerScrollThreshold) {
      if (scrollDelta > 0 && scrollTop > 200) {
        // Scroll para baixo - ocultar header
        hideHeader();
      } else if (scrollDelta < 0) {
        // Scroll para cima - mostrar header
        showHeader();
        makeHeaderCompact();
      }
    } else {
      // No topo - mostrar header completo
      showHeader();
      removeHeaderCompact();
    }
    
    headerLastScrollTop = scrollTop;
}

// Função para inicializar scroll inteligente
function initHeaderScrollIntelligence() {
    window.addEventListener('scroll', handleHeaderScroll);
    console.log('Scroll inteligente do header inicializado');
}

// Função para desabilitar scroll inteligente
function disableHeaderScrollIntelligence() {
    window.removeEventListener('scroll', handleHeaderScroll);
    console.log('Scroll inteligente do header desabilitado');
}

// Função para definir threshold do scroll
function setHeaderScrollThreshold(threshold) {
    headerScrollThreshold = threshold;
    console.log(`Threshold do scroll do header definido para: ${threshold}px`);
}

// Exportar funções para uso global
window.toggleLanguage = toggleLanguage;
window.toggleBalanceVisibility = toggleBalanceVisibility; // FUNCIONALIDADE REATIVADA
window.toggleHeaderMenu = toggleHeaderMenu;
window.updateHeaderUserInfo = updateHeaderUserInfo;
window.initDashboardHeader = initDashboardHeader;
window.loadUsernameFromSession = loadUsernameFromSession; // Exportar para uso externo
window.applyHeaderDarkTheme = applyHeaderDarkTheme;
window.removeHeaderDarkTheme = removeHeaderDarkTheme;
window.makeHeaderCompact = makeHeaderCompact;
window.removeHeaderCompact = removeHeaderCompact;
window.hideHeader = hideHeader;
window.showHeader = showHeader;
window.initHeaderScrollIntelligence = initHeaderScrollIntelligence;
window.disableHeaderScrollIntelligence = disableHeaderScrollIntelligence;
window.setHeaderScrollThreshold = setHeaderScrollThreshold;
window.showTranslationDevelopmentModal = showTranslationDevelopmentModal;
window.closeTranslationDevModal = closeTranslationDevModal;

// Funções de saldo - REMOVIDAS COMPLETAMENTE
// window.sincronizarSaldoHeader = sincronizarSaldoHeader;
// window.atualizarVariacaoBalanceHeader = atualizarVariacaoBalanceHeader;

// Sistema global de privacidade do saldo - REMOVIDO COMPLETAMENTE
// function initGlobalBalancePrivacy() {
//     // Funcionalidade removida do sistema
// }

// Inicialização automática quando o DOM estiver pronto
console.log('📄 dashboard-header.js carregado, estado do DOM:', document.readyState);

function delayedInit() {
    // Aguardar um pouco para garantir que outros scripts tenham carregado
    setTimeout(() => {
        console.log('⏰ Inicialização atrasada do header...');
        initDashboardHeader();
        initHeaderScrollIntelligence();
    }, 100);
}

if (document.readyState === 'loading') {
    console.log('⏳ DOM ainda carregando, aguardando DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOMContentLoaded disparado');
        delayedInit();
    });
} else {
    console.log('✅ DOM já está pronto, inicializando com delay...');
    // DOM já está pronto, mas aguardar outros scripts
    delayedInit();
}

console.log('dashboard-header.js carregado com sucesso!');
