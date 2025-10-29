/**
 * SENA - Sistema de Traduções
 * Suporta: Português (BR), English (US), Español (ES)
 */

const translations = {
    pt: {
        // Welcome Screen
        welcomeTagline: 'Tecnologia com alma gentil.',
        welcomeDescription: 'Olá! Eu sou a Sena, sua assistente digital. Estou aqui para tornar a tecnologia simples e acessível para você. Vamos começar?',
        welcomeFeaturesTitle: '✨ O que posso fazer por você:',
        welcomeFeaturesList: [
            '📚 Explicar conceitos de tecnologia de forma simples',
            '📅 Ajudar na organização do seu dia a dia',
            '💡 Responder perguntas sobre diversos assuntos',
            '🎯 Criar lembretes e sugestões personalizadas',
            '🗣️ Conversar por voz (clique no microfone)'
        ],
        welcomeDisclaimer: '⚠️ <strong>Aviso:</strong> Sou uma inteligência artificial e posso cometer erros. Sempre verifique informações importantes em fontes confiáveis.',
        welcomeTerms: 'Ao usar, eu concordo com os <a href="https://termos.orpheostudio.com.br" target="_blank" class="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300">Termos de Uso</a> e <a href="https://políticas.orpheostudio.com.br" target="_blank" class="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300">Políticas de Privacidade</a> da Orpheo Studio.',
        startButton: 'Começar a conversar 🌸',
        
        // Chat Interface
        headerTagline: 'Tecnologia com alma gentil',
        statusText: 'MiraAI Conectada',
        listeningText: 'Ouvindo...',
        inputPlaceholder: 'Digite sua pergunta...',
        
        // Footer
        footerTagline: 'As respostas da Sena utilizam MiraAI by Orpheo Studio. 🌸',
        footerDisclaimer: 'Sena pode cometer erros. Verifique informações importantes.',
        
        // Initial Message
        greeting: 'Olá! Eu sou a Sena. 🌸<br>A tecnologia com alma gentil.<br><br>Pode me chamar para o que precisar. Eu aprendo com você.',
        
        // Suggestions
        suggestions: [
            'O que você pode fazer?',
            'Como baixo um app no celular?',
            'Pode me explicar sobre os termos e políticas da Orpheo?',
            'Como doar para a Orpheo Studio?'
        ],
        
        // Buttons & Actions
        btnSend: 'Enviar',
        btnVoice: 'Ativar voz',
        btnDarkMode: 'Modo escuro',
        btnLanguage: 'Mudar idioma',
        btnReport: 'Reportar problema',
        
        // Errors
        errorApi: 'Desculpe, tive um problema para processar sua mensagem. Pode tentar novamente? 😔',
        errorVoice: 'Seu navegador não suporta reconhecimento de voz.',
        errorNetwork: 'Erro de conexão. Verifique sua internet e tente novamente.',
        
        // Tooltips
        tooltipSend: 'Enviar mensagem',
        tooltipVoice: 'Falar com Sena',
        tooltipDark: 'Alternar modo escuro',
        tooltipLang: 'Mudar idioma',
        tooltipReport: 'Reportar bug'
    },
    
    en: {
        // Welcome Screen
        welcomeTagline: 'Technology with a gentle soul.',
        welcomeDescription: 'Hello! I am Sena, your digital assistant. I am here to make technology simple and accessible for you. Shall we begin?',
        welcomeFeaturesTitle: '✨ What I can do for you:',
        welcomeFeaturesList: [
            '📚 Explain technology concepts in a simple way',
            '📅 Help organize your daily life',
            '💡 Answer questions on various subjects',
            '🎯 Create reminders and personalized suggestions',
            '🗣️ Chat by voice (click the microphone)'
        ],
        welcomeDisclaimer: '⚠️ <strong>Notice:</strong> I am an artificial intelligence and may make mistakes. Always verify important information from reliable sources.',
        welcomeTerms: 'I have read and accept the <a href="https://termos.orpheostudio.com.br" target="_blank" class="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300">Terms of Use</a> and <a href="https://políticas.orpheostudio.com.br" target="_blank" class="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300">Privacy Policy</a> of Orpheo Studio.',
        startButton: 'Start chatting 🌸',
        
        // Chat Interface
        headerTagline: 'Technology with a gentle soul',
        statusText: 'MiraAI Connected',
        listeningText: 'Listening...',
        inputPlaceholder: 'Type your question...',
        
        // Footer
        footerTagline: 'Sena\'s responses use MiraAI by Orpheo Studio. 🌸',
        footerDisclaimer: 'Sena may make mistakes. Verify important information.',
        
        // Initial Message
        greeting: 'Hello! I am Sena. 🌸<br>Technology with a gentle soul.<br><br>Call me for anything you need. I learn with you.',
        
        // Suggestions
        suggestions: [
            'What can you do?',
            'How do I download an app on my phone?',
            'Can you explain Orpheo\'s terms and policies?',
            'How to donate to Orpheo Studio?'
        ],
        
        // Buttons & Actions
        btnSend: 'Send',
        btnVoice: 'Enable voice',
        btnDarkMode: 'Dark mode',
        btnLanguage: 'Change language',
        btnReport: 'Report issue',
        
        // Errors
        errorApi: 'Sorry, I had a problem processing your message. Can you try again? 😔',
        errorVoice: 'Your browser does not support voice recognition.',
        errorNetwork: 'Connection error. Check your internet and try again.',
        
        // Tooltips
        tooltipSend: 'Send message',
        tooltipVoice: 'Talk to Sena',
        tooltipDark: 'Toggle dark mode',
        tooltipLang: 'Change language',
        tooltipReport: 'Report bug'
    },
    
    es: {
        // Welcome Screen
        welcomeTagline: 'Tecnología con alma gentil.',
        welcomeDescription: '¡Hola! Soy Sena, tu asistente digital. Estoy aquí para hacer la tecnología simple y accesible para ti. ¿Empezamos?',
        welcomeFeaturesTitle: '✨ Lo que puedo hacer por ti:',
        welcomeFeaturesList: [
            '📚 Explicar conceptos de tecnología de forma simple',
            '📅 Ayudar en la organización de tu día a día',
            '💡 Responder preguntas sobre diversos temas',
            '🎯 Crear recordatorios y sugerencias personalizadas',
            '🗣️ Conversar por voz (haz clic en el micrófono)'
        ],
        welcomeDisclaimer: '⚠️ <strong>Aviso:</strong> Soy una inteligencia artificial y puedo cometer errores. Siempre verifica información importante en fuentes confiables.',
        welcomeTerms: 'He leído y acepto los <a href="https://termos.orpheostudio.com.br" target="_blank" class="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300">Términos de Uso</a> y <a href="https://políticas.orpheostudio.com.br" target="_blank" class="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300">Políticas de Privacidad</a> de Orpheo Studio.',
        startButton: 'Comenzar a conversar 🌸',
        
        // Chat Interface
        headerTagline: 'Tecnología con alma gentil',
        statusText: 'MiraAI Conectada',
        listeningText: 'Escuchando...',
        inputPlaceholder: 'Escribe tu pregunta...',
        
        // Footer
        footerTagline: 'Las respuestas de Sena utilizan MiraAI by Orpheo Studio. 🌸',
        footerDisclaimer: 'Sena puede cometer errores. Verifica información importante.',
        
        // Initial Message
        greeting: '¡Hola! Soy Sena. 🌸<br>Tecnología con alma gentil.<br><br>Llámame para lo que necesites. Aprendo contigo.',
        
        // Suggestions
        suggestions: [
            '¿Qué puedes hacer?',
            '¿Cómo descargo una app en el celular?',
            '¿Puedes explicar los términos y políticas de Orpheo?',
            '¿Cómo donar a Orpheo Studio?'
        ],
        
        // Buttons & Actions
        btnSend: 'Enviar',
        btnVoice: 'Activar voz',
        btnDarkMode: 'Modo oscuro',
        btnLanguage: 'Cambiar idioma',
        btnReport: 'Reportar problema',
        
        // Errors
        errorApi: 'Lo siento, tuve un problema procesando tu mensaje. ¿Puedes intentar de nuevo? 😔',
        errorVoice: 'Tu navegador no soporta reconocimiento de voz.',
        errorNetwork: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
        
        // Tooltips
        tooltipSend: 'Enviar mensaje',
        tooltipVoice: 'Hablar con Sena',
        tooltipDark: 'Alternar modo oscuro',
        tooltipLang: 'Cambiar idioma',
        tooltipReport: 'Reportar error'
    }
};

// Exportar traduções
window.SENA_TRANSLATIONS = translations;

console.log('🌍 Traduções carregadas (pt, en, es)');
