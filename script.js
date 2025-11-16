/**
 * ================================================================
 * NEXIA V3.0 - Neural AI Assistant
 * Ultra Advanced JavaScript with Premium Features
 * ================================================================
 */

'use strict';

// ================================================================
// Configuration & Constants
// ================================================================

const CONFIG = {
    MISTRAL_API_URL: 'https://api.mistral.ai/v1/chat/completions',
    MISTRAL_API_KEY: 'YOUR_MISTRAL_API_KEY', // Replace with actual API key
    MODEL: 'mistral-small-latest',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    MAX_HISTORY: 100,
    MAX_CHAR_COUNT: 4000,
    TYPEWRITER_SPEED: 15,
    AUTOSAVE_INTERVAL: 3000,
    NEURAL_PARTICLES: 80,
    VERSION: '3.0.0'
};

const STORAGE_KEYS = {
    CHAT_HISTORY: 'nexia_v3_chat_history',
    CHAT_SESSIONS: 'nexia_v3_chat_sessions',
    THEME: 'nexia_v3_theme',
    MODE: 'nexia_v3_mode',
    SOUND: 'nexia_v3_sound',
    SESSION_START: 'nexia_v3_session_start',
    SETTINGS: 'nexia_v3_settings',
    RECENT_EMOJIS: 'nexia_v3_recent_emojis'
};

const SOUND_EFFECTS = {
    SEND: [800, 0.1],
    RECEIVE: [600, 0.15],
    ERROR: [400, 0.2],
    CLICK: [900, 0.05],
    SUCCESS: [1000, 0.1],
    NOTIFICATION: [700, 0.12]
};

const COMMANDS = {
    '@summarize': 'Resumir conversa atual',
    '@translate': 'Traduzir última mensagem',
    '@code': 'Gerar código',
    '@analyze': 'Análise profunda',
    '@explain': 'Explicar conceito',
    '@rewrite': 'Reescrever texto',
    '@brainstorm': 'Brainstorming de ideias',
    '@debug': 'Debug de código'
};

const EMOJI_CATEGORIES = {
    recent: ['😊', '👍', '❤️', '🔥', '✨', '🎉', '💯', '👏'],
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'],
    people: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍'],
    nature: ['🌿', '🍀', '🎋', '🎍', '🌾', '🌱', '🌲', '🌳', '🌴', '🌵', '🌷', '🌸', '🌹', '🥀', '🌺', '🌻', '🌼', '🌽', '🌾', '🌿'],
    food: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧈', '🧇', '🥓', '🥚', '🍳', '🧀', '🥗', '🥙', '🥪', '🌮', '🌯', '🥫', '🍝', '🍜', '🍲'],
    activity: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳'],
    travel: ['✈️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥', '🛳', '⛴', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🚏', '🗺', '🗿', '🗽'],
    objects: ['💡', '🔦', '🕯', '🪔', '🧯', '🛢', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️']
};

// ================================================================
// State Management
// ================================================================

const state = {
    currentMode: 'general',
    currentSessionId: null,
    chatSessions: [],
    chatHistory: [],
    isProcessing: false,
    soundEnabled: true,
    voiceEnabled: false,
    ttsEnabled: false,
    sessionStartTime: Date.now(),
    messageCount: 0,
    tokenCount: 0,
    recognition: null,
    audioContext: null,
    synthesis: null,
    settings: {
        theme: 'dark',
        animations: true,
        temperature: 0.7,
        maxTokens: 2000,
        codeFormatting: true,
        contextLength: 10,
        systemSounds: true,
        notifications: false,
        saveHistory: true,
        devMode: false
    },
    contextPills: [],
    currentContext: null,
    selectedMessage: null,
    commandPaletteVisible: false,
    neuralParticles: []
};

// ================================================================
// DOM Elements Cache
// ================================================================

const elements = {
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    newChatBtn: document.getElementById('newChatBtn'),
    chatHistory: document.getElementById('chatHistory'),
    
    // Header
    menuToggle: document.getElementById('menuToggle'),
    themeToggle: document.getElementById('themeToggle'),
    soundBtn: document.getElementById('soundBtn'),
    voiceBtn: document.getElementById('voiceBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    exportBtn: document.getElementById('exportBtn'),
    menuBtn: document.getElementById('menuBtn'),
    modeMenu: document.getElementById('modeMenu'),
    currentModeDisplay: document.getElementById('currentModeDisplay'),
    neuralStatus: document.getElementById('neuralStatus'),
    aiPrecision: document.getElementById('aiPrecision'),
    tokenCount: document.getElementById('tokenCount'),
    modeButtons: document.querySelectorAll('.mode-btn'),
    quickActionBtns: document.querySelectorAll('.quick-action-btn'),
    
    // Chat
    chatMessages: document.getElementById('chatMessages'),
    suggestions: document.getElementById('suggestions'),
    typingIndicator: document.getElementById('typingIndicator'),
    scrollBottomBtn: document.getElementById('scrollBottomBtn'),
    unreadCount: document.getElementById('unreadCount'),
    
    // Input
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    emojiBtn: document.getElementById('emojiBtn'),
    attachBtn: document.getElementById('attachBtn'),
    cameraBtn: document.getElementById('cameraBtn'),
    micBtn: document.getElementById('micBtn'),
    fileInput: document.getElementById('fileInput'),
    charCount: document.getElementById('charCount'),
    quickTip: document.getElementById('quickTip'),
    processingStatus: document.getElementById('processingStatus'),
    contextPills: document.getElementById('contextPills'),
    filePreview: document.getElementById('filePreview'),
    
    // Modals & Overlays
    settingsModal: document.getElementById('settingsModal'),
    closeSettings: document.getElementById('closeSettings'),
    commandPalette: document.getElementById('commandPalette'),
    commandSearch: document.getElementById('commandSearch'),
    commandList: document.getElementById('commandList'),
    contextMenu: document.getElementById('contextMenu'),
    emojiPicker: document.getElementById('emojiPicker'),
    emojiSearch: document.getElementById('emojiSearch'),
    emojiGrid: document.getElementById('emojiGrid'),
    emojiCategories: document.querySelectorAll('.emoji-category'),
    
    // Footer
    totalMessages: document.getElementById('totalMessages'),
    sessionTime: document.getElementById('sessionTime'),
    totalTokens: document.getElementById('totalTokens'),
    
    // Other
    toastContainer: document.getElementById('toastContainer'),
    neuralCanvas: document.getElementById('neuralCanvas'),
    loadingScreen: document.getElementById('loadingScreen'),
    
    // Loading stats
    loadNeurons: document.getElementById('loadNeurons'),
    loadSynapses: document.getElementById('loadSynapses'),
    loadModules: document.getElementById('loadModules'),
    loadProgress: document.getElementById('loadProgress')
};

// ================================================================
// Initialization
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 NEXIA V3.0 Neural Network Initializing...', 'color: #8b5cf6; font-size: 20px; font-weight: bold;');
    
    initializeApp();
});

async function initializeApp() {
    try {
        // Show loading animation
        await simulateLoading();
        
        // Initialize core systems
        loadSettings();
        loadSavedState();
        initializeNeuralCanvas();
        registerServiceWorker();
        setupEventListeners();
        setupVoiceRecognition();
        setupTextToSpeech();
        setupKeyboardShortcuts();
        startSessionTimer();
        initializeEmojiPicker();
        
        // Show welcome message
        await showWelcomeMessage();
        
        // Hide loading screen
        setTimeout(() => {
            if (elements.loadingScreen) {
                elements.loadingScreen.style.display = 'none';
            }
        }, 3500);
        
        // Focus input
        elements.messageInput?.focus();
        
        // Check for notifications permission
        checkNotificationPermission();
        
        console.log('%c✨ NEXIA V3.0 Ready - All Systems Online', 'color: #06b6d4; font-size: 16px; font-weight: bold;');
        
        // Show random tip
        rotateTips();
        
    } catch (error) {
        console.error('❌ Critical initialization error:', error);
        showToast('Erro ao inicializar o sistema. Recarregue a página.', 'error');
    }
}

// ================================================================
// Loading Simulation
// ================================================================

async function simulateLoading() {
    const steps = [
        { label: 'neurons', target: 10000, duration: 800 },
        { label: 'synapses', target: 50000, duration: 1000 },
        { label: 'modules', targetText: '12/12', duration: 1200 }
    ];
    
    // Animate loading stats
    for (const step of steps) {
        if (step.label === 'modules') {
            for (let i = 0; i <= 12; i++) {
                if (elements.loadModules) {
                    elements.loadModules.textContent = `${i}/12`;
                }
                await sleep(step.duration / 12);
            }
        } else {
            const element = elements[`load${step.label.charAt(0).toUpperCase() + step.label.slice(1)}`];
            if (element) {
                await animateNumber(element, 0, step.target, step.duration);
            }
        }
    }
}

function animateNumber(element, start, end, duration) {
    return new Promise(resolve => {
        const startTime = Date.now();
        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * easeOutCubic(progress));
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                resolve();
            }
        };
        update();
    });
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ================================================================
// Service Worker Registration
// ================================================================

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registered:', registration.scope);
            
            registration.addEventListener('updatefound', () => {
                console.log('🔄 New version available');
                showToast('Nova versão disponível! Atualize a página.', 'info', 5000);
            });
        } catch (error) {
            console.warn('⚠️ Service Worker registration failed:', error);
        }
    }
}

// ================================================================
// Event Listeners Setup
// ================================================================

function setupEventListeners() {
    // Send message
    elements.sendBtn?.addEventListener('click', handleSendMessage);
    elements.messageInput?.addEventListener('keydown', handleInputKeydown);
    elements.messageInput?.addEventListener('input', handleInputChange);
    
    // Header controls
    elements.menuToggle?.addEventListener('click', () => toggleSidebar());
    elements.sidebarToggle?.addEventListener('click', () => toggleSidebar());
    elements.menuBtn?.addEventListener('click', toggleModeMenu);
    elements.themeToggle?.addEventListener('click', toggleTheme);
    elements.soundBtn?.addEventListener('click', toggleSound);
    elements.voiceBtn?.addEventListener('click', toggleVoice);
    elements.settingsBtn?.addEventListener('click', () => openModal('settings'));
    elements.exportBtn?.addEventListener('click', exportChat);
    
    // New chat
    elements.newChatBtn?.addEventListener('click', createNewChat);
    
    // Mode selection
    elements.modeButtons?.forEach(btn => {
        btn.addEventListener('click', () => handleModeChange(btn));
    });
    
    // Quick actions
    elements.quickActionBtns?.forEach(btn => {
        btn.addEventListener('click', () => handleQuickAction(btn.dataset.action));
    });
    
    // Scroll
    elements.chatMessages?.addEventListener('scroll', handleScroll);
    elements.scrollBottomBtn?.addEventListener('click', () => scrollToBottom(true));
    
    // Input actions
    elements.emojiBtn?.addEventListener('click', toggleEmojiPicker);
    elements.attachBtn?.addEventListener('click', () => elements.fileInput?.click());
    elements.fileInput?.addEventListener('change', handleFileSelect);
    elements.cameraBtn?.addEventListener('click', handleCameraCapture);
    elements.micBtn?.addEventListener('click', handleVoiceInput);
    
    // Suggestions
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => {
            const prompt = card.dataset.prompt;
            elements.messageInput.value = prompt;
            handleSendMessage();
        });
    });
    
    // Settings modal
    elements.closeSettings?.addEventListener('click', () => closeModal('settings'));
    document.getElementById('saveSettings')?.addEventListener('click', saveSettings);
    document.getElementById('resetSettings')?.addEventListener('click', resetSettings);
    document.getElementById('clearAllData')?.addEventListener('click', clearAllData);
    
    // Settings controls
    document.getElementById('temperatureSlider')?.addEventListener('input', (e) => {
        document.getElementById('temperatureValue').textContent = (e.target.value / 100).toFixed(1);
    });
    
    document.getElementById('toggleApiKey')?.addEventListener('click', () => {
        const input = document.getElementById('apiKeyInput');
        input.type = input.type === 'password' ? 'text' : 'password';
    });
    
    // Emoji picker
    elements.emojiCategories?.forEach(btn => {
        btn.addEventListener('click', () => switchEmojiCategory(btn.dataset.category));
    });
    
    elements.emojiSearch?.addEventListener('input', (e) => {
        filterEmojis(e.target.value);
    });
    
    // Window events
    window.addEventListener('beforeunload', saveState);
    window.addEventListener('online', () => showToast('Conexão restaurada', 'success'));
    window.addEventListener('offline', () => showToast('Modo offline ativado', 'warning'));
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Click outside to close
    document.addEventListener('click', (e) => {
        if (!elements.modeMenu?.contains(e.target) && !elements.menuBtn?.contains(e.target)) {
            elements.modeMenu?.classList.add('hidden');
        }
        
        if (!elements.emojiPicker?.contains(e.target) && !elements.emojiBtn?.contains(e.target)) {
            elements.emojiPicker?.classList.add('hidden');
        }
        
        if (!elements.contextMenu?.contains(e.target)) {
            elements.contextMenu?.classList.add('hidden');
        }
    });
    
    // Context menu on messages
    elements.chatMessages?.addEventListener('contextmenu', handleContextMenu);
    
    // Command palette
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleCommandPalette();
        }
    });
}

// ================================================================
// Settings Management
// ================================================================

function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (saved) {
            state.settings = { ...state.settings, ...JSON.parse(saved) };
            applySettings();
        }
    } catch (error) {
        console.error('❌ Error loading settings:', error);
    }
}

function applySettings() {
    // Apply theme
    if (state.settings.theme === 'light') {
        document.body.classList.add('light-mode');
        updateThemeIcons(true);
    } else if (state.settings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!prefersDark) {
            document.body.classList.add('light-mode');
            updateThemeIcons(true);
        }
    }
    
    // Apply animations
    if (!state.settings.animations) {
        document.body.style.setProperty('--transition-fast', '0ms');
        document.body.style.setProperty('--transition-base', '0ms');
        document.body.style.setProperty('--transition-slow', '0ms');
    }
    
    // Apply sound
    state.soundEnabled = state.settings.systemSounds;
    updateSoundIcon();
    
    // Apply temperature
    CONFIG.TEMPERATURE = state.settings.temperature;
    
    // Apply max tokens
    CONFIG.MAX_TOKENS = state.settings.maxTokens;
    
    console.log('⚙️ Settings applied:', state.settings);
}

function saveSettings() {
    try {
        // Get values from settings modal
        const temperature = document.getElementById('temperatureSlider')?.value / 100 || 0.7;
        const maxTokens = parseInt(document.getElementById('maxTokensSelect')?.value) || 2000;
        const contextLength = parseInt(document.getElementById('contextLengthSelect')?.value) || 10;
        const animations = document.getElementById('animationsToggle')?.checked ?? true;
        const codeFormatting = document.getElementById('codeFormattingToggle')?.checked ?? true;
        const systemSounds = document.getElementById('systemSoundsToggle')?.checked ?? true;
        const tts = document.getElementById('ttsToggle')?.checked ?? false;
        const notifications = document.getElementById('notificationsToggle')?.checked ?? false;
        const saveHistory = document.getElementById('saveHistoryToggle')?.checked ?? true;
        const devMode = document.getElementById('devModeToggle')?.checked ?? false;
        const apiKey = document.getElementById('apiKeyInput')?.value;
        
        state.settings = {
            ...state.settings,
            temperature,
            maxTokens,
            contextLength,
            animations,
            codeFormatting,
            systemSounds,
            tts,
            notifications,
            saveHistory,
            devMode
        };
        
        if (apiKey && apiKey.startsWith('sk-')) {
            CONFIG.MISTRAL_API_KEY = apiKey;
        }
        
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
        applySettings();
        
        closeModal('settings');
        showToast('Configurações salvas com sucesso!', 'success');
        
        console.log('💾 Settings saved:', state.settings);
    } catch (error) {
        console.error('❌ Error saving settings:', error);
        showToast('Erro ao salvar configurações', 'error');
    }
}

function resetSettings() {
    if (confirm('Restaurar todas as configurações para os valores padrão?')) {
        state.settings = {
            theme: 'dark',
            animations: true,
            temperature: 0.7,
            maxTokens: 2000,
            codeFormatting: true,
            contextLength: 10,
            systemSounds: true,
            notifications: false,
            saveHistory: true,
            devMode: false
        };
        
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
        applySettings();
        closeModal('settings');
        
        showToast('Configurações restauradas!', 'success');
        
        setTimeout(() => location.reload(), 1000);
    }
}

function clearAllData() {
    if (confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os dados incluindo histórico de conversas, configurações e sessões. Esta ação não pode ser desfeita. Continuar?')) {
        if (confirm('Tem certeza absoluta? Digite SIM para confirmar:') === 'SIM') {
            try {
                // Clear all localStorage
                Object.values(STORAGE_KEYS).forEach(key => {
                    localStorage.removeItem(key);
                });
                
                // Clear sessionStorage
                sessionStorage.clear();
                
                showToast('Todos os dados foram apagados', 'success');
                
                setTimeout(() => location.reload(), 1500);
            } catch (error) {
                console.error('❌ Error clearing data:', error);
                showToast('Erro ao limpar dados', 'error');
            }
        }
    }
}

// ================================================================
// State Management Functions
// ================================================================

function loadSavedState() {
    try {
        // Load theme
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            updateThemeIcons(true);
        }
        
        // Load mode
        const savedMode = localStorage.getItem(STORAGE_KEYS.MODE);
        if (savedMode) {
            state.currentMode = savedMode;
            updateModeDisplay();
        }
        
        // Load sound preference
        const savedSound = localStorage.getItem(STORAGE_KEYS.SOUND);
        if (savedSound === 'false') {
            state.soundEnabled = false;
            updateSoundIcon();
        }
        
        // Load chat sessions
        const savedSessions = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
        if (savedSessions) {
            state.chatSessions = JSON.parse(savedSessions);
            renderChatHistory();
        }
        
        // Load current chat
        const savedHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
        if (savedHistory && state.settings.saveHistory) {
            state.chatHistory = JSON.parse(savedHistory).slice(-CONFIG.MAX_HISTORY);
            
            // Display last 20 messages
            state.chatHistory.slice(-20).forEach(msg => displayMessage(msg, false));
            
            state.messageCount = state.chatHistory.length;
            updateStats();
            
            // Hide suggestions if chat exists
            if (state.chatHistory.length > 0) {
                elements.suggestions?.classList.add('hidden');
            }
        }
        
        // Load session start time
        const savedSessionStart = localStorage.getItem(STORAGE_KEYS.SESSION_START);
        if (savedSessionStart) {
            state.sessionStartTime = parseInt(savedSessionStart);
        } else {
            localStorage.setItem(STORAGE_KEYS.SESSION_START, state.sessionStartTime.toString());
        }
        
        console.log('✅ State loaded from localStorage');
    } catch (error) {
        console.error('❌ Error loading state:', error);
    }
}

function saveState() {
    try {
        if (state.settings.saveHistory) {
            localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(state.chatHistory));
            localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(state.chatSessions));
        }
        
        localStorage.setItem(STORAGE_KEYS.THEME, document.body.classList.contains('light-mode') ? 'light' : 'dark');
        localStorage.setItem(STORAGE_KEYS.MODE, state.currentMode);
        localStorage.setItem(STORAGE_KEYS.SOUND, state.soundEnabled.toString());
        localStorage.setItem(STORAGE_KEYS.SESSION_START, state.sessionStartTime.toString());
    } catch (error) {
        console.error('❌ Error saving state:', error);
    }
}

// Auto-save interval
setInterval(saveState, CONFIG.AUTOSAVE_INTERVAL);

// ================================================================
// Welcome Message
// ================================================================

async function showWelcomeMessage() {
    const hasVisited = sessionStorage.getItem('nexia_v3_visited');
    
    if (!hasVisited && state.chatHistory.length === 0) {
        await sleep(500);
        
        const welcomeMsg = {
            text: `🌟 **Bem-vindo ao NEXIA 3.0 - Neural AI Assistant**

Sou a evolução da inteligência artificial conversacional, equipado com:

- 🧠 **Processamento Neural Avançado** - Compreensão contextual profunda
- 🎯 **8 Modos Especializados** - Adaptação perfeita para cada necessidade
- ⚡ **Resposta Ultra-Rápida** - Processamento otimizado por IA
- 🎨 **Interface Premium** - Design futurista e intuitivo
- 💾 **Memória Persistente** - Suas conversas sempre salvas
- 🔊 **Controle por Voz** - Fale naturalmente comigo
- 📊 **Análise em Tempo Real** - Estatísticas e métricas avançadas
- 🌐 **Multi-idioma** - Suporte para 50+ idiomas

**Comandos Rápidos:**
- Digite \`@\` para ver comandos disponíveis
- Use \`Ctrl+K\` para abrir a paleta de comandos
- Pressione \`Ctrl+E\` para exportar a conversa

**Como posso transformar seu dia hoje?** ✨`,
            sender: 'ai',
            timestamp: getCurrentTime()
        };
        
        await displayMessage(welcomeMsg, true, true);
        sessionStorage.setItem('nexia_v3_visited', 'true');
    }
}

// ================================================================
// Message Handling
// ================================================================

async function handleSendMessage() {
    const message = elements.messageInput.value.trim();
    
    if (!message || state.isProcessing) return;
    
    if (message.length > CONFIG.MAX_CHAR_COUNT) {
        showToast(`Mensagem muito longa! Máximo: ${CONFIG.MAX_CHAR_COUNT} caracteres`, 'error');
        return;
    }
    
    // Check for commands
    if (message.startsWith('@')) {
        await handleCommand(message);
        return;
    }
    
    // Hide suggestions
    elements.suggestions?.classList.add('hidden');
    
    // Create user message
    const userMessage = {
        text: message,
        sender: 'user',
        timestamp: getCurrentTime(),
        id: generateId()
    };
    
    // Display and save user message
    await displayMessage(userMessage, true);
    state.chatHistory.push(userMessage);
    state.messageCount++;
    updateStats();
    
    // Clear input
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';
    updateCharCount();
    
    // Play sound
    if (state.soundEnabled) playSound(...SOUND_EFFECTS.SEND);
    
    // Show typing indicator
    showTypingIndicator();
    updateProcessingStatus('processing', 'Processando...');
    
    // Process message
    state.isProcessing = true;
    elements.sendBtn.disabled = true;
    
    try {
        const response = await callMistralAPI(message);
        
        hideTypingIndicator();
        updateProcessingStatus('ready', 'Pronto');
        
        const aiMessage = {
            text: response,
            sender: 'ai',
            timestamp: getCurrentTime(),
            id: generateId()
        };
        
        await displayMessage(aiMessage, true, true); // Enable typewriter
        state.chatHistory.push(aiMessage);
        state.messageCount++;
        updateStats();
        
        // Update token count (estimate)
        state.tokenCount += estimateTokens(message + response);
        elements.totalTokens.textContent = state.tokenCount.toLocaleString();
        
        if (state.soundEnabled) playSound(...SOUND_EFFECTS.RECEIVE);
        
        // Text-to-speech if enabled
        if (state.settings.tts) {
            speakText(response);
        }
        
        // Desktop notification if enabled
        if (state.settings.notifications && document.hidden) {
            showNotification('NEXIA respondeu', response.substring(0, 100) + '...');
        }
        
    } catch (error) {
        hideTypingIndicator();
        updateProcessingStatus('error', 'Erro');
        console.error('❌ Error processing message:', error);
        
        const errorMsg = {
            text: '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Verifique sua conexão e API key, então tente novamente.',
            sender: 'ai',
            timestamp: getCurrentTime(),
            id: generateId()
        };
        
        await displayMessage(errorMsg, true);
        if (state.soundEnabled) playSound(...SOUND_EFFECTS.ERROR);
        
        showToast('Erro ao processar mensagem. Verifique sua API key.', 'error');
    } finally {
        state.isProcessing = false;
        elements.sendBtn.disabled = false;
        elements.messageInput?.focus();
        saveState();
    }
}

function handleInputKeydown(e) {
    // Send on Ctrl+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
        return;
    }
    
    // New line on Shift+Enter
    if (e.shiftKey && e.key === 'Enter') {
        return;
    }
    
    // Send on Enter (without modifiers)
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleSendMessage();
    }
    
    // Show command palette on @
    if (e.key === '@' && elements.messageInput.value === '') {
        e.preventDefault();
        showCommandSuggestions();
    }
}

function handleInputChange() {
    updateCharCount();
    
    // Auto-resize textarea
    elements.messageInput.style.height = 'auto';
    elements.messageInput.style.height = Math.min(elements.messageInput.scrollHeight, 200) + 'px';
    
    // Check for commands
    const value = elements.messageInput.value;
    if (value.startsWith('@')) {
        showCommandSuggestions(value.substring(1));
    }
}

function updateCharCount() {
    const count = elements.messageInput.value.length;
    elements.charCount.textContent = `${count} / ${CONFIG.MAX_CHAR_COUNT}`;
    
    if (count > CONFIG.MAX_CHAR_COUNT * 0.95) {
        elements.charCount.style.color = 'var(--accent-error)';
        elements.charCount.classList.add('error');
    } else if (count > CONFIG.MAX_CHAR_COUNT * 0.8) {
        elements.charCount.style.color = 'var(--accent-warning)';
        elements.charCount.classList.add('warning');
    } else {
        elements.charCount.style.color = '';
        elements.charCount.classList.remove('error', 'warning');
    }
}

// ================================================================
// Command Handling
// ================================================================

async function handleCommand(command) {
    const [cmd, ...args] = command.split(' ');
    const argument = args.join(' ');
    
    switch(cmd.toLowerCase()) {
        case '@summarize':
            await summarizeConversation();
            break;
        case '@translate':
            await translateLastMessage(argument);
            break;
        case '@code':
            await generateCode(argument);
            break;
        case '@analyze':
            await analyzeDeep(argument);
            break;
        case '@explain':
            await explainConcept(argument);
            break;
        case '@rewrite':
            await rewriteText(argument);
            break;
        case '@brainstorm':
            await brainstormIdeas(argument);
            break;
        case '@debug':
            await debugCode(argument);
            break;
        default:
            showToast('Comando não reconhecido. Use @ para ver comandos disponíveis.', 'error');
    }
    
    elements.messageInput.value = '';
}

async function summarizeConversation() {
    if (state.chatHistory.length < 3) {
        showToast('Conversa muito curta para resumir', 'warning');
        return;
    }
    
    const conversationText = state.chatHistory.map(m => `${m.sender}: ${m.text}`).join('\n');
    const prompt = `Resuma esta conversa de forma concisa e estruturada:\n\n${conversationText}`;
    
    elements.messageInput.value = prompt;
    await handleSendMessage();
}

async function translateLastMessage(targetLang) {
    if (state.chatHistory.length === 0) {
        showToast('Nenhuma mensagem para traduzir', 'warning');
        return;
    }
    
    const lastMsg = state.chatHistory[state.chatHistory.length - 1];
    const lang = targetLang || 'inglês';
    const prompt = `Traduza o seguinte texto para ${lang}:\n\n"${lastMsg.text}"`;
    
    elements.messageInput.value = prompt;
    await handleSendMessage();
}

async function generateCode(description) {
    const prompt = `Gere código ${description || 'conforme especificação'}. Inclua comentários explicativos e boas práticas.`;
    elements.messageInput.value = prompt;
    await handleSendMessage();
}

async function analyzeDeep(topic) {
    const prompt = `Faça uma análise profunda e detalhada sobre: ${topic || 'o tópico anterior'}. Inclua múltiplas perspectivas, dados relevantes e conclusões.`;
    elements.messageInput.value = prompt;
    await handleSendMessage();
}

async function explainConcept(concept) {
    const prompt = `Explique de forma clara e didática, usando analogias e exemplos práticos: ${concept || 'o conceito anterior'}`;
    elements.messageInput.value = prompt;
    await handleSendMessage();
}

async function rewriteText(text) {
    const prompt = `Reescreva o seguinte texto de forma mais clara, concisa e profissional:\n\n"${text || 'o texto anterior'}"`;
    elements.messageInput.value = prompt;
    await handleSendMessage();
}

async function brainstormIdeas(topic) {
    const prompt = `Faça um brainstorming criativo e inovador sobre: ${topic}. Gere pelo menos 10 ideias únicas e práticas.`;
    elements.messageInput.value = prompt;
    await handleSendMessage();
}

async function debugCode(code) {
    const prompt = `Analise este código e identifique bugs, problemas de performance e sugestões de melhoria:\n\n\`\`\`\n${code}\n\`\`\``;
    elements.messageInput.value = prompt;
    await handleSendMessage();
}

function showCommandSuggestions(filter = '') {
    if (!elements.commandPalette) return;
    
    const commands = Object.entries(COMMANDS).filter(([cmd, desc]) => 
        cmd.toLowerCase().includes(filter.toLowerCase()) || desc.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (commands.length === 0) return;
    
    elements.commandList.innerHTML = commands.map(([cmd, desc]) => `
        <div class="command-item" data-command="${cmd}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="command-item-content">
                <div class="command-item-title">${cmd}</div>
                <div class="command-item-desc">${desc}</div>
            </div>
        </div>
    `).join('');
    
    elements.commandPalette.classList.remove('hidden');
    
    // Add click handlers
    elements.commandList.querySelectorAll('.command-item').forEach(item => {
        item.addEventListener('click', () => {
            elements.messageInput.value = item.dataset.command + ' ';
            elements.commandPalette.classList.add('hidden');
            elements.messageInput.focus();
        });
    });
}

// ================================================================
// Mistral API Integration
// ================================================================

async function callMistralAPI(userMessage) {
    const systemPrompts = {
        general: 'Você é NEXIA 3.0, uma assistente de IA neural avançada da AmplaAI. Você é inteligente, prestativa, criativa e possui conhecimento profundo em diversas áreas. Forneça respostas claras, precisas e bem estruturadas. Use markdown para formatar suas respostas quando apropriado.',
        
        creative: 'Você é NEXIA 3.0 em modo criativo. Seja altamente imaginativo, inspirador e original. Pense fora da caixa, use metáforas criativas e ofereça perspectivas únicas. Encoraje a criatividade e inovação.',
        
        technical: 'Você é NEXIA 3.0 em modo técnico. Forneça explicações precisas, detalhadas e tecnicamente corretas. Use terminologia apropriada, cite fontes quando relevante e seja específico com implementações e código.',
        
        explain: 'Você é NEXIA 3.0 em modo explicativo. Explique conceitos complexos de forma extremamente clara e didática. Use analogias, exemplos práticos, diagramas textuais e divida explicações em etapas. Adapte a linguagem ao nível do usuário.',
        
        translator: 'Você é NEXIA 3.0 em modo tradutor especializado. Traduza textos mantendo o contexto cultural, nuances linguísticas, tom e intenção original. Considere regionalidades e forneça notas explicativas quando necessário.',
        
        analyst: 'Você é NEXIA 3.0 em modo analista. Faça análises profundas, identifique padrões, correlacione dados, apresente insights valiosos e forneça conclusões bem fundamentadas. Use raciocínio lógico e pensamento crítico avançado.',
        
        writer: 'Você é NEXIA 3.0 em modo escritor profissional. Crie conteúdo envolvente, bem estruturado e de alta qualidade. Adapte o estilo e tom ao contexto, use técnicas narrativas avançadas e produza textos polidos.',
        
        coach: 'Você é NEXIA 3.0 em modo coach e mentor. Ofereça orientação personalizada, motivação, feedback construtivo e ajude no desenvolvimento pessoal e profissional. Seja empático, encorajador e prático.'
    };

    const systemPrompt = systemPrompts[state.currentMode] || systemPrompts.general;

    // Build conversation context
    const messages = [
        { role: 'system', content: systemPrompt }
    ];

    // Add context from recent history
    const contextLength = state.settings.contextLength || 10;
    const recentHistory = state.chatHistory.slice(-contextLength * 2); // User + AI pairs
    
    recentHistory.forEach(msg => {
        messages.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        });
    });

    // Add current message
    messages.push({ role: 'user', content: userMessage });

    try {
        const response = await fetch(CONFIG.MISTRAL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: messages,
                max_tokens: CONFIG.MAX_TOKENS,
                temperature: CONFIG.TEMPERATURE,
                top_p: 0.95,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        
        // Calculate precision (simulated)
        updateAIPrecision();
        
        return data.choices[0].message.content;

    } catch (error) {
        console.error('❌ Mistral API Error:', error);
        
        // Provide helpful error messages
        if (error.message.includes('401')) {
            throw new Error('API Key inválida. Configure sua chave nas configurações.');
        } else if (error.message.includes('429')) {
            throw new Error('Limite de requisições excedido. Aguarde alguns minutos.');
        } else if (error.message.includes('500')) {
            throw new Error('Erro no servidor da API. Tente novamente.');
        }
        
        throw error;
    }
}

function updateAIPrecision() {
    const precision = (95 + Math.random() * 4).toFixed(1);
    if (elements.aiPrecision) {
        elements.aiPrecision.textContent = `${precision}%`;
    }
}

function estimateTokens(text) {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
}

// ================================================================
// Message Display & Typewriter Effect
// ================================================================

async function displayMessage(message, animate = true, useTypewriter = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender}`;
    messageDiv.dataset.messageId = message.id;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'message-content';
    
    const textElement = document.createElement('div');
    textElement.className = 'message-text';
    
    // Format text with markdown-like syntax
    let formattedText = formatMessageText(message.text);
    
    if (useTypewriter && message.sender === 'ai') {
        textElement.innerHTML = '';
        contentWrapper.appendChild(textElement);
    } else {
        textElement.innerHTML = formattedText;
        contentWrapper.appendChild(textElement);
    }
    
    // Add timestamp and actions
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message-actions';
    actionsDiv.innerHTML = `
        <span class="message-time">${message.timestamp}</span>
        <div class="message-action-buttons">
            <button class="message-action-btn copy-btn" aria-label="Copiar" title="Copiar mensagem">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"/>
                </svg>
            </button>
            ${message.sender === 'ai' ? `
                <button class="message-action-btn regen-btn" aria-label="Regenerar" title="Regenerar resposta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <button class="message-action-btn tts-btn" aria-label="Ouvir" title="Ler em voz alta">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke-width="2"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            ` : ''}
        </div>
    `;
    
    bubbleDiv.appendChild(contentWrapper);
    bubbleDiv.appendChild(actionsDiv);
    messageDiv.appendChild(bubbleDiv);
    elements.chatMessages.appendChild(messageDiv);
    
    // Add event listeners
    const copyBtn = actionsDiv.querySelector('.copy-btn');
    copyBtn?.addEventListener('click', () => copyMessage(message.text));
    
    const regenBtn = actionsDiv.querySelector('.regen-btn');
    regenBtn?.addEventListener('click', () => regenerateResponse(message));
    
    const ttsBtn = actionsDiv.querySelector('.tts-btn');
    ttsBtn?.addEventListener('click', () => speakText(message.text));
    
    // Scroll to bottom
    scrollToBottom(true);
    
    // Typewriter effect for AI messages
    if (useTypewriter && message.sender === 'ai') {
        await typewriterEffect(textElement, formattedText);
    }
    
    // Animate entrance
    if (animate) {
        messageDiv.style.animationDelay = '0.1s';
    }
}

function formatMessageText(text) {
    return text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code blocks
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
        })
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        // Line breaks
        .replace(/\n/g, '<br>');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function typewriterEffect(element, html) {
    // Create temporary element to extract plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText;
    
    let currentIndex = 0;
    const totalLength = plainText.length;
    
    while (currentIndex < totalLength) {
        await sleep(CONFIG.TYPEWRITER_SPEED);
        currentIndex++;
        
        // Update with formatted HTML up to current position
        const currentText = plainText.substring(0, currentIndex);
        element.innerHTML = formatMessageText(currentText);
        
        // Scroll during typing
        if (currentIndex % 10 === 0) {
            scrollToBottom(true);
        }
    }
    
    // Final update with full formatted text
    element.innerHTML = html;
    scrollToBottom(true);
}

async function regenerateResponse(message) {
    if (state.isProcessing) return;
    
    // Find the user message before this AI message
    const messageIndex = state.chatHistory.findIndex(m => m.id === message.id);
    if (messageIndex > 0) {
        const userMessage = state.chatHistory[messageIndex - 1];
        if (userMessage.sender === 'user') {
            // Remove the AI message
            const messageElement = document.querySelector(`[data-message-id="${message.id}"]`);
            messageElement?.remove();
            
            state.chatHistory.splice(messageIndex, 1);
            
            // Regenerate
            elements.messageInput.value = userMessage.text;
            await handleSendMessage();
        }
    }
}

// ================================================================
// Typing Indicator
// ================================================================

function showTypingIndicator() {
    elements.typingIndicator?.classList.remove('hidden');
    scrollToBottom(true);
}

function hideTypingIndicator() {
    elements.typingIndicator?.classList.add('hidden');
}

function updateProcessingStatus(status, text) {
    if (!elements.processingStatus) return;
    
    elements.processingStatus.className = `processing-status ${status}`;
    elements.processingStatus.innerHTML = `
        <span class="status-dot"></span>
        ${text}
    `;
}

// ================================================================
// Theme Management
// ================================================================

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    
    updateThemeIcons(isLight);
    
    if (state.soundEnabled) playSound(...SOUND_EFFECTS.CLICK);
    
    state.settings.theme = isLight ? 'light' : 'dark';
    saveState();
    
    showToast(`Tema ${isLight ? 'claro' : 'escuro'} ativado`, 'success');
}

function updateThemeIcons(isLight) {
    const sunIcon = elements.themeToggle?.querySelector('.sun-icon');
    const moonIcon = elements.themeToggle?.querySelector('.moon-icon');
    
    if (isLight) {
        sunIcon?.classList.remove('hidden');
        moonIcon?.classList.add('hidden');
    } else {
        sunIcon?.classList.add('hidden');
        moonIcon?.classList.remove('hidden');
    }
}

// ================================================================
// Sidebar Management
// ================================================================

function toggleSidebar() {
    elements.sidebar?.classList.toggle('collapsed');
    if (state.soundEnabled) playSound(...SOUND_EFFECTS.CLICK);
}

function createNewChat() {
    if (state.chatHistory.length > 0) {
        // Save current session
        const session = {
            id: generateId(),
            title: generateChatTitle(),
            messages: state.chatHistory,
            timestamp: Date.now(),
            mode: state.currentMode
        };
        
        state.chatSessions.unshift(session);
        
        // Keep only last 50 sessions
        state.chatSessions = state.chatSessions.slice(0, 50);
        
        localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(state.chatSessions));
        renderChatHistory();
    }
    
    // Clear current chat
    state.chatHistory = [];
    state.messageCount = 0;
    state.tokenCount = 0;
    state.currentSessionId = null;
    
    elements.chatMessages.innerHTML = '';
    elements.suggestions?.classList.remove('hidden');
    
    updateStats();
    saveState();
    
    showToast('Nova conversa iniciada', 'success');
    
    // Show welcome message
    sessionStorage.removeItem('nexia_v3_visited');
    showWelcomeMessage();
}

function generateChatTitle() {
    if (state.chatHistory.length === 0) return 'Nova Conversa';
    
    // Get first user message
    const firstUserMsg = state.chatHistory.find(m => m.sender === 'user');
    if (firstUserMsg) {
        return firstUserMsg.text.substring(0, 50) + (firstUserMsg.text.length > 50 ? '...' : '');
    }
    
    return `Conversa ${new Date().toLocaleDateString()}`;
}

function renderChatHistory() {
    if (!elements.chatHistory) return;
    
    elements.chatHistory.innerHTML = state.chatSessions.map(session => `
        <div class="chat-history-item" data-session-id="${session.id}">
            <div class="chat-history-title">${session.title}</div>
            <div class="chat-history-preview">
                ${session.messages.length} mensagens • ${new Date(session.timestamp).toLocaleDateString()}
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    elements.chatHistory.querySelectorAll('.chat-history-item').forEach(item => {
        item.addEventListener('click', () => loadChatSession(item.dataset.sessionId));
    });
}

function loadChatSession(sessionId) {
    const session = state.chatSessions.find(s => s.id === sessionId);
    if (!session) return;
    
    // Save current session if it has messages
    if (state.chatHistory.length > 0) {
        createNewChat();
    }
    
    // Load session
    state.chatHistory = session.messages;
    state.currentSessionId = sessionId;
    state.currentMode = session.mode || 'general';
    state.messageCount = session.messages.length;
    
    // Clear and display messages
    elements.chatMessages.innerHTML = '';
    elements.suggestions?.classList.add('hidden');
    
    session.messages.forEach(msg => displayMessage(msg, false));
    
    updateStats();
    updateModeDisplay();
    
    // Close sidebar on mobile
    if (window.innerWidth < 1200) {
        toggleSidebar();
    }
    
    showToast('Conversa carregada', 'success');
}

// ================================================================
// Mode Management
// ================================================================

function toggleModeMenu() {
    elements.modeMenu?.classList.toggle('hidden');
    if (state.soundEnabled) playSound(...SOUND_EFFECTS.CLICK);
}

function handleModeChange(button) {
    const newMode = button.dataset.mode;
    
    // Update active state
    elements.modeButtons?.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update state
    state.currentMode = newMode;
    
    // Update display
    updateModeDisplay();
    
    // Close menu
    toggleModeMenu();
    
    // Play sound
    if (state.soundEnabled) playSound(...SOUND_EFFECTS.CLICK);
    
    // Save state
    saveState();
    
    // Show notification
    const modeName = button.querySelector('.mode-name')?.textContent || newMode;
    showToast(`Modo ${modeName} ativado`, 'success');
    
    console.log(`🔄 Mode changed to: ${newMode}`);
}

function updateModeDisplay() {
    const modeNames = {
        general: 'Geral',
        creative: 'Criativo',
        technical: 'Técnico',
        explain: 'Explicativo',
        translator: 'Tradutor',
        analyst: 'Analista',
        writer: 'Escritor',
        coach: 'Coach'
    };
    
    if (elements.currentModeDisplay) {
        elements.currentModeDisplay.textContent = `• Modo ${modeNames[state.currentMode]}`;
    }
}

// ================================================================
// Quick Actions
// ================================================================

function handleQuickAction(action) {
    switch(action) {
        case 'summarize':
            summarizeConversation();
            break;
        case 'translate':
            elements.messageInput.value = '@translate ';
            elements.messageInput.focus();
            break;
        case 'code':
            elements.messageInput.value = '@code ';
            elements.messageInput.focus();
            break;
        case 'analyze':
            elements.messageInput.value = '@analyze ';
            elements.messageInput.focus();
            break;
    }
    
    if (state.soundEnabled) playSound(...SOUND_EFFECTS.CLICK);
}

// ================================================================
// Sound Management
// ================================================================

function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    state.settings.systemSounds = state.soundEnabled;
    
    updateSoundIcon();
    
    if (state.soundEnabled) {
        playSound(...SOUND_EFFECTS.SUCCESS);
        showToast('Som ativado', 'success');
    } else {
        showToast('Som desativado', 'info');
    }
    
    saveState();
}

function updateSoundIcon() {
    const soundOnIcon = elements.soundBtn?.querySelector('.icon-sound-on');
    const soundOffIcon = elements.soundBtn?.querySelector('.icon-sound-off');
    
    if (state.soundEnabled) {
        soundOnIcon?.classList.remove('hidden');
        soundOffIcon?.classList.add('hidden');
    } else {
        soundOnIcon?.classList.add('hidden');
        soundOffIcon?.classList.remove('hidden');
    }
}

function playSound(frequency, duration) {
    if (!state.soundEnabled) return;
    
    try {
        if (!state.audioContext) {
            state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = state.audioContext.createOscillator();
        const gainNode = state.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(state.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.08, state.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, state.audioContext.currentTime + duration);
        
        oscillator.start(state.audioContext.currentTime);
        oscillator.stop(state.audioContext.currentTime + duration);
    } catch (error) {
        console.warn('⚠️ Sound playback failed:', error);
    }
}

// ================================================================
// Voice Recognition
// ================================================================

function setupVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('⚠️ Speech recognition not supported');
        if (elements.voiceBtn) {
            elements.voiceBtn.disabled = true;
            elements.voiceBtn.style.opacity = '0.3';
        }
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    state.recognition = new SpeechRecognition();
    
    state.recognition.continuous = false;
    state.recognition.interimResults = true;
    state.recognition.lang = 'pt-BR';
    
    state.recognition.onstart = () => {
        elements.voiceBtn?.classList.add('active');
        showToast('🎤 Ouvindo... Fale agora!', 'info', 10000);
    };
    
    state.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        
        elements.messageInput.value = transcript;
        updateCharCount();
    };
    
    state.recognition.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        elements.voiceBtn?.classList.remove('active');
        
        const errorMessages = {
            'no-speech': 'Nenhuma fala detectada',
            'audio-capture': 'Microfone não disponível',
            'not-allowed': 'Permissão de microfone negada'
        };
        
        showToast(errorMessages[event.error] || 'Erro no reconhecimento de voz', 'error');
    };
    
    state.recognition.onend = () => {
        elements.voiceBtn?.classList.remove('active');
        state.voiceEnabled = false;
    };
}

function toggleVoice() {
    if (!state.recognition) {showToast('Reconhecimento de voz não disponível', 'error');
        return;
    }
    
    if (state.voiceEnabled) {
        state.recognition.stop();
        state.voiceEnabled = false;
        elements.voiceBtn?.classList.remove('active');
    } else {
        try {
            state.recognition.start();
            state.voiceEnabled = true;
        } catch (error) {
            console.error('❌ Voice recognition start error:', error);
            showToast('Erro ao iniciar reconhecimento de voz', 'error');
        }
    }
    
    if (state.soundEnabled) playSound(...SOUND_EFFECTS.CLICK);
}

function handleVoiceInput() {
    toggleVoice();
}

// ================================================================
// Text-to-Speech
// ================================================================

function setupTextToSpeech() {
    if ('speechSynthesis' in window) {
        state.synthesis = window.speechSynthesis;
    } else {
        console.warn('⚠️ Text-to-speech not supported');
    }
}

function speakText(text) {
    if (!state.synthesis) {
        showToast('Text-to-speech não disponível', 'error');
        return;
    }
    
    // Cancel any ongoing speech
    state.synthesis.cancel();
    
    // Clean text for speech (remove markdown, emojis, etc)
    const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[#\[\]()]/g, '')
        .replace(/[^\w\s.,!?;:-]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
        showToast('🔊 Reproduzindo áudio...', 'info', 2000);
    };
    
    utterance.onerror = (event) => {
        console.error('❌ TTS error:', event);
        showToast('Erro ao reproduzir áudio', 'error');
    };
    
    state.synthesis.speak(utterance);
}

// ================================================================
// File Handling
// ================================================================

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    files.forEach(file => {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showToast(`Arquivo ${file.name} muito grande (máx: 10MB)`, 'error');
            return;
        }
        
        // Add to preview
        addFilePreview(file);
        
        // Read file content
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const content = e.target.result;
            
            // Add file context to message
            const fileContext = `\n\n[Arquivo anexado: ${file.name}]\n${content.substring(0, 1000)}${content.length > 1000 ? '...' : ''}`;
            elements.messageInput.value += fileContext;
            updateCharCount();
        };
        
        reader.onerror = () => {
            showToast(`Erro ao ler arquivo ${file.name}`, 'error');
        };
        
        if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
            reader.readAsText(file);
        } else {
            showToast(`Tipo de arquivo ${file.type} não suportado ainda`, 'warning');
        }
    });
    
    // Clear input
    event.target.value = '';
}

function addFilePreview(file) {
    if (!elements.filePreview) return;
    
    elements.filePreview.classList.remove('hidden');
    
    const previewItem = document.createElement('div');
    previewItem.className = 'file-preview-item';
    previewItem.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 20px; height: 20px;">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke-width="2"/>
            <polyline points="13 2 13 9 20 9" stroke-width="2"/>
        </svg>
        <span>${file.name}</span>
        <button class="remove-file" aria-label="Remover arquivo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke-width="2"/>
            </svg>
        </button>
    `;
    
    previewItem.querySelector('.remove-file').addEventListener('click', () => {
        previewItem.remove();
        if (elements.filePreview.children.length === 0) {
            elements.filePreview.classList.add('hidden');
        }
    });
    
    elements.filePreview.appendChild(previewItem);
}

function handleCameraCapture() {
    showToast('Captura de câmera em desenvolvimento', 'info');
    // TODO: Implement camera capture functionality
}

// ================================================================
// Emoji Picker
// ================================================================

function initializeEmojiPicker() {
    if (!elements.emojiGrid) return;
    
    // Load recent emojis
    const recentEmojis = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_EMOJIS) || '[]');
    if (recentEmojis.length > 0) {
        EMOJI_CATEGORIES.recent = recentEmojis;
    }
    
    // Render default category
    renderEmojis('recent');
}

function toggleEmojiPicker() {
    elements.emojiPicker?.classList.toggle('hidden');
    
    if (!elements.emojiPicker?.classList.contains('hidden')) {
        elements.emojiSearch?.focus();
    }
}

function switchEmojiCategory(category) {
    // Update active state
    elements.emojiCategories?.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderEmojis(category);
}

function renderEmojis(category) {
    if (!elements.emojiGrid) return;
    
    const emojis = EMOJI_CATEGORIES[category] || [];
    
    elements.emojiGrid.innerHTML = emojis.map(emoji => `
        <button class="emoji-item" data-emoji="${emoji}">${emoji}</button>
    `).join('');
    
    // Add click handlers
    elements.emojiGrid.querySelectorAll('.emoji-item').forEach(btn => {
        btn.addEventListener('click', () => insertEmoji(btn.dataset.emoji));
    });
}

function insertEmoji(emoji) {
    const cursorPos = elements.messageInput.selectionStart;
    const textBefore = elements.messageInput.value.substring(0, cursorPos);
    const textAfter = elements.messageInput.value.substring(cursorPos);
    
    elements.messageInput.value = textBefore + emoji + textAfter;
    elements.messageInput.focus();
    elements.messageInput.selectionStart = elements.messageInput.selectionEnd = cursorPos + emoji.length;
    
    updateCharCount();
    
    // Add to recent emojis
    addRecentEmoji(emoji);
    
    if (state.soundEnabled) playSound(...SOUND_EFFECTS.CLICK);
}

function addRecentEmoji(emoji) {
    let recent = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_EMOJIS) || '[]');
    
    // Remove if already exists
    recent = recent.filter(e => e !== emoji);
    
    // Add to beginning
    recent.unshift(emoji);
    
    // Keep only last 20
    recent = recent.slice(0, 20);
    
    localStorage.setItem(STORAGE_KEYS.RECENT_EMOJIS, JSON.stringify(recent));
    EMOJI_CATEGORIES.recent = recent;
}

function filterEmojis(searchTerm) {
    if (!searchTerm) {
        renderEmojis('recent');
        return;
    }
    
    // Simple emoji search across all categories
    const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
    const filtered = allEmojis.filter(emoji => {
        // This is simplified - in production, use emoji names/keywords
        return true; // Show all for now
    });
    
    elements.emojiGrid.innerHTML = filtered.slice(0, 50).map(emoji => `
        <button class="emoji-item" data-emoji="${emoji}">${emoji}</button>
    `).join('');
    
    elements.emojiGrid.querySelectorAll('.emoji-item').forEach(btn => {
        btn.addEventListener('click', () => insertEmoji(btn.dataset.emoji));
    });
}

// ================================================================
// Chat Management
// ================================================================

function exportChat() {
    if (state.chatHistory.length === 0) {
        showToast('Não há mensagens para exportar', 'error');
        return;
    }
    
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `nexia-chat-${timestamp}.txt`;
    
    let content = `╔═══════════════════════════════════════════════════════════╗\n`;
    content += `║           NEXIA 3.0 - Conversa Exportada                 ║\n`;
    content += `╚═══════════════════════════════════════════════════════════╝\n\n`;
    content += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
    content += `Modo: ${state.currentMode}\n`;
    content += `Total de mensagens: ${state.messageCount}\n`;
    content += `Tokens estimados: ${state.tokenCount}\n`;
    content += `${'='.repeat(60)}\n\n`;
    
    state.chatHistory.forEach((msg, index) => {
        const sender = msg.sender === 'user' ? '👤 VOCÊ' : '🤖 NEXIA';
        content += `[${msg.timestamp}] ${sender}:\n`;
        content += `${msg.text}\n\n`;
        content += `${'-'.repeat(60)}\n\n`;
    });
    
    content += `${'='.repeat(60)}\n`;
    content += `Exportado por NEXIA 3.0 - Neural AI Assistant\n`;
    content += `© 2024 AmplaAI - https://amplaai.com\n`;
    content += `Versão: ${CONFIG.VERSION}\n`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
    
    if (state.soundEnabled) playSound(...SOUND_EFFECTS.SUCCESS);
    
    showToast('Conversa exportada com sucesso! 📥', 'success');
    
    console.log('📥 Chat exported:', filename);
}

function copyMessage(text) {
    navigator.clipboard.writeText(text).then(() => {
        if (state.soundEnabled) playSound(...SOUND_EFFECTS.CLICK);
        showToast('Mensagem copiada! 📋', 'success', 2000);
    }).catch(err => {
        console.error('❌ Copy failed:', err);
        showToast('Erro ao copiar mensagem', 'error');
    });
}

// ================================================================
// Context Menu
// ================================================================

function handleContextMenu(e) {
    // Check if right-click is on a message
    const messageBubble = e.target.closest('.message-bubble');
    if (!messageBubble) return;
    
    e.preventDefault();
    
    const messageDiv = messageBubble.closest('.message');
    const messageId = messageDiv?.dataset.messageId;
    const message = state.chatHistory.find(m => m.id === messageId);
    
    if (!message) return;
    
    state.selectedMessage = message;
    
    // Position context menu
    elements.contextMenu.style.left = `${e.pageX}px`;
    elements.contextMenu.style.top = `${e.pageY}px`;
    elements.contextMenu.classList.remove('hidden');
    
    // Add event listeners
    const contextItems = elements.contextMenu.querySelectorAll('.context-menu-item');
    contextItems.forEach(item => {
        item.onclick = () => handleContextMenuAction(item.dataset.action);
    });
}

function handleContextMenuAction(action) {
    if (!state.selectedMessage) return;
    
    switch(action) {
        case 'copy':
            copyMessage(state.selectedMessage.text);
            break;
        case 'regenerate':
            regenerateResponse(state.selectedMessage);
            break;
        case 'edit':
            editMessage(state.selectedMessage);
            break;
        case 'share':
            shareMessage(state.selectedMessage);
            break;
        case 'delete':
            deleteMessage(state.selectedMessage);
            break;
    }
    
    elements.contextMenu?.classList.add('hidden');
    state.selectedMessage = null;
}

function editMessage(message) {
    elements.messageInput.value = message.text;
    elements.messageInput.focus();
    showToast('Mensagem carregada para edição', 'info');
}

function shareMessage(message) {
    if (navigator.share) {
        navigator.share({
            title: 'NEXIA 3.0',
            text: message.text
        }).then(() => {
            showToast('Mensagem compartilhada!', 'success');
        }).catch(err => {
            console.error('Share failed:', err);
        });
    } else {
        copyMessage(message.text);
        showToast('Use Ctrl+V para colar', 'info');
    }
}

function deleteMessage(message) {
    if (!confirm('Deletar esta mensagem?')) return;
    
    const index = state.chatHistory.findIndex(m => m.id === message.id);
    if (index !== -1) {
        state.chatHistory.splice(index, 1);
        
        const messageElement = document.querySelector(`[data-message-id="${message.id}"]`);
        messageElement?.remove();
        
        saveState();
        showToast('Mensagem deletada', 'success');
    }
}

// ================================================================
// Scroll Management
// ================================================================

function scrollToBottom(smooth = true) {
    if (!elements.chatMessages) return;
    
    const behavior = smooth ? 'smooth' : 'auto';
    elements.chatMessages.scrollTo({
        top: elements.chatMessages.scrollHeight,
        behavior: behavior
    });
}

function handleScroll() {
    if (!elements.chatMessages || !elements.scrollBottomBtn) return;
    
    const { scrollTop, scrollHeight, clientHeight } = elements.chatMessages;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    
    if (isNearBottom) {
        elements.scrollBottomBtn.classList.add('hidden');
    } else {
        elements.scrollBottomBtn.classList.remove('hidden');
    }
    
    // Count unread messages (simulated)
    // In production, track which messages are in viewport
}

function handleResize() {
    // Recalculate canvas size
    if (elements.neuralCanvas) {
        initializeNeuralCanvas();
    }
}

// ================================================================
// Statistics & Session Timer
// ================================================================

function updateStats() {
    if (elements.totalMessages) {
        elements.totalMessages.textContent = state.messageCount;
    }
}

function startSessionTimer() {
    setInterval(() => {
        const elapsed = Date.now() - state.sessionStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const timeString = hours > 0 
            ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (elements.sessionTime) {
            elements.sessionTime.textContent = timeString;
        }
    }, 1000);
}

// ================================================================
// Toast Notifications
// ================================================================

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>`,
        error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>`,
        info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>`,
        warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`
    };
    
    toast.innerHTML = `
        ${icons[type]}
        <div class="toast-content">
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" aria-label="Fechar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    `;
    
    elements.toastContainer?.appendChild(toast);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    
    // Auto remove
    setTimeout(() => removeToast(toast), duration);
    
    // Play notification sound
    if (state.soundEnabled && type === 'success') {
        playSound(...SOUND_EFFECTS.NOTIFICATION);
    }
}

function removeToast(toast) {
    toast.style.animation = 'toastSlideIn 0.3s ease reverse';
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 300);
}

// ================================================================
// Neural Canvas Animation
// ================================================================

function initializeNeuralCanvas() {
    const canvas = elements.neuralCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    // Create particles
    const particles = [];
    
    class NeuralParticle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.connections = [];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            this.connections = [];
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
            ctx.fill();
        }
        
        drawConnections() {
            this.connections.forEach(particle => {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(particle.x, particle.y);
                
                const distance = Math.hypot(this.x - particle.x, this.y - particle.y);
                const opacity = Math.max(0, 0.15 * (1 - distance / 150));
                
                ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            });
        }
    }
    
    // Create particles
    for (let i = 0; i < CONFIG.NEURAL_PARTICLES; i++) {
        particles.push(new NeuralParticle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update particles
        particles.forEach(particle => particle.update());
        
        // Find connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    p1.connections.push(p2);
                }
            });
        });
        
        // Draw connections
        particles.forEach(particle => particle.drawConnections());
        
        // Draw particles
        particles.forEach(particle => particle.draw());
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    state.neuralParticles = particles;
}

// ================================================================
// Keyboard Shortcuts
// ================================================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Command palette
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleCommandPalette();
        }
        
        // Ctrl/Cmd + E: Export chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportChat();
        }
        
        // Ctrl/Cmd + N: New chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            createNewChat();
        }
        
        // Ctrl/Cmd + ,: Settings
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            e.preventDefault();
            openModal('settings');
        }
        
        // Ctrl/Cmd + /: Toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            toggleSidebar();
        }
        
        // T: Toggle theme
        if (e.key === 't' && !e.ctrlKey && !e.metaKey && !isInputFocused()) {
            e.preventDefault();
            toggleTheme();
        }
        
        // S: Toggle sound
        if (e.key === 's' && !e.ctrlKey && !e.metaKey && !isInputFocused()) {
            e.preventDefault();
            toggleSound();
        }
        
        // V: Toggle voice
        if (e.key === 'v' && !e.ctrlKey && !e.metaKey && !isInputFocused()) {
            e.preventDefault();
            toggleVoice();
        }
        
        // M: Toggle mode menu
        if (e.key === 'm' && !e.ctrlKey && !e.metaKey && !isInputFocused()) {
            e.preventDefault();
            toggleModeMenu();
        }
        
        // Esc: Close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
    );
}

function toggleCommandPalette() {
    elements.commandPalette?.classList.toggle('hidden');
    
    if (!elements.commandPalette?.classList.contains('hidden')) {
        elements.commandSearch?.focus();
        renderCommandList();
    }
}

function renderCommandList(filter = '') {
    if (!elements.commandList) return;
    
    const allCommands = [
        { title: 'Nova Conversa', desc: 'Iniciar uma nova conversa', action: 'newChat', shortcut: 'Ctrl+N' },
        { title: 'Exportar Chat', desc: 'Exportar conversa atual', action: 'export', shortcut: 'Ctrl+E' },
        { title: 'Configurações', desc: 'Abrir configurações', action: 'settings', shortcut: 'Ctrl+,' },
        { title: 'Alternar Tema', desc: 'Mudar entre claro/escuro', action: 'theme', shortcut: 'T' },
        { title: 'Alternar Som', desc: 'Ativar/desativar sons', action: 'sound', shortcut: 'S' },
        { title: 'Controle de Voz', desc: 'Ativar reconhecimento de voz', action: 'voice', shortcut: 'V' },
        { title: 'Resumir Conversa', desc: 'Gerar resumo da conversa', action: 'summarize', shortcut: '@summarize' },
        { title: 'Traduzir', desc: 'Traduzir última mensagem', action: 'translate', shortcut: '@translate' },
        { title: 'Gerar Código', desc: 'Criar código', action: 'code', shortcut: '@code' },
        { title: 'Análise Profunda', desc: 'Análise detalhada', action: 'analyze', shortcut: '@analyze' }
    ];
    
    const filtered = filter 
        ? allCommands.filter(cmd => 
            cmd.title.toLowerCase().includes(filter.toLowerCase()) ||
            cmd.desc.toLowerCase().includes(filter.toLowerCase())
          )
        : allCommands;
    
    elements.commandList.innerHTML = filtered.map(cmd => `
        <div class="command-item" data-action="${cmd.action}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="command-item-content">
                <div class="command-item-title">${cmd.title}</div>
                <div class="command-item-desc">${cmd.desc}</div>
            </div>
            <kbd class="command-shortcut">${cmd.shortcut}</kbd>
        </div>
    `).join('');
    
    // Add click handlers
    elements.commandList.querySelectorAll('.command-item').forEach(item => {
        item.addEventListener('click', () => executeCommand(item.dataset.action));
    });
}

function executeCommand(action) {
    closeAllModals();
    
    switch(action) {
        case 'newChat':
            createNewChat();
            break;
        case 'export':
            exportChat();
            break;
        case 'settings':
            openModal('settings');
            break;
        case 'theme':
            toggleTheme();
            break;
        case 'sound':
            toggleSound();
            break;
        case 'voice':
            toggleVoice();
            break;
        case 'summarize':
            summarizeConversation();
            break;
        case 'translate':
            elements.messageInput.value = '@translate ';
            elements.messageInput.focus();
            break;
        case 'code':
            elements.messageInput.value = '@code ';
            elements.messageInput.focus();
            break;
        case 'analyze':
            elements.messageInput.value = '@analyze ';
            elements.messageInput.focus();
            break;
    }
}

// ================================================================
// Modal Management
// ================================================================

function openModal(modalName) {
    if (modalName === 'settings' && elements.settingsModal) {
        elements.settingsModal.classList.remove('hidden');
        
        // Populate settings
        document.getElementById('temperatureSlider').value = state.settings.temperature * 100;
        document.getElementById('temperatureValue').textContent = state.settings.temperature.toFixed(1);
        document.getElementById('maxTokensSelect').value = state.settings.maxTokens;
        document.getElementById('contextLengthSelect').value = state.settings.contextLength;
        document.getElementById('animationsToggle').checked = state.settings.animations;
        document.getElementById('codeFormattingToggle').checked = state.settings.codeFormatting;
        document.getElementById('systemSoundsToggle').checked = state.settings.systemSounds;
        document.getElementById('ttsToggle').checked = state.settings.tts;
        document.getElementById('notificationsToggle').checked = state.settings.notifications;
        document.getElementById('saveHistoryToggle').checked = state.settings.saveHistory;
        document.getElementById('devModeToggle').checked = state.settings.devMode;
    }
}

function closeModal(modalName) {
    if (modalName === 'settings' && elements.settingsModal) {
        elements.settingsModal.classList.add('hidden');
    }
}

function closeAllModals() {
    elements.settingsModal?.classList.add('hidden');
    elements.commandPalette?.classList.add('hidden');
    elements.modeMenu?.classList.add('hidden');
    elements.emojiPicker?.classList.add('hidden');
    elements.contextMenu?.classList.add('hidden');
}

// ================================================================
// Notifications
// ================================================================

function checkNotificationPermission() {
    if ('Notification' in window && state.settings.notifications) {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showToast('Notificações ativadas!', 'success');
                }
            });
        }
    }
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-72.png',
            tag: 'nexia-notification',
            renotify: true,
            requireInteraction: false
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        setTimeout(() => notification.close(), 5000);
    }
}

// ================================================================
// Tips Rotation
// ================================================================

const TIPS = [
    '💡 Use @ para ver comandos rápidos disponíveis',
    '⚡ Pressione Ctrl+K para abrir a paleta de comandos',
    '🎯 Escolha diferentes modos para respostas personalizadas',
    '🔊 Ative o controle de voz para falar naturalmente',
    '📋 Clique com botão direito nas mensagens para mais opções',
    '💾 Suas conversas são salvas automaticamente',
    '🎨 Experimente o modo claro nas configurações',
    '⌨️ Use Ctrl+Enter para enviar mensagens rapidamente',
    '🌍 O modo tradutor suporta mais de 50 idiomas',
    '🧠 O modo analista oferece insights profundos',
    '✨ Use markdown para formatar suas mensagens',
    '📊 Acompanhe suas estatísticas no rodapé'
];

function rotateTips() {
    if (!elements.quickTip) return;
    
    let currentTipIndex = 0;
    
    setInterval(() => {
        currentTipIndex = (currentTipIndex + 1) % TIPS.length;
        
        elements.quickTip.style.opacity = '0';
        
        setTimeout(() => {
            elements.quickTip.textContent = TIPS[currentTipIndex];
            elements.quickTip.style.opacity = '1';
        }, 300);
    }, 8000);
}

// ================================================================
// Utility Functions
// ================================================================

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
}

function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ================================================================
// Error Handling & Logging
// ================================================================

window.addEventListener('error', (e) => {
    console.error('❌ Global error:', e.error);
    
    if (state.settings.devMode) {
        showToast(`Error: ${e.error?.message || 'Unknown error'}`, 'error', 5000);
    } else {
        showToast('Ocorreu um erro inesperado', 'error');
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Unhandled promise rejection:', e.reason);
    
    if (state.settings.devMode) {
        showToast(`Promise rejected: ${e.reason}`, 'error', 5000);
    } else {
        showToast('Erro ao processar requisição', 'error');
    }
});

// ================================================================
// Performance Monitoring
// ================================================================

if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const timing = {
                'Load Time': `${(perfData.loadEventEnd - perfData.fetchStart).toFixed(0)}ms`,
                'DOM Content Loaded': `${(perfData.domContentLoadedEventEnd - perfData.fetchStart).toFixed(0)}ms`,
                'DOM Interactive': `${(perfData.domInteractive - perfData.fetchStart).toFixed(0)}ms`,
                'First Paint': `${(perfData.responseStart - perfData.fetchStart).toFixed(0)}ms`
            };
            
            console.log('%c⚡ Performance Metrics:', 'color: #10b981; font-weight: bold;');
            console.table(timing);
            
            if (state.settings.devMode) {
                const statusText = Object.entries(timing)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(' | ');
                
                if (elements.neuralStatus) {
                    elements.neuralStatus.textContent = statusText;
                }
            }
        }, 0);
    });
}

// ================================================================
// Analytics & Tracking (Optional)
// ================================================================

function trackEvent(category, action, label = '') {
    if (state.settings.devMode) {
        console.log('📊 Event:', { category, action, label });
    }
    
    // TODO: Integrate with your analytics service
    // Example: Google Analytics, Plausible, etc.
}

// ================================================================
// PWA Install Prompt
// ================================================================

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or prompt
    showToast('📱 Você pode instalar NEXIA como aplicativo!', 'info', 5000);
    
    console.log('💾 PWA install prompt ready');
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    showToast('✅ NEXIA instalado com sucesso!', 'success');
    trackEvent('PWA', 'installed');
});

// ================================================================
// Network Status
// ================================================================

function updateOnlineStatus() {
    const status = navigator.onLine ? 'online' : 'offline';
    
    if (elements.neuralStatus) {
        elements.neuralStatus.textContent = status === 'online' 
            ? 'Neural Network Active' 
            : 'Offline Mode';
    }
    
    if (!navigator.onLine) {
        showToast('⚠️ Você está offline. Algumas funcionalidades podem não funcionar.', 'warning', 5000);
    }
}

window.addEventListener('online', () => {
    updateOnlineStatus();
    showToast('🌐 Conexão restaurada!', 'success');
});

window.addEventListener('offline', () => {
    updateOnlineStatus();
    showToast('📡 Sem conexão. Trabalhando offline...', 'warning');
});

// ================================================================
// Debug Mode
// ================================================================

window.NEXIA_DEBUG = {
    version: CONFIG.VERSION,
    state: () => state,
    config: () => CONFIG,
    
    clearState: () => {
        if (confirm('Clear all state?')) {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            sessionStorage.clear();
            console.log('🧹 All state cleared');
            location.reload();
        }
    },
    
    simulateMessage: (text, sender = 'user') => {
        displayMessage({ 
            text, 
            sender, 
            timestamp: getCurrentTime(),
            id: generateId()
        }, true);
    },
    
    exportLogs: () => {
        const logs = {
            timestamp: new Date().toISOString(),
            version: CONFIG.VERSION,
            state: {
                mode: state.currentMode,
                messageCount: state.messageCount,
                tokenCount: state.tokenCount,
                sessionDuration: Date.now() - state.sessionStartTime
            },
            settings: state.settings,
            chatHistory: state.chatHistory.length,
            performance: performance.getEntriesByType('navigation')[0],
            userAgent: navigator.userAgent
        };
        
        console.log('📊 System Logs:', logs);
        
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nexia-logs-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        return logs;
    },
    
    testAPI: async () => {
        console.log('🧪 Testing Mistral API...');
        try {
            const response = await callMistralAPI('Hello, this is a test message.');
            console.log('✅ API Response:', response);
            return response;
        } catch (error) {
            console.error('❌ API Test failed:', error);
            return null;
        }
    },
    
    showStats: () => {
        const stats = {
            'Total Messages': state.messageCount,
            'Estimated Tokens': state.tokenCount,
            'Session Duration': `${Math.floor((Date.now() - state.sessionStartTime) / 1000)}s`,
            'Chat Sessions': state.chatSessions.length,
            'Current Mode': state.currentMode,
            'Sound Enabled': state.soundEnabled,
            'Voice Enabled': state.voiceEnabled,
            'TTS Enabled': state.settings.tts,
            'Neural Particles': state.neuralParticles.length
        };
        
        console.table(stats);
        return stats;
    },
    
    triggerError: () => {
        throw new Error('Test error from debug console');
    },
    
    resetToDefaults: () => {
        resetSettings();
    }
};

// ================================================================
// Easter Eggs & Fun Features
// ================================================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    showToast('🎮 Código Konami ativado! Modo Neural Turbo habilitado!', 'success', 5000);
    
    // Add visual effect
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
    
    if (state.soundEnabled) {
        playSound(1000, 0.1);
        setTimeout(() => playSound(1200, 0.1), 100);
        setTimeout(() => playSound(1400, 0.1), 200);
    }
}

// ================================================================
// Initialization Complete
// ================================================================

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ███╗   ██╗███████╗██╗  ██╗██╗ █████╗     ██████╗ ███████╗    ║
║   ████╗  ██║██╔════╝╚██╗██╔╝██║██╔══██╗   ╚════██╗██╔═══██╗   ║
║   ██╔██╗ ██║█████╗   ╚███╔╝ ██║███████║    █████╔╝██║   ██║   ║
║   ██║╚██╗██║██╔══╝   ██╔██╗ ██║██╔══██║    ╚═══██╗██║   ██║   ║
║   ██║ ╚████║███████╗██╔╝ ██╗██║██║  ██║   ██████╔╝╚██████╔╝   ║
║   ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝   ╚═════╝  ╚═════╝    ║
║                                                           ║
║              Neural AI Assistant - Ultra Premium          ║
║                   Version ${CONFIG.VERSION}                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

🚀 Sistema inicializado com sucesso!
🧠 Rede neural ativa
⚡ Todas as funcionalidades operacionais
💡 Debug mode: window.NEXIA_DEBUG

Desenvolvido com ❤️ pela AmplaAI
© 2024 Todos os direitos reservados
`);

console.log('%c💡 Dica:', 'color: #06b6d4; font-weight: bold;', 'Use window.NEXIA_DEBUG para acessar ferramentas de debug');

// Track initialization
trackEvent('App', 'initialized', CONFIG.VERSION);

// Mark as ready
window.NEXIA_READY = true;

// Dispatch custom event
window.dispatchEvent(new CustomEvent('nexia:ready', {
    detail: {
        version: CONFIG.VERSION,
        timestamp: Date.now()
    }
}));

// ================================================================
// Export for Module Systems (if needed)
// ================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        state,
        handleSendMessage,
        callMistralAPI,
        displayMessage,
        toggleTheme,
        toggleSound,
        exportChat,
        createNewChat
    };
}
