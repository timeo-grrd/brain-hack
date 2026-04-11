// Suivi centralise de la progression eleve (articles + mini-jeux).

// ── Mini-Quiz Logic (Phase 11) ─────────────────────────────────────────
// État INDÉPENDANT par question – chaque question a son propre verrou
const quizState = { 1: false, 2: false };
let userXP = 0;

/**
 * updateHeaderXP() - Centralized XP fetch and display
 */
async function updateHeaderXP() {
    try {
        const response = await fetch('api_xp.php?action=get_xp');
        if (!response.ok) {
            if (response.status === 401) {
                console.warn('XP Sync: Session non authentifiée (401).');
            } else {
                console.warn(`XP Sync: Erreur HTTP ${response.status}`);
            }
            return;
        }
        const data = await response.json();
        
        if (data && data.total_xp !== undefined) {
            const xp = data.total_xp || 0;
            const counters = document.querySelectorAll('#header-xp-counter, #header-xp-counter-mobile');
            counters.forEach(el => { el.textContent = xp; });

            const xpDisplay = document.getElementById('total-xp-display');
            if (xpDisplay) xpDisplay.textContent = '🏆 Total XP en base : ' + xp;
        }
    } catch (err) { 
        console.warn('XP Sync: Service temporairement indisponible.'); 
    }
}

/**
 * checkAnswer(questionNumber, isCorrect, btnElement)
 * Gère UNE seule question à la fois.
 */
window.checkAnswer = async function(questionNumber, isCorrect, btnElement) {
    if (quizState[questionNumber]) return;

    const feedbackEl = document.getElementById('feedback-' + questionNumber);
    if (!feedbackEl) return;

    const questionBlock = btnElement.closest('.quiz-question');
    if (questionBlock) {
        questionBlock.querySelectorAll('button').forEach(btn => {
            btn.disabled = true;
        });
    }

    if (isCorrect) {
        btnElement.style.backgroundColor = '#4CAF50';
        btnElement.style.color = 'white';
        btnElement.style.borderColor = '#4CAF50';
        feedbackEl.textContent = '✅ Bonne réponse ! +5 XP';
        feedbackEl.className = 'quiz-feedback correct';

        // ── XP Persistant (Hackathon Upgrade) ──
        try {
            const resp = await fetch('api_xp.php?action=add_xp&amount=5');
            const data = await resp.json();
            if (data.status === 'success') {
                updateHeaderXP();
            }
        } catch (err) { console.error('Erreur Gain XP:', err); }
    } else {
        btnElement.style.backgroundColor = '#f44336';
        btnElement.style.color = 'white';
        btnElement.style.borderColor = '#f44336';
        feedbackEl.textContent = '❌ Faux ! Relis bien le texte au-dessus.';
        feedbackEl.className = 'quiz-feedback wrong';
    }

    quizState[questionNumber] = true;
};

// ── Zoom Card IA Modal Logic (Phase 11) ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
// Legacy static IA modal logic has been removed. Dynamic openModal is used instead.

    function isAdmin() {
        try {
            const user = getConnectedUser();
            return user && user.role === 'admin';
        } catch (e) { return false; }
    }

    window.deleteComment = async function(id, btn) {
        if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) return;
        try {
            const response = await fetch('api_interactions.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_comment', id: id })
            });
            const data = await response.json();
            if (data.status === 'success') {
                btn.closest('.comment-item').remove();
                updateCommentCount(-1);
            } else {
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch (err) { console.error('Erreur Delete:', err); }
    };

    // Initial load of XP
    updateHeaderXP();



});


(function () {
    const STORAGE_KEY = 'brainhack_student_progress_v1';
    // Utilise GAME_API_BASE_URL défini globalement dans config.js

    function getStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function setStorage(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function getActiveUser() {
        try {
            const currentUserRaw = localStorage.getItem('currentUser');
            if (currentUserRaw) return JSON.parse(currentUserRaw);
            const userDataRaw = localStorage.getItem('userData');
            if (userDataRaw) return JSON.parse(userDataRaw);
            const userRaw = localStorage.getItem('user');
            if (userRaw) return JSON.parse(userRaw);
        } catch (error) {
            return null;
        }
        return null;
    }

    function getAuthToken() {
        const token = localStorage.getItem('token') || localStorage.getItem('brainhack_token');
        if (!token || !token.trim()) {
            return null;
        }
        return token.trim();
    }

    function isAuthenticatedAccount(user) {
        if (!user || typeof user !== 'object') {
            return false;
        }

        const hasIdentity = Boolean(user.id || user.idCompte || user.email || user.pseudo);
        return hasIdentity && Boolean(getAuthToken());
    }

    function computeXpEarned(score, maxScore) {
        const safeScore = Math.max(0, Number(score) || 0);
        const safeMax = Math.max(0, Number(maxScore) || 0);
        if (safeMax <= 0) {
            return Math.min(100, safeScore);
        }

        const ratio = Math.min(1, safeScore / safeMax);
        return Math.max(0, Math.round(ratio * 100));
    }

    async function sendMiniGameScoreToApi(gameKey, score, maxScore, user) {
        if (!isAuthenticatedAccount(user) || !gameKey) {
            return;
        }

        const token = getAuthToken();
        if (!token) {
            return;
        }

        const payload = {
            minigameKey: String(gameKey),
            score: Math.max(0, Number(score) || 0),
            xpEarned: computeXpEarned(score, maxScore)
        };

        try {
            await fetch(`${GAME_API_BASE_URL}/game/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
        } catch (_error) {
            // Le tracking local reste la source de secours si l'API est indisponible.
        }
    }

    function getUserKey(user) {
        if (!user || typeof user !== 'object') return null;
        if (user.id !== undefined && user.id !== null) return `id:${user.id}`;
        if (user.idCompte) return `id:${user.idCompte}`;
        if (user.email) return `email:${String(user.email).toLowerCase()}`;
        if (user.pseudo) return `pseudo:${String(user.pseudo).toLowerCase()}`;
        return null;
    }

    function ensureUserProgress(user) {
        const userKey = getUserKey(user);
        if (!userKey) return null;
        const storage = getStorage();
        if (!storage[userKey]) {
            storage[userKey] = {
                articlesRead: [],
                miniGames: {},
                totalPoints: 0,
                gamesPlayed: 0,
                updatedAt: new Date().toISOString()
            };
            setStorage(storage);
        }
        return { storage, userKey, progress: storage[userKey] };
    }

    function trackArticleRead(articleId) {
        const user = getActiveUser();
        const state = ensureUserProgress(user);
        if (!state || !articleId) return;
        const cleanId = String(articleId).trim();
        if (!cleanId) return;
        if (!Array.isArray(state.progress.articlesRead)) state.progress.articlesRead = [];
        if (!state.progress.articlesRead.includes(cleanId)) {
            state.progress.articlesRead.push(cleanId);
            state.progress.updatedAt = new Date().toISOString();
            setStorage(state.storage);
        }
    }

    function trackMiniGameScore(gameKey, score, maxScore) {
        const user = getActiveUser();
        const state = ensureUserProgress(user);
        if (!state || !gameKey) return;
        const numericScore = Math.max(0, Number(score) || 0);
        const numericMax = Math.max(0, Number(maxScore) || 0);
        if (!state.progress.miniGames || typeof state.progress.miniGames !== 'object') {
            state.progress.miniGames = {};
        }
        const previous = state.progress.miniGames[gameKey] || {
            bestScore: 0, lastScore: 0, maxScore: numericMax, attempts: 0, totalPoints: 0
        };
        state.progress.miniGames[gameKey] = {
            bestScore: Math.max(previous.bestScore || 0, numericScore),
            lastScore: numericScore,
            maxScore: numericMax || previous.maxScore || 0,
            attempts: (previous.attempts || 0) + 1,
            totalPoints: (previous.totalPoints || 0) + numericScore
        };
        state.progress.gamesPlayed = (state.progress.gamesPlayed || 0) + 1;
        state.progress.totalPoints = (state.progress.totalPoints || 0) + numericScore;
        state.progress.updatedAt = new Date().toISOString();
        setStorage(state.storage);

        void sendMiniGameScoreToApi(gameKey, numericScore, numericMax, user);
    }

    function getProgressForUser(user) {
        const userKey = getUserKey(user);
        if (!userKey) return null;
        const storage = getStorage();
        return storage[userKey] || null;
    }

    window.BrainHackProgress = {
        trackArticleRead,
        trackMiniGameScore,
        getProgressForUser
    };
})();


// ─── DOM prêt ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // ── Helpers session ──────────────────────────────────────────────────────

    function getHeaderAccountPath() {
        const normalizedPath = window.location.pathname.toLowerCase();
        return normalizedPath.includes('/api_ia/') ? '/html/compte.html' : 'compte.html';
    }

    function getConnectedUser() {
        try {
            const currentUserRaw = localStorage.getItem('currentUser');
            if (currentUserRaw) {
                const parsed = JSON.parse(currentUserRaw);
                if (parsed && typeof parsed === 'object') return parsed;
            }
            const userDataRaw = localStorage.getItem('userData');
            if (userDataRaw && localStorage.getItem('isLoggedIn') === 'true') {
                const parsed = JSON.parse(userDataRaw);
                if (parsed && typeof parsed === 'object') return parsed;
            }
        } catch (error) {
            return null;
        }
        return null;
    }

    function ensureMobileAuthLinks(isConnected) {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        // Remove existing mobile auth links if any
        navLinks.querySelectorAll('.nav-link-mobile-auth').forEach(el => el.remove());

        const createMobileLink = (text, href, isPrimary = false) => {
            const link = document.createElement('a');
            link.className = 'nav-link nav-link-mobile-auth' + (isPrimary ? ' btn-mobile-primary' : ' btn-mobile-outline');
            link.href = href;
            link.textContent = text;
            return link;
        };

        const authContainer = document.createElement('div');
        authContainer.className = 'nav-link-mobile-auth mobile-auth-container';
        authContainer.style.marginTop = '2rem';
        authContainer.style.paddingTop = '1.5rem';
        authContainer.style.borderTop = '1px solid rgba(0,0,0,0.06)';
        authContainer.style.display = 'flex';
        authContainer.style.flexDirection = 'column';
        authContainer.style.gap = '12px';
        authContainer.style.width = '100%';

        if (isConnected) {
            const connectedUser = getConnectedUser();
            const isProfessor = connectedUser && (connectedUser.role || '').toLowerCase() === 'teacher';
            const accountPath = isProfessor ? '/frontend/html/dashboard_prof.html' : getHeaderAccountPath();
            
            authContainer.appendChild(createMobileLink(isProfessor ? 'Mon Dashboard' : 'Mon compte', accountPath, true));
            
            const logoutLink = createMobileLink('Déconnexion', '#');
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
                localStorage.removeItem('brainhack_token');
                window.location.href = getHeaderAccountPath().replace('compte.html', 'authentification.html?mode=login');
            });
            authContainer.appendChild(logoutLink);
        } else {
            authContainer.appendChild(createMobileLink('Se connecter', 'authentification.html?mode=login'));
            authContainer.appendChild(createMobileLink("S'inscrire", 'authentification.html?mode=register', true));
        }

        navLinks.appendChild(authContainer);
    }

    function applyHeaderSessionState() {
        const connectedUser = getConnectedUser();
        if (!connectedUser) {
            ensureMobileAuthLinks(false);
            return;
        }
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) {
            ensureMobileAuthLinks(true);
            return;
        }
        const links = navActions.querySelectorAll('a');
        const displayName = connectedUser.name || connectedUser.pseudo || 'Utilisateur';
        const isProfessor = (connectedUser.role || '').toLowerCase() === 'teacher';
        const accountPath = isProfessor ? '/frontend/html/dashboard_prof.html' : getHeaderAccountPath();
        if (links[0]) {
            links[0].href = accountPath;
            links[0].textContent = isProfessor ? 'Mon Dashboard' : 'Mon compte';
        }
        if (links[1]) {
            links[1].href = '#';
            links[1].classList.remove('btn-primary');
            links[1].classList.add('btn-outline-nav');
            const icon = links[1].querySelector('svg');
            if (icon) icon.remove();
            links[1].textContent = 'Déconnexion';
            links[1].addEventListener('click', function (event) {
                event.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
                localStorage.removeItem('brainhack_token');
                window.location.href = getHeaderAccountPath().replace('compte.html', 'authentification.html?mode=login');
            });
        }
        let sessionBadge = navActions.querySelector('.header-session-badge');
        if (!sessionBadge) {
            sessionBadge = document.createElement('span');
            sessionBadge.className = 'header-session-badge';
            navActions.appendChild(sessionBadge);
        }
        sessionBadge.textContent = `Connecté: ${displayName}`;

        ensureMobileAuthLinks(true);
    }

    applyHeaderSessionState();


    // ── Renderer de sections ─────────────────────────────────────────────────

    function renderSection(section) {
        const highlight = section.highlight
            ? `<p class="ia-highlight">${section.highlight}</p>`
            : '';

        switch (section.type) {
            case 'text':
                return `
                    <section class="ia-section">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                        ${highlight}
                    </section>`;

            case 'note_grid':
                return `
                    <section class="ia-section">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                        <div class="ia-note-grid">
                            ${section.notes.map(n => `
                                <article class="ia-note ia-note-${n.variant}">
                                    <h4>${n.title}</h4>
                                    <p>${n.content}</p>
                                </article>
                            `).join('')}
                        </div>
                        ${highlight}
                    </section>`;

            case 'table':
                return `
                    <section class="ia-section">
                        <h3>${section.title}</h3>
                        <div class="ia-table-wrap">
                            <table class="ia-table">
                                <thead>
                                    <tr>${section.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                                </thead>
                                <tbody>
                                    ${section.rows.map(row => `
                                        <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </section>`;

            case 'list':
                return `
                    <section class="ia-section">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                        <ul class="ia-list">
                            ${section.items.map(item => `
                                <li>${item.bold ? `<strong>${item.bold} :</strong>` : ''} ${item.text}</li>
                            `).join('')}
                        </ul>
                        ${highlight}
                    </section>`;

            case 'summary':
                return `
                    <section class="ia-section ia-summary">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                    </section>`;

            case 'quiz':
                return `
                    <section class="ia-section ia-quiz" style="margin-top: 30px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 20px;">
                        <h3>${section.title}</h3>
                        ${section.questions.map(q => `
                            <div class="quiz-question" data-question="${q.id}" style="margin-top: 20px;">
                                <p class="quiz-question-label"><strong>${q.label}</strong></p>
                                <div class="quiz-options">
                                    ${q.options.map(opt => `
                                        <button class="quiz-btn" onclick="event.stopPropagation(); window.checkAnswer('${q.id}', ${opt.isCorrect}, this)">${opt.label}</button>
                                    `).join('')}
                                </div>
                                <p class="quiz-feedback" id="feedback-${q.id}" style="font-weight: bold; margin-top: 10px;"></p>
                            </div>
                        `).join('')}
                    </section>`;

            default:
                return '';
        }
    }


    // ── Modale dynamique ─────────────────────────────────────────────────────

    window.openModal = openModal;
    async function openModal(articleId) {
        document.querySelector('.ia-modal-overlay')?.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <p class="ia-loading">Chargement...</p>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';

        let onEscape;
        const closeModal = () => {
            modalOverlay.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onEscape);
        };
        onEscape = e => e.key === 'Escape' && closeModal();
        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', e => e.target === modalOverlay && closeModal());
        document.addEventListener('keydown', onEscape);

        try {
            const res = await fetch(`${GAME_API_BASE_URL}/article/${articleId}`);
            if (!res.ok) throw new Error('Article introuvable');
            const article = await res.json();

            const sections = typeof article.sections === 'string'
                ? JSON.parse(article.sections)
                : article.sections;

            const intro = typeof article.intro === 'string'
                ? JSON.parse(article.intro)
                : article.intro;

        modalOverlay.querySelector('.ia-modal').innerHTML = `
            <button class="ia-modal-close" aria-label="Fermer">×</button>
            <div class="ia-modal-header">
                <h2>${article.title}</h2>
                ${intro.map(p => `<p>${p}</p>`).join('')}
            </div>
            <div class="ia-modal-body">
                ${sections.map(renderSection).join('')}
            </div>
            <div class="ia-modal-footer">

                <!-- Likes -->
                <div class="ia-likes">
                    <button class="ia-like-btn" id="likeBtn">
                        <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                        </svg>
                        <span id="likeCount">0</span>
                    </button>
                </div>

                <!-- Commentaires -->
                <div class="ia-comments">
                    <h4 class="ia-comments-title">Commentaires</h4>
                    <div class="ia-comments-list" id="commentsList">
                        <p class="ia-comments-empty">Chargement...</p>
                    </div>
                    <div class="ia-comment-form">
                        <input
                            type="text"
                            id="commentInput"
                            class="ia-comment-input"
                            placeholder="Ajoute un commentaire..."
                            maxlength="500"
                        />
                        <button class="ia-comment-submit" id="commentSubmit">Envoyer</button>
                    </div>
                </div>
            </div>
            `;
            modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);
            await initModalInteractions(articleId);
            

        } catch (err) {
            console.error('Erreur openModal:', err);
    modalOverlay.querySelector('.ia-modal-header').innerHTML = `
        <p style="color:red">Impossible de charger l'article. Réessaie plus tard.</p>
    `;
        }
    }


    // ── Badges lu / non lu ───────────────────────────────────────────────────

    const TRACKED_ARTICLE_IDS = [
        'ia-featured-card', 'phone-intelligence-card', 'chatgpt-lies-card',
        'manipulation-online-card', 'deepfake-detect-card', 'ai-cheats-games-card',
        'streamer-fake-video-card', 'homework-ai-card', 'future-job-card',
        'ai-replace-humanity-card'
    ];

    function getReadArticleIds() {
        const connectedUser = getConnectedUser();
        if (!connectedUser || !window.BrainHackProgress) return new Set();
        const progress = window.BrainHackProgress.getProgressForUser(connectedUser);
        const readArticles = Array.isArray(progress?.articlesRead) ? progress.articlesRead : [];
        return new Set(readArticles.map(item => String(item || '').trim()));
    }

    function applyCardReadBadge(card, isRead) {
        if (!card) return;
        const contentContainer = card.querySelector('.article-content, .featured-content');
        if (!contentContainer) return;
        let badge = card.querySelector('.article-read-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'article-read-badge';
            contentContainer.prepend(badge);
        }
        badge.textContent = isRead ? 'Lu' : 'Non lu';
        badge.classList.toggle('is-read', isRead);
        badge.classList.toggle('is-unread', !isRead);
        card.classList.toggle('article-state-read', isRead);
        card.classList.toggle('article-state-unread', !isRead);
    }

    function updateArticleReadBadges() {
        const readSet = getReadArticleIds();
        TRACKED_ARTICLE_IDS.forEach(articleId => {
            const card = document.getElementById(articleId);
            if (card) applyCardReadBadge(card, readSet.has(articleId));
        });
    }


    function trackCardRead(card) {
        if (!card || !window.BrainHackProgress) return;
        const articleId = card.id || card.querySelector('h2, h3')?.textContent
            .toLowerCase().replace(/\s+/g, '-').slice(0, 60) || 'article';
        window.BrainHackProgress.trackArticleRead(articleId);
        applyCardReadBadge(card, true);
    }

    updateArticleReadBadges();

    async function loadAllLikeCounts() {
    const token = localStorage.getItem('brainhack_token');

    for (const articleId of TRACKED_ARTICLE_IDS) {
        try {
            const card = document.getElementById(articleId);
            if (!card) continue;

            const stats = card.querySelectorAll('.stat');

            // Likes (nécessite token)
            if (token) {
                const likeRes = await fetch(`${GAME_API_BASE_URL}/like/${articleId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (likeRes.ok) {
                    const likeData = await likeRes.json();
                    if (stats[0]) {
                        const span = stats[0].querySelector('span');
                        if (span) span.textContent = likeData.count;
                    }
                }
            }

            // Commentaires (public)
            const commentRes = await fetch(`${GAME_API_BASE_URL}/comment/${articleId}/count`);
            if (commentRes.ok) {
                const commentData = await commentRes.json();
                if (stats[1]) {
                    const span = stats[1].querySelector('span');
                    if (span) span.textContent = commentData.count;
                }
            }

        } catch (e) {
            // silencieux
        }
    }
}

loadAllLikeCounts();

    // ── Écouteurs cartes ──────────────────────────────────

    function attachCardEvents(card) {
        if (!card) return;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        card.addEventListener('click', () => {
            trackCardRead(card);
            // Skip modal for the special IA card since it has a native accordion
            if (card.id === 'ia-featured-card') return;
            openModal(card.id);
        });

        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trackCardRead(card);
                openModal(card.id);
            }
        });

        // Tilt 3D
        card.addEventListener('mousemove', function (e) {
            if (this.classList.contains('is-expanded')) return;
            const rect = this.getBoundingClientRect();
            const rotateX = (e.clientY - rect.top - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 20;
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    }

    document.querySelectorAll('.article-card, .featured-card').forEach(card => {
        attachCardEvents(card);
    });


    // ── Menu mobile ──────────────────────────────────────────────────────────

    // ── NOUVEAU MENU BURGER RADICAL ───────────────────────────────────────────

    // ── NEW ROBUST MOBILE MENU ───────────────────────────────────────────
    function initMobileMenu() {
        const burgerIcon = document.querySelector('.burger-icon');
        const navLinks = document.querySelector('.nav-links');
        const overlay = document.querySelector('.mobile-nav-overlay');

        if (!burgerIcon || !navLinks || !overlay) {
            console.warn("Mobile menu elements missing:", { burgerIcon, navLinks, overlay });
            return;
        }

        const toggleMenu = () => {
            const isOpen = navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            burgerIcon.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        const closeMenu = () => {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            burgerIcon.classList.remove('open');
            document.body.style.overflow = '';
        };

        burgerIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', closeMenu);

        // Links: Close menu and allow redirection (NO preventDefault)
        const navItems = navLinks.querySelectorAll('.nav-link, .dropdown-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Si c'est un lien de navigation (pas un toggle de dropdown), on ferme
                if (!item.classList.contains('dropdown-toggle')) {
                    closeMenu();
                }
            });
        });

        // Dropdown toggle mobile (accordion style)
        const toggles = document.querySelectorAll('.dropdown-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    const parent = this.closest('.nav-dropdown');
                    if (parent) {
                        parent.classList.toggle('active');
                    }
                }
            });
        });
    }

    initMobileMenu();


    // ── Animations scroll ────────────────────────────────────────────────────

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.article-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });


    // ── Likes (simulation) ───────────────────────────────────────────────────

    // document.querySelectorAll('.stat').forEach(stat => {
    //     stat.style.cursor = 'pointer';
    //     stat.addEventListener('click', function (e) {
    //         e.stopPropagation();
    //         const svg = this.querySelector('svg');
    //         const text = this.childNodes[2];
    //         const count = parseInt(text.textContent);
    //         if (this.classList.contains('liked')) {
    //             this.classList.remove('liked');
    //             svg.style.fill = 'currentColor';
    //             svg.style.color = 'rgba(255,255,255,0.7)';
    //             text.textContent = ' ' + (count - 1);
    //         } else {
    //             this.classList.add('liked');
    //             svg.style.fill = '#ec4899';
    //             svg.style.color = '#ec4899';
    //             text.textContent = ' ' + (count + 1);
    //         }
    //     });
    // });

    async function initModalInteractions(articleId) {
        const token = localStorage.getItem('brainhack_token');
        console.log('token:', token);
        console.log('commentSubmit trouvé:', document.getElementById('commentSubmit'));
        console.log('form trouvée:', document.querySelector('.ia-comment-form'));
        console.log('likeBtn trouvé:', document.getElementById('likeBtn'));
    if (!token) {
        // Non connecté : on masque le formulaire
        const form = document.querySelector('.ia-comment-form');
        const likeBtn = document.getElementById('likeBtn');
        if (form) form.innerHTML = '<p class="ia-comments-empty">Connecte-toi pour liker et commenter.</p>';
        if (likeBtn) likeBtn.disabled = true;
        await loadComments(articleId, token);
        return;
    }

    await loadLikeStatus(articleId, token);
    await loadComments(articleId, token);

    // Bouton like
    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
        likeBtn.addEventListener('click', async () => {
            const res = await fetch(`${GAME_API_BASE_URL}/like/${articleId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                updateLikeUI(data);
            }
        });
    }

    // Bouton commentaire
    const commentSubmit = document.getElementById('commentSubmit');
    if (commentSubmit) {
        commentSubmit.addEventListener('click', async () => {
            const input = document.getElementById('commentInput');
            const content = input?.value.trim();
            if (!content) return;

            const res = await fetch(`${GAME_API_BASE_URL}/comment/${articleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (res.ok) {
                const comment = await res.json();
                input.value = '';
                appendComment(comment);
            }
        });
    }
}

async function loadLikeStatus(articleId, token) {
    const res = await fetch(`${GAME_API_BASE_URL}/like/${articleId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
        const data = await res.json();
        updateLikeUI(data);
    }
}

function updateLikeUI(data) {
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');
    if (likeCount) likeCount.textContent = data.count;
    if (likeBtn) likeBtn.classList.toggle('liked', data.userHasLiked);
}

async function loadComments(articleId, token) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const res = await fetch(`${GAME_API_BASE_URL}/comment/${articleId}`, { headers });
    const list = document.getElementById('commentsList');
    if (!list) return;

    if (res.ok) {
        const comments = await res.json();
        if (!comments.length) {
            list.innerHTML = '<p class="ia-comments-empty">Aucun commentaire pour le moment.</p>';
            return;
        }
        list.innerHTML = comments.map(c => commentHTML(c)).join('');
    }
}

function appendComment(comment) {
    const list = document.getElementById('commentsList');
    if (!list) return;
    const empty = list.querySelector('.ia-comments-empty');
    if (empty) empty.remove();
    list.insertAdjacentHTML('beforeend', commentHTML(comment));
}

function commentHTML(comment) {
    const date = new Date(comment.createdAt).toLocaleDateString('fr-FR');
    return `
        <div class="ia-comment">
            <div class="ia-comment-header">
                <strong>${comment.userPseudo}</strong>
                <span class="ia-comment-date">${date}</span>
            </div>
            <p class="ia-comment-content">${comment.content}</p>
        </div>
    `;
}


    // (Tilt géré dans attachCardEvents)


    // ── Lazy loading images ──────────────────────────────────────────────────

    const imageObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                obs.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));


    // ── Navbar scroll ────────────────────────────────────────────────────────

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.style.background = 'rgba(255,255,255,0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255,255,255,0.1)';
            navbar.style.boxShadow = 'none';
        }
    });


    // ── Smooth scroll ────────────────────────────────────────────────────────

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ── Filtrage Dynamique & Rendu HTML des Articles ─────────────────────────

    const classFilter = document.getElementById('articleClassFilter');
    const articlesGrid = document.getElementById('mainArticlesGrid');

    if (classFilter && articlesGrid) {
        const fallbackImages = {
            'phone-intelligence-card': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
            'chatgpt-lies-card': 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&h=300&fit=crop',
            'manipulation-online-card': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
            'deepfake-detect-card': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
            'ai-cheats-games-card': 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=300&fit=crop',
            'streamer-fake-video-card': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
            'homework-ai-card': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
            'future-job-card': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
            'ai-replace-humanity-card': 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=400&h=300&fit=crop'
        };

        const renderArticles = async (classId) => {
            try {
                // Fetch de notre nouvelle API
                const url = `${GAME_API_BASE_URL}/get_articles.php` + (classId ? `?id_classe=${classId}` : '');
                const res = await fetch(url);
                if (!res.ok) throw new Error("Erreur réseau");
                const articles = await res.json();
                
                // Vider la grille HTML complète
                articlesGrid.innerHTML = '';
                
                if (articles.length === 0) {
                    articlesGrid.innerHTML = '<p style="color:white; text-align:center; width:100%;">Aucun article pour cette sélection.</p>';
                    return;
                }

                // Génération des cartes
                articles.forEach((article, index) => {
                    // On exclut la grosse carte vedette pour ne pas la dupliquer en dur
                    if (article.slug === 'cest-quoi-lia') return;

                    let baseSlug = article.slug;
                    if (baseSlug.match(/-(65|43|sp|ter)$/)) {
                        baseSlug = baseSlug.substring(0, baseSlug.lastIndexOf('-'));
                    }

                    const dynamicImages = {
                        'ia-featured-card': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', // Téléphone
                        'ia-hallucinations': 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&h=300&fit=crop', // Illusion/Menteur
                        'ia-manipulation': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',  // Bulle filtres/TikTok
                        'ia-detective': 'https://images.unsplash.com/photo-1658428805213-9aa765c9c9b6?w=400&h=300&fit=crop', // Loupe/Détective IA
                        'ia-gaming': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop', // Gaming/Manette
                        'ia-usurpation': 'https://images.unsplash.com/photo-1563207153-f4081c7ba19f?w=400&h=300&fit=crop', // Hacker/Usurpateur
                        'ia-school': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop' // École/Devoirs/Carnet
                    };

                    const imgSrc = dynamicImages[baseSlug] || fallbackImages[article.slug] || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop';
                    
                    const levelSuffix = article.nom_groupe ? `<br><small style="font-weight: 500; color: var(--primary);">Niveau ${article.nom_groupe}</small>` : '';
                    
                    const el = document.createElement('article');
                    el.className = 'article-card';
                    el.id = article.slug;
                    el.innerHTML = `
                        <div class="article-image">
                          <img src="${imgSrc}" alt="${article.title}" class="loaded" />
                        </div>
                        <div class="article-content">
                          <h3 class="article-title" style="margin-bottom: 0.5rem;">${article.title} ${levelSuffix}</h3>
                          <div class="article-stats">
                            <span class="stat">
                              <svg class="icon-stat"><use href="#icon-heart"></use></svg>
                              <span>0</span>
                            </span>
                            <span class="stat">
                              <svg class="icon-stat"><use href="#icon-bubble"></use></svg>
                              <span>0</span>
                            </span>
                          </div>
                        </div>
                    `;
                    
                    // Animations d'entrée dynamiques
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                    
                    articlesGrid.appendChild(el);
                    
                    // Réattacher les événements interactifs (Click, Hover, Tags)
                    attachCardEvents(el);
                    observer.observe(el);
                });

                // Re-calculer les likes/commentaires et l'état lu pour ces nouvelles cartes
                updateArticleReadBadges();
                loadAllLikeCounts();

            } catch (err) {
                console.error("Impossible de charger les articles filtrés : ", err);
            }
        };

        // Initialisation globale
        const initHomeFilter = async () => {
            try {
                // Remplir le select de classes
                const res = await fetch(`${API_URL}/auth/get_classes`);
                const classesObj = await res.json();
                if (Array.isArray(classesObj)) {
                    classesObj.forEach(c => {
                        const opt = document.createElement('option');
                        opt.value = c.id;
                        opt.textContent = c.nom_groupe;
                        opt.style.color = "black";
                        classFilter.appendChild(opt);
                    });
                }
                
                // Pré-sélectionner la classe de l'user connecté
                const user = getConnectedUser();
                let initialClassId = '';
                if (user && user.id_classe) {
                    initialClassId = user.id_classe;
                    classFilter.value = initialClassId;
                }

                // Charger immédiatement selon la pré-sélection
                await renderArticles(initialClassId);

                // Event Listener HTML sur le dropdown
                classFilter.addEventListener('change', (e) => {
                    renderArticles(e.target.value);
                });

            } catch(e) {}
        };
        initHomeFilter();
    }

    // ── Gestionnaire du Thème Daltonien ──────────────────────────────────────
    const themeSelectors = document.querySelectorAll('.theme-selector');
    themeSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const newTheme = this.value;
            
            // Retirer les ancies thèmes
            document.documentElement.classList.remove('theme-normal', 'theme-protanopia', 'theme-deuteranopia', 'theme-tritanopia');
            document.body.classList.remove('theme-normal', 'theme-protanopia', 'theme-deuteranopia', 'theme-tritanopia');
            
            // Ajouter le nouveau thème
            if (newTheme !== 'normal') {
                document.documentElement.classList.add('theme-' + newTheme);
                document.body.classList.add('theme-' + newTheme);
            }
            
            localStorage.setItem('activeTheme', newTheme);
            
            // Sync all other selectors
            themeSelectors.forEach(sel => {
                if(sel !== this) sel.value = newTheme;
            });
        });
    });

    console.log('🧠 BrainHack chargé avec succès !');
});





