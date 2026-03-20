const API_BASE_CANDIDATES = buildApiBaseCandidates();

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

    // En local, on priorise toujours l'API locale avant la prod.
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
            const response = await fetch(`${base}${endpoint}`, options);
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


const MEDAL_DEFINITIONS = {
    'real-vs-ai': {
        label: 'Réel vs IA',
        icon: '🧠',
        gameKeys: ['real-vs-ai', 'detecteur-fake-news', 'deepfake-check'],
        thresholds: { bronze: 4, silver: 8, gold: 12 },
        assets: {
            locked: '../assets/badges/real-vs-ai-locked.png',
            bronze: '../assets/medailleBronze.png',
            silver: '../assets/medailleSilver.png',
            gold: '../assets/medailleGold.png'
        }
    },
    'ai-history': {
        label: 'Histoire IA',
        icon: '📜',
        gameKeys: ['ai-history', 'quiz-ia'],
        thresholds: { bronze: 4, silver: 7, gold: 10 },
        assets: {
            locked: '../assets/badges/ai-history-locked.png',
            bronze: '../assets/medailleBronze.png',
            silver: '../assets/medailleSilver.png',
            gold: '../assets/medailleGold.png'
        }
    },
    'ball-blast': {
        label: 'Ball Blast',
        icon: '🎯',
        gameKeys: ['ball-blast'],
        thresholds: { bronze: 5, silver: 10, gold: 15 },
        assets: {
            locked: '../assets/badges/ball-blast-locked.png',
            bronze: '../assets/medailleBronze.png',
            silver: '../assets/medailleSilver.png',
            gold: '../assets/medailleGold.png'
        }
    }
};
// ─── Helpers API ─────────────────────────────────────────────────────────────

async function apiPost(endpoint, body) {
    const res = await fetchWithApiFallback(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
}

async function apiPutWithAuth(endpoint, body, token) {
    const res = await fetchWithApiFallback(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    return { ok: res.ok, status: res.status, data };
}

async function apiUploadAvatar(endpoint, file, token) {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetchWithApiFallback(endpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    return { ok: res.ok, status: res.status, data };
}

async function apiGetWithAuth(endpoint, token) {
    const res = await fetchWithApiFallback(endpoint, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    return { ok: res.ok, status: res.status, data };
}

// ─── Session JWT ─────────────────────────────────────────────────────────────

function getToken() {
    return localStorage.getItem('brainhack_token') || localStorage.getItem('token');
}

function setSession(apiResponse) {
    localStorage.setItem('brainhack_token', apiResponse.token);
    localStorage.setItem('token', apiResponse.token);
    localStorage.setItem('isLoggedIn', 'true');
    const user = {
        id: apiResponse.id,
        name: apiResponse.pseudo,
        pseudo: apiResponse.pseudo,
        email: apiResponse.email,
        role: apiResponse.role,
        avatarUrl: apiResponse.avatarUrl || pickRandomAvatarUrl(),
        totalXp: apiResponse.totalXp
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userData', JSON.stringify(user));
    return user;
}

function clearSession() {
    localStorage.removeItem('brainhack_token');
    localStorage.removeItem('token');
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

function pickRandomAvatarUrl() {
    return DEFAULT_AVATAR_POOL[Math.floor(Math.random() * DEFAULT_AVATAR_POOL.length)];
}

function ensureUserHasAvatar(userData) {
    if (!userData || typeof userData !== 'object') return userData;
    if (typeof userData.avatarUrl === 'string' && userData.avatarUrl.trim()) return userData;
    const updatedUser = { ...userData, avatarUrl: pickRandomAvatarUrl() };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    return updatedUser;
}

// ─── DOM prêt ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

    const profileSection = document.getElementById('profileSection');
    const authSection = document.getElementById('authSection');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authLoginNavLink = document.querySelector('.nav-actions a[href*="mode=login"]');
    const authRegisterNavLink = document.querySelector('.nav-actions a[href*="mode=register"]');
    const showLoginBtn = document.getElementById('showLogin');
    const showRegisterQuestionBtn = document.getElementById('showRegisterQuestion');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnProfessor = document.getElementById('logoutBtnProfessor');
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
    const avatarCircle = document.querySelector('.avatar-circle');
    const avatarInput = document.getElementById('accountAvatarInput');
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
    let isAvatarUpdating = false;

    // ── Event listeners ───────────────────────────────────────────────────────

    if (showLoginBtn) showLoginBtn.addEventListener('click', showLogin);
    if (showRegisterQuestionBtn) showRegisterQuestionBtn.addEventListener('click', showRegister);
    if (onAuthPage && authLoginNavLink) {
        authLoginNavLink.addEventListener('click', function (event) {
            event.preventDefault();
            showAuth('login');
            history.replaceState({}, '', 'authentification.html?mode=login');
        });
    }
    if (onAuthPage && authRegisterNavLink) {
        authRegisterNavLink.addEventListener('click', function (event) {
            event.preventDefault();
            showAuth('register');
            history.replaceState({}, '', 'authentification.html?mode=register');
        });
    }
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
    if (avatarCircle) {
        avatarCircle.addEventListener('click', handleAvatarChangeClick);
        avatarCircle.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleAvatarChangeClick();
            }
        });
    }
    if (avatarInput) avatarInput.addEventListener('change', handleAvatarFileSelected);

    const certificationLink = document.getElementById('dashboardCertificationLink');
    if (certificationLink) {
        certificationLink.addEventListener('click', function (event) {
            if (certificationLink.classList.contains('is-disabled')) {
                event.preventDefault();
                showNotification('Atteins 100% pour débloquer la certification.', 'info');
            }
        });
    }

    // ── Init ──────────────────────────────────────────────────────────────────

    checkAuthStatus();

    // ── Auth ──────────────────────────────────────────────────────────────────

    async function checkAuthStatus() {
        let userData = getStoredUserData();
        const rawMode = new URLSearchParams(window.location.search).get('mode');
        const mode = String(rawMode || 'register').trim().toLowerCase();

        if (onAccountPage) {
            if (userData && getToken()) {
                userData = await syncUserFromDatabase(userData);
                userData = ensureUserHasAvatar(userData);
                showProfile(userData);
            } else {
                window.location.href = AUTH_PAGE + '?mode=login';
            }
            return;
        }

        if (onAuthPage) {
            showAuth(mode === 'login' ? 'login' : 'register');
        }
    }

    async function syncUserFromDatabase(localUserData) {
        const token = getToken();
        if (!token || !localUserData) return localUserData;

        try {
            const response = await apiGetWithAuth('/api/user/me', token);
            if (!response.ok || !response.data) return localUserData;

            const syncedUser = {
                ...localUserData,
                id: response.data.id || localUserData.id,
                name: response.data.pseudo || localUserData.name,
                pseudo: response.data.pseudo || localUserData.pseudo,
                email: response.data.email || localUserData.email,
                role: response.data.role || localUserData.role,
                avatarUrl: response.data.avatar_url || localUserData.avatarUrl,
                totalXp: Number.isFinite(Number(response.data.total_xp))
                    ? Number(response.data.total_xp)
                    : localUserData.totalXp
            };

            localStorage.setItem('currentUser', JSON.stringify(syncedUser));
            localStorage.setItem('userData', JSON.stringify(syncedUser));
            return syncedUser;
        } catch {
            return localUserData;
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

        if (userNameElement) userNameElement.textContent = userData.pseudo || userData.name || '';
        if (userRoleElement) userRoleElement.textContent = 'Élève';
        if (pseudoTextElement) pseudoTextElement.textContent = userData.pseudo || '';

        renderProfileAvatar(userData);
        updateMedals(getStudentProgress(userData));
        renderStudentDashboard(userData);
    }

    function showAuth(mode = 'register') {
        if (profileSection) profileSection.classList.add('hidden');
        if (authSection) authSection.classList.remove('hidden');
        if (mode === 'login') showLogin();
        else showRegister();
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

    // ── Avatar ────────────────────────────────────────────────────────────────

    function renderProfileAvatar(userData) {
        const avatarCircle = document.querySelector('.avatar-circle');
        if (!avatarCircle) return;

        const avatarUrl = typeof userData.avatarUrl === 'string' ? userData.avatarUrl.trim() : '';
        const icon = avatarCircle.querySelector('svg');
        let image = avatarCircle.querySelector('.profile-avatar-img');

        if (!avatarUrl) {
            if (image) image.remove();
            if (icon) icon.style.display = 'block';
            return;
        }

        if (!image) {
            image = document.createElement('img');
            image.className = 'profile-avatar-img';
            image.alt = 'Avatar utilisateur';
            avatarCircle.appendChild(image);
        }

        image.src = avatarUrl;
        if (icon) icon.style.display = 'none';

        avatarCircle.setAttribute('role', 'button');
        avatarCircle.setAttribute('tabindex', '0');
        avatarCircle.setAttribute('title', 'Clique pour changer ton avatar');
        avatarCircle.setAttribute('aria-label', 'Changer d avatar');
    }

    async function handleAvatarChangeClick() {
        if (!onAccountPage || isAvatarUpdating || !avatarInput) return;
        avatarInput.value = '';
        avatarInput.click();
    }

    async function handleAvatarFileSelected(event) {
        if (isAvatarUpdating) return;

        const input = event.target;
        if (!(input instanceof HTMLInputElement)) return;
        const file = input.files && input.files[0] ? input.files[0] : null;
        if (!file) return;

        const token = getToken();
        if (!token) {
            showNotification('Session invalide, reconnecte-toi.', 'info');
            return;
        }

        if (!file.type.startsWith('image/')) {
            showNotification('Fichier invalide: image attendue.', 'info');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image trop lourde (max 5 Mo).', 'info');
            return;
        }

        isAvatarUpdating = true;
        try {
            const result = await apiUploadAvatar('/api/user/avatar/upload', file, token);
            if (!result.ok) {
                throw new Error(result.data?.message || 'Upload avatar impossible');
            }

            const userData = getStoredUserData();
            if (!userData) return;

            const updatedUser = {
                ...userData,
                avatarUrl: result.data?.avatar_url || userData.avatarUrl
            };

            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            renderProfileAvatar(updatedUser);
            showNotification('Avatar importé avec succès !', 'success');
        } catch (error) {
            const isNetworkIssue = error instanceof TypeError;
            const message = isNetworkIssue
                ? 'API inaccessible. Lance le backend (.NET) puis réessaie.'
                : (error instanceof Error ? error.message : 'Impossible d\'importer cet avatar.');
            showNotification(message, 'info');
        } finally {
            isAvatarUpdating = false;
            input.value = '';
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
        if (professorNameElement) professorNameElement.textContent = userData.pseudo || userData.name || 'Professeur';
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
            const fakeUser = { email };
            const progress = getStudentProgress(fakeUser);
            const readArticles = Array.isArray(progress.articlesRead) ? progress.articlesRead : [];
            const normalizedReadSet = new Set(readArticles.map(normalizeArticleId).filter(Boolean));
            const readCount = allowedArticles.filter(id => normalizedReadSet.has(id)).length;
            const totalArticles = Math.max(allowedArticles.length, 1);
            const gamesPlayed = Number(progress.gamesPlayed || 0);
            const points = Number(progress.totalPoints || 0);
            const completion = Math.round(Math.min(100, (readCount / totalArticles) * 60 + (Math.min(gamesPlayed, 10) / 10) * 40));
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
            displayName: userData.pseudo || userData.name || userData.email || 'Élève'
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

    function getBestScoreFromProgress(progress, gameKeys) {
        const miniGames = progress && typeof progress.miniGames === 'object' ? progress.miniGames : null;
        if (!miniGames) return 0;
        let best = 0;
        for (const key of gameKeys) {
            const gameData = miniGames[key];
            if (!gameData || typeof gameData !== 'object') continue;
            const score = Number(gameData.bestScore || 0);
            if (Number.isFinite(score) && score > best) best = score;
        }
        return best;
    }

    function getMedalTier(score, thresholds) {
        if (score >= thresholds.gold) return 'gold';
        if (score >= thresholds.silver) return 'silver';
        if (score >= thresholds.bronze) return 'bronze';
        return 'locked';
    }

    function getNextTierInfo(score, thresholds) {
        if (score < thresholds.bronze) return { label: 'Bronze', target: thresholds.bronze };
        if (score < thresholds.silver) return { label: 'Argent', target: thresholds.silver };
        if (score < thresholds.gold) return { label: 'Or', target: thresholds.gold };
        return null;
    }

    function updateMedals(progress) {
        document.querySelectorAll('.medal-item[data-medal-game]').forEach(item => {
            const medalKey = item.getAttribute('data-medal-game') || '';
            const config = MEDAL_DEFINITIONS[medalKey];
            if (!config) return;

            const bestScore = getBestScoreFromProgress(progress, config.gameKeys);
            const tier = getMedalTier(bestScore, config.thresholds);
            const nextTier = getNextTierInfo(bestScore, config.thresholds);
            const tierLabelMap = { locked: 'Verrouillé', bronze: 'Bronze', silver: 'Argent', gold: 'Or' };
            const tierLabel = tierLabelMap[tier] || 'Verrouillé';

            item.classList.remove('unlocked', 'tier-bronze', 'tier-silver', 'tier-gold');
            if (tier !== 'locked') item.classList.add('unlocked');
            if (tier === 'bronze') item.classList.add('tier-bronze');
            if (tier === 'silver') item.classList.add('tier-silver');
            if (tier === 'gold') item.classList.add('tier-gold');

            const tooltip = nextTier
                ? `${config.label}\nScore actuel: ${bestScore} pts\nProchain palier (${nextTier.label}): ${nextTier.target} pts\nEncore ${Math.max(0, nextTier.target - bestScore)} pts`
                : `${config.label}\nScore actuel: ${bestScore} pts\nPalier max atteint: Or`;

            item.setAttribute('data-tooltip', tooltip);
            item.setAttribute('title', tooltip.replace(/\n/g, ' | '));
            item.setAttribute('aria-label', `${config.label} - ${tierLabel}. ${tooltip.replace(/\n/g, '. ')}`);

            const tierLabelElement = item.querySelector('.medal-tier-label');
            if (tierLabelElement) tierLabelElement.textContent = tierLabel;

            const medalVisual = item.querySelector('.medal-visual');
            if (medalVisual) {
                medalVisual.setAttribute('data-fallback-icon', config.icon || '🏅');
            }

            const medalImage = item.querySelector('.medal-image');
            if (medalImage) {
                const imageSource = config.assets[tier] || '';
                if (imageSource) {
                    medalImage.src = imageSource;
                    medalImage.style.display = 'block';
                    medalImage.onerror = function () {
                        item.classList.remove('has-medal');
                        medalImage.style.display = 'none';
                    };
                    medalImage.onload = function () {
                        item.classList.add('has-medal');
                        medalImage.style.display = 'block';
                    };
                } else {
                    item.classList.remove('has-medal');
                    medalImage.removeAttribute('src');
                    medalImage.style.display = 'none';
                }
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
            if (document.querySelector('.account-page')) updateMedals(getStudentProgress(userData));
            showNotification('Nouvelle médaille débloquée ! 🏆', 'success');
            return true;
        }
        return false;
    };
});