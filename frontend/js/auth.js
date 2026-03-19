const API_URL = 'http://localhost:5282/api';
const DEFAULT_AVATAR_POOL = [
    '../assets/greenAvatar.png',
    '../assets/blueAvatar.png',
    '../assets/redAvatar.png',
    '../assets/yellowAvatar.png',
    '../assets/purpleAvatar.png',
    '../assets/orangeAvatar.png',
    '../assets/cyanAvatar.png',
    '../assets/pinkAvatar.png',
    '../assets/limeAvatar.png'
];

function pickRandomAvatarUrl() {
    return DEFAULT_AVATAR_POOL[Math.floor(Math.random() * DEFAULT_AVATAR_POOL.length)];
}

function setAuthMode(mode) {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (!registerForm || !loginForm) return;

    if (mode === 'login') {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        return;
    }

    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const mode = String(new URLSearchParams(window.location.search).get('mode') || 'register')
        .trim()
        .toLowerCase();
    setAuthMode(mode === 'login' ? 'login' : 'register');

    const navLoginLink = document.querySelector('.nav-actions a[href*="mode=login"]');
    const navRegisterLink = document.querySelector('.nav-actions a[href*="mode=register"]');

    if (navLoginLink) {
        navLoginLink.addEventListener('click', (event) => {
            event.preventDefault();
            setAuthMode('login');
            history.replaceState({}, '', 'authentification.html?mode=login');
        });
    }

    if (navRegisterLink) {
        navRegisterLink.addEventListener('click', (event) => {
            event.preventDefault();
            setAuthMode('register');
            history.replaceState({}, '', 'authentification.html?mode=register');
        });
    }
});

// Basculer entre inscription et connexion
document.getElementById('showLogin')?.addEventListener('click', () => {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('showLogin').classList.add('hidden');
    document.getElementById('showRegisterQuestion').textContent = "Pas encore inscrit ?";
});

document.getElementById('showRegisterQuestion')?.addEventListener('click', () => {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('showLogin').classList.remove('hidden');
    document.getElementById('showRegisterQuestion').textContent = "Êtes-vous inscrit ?";
});

// Inscription
document.getElementById('registerFormElement')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = e.target.querySelectorAll('input');
    const pseudo = inputs[0].value;
    const email = inputs[1].value;
    const role = e.target.querySelector('input[name="role"]:checked').value;
    const password = inputs[3].value;
    const avatarUrl = pickRandomAvatarUrl();

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pseudo: pseudo,
                email: email,
                password: password,
                role: role === 'professeur' ? 'teacher' : 'student',
                avatarUrl: avatarUrl
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('brainhack_token', data.token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.id,
                name: data.pseudo,
                pseudo: data.pseudo,
                email: data.email,
                role: data.role,
                avatarUrl: data.avatarUrl,
                totalXp: data.totalXp
            }));
            localStorage.setItem('userData', localStorage.getItem('currentUser'));
            alert(`Bienvenue ${data.pseudo} !`);
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Erreur lors de l\'inscription');
        }
    } catch (err) {
        alert('Impossible de contacter le serveur');
    }
});

// Connexion
document.getElementById('loginFormElement')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    if (!email || !password) {
        alert('Email et mot de passe requis');
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Veuillez renseigner une adresse email valide');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('brainhack_token', data.token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.id,
                name: data.pseudo,
                pseudo: data.pseudo,
                email: data.email,
                role: data.role,
                avatarUrl: data.avatarUrl,
                totalXp: data.totalXp
            }));
            localStorage.setItem('userData', localStorage.getItem('currentUser'));
            alert(`Bon retour ${data.pseudo} !`);
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Email ou mot de passe incorrect');
        }
    } catch (err) {
        alert('Impossible de contacter le serveur');
    }
});