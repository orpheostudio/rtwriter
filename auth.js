// Authentication functions
let currentUser = null;

function initAuth() {
    // Configurar event listeners
    document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
    document.getElementById('signupBtn').addEventListener('click', () => openModal('signupModal'));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('adminBtn').addEventListener('click', () => window.location.href = 'admin.html');

    // Forms
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('signupForm').addEventListener('submit', signup);
    document.getElementById('resetPasswordForm').addEventListener('submit', resetPassword);

    // Verificar estado de autenticação
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            updateUIForLoggedInUser(user);
            loadUserProfile(user.uid);
        } else {
            currentUser = null;
            updateUIForLoggedOutUser();
        }
    });
}

async function login(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        closeModal('loginModal');
        showNotification('Login realizado com sucesso!', 'success');
    } catch (error) {
        showNotification('Erro no login: ' + error.message, 'error');
    }
}

async function signup(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const fullName = document.getElementById('signupName').value;
    const username = document.getElementById('signupUsername').value;

    try {
        // Criar usuário no Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Salvar dados adicionais no Firestore
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: email,
            fullName: fullName,
            username: username,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            isAdmin: false
        });

        closeModal('signupModal');
        showNotification('Conta criada com sucesso!', 'success');
    } catch (error) {
        showNotification('Erro ao criar conta: ' + error.message, 'error');
    }
}

async function logout() {
    try {
        await auth.signOut();
        showNotification('Logout realizado com sucesso!', 'success');
    } catch (error) {
        showNotification('Erro ao fazer logout: ' + error.message, 'error');
    }
}

async function resetPassword(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;

    try {
        await auth.sendPasswordResetEmail(email);
        closeModal('resetPasswordModal');
        showNotification('Email de redefinição enviado!', 'success');
    } catch (error) {
        showNotification('Erro ao enviar email: ' + error.message, 'error');
    }
}

async function loadUserProfile(uid) {
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            document.getElementById('userWelcome').textContent = `Olá, ${userData.username}`;
            
            // Mostrar botão de admin se for admin
            if (userData.isAdmin) {
                document.getElementById('adminBtn').style.display = 'inline-block';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
}

function updateUIForLoggedInUser(user) {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    document.getElementById('userWelcome').style.display = 'inline-block';
    document.getElementById('postForm').style.display = 'block';
}

function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('signupBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userWelcome').style.display = 'none';
    document.getElementById('adminBtn').style.display = 'none';
    document.getElementById('postForm').style.display = 'none';
}

function showNotification(message, type) {
    // Criar notificação simples
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 1001;
        font-weight: bold;
    `;
    
    notification.style.backgroundColor = type === 'success' ? 'var(--success-color)' : 'var(--danger-color)';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}
