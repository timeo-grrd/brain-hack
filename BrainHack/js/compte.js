document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const profileSection = document.getElementById('profileSection');
    const authSection = document.getElementById('authSection');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showLoginBtn = document.getElementById('showLogin');
    const showRegisterQuestionBtn = document.getElementById('showRegisterQuestion');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnProfessor = document.getElementById('logoutBtnProfessor');
    const loginFormElement = document.getElementById('loginFormElement');
    const registerFormElement = document.getElementById('registerFormElement');
    const professorSection = document.getElementById('professorSection');
    const studentDashboard = document.getElementById('studentDashboard');
    const onAuthPage = Boolean(authSection);
    const onAccountPage = Boolean(profileSection);
    const USERS_KEY = 'users';
    const CURRENT_USER_KEY = 'currentUser';
    const STUDENT_PROGRESS_KEY = 'brainhack_student_progress_v1';
    const AUTH_PAGE = './authentification.html';
    const ACCOUNT_PAGE = './compte.html';
    const KNOWN_ARTICLES = [
        'ia-featured-card',
        'phone-intelligence-card',
        'chatgpt-lies-card',
        'manipulation-online-card',
        'deepfake-detect-card',
        'ai-cheats-games-card',
        'streamer-fake-video-card',
        'homework-ai-card',
        'future-job-card',
        'ai-replace-humanity-card'
    ];

    // Vérifier si l'utilisateur est connecté
    checkAuthStatus();

    // Event Listeners
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', showLogin);
    }

    if (showRegisterQuestionBtn) {
        showRegisterQuestionBtn.addEventListener('click', showRegister);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    if (logoutBtnProfessor) {
        logoutBtnProfessor.addEventListener('click', logout);
    }

    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }

    if (registerFormElement) {
        registerFormElement.addEventListener('submit', handleRegister);
    }

    // Fonctions
    function checkAuthStatus() {
        const userData = getStoredUserData();
        const mode = new URLSearchParams(window.location.search).get('mode');

        if (onAccountPage) {
            if (userData) {
                showProfile(userData);
            } else {
                window.location.href = AUTH_PAGE + '?mode=login';
            }
            return;
        }

        if (onAuthPage) {
            showAuth();
            if (mode === 'login') {
                showLogin();
            } else {
                showRegister();
            }
        }
    }

    function showProfile(userData) {
        if (!userData) {
            return;
        }

        const isProfessor = (userData.role || '').toLowerCase() === 'professeur';

        if (profileSection) {
            profileSection.classList.toggle('hidden', isProfessor);
        }
        if (professorSection) {
            professorSection.classList.toggle('hidden', !isProfessor);
        }
        if (authSection) authSection.classList.add('hidden');

        if (isProfessor) {
            updateProfessorDisplay(userData);
            return;
        }

        // Mettre à jour les informations du profil
        const userNameElement = document.querySelector('.user-name');
        const userRoleElement = document.querySelector('.user-role');
        const pseudoTextElement = document.querySelector('.pseudo-text');

        if (userNameElement && userData.name) {
            userNameElement.textContent = userData.name;
        }

        if (userRoleElement && userData.role) {
            userRoleElement.textContent = userData.role === 'professeur' ? 'Professeur' : 'Élève';
        }

        if (pseudoTextElement && userData.pseudo) {
            pseudoTextElement.textContent = userData.pseudo;
        }

        // Mettre à jour les médailles débloquées
        updateMedals(userData.medals || []);
        renderStudentDashboard(userData);
    }

    function updateProfessorDisplay(userData) {
        const professorNameElement = document.querySelector('.prof-name');
        const professorEmailElement = document.querySelector('.professor-email');

        if (professorNameElement) {
            professorNameElement.textContent = userData.name || userData.pseudo || 'Professeur';
        }

        if (professorEmailElement) {
            professorEmailElement.textContent = userData.email || 'professeur@brainhack.fr';
        }
    }

    function renderStudentDashboard(userData) {
        if (!studentDashboard) {
            return;
        }

        const progress = getStudentProgress(userData);
        const articlesRead = Array.isArray(progress.articlesRead) ? progress.articlesRead : [];
        const uniqueArticlesRead = Array.from(new Set(articlesRead));
        const totalArticles = KNOWN_ARTICLES.length;
        const readCount = uniqueArticlesRead.length;
        const points = Number(progress.totalPoints || 0);
        const gamesPlayed = Number(progress.gamesPlayed || 0);

        const articleWeight = totalArticles > 0 ? (readCount / totalArticles) * 60 : 0;
        const gamesWeight = Math.min(gamesPlayed, 10) / 10 * 40;
        const completion = Math.round(Math.min(100, articleWeight + gamesWeight));

        const readElement = document.getElementById('dashboardArticlesRead');
        const totalElement = document.getElementById('dashboardArticlesTotal');
        const pointsElement = document.getElementById('dashboardPoints');
        const gamesElement = document.getElementById('dashboardGamesPlayed');
        const completionTextElement = document.getElementById('dashboardCompletionText');
        const completionBarElement = document.getElementById('dashboardCompletionBar');
        const articlesListElement = document.getElementById('dashboardArticlesList');

        if (readElement) readElement.textContent = String(readCount);
        if (totalElement) totalElement.textContent = String(totalArticles);
        if (pointsElement) pointsElement.textContent = String(points);
        if (gamesElement) gamesElement.textContent = String(gamesPlayed);
        if (completionTextElement) completionTextElement.textContent = `${completion}%`;
        if (completionBarElement) completionBarElement.style.width = `${completion}%`;

        if (articlesListElement) {
            const topArticles = KNOWN_ARTICLES.slice(0, 5);
            articlesListElement.innerHTML = topArticles.map(articleId => {
                const isRead = uniqueArticlesRead.includes(articleId);
                const label = prettifyArticleName(articleId);
                return `<p class="dashboard-article-item ${isRead ? 'done' : ''}">${isRead ? '✓' : '○'} ${label}</p>`;
            }).join('');
        }
    }

    function prettifyArticleName(articleId) {
        return articleId
            .replace(/-card$/i, '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    function getStudentProgress(userData) {
        if (!userData) {
            return {};
        }

        try {
            const raw = localStorage.getItem(STUDENT_PROGRESS_KEY);
            if (!raw) {
                return {};
            }

            const storage = JSON.parse(raw);
            if (!storage || typeof storage !== 'object') {
                return {};
            }

            const userKey = getProgressUserKey(userData);
            if (!userKey || !storage[userKey]) {
                return {};
            }

            return storage[userKey];
        } catch (error) {
            return {};
        }
    }

    function getProgressUserKey(userData) {
        if (userData.id !== undefined && userData.id !== null) {
            return `id:${userData.id}`;
        }

        if (userData.idCompte) {
            return `id:${userData.idCompte}`;
        }

        if (userData.email) {
            return `email:${String(userData.email).toLowerCase()}`;
        }

        if (userData.pseudo) {
            return `pseudo:${String(userData.pseudo).toLowerCase()}`;
        }

        return null;
    }

    function showAuth() {
        if (profileSection) profileSection.classList.add('hidden');
        if (authSection) authSection.classList.remove('hidden');
        showRegister();
    }

    function showLogin() {
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
        if (showLoginBtn) {
            showLoginBtn.textContent = 'Connectez-vous';
            showLoginBtn.classList.add('btn-primary');
            showLoginBtn.classList.remove('btn-outline');
        }
    }

    function showRegister() {
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
        if (showLoginBtn) {
            showLoginBtn.textContent = 'Connectez-vous';
            showLoginBtn.classList.remove('btn-primary');
            showLoginBtn.classList.add('btn-outline');
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        
        const inputs = e.target.querySelectorAll('input');
        const identifier = inputs[0].value.trim(); // pseudo ou email
        const password = inputs[1].value;

        if (!identifier || !password) {
            showNotification('Veuillez remplir tous les champs.', 'info');
            return;
        }

        const users = getUsers();
        if (!users.length) {
            showNotification('Aucun compte trouvé. Inscris-toi d\'abord.', 'info');
            showRegister();
            return;
        }

        const normalizedIdentifier = identifier.toLowerCase();
        const matchedUser = users.find(user =>
            (user.pseudo || '').toLowerCase() === normalizedIdentifier ||
            (user.email || '').toLowerCase() === normalizedIdentifier
        );

        if (matchedUser && !matchedUser.password) {
            matchedUser.password = password;
            persistUsers(users);
            setCurrentUser(matchedUser);
            showNotification('Compte mis a jour. Connexion reussie !', 'success');

            setTimeout(() => {
                window.location.href = ACCOUNT_PAGE;
            }, 500);
            return;
        }

        if (matchedUser && matchedUser.password === password) {
            setCurrentUser(matchedUser);
            showNotification('Connexion réussie !', 'success');

            setTimeout(() => {
                window.location.href = ACCOUNT_PAGE;
            }, 500);
        } else {
            showNotification('Identifiant ou mot de passe incorrect.', 'info');
        }
    }

    function handleRegister(e) {
        e.preventDefault();
        
        const pseudoInput = e.target.querySelector('input[placeholder="Votre pseudo"]');
        const emailInput = e.target.querySelector('input[type="email"]');
        const passwordInput = e.target.querySelector('input[type="password"]');
        const roleRadio = e.target.querySelector('input[name="role"]:checked');
        const pseudo = pseudoInput ? pseudoInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        const role = roleRadio ? roleRadio.value : 'eleve';
        const password = passwordInput ? passwordInput.value : '';

        if (!pseudo || !email || !password) {
            showNotification('Veuillez remplir tous les champs.', 'info');
            return;
        }

        if (password.length < 6) {
            showNotification('Le mot de passe doit contenir au moins 6 caractères.', 'info');
            return;
        }

        const users = getUsers();
        const pseudoExists = users.some(user => (user.pseudo || '').toLowerCase() === pseudo.toLowerCase());
        const emailExists = users.some(user => (user.email || '').toLowerCase() === email);
        const existingUserIndex = users.findIndex(user =>
            (user.pseudo || '').toLowerCase() === pseudo.toLowerCase() ||
            (user.email || '').toLowerCase() === email
        );

        if (pseudoExists || emailExists) {
            if (existingUserIndex !== -1 && !users[existingUserIndex].password) {
                users[existingUserIndex] = {
                    ...users[existingUserIndex],
                    name: pseudo,
                    pseudo: pseudo,
                    email: email,
                    role: role,
                    password: password,
                    createdAt: users[existingUserIndex].createdAt || new Date().toISOString()
                };

                persistUsers(users);
                setCurrentUser(users[existingUserIndex]);
                showNotification('Compte finalise ! Bienvenue !', 'success');

                setTimeout(() => {
                    window.location.href = ACCOUNT_PAGE;
                }, 500);
                return;
            }

            showNotification('Ce pseudo ou cet email est déjà utilisé.', 'info');
            return;
        }

        // Créer l'objet utilisateur
        const userData = {
            id: Date.now(),
            name: pseudo,
            pseudo: pseudo,
            email: email,
            role: role,
            password: password,
            medals: [], // Aucune médaille au début
            createdAt: new Date().toISOString()
        };

        // Sauvegarder dans localStorage
        users.push(userData);
        persistUsers(users);
        setCurrentUser(userData);

        // Animation de succès
        showNotification('Inscription réussie ! Bienvenue !', 'success');

        setTimeout(() => {
            window.location.href = ACCOUNT_PAGE;
        }, 500);
    }

    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem('userData');
        showNotification('Déconnexion réussie', 'info');
        setTimeout(() => {
            window.location.href = AUTH_PAGE + '?mode=login';
        }, 500);
    }

    function getStoredUserData() {
        const currentUserRaw = localStorage.getItem(CURRENT_USER_KEY);
        if (currentUserRaw) {
            try {
                const currentUser = JSON.parse(currentUserRaw);
                if (currentUser && typeof currentUser === 'object') {
                    return currentUser;
                }
            } catch (error) {
                // Ignore malformed legacy values.
            }
        }

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            return null;
        }

        // Compatibilité avec l'ancien format userData.
        try {
            const raw = localStorage.getItem('userData');
            if (!raw) {
                return null;
            }

            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') {
                return null;
            }

            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(parsed));
            return parsed;
        } catch (error) {
            return null;
        }
    }

    function getUsers() {
        const rawUsers = localStorage.getItem(USERS_KEY);
        if (rawUsers) {
            try {
                const parsedUsers = JSON.parse(rawUsers);
                if (Array.isArray(parsedUsers)) {
                    return parsedUsers;
                }
            } catch (error) {
                // Ignore malformed users key and fallback to legacy format.
            }
        }

        // Migration depuis l'ancien stockage userData.
        try {
            const legacyRaw = localStorage.getItem('userData');
            if (!legacyRaw) {
                return [];
            }

            const legacyUser = JSON.parse(legacyRaw);
            if (!legacyUser || typeof legacyUser !== 'object') {
                return [];
            }

            const migratedUser = {
                id: legacyUser.id || Date.now(),
                name: legacyUser.name || legacyUser.pseudo || '',
                pseudo: legacyUser.pseudo || '',
                email: (legacyUser.email || '').toLowerCase(),
                role: legacyUser.role || 'eleve',
                password: legacyUser.password || '',
                medals: Array.isArray(legacyUser.medals) ? legacyUser.medals : [],
                createdAt: legacyUser.createdAt || new Date().toISOString()
            };

            persistUsers([migratedUser]);
            return [migratedUser];
        } catch (error) {
            return [];
        }
    }

    function persistUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function setCurrentUser(user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        localStorage.setItem('userData', JSON.stringify(user));
    }

    function updateMedals(unlockedMedals) {
        const medalItems = document.querySelectorAll('.medal-item');
        
        medalItems.forEach((item, index) => {
            if (unlockedMedals.includes(index)) {
                item.classList.add('unlocked');
                item.title = 'Médaille débloquée !';
            } else {
                item.classList.remove('unlocked');
                item.title = 'Médaille verrouillée - Jouez pour la débloquer';
            }
        });
    }

    function showNotification(message, type = 'info') {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles de la notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: ${type === 'success' ? '#10b981' : '#6366f1'};
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Disparition automatique
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Exposer la fonction unlockMedal pour les jeux
    window.unlockMedal = function(medalIndex) {
        const userData = getStoredUserData();
        if (!userData) {
            return false;
        }

        if (!Array.isArray(userData.medals)) userData.medals = [];
        
        if (!userData.medals.includes(medalIndex)) {
            userData.medals.push(medalIndex);
            setCurrentUser(userData);

            const users = getUsers();
            const userIndex = users.findIndex(user =>
                (user.id && user.id === userData.id) ||
                ((user.email || '').toLowerCase() === (userData.email || '').toLowerCase())
            );

            if (userIndex !== -1) {
                users[userIndex] = userData;
                persistUsers(users);
            }
            
            // Si on est sur la page account, mettre à jour l'affichage
            if (document.querySelector('.account-page')) {
                updateMedals(userData.medals);
            }
            
            showNotification('Nouvelle médaille débloquée ! 🏆', 'success');
            return true;
        }
        return false;
    };
});

