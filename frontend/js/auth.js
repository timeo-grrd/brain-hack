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
                role: role === 'professeur' ? 'teacher' : 'student'
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
                avatarUrl: data.avatarUrl || avatarUrl,
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

    const inputs = e.target.querySelectorAll('input');
    const email = inputs[0].value;
    const password = inputs[1].value;

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