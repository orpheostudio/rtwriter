// Posts functions
function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    
    db.collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .onSnapshot((snapshot) => {
            postsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                postsContainer.innerHTML = '<div class="loading">Nenhum post encontrado. Seja o primeiro a postar!</div>';
                return;
            }
            
            snapshot.forEach(async (doc) => {
                const post = { id: doc.id, ...doc.data() };
                const postElement = await createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        }, (error) => {
            console.error('Erro ao carregar posts:', error);
            postsContainer.innerHTML = '<div class="loading">Erro ao carregar posts.</div>';
        });
}

async function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.setAttribute('data-post-id', post.id);
    
    // Buscar dados do usuário
    let userData = { fullName: 'Usuário', username: 'usuario' };
    try {
        const userDoc = await db.collection('users').doc(post.userId).get();
        if (userDoc.exists) {
            userData = userDoc.data();
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
    }
    
    // Buscar contadores
    const likesCount = await getLikesCount(post.id);
    const commentsCount = await getCommentsCount(post.id);
    const sharesCount = await getSharesCount(post.id);
    
    const userHasLiked = currentUser ? await hasUserLiked(post.id, currentUser.uid) : false;
    
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="avatar">${userData.username.charAt(0).toUpperCase()}</div>
            <div class="post-info">
                <h3>${userData.fullName}</h3>
                <span>@${userData.username} · ${formatDate(post.createdAt)}</span>
            </div>
        </div>
        <div class="post-content">
            <p>${escapeHtml(post.content)}</p>
        </div>
        <div class="post-stats">
            <div class="post-actions-buttons">
                <div class="action-btn commented" onclick="toggleComments('${post.id}')">
                    <i class="far fa-comment"></i>
                    <span>${commentsCount}</span>
                </div>
                <div class="action-btn shared" onclick="sharePost('${post.id}')">
                    <i class="fas fa-retweet"></i>
                    <span>${sharesCount}</span>
                </div>
                <div class="action-btn ${userHasLiked ? 'liked' : ''}" onclick="likePost('${post.id}')">
                    <i class="${userHasLiked ? 'fas' : 'far'} fa-heart"></i>
                    <span>${likesCount}</span>
                </div>
            </div>
        </div>
        
        <div class="comments-section" id="comments-${post.id}" style="display: none;">
            ${currentUser ? `
            <form class="comment-form" onsubmit="addComment(event, '${post.id}')">
                <input type="text" name="comment" placeholder="Escreva um comentário..." required>
                <button type="submit" class="btn btn-primary">Comentar</button>
            </form>
            ` : ''}
            <div class="comments-list" id="comments-list-${post.id}">
                <!-- Comentários serão carregados aqui -->
            </div>
        </div>
    `;
    
    return postDiv;
}

// Event listener para criar posts
document.getElementById('createPostForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Você precisa estar logado para postar.', 'error');
        return;
    }
    
    const content = e.target.content.value.trim();
    
    if (!content) {
        showNotification('O post não pode estar vazio.', 'error');
        return;
    }
    
    try {
        await db.collection('posts').add({
            userId: currentUser.uid,
            content: content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        e.target.reset();
        showNotification('Post publicado com sucesso!', 'success');
    } catch (error) {
        showNotification('Erro ao publicar post: ' + error.message, 'error');
    }
});

// Funções de interação
async function likePost(postId) {
    if (!currentUser) {
        openModal('loginModal');
        return;
    }
    
    try {
        const likeRef = db.collection('likes').doc(`${postId}_${currentUser.uid}`);
        const likeDoc = await likeRef.get();
        
        if (likeDoc.exists) {
            await likeRef.delete();
        } else {
            await likeRef.set({
                postId: postId,
                userId: currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    } catch (error) {
        showNotification('Erro ao curtir post: ' + error.message, 'error');
    }
}

async function sharePost(postId) {
    if (!currentUser) {
        openModal('loginModal');
        return;
    }
    
    if (confirm('Deseja compartilhar este post?')) {
        try {
            await db.collection('shares').add({
                postId: postId,
                userId: currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showNotification('Post compartilhado com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro ao compartilhar post: ' + error.message, 'error');
        }
    }
}

async function addComment(e, postId) {
    e.preventDefault();
    
    if (!currentUser) {
        openModal('loginModal');
        return;
    }
    
    const content = e.target.comment.value.trim();
    
    if (!content) {
        showNotification('O comentário não pode estar vazio.', 'error');
        return;
    }
    
    try {
        await db.collection('comments').add({
            postId: postId,
            userId: currentUser.uid,
            content: content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        e.target.reset();
    } catch (error) {
        showNotification('Erro ao adicionar comentário: ' + error.message, 'error');
    }
}

async function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    const commentsList = document.getElementById(`comments-list-${postId}`);
    
    if (commentsSection.style.display === 'none') {
        // Carregar comentários
        try {
            const commentsSnapshot = await db.collection('comments')
                .where('postId', '==', postId)
                .orderBy('createdAt', 'asc')
                .get();
            
            commentsList.innerHTML = '';
            
            if (commentsSnapshot.empty) {
                commentsList.innerHTML = '<div class="loading">Nenhum comentário ainda.</div>';
            } else {
                for (const doc of commentsSnapshot.docs) {
                    const comment = doc.data();
                    const userDoc = await db.collection('users').doc(comment.userId).get();
                    const userData = userDoc.exists ? userDoc.data() : { username: 'usuário' };
                    
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment';
                    commentDiv.innerHTML = `
                        <div class="comment-header">
                            <div class="comment-avatar">${userData.username.charAt(0).toUpperCase()}</div>
                            <strong>${userData.username}</strong>
                        </div>
                        <p>${escapeHtml(comment.content)}</p>
                        <small>${formatDate(comment.createdAt)}</small>
                    `;
                    commentsList.appendChild(commentDiv);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
            commentsList.innerHTML = '<div class="loading">Erro ao carregar comentários.</div>';
        }
        
        commentsSection.style.display = 'block';
    } else {
        commentsSection.style.display = 'none';
    }
}

// Funções auxiliares
async function getLikesCount(postId) {
    const snapshot = await db.collection('likes').where('postId', '==', postId).get();
    return snapshot.size;
}

async function getCommentsCount(postId) {
    const snapshot = await db.collection('comments').where('postId', '==', postId).get();
    return snapshot.size;
}

async function getSharesCount(postId) {
    const snapshot = await db.collection('shares').where('postId', '==', postId).get();
    return snapshot.size;
}

async function hasUserLiked(postId, userId) {
    const doc = await db.collection('likes').doc(`${postId}_${userId}`).get();
    return doc.exists;
}

function formatDate(timestamp) {
    if (!timestamp) return 'Agora';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return date.toLocaleDateString('pt-BR');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
