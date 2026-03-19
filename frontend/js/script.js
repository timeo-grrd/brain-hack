// Suivi centralise de la progression eleve (articles + mini-jeux).
(function () {
    const STORAGE_KEY = 'brainhack_student_progress_v1';

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
        } catch (error) {
            return null;
        }
        return null;
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

    function ensureMobileAccountEntry(isConnected) {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        let mobileAccountLink = navLinks.querySelector('[data-mobile-account-link="true"]');
        if (!mobileAccountLink) {
            mobileAccountLink = document.createElement('a');
            mobileAccountLink.className = 'nav-link nav-link-mobile-account';
            mobileAccountLink.dataset.mobileAccountLink = 'true';
            navLinks.appendChild(mobileAccountLink);
        }

        if (isConnected) {
            mobileAccountLink.href = getHeaderAccountPath();
            mobileAccountLink.textContent = 'Mon compte';
            return;
        }

        mobileAccountLink.href = 'authentification.html?mode=login';
        mobileAccountLink.textContent = 'Se connecter';
    }

    function applyHeaderSessionState() {
        const connectedUser = getConnectedUser();
        if (!connectedUser) {
            ensureMobileAccountEntry(false);
            return;
        }
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) {
            ensureMobileAccountEntry(true);
            return;
        }
        const links = navActions.querySelectorAll('a');
        const displayName = connectedUser.name || connectedUser.pseudo || 'Utilisateur';
        const accountPath = getHeaderAccountPath();
        if (links[0]) {
            links[0].href = accountPath;
            links[0].textContent = 'Mon compte';
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

        ensureMobileAccountEntry(true);
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

            default:
                return '';
        }
    }


    // ── Modale dynamique ─────────────────────────────────────────────────────

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
            const res = await fetch(`http://localhost:5282/api/article/${articleId}`);
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
            `;
            modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        } catch (err) {
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


    // ── Écouteurs cartes (UNE seule boucle) ──────────────────────────────────

    document.querySelectorAll('.article-card, .featured-card').forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        card.addEventListener('click', () => {
            trackCardRead(card);
            openModal(card.id);
        });

        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trackCardRead(card);
                openModal(card.id);
            }
        });
    });


    // ── Menu mobile ──────────────────────────────────────────────────────────

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });


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

    document.querySelectorAll('.stat').forEach(stat => {
        stat.style.cursor = 'pointer';
        stat.addEventListener('click', function (e) {
            e.stopPropagation();
            const svg = this.querySelector('svg');
            const text = this.childNodes[2];
            const count = parseInt(text.textContent);
            if (this.classList.contains('liked')) {
                this.classList.remove('liked');
                svg.style.fill = 'currentColor';
                svg.style.color = 'rgba(255,255,255,0.7)';
                text.textContent = ' ' + (count - 1);
            } else {
                this.classList.add('liked');
                svg.style.fill = '#ec4899';
                svg.style.color = '#ec4899';
                text.textContent = ' ' + (count + 1);
            }
        });
    });


    // ── Tilt 3D hover ────────────────────────────────────────────────────────

    document.querySelectorAll('.article-card, .featured-card').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const rotateX = (e.clientY - rect.top - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 20;
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });


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

    console.log('🧠 BrainHack chargé avec succès !');
});