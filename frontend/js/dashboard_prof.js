// frontend/js/dashboard_prof.js
document.addEventListener('DOMContentLoaded', async () => {
    // Vérification de la session locale d'abord
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const rawUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !rawUser) {
        window.location.href = 'authentification.html?mode=login';
        return;
    }
    
    let user;
    try {
        user = JSON.parse(rawUser);
    } catch(e) {
        window.location.href = 'authentification.html?mode=login';
        return;
    }
    
    if ((user.role || '').toLowerCase() !== 'teacher') {
        window.location.href = 'index.html';
        return;
    }

    // Gestion de la déconnexion
    const logoutBtn = document.getElementById('profLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('brainhack_token');
            window.location.href = 'authentification.html?mode=login';
        });
    }

    // Récupération des données depuis le backend
    await loadDashboardData();
    initAdminTabs();
    await Promise.all([
        loadAdminClasses(),
        loadAdminMembers(),
        loadAdminArticles()
    ]);
});

function calculateLevelFromXp(xp) {
    // Formule simple de niveau
    return Math.floor(xp / 50) + 1;
}

function getRankBadge(rank) {
    if (rank === 1) return '<span class="rank-medal" title="Premier">🥇</span>';
    if (rank === 2) return '<span class="rank-medal" title="Deuxième">🥈</span>';
    if (rank === 3) return '<span class="rank-medal" title="Troisième">🥉</span>';
    return `<span style="font-weight: 700; color: var(--text-light); padding-left: 8px;">#${rank}</span>`;
}

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/api/get_prof_dashboard`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        
        // Handling non-JSON 500 error gracefully
        let data;
        try {
            data = await response.json();
        } catch(e) {
            console.error(e);
            throw new Error('Erreur de communication avec le serveur (JSON Invalide)');
        }

        if (response.ok && data.status === 'success') {
            displayDashboard(data);
        } else if (response.status === 403) {
            alert('Session expurgée ou refusée par le serveur.');
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'authentification.html?mode=login';
        } else {
            document.getElementById('leaderboardBody').innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Échec du chargement : ${data.message}</td></tr>`;
        }
    } catch (err) {
        document.getElementById('leaderboardBody').innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">${escapeHtml(err.message || 'Impossible de joindre le backend.')}</td></tr>`;
    }
}

function displayDashboard(data) {
    document.getElementById('kpiTotalStudents').textContent = data.kpi.total_students;
    document.getElementById('kpiAvgXp').textContent = data.kpi.avg_xp;
    
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';
    
    if (!data.students || data.students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-light);">Aucun élève inscrit sur le système pour l'instant.</td></tr>`;
        document.getElementById('kpiChampions').textContent = '0';
        return;
    }
    
    let championsCount = 0;
    
    data.students.forEach((student, index) => {
        const xp = parseInt(student.total_xp, 10) || 0;
        const level = calculateLevelFromXp(xp);
        
        if (level >= 10) championsCount++;
        
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${getRankBadge(index + 1)}</td>
            <td style="font-weight: 700; color: var(--text-dark);">${escapeHtml(student.pseudo)}</td>
            <td><span style="background: rgba(0,0,0,0.05); padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; color: var(--text-dark);">${escapeHtml(student.classe_nom)}</span></td>
            <td style="color: var(--primary); font-weight: 600;">${xp} XP</td>
            <td><span class="level-badge" style="display:inline-block; background:var(--secondary); color:#fff; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:600;">Niv. ${level}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
    
    document.getElementById('kpiChampions').textContent = championsCount;
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function initAdminTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => { b.classList.remove('active', 'btn-primary'); b.classList.add('btn-outline-nav'); });
            btn.classList.add('active', 'btn-primary');
            btn.classList.remove('btn-outline-nav');

            const targetId = btn.getAttribute('data-target');
            tabContents.forEach(content => {
                content.style.display = content.id === targetId ? 'block' : 'none';
            });
        });
    });

    const btnShow = document.getElementById('btnShowAddArticle');
    const btnCancel = document.getElementById('btnCancelAddArticle');
    const modalArticle = document.getElementById('modalAddArticle');

    if(btnShow) btnShow.addEventListener('click', () => modalArticle.style.display = 'flex');
    if(btnCancel) btnCancel.addEventListener('click', () => modalArticle.style.display = 'none');

    const btnAddSection = document.getElementById('btnAddSection');
    const dynamicSectionsContainer = document.getElementById('dynamicSectionsContainer');
    let sectionCount = 1;

    if (btnAddSection) {
        btnAddSection.addEventListener('click', () => {
            sectionCount++;
            const newLabel = document.createElement('label');
            newLabel.style.cssText = 'color: var(--text-dark); font-weight: 500; display: block; margin-bottom: 5px; margin-top: 10px;';
            newLabel.textContent = `Section Texte ${sectionCount} :`;
            
            const newTextarea = document.createElement('textarea');
            newTextarea.name = 'articleSections[]';
            newTextarea.placeholder = 'Contenu de la section...';
            newTextarea.required = true;
            newTextarea.rows = 4;
            newTextarea.style.cssText = 'width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box;';
            
            dynamicSectionsContainer.appendChild(newLabel);
            dynamicSectionsContainer.appendChild(newTextarea);
        });
    }

    document.getElementById('formAddClass')?.addEventListener('submit', createClass);
    document.getElementById('formAddArticle')?.addEventListener('submit', createArticle);
}

async function loadAdminClasses() {
    try {
        const res = await fetch(`${API_URL}/api/manage_classes`, { credentials: 'include' });
        const data = await res.json();
        if(res.ok && data.status === 'success') {
            const tbody = document.getElementById('tableClassesBody');
            const select = document.getElementById('articleClass');
            tbody.innerHTML = '';
            
            select.innerHTML = '<option value="all">Toutes (Public pour toute lecole)</option>';
            if(data.classes.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Aucune classe configurée.</td></tr>';
            } else {
                data.classes.forEach(c => {
                    select.innerHTML += `<option value="${c.id}">${escapeHtml(c.nom_groupe)}</option>`;
                    tbody.innerHTML += `
                        <tr>
                            <td>#${c.id}</td>
                            <td style="font-weight: 500;">${escapeHtml(c.nom_groupe)}</td>
                            <td><button onclick="deleteClass(${c.id})" class="btn btn-outline" style="color:red; border-color:red; padding:5px 10px; font-size:0.8rem;">Supprimer</button></td>
                        </tr>
                    `;
                });
            }
        }
    } catch(e) { console.error(e); }
}

async function createClass(e) {
    e.preventDefault();
    const val = document.getElementById('newClassName').value.trim();
    if(!val) return;
    try {
        const res = await fetch(`${API_URL}/api/manage_classes`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ nom_groupe: val })
        });
        const data = await res.json();
        if(data.status === 'success') {
            document.getElementById('newClassName').value = '';
            await loadAdminClasses();
        } else {
            alert(data.message);
        }
    } catch(e){ alert('Erreur réseau'); }
}

window.deleteClass = async function(id) {
    if(!confirm('Supprimer cette classe ? Ses élèves perdront leur assignation.')) return;
    try {
        const res = await fetch(`${API_URL}/api/manage_classes?id=${id}`, { method: 'DELETE', credentials: 'include' });
        const data = await res.json();
        if(data.status === 'success') {
            await loadAdminClasses();
            await loadAdminMembers();
            await loadDashboardData();
        } else alert(data.message);
    } catch(e){}
};

async function loadAdminMembers() {
    try {
        const res = await fetch(`${API_URL}/api/manage_users`, { credentials: 'include' });
        const data = await res.json();
        if(res.ok && data.status === 'success') {
            const tbody = document.getElementById('tableMembersBody');
            tbody.innerHTML = '';
            if(data.users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Aucun élève inscrit sur le domaine.</td></tr>';
            } else {
                data.users.forEach(u => {
                    tbody.innerHTML += `
                        <tr>
                            <td style="font-weight: bold; color: var(--text-dark);">${escapeHtml(u.pseudo)}</td>
                            <td>${escapeHtml(u.email)}</td>
                            <td><span style="background: rgba(0,0,0,0.05); padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; color: var(--text-dark);">${escapeHtml(u.classe_nom)}</span></td>
                            <td><button onclick="deleteMember(${u.id})" class="btn btn-outline" style="color:red; border-color:red; padding:5px 10px; font-size:0.8rem;">Exclure</button></td>
                        </tr>
                    `;
                });
            }
        }
    } catch(e) {}
}

window.deleteMember = async function(id) {
    if(!confirm('Exclure DEFINITIVEMENT cet élève ?')) return;
    try {
        const res = await fetch(`${API_URL}/api/manage_users?id=${id}`, { method: 'DELETE', credentials: 'include' });
        const data = await res.json();
        if(data.status === 'success') {
            await loadAdminMembers();
            await loadDashboardData();
        } else alert(data.message);
    } catch(e){}
};

async function loadAdminArticles() {
    try {
        const res = await fetch(`${API_URL}/api/manage_articles`, { credentials: 'include' });
        const data = await res.json();
        if(res.ok && data.status === 'success') {
            const tbody = document.getElementById('tableArticlesBody');
            tbody.innerHTML = '';
            if(data.articles.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Aucun article créé par ladministration.</td></tr>';
            } else {
                data.articles.forEach(a => {
                    tbody.innerHTML += `
                        <tr>
                            <td style="font-weight: 500; color: var(--text-dark);">${escapeHtml(a.title)}<br><small style="color:var(--text-light); font-weight:normal;">${escapeHtml(a.intro).substring(0,50)}...</small></td>
                            <td><span style="background: rgba(0,0,0,0.05); padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; color: var(--text-dark);">${escapeHtml(a.classe_nom)}</span></td>
                            <td><button onclick="deleteArticle(${a.id})" class="btn btn-outline" style="color:red; border-color:red; padding:5px 10px; font-size:0.8rem;">Oublier</button></td>
                        </tr>
                    `;
                });
            }
        }
    } catch(e){}
}

async function createArticle(e) {
    e.preventDefault();
    
    // Collect all sections
    const sectionElements = document.querySelectorAll('textarea[name="articleSections[]"]');
    const sectionsArray = [];
    sectionElements.forEach(textarea => {
        sectionsArray.push({ type: 'text', content: textarea.value });
    });

    const payload = {
        title: document.getElementById('articleTitle').value,
        intro: document.getElementById('articleIntro').value,
        sections: sectionsArray,
        id_classe: document.getElementById('articleClass').value
    };
    try {
        const res = await fetch(`${API_URL}/api/create_article`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if(data.status === 'success') {
            document.getElementById('formAddArticle').reset();
            document.getElementById('modalAddArticle').style.display = 'none';
            // Reset sections to 1
            const container = document.getElementById('dynamicSectionsContainer');
            container.innerHTML = `
                <label style="color: var(--text-dark); font-weight: 500; display: block; margin-bottom: 5px;">Section Texte 1 :</label>
                <textarea name="articleSections[]" placeholder="Contenu de la section..." required rows="4" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box;"></textarea>
            `;
            await loadAdminArticles();
        } else {
            alert(data.message);
        }
    } catch(e){ alert('Erreur réseau'); }
}

window.deleteArticle = async function(id) {
    if(!confirm("Effacer cet article définitivement ? (Disparaîtra du fil d'actualité cible)")) return;
    try {
        const res = await fetch(`${API_URL}/api/manage_articles?id=${id}`, { method: 'DELETE', credentials: 'include' });
        const data = await res.json();
        if(data.status === 'success') await loadAdminArticles();
        else alert(data.message);
    } catch(e){}
};
