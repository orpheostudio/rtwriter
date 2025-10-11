// Admin functions
let adminStats = {
    users: 0,
    posts: 0,
    comments: 0,
    likes: 0
};

function initAdmin() {
    // Verificar se usuário é admin
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            
            if (userData && userData.isAdmin) {
                loadAdminData();
            } else {
                window.location.href = 'index.html';
            }
        } else {
            window.location.href = 'index.html';
        }
    });
}

async function loadAdminData() {
    loadStats();
    loadPostsForAdmin();
    loadUsers();
}

async function loadStats() {
    try {
        // Contar usuários
        const usersSnapshot = await db.collection('users').get();
        adminStats.users = usersSnapshot.size;
        
        // Contar posts
        const postsSnapshot = await db.collection('posts').get();
        adminStats.posts = postsSnapshot.size;
        
        // Contar comentários
        const commentsSnapshot = await db.collection('comments').get();
        adminStats.comments = commentsSnapshot.size;
        
        // Contar likes
        const likesSnapshot = await db.collection('likes').get();
        adminStats.likes = likesSnapshot.size;
        
        updateStatsUI();
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

function updateStatsUI() {
    const statsContainer = document.getElementById('statsContainer');
    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3>Usuários</h3>
            <p>${adminStats.users}</p>
        </div>
        <div class="stat-card">
            <h3>Posts</h3>
            <p>${adminStats.posts}</p>
        </div>
        <div class="stat-card">
            <h3>Comentários</h3>
            <p>${adminStats.comments}</p>
        </div>
        <div class="stat-card">
            <h3>Curtidas</h3>
            <p>${adminStats.likes}</p>
        </div>
    `;
}

async function loadPostsForAdmin() {
    const container = document.getElementById('adminPostsContainer');
    
    try {
        const snapshot = await db.collection('posts')
            .orderBy('createdAt', 'desc')
            .get();
        
        container.innerHTML = '';
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="loading">Nenhum post encontrado.</div>';
            return;
        }
        
        for (const doc of snapshot.docs) {
            const post = { id: doc.id, ...doc.data() };
            const userDoc = await db.collection('users').doc(post.userId).get();
            const userData = userDoc.exists ? userDoc.data() : { username: 'usuário' };
            
            const postElement = document.createElement('div');
            postElement.className = 'post-item';
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="avatar">${userData.username.charAt(0).toUpperCase()}</div>
                    <div class="post-info">
                        <h3>${userData.username}</h3>
                        <span>${formatDate(post.createdAt)}</span>
                    </div>
                </div>
                <p>${escapeHtml(post.content)}</p>
                <div class="admin-actions">
                    <button class="btn btn-outline" onclick="deletePost('${post.id}')">Excluir Post</button>
                </div>
            `;
            container.appendChild(postElement);
        }
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        container.innerHTML = '<div class="loading">Erro ao carregar posts.</div>';
    }
}

async function loadUsers() {
    const container = document.getElementById('usersContainer');
    
    try {
        const snapshot = await db.collection('users').get();
        container.innerHTML = '';
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="loading">Nenhum usuário encontrado.</div>';
            return;
        }
        
        snapshot.forEach((doc) => {
            const user = { id: doc.id, ...doc.data() };
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.innerHTML = `
                <div class="user-info">
                    <strong>${user.username}</strong>
                    <span>${user.email}</span>
                    <small>Admin: ${user.isAdmin ? 'Sim' : 'Não'}</small>
                </div>
                <div class="admin-actions">
                    <button class="btn btn-outline" onclick="toggleAdmin('${user.id}', ${!user.isAdmin})">
                        ${user.isAdmin ? 'Remover Admin' : 'Tornar Admin'}
                    </button>
                </div>
            `;
            container.appendChild(userElement);
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        container.innerHTML = '<div class="loading">Erro ao carregar usuários.</div>';
    }
}

async function deletePost(postId) {
    if (confirm('Tem certeza que deseja excluir este post?')) {
        try {
            // Excluir post e todas as interações relacionadas
            const batch = db.batch();
            
            // Excluir post
            batch.delete(db.collection('posts').doc(postId));
            
            // Excluir likes
            const likesSnapshot = await db.collection('likes').where('postId', '==', postId).get();
            likesSnapshot.forEach(doc => batch.delete(doc.ref));
            
            // Excluir comentários
            const commentsSnapshot = await db.collection('comments').where('postId', '==', postId).get();
            commentsSnapshot.forEach(doc => batch.delete(doc.ref));
            
            // Excluir shares
            const sharesSnapshot = await db.collection('shares').where('postId', '==', postId).get();
            sharesSnapshot.forEach(doc => batch.delete(doc.ref));
            
            await batch.commit();
            showNotification('Post excluído com sucesso!', 'success');
            loadPostsForAdmin();
            loadStats();
        } catch (error) {
            showNotification('Erro ao excluir post: ' + error.message, 'error');
        }
    }
}

async function toggleAdmin(userId, makeAdmin) {
    try {
        await db.collection('users').doc(userId).update({
            isAdmin: makeAdmin
        });
        
        showNotification(`Usuário ${makeAdmin ? 'tornado admin' : 'removido como admin'} com sucesso!`, 'success');
        loadUsers();
    } catch (error) {
        showNotification('Erro ao atualizar usuário: ' + error.message, 'error');
    }
}

// Inicializar admin quando a página carregar
document.addEventListener('DOMContentLoaded', initAdmin);
