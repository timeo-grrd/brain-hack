document.addEventListener('DOMContentLoaded', function() {
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
    const USERS_KEY = 'users';
    const CURRENT_USER_KEY = 'currentUser';
    const STUDENT_PROGRESS_KEY = 'brainhack_student_progress_v1';
    const TEACHER_CLASSES_KEY = 'brainhack_teacher_classes_v1';
    const CERTIFICATION_KEY = 'brainhack_certifications_v1';
    const AUTH_PAGE = './authentification.html';
    const ACCOUNT_PAGE = './compte.html';
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
    const KNOWN_ARTICLES = [
        'ia-featured-card',
        'phone-intelligence-card',
        'chatgpt-lies-card',
        'manipulation-online-card',
        'deepfake-detect-card',
        'ai-cheats-games-card',
        'streamer-fake-video-card',
        'homework-ai-card',
        'future-job-card',
        'ai-replace-humanity-card'
    ];
    let activeProfessorClassId = null;

    // Vérifier si l'utilisateur est connecté
    checkAuthStatus();

    // Event Listeners
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', showLogin);
    }

    if (showRegisterQuestionBtn) {
        showRegisterQuestionBtn.addEventListener('click', showRegister);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    if (logoutBtnProfessor) {
        logoutBtnProfessor.addEventListener('click', logout);
    }

    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }

    if (registerFormElement) {
        registerFormElement.addEventListener('submit', handleRegister);
    }

    if (profCreateClassBtn) {
        profCreateClassBtn.addEventListener('click', createProfessorClass);
    }

    if (profClassSelect) {
        profClassSelect.addEventListener('change', handleClassSelectionChange);
    }

    if (profAddStudentBtn) {
        profAddStudentBtn.addEventListener('click', addStudentToActiveClass);
    }

    if (profAddArticleBtn) {
        profAddArticleBtn.addEventListener('click', addCustomArticleToActiveClass);
    }

    if (profStudentsList) {
        profStudentsList.addEventListener('click', handleProfessorListActions);
    }

    if (profCustomArticlesList) {
        profCustomArticlesList.addEventListener('click', handleProfessorListActions);
    }

    if (profAllowedArticlesList) {
        profAllowedArticlesList.addEventListener('change', handleKnownArticleToggle);
    }

    if (profCertificationRequiredArticlesList) {
        profCertificationRequiredArticlesList.addEventListener('change', handleCertificationRequirementToggle);
    }

    if (profSaveGameSettingsBtn) {
        profSaveGameSettingsBtn.addEventListener('click', saveGameSettingsForActiveClass);
    }

    const certificationLink = document.getElementById('dashboardCertificationLink');
    if (certificationLink) {
        certificationLink.addEventListener('click', function(event) {
            if (certificationLink.classList.contains('is-disabled')) {
                event.preventDefault();
                showNotification('Atteins 100% pour debloquer la certification.', 'info');
            }
        });
    }

    // Fonctions
    function checkAuthStatus() {
        let userData = getStoredUserData();
        const mode = new URLSearchParams(window.location.search).get('mode');

        if (onAccountPage) {
            if (userData) {
                userData = ensureUserHasAvatar(userData);
                showProfile(userData);
            } else {
                window.location.href = AUTH_PAGE + '?mode=login';
            }
            return;
        }

        if (onAuthPage) {
            showAuth();
            if (mode === 'login') {
                showLogin();
            } else {
                showRegister();
            }
        }
    }

    function showProfile(userData) {
        if (!userData) {
            return;
        }

        const isProfessor = (userData.role || '').toLowerCase() === 'professeur';

        if (profileSection) {
            profileSection.classList.toggle('hidden', isProfessor);
        }
        if (professorSection) {
            professorSection.classList.toggle('hidden', !isProfessor);
        }
        if (authSection) authSection.classList.add('hidden');

        if (isProfessor) {
            updateProfessorDisplay(userData);
            return;
        }

        // Mettre à jour les informations du profil
        const userNameElement = document.querySelector('.user-name');
        const userRoleElement = document.querySelector('.user-role');
        const pseudoTextElement = document.querySelector('.pseudo-text');

        if (userNameElement && userData.name) {
            userNameElement.textContent = userData.name;
        }

        if (userRoleElement && userData.role) {
            userRoleElement.textContent = userData.role === 'professeur' ? 'Professeur' : 'Élève';
        }

        if (pseudoTextElement && userData.pseudo) {
            pseudoTextElement.textContent = userData.pseudo;
        }

        renderProfileAvatar(userData);

        // Mettre à jour les médailles débloquées
        updateMedals(userData.medals || []);
        renderStudentDashboard(userData);
    }

    function updateProfessorDisplay(userData) {
        const professorNameElement = document.querySelector('.prof-name');
        const professorEmailElement = document.querySelector('.professor-email');

        if (professorNameElement) {
            professorNameElement.textContent = userData.name || userData.pseudo || 'Professeur';
        }

        if (professorEmailElement) {
            professorEmailElement.textContent = userData.email || 'professeur@brainhack.fr';
        }

        renderProfessorWorkspace(userData);
    }

    function renderProfessorWorkspace(userData) {
        if (!profClassSelect) {
            return;
        }

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
        profClassSelect.innerHTML = classes
            .map(cls => `<option value="${cls.id}">${escapeHtml(cls.name)}</option>`)
            .join('');
        profClassSelect.value = activeProfessorClassId;

        const activeClass = classes.find(cls => cls.id === activeProfessorClassId) || null;
        renderProfessorClassDetails(userData, activeClass);
    }

    function createProfessorClass() {
        const userData = getStoredUserData();
        if (!userData || (userData.role || '').toLowerCase() !== 'professeur') {
            return;
        }

        const className = (profClassNameInput?.value || '').trim();
        if (!className) {
            showNotification('Saisis un nom de classe.', 'info');
            return;
        }

        const state = getTeacherClassesState(userData);
        const alreadyExists = state.teacherState.classes.some(
            cls => String(cls.name).toLowerCase() === className.toLowerCase()
        );

        if (alreadyExists) {
            showNotification('Cette classe existe deja.', 'info');
            return;
        }

        const classId = `class-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        state.teacherState.classes.push({
            id: classId,
            name: className,
            createdAt: new Date().toISOString(),
            students: [],
            allowedArticleIds: [...KNOWN_ARTICLES],
            certificationRequirements: getDefaultCertificationRequirements(),
            customArticles: [],
            gameSettings: getDefaultGameSettings()
        });
        state.teacherState.activeClassId = classId;

        saveTeacherClassesState(userData, state.teacherState);
        if (profClassNameInput) {
            profClassNameInput.value = '';
        }
        renderProfessorWorkspace(userData);
        showNotification('Classe creee avec succes.', 'success');
    }

    function handleClassSelectionChange() {
        const userData = getStoredUserData();
        if (!userData) {
            return;
        }

        const state = getTeacherClassesState(userData);
        state.teacherState.activeClassId = profClassSelect?.value || null;
        saveTeacherClassesState(userData, state.teacherState);
        renderProfessorWorkspace(userData);
    }

    function addStudentToActiveClass() {
        const userData = getStoredUserData();
        if (!userData) {
            return;
        }

        const identifier = (profStudentIdentifierInput?.value || '').trim().toLowerCase();
        if (!identifier) {
            showNotification('Saisis un pseudo ou un email eleve.', 'info');
            return;
        }

        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) {
            showNotification('Cree d abord une classe.', 'info');
            return;
        }

        const users = getUsers();
        const student = users.find(user =>
            ((user.email || '').toLowerCase() === identifier || (user.pseudo || '').toLowerCase() === identifier)
        );

        if (!student) {
            showNotification('Aucun eleve trouve avec cet identifiant.', 'info');
            return;
        }

        if ((student.role || '').toLowerCase() === 'professeur') {
            showNotification('Ce compte est un professeur.', 'info');
            return;
        }

        const studentKey = getProgressUserKey(student);
        if (!studentKey) {
            showNotification('Impossible d ajouter cet eleve.', 'info');
            return;
        }

        if (!Array.isArray(activeClass.students)) {
            activeClass.students = [];
        }

        if (activeClass.students.includes(studentKey)) {
            showNotification('Cet eleve est deja dans la classe.', 'info');
            return;
        }

        activeClass.students.push(studentKey);
        saveTeacherClassesState(userData, state.teacherState);
        if (profStudentIdentifierInput) {
            profStudentIdentifierInput.value = '';
        }
        renderProfessorWorkspace(userData);
        showNotification('Eleve ajoute a la classe.', 'success');
    }

    function addCustomArticleToActiveClass() {
        const userData = getStoredUserData();
        if (!userData) {
            return;
        }

        const title = (profCustomArticleTitleInput?.value || '').trim();
        const url = (profCustomArticleUrlInput?.value || '').trim();
        const description = (profCustomArticleDescriptionInput?.value || '').trim();

        if (!title || !url) {
            showNotification('Titre et URL sont obligatoires.', 'info');
            return;
        }

        const isUrlValid = /^https?:\/\//i.test(url);
        if (!isUrlValid) {
            showNotification('L URL doit commencer par http:// ou https://.', 'info');
            return;
        }

        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) {
            showNotification('Aucune classe active.', 'info');
            return;
        }

        if (!Array.isArray(activeClass.customArticles)) {
            activeClass.customArticles = [];
        }

        activeClass.customArticles.push({
            id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title,
            url,
            description,
            createdAt: new Date().toISOString()
        });

        saveTeacherClassesState(userData, state.teacherState);
        if (profCustomArticleTitleInput) profCustomArticleTitleInput.value = '';
        if (profCustomArticleUrlInput) profCustomArticleUrlInput.value = '';
        if (profCustomArticleDescriptionInput) profCustomArticleDescriptionInput.value = '';
        renderProfessorWorkspace(userData);
        showNotification('Article ajoute pour cette classe.', 'success');
    }

    function handleKnownArticleToggle(event) {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
            return;
        }

        const articleId = target.getAttribute('data-article-id');
        if (!articleId) {
            return;
        }

        const userData = getStoredUserData();
        if (!userData) {
            return;
        }

        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) {
            return;
        }

        const allowed = new Set(Array.isArray(activeClass.allowedArticleIds) ? activeClass.allowedArticleIds : []);
        if (target.checked) {
            allowed.add(articleId);
        } else {
            allowed.delete(articleId);
        }

        activeClass.allowedArticleIds = Array.from(allowed);
        const requiredSet = new Set(
            normalizeCertificationRequirements(activeClass.certificationRequirements).requiredArticleIds
                .filter(id => allowed.has(id))
        );
        if (!requiredSet.size && allowed.size) {
            requiredSet.add(Array.from(allowed)[0]);
        }
        activeClass.certificationRequirements = {
            requiredArticleIds: Array.from(requiredSet)
        };
        saveTeacherClassesState(userData, state.teacherState);
        renderProfessorWorkspace(userData);
    }

    function handleCertificationRequirementToggle(event) {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
            return;
        }

        const articleId = target.getAttribute('data-cert-required-article-id');
        if (!articleId) {
            return;
        }

        const userData = getStoredUserData();
        if (!userData) {
            return;
        }

        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) {
            return;
        }

        const allowedSet = new Set(Array.isArray(activeClass.allowedArticleIds) ? activeClass.allowedArticleIds : []);
        const requiredSet = new Set(normalizeCertificationRequirements(activeClass.certificationRequirements).requiredArticleIds);

        if (target.checked) {
            if (!allowedSet.has(articleId)) {
                showNotification('Active d abord cet article dans les articles de classe.', 'info');
                renderProfessorWorkspace(userData);
                return;
            }
            requiredSet.add(articleId);
        } else {
            requiredSet.delete(articleId);
            if (!requiredSet.size) {
                showNotification('La certification doit contenir au moins un article obligatoire.', 'info');
                renderProfessorWorkspace(userData);
                return;
            }
        }

        activeClass.certificationRequirements = {
            requiredArticleIds: Array.from(requiredSet)
        };
        saveTeacherClassesState(userData, state.teacherState);
        renderProfessorWorkspace(userData);
    }

    function handleProfessorListActions(event) {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const userData = getStoredUserData();
        if (!userData) {
            return;
        }

        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) {
            return;
        }

        const removeStudentKey = target.getAttribute('data-remove-student');
        if (removeStudentKey) {
            activeClass.students = (activeClass.students || []).filter(key => key !== removeStudentKey);
            saveTeacherClassesState(userData, state.teacherState);
            renderProfessorWorkspace(userData);
            showNotification('Eleve retire de la classe.', 'success');
            return;
        }

        const removeArticleId = target.getAttribute('data-remove-article');
        if (removeArticleId) {
            activeClass.customArticles = (activeClass.customArticles || []).filter(article => article.id !== removeArticleId);
            saveTeacherClassesState(userData, state.teacherState);
            renderProfessorWorkspace(userData);
            showNotification('Article retire de la classe.', 'success');
        }
    }

    function renderProfessorClassDetails(userData, activeClass) {
        if (!activeClass) {
            if (profClassMeta) {
                profClassMeta.textContent = 'Cree ta premiere classe pour commencer.';
            }
            if (profStudentsList) {
                profStudentsList.innerHTML = '<p class="professor-meta">Aucun eleve.</p>';
            }
            if (profAllowedArticlesList) {
                profAllowedArticlesList.innerHTML = '<p class="professor-meta">Aucun article configure.</p>';
            }
            if (profCertificationRequiredArticlesList) {
                profCertificationRequiredArticlesList.innerHTML = '<p class="professor-meta">Aucun prerequis certification.</p>';
            }
            if (profCertificationMeta) {
                profCertificationMeta.textContent = '';
            }
            if (profCustomArticlesList) {
                profCustomArticlesList.innerHTML = '';
            }
            if (profClassSummary) {
                profClassSummary.textContent = '';
            }
            if (profRankingTableBody) {
                profRankingTableBody.innerHTML = '';
            }
            if (profRankingEmpty) {
                profRankingEmpty.textContent = 'Le classement apparaitra quand des eleves seront ajoutes.';
            }
            renderProfessorGameSettings(null);
            return;
        }

        const users = getUsers();
        const students = (activeClass.students || [])
            .map(key => ({ key, user: findUserByProgressKey(users, key) }))
            .filter(item => Boolean(item.user));

        if (profClassMeta) {
            profClassMeta.textContent = `${students.length} eleve(s) - Classe creee le ${new Date(activeClass.createdAt).toLocaleDateString('fr-FR')}`;
        }

        renderProfessorStudents(students);
        renderProfessorArticleAccess(activeClass);
        renderProfessorCertificationRequirements(activeClass);
        renderProfessorCustomArticles(activeClass);
        renderProfessorRanking(activeClass, students);
        renderProfessorGameSettings(activeClass);

        if (profClassSummary) {
            const totalAllowed = (activeClass.allowedArticleIds || []).length + (activeClass.customArticles || []).length;
            profClassSummary.textContent = `${students.length} eleve(s) - ${totalAllowed} article(s) disponible(s)`;
        }
    }

    function renderProfessorGameSettings(activeClass) {
        if (!profGameRealVsAiEnabled) {
            return;
        }

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
        if (!userData) {
            return;
        }

        const state = getTeacherClassesState(userData);
        const activeClass = state.teacherState.classes.find(cls => cls.id === state.teacherState.activeClassId);
        if (!activeClass) {
            showNotification('Aucune classe active.', 'info');
            return;
        }

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
        showNotification('Reglages des jeux enregistres pour la classe.', 'success');
    }

    function renderProfessorStudents(students) {
        if (!profStudentsList) {
            return;
        }

        if (!students.length) {
            profStudentsList.innerHTML = '<p class="professor-meta">Ajoute des eleves pour voir leur suivi.</p>';
            return;
        }

        profStudentsList.innerHTML = students
            .map(({ key, user }) => {
                const display = user.name || user.pseudo || user.email || 'Eleve';
                const subtitle = user.email || user.pseudo || '';
                return `
                    <div class="professor-item-row">
                        <div>
                            <strong>${escapeHtml(display)}</strong><br />
                            <small>${escapeHtml(subtitle)}</small>
                        </div>
                        <button class="professor-remove-btn" type="button" data-remove-student="${escapeHtml(key)}">Retirer</button>
                    </div>
                `;
            })
            .join('');
    }

    function renderProfessorArticleAccess(activeClass) {
        if (!profAllowedArticlesList) {
            return;
        }

        const allowedSet = new Set(Array.isArray(activeClass.allowedArticleIds) ? activeClass.allowedArticleIds : []);
        profAllowedArticlesList.innerHTML = KNOWN_ARTICLES
            .map(articleId => {
                const checked = allowedSet.has(articleId) ? 'checked' : '';
                return `
                    <label class="professor-article-checkbox">
                        <input type="checkbox" data-article-id="${escapeHtml(articleId)}" ${checked} />
                        <span>${escapeHtml(prettifyArticleName(articleId))}</span>
                    </label>
                `;
            })
            .join('');
    }

    function renderProfessorCertificationRequirements(activeClass) {
        if (!profCertificationRequiredArticlesList) {
            return;
        }

        const allowedSet = new Set(Array.isArray(activeClass.allowedArticleIds) ? activeClass.allowedArticleIds : []);
        const requirements = normalizeCertificationRequirements(activeClass.certificationRequirements);
        const requiredSet = new Set(requirements.requiredArticleIds.filter(articleId => allowedSet.has(articleId)));

        if (!requiredSet.size && allowedSet.size) {
            requiredSet.add(Array.from(allowedSet)[0]);
            activeClass.certificationRequirements = {
                requiredArticleIds: Array.from(requiredSet)
            };
        }

        profCertificationRequiredArticlesList.innerHTML = KNOWN_ARTICLES
            .map(articleId => {
                const checked = requiredSet.has(articleId) ? 'checked' : '';
                const isAllowed = allowedSet.has(articleId);
                const disabled = isAllowed ? '' : 'disabled';
                return `
                    <label class="professor-article-checkbox ${isAllowed ? '' : 'is-disabled'}">
                        <input type="checkbox" data-cert-required-article-id="${escapeHtml(articleId)}" ${checked} ${disabled} />
                        <span>${escapeHtml(prettifyArticleName(articleId))}</span>
                    </label>
                `;
            })
            .join('');

        if (profCertificationMeta) {
            const totalRequired = requiredSet.size;
            const totalAllowed = allowedSet.size;
            profCertificationMeta.textContent = `${totalRequired} article(s) obligatoire(s) sur ${totalAllowed} article(s) autorise(s).`;
        }
    }

    function renderProfessorCustomArticles(activeClass) {
        if (!profCustomArticlesList) {
            return;
        }

        const customArticles = Array.isArray(activeClass.customArticles) ? activeClass.customArticles : [];
        if (!customArticles.length) {
            profCustomArticlesList.innerHTML = '<p class="professor-meta">Aucun article personnalise pour cette classe.</p>';
            return;
        }

        profCustomArticlesList.innerHTML = customArticles
            .map(article => `
                <div class="professor-item-row">
                    <div>
                        <strong>${escapeHtml(article.title || 'Article')}</strong><br />
                        <small><a href="${escapeHtml(article.url || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(article.url || '')}</a></small>
                    </div>
                    <button class="professor-remove-btn" type="button" data-remove-article="${escapeHtml(article.id || '')}">Retirer</button>
                </div>
            `)
            .join('');
    }

    function renderProfessorRanking(activeClass, students) {
        if (!profRankingTableBody || !profRankingEmpty) {
            return;
        }

        if (!students.length) {
            profRankingTableBody.innerHTML = '';
            profRankingEmpty.textContent = 'Ajoute des eleves a la classe pour generer un classement.';
            return;
        }

        const allowedArticles = Array.isArray(activeClass.allowedArticleIds)
            ? activeClass.allowedArticleIds
            : [];

        const ranking = students
            .map(({ user }) => {
                const progress = getStudentProgress(user);
                const readArticles = Array.isArray(progress.articlesRead) ? progress.articlesRead : [];
                const normalizedReadSet = new Set(readArticles.map(normalizeArticleId).filter(Boolean));
                const readCount = allowedArticles.filter(articleId => normalizedReadSet.has(articleId)).length;
                const totalArticles = Math.max(allowedArticles.length, 1);
                const gamesPlayed = Number(progress.gamesPlayed || 0);
                const points = Number(progress.totalPoints || 0);

                const articleWeight = (readCount / totalArticles) * 60;
                const gamesWeight = (Math.min(gamesPlayed, 10) / 10) * 40;
                const completion = Math.round(Math.min(100, articleWeight + gamesWeight));

                return {
                    user,
                    points,
                    readCount,
                    totalArticles,
                    completion
                };
            })
            .sort((a, b) => {
                if (b.completion !== a.completion) {
                    return b.completion - a.completion;
                }
                return b.points - a.points;
            });

        profRankingTableBody.innerHTML = ranking
            .map((entry, index) => {
                const displayName = entry.user.name || entry.user.pseudo || entry.user.email || 'Eleve';
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${escapeHtml(displayName)}</td>
                        <td>${entry.points}</td>
                        <td>${entry.readCount}/${entry.totalArticles}</td>
                        <td>${entry.completion}%</td>
                    </tr>
                `;
            })
            .join('');
        profRankingEmpty.textContent = '';
    }

    function getTeacherClassesState(userData) {
        const teacherKey = getProgressUserKey(userData);
        const defaultState = { classes: [], activeClassId: null };

        if (!teacherKey) {
            return { map: {}, teacherKey: null, teacherState: defaultState };
        }

        let map = {};
        try {
            const raw = localStorage.getItem(TEACHER_CLASSES_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            map = parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            map = {};
        }

        const teacherState = map[teacherKey] && typeof map[teacherKey] === 'object'
            ? {
                classes: Array.isArray(map[teacherKey].classes) ? map[teacherKey].classes : [],
                activeClassId: map[teacherKey].activeClassId || null
            }
            : defaultState;

        return { map, teacherKey, teacherState };
    }

    function saveTeacherClassesState(userData, teacherState) {
        const state = getTeacherClassesState(userData);
        if (!state.teacherKey) {
            return;
        }

        state.map[state.teacherKey] = {
            classes: Array.isArray(teacherState.classes) ? teacherState.classes : [],
            activeClassId: teacherState.activeClassId || null
        };
        localStorage.setItem(TEACHER_CLASSES_KEY, JSON.stringify(state.map));
    }

    function findUserByProgressKey(users, progressKey) {
        if (!progressKey || !Array.isArray(users)) {
            return null;
        }

        return users.find(user => getProgressUserKey(user) === progressKey) || null;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function normalizeArticleId(articleId) {
        const clean = String(articleId || '').trim().toLowerCase();
        if (!clean) {
            return '';
        }

        const aliases = {
            'ia-featured': 'ia-featured-card',
            'featured-ia-card': 'ia-featured-card',
            'article-ia-featured-card': 'ia-featured-card'
        };

        return aliases[clean] || clean;
    }

    function renderStudentDashboard(userData) {
        if (!studentDashboard) {
            return;
        }

        const classInfo = getStudentClassInfo(userData);

        const progress = getStudentProgress(userData);
        const articlesRead = Array.isArray(progress.articlesRead) ? progress.articlesRead : [];
        const normalizedReadSet = new Set(articlesRead.map(normalizeArticleId).filter(Boolean));
        const certificationRequiredIds = Array.isArray(classInfo?.certificationRequirements?.requiredArticleIds)
            && classInfo.certificationRequirements.requiredArticleIds.length
            ? classInfo.certificationRequirements.requiredArticleIds
            : [...KNOWN_ARTICLES];
        const totalArticles = certificationRequiredIds.length;
        const readCount = certificationRequiredIds.filter(articleId => normalizedReadSet.has(articleId)).length;
        const points = Number(progress.totalPoints || 0);
        const gamesPlayed = Number(progress.gamesPlayed || 0);

        const completion = totalArticles > 0
            ? Math.round((readCount / totalArticles) * 100)
            : 0;

        const readElement = document.getElementById('dashboardArticlesRead');
        const totalElement = document.getElementById('dashboardArticlesTotal');
        const pointsElement = document.getElementById('dashboardPoints');
        const gamesElement = document.getElementById('dashboardGamesPlayed');
        const completionTextElement = document.getElementById('dashboardCompletionText');
        const completionBarElement = document.getElementById('dashboardCompletionBar');
        const articlesListElement = document.getElementById('dashboardArticlesList');
        const articlesReadListElement = document.getElementById('dashboardArticlesReadList');
        const articlesUnreadListElement = document.getElementById('dashboardArticlesUnreadList');
        const certificationStatusElement = document.getElementById('dashboardCertificationStatus');
        const certificationLinkElement = document.getElementById('dashboardCertificationLink');

        if (readElement) readElement.textContent = String(readCount);
        if (totalElement) totalElement.textContent = String(totalArticles);
        if (pointsElement) pointsElement.textContent = String(points);
        if (gamesElement) gamesElement.textContent = String(gamesPlayed);
        if (completionTextElement) completionTextElement.textContent = `${completion}%`;
        if (completionBarElement) completionBarElement.style.width = `${completion}%`;

        if (completion >= 100) {
            saveUnlockedCertification(userData, {
                completion,
                totalPoints: points,
                generatedAt: new Date().toISOString()
            });
            if (certificationStatusElement) {
                certificationStatusElement.textContent = `Certification debloquee ! (${readCount}/${totalArticles} articles obligatoires lus)`;
            }
            if (certificationLinkElement) {
                certificationLinkElement.classList.remove('is-disabled');
                certificationLinkElement.setAttribute('aria-disabled', 'false');
            }
        } else {
            if (certificationStatusElement) {
                certificationStatusElement.textContent = `Certification: ${readCount}/${totalArticles} articles obligatoires lus (${completion}%).`;
            }
            if (certificationLinkElement) {
                certificationLinkElement.classList.add('is-disabled');
                certificationLinkElement.setAttribute('aria-disabled', 'true');
            }
        }

        if (articlesListElement && articlesReadListElement && articlesUnreadListElement) {
            const readArticles = certificationRequiredIds.filter(articleId => normalizedReadSet.has(articleId));
            const unreadArticles = certificationRequiredIds.filter(articleId => !normalizedReadSet.has(articleId));

            articlesReadListElement.innerHTML = readArticles.length
                ? readArticles
                    .map(articleId => {
                        const label = prettifyArticleName(articleId);
                        return `<p class="dashboard-article-item done">✓ ${label}</p>`;
                    })
                    .join('')
                : '<p class="dashboard-article-item empty">Aucun article lu pour le moment.</p>';

            articlesUnreadListElement.innerHTML = unreadArticles.length
                ? unreadArticles
                    .map(articleId => {
                        const label = prettifyArticleName(articleId);
                        return `<p class="dashboard-article-item">○ ${label}</p>`;
                    })
                    .join('')
                : '<p class="dashboard-article-item done">Tout est lu, bravo !</p>';
        }

        if (studentClassLabel) {
            if (classInfo) {
                studentClassLabel.textContent = `Classe: ${classInfo.className}`;
                studentClassLabel.style.display = 'inline-flex';
            } else {
                studentClassLabel.textContent = 'Aucune classe assignee pour le moment';
                studentClassLabel.style.display = 'inline-flex';
            }
        }

        if (studentCustomArticlesList) {
            const customArticles = classInfo?.customArticles || [];
            if (!customArticles.length) {
                studentCustomArticlesList.innerHTML = '<p class="professor-meta">Aucun article personnalise pour ta classe.</p>';
            } else {
                studentCustomArticlesList.innerHTML = customArticles
                    .map(article => `
                        <div class="student-custom-article-item">
                            <a href="${escapeHtml(article.url || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(article.title || 'Article')}</a>
                            <small>${escapeHtml(article.description || '')}</small>
                        </div>
                    `)
                    .join('');
            }
        }
    }

    function getStudentClassInfo(userData) {
        const userKey = getProgressUserKey(userData);
        if (!userKey) {
            return null;
        }

        let map = {};
        try {
            const raw = localStorage.getItem(TEACHER_CLASSES_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            map = parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            map = {};
        }

        for (const teacherState of Object.values(map)) {
            if (!teacherState || !Array.isArray(teacherState.classes)) {
                continue;
            }

            const matchingClass = teacherState.classes.find(cls =>
                Array.isArray(cls.students) && cls.students.includes(userKey)
            );

            if (matchingClass) {
                return {
                    className: matchingClass.name || 'Classe',
                    customArticles: Array.isArray(matchingClass.customArticles)
                        ? matchingClass.customArticles
                        : [],
                    certificationRequirements: normalizeCertificationRequirements(matchingClass.certificationRequirements || {}),
                    gameSettings: normalizeGameSettings(matchingClass.gameSettings || getDefaultGameSettings())
                };
            }
        }

        return null;
    }

    function getDefaultGameSettings() {
        return {
            realVsAi: {
                enabled: true,
                localUrl: 'http://localhost:8501',
                hostedUrl: 'https://brainhack-jeu.azurewebsites.net'
            },
            aiHistory: {
                enabled: true,
                localUrl: 'http://localhost:8502',
                hostedUrl: 'https://brainhack-quizhistoireia.azurewebsites.net'
            },
            ballBlast: {
                enabled: true,
                subtitle: 'Ball Blast ludique'
            }
        };
    }
    function getDefaultCertificationRequirements() {
        return {
            requiredArticleIds: [...KNOWN_ARTICLES]
        };
    }

    function normalizeCertificationRequirements(rawRequirements) {
        const requirements = rawRequirements && typeof rawRequirements === 'object'
            ? rawRequirements
            : getDefaultCertificationRequirements();

        const uniqueKnown = Array.from(new Set(
            (Array.isArray(requirements.requiredArticleIds) ? requirements.requiredArticleIds : [])
                .map(normalizeArticleId)
                .filter(articleId => KNOWN_ARTICLES.includes(articleId))
        ));

        return {
            requiredArticleIds: uniqueKnown.length ? uniqueKnown : [...KNOWN_ARTICLES]
        };
    }

    function normalizeGameSettings(rawSettings) {
        const defaults = getDefaultGameSettings();
        const settings = rawSettings && typeof rawSettings === 'object' ? rawSettings : {};

        return {
            realVsAi: {
                enabled: settings.realVsAi?.enabled !== false,
                localUrl: settings.realVsAi?.localUrl || defaults.realVsAi.localUrl,
                hostedUrl: settings.realVsAi?.hostedUrl || defaults.realVsAi.hostedUrl
            },
            aiHistory: {
                enabled: settings.aiHistory?.enabled !== false,
                localUrl: settings.aiHistory?.localUrl || defaults.aiHistory.localUrl,
                hostedUrl: settings.aiHistory?.hostedUrl || defaults.aiHistory.hostedUrl
            },
            ballBlast: {
                enabled: settings.ballBlast?.enabled !== false,
                subtitle: settings.ballBlast?.subtitle || defaults.ballBlast.subtitle
            }
        };
    }

    function prettifyArticleName(articleId) {
        return articleId
            .replace(/-card$/i, '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    function getStudentProgress(userData) {
        if (!userData) {
            return {};
        }

        try {
            const raw = localStorage.getItem(STUDENT_PROGRESS_KEY);
            if (!raw) {
                return {};
            }

            const storage = JSON.parse(raw);
            if (!storage || typeof storage !== 'object') {
                return {};
            }

            const userKey = getProgressUserKey(userData);
            if (!userKey || !storage[userKey]) {
                return {};
            }

            return storage[userKey];
        } catch (error) {
            return {};
        }
    }

    function getProgressUserKey(userData) {
        if (userData.id !== undefined && userData.id !== null) {
            return `id:${userData.id}`;
        }

        if (userData.idCompte) {
            return `id:${userData.idCompte}`;
        }

        if (userData.email) {
            return `email:${String(userData.email).toLowerCase()}`;
        }

        if (userData.pseudo) {
            return `pseudo:${String(userData.pseudo).toLowerCase()}`;
        }

        return null;
    }

    function saveUnlockedCertification(userData, payload) {
        const userKey = getProgressUserKey(userData);
        if (!userKey) {
            return;
        }

        let map = {};
        try {
            const raw = localStorage.getItem(CERTIFICATION_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            map = parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            map = {};
        }

        const current = map[userKey] && typeof map[userKey] === 'object' ? map[userKey] : {};
        map[userKey] = {
            ...current,
            unlocked: true,
            completion: Number(payload.completion || 0),
            totalPoints: Number(payload.totalPoints || 0),
            generatedAt: payload.generatedAt || new Date().toISOString(),
            displayName: userData.name || userData.pseudo || userData.email || 'Eleve'
        };
        localStorage.setItem(CERTIFICATION_KEY, JSON.stringify(map));
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
            showLoginBtn.textContent = 'Connectez-vous';
            showLoginBtn.classList.add('btn-primary');
            showLoginBtn.classList.remove('btn-outline');
        }
    }

    function showRegister() {
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
        if (showLoginBtn) {
            showLoginBtn.textContent = 'Connectez-vous';
            showLoginBtn.classList.remove('btn-primary');
            showLoginBtn.classList.add('btn-outline');
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        
        const inputs = e.target.querySelectorAll('input');
        const identifier = inputs[0].value.trim(); // pseudo ou email
        const password = inputs[1].value;

        if (!identifier || !password) {
            showNotification('Veuillez remplir tous les champs.', 'info');
            return;
        }

        const users = getUsers();
        if (!users.length) {
            showNotification('Aucun compte trouvé. Inscris-toi d\'abord.', 'info');
            showRegister();
            return;
        }

        const normalizedIdentifier = identifier.toLowerCase();
        const matchedUser = users.find(user =>
            (user.pseudo || '').toLowerCase() === normalizedIdentifier ||
            (user.email || '').toLowerCase() === normalizedIdentifier
        );

        if (matchedUser && !matchedUser.password) {
            matchedUser.password = password;
            persistUsers(users);
            setCurrentUser(matchedUser);
            showNotification('Compte mis a jour. Connexion reussie !', 'success');

            setTimeout(() => {
                window.location.href = ACCOUNT_PAGE;
            }, 500);
            return;
        }

        if (matchedUser && matchedUser.password === password) {
            setCurrentUser(matchedUser);
            showNotification('Connexion réussie !', 'success');

            setTimeout(() => {
                window.location.href = ACCOUNT_PAGE;
            }, 500);
        } else {
            showNotification('Identifiant ou mot de passe incorrect.', 'info');
        }
    }

    function handleRegister(e) {
        e.preventDefault();
        
        const pseudoInput = e.target.querySelector('input[placeholder="Votre pseudo"]');
        const emailInput = e.target.querySelector('input[type="email"]');
        const passwordInput = e.target.querySelector('input[type="password"]');
        const roleRadio = e.target.querySelector('input[name="role"]:checked');
        const pseudo = pseudoInput ? pseudoInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        const role = roleRadio ? roleRadio.value : 'eleve';
        const password = passwordInput ? passwordInput.value : '';

        if (!pseudo || !email || !password) {
            showNotification('Veuillez remplir tous les champs.', 'info');
            return;
        }

        if (password.length < 6) {
            showNotification('Le mot de passe doit contenir au moins 6 caractères.', 'info');
            return;
        }

        const users = getUsers();
        const pseudoExists = users.some(user => (user.pseudo || '').toLowerCase() === pseudo.toLowerCase());
        const emailExists = users.some(user => (user.email || '').toLowerCase() === email);
        const existingUserIndex = users.findIndex(user =>
            (user.pseudo || '').toLowerCase() === pseudo.toLowerCase() ||
            (user.email || '').toLowerCase() === email
        );

        if (pseudoExists || emailExists) {
            if (existingUserIndex !== -1 && !users[existingUserIndex].password) {
                users[existingUserIndex] = {
                    ...users[existingUserIndex],
                    name: pseudo,
                    pseudo: pseudo,
                    email: email,
                    role: role,
                    password: password,
                    avatarUrl: users[existingUserIndex].avatarUrl || pickRandomAvatarUrl(),
                    createdAt: users[existingUserIndex].createdAt || new Date().toISOString()
                };

                persistUsers(users);
                setCurrentUser(users[existingUserIndex]);
                showNotification('Compte finalise ! Bienvenue !', 'success');

                setTimeout(() => {
                    window.location.href = ACCOUNT_PAGE;
                }, 500);
                return;
            }

            showNotification('Ce pseudo ou cet email est déjà utilisé.', 'info');
            return;
        }

        // Créer l'objet utilisateur
        const userData = {
            id: Date.now(),
            name: pseudo,
            pseudo: pseudo,
            email: email,
            role: role,
            password: password,
            avatarUrl: pickRandomAvatarUrl(),
            medals: [], // Aucune médaille au début
            createdAt: new Date().toISOString()
        };

        // Sauvegarder dans localStorage
        users.push(userData);
        persistUsers(users);
        setCurrentUser(userData);

        // Animation de succès
        showNotification('Inscription réussie ! Bienvenue !', 'success');

        setTimeout(() => {
            window.location.href = ACCOUNT_PAGE;
        }, 500);
    }

    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem('userData');
        showNotification('Déconnexion réussie', 'info');
        setTimeout(() => {
            window.location.href = AUTH_PAGE + '?mode=login';
        }, 500);
    }

    function getStoredUserData() {
        const currentUserRaw = localStorage.getItem(CURRENT_USER_KEY);
        if (currentUserRaw) {
            try {
                const currentUser = JSON.parse(currentUserRaw);
                if (currentUser && typeof currentUser === 'object') {
                    return currentUser;
                }
            } catch (error) {
                // Ignore malformed legacy values.
            }
        }

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            return null;
        }

        // Compatibilité avec l'ancien format userData.
        try {
            const raw = localStorage.getItem('userData');
            if (!raw) {
                return null;
            }

            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') {
                return null;
            }

            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(parsed));
            return parsed;
        } catch (error) {
            return null;
        }
    }

    function getUsers() {
        const rawUsers = localStorage.getItem(USERS_KEY);
        if (rawUsers) {
            try {
                const parsedUsers = JSON.parse(rawUsers);
                if (Array.isArray(parsedUsers)) {
                    return parsedUsers;
                }
            } catch (error) {
                // Ignore malformed users key and fallback to legacy format.
            }
        }

        // Migration depuis l'ancien stockage userData.
        try {
            const legacyRaw = localStorage.getItem('userData');
            if (!legacyRaw) {
                return [];
            }

            const legacyUser = JSON.parse(legacyRaw);
            if (!legacyUser || typeof legacyUser !== 'object') {
                return [];
            }

            const migratedUser = {
                id: legacyUser.id || Date.now(),
                name: legacyUser.name || legacyUser.pseudo || '',
                pseudo: legacyUser.pseudo || '',
                email: (legacyUser.email || '').toLowerCase(),
                role: legacyUser.role || 'eleve',
                password: legacyUser.password || '',
                avatarUrl: legacyUser.avatarUrl || '',
                medals: Array.isArray(legacyUser.medals) ? legacyUser.medals : [],
                createdAt: legacyUser.createdAt || new Date().toISOString()
            };

            persistUsers([migratedUser]);
            return [migratedUser];
        } catch (error) {
            return [];
        }
    }

    function persistUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function setCurrentUser(user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        localStorage.setItem('userData', JSON.stringify(user));
    }

    function pickRandomAvatarUrl() {
        const index = Math.floor(Math.random() * DEFAULT_AVATAR_POOL.length);
        return DEFAULT_AVATAR_POOL[index];
    }

    function ensureUserHasAvatar(userData) {
        if (!userData || typeof userData !== 'object') {
            return userData;
        }

        if (typeof userData.avatarUrl === 'string' && userData.avatarUrl.trim()) {
            return userData;
        }

        const updatedUser = {
            ...userData,
            avatarUrl: pickRandomAvatarUrl()
        };

        setCurrentUser(updatedUser);

        const users = getUsers();
        const userIndex = users.findIndex(user =>
            (user.id && user.id === updatedUser.id) ||
            ((user.email || '').toLowerCase() === (updatedUser.email || '').toLowerCase())
        );
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                avatarUrl: updatedUser.avatarUrl
            };
            persistUsers(users);
        }

        return updatedUser;
    }

    function renderProfileAvatar(userData) {
        const avatarCircle = document.querySelector('.avatar-circle');
        if (!avatarCircle) {
            return;
        }

        const avatarUrl = typeof userData.avatarUrl === 'string' ? userData.avatarUrl.trim() : '';
        const icon = avatarCircle.querySelector('svg');
        let image = avatarCircle.querySelector('.profile-avatar-img');

        if (!avatarUrl) {
            if (image) {
                image.remove();
            }
            if (icon) {
                icon.style.display = 'block';
            }
            return;
        }

        if (!image) {
            image = document.createElement('img');
            image.className = 'profile-avatar-img';
            image.alt = 'Avatar utilisateur';
            avatarCircle.appendChild(image);
        }

        image.src = avatarUrl;
        if (icon) {
            icon.style.display = 'none';
        }
    }

    function updateMedals(unlockedMedals) {
        const medalItems = document.querySelectorAll('.medal-item');
        
        medalItems.forEach((item, index) => {
            if (unlockedMedals.includes(index)) {
                item.classList.add('unlocked');
                item.title = 'Médaille débloquée !';
            } else {
                item.classList.remove('unlocked');
                item.title = 'Médaille verrouillée - Jouez pour la débloquer';
            }
        });
    }

    function showNotification(message, type = 'info') {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles de la notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: ${type === 'success' ? '#10b981' : '#6366f1'};
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Disparition automatique
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Exposer la fonction unlockMedal pour les jeux
    window.unlockMedal = function(medalIndex) {
        const userData = getStoredUserData();
        if (!userData) {
            return false;
        }

        if (!Array.isArray(userData.medals)) userData.medals = [];
        
        if (!userData.medals.includes(medalIndex)) {
            userData.medals.push(medalIndex);
            setCurrentUser(userData);

            const users = getUsers();
            const userIndex = users.findIndex(user =>
                (user.id && user.id === userData.id) ||
                ((user.email || '').toLowerCase() === (userData.email || '').toLowerCase())
            );

            if (userIndex !== -1) {
                users[userIndex] = userData;
                persistUsers(users);
            }
            
            // Si on est sur la page account, mettre à jour l'affichage
            if (document.querySelector('.account-page')) {
                updateMedals(userData.medals);
            }
            
            showNotification('Nouvelle médaille débloquée ! 🏆', 'success');
            return true;
        }
        return false;
    };
});

