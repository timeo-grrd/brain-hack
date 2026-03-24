// theme-loader.js
// S'exécute immédiatement avant le rendu pour éviter le scintillement (flicker)
(function() {
    const savedTheme = localStorage.getItem('activeTheme') || 'normal';
    if (savedTheme !== 'normal') {
        document.documentElement.classList.add('theme-' + savedTheme);
        window.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('theme-' + savedTheme);
            document.querySelectorAll('.theme-selector').forEach(select => {
                select.value = savedTheme;
            });
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        // Routage dynamique du Header (Logo & Accueil) pour Professeur
        const rawUser = localStorage.getItem('currentUser');
        if (rawUser && localStorage.getItem('isLoggedIn') === 'true') {
            try {
                const user = JSON.parse(rawUser);
                if (user && user.role === 'teacher') {
                    document.querySelectorAll('a.nav-logo, a.nav-link').forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === 'index.html' || href === '../html/index.html' || href === './index.html') {
                            link.setAttribute('href', 'dashboard_prof.html');
                        }
                    });
                }
            } catch(e) {}
        }
    });
})();
