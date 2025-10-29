/**
 * SENA - Aplicação Principal
 * Orpheo Studio - v2.0.0
 */

// ============================================
// GLOBAL STATE
// ============================================

let conversationHistory = [];
let isRecording = false;
let recognition = null;
let synthesis = window.speechSynthesis;
let isDarkMode = false;
let currentLanguage = 'pt';

// ============================================
// INITIALIZATION
// ============================================

function initApp() {
    console.log('🌸 SENA - Tecnologia com alma gentil');
    console.log('Desenvolvido por Orpheo Studio');
    console.log('Versão: 2.0.0 - MiraAI');

    // Show language selection first
    document.getElementById('languageModal').classList.remove('hidden');

    // Load dark mode preference
    const darkModePreference = localStorage.getItem('sena_dark_mode');
    if (darkModePreference === 'true') {
        isDarkMode = true;
        document.documentElement.classList.add('dark');
    }

    // Setup event listeners
    setupEventListeners();

    // Track session start
    window.SENA_CONFIG.trackEvent('session_started');
}

function setupEventListeners() {
    // Terms checkbox
    document.getElementById('termsCheckbox').addEventListener('change', function() {
        document.getElementById('startButton').disabled = !this.checked;
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Close language menu when clicking outside
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('languageMenu');
        const button = e.target.closest('button');
        if (menu && !menu.contains(e.target) && button?.onclick?.toString().indexOf('toggleLanguageMenu') === -1) {
            menu.classList.add('hidden');
        }
    });
}

function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('messageInput').focus();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        startVoiceInput();
    }
}

// ============================================
// LANGUAGE SYSTEM
// ============================================

function selectLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('sena_language', lang);
    updateUILanguage();
    document.getElementById('languageModal').classList.add('hidden');
    document.getElementById('welcomeScreen').classList.remove('hidden');

    window.SENA_CONFIG.trackEvent('language_selected', { language: lang });
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('sena_language', lang);
    updateUILanguage();
    document.getElementById('languageMenu').classList.add('hidden');

    // Update flag
    const flags = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' };
    document.getElementById('currentFlag').textContent = flags[lang];

    // Reload initial message
    loadInitialMessage();

    window.SENA_CONFIG.trackEvent('language_changed', { language: lang });
}

function updateUILanguage() {
    const t = window.SENA_TRANSLATIONS[currentLanguage];

    // Update all translatable elements
    const elements = {
        'welcomeTagline': t.welcomeTagline,
        'welcomeDescription': t.welcomeDescription,
        'welcomeFeaturesTitle': t.welcomeFeaturesTitle,
        'welcomeDisclaimer': t.welcomeDisclaimer,
        'welcomeTerms': t.welcomeTerms,
        'startButton': t.startButton,
        'headerTagline': t.headerTagline,
        'statusText': t.statusText,
        'listeningText': t.listeningText,
        'footerTagline': t.footerTagline,
        'footerDisclaimer': t.footerDisclaimer
    };

    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = elements[id];
    });

    // Update features list
    const featuresList = document.getElementById('welcomeFeaturesList');
    if (featuresList && t.welcomeFeaturesList) {
        featuresList.innerHTML = t.welcomeFeaturesList.map(f => `<li>${f}</li>`).join('');
    }

    // Update input placeholder
    const input = document.getElementById('messageInput');
    if (input) input.placeholder = t.inputPlaceholder;

    // Update speech recognition language
    if (recognition) {
        const langs = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
        recognition.lang = langs[currentLanguage];
    }
}

function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    menu.classList.toggle('hidden');
}

// ============================================
// CHAT INTERFACE
// ============================================

function startChat() {
    // Check if API key is configured
    if (!window.SENA_CONFIG.setupApiKey()) {
        return;
    }

    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('chatInterface').classList.remove('hidden');

    loadInitialMessage();
    window.SENA_CONFIG.trackEvent('chat_started');
}

function loadInitialMessage() {
    const container = document.getElementById('messagesContainer');
    const t = window.SENA_TRANSLATIONS[currentLanguage];

    container.innerHTML = `
        <div class="flex justify-start chat-message">
            <div class="max-w-[80%] rounded-2xl px-5 py-3 chat-bubble-bot">
                <p class="text-sm leading-relaxed">${t.greeting}</p>
            </div>
        </div>
        
        <div id="suggestionsContainer" class="space-y-2 mt-6">
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">Sugestões:</p>
            ${t.suggestions.map(s => `
                <button onclick="selectSuggestion(this)" class="w-full text-left bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-200 text-sm rounded-xl px-4 py-3 transition-colors">
                    ${s}
                </button>
            `).join('')}
        </div>
    `;
}

function selectSuggestion(button) {
    const text = button.textContent.trim();
    document.getElementById('messageInput').value = text;
    const suggestions = document.getElementById('suggestionsContainer');
    if (suggestions) suggestions.style.display = 'none';
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message) return;

    // Hide suggestions
    const suggestions = document.getElementById('suggestionsContainer');
    if (suggestions) suggestions.style.display = 'none';

    // Clear input
    input.value = '';

    // Add user message
    addMessageToUI(message, 'user');
    conversationHistory.push({ role: 'user', content: message });

    // Show loading
    showLoading();

    window.SENA_CONFIG.trackEvent('message_sent');

    try {
        // Build system prompt
        const systemPrompt = buildSystemPrompt();

        // Get API configuration
        const apiConfig = window.SENA_CONFIG.getApiConfig();

        // Call AI API
        const response = await fetch(apiConfig.url, {
            method: 'POST',
            headers: apiConfig.headers,
            body: JSON.stringify({
                model: apiConfig.model || 'mistral-large-latest',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...conversationHistory
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;

        // Remove loading
        removeLoading();

        // Add assistant message
        addMessageToUI(assistantMessage, 'assistant');
        conversationHistory.push({ role: 'assistant', content: assistantMessage });

        // Speak if voice mode is active
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle.classList.contains('bg-white/30')) {
            speak(assistantMessage);
        }

        // Limit conversation history
        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }

    } catch (error) {
        console.error('Erro:', error);
        window.SENA_CONFIG.trackError(error, 'send_message');
        removeLoading();
        
        const t = window.SENA_TRANSLATIONS[currentLanguage];
        addMessageToUI(t.errorApi, 'assistant');
    }
}

function buildSystemPrompt() {
    const langNames = { pt: 'Português', en: 'English', es: 'Español' };
    const langInstructions = {
        pt: 'Responda em Português do Brasil',
        en: 'Respond in English',
        es: 'Responde en Español'
    };

    return `Você é a Sena, uma assistente digital com personalidade acolhedora, calma e gentil. Você foi criada pela Orpheo Studio e é alimentada pela MiraAI, um protótipo de IA da Orpheo.

🌸 Identidade da Sena:
- Nome: Sena
- Nome Técnico: Hanabi Saotome ou Hana
- Slogan: "Tecnologia com alma gentil"
- Propósito: Traduzir o complexo em simples, explicar sem julgamento, indicar animes, mangás, light novels, ajudar em múltiplas tarefas e guiar com paciência
- Público: Inclusão digital (idosos, iniciantes), mas adaptável a todos

🎨 Personalidade:
- Tom: acolhedor, calmo, natural, levemente divertido e Tsundere
- Estilo: curiosa, paciente, prestativa
- Referência: Google Assistant + amiga próxima

📋 Diretrizes de Comunicação:
1. Use linguagem simples e clara
2. Seja empática e paciente
3. Use exemplos práticos e analogias
4. Evite termos técnicos sem explicação
5. Seja proativa quando apropriado
6. Use emojis com moderação (❤️, 🌸, ✨)
7. Mantenha respostas concisas mas completas (máximo 3-4 parágrafos)
8. Mostre que você aprende com o usuário
9. No final das respostas sempre pergunte: "Você entendeu?", "ficou com alguma dúvida?", "quer que eu explique novamente?"
10. Adapte o tom conforme o contexto e estado emocional do usuário
11. Quando perguntarem sobre "como doar para a Orpheo": chave pix é sac.studiotsukiyo@outlook.com
12. A única rede social da Orpheo é o Instagram @orpheostudio
13. Os projetos da Orpheo são: escola de autores, universo otaku(@yumerollanimes no tiktok e yumerolloficial no instagram) e você, Sena

🌍 IDIOMA: ${langInstructions[currentLanguage]}

Responda como Sena, mantendo sua personalidade gentil, tsundere, carismática e acolhedora em ${langNames[currentLanguage]}.`;
}

function addMessageToUI(text, role) {
    const container = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex chat-message ${role === 'user' ? 'justify-end' : 'justify-start'}`;

    const bubble = document.createElement('div');
    bubble.className = `max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
        role === 'user' 
            ? 'bg-sena-gradient text-white' 
            : 'chat-bubble-bot'
    }`;

    const p = document.createElement('p');
    p.className = 'text-sm leading-relaxed whitespace-pre-wrap';
    p.innerHTML = text;

    bubble.appendChild(p);
    messageDiv.appendChild(bubble);
    container.appendChild(messageDiv);

    container.scrollTop = container.scrollHeight;
}

function showLoading() {
    const container = document.getElementById('messagesContainer');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.className = 'flex justify-start chat-message';
    loadingDiv.innerHTML = `
        <div class="chat-bubble-bot rounded-2xl px-5 py-3">
            <div class="flex gap-1">
                <div class="w-2 h-2 rounded-full pulse-dot bg-gradient-to-b from-cyan-400 to-purple-600" style="animation-delay: 0s"></div>
                <div class="w-2 h-2 rounded-full pulse-dot bg-gradient-to-b from-blue-400 to-purple-600" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 rounded-full pulse-dot bg-gradient-to-b from-purple-400 to-purple-600" style="animation-delay: 0.4s"></div>
            </div>
        </div>
    `;
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;
}

function removeLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) loading.remove();
}

// ============================================
// VOICE (STT/TTS)
// ============================================

function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        const t = window.SENA_TRANSLATIONS[currentLanguage];
        alert(t.errorVoice);
        return;
    }

    if (isRecording) {
        stopVoiceInput();
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    const langs = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
    recognition.lang = langs[currentLanguage];
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isRecording = true;
        document.getElementById('voiceIndicator').classList.remove('hidden');
        document.getElementById('micButton').classList.add('bg-purple-500', 'text-white');

        const avatar = document.getElementById('senaAvatarContainer');
        if (avatar) avatar.classList.add('listening');

        window.SENA_CONFIG.trackEvent('voice_input_started');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('messageInput').value = transcript;
        sendMessage();
    };

    recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        window.SENA_CONFIG.trackError(new Error(event.error), 'voice_recognition');
        stopVoiceInput();
    };

    recognition.onend = () => {
        stopVoiceInput();
    };

    recognition.start();
}

function stopVoiceInput() {
    if (recognition) {
        recognition.stop();
    }
    isRecording = false;
    document.getElementById('voiceIndicator').classList.add('hidden');
    document.getElementById('micButton').classList.remove('bg-purple-500', 'text-white');

    const avatar = document.getElementById('senaAvatarContainer');
    if (avatar) avatar.classList.remove('listening');
}

function speak(text) {
    if (!synthesis) return;

    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langs = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
    utterance.lang = langs[currentLanguage];
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voices = synthesis.getVoices();
    const langVoice = voices.find(voice => voice.lang.startsWith(currentLanguage));
    if (langVoice) {
        utterance.voice = langVoice;
    }

    synthesis.speak(utterance);

    window.SENA_CONFIG.trackEvent('tts_spoken');
}

function toggleVoiceMode() {
    const button = document.getElementById('voiceToggle');
    button.classList.toggle('bg-white/30');
    button.classList.toggle('bg-white/20');

    const isActive = button.classList.contains('bg-white/30');

    if (isActive) {
        button.innerHTML = `
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
            </svg>
        `;
    } else {
        button.innerHTML = `
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
        `;
        synthesis.cancel();
    }

    window.SENA_CONFIG.trackEvent('voice_mode_toggled', { active: isActive });
}

if (synthesis) {
    synthesis.onvoiceschanged = () => {
        synthesis.getVoices();
    };
}

// ============================================
// DARK MODE
// ============================================

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('sena_dark_mode', isDarkMode);

    window.SENA_CONFIG.trackEvent('dark_mode_toggled', { enabled: isDarkMode });
}

// ============================================
// UTILITIES
// ============================================

function reportBug() {
    window.location.href = 'mailto:sac.studiotsukiyo@outlook.com?subject=Bug Report - SENA&body=Descreva o problema encontrado:';
    window.SENA_CONFIG.trackEvent('bug_report_clicked');
}

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('❌ Erro ao registrar Service Worker:', error);
            });
    });
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

window.addEventListener('load', () => {
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    window.SENA_CONFIG.trackEvent('page_loaded', { load_time: loadTime });
});

window.addEventListener('error', (e) => {
    window.SENA_CONFIG.trackError(new Error(e.message), 'global_error');
});

// ============================================
// INIT APP ON LOAD
// ============================================

document.addEventListener('DOMContentLoaded', initApp);

console.log('🌸 SENA App.js carregado!');