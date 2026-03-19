const API_BASE = 'http://localhost:5282';

// ─── Helpers API ─────────────────────────────────────────────────────────────

async function apiPost(endpoint, body) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
}

// ─── Session JWT ─────────────────────────────────────────────────────────────

function getToken() {
    return localStorage.getItem('brainhack_token');
}

function setSession(apiResponse) {
    // On stocke uniquement le token + les infos non sensibles
    localStorage.setItem('brainhack_token', apiResponse.token);
    localStorage.setItem('isLoggedIn', 'true');

    const user = {
        id: apiResponse.id,
        name: apiResponse.firstName + ' ' + apiResponse.lastName,
        firstName: apiResponse.firstName,
        lastName: apiResponse.lastName,
        email: apiResponse.email,
        role: apiResponse.role,
        avatarUrl: apiResponse.avatarUrl,
        totalXp: apiResponse.totalXp
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userData', JSON.stringify(user));
    return user;
}

function clearSession() {
    localStorage.removeItem('brainhack_token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userData');
}

function getStoredUserData() {
    try {
        const raw = localStorage.getItem('currentUser');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

// ─── DOM prêt ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

    // Éléments DOM
    const profileSection = document.getElementById('profileSection');
    const authSection = document.getElementById('authSection');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showLoginBtn = document.getElementById('showLogin');
    const showRegisterQuestionBtn = document.getElementById('showRegisterQuestion');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnProfessor = document.getElementById('logoutBtnProfessor');
    const loginFormElement = document.getElementById('loginFormElement');
    const registerFormElement = document.getElementById('registerFormElement');
    const professorSection = document.getElementById('professorSection');
    const studentDashboard = document.getElementById('studentDashboard');
    const profClassNameInput = document.getElementById('profClassNameInput');
    const profCreateClassBtn = document.getElementById('profCreateClassBtn');
    const profClassSelect = document.getElementById('profClassSelect');
    const profClassMeta = document.getElementById('profClassMeta');
    const profStudentIdentifierInput = document.getElementById('profStudentIdentifierInput');
    const profAddStudentBtn = document.getElementById('profAddStudentBtn');
    const profStudentsList = document.getElementById('profStudentsList');
    const profAllowedArticlesList = document.getElementById('profAllowedArticlesList');
    const profCertificationRequiredArticlesList = document.getElementById('profCertificationRequiredArticlesList');
    const profCertificationMeta = document.getElementById('profCertificationMeta');
    const profCustomArticleTitleInput = document.getElementById('profCustomArticleTitleInput');
    const profCustomArticleUrlInput = document.getElementById('profCustomArticleUrlInput');
    const profCustomArticleDescriptionInput = document.getElementById('profCustomArticleDescriptionInput');
    const profAddArticleBtn = document.getElementById('profAddArticleBtn');
    const profCustomArticlesList = document.getElementById('profCustomArticlesList');
    const profClassSummary = document.getElementById('profClassSummary');
    const profRankingTableBody = document.getElementById('profRankingTableBody');
    const profRankingEmpty = document.getElementById('profRankingEmpty');
    const studentClassLabel = document.getElementById('studentClassLabel');
    const studentCustomArticlesList = document.getElementById('studentCustomArticlesList');
    const profGameRealVsAiEnabled = document.getElementById('profGameRealVsAiEnabled');
    const profGameRealVsAiLocalUrl = document.getElementById('profGameRealVsAiLocalUrl');
    const profGameRealVsAiHostedUrl = document.getElementById('profGameRealVsAiHostedUrl');
    const profGameHistoryEnabled = document.getElementById('profGameHistoryEnabled');
    const profGameHistoryLocalUrl = document.getElementById('profGameHistoryLocalUrl');
    const profGameHistoryHostedUrl = document.getElementById('profGameHistoryHostedUrl');
    const profGameBallBlastEnabled = document.getElementById('profGameBallBlastEnabled');
    const profGameBallBlastSubtitle = document.getElementById('profGameBallBlastSubtitle');
    const profSaveGameSettingsBtn = document.getElementById('profSaveGameSettingsBtn');

    const onAuthPage = Boolean(authSection);
    const onAccountPage = Boolean(profileSection);

    const STUDENT_PROGRESS_KEY = 'brainhack_student_progress_v1';
    const TEACHER_CLASSES_KEY = 'brainhack_teacher_classes_v1';
    const CERTIFICATION_KEY = 'brainhack_certifications_v1';
    const AUTH_PAGE = './authentification.html';
    const ACCOUNT_PAGE = './compte.html';

    const KNOWN_ARTICLES = [
        'ia-featured-card', 'phone-intelligence-card', 'chatgpt-lies-card',
        'manipulation-online-card', 'deepfake-detect-card', 'ai-cheats-games-card',
        'streamer-fake-video-card', 'homework-ai-card', 'future-job-card',
        'ai-replace-humanity-card'
    ];

    let activeProfessorClassId = null;

    // ── Event listeners ───────────────────────────────────────────────────────

    if (showLoginBtn) showLoginBtn.addEventListener('click', showLogin);
    if (showRegisterQuestionBtn) showRegisterQuestionBtn.addEventListener('click', showRegister);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (logoutBtnProfessor) logoutBtnProfessor.addEventListener('click', logout);
    if (profCreateClassBtn) profCreateClassBtn.addEventListener('click', createProfessorClass);
    if (profClassSelect) profClassSelect.addEventListener('change', handleClassSelectionChange);
    if (profAddStudentBtn) profAddStudentBtn.addEventListener('click', addStudentToActiveClass);
    if (profAddArticleBtn) profAddArticleBtn.addEventListener('click', addCustomArticleToActiveClass);
    if (profStudentsList) profStudentsList.addEventListener('click', handleProfessorListActions);
    if (profCustomArticlesList) profCustomArticlesList.addEventListener('click', handleProfessorListActions);
    if (profAllowedArticlesList) profAllowedArticlesList.addEventListener('change', handleKnownArticleToggle);
    if (profCertificationRequiredArticlesList) profCertificationRequiredArticlesList.addEventListener('change', handleCertificationRequirementToggle);
    if (profSaveGameSettingsBtn) profSaveGameSettingsBtn.addEventListener('click', saveGameSettingsForActiveClass);

    const certificationLink = document.getElementById('dashboardCertificationLink');
    if (certificationLink) {
        certificationLink.addEventListener('click', function (event) {
            if (certificationLink.classList.contains('is-disabled')) {
                event.preventDefault();
                showNotification('Atteins 100% pour debloquer la certification.', 'info');
            }
        });
    }

    // ── Init ──────────────────────────────────────────────────────────────────

    checkAuthStatus();

    // ── Auth ──────────────────────────────────────────────────────────────────

    function checkAuthStatus() {
        const userData = getStoredUserData();
        const mode = new URLSearchParams(window.location.search).get('mode');

        if (onAccountPage) {
            if (userData && getToken()) {
                showProfile(userData);
            } else {
                window.location.href = AUTH_PAGE + '?mode=login';
            }
            return;
        }

        if (onAuthPage) {
            showAuth();
            if (mode === 'login') showLogin();
            else showRegister();
        }
    }


    function logout() {
        clearSession();
        showNotification('Déconnexion réussie', 'info');
        setTimeout(() => { window.location.href = AUTH_PAGE + '?mode=login'; }, 500);
    }

    // ── Affichage profil ──────────────────────────────────────────────────────

    function showProfile(userData) {
        if (!userData) return;

        const isProfessor = (userData.role || '').toLowerCase() === 'teacher'
            || (userData.role || '').toLowerCase() === 'professeur';

        if (profileSection) profileSection.classList.toggle('hidden', isProfessor);
        if (professorSection) professorSection.classList.toggle('hidden', !isProfessor);
        if (authSection) authSection.classList.add('hidden');

        if (isProfessor) {
            updateProfessorDisplay(userData);
            return;
        }

        const userNameElement = document.querySelector('.user-name');
        const userRoleElement = document.querySelector('.user-role');
        const pseudoTextElement = document.querySelector('.pseudo-text');

        if (userNameElement) userNameElement.textContent = userData.firstName || userData.name || '';
        if (userRoleElement) userRoleElement.textContent = 'Élève';
        if (pseudoTextElement) pseudoTextElement.textContent = userData.email || '';

        updateMedals(userData.medals || []);
        renderStudentDashboard(userData);
    }

    function showAuth() {
        if (profileSection) profileSection.classList.add('hidden');
        if (authSection) authSection.classList.remove('hidden');
        showRegister();
    }

    function showLogin() {
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
        if (showLoginBtn) {
            showLoginBtn.classList.add('btn-primary');
            showLoginBtn.classList.remove('btn-outline');
        }
    }

    function showRegister() {
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
        if (showLoginBtn) {
            showLoginBtn.classList.remove('btn-primary');
            showLoginBtn.classList.add('btn-outline');
        }
    }

    // ── Dashboard élève ───────────────────────────────────────────────────────

    function renderStudentDashboard(userData) {
        if (!studentDashboard) return;

        const classInfo = getStudentClassInfo(userData);
        const progress = getStudentProgress(userData);
        const articlesRead = Array.isArray(progress.articlesRead) ? progress.articlesRead : [];
        const normalizedReadSet = new Set(articlesRead.map(normalizeArticleId).filter(Boolean));

        const certificationRequiredIds = Array.isArray(classInfo?.certificationRequirements?.requiredArticleIds)
            && classInfo.certificationRequirements.requiredArticleIds.length
            ? classInfo.certificationRequirements.requiredArticleIds
            : [...KNOWN_ARTICLES];

        const totalArticles = certificationRequiredIds.length;
        const readCount = certificationRequiredIds.filter(id => normalizedReadSet.has(id)).length;
        const points = Number(progress.totalPoints || 0);
        const gamesPlayed = Number(progress.gamesPlayed || 0);
        const completion = totalArticles > 0 ? Math.round((readCount / totalArticles) * 100) : 0;

        const el = id => document.getElementById(id);
        if (el('dashboardArticlesRead')) el('dashboardArticlesRead').textContent = readCount;
        if (el('dashboardArticlesTotal')) el('dashboardArticlesTotal').textContent = totalArticles;
        if (el('dashboardPoints')) el('dashboardPoints').textContent = points;
        if (el('dashboardGamesPlayed')) el('dashboardGamesPlayed').textContent = gamesPlayed;
        if (el('dashboardCompletionText')) el('dashboardCompletionText').textContent = `${completion}%`;
        if (el('dashboardCompletionBar')) el('dashboardCompletionBar').style.width = `${completion}%`;

        const certStatus = el('dashboardCertificationStatus');
        const certLink = el('dashboardCertificationLink');

        if (completion >= 100) {
            saveUnlockedCertification(userData, {
                completion, totalPoints: points, generatedAt: new Date().toISOString()
            });
            if (certStatus) certStatus.textContent = `Certification débloquée ! (${readCount}/${totalArticles} articles lus)`;
            if (certLink) { certLink.classList.remove('is-disabled'); certLink.setAttribute('aria-disabled', 'false'); }
        } else {
            if (certStatus) certStatus.textContent = `Certification : ${readCount}/${totalArticles} articles obligatoires lus (${completion}%).`;
            if (certLink) { certLink.classList.add('is-disabled'); certLink.setAttribute('aria-disabled', 'true'); }
        }

        const readListEl = el('dashboardArticlesReadList');
        const unreadListEl = el('dashboardArticlesUnreadList');

        if (readListEl && unreadListEl) {
            const readArticles = certificationRequiredIds.filter(id => normalizedReadSet.has(id));
            const unreadArticles = certificationRequiredIds.filter(id => !normalizedReadSet.has(id));

            readListEl.innerHTML = readArticles.length
                ? readArticles.map(id => `<p class="dashboard-article-item done">✓ ${prettifyArticleName(id)}</p>`).join('')
                : '<p class="dashboard-article-item empty">Aucun article lu pour le moment.</p>';

            unreadListEl.innerHTML = unreadArticles.length
                ? unreadArticles.map(id => `<p class="dashboard-article-item">○ ${prettifyArticleName(id)}</p>`).join('')
                : '<p class="dashboard-article-item done">Tout est lu, bravo !</p>';
        }

        if (studentClassLabel) {
            studentClassLabel.textContent = classInfo ? `Classe : ${classInfo.className}` : 'Aucune classe assignée pour le moment';
            studentClassLabel.style.display = 'inline-flex';
        }

        if (studentCustomArticlesList) {
            const customArticles = classInfo?.customArticles || [];
            studentCustomArticlesList.innerHTML = customArticles.length
                ? customArticles.map(a => `
                    <div class="student-custom-article-item">
                        <a href="${escapeHtml(a.url || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(a.title || 'Article')}</a>
                        <small>${escapeHtml(a.description || '')}</small>
                    </div>`).join('')
                : '<p class="professor-meta">Aucun article personnalisé pour ta classe.</p>';
        }
    }

    // ── Espace professeur ─────────────────────────────────────────────────────

    function updateProfessorDisplay(userData) {
        const professorNameElement = document.querySelector('.prof-name');
        const professorEmailElement = document.querySelector('.professor-email');
        if (professorNameElement) professorNameElement.textContent = userData.firstName || userData.name || 'Professeur';
        if (professorEmailElement) professorEmailElement.textContent = userData.email || '';
        renderProfessorWorkspace(userData);
    }

    function renderProfessorWorkspace(userData) {
        if (!profClassSelect) return;
        const state = getTeacherClassesState(userData);
        const classes = state.teacherState.classes;

        if (!classes.length) {
            activeProfessorClassId = null;
            state.teacherState.activeClassId = null;
            saveTeacherClassesState(userData, state.teacherState);
            profClassSelect.innerHTML = '<option value="">Aucune classe pour le moment</option>';
            profClassSelect.disabled = true;
            renderProfessorClassDetails(userData, null);
            return;
        }

        const hasStoredActive = classes.some(cls => cls.id === state.teacherState.activeClassId);
        if (!hasStoredActive) {
            state.teacherState.activeClassId = classes[0].id;
            saveTeacherClassesState(userData, state.teacherState);
        }

        activeProfessorClassId = state.teacherState.activeClassId;
        profClassSelect.disabled = false;
        profClassSelect.innerHTML = classes.map(cls => `<option value="${cls.id}">${escapeHtml(cls.name)}</option>`).join('');
        profClassSelect.value = activeProfessorClassId;

        const activeClass = classes.find(cls => cls.id === activeProfessorClassId) || null;
        renderProfessorClassDetails(userData, activeClass);
    }

    function createProfessorClass() {
        const userData = getStoredUserData();
        if (!userData) return;
        const className = (profClassNameInput?.value || '').trim();
        if (!className) { showNotification('Saisis un nom de classe.', 'info'); return; }

        const state = getTeacherClassesState(userData);
        if (state.teacherState.classes.some(cls => cls.name.toLowerCase() === className.toLowerCase())) {
            showNotification('Cette classe existe déjà.', 'info'); return;
        }

        const classId = `class-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        state.teacherState.classes.push({
            id: classId, name: className,
            createdAt: new Date().toISOString(),
            students: [],
            allowedArticleIds: [...KNOWN_ARTICLES],
            certificationRequirements: getDefaultCertificationRequirements(),
            customArticles: [],
            gameSettings: getDefaultGameSettings()
        });
        state.teacherState.activeClassId = classId;
        saveTeacherClassesState(userData, state.teacherState);
        if (profClassNameInput) profClassNameInput.value = '';
        renderProfessorWorkspace(userData);
        showNotification('Classe créée avec succès.', 'success');
    }

    function handleClassSelectionChange() {
        const userData = getStoredUserData();
        if (!userData) return;
        const state = getTeacherClassesState(userData);
        state.teacherState.activeClassId = profClassSelect?.value || null;
        saveTeacherClassesState(userData, state.teacherState);
        renderProfessorWorkspace(userData);
    }

    function addStudentToActiveClass() {
        const userData = getStoredUserData();
        if (!userData) return;
        const identifier = (profStudentIdentifierInput?.value || '').trim().toLowerCase();
        if (!identifier) { showNotification('Saisis un email élève.', 'info'); return; }

        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) { showNotification('Crée d\'abord une classe.', 'info'); return; }

        // Clé basée sur l'email (plus de liste users locale)
        const studentKey = `email:${identifier}`;

        if (!Array.isArray(activeClass.students)) activeClass.students = [];
        if (activeClass.students.includes(studentKey)) {
            showNotification('Cet élève est déjà dans la classe.', 'info'); return;
        }

        activeClass.students.push(studentKey);
        saveTeacherClassesState(userData, state.teacherState);
        if (profStudentIdentifierInput) profStudentIdentifierInput.value = '';
        renderProfessorWorkspace(userData);
        showNotification('Élève ajouté à la classe.', 'success');
    }

    function addCustomArticleToActiveClass() {
        const userData = getStoredUserData();
        if (!userData) return;
        const title = (profCustomArticleTitleInput?.value || '').trim();
        const url = (profCustomArticleUrlInput?.value || '').trim();
        const description = (profCustomArticleDescriptionInput?.value || '').trim();

        if (!title || !url) { showNotification('Titre et URL sont obligatoires.', 'info'); return; }
        if (!/^https?:\/\//i.test(url)) { showNotification('L\'URL doit commencer par http:// ou https://.', 'info'); return; }

        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) { showNotification('Aucune classe active.', 'info'); return; }

        if (!Array.isArray(activeClass.customArticles)) activeClass.customArticles = [];
        activeClass.customArticles.push({
            id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title, url, description, createdAt: new Date().toISOString()
        });

        saveTeacherClassesState(userData, state.teacherState);
        if (profCustomArticleTitleInput) profCustomArticleTitleInput.value = '';
        if (profCustomArticleUrlInput) profCustomArticleUrlInput.value = '';
        if (profCustomArticleDescriptionInput) profCustomArticleDescriptionInput.value = '';
        renderProfessorWorkspace(userData);
        showNotification('Article ajouté pour cette classe.', 'success');
    }

    function handleKnownArticleToggle(event) {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;
        const articleId = target.getAttribute('data-article-id');
        if (!articleId) return;

        const userData = getStoredUserData();
        if (!userData) return;
        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) return;

        const allowed = new Set(Array.isArray(activeClass.allowedArticleIds) ? activeClass.allowedArticleIds : []);
        target.checked ? allowed.add(articleId) : allowed.delete(articleId);
        activeClass.allowedArticleIds = Array.from(allowed);

        const requiredSet = new Set(
            normalizeCertificationRequirements(activeClass.certificationRequirements).requiredArticleIds
                .filter(id => allowed.has(id))
        );
        if (!requiredSet.size && allowed.size) requiredSet.add(Array.from(allowed)[0]);
        activeClass.certificationRequirements = { requiredArticleIds: Array.from(requiredSet) };

        saveTeacherClassesState(userData, state.teacherState);
        renderProfessorWorkspace(userData);
    }

    function handleCertificationRequirementToggle(event) {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;
        const articleId = target.getAttribute('data-cert-required-article-id');
        if (!articleId) return;

        const userData = getStoredUserData();
        if (!userData) return;
        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) return;

        const allowedSet = new Set(Array.isArray(activeClass.allowedArticleIds) ? activeClass.allowedArticleIds : []);
        const requiredSet = new Set(normalizeCertificationRequirements(activeClass.certificationRequirements).requiredArticleIds);

        if (target.checked) {
            if (!allowedSet.has(articleId)) {
                showNotification('Active d\'abord cet article dans les articles de classe.', 'info');
                renderProfessorWorkspace(userData); return;
            }
            requiredSet.add(articleId);
        } else {
            requiredSet.delete(articleId);
            if (!requiredSet.size) {
                showNotification('La certification doit contenir au moins un article obligatoire.', 'info');
                renderProfessorWorkspace(userData); return;
            }
        }

        activeClass.certificationRequirements = { requiredArticleIds: Array.from(requiredSet) };
        saveTeacherClassesState(userData, state.teacherState);
        renderProfessorWorkspace(userData);
    }

    function handleProfessorListActions(event) {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const userData = getStoredUserData();
        if (!userData) return;
        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) return;

        const removeStudentKey = target.getAttribute('data-remove-student');
        if (removeStudentKey) {
            activeClass.students = (activeClass.students || []).filter(k => k !== removeStudentKey);
            saveTeacherClassesState(userData, state.teacherState);
            renderProfessorWorkspace(userData);
            showNotification('Élève retiré de la classe.', 'success');
            return;
        }

        const removeArticleId = target.getAttribute('data-remove-article');
        if (removeArticleId) {
            activeClass.customArticles = (activeClass.customArticles || []).filter(a => a.id !== removeArticleId);
            saveTeacherClassesState(userData, state.teacherState);
            renderProfessorWorkspace(userData);
            showNotification('Article retiré de la classe.', 'success');
        }
    }

    function renderProfessorClassDetails(userData, activeClass) {
        if (!activeClass) {
            if (profClassMeta) profClassMeta.textContent = 'Crée ta première classe pour commencer.';
            if (profStudentsList) profStudentsList.innerHTML = '<p class="professor-meta">Aucun élève.</p>';
            if (profAllowedArticlesList) profAllowedArticlesList.innerHTML = '<p class="professor-meta">Aucun article configuré.</p>';
            if (profCertificationRequiredArticlesList) profCertificationRequiredArticlesList.innerHTML = '<p class="professor-meta">Aucun prérequis certification.</p>';
            if (profCertificationMeta) profCertificationMeta.textContent = '';
            if (profCustomArticlesList) profCustomArticlesList.innerHTML = '';
            if (profClassSummary) profClassSummary.textContent = '';
            if (profRankingTableBody) profRankingTableBody.innerHTML = '';
            if (profRankingEmpty) profRankingEmpty.textContent = 'Le classement apparaîtra quand des élèves seront ajoutés.';
            renderProfessorGameSettings(null);
            return;
        }

        const students = (activeClass.students || []).map(key => ({ key, email: key.replace('email:', '') }));

        if (profClassMeta) {
            profClassMeta.textContent = `${students.length} élève(s) — Classe créée le ${new Date(activeClass.createdAt).toLocaleDateString('fr-FR')}`;
        }

        renderProfessorStudents(students);
        renderProfessorArticleAccess(activeClass);
        renderProfessorCertificationRequirements(activeClass);
        renderProfessorCustomArticles(activeClass);
        renderProfessorRanking(activeClass, students);
        renderProfessorGameSettings(activeClass);

        if (profClassSummary) {
            const totalAllowed = (activeClass.allowedArticleIds || []).length + (activeClass.customArticles || []).length;
            profClassSummary.textContent = `${students.length} élève(s) — ${totalAllowed} article(s) disponible(s)`;
        }
    }

    function renderProfessorStudents(students) {
        if (!profStudentsList) return;
        if (!students.length) {
            profStudentsList.innerHTML = '<p class="professor-meta">Ajoute des élèves pour voir leur suivi.</p>';
            return;
        }
        profStudentsList.innerHTML = students.map(({ key, email }) => `
            <div class="professor-item-row">
                <div><strong>${escapeHtml(email)}</strong></div>
                <button class="professor-remove-btn" type="button" data-remove-student="${escapeHtml(key)}">Retirer</button>
            </div>
        `).join('');
    }

    function renderProfessorArticleAccess(activeClass) {
        if (!profAllowedArticlesList) return;
        const allowedSet = new Set(Array.isArray(activeClass.allowedArticleIds) ? activeClass.allowedArticleIds : []);
        profAllowedArticlesList.innerHTML = KNOWN_ARTICLES.map(articleId => `
            <label class="professor-article-checkbox">
                <input type="checkbox" data-article-id="${escapeHtml(articleId)}" ${allowedSet.has(articleId) ? 'checked' : ''} />
                <span>${escapeHtml(prettifyArticleName(articleId))}</span>
            </label>
        `).join('');
    }

    function renderProfessorCertificationRequirements(activeClass) {
        if (!profCertificationRequiredArticlesList) return;
        const allowedSet = new Set(Array.isArray(activeClass.allowedArticleIds) ? activeClass.allowedArticleIds : []);
        const requirements = normalizeCertificationRequirements(activeClass.certificationRequirements);
        const requiredSet = new Set(requirements.requiredArticleIds.filter(id => allowedSet.has(id)));
        if (!requiredSet.size && allowedSet.size) requiredSet.add(Array.from(allowedSet)[0]);

        profCertificationRequiredArticlesList.innerHTML = KNOWN_ARTICLES.map(articleId => {
            const isAllowed = allowedSet.has(articleId);
            return `
                <label class="professor-article-checkbox ${isAllowed ? '' : 'is-disabled'}">
                    <input type="checkbox" data-cert-required-article-id="${escapeHtml(articleId)}"
                        ${requiredSet.has(articleId) ? 'checked' : ''} ${isAllowed ? '' : 'disabled'} />
                    <span>${escapeHtml(prettifyArticleName(articleId))}</span>
                </label>`;
        }).join('');

        if (profCertificationMeta) {
            profCertificationMeta.textContent = `${requiredSet.size} article(s) obligatoire(s) sur ${allowedSet.size} article(s) autorisé(s).`;
        }
    }

    function renderProfessorCustomArticles(activeClass) {
        if (!profCustomArticlesList) return;
        const customArticles = Array.isArray(activeClass.customArticles) ? activeClass.customArticles : [];
        profCustomArticlesList.innerHTML = customArticles.length
            ? customArticles.map(article => `
                <div class="professor-item-row">
                    <div>
                        <strong>${escapeHtml(article.title || 'Article')}</strong><br />
                        <small><a href="${escapeHtml(article.url || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(article.url || '')}</a></small>
                    </div>
                    <button class="professor-remove-btn" type="button" data-remove-article="${escapeHtml(article.id || '')}">Retirer</button>
                </div>`).join('')
            : '<p class="professor-meta">Aucun article personnalisé pour cette classe.</p>';
    }

    function renderProfessorRanking(activeClass, students) {
        if (!profRankingTableBody || !profRankingEmpty) return;
        if (!students.length) {
            profRankingTableBody.innerHTML = '';
            profRankingEmpty.textContent = 'Ajoute des élèves à la classe pour générer un classement.';
            return;
        }

        const allowedArticles = Array.isArray(activeClass.allowedArticleIds) ? activeClass.allowedArticleIds : [];

        const ranking = students.map(({ key, email }) => {
            const fakeUser = { email: email };
            const progress = getStudentProgress(fakeUser);
            const readArticles = Array.isArray(progress.articlesRead) ? progress.articlesRead : [];
            const normalizedReadSet = new Set(readArticles.map(normalizeArticleId).filter(Boolean));
            const readCount = allowedArticles.filter(id => normalizedReadSet.has(id)).length;
            const totalArticles = Math.max(allowedArticles.length, 1);
            const gamesPlayed = Number(progress.gamesPlayed || 0);
            const points = Number(progress.totalPoints || 0);
            const articleWeight = (readCount / totalArticles) * 60;
            const gamesWeight = (Math.min(gamesPlayed, 10) / 10) * 40;
            const completion = Math.round(Math.min(100, articleWeight + gamesWeight));
            return { email, points, readCount, totalArticles, completion };
        }).sort((a, b) => b.completion !== a.completion ? b.completion - a.completion : b.points - a.points);

        profRankingTableBody.innerHTML = ranking.map((entry, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(entry.email)}</td>
                <td>${entry.points}</td>
                <td>${entry.readCount}/${entry.totalArticles}</td>
                <td>${entry.completion}%</td>
            </tr>`).join('');
        profRankingEmpty.textContent = '';
    }

    function renderProfessorGameSettings(activeClass) {
        if (!profGameRealVsAiEnabled) return;
        const settings = normalizeGameSettings(activeClass?.gameSettings || getDefaultGameSettings());
        profGameRealVsAiEnabled.checked = Boolean(settings.realVsAi.enabled);
        profGameRealVsAiLocalUrl.value = settings.realVsAi.localUrl || '';
        profGameRealVsAiHostedUrl.value = settings.realVsAi.hostedUrl || '';
        profGameHistoryEnabled.checked = Boolean(settings.aiHistory.enabled);
        profGameHistoryLocalUrl.value = settings.aiHistory.localUrl || '';
        profGameHistoryHostedUrl.value = settings.aiHistory.hostedUrl || '';
        profGameBallBlastEnabled.checked = Boolean(settings.ballBlast.enabled);
        profGameBallBlastSubtitle.value = settings.ballBlast.subtitle || '';
    }

    function saveGameSettingsForActiveClass() {
        const userData = getStoredUserData();
        if (!userData) return;
        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) { showNotification('Aucune classe active.', 'info'); return; }

        activeClass.gameSettings = normalizeGameSettings({
            realVsAi: {
                enabled: Boolean(profGameRealVsAiEnabled?.checked),
                localUrl: (profGameRealVsAiLocalUrl?.value || '').trim(),
                hostedUrl: (profGameRealVsAiHostedUrl?.value || '').trim()
            },
            aiHistory: {
                enabled: Boolean(profGameHistoryEnabled?.checked),
                localUrl: (profGameHistoryLocalUrl?.value || '').trim(),
                hostedUrl: (profGameHistoryHostedUrl?.value || '').trim()
            },
            ballBlast: {
                enabled: Boolean(profGameBallBlastEnabled?.checked),
                subtitle: (profGameBallBlastSubtitle?.value || '').trim()
            }
        });

        saveTeacherClassesState(userData, state.teacherState);
        renderProfessorWorkspace(userData);
        showNotification('Réglages des jeux enregistrés pour la classe.', 'success');
    }

    // ── Helpers progression / localStorage ───────────────────────────────────

    function getProgressUserKey(userData) {
        if (userData.id !== undefined && userData.id !== null) return `id:${userData.id}`;
        if (userData.idCompte) return `id:${userData.idCompte}`;
        if (userData.email) return `email:${String(userData.email).toLowerCase()}`;
        if (userData.pseudo) return `pseudo:${String(userData.pseudo).toLowerCase()}`;
        return null;
    }

    function getStudentProgress(userData) {
        if (!userData) return {};
        try {
            const raw = localStorage.getItem(STUDENT_PROGRESS_KEY);
            if (!raw) return {};
            const storage = JSON.parse(raw);
            if (!storage || typeof storage !== 'object') return {};
            const userKey = getProgressUserKey(userData);
            if (!userKey || !storage[userKey]) return {};
            return storage[userKey];
        } catch { return {}; }
    }

    function getStudentClassInfo(userData) {
        const userKey = getProgressUserKey(userData);
        if (!userKey) return null;
        try {
            const raw = localStorage.getItem(TEACHER_CLASSES_KEY);
            const map = raw ? JSON.parse(raw) : {};
            for (const teacherState of Object.values(map)) {
                if (!teacherState || !Array.isArray(teacherState.classes)) continue;
                const matchingClass = teacherState.classes.find(cls =>
                    Array.isArray(cls.students) && cls.students.includes(userKey)
                );
                if (matchingClass) {
                    return {
                        className: matchingClass.name || 'Classe',
                        customArticles: Array.isArray(matchingClass.customArticles) ? matchingClass.customArticles : [],
                        certificationRequirements: normalizeCertificationRequirements(matchingClass.certificationRequirements || {}),
                        gameSettings: normalizeGameSettings(matchingClass.gameSettings || getDefaultGameSettings())
                    };
                }
            }
        } catch { return null; }
        return null;
    }

    function getTeacherClassesState(userData) {
        const teacherKey = getProgressUserKey(userData);
        const defaultState = { classes: [], activeClassId: null };
        if (!teacherKey) return { map: {}, teacherKey: null, teacherState: defaultState };
        let map = {};
        try {
            const raw = localStorage.getItem(TEACHER_CLASSES_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            map = parsed && typeof parsed === 'object' ? parsed : {};
        } catch { map = {}; }
        const teacherState = map[teacherKey] && typeof map[teacherKey] === 'object'
            ? { classes: Array.isArray(map[teacherKey].classes) ? map[teacherKey].classes : [], activeClassId: map[teacherKey].activeClassId || null }
            : defaultState;
        return { map, teacherKey, teacherState };
    }

    function saveTeacherClassesState(userData, teacherState) {
        const state = getTeacherClassesState(userData);
        if (!state.teacherKey) return;
        state.map[state.teacherKey] = {
            classes: Array.isArray(teacherState.classes) ? teacherState.classes : [],
            activeClassId: teacherState.activeClassId || null
        };
        localStorage.setItem(TEACHER_CLASSES_KEY, JSON.stringify(state.map));
    }

    function saveUnlockedCertification(userData, payload) {
        const userKey = getProgressUserKey(userData);
        if (!userKey) return;
        let map = {};
        try {
            const raw = localStorage.getItem(CERTIFICATION_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            map = parsed && typeof parsed === 'object' ? parsed : {};
        } catch { map = {}; }
        const current = map[userKey] && typeof map[userKey] === 'object' ? map[userKey] : {};
        map[userKey] = {
            ...current, unlocked: true,
            completion: Number(payload.completion || 0),
            totalPoints: Number(payload.totalPoints || 0),
            generatedAt: payload.generatedAt || new Date().toISOString(),
            displayName: userData.firstName || userData.name || userData.email || 'Élève'
        };
        localStorage.setItem(CERTIFICATION_KEY, JSON.stringify(map));
    }

    // ── Utilitaires ───────────────────────────────────────────────────────────

    function normalizeArticleId(articleId) {
        const clean = String(articleId || '').trim().toLowerCase();
        const aliases = { 'ia-featured': 'ia-featured-card', 'featured-ia-card': 'ia-featured-card' };
        return aliases[clean] || clean;
    }

    function prettifyArticleName(articleId) {
        return articleId.replace(/-card$/i, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getDefaultGameSettings() {
        return {
            realVsAi: { enabled: true, localUrl: 'http://localhost:8501', hostedUrl: 'https://brainhack-jeu.azurewebsites.net' },
            aiHistory: { enabled: true, localUrl: 'http://localhost:8502', hostedUrl: 'https://brainhack-quizhistoireia.azurewebsites.net' },
            ballBlast: { enabled: true, subtitle: 'Ball Blast ludique' }
        };
    }

    function getDefaultCertificationRequirements() {
        return { requiredArticleIds: [...KNOWN_ARTICLES] };
    }

    function normalizeCertificationRequirements(rawRequirements) {
        const requirements = rawRequirements && typeof rawRequirements === 'object' ? rawRequirements : getDefaultCertificationRequirements();
        const uniqueKnown = Array.from(new Set(
            (Array.isArray(requirements.requiredArticleIds) ? requirements.requiredArticleIds : [])
                .map(normalizeArticleId).filter(id => KNOWN_ARTICLES.includes(id))
        ));
        return { requiredArticleIds: uniqueKnown.length ? uniqueKnown : [...KNOWN_ARTICLES] };
    }

    function normalizeGameSettings(rawSettings) {
        const defaults = getDefaultGameSettings();
        const settings = rawSettings && typeof rawSettings === 'object' ? rawSettings : {};
        return {
            realVsAi: { enabled: settings.realVsAi?.enabled !== false, localUrl: settings.realVsAi?.localUrl || defaults.realVsAi.localUrl, hostedUrl: settings.realVsAi?.hostedUrl || defaults.realVsAi.hostedUrl },
            aiHistory: { enabled: settings.aiHistory?.enabled !== false, localUrl: settings.aiHistory?.localUrl || defaults.aiHistory.localUrl, hostedUrl: settings.aiHistory?.hostedUrl || defaults.aiHistory.hostedUrl },
            ballBlast: { enabled: settings.ballBlast?.enabled !== false, subtitle: settings.ballBlast?.subtitle || defaults.ballBlast.subtitle }
        };
    }

    function updateMedals(unlockedMedals) {
        document.querySelectorAll('.medal-item').forEach((item, index) => {
            if (unlockedMedals.includes(index)) {
                item.classList.add('unlocked');
                item.title = 'Médaille débloquée !';
            } else {
                item.classList.remove('unlocked');
                item.title = 'Médaille verrouillée';
            }
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 100px; left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: ${type === 'success' ? '#10b981' : '#6366f1'};
            color: white; padding: 15px 30px; border-radius: 50px;
            font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000; opacity: 0; transition: all 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    window.unlockMedal = function (medalIndex) {
        const userData = getStoredUserData();
        if (!userData) return false;
        if (!Array.isArray(userData.medals)) userData.medals = [];
        if (!userData.medals.includes(medalIndex)) {
            userData.medals.push(medalIndex);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('userData', JSON.stringify(userData));
            if (document.querySelector('.account-page')) updateMedals(userData.medals);
            showNotification('Nouvelle médaille débloquée ! 🏆', 'success');
            return true;
        }
        return false;
    };
});