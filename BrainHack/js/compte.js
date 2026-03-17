document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const profileSection = document.getElementById('profileSection');
    const authSection = document.getElementById('authSection');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showLoginBtn = document.getElementById('showLogin');
    const showRegisterQuestionBtn = document.getElementById('showRegisterQuestion');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginFormElement = document.getElementById('loginFormElement');
    const registerFormElement = document.getElementById('registerFormElement');

    // Vérifier si l'utilisateur est connecté (simulation avec localStorage)
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

    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }

    if (registerFormElement) {
        registerFormElement.addEventListener('submit', handleRegister);
    }

    // Fonctions
    function checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');

        if (isLoggedIn && userData) {
            showProfile(userData);
        } else {
            showAuth();
        }
    }

    function showProfile(userData) {
        if (profileSection) profileSection.classList.remove('hidden');
        if (authSection) authSection.classList.add('hidden');

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
    }

    function showAuth() {
        if (profileSection) profileSection.classList.add('hidden');
        if (authSection) authSection.classList.remove('hidden');
        showRegister(); // Par défaut, montrer l'inscription
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
        
        const formData = new FormData(e.target);
        const inputs = e.target.querySelectorAll('input');
        const identifier = inputs[0].value; // pseudo ou email
        const password = inputs[1].value;

        // Simulation de connexion (dans un vrai projet, appel API ici)
        // Vérifier si des données utilisateur existent
        const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (storedUser.pseudo === identifier || storedUser.email === identifier) {
            // Connexion réussie
            localStorage.setItem('isLoggedIn', 'true');
            
            // Animation de succès
            showNotification('Connexion réussie !', 'success');
            
            setTimeout(() => {
                showProfile(storedUser);
            }, 500);
        } else {
            // Créer un utilisateur de démo si aucun n'existe
            const demoUser = {
                name: 'Utilisateur Demo',
                pseudo: identifier,
                email: identifier.includes('@') ? identifier : identifier + '@example.com',
                role: 'eleve',
                medals: [0] // Première médaille débloquée
            };
            
            localStorage.setItem('userData', JSON.stringify(demoUser));
            localStorage.setItem('isLoggedIn', 'true');
            
            showNotification('Connexion réussie !', 'success');
            setTimeout(() => {
                showProfile(demoUser);
            }, 500);
        }
    }

    function handleRegister(e) {
        e.preventDefault();
        
        const inputs = e.target.querySelectorAll('input');
        const pseudo = inputs[0].value;
        const email = inputs[1].value;
        const roleText = inputs[2].value;
        const roleRadio = e.target.querySelector('input[name="role"]:checked');
        const role = roleRadio ? roleRadio.value : 'eleve';
        const password = inputs[inputs.length - 1].value;

        // Créer l'objet utilisateur
        const userData = {
            name: pseudo,
            pseudo: pseudo,
            email: email,
            role: role,
            medals: [], // Aucune médaille au début
            createdAt: new Date().toISOString()
        };

        // Sauvegarder dans localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');

        // Animation de succès
        showNotification('Inscription réussie ! Bienvenue !', 'success');

        setTimeout(() => {
            showProfile(userData);
        }, 500);
    }

    function logout() {
        localStorage.removeItem('isLoggedIn');
        showNotification('Déconnexion réussie', 'info');
        setTimeout(() => {
            showAuth();
        }, 500);
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
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData.medals) userData.medals = [];
        
        if (!userData.medals.includes(medalIndex)) {
            userData.medals.push(medalIndex);
            localStorage.setItem('userData', JSON.stringify(userData));
            
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

