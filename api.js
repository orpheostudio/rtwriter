/**
 * SENA - Configuração
 * Orpheo Studio
 */

// ============================================
// API CONFIGURATION
// ============================================

// ⚠️ IMPORTANTE: Nunca exponha sua API key diretamente!
// Use uma das seguintes opções:

// Opção 1: Configuração pelo usuário (primeira execução)
let MISTRAL_API_KEY = localStorage.getItem('sena_api_key') || '';

// Função para configurar a API key
function setupApiKey() {
    if (!MISTRAL_API_KEY) {
        const key = prompt(
            '🔑 Para usar a SENA, você precisa de uma API key da Mistral AI.\n\n' +
            '1. Acesse: https://console.mistral.ai/\n' +
            '2. Crie uma conta gratuita\n' +
            '3. Gere uma API key\n' +
            '4. Cole a key abaixo:\n\n' +
            '(A key ficará salva no seu navegador)'
        );
        
        if (key && key.trim()) {
            MISTRAL_API_KEY = key.trim();
            localStorage.setItem('sena_api_key', MISTRAL_API_KEY);
            return true;
        } else {
            alert('❌ API key não fornecida. A SENA não poderá funcionar sem ela.');
            return false;
        }
    }
    return true;
}

// Função para resetar a API key
function resetApiKey() {
    if (confirm('Deseja remover a API key salva? Você precisará configurar uma nova.')) {
        localStorage.removeItem('sena_api_key');
        MISTRAL_API_KEY = '';
        location.reload();
    }
}

// ============================================
// API ENDPOINTS
// ============================================

const API_CONFIG = {
    // Opção A: Chamar Mistral diretamente (requer API key configurada)
    mistral: {
        url: 'https://api.mistral.ai/v1/chat/completions',
        model: 'mistral-large-latest',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': () => `Bearer ${MISTRAL_API_KEY}`
        }
    },
    
    // Opção B: Usar seu próprio backend como proxy (mais seguro)
    // Descomente e configure se você tiver um backend
    /*
    proxy: {
        url: 'https://sua-api.vercel.app/api/chat',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    */
};

// Endpoint ativo (mude para 'proxy' se estiver usando backend)
const ACTIVE_ENDPOINT = 'mistral';

// ============================================
// APP CONFIGURATION
// ============================================

const APP_CONFIG = {
    name: 'SENA',
    version: '2.0.0',
    author: 'Orpheo Studio',
    
    // URLs
    urls: {
        terms: 'https://termos.orpheostudio.com.br',
        privacy: 'https://políticas.orpheostudio.com.br',
        support: 'mailto:sac.studiotsukiyo@outlook.com',
        github: 'https://github.com/orpheostudio',
        instagram: 'https://instagram.com/orpheostudio'
    },
    
    // Chat settings
    chat: {
        maxTokens: 1024,
        temperature: 0.7,
        maxHistoryLength: 20, // Limite de mensagens no histórico
        typingSpeed: 30 // ms por caractere (para efeito de digitação)
    },
    
    // Voice settings
    voice: {
        rate: 0.95,
        pitch: 1.05,
        volume: 1.0
    },
    
    // Storage keys
    storage: {
        apiKey: 'sena_api_key',
        darkMode: 'sena_dark_mode',
        language: 'sena_language',
        conversationHistory: 'sena_conversation',
        acceptedTerms: 'sena_terms_accepted'
    },
    
    // Analytics
    analytics: {
        clarityId: 'YOUR_CLARITY_ID', // Substitua pelo seu ID do Microsoft Clarity
        enabled: true
    }
};

// ============================================
// FEATURE FLAGS
// ============================================

const FEATURES = {
    voiceInput: true,
    voiceOutput: true,
    darkMode: true,
    multiLanguage: true,
    conversationHistory: true,
    analytics: true,
    pwa: true
};

// ============================================
// VALIDATION
// ============================================

function validateApiKey(key) {
    // Validação básica do formato da API key da Mistral
    return key && key.length > 20 && !key.includes(' ');
}

function getApiConfig() {
    const config = API_CONFIG[ACTIVE_ENDPOINT];
    
    if (ACTIVE_ENDPOINT === 'mistral' && !MISTRAL_API_KEY) {
        throw new Error('API key não configurada');
    }
    
    return {
        url: config.url,
        headers: typeof config.headers.Authorization === 'function' 
            ? { ...config.headers, Authorization: config.headers.Authorization() }
            : config.headers,
        model: config.model
    };
}

// ============================================
// HELPERS
// ============================================

function trackEvent(eventName, data = {}) {
    if (FEATURES.analytics && typeof clarity === 'function') {
        clarity('event', eventName, data);
    }
    
    console.log(`📊 Event: ${eventName}`, data);
}

function trackError(error, context = '') {
    console.error(`❌ Error [${context}]:`, error);
    
    if (FEATURES.analytics && typeof clarity === 'function') {
        clarity('event', 'error', {
            message: error.message,
            context: context
        });
    }
}

// ============================================
// EXPORTS
// ============================================

// Disponibilizar configurações globalmente
window.SENA_CONFIG = {
    APP_CONFIG,
    API_CONFIG,
    FEATURES,
    setupApiKey,
    resetApiKey,
    getApiConfig,
    validateApiKey,
    trackEvent,
    trackError
};

console.log('🌸 SENA Config carregado - v' + APP_CONFIG.version);