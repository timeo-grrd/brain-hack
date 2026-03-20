const API_URL = 'https://brain-hack.fr/api';
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

function buildApiBaseCandidates() {
    const candidates = [];
    const add = value => {
        if (!value || typeof value !== 'string') return;
        const normalized = value.trim().replace(/\/$/, '').replace(/\/api$/i, '');
        if (!normalized) return;
        if (!candidates.includes(normalized)) candidates.push(normalized);
    };

    const { protocol, hostname } = window.location;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';

    if (isLocalHost) {
        add(`${protocol}//${hostname}:5282`);
        add(`${protocol}//${hostname}:7258`);
        add('https://localhost:7258');
    }

    add(localStorage.getItem('brainhack_api_url'));

    if (!isLocalHost) {
        add('https://localhost:7258');
    }

    add('https://brain-hack.fr');

    return candidates;
}

async function fetchWithApiFallback(endpoint, options) {
    let lastError = null;
    let lastResponse = null;

    for (const base of API_BASE_CANDIDATES) {
        try {
            const response = await fetch(`${base}/api${endpoint}`, options);

            // Un 404 indique souvent une mauvaise base API: on tente la suivante.
            if (response.status === 404) {
                lastResponse = response;
                continue;
            }

            if (response.ok) {
                localStorage.setItem('brainhack_api_url', base);
            }
            return response;
        } catch (error) {
            lastError = error;
        }
    }

    if (lastResponse) {
        return lastResponse;
    }

    throw lastError || new Error('API inaccessible');
}

async function readApiResponse(response) {
    const fallback = { message: `Erreur HTTP ${response.status}` };
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.toLowerCase().includes('application/json')) {
        const text = await response.text();
        if (!text) return fallback;
        try {
            return JSON.parse(text);
        } catch {
            return { ...fallback, message: text.slice(0, 220) };
        }
    }

    try {
        return await response.json();
    } catch {
        return fallback;
    }
}

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
        const response = await fetchWithApiFallback('/auth/register', {
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

        const data = await readApiResponse(response);

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
        const isNetworkError = err instanceof TypeError;
        alert(isNetworkError
            ? 'Impossible de contacter le serveur API. Vérifie que le backend est lancé.'
            : (err instanceof Error ? err.message : 'Erreur réseau inconnue'));
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
        const response = await fetchWithApiFallback('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await readApiResponse(response);

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
        const isNetworkError = err instanceof TypeError;
        alert(isNetworkError
            ? 'Impossible de contacter le serveur API. Vérifie que le backend est lancé.'
            : (err instanceof Error ? err.message : 'Erreur réseau inconnue'));
    }
});