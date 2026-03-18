const API_URL = 'http://localhost:5282/api';

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

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pseudo, email, password, role, avatarUrl: '' })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                pseudo: data.pseudo,
                email: data.email,
                role: data.role,
                idCompte: data.idCompte
            }));
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
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                pseudo: data.pseudo,
                email: data.email,
                role: data.role,
                idCompte: data.idCompte
            }));
            alert(`Bon retour ${data.pseudo} !`);
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Email ou mot de passe incorrect');
        }
    } catch (err) {
        alert('Impossible de contacter le serveur');
    }
});