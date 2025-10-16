// Variáveis globais
let currentConversationId = null;
let conversations = JSON.parse(localStorage.getItem('conversations')) || [];

// Funções de gerenciamento de conversas
function renderConversations() {
    const recentItemsContainer = document.getElementById('recentConversations');
    recentItemsContainer.innerHTML = '';

    conversations.forEach((conv, index) => {
        const recentItem = document.createElement('div');
        recentItem.className = `recent-item ${conv.id === currentConversationId ? 'active' : ''}`;
        recentItem.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>${conv.title || `Conversa ${index + 1}`}</span>
        `;
        recentItem.addEventListener('click', () => openConversation(conv.id));
        recentItemsContainer.appendChild(recentItem);
    });
}

function openConversation(conversationId) {
    currentConversationId = conversationId;
    const conversation = conversations.find(c => c.id === conversationId);
    const messagesArea = document.getElementById('messagesArea');
    messagesArea.innerHTML = '';

    if (conversation && conversation.messages) {
        conversation.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}`;
            messageDiv.innerHTML = `
                <div class="message-avatar ${msg.sender}"></div>
                <div class="message-content">${msg.text}</div>
            `;
            messagesArea.appendChild(messageDiv);
        });
    }

    renderConversations();
    document.querySelector('.sidebar').classList.add('collapsed');
}

function startNewConversation() {
    const newConversation = {
        id: Date.now().toString(),
        title: '',
        messages: []
    };
    conversations.unshift(newConversation);
    currentConversationId = newConversation.id;
    localStorage.setItem('conversations', JSON.stringify(conversations));
    openConversation(currentConversationId);
    renderConversations();
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (!message) return;

    const conversation = conversations.find(c => c.id === currentConversationId);
    if (!conversation) return;

    // Adiciona mensagem do usuário
    conversation.messages.push({ sender: 'user', text: message });
    renderConversationMessages();

    // Chama a API do Yume
    callYumeAPI(message)
        .then(response => {
            conversation.messages.push({ sender: 'assistant', text: response });
            localStorage.setItem('conversations', JSON.stringify(conversations));
            renderConversationMessages();
        })
        .catch(error => {
            console.error("Erro ao chamar a API:", error);
            conversation.messages.push({ sender: 'assistant', text: "Desculpe, ocorreu um erro ao processar sua mensagem." });
            localStorage.setItem('conversations', JSON.stringify(conversations));
            renderConversationMessages();
        });

    messageInput.value = '';
    document.getElementById('charCounter').textContent = '0/2000';
    document.getElementById('sendButton').disabled = true;
}

function renderConversationMessages() {
    const conversation = conversations.find(c => c.id === currentConversationId);
    const messagesArea = document.getElementById('messagesArea');
    messagesArea.innerHTML = '';

    if (conversation && conversation.messages) {
        conversation.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}`;
            messageDiv.innerHTML = `
                <div class="message-avatar ${msg.sender}"></div>
                <div class="message-content">${msg.text}</div>
            `;
            messagesArea.appendChild(messageDiv);
        });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Welcome Modal
    const welcomeModal = document.getElementById('welcomeModal');
    const startButton = document.getElementById('startButton');
    const termsCheckbox = document.getElementById('termsCheckbox');

    termsCheckbox.addEventListener('change', () => {
        startButton.disabled = !termsCheckbox.checked;
    });

    startButton.addEventListener('click', () => {
        welcomeModal.style.display = 'none';
        if (conversations.length === 0) {
            startNewConversation();
        }
    });

    // Sidebar Toggle
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.querySelector('.sidebar');

    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Nova conversa
    document.getElementById('newChatButton').addEventListener('click', startNewConversation);

    // Envio de mensagem
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    messageInput.addEventListener('input', () => {
        const length = messageInput.value.length;
        document.getElementById('charCounter').textContent = `${length}/2000`;
        sendButton.disabled = length === 0;
    });

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendButton.disabled) {
                sendMessage();
            }
        }
    });

    sendButton.addEventListener('click', sendMessage);

    // Inicializa com uma conversa vazia
    if (conversations.length === 0) {
        startNewConversation();
    } else {
        currentConversationId = conversations[0].id;
        openConversation(currentConversationId);
    }

    renderConversations();
});