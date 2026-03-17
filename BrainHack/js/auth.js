// ============================================
// GESTION DE L'AUTHENTIFICATION
// ============================================

let currentUser = storage.get('currentUser');

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initializeAuthPage();
});

function initializeAuthPage() {
    // Afficher la bonne vue au chargement
    if (currentUser) {
        showProfileView();
    } else {
        showLoginView();
    }
}

// Afficher la vue de connexion
function showLoginView() {
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const profileView = document.getElementById('profileView');
    const editView = document.getElementById('editView');

    if (loginView) loginView.style.display = 'flex';
    if (registerView) registerView.style.display = 'none';
    if (profileView) profileView.style.display = 'none';
    if (editView) editView.style.display = 'none';

    // Ajouter l'event listener au formulaire
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = handleLogin;
    }
}

// Afficher la vue d'inscription
function showRegisterView() {
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const profileView = document.getElementById('profileView');
    const editView = document.getElementById('editView');

    if (loginView) loginView.style.display = 'none';
    if (registerView) registerView.style.display = 'flex';
    if (profileView) profileView.style.display = 'none';
    if (editView) editView.style.display = 'none';

    // Ajouter l'event listener au formulaire
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.onsubmit = handleRegister;
    }
}

// Afficher la vue de profil
function showProfileView() {
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const profileView = document.getElementById('profileView');
    const editView = document.getElementById('editView');

    if (loginView) loginView.style.display = 'none';
    if (registerView) registerView.style.display = 'none';
    if (profileView) profileView.style.display = 'block';
    if (editView) editView.style.display = 'none';

    // Mettre à jour les informations du profil
    updateProfileDisplay();
}

// Afficher la vue d'édition
function showEditView() {
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const profileView = document.getElementById('profileView');
    const editView = document.getElementById('editView');

    if (loginView) loginView.style.display = 'none';
    if (registerView) registerView.style.display = 'none';
    if (profileView) profileView.style.display = 'none';
    if (editView) editView.style.display = 'flex';

    // Pré-remplir le formulaire
    const editForm = document.getElementById('editForm');
    if (editForm && currentUser) {
        document.getElementById('editName').value = currentUser.username;
        document.getElementById('editEmail').value = currentUser.email;
        editForm.onsubmit = handleEditProfile;
    }
}

// Fonctions de navigation
function switchToLogin() {
    showLoginView();
}

function switchToRegister() {
    showRegisterView();
}

function editProfile() {
    showEditView();
}

function cancelEdit() {
    showProfileView();
}

// Gestion de la connexion
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Validation simple
    if (!email || !password) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Récupérer les utilisateurs enregistrés
    const users = storage.get('users') || [];
    const user = users.find(u => u.email === email);

    if (user && user.password === password) {
        currentUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            stats: user.stats || {
                gamesPlayed: 0,
                totalScore: 0,
                accuracy: 0,
                memberSince: user.memberSince
            }
        };
        storage.set('currentUser', currentUser);
        showProfileView();
        alert('Connexion réussie !');
    } else {
        alert('Email ou mot de passe incorrect');
    }
}

// Gestion de l'inscription
function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
    }

    if (password.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        return;
    }

    // Récupérer les utilisateurs existants
    const users = storage.get('users') || [];

    // Vérifier si l'email existe déjà
    if (users.find(u => u.email === email)) {
        alert('Cet email est déjà utilisé');
        return;
    }

    // Créer le nouvel utilisateur
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password,
        memberSince: new Date().toLocaleDateString('fr-FR'),
        stats: {
            gamesPlayed: 0,
            totalScore: 0,
            accuracy: 0
        }
    };

    users.push(newUser);
    storage.set('users', users);

    // Connecter automatiquement l'utilisateur
    currentUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        stats: newUser.stats
    };
    storage.set('currentUser', currentUser);

    // Réinitialiser le formulaire
    document.getElementById('registerForm').reset();
    showProfileView();
    alert('Inscription réussie ! Bienvenue sur BrainHack !');
}

// Gestion de la modification du profil
function handleEditProfile(e) {
    e.preventDefault();

    const newUsername = document.getElementById('editName').value;
    const newEmail = document.getElementById('editEmail').value;

    if (!newUsername || !newEmail) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Récupérer et mettre à jour les utilisateurs
    const users = storage.get('users') || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        users[userIndex].username = newUsername;
        users[userIndex].email = newEmail;
        storage.set('users', users);

        // Mettre à jour l'utilisateur actuel
        currentUser.username = newUsername;
        currentUser.email = newEmail;
        storage.set('currentUser', currentUser);

        showProfileView();
        alert('Profil mis à jour avec succès !');
    }
}

// Mise à jour de l'affichage du profil
function updateProfileDisplay() {
    if (!currentUser) return;

    const stats = currentUser.stats || {};

    // Mettre à jour les éléments du profil
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const memberSince = document.getElementById('memberSince');
    const gamesPlayed = document.getElementById('gamesPlayed');
    const totalScore = document.getElementById('totalScore');
    const accuracy = document.getElementById('accuracy');

    if (profileName) profileName.textContent = currentUser.username;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (memberSince) memberSince.textContent = stats.memberSince || 'Aujourd\'hui';
    if (gamesPlayed) gamesPlayed.textContent = stats.gamesPlayed || 0;
    if (totalScore) totalScore.textContent = stats.totalScore || 0;
    if (accuracy) accuracy.textContent = (stats.accuracy || 0) + '%';
}

// Déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        currentUser = null;
        storage.remove('currentUser');
        showLoginView();
        alert('Vous avez été déconnecté');
    }
}

// Mise à jour des statistiques
function updateUserStats(gameType, score, maxScore) {
    if (!currentUser) return;

    const accuracy = Math.round((score / maxScore) * 100);
    currentUser.stats = {
        ...currentUser.stats,
        gamesPlayed: (currentUser.stats.gamesPlayed || 0) + 1,
        totalScore: (currentUser.stats.totalScore || 0) + score,
        accuracy: Math.round(((currentUser.stats.totalScore + score) / ((currentUser.stats.gamesPlayed + 1) * maxScore)) * 100)
    };

    storage.set('currentUser', currentUser);
    updateProfileDisplay();
}

// Export des fonctions
window.switchToLogin = switchToLogin;
window.switchToRegister = switchToRegister;
window.editProfile = editProfile;
window.cancelEdit = cancelEdit;
window.logout = logout;
window.updateUserStats = updateUserStats;