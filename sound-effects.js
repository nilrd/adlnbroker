// Sistema de Efeitos Sonoros - ADLN Broker
// 
// Este sistema adiciona efeitos sonoros aos botões e formulários da página inicial
// 
// Funcionalidades:
// - Sons de clique em botões
// - Sons de foco em campos de formulário
// - Sons de envio de formulários
// - Sons de abertura/fechamento de modais
// - Sons de sucesso e erro
// 
// Controles:
// - Ctrl+M: Alternar som ligado/desligado
// - Controle invisível no HTML (checkbox oculto)
// 
// Sons gerados sinteticamente usando Web Audio API
// Fallback silencioso para navegadores sem suporte
//
console.log('Carregando sistema de efeitos sonoros...');

// Classe para gerenciar efeitos sonoros
class SoundManager {
    constructor() {
        this.sounds = {};
        this.isEnabled = true;
        this.volume = 0.3;
        this.audioContext = null;
        this.init();
    }

    init() {
        // Criar sons sintéticos usando Web Audio API
        this.createSyntheticSounds();
        
        // Verificar controle de som
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            this.isEnabled = soundToggle.checked;
            soundToggle.addEventListener('change', (e) => {
                this.isEnabled = e.target.checked;
                console.log('Som ' + (this.isEnabled ? 'ativado' : 'desativado'));
            });
        }

        // Atalho de teclado para alternar som (Ctrl+M)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                if (soundToggle) {
                    soundToggle.checked = !soundToggle.checked;
                    this.isEnabled = soundToggle.checked;
                    console.log('Som ' + (this.isEnabled ? 'ativado' : 'desativado') + ' (Ctrl+M)');
                }
            }
        });

        console.log('Sistema de som inicializado');
    }

    createSyntheticSounds() {
        try {
            // Criar contexto de áudio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Web Audio API inicializada com sucesso');
            
            // Verificar se o contexto está suspenso (comum em navegadores)
            if (this.audioContext.state === 'suspended') {
                console.log('Contexto de áudio suspenso, aguardando interação do usuário...');
            }
        } catch (error) {
            console.log('Web Audio API não suportada, usando fallback:', error);
            this.audioContext = null;
        }
    }

    // Função para criar som de clique de botão
    createButtonClickSound() {
        if (!this.ensureAudioContext()) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Erro ao criar som de botão:', error);
        }
    }

    // Função auxiliar para verificar e resumir contexto de áudio
    ensureAudioContext() {
        if (!this.audioContext || !this.isEnabled) return false;
        
        // Tentar resumir o contexto se estiver suspenso
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Aguardar um pouco se o contexto ainda estiver suspenso
        if (this.audioContext.state === 'suspended') {
            return false;
        }
        
        return true;
    }

    // Função para criar som de foco em formulário
    createFormFocusSound() {
        if (!this.ensureAudioContext()) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        } catch (error) {
            console.log('Erro ao criar som de foco:', error);
        }
    }

    // Função para criar som de envio de formulário
    createFormSubmitSound() {
        if (!this.audioContext || !this.isEnabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        } catch (error) {
            console.log('Erro ao criar som de envio:', error);
        }
    }

    // Função para criar som de abertura de modal
    createModalOpenSound() {
        if (!this.audioContext || !this.isEnabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        } catch (error) {
            console.log('Erro ao criar som de modal aberto:', error);
        }
    }

    // Função para criar som de fechamento de modal
    createModalCloseSound() {
        if (!this.audioContext || !this.isEnabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        } catch (error) {
            console.log('Erro ao criar som de modal fechado:', error);
        }
    }

    // Função para criar som de sucesso
    createSuccessSound() {
        if (!this.audioContext || !this.isEnabled) return;
        
        try {
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator1.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
            oscillator2.frequency.setValueAtTime(659, this.audioContext.currentTime); // E5
            
            oscillator1.frequency.exponentialRampToValueAtTime(659, this.audioContext.currentTime + 0.3);
            oscillator2.frequency.exponentialRampToValueAtTime(784, this.audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator1.start(this.audioContext.currentTime);
            oscillator2.start(this.audioContext.currentTime);
            oscillator1.stop(this.audioContext.currentTime + 0.3);
            oscillator2.stop(this.audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Erro ao criar som de sucesso:', error);
        }
    }

    // Função para criar som de erro
    createErrorSound() {
        if (!this.audioContext || !this.isEnabled) return;
        
        try {
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator1.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
            oscillator2.frequency.setValueAtTime(196, this.audioContext.currentTime); // G3
            
            oscillator1.frequency.exponentialRampToValueAtTime(196, this.audioContext.currentTime + 0.2);
            oscillator2.frequency.exponentialRampToValueAtTime(174, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            oscillator1.start(this.audioContext.currentTime);
            oscillator2.start(this.audioContext.currentTime);
            oscillator1.stop(this.audioContext.currentTime + 0.2);
            oscillator2.stop(this.audioContext.currentTime + 0.2);
        } catch (error) {
            console.log('Erro ao criar som de erro:', error);
        }
    }

    // Métodos específicos para cada tipo de som
    playButtonClick() {
        this.createButtonClickSound();
    }

    playFormFocus() {
        this.createFormFocusSound();
    }

    playFormSubmit() {
        this.createFormSubmitSound();
    }

    playModalOpen() {
        this.createModalOpenSound();
    }

    playModalClose() {
        this.createModalCloseSound();
    }

    playSuccess() {
        this.createSuccessSound();
    }

    playError() {
        this.createErrorSound();
    }
}

// Instanciar gerenciador de som
let soundManager;

// Aguardar DOM carregado
document.addEventListener('DOMContentLoaded', function() {
    soundManager = new SoundManager();
    
    // Adicionar efeitos sonoros aos botões
    addButtonSounds();
    
    // Adicionar efeitos sonoros aos formulários
    addFormSounds();
    
    // Adicionar efeitos sonoros aos modais
    addModalSounds();
    
    console.log('Efeitos sonoros configurados');
});

// Função para adicionar sons aos botões
function addButtonSounds() {
    if (!soundManager) return;

    // Seletores de botões
    const buttonSelectors = [
        '.btn-login',
        '.btn-register', 
        '.btn-primary',
        '.btn-secondary',
        '.btn-submit',
        '.close-button',
        '.nav-link',
        '.product-link',
        '.social-link',
        '.footer-link',
        '.legal-link',
        '.tab'
    ];

    buttonSelectors.forEach(selector => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                soundManager.playButtonClick();
            });
        });
    });

    console.log('Sons adicionados aos botões');
}

// Função para adicionar sons aos formulários
function addFormSounds() {
    if (!soundManager) return;

    // Sons nos campos de input (focus)
    const inputSelectors = [
        '#loginCpf',
        '#loginPassword',
        '#registerName',
        '#registerSurname', 
        '#registerCpf',
        '#registerEmail',
        '#registerPhone',
        '#registerPassword',
        '#registerConfirmPassword'
    ];

    inputSelectors.forEach(selector => {
        const input = document.getElementById(selector.replace('#', ''));
        if (input) {
            input.addEventListener('focus', function() {
                soundManager.playFormFocus();
            });
        }
    });

    // Sons nos formulários (submit)
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            soundManager.playFormSubmit();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            soundManager.playFormSubmit();
        });
    }

    console.log('Sons adicionados aos formulários');
}

// Função para adicionar sons aos modais
function addModalSounds() {
    if (!soundManager) return;

    // Sons de abertura de modais
    const modalOpenButtons = [
        '#btn-login',
        '#btn-register',
        '#btn-login-hero',
        '#btn-register-hero'
    ];

    modalOpenButtons.forEach(selector => {
        const button = document.getElementById(selector.replace('#', ''));
        if (button) {
            button.addEventListener('click', function(e) {
                soundManager.playModalOpen();
            });
        }
    });

    // Sons de fechamento de modais
    const modalCloseButtons = [
        '#close-login-modal',
        '#close-register-modal', 
        '#close-welcome-modal'
    ];

    modalCloseButtons.forEach(selector => {
        const button = document.getElementById(selector.replace('#', ''));
        if (button) {
            button.addEventListener('click', function(e) {
                soundManager.playModalClose();
            });
        }
    });

    // Som ao clicar fora do modal
    const modals = ['loginModal', 'registerModal', 'welcomeModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    soundManager.playModalClose();
                }
            });
        }
    });

    console.log('Sons adicionados aos modais');
}

// Função para tocar som de sucesso (pode ser chamada externamente)
function playSuccessSound() {
    if (soundManager) {
        soundManager.playSuccess();
    }
}

// Função para tocar som de erro (pode ser chamada externamente)
function playErrorSound() {
    if (soundManager) {
        soundManager.playError();
    }
}

// Função para alternar som (pode ser chamada externamente)
function toggleSound() {
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle && soundManager) {
        soundToggle.checked = !soundToggle.checked;
        soundManager.isEnabled = soundToggle.checked;
        console.log('Som ' + (soundManager.isEnabled ? 'ativado' : 'desativado'));
    }
}

console.log('sound-effects.js carregado');
