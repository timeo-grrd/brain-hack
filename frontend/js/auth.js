// La liste locale DEFAULT_AVATAR_POOL est supprimée car récupérée depuis BDD


// Nouvelle fonction fetch simple, sans fallback
async function fetchWithApiFallback(endpoint, options) {
    // endpoint doit commencer par un slash, ex: /auth/register
    return fetch(`${API_URL}${endpoint}`, options);
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

// fetch dynamiques pour les selecteurs
async function loadClasses() {
    try {
        const response = await fetch(`${API_URL}/auth/get_classes`);
        const classes = await response.json();
        const select = document.getElementById('classSelect');
        if (select && Array.isArray(classes)) {
            classes.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id;
                option.textContent = c.nom_groupe;
                select.appendChild(option);
            });
        }
    } catch (e) { console.error('Erreur chargement classes', e); }
}

async function loadAvatars() {
    try {
        const response = await fetch(`${API_URL}/auth/get_avatars`);
        const avatars = await response.json();
        const container = document.getElementById('avatarContainer');
        if (container && Array.isArray(avatars)) {
            container.innerHTML = '';
            avatars.forEach((a, index) => {
                const label = document.createElement('label');
                label.style.cursor = 'pointer';
                label.style.textAlign = 'center';
                label.style.display = 'inline-block';
                
                if (index >= 3) {
                    label.classList.add('avatar-hidden');
                    label.style.display = 'none';
                } else {
                    label.classList.add('avatar-visible');
                }
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'id_avatar';
                radio.value = a.id;
                radio.required = true;
                if (index === 0) radio.checked = true; // Sélection par défaut
                radio.style.display = 'none'; // Cacher le bouton radio standard
                
                const img = document.createElement('img');
                const nomFichier = a.avatar_url.split('/').pop();
                img.src = `../assets/${nomFichier}`;
                img.alt = a.nom;
                img.style.width = '60px';
                img.style.height = '60px';
                img.style.borderRadius = '50%';
                img.style.border = index === 0 ? '3px solid #7289da' : '3px solid transparent';
                img.style.display = 'block';
                img.style.transition = '0.3s';
                
                radio.addEventListener('change', () => {
                    document.querySelectorAll('#avatarContainer img').forEach(i => i.style.borderColor = 'transparent');
                    img.style.borderColor = '#7289da'; 
                });

                label.appendChild(radio);
                label.appendChild(img);
                container.appendChild(label);
            });

            if (avatars.length > 3) {
                const btnMore = document.createElement('button');
                btnMore.type = 'button';
                btnMore.textContent = "Voir plus d'avatars...";
                btnMore.style.display = 'block';
                btnMore.style.width = '100%';
                btnMore.style.background = 'none';
                btnMore.style.border = 'none';
                btnMore.style.color = 'var(--primary)';
                btnMore.style.textDecoration = 'underline';
                btnMore.style.cursor = 'pointer';
                btnMore.style.marginTop = '10px';
                
                btnMore.addEventListener('click', () => {
                   const hiddens = container.querySelectorAll('.avatar-hidden');
                   const isShowingMore = hiddens[0].style.display !== 'none';
                   if (isShowingMore) {
                       hiddens.forEach(el => el.style.display = 'none');
                       btnMore.textContent = "Voir plus d'avatars...";
                   } else {
                       hiddens.forEach(el => el.style.display = 'inline-block');
                       btnMore.textContent = "Voir moins";
                   }
                });
                
                const existingBtn = container.parentNode.querySelector('.avatar-more-btn');
                if(!existingBtn) {
                    btnMore.classList.add('avatar-more-btn');
                    container.parentNode.appendChild(btnMore);
                }
            }
        }
    } catch (e) { console.error('Erreur chargement avatars', e); }
}

function setAuthMode(mode) {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const classGroup = document.getElementById('classSelectGroup');
    const avatarGroup = document.getElementById('avatarSelectGroup');

    if (!registerForm || !loginForm) return;

    if (mode === 'login') {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        if (classGroup) classGroup.style.display = 'none';
        if (avatarGroup) avatarGroup.style.display = 'none';
        return;
    }

    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    if (classGroup) classGroup.style.display = 'block';
    if (avatarGroup) avatarGroup.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
    const mode = String(new URLSearchParams(window.location.search).get('mode') || 'register')
        .trim()
        .toLowerCase();
    setAuthMode(mode === 'login' ? 'login' : 'register');

    const navLoginLink = document.querySelector('.nav-actions a[href*="mode=login"]');
    const navRegisterLink = document.querySelector('.nav-actions a[href*="mode=register"]');

    if (navLoginLink) {
        navLoginLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'authentification.html?mode=login';
        });
    }

    if (navRegisterLink) {
        navRegisterLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'authentification.html?mode=register';
        });
    }
    
    // Chargement dynamique BDD
    if (document.getElementById('registerFormElement')) {
        await loadClasses();
        await loadAvatars();
        
        // Gestion des rôles (masquer classe si prof)
        const roleRadios = document.querySelectorAll('input[name="role"]');
        const classSelectGroup = document.getElementById('classSelectGroup');
        const classSelect = document.getElementById('classSelect');

        roleRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'teacher') {
                    classSelectGroup.style.display = 'none';
                    if(classSelect) classSelect.required = false;
                    if(classSelect) classSelect.value = '';
                } else {
                    classSelectGroup.style.display = 'block';
                    if(classSelect) classSelect.required = true;
                }
            });
        });
    }
});

// Basculer entre inscription et connexion quand on clique sur le lien texte
document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'authentification.html?mode=login';
});

document.getElementById('showRegisterQuestion')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'authentification.html?mode=register';
});

// Inscription
document.getElementById('registerFormElement')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = e.target.querySelectorAll('input:not([type="radio"])');
    const select = e.target.querySelector('select');
    
    // Fallback index pour s'adapter aux DOM modifications
    const pseudo = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value; // Mot de passe est mnt index 2
    
    // Radio buttons / selects
    const roleChecked = e.target.querySelector('input[name="role"]:checked');
    const role = roleChecked ? roleChecked.value : 'student';
    
    const id_classe = select && select.value !== '' ? select.value : null;
    
    const avatarChecked = e.target.querySelector('input[name="id_avatar"]:checked');
    const id_avatar = avatarChecked ? avatarChecked.value : null;

    if (role === 'student' && !id_classe) {
        alert("Veuillez sélectionner une classe.");
        return;
    }
    
    if (!id_avatar) {
        alert("Veuillez sélectionner un avatar.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pseudo: pseudo,
                email: email,
                password: password,
                role: role,
                id_classe: id_classe,
                id_avatar: id_avatar
            })
        });

        const data = await readApiResponse(response);

        if (response.ok && data.status === 'success') {
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
            
            window.location.href = data.redirectUrl;
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
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await readApiResponse(response);

        if (response.ok && data.status === 'success') {
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
            
            if (data.theme_daltonien && data.theme_daltonien !== 'normal') {
                localStorage.setItem('activeTheme', data.theme_daltonien);
            }
            
            alert(`De retour parmi nous, ${data.pseudo} !`);
            
            window.location.href = data.redirectUrl;
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