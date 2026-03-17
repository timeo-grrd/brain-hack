// ============================================
// SCRIPT PRINCIPAL - BrainHack
// ============================================

// Gestion du menu hamburger
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Fonction de scroll vers une section
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Animation des éléments au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer tous les éléments avec la classe 'gallery-item' et 'game-card'
document.querySelectorAll('.gallery-item, .game-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s ease';
    observer.observe(el);
});

// Stockage local pour les données utilisateur
const storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Erreur de stockage:', e);
            return false;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }
};

// État global
let currentUser = storage.get('currentUser');

// Mise à jour de l'interface au chargement
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});

function updateUI() {
    // Mettre à jour les liens de navigation si l'utilisateur est connecté
    if (currentUser) {
        const accountLink = document.querySelector('a[href="compte.html"]');
        if (accountLink) {
            accountLink.textContent = currentUser.username;
        }
    }
}

// Export des fonctions pour utilisation globale
window.scrollToSection = scrollToSection;
window.storage = storage;