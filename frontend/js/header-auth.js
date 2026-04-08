/**
 * header-auth.js
 * Gestion dynamique du header en fonction de la session utilisateur.
 * Si connecté : remplace les boutons Connexion/Inscription par une icône avatar.
 */
(function () {
    const BASE_ASSETS = '../assets/';
    const COMPTE_URL = 'compte.html';
    const DASHBOARD_URL = 'dashboard_prof.html';
    const LOGIN_URL = 'authentification.html?mode=login';

    function getUser() {
        try {
            const raw = localStorage.getItem('currentUser') || localStorage.getItem('userData');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    function getToken() {
        return localStorage.getItem('brainhack_token') || localStorage.getItem('token') || null;
    }

    function getAvatarSrc(user) {
        if (!user || !user.avatarUrl) return BASE_ASSETS + 'logo.png';
        
        // Si le chemin contient déjà le répertoire assets ou hackathon, on le nettoie
        let path = user.avatarUrl;
        if (path.includes('assets/')) {
            const parts = path.split('assets/');
            path = BASE_ASSETS + parts[parts.length - 1];
        } else {
            // Sinon on considère que c'est juste le nom du fichier
            const filename = path.split('/').pop();
            path = BASE_ASSETS + filename;
        }
        
        // S'assurer qu'il ne commence pas par un / racine si on veut du relatif
        return path.startsWith('/') && !path.startsWith('/hackathon') ? path.substring(1) : path;
    }

    function updateHeader() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        const user = getUser();
        const token = getToken();

        if (!user || !token) {
            // Non connecté : affichage par défaut déjà en HTML
            return;
        }

        const isTeacher = (user.role || '').toLowerCase() === 'teacher' ||
                          (user.role || '').toLowerCase() === 'professeur';
        const targetUrl = isTeacher ? DASHBOARD_URL : COMPTE_URL;
        const pseudoLabel = user.pseudo || user.name || 'Mon compte';

        navActions.innerHTML = `
            <a href="${targetUrl}" class="nav-avatar-link" title="${pseudoLabel}" aria-label="Mon compte">
                <img
                    src="${getAvatarSrc(user)}"
                    alt="${pseudoLabel}"
                    class="nav-avatar-img"
                    onerror="this.src='${BASE_ASSETS}logo.png'"
                />
            </a>
            <a href="${LOGIN_URL}" class="btn btn-secondary nav-logout-btn" id="headerLogoutBtn" style="font-size:0.85rem; padding: 6px 14px;">
                Déconnexion
            </a>
        `;

        // Déconnexion rapide via le bouton header
        document.getElementById('headerLogoutBtn')?.addEventListener('click', function (e) {
            e.preventDefault();
            ['brainhack_token', 'token', 'isLoggedIn', 'currentUser', 'userData'].forEach(k => localStorage.removeItem(k));
            window.location.href = LOGIN_URL;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateHeader);
    } else {
        updateHeader();
    }
})();
