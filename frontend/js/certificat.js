document.addEventListener('DOMContentLoaded', function() {
    const CURRENT_USER_KEY = 'currentUser';
    const STUDENT_PROGRESS_KEY = 'brainhack_student_progress_v1';
    const TEACHER_CLASSES_KEY = 'brainhack_teacher_classes_v1';
    const CERTIFICATION_KEY = 'brainhack_certifications_v1';
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

    const formSection = document.getElementById('formulaire-section');
    const firstNameInput = document.getElementById('input-prenom');
    const lastNameInput = document.getElementById('input-nom');
    const nameOutput = document.getElementById('affichage-nom');
    const xpOutput = document.getElementById('affichage-xp');
    const certificateZone = document.getElementById('zone-certificat');
    const pdfButton = document.getElementById('bouton-pdf');
    const subtitle = document.querySelector('.certif-subtitle');
    const generateButton = document.querySelector('#formulaire-section .btn.btn-primary');

    const user = getCurrentUser();
    const progress = getProgressForUser(user);
    const certificationRequiredIds = getCertificationRequiredArticleIds(user);
    const completion = computeCompletion(progress, certificationRequiredIds);
    const points = Number(progress.totalPoints || 0);

    const fullName = getDisplayName(user);
    const splitName = splitDisplayName(fullName);

    if (firstNameInput) {
        firstNameInput.value = splitName.firstName;
    }
    if (lastNameInput) {
        lastNameInput.value = splitName.lastName;
    }

    if (completion >= 100) {
        if (subtitle) {
            subtitle.textContent = 'Certification debloquee: ton nom est rempli automatiquement.';
        }
        preparerDiplome(true);
    } else {
        if (subtitle) {
            subtitle.textContent = 'Cette certification se debloque automatiquement a 100% des articles obligatoires.';
        }
        if (generateButton) {
            generateButton.disabled = true;
            generateButton.title = 'Atteins 100% sur ton tableau de bord pour debloquer la certification.';
        }
        if (pdfButton) {
            pdfButton.style.display = 'none';
        }
        if (certificateZone) {
            certificateZone.style.display = 'none';
        }
    }

    function getCurrentUser() {
        try {
            const raw = localStorage.getItem(CURRENT_USER_KEY);
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : null;
        } catch (error) {
            return null;
        }
    }

    function getProgressForUser(userData) {
        if (!userData) {
            return {};
        }

        try {
            const raw = localStorage.getItem(STUDENT_PROGRESS_KEY);
            if (!raw) {
                return {};
            }
            const map = JSON.parse(raw);
            if (!map || typeof map !== 'object') {
                return {};
            }

            const key = getProgressUserKey(userData);
            if (!key || !map[key] || typeof map[key] !== 'object') {
                return {};
            }

            return map[key];
        } catch (error) {
            return {};
        }
    }

    function getProgressUserKey(userData) {
        if (!userData || typeof userData !== 'object') {
            return null;
        }

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

    function computeCompletion(progressData, requiredArticleIds) {
        const articlesRead = Array.isArray(progressData.articlesRead) ? progressData.articlesRead : [];
        const normalizedReadSet = new Set(articlesRead.map(normalizeArticleId).filter(Boolean));
        const targetIds = Array.isArray(requiredArticleIds) && requiredArticleIds.length
            ? requiredArticleIds
            : [...KNOWN_ARTICLES];
        const readCount = targetIds.filter(articleId => normalizedReadSet.has(articleId)).length;
        return Math.round((readCount / targetIds.length) * 100);
    }

    function getCertificationRequiredArticleIds(userData) {
        const userKey = getProgressUserKey(userData);
        if (!userKey) {
            return [...KNOWN_ARTICLES];
        }

        try {
            const raw = localStorage.getItem(TEACHER_CLASSES_KEY);
            const map = raw ? JSON.parse(raw) : {};
            if (!map || typeof map !== 'object') {
                return [...KNOWN_ARTICLES];
            }

            for (const teacherState of Object.values(map)) {
                if (!teacherState || !Array.isArray(teacherState.classes)) {
                    continue;
                }

                const matchingClass = teacherState.classes.find(cls =>
                    Array.isArray(cls.students) && cls.students.includes(userKey)
                );

                if (!matchingClass) {
                    continue;
                }

                const required = Array.isArray(matchingClass.certificationRequirements?.requiredArticleIds)
                    ? matchingClass.certificationRequirements.requiredArticleIds
                    : [];

                const normalized = Array.from(new Set(
                    required.map(normalizeArticleId).filter(articleId => KNOWN_ARTICLES.includes(articleId))
                ));

                return normalized.length ? normalized : [...KNOWN_ARTICLES];
            }
        } catch (error) {
            return [...KNOWN_ARTICLES];
        }

        return [...KNOWN_ARTICLES];
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

    function getDisplayName(userData) {
        if (!userData) {
            return 'Eleve';
        }

        return (
            userData.name ||
            userData.pseudo ||
            userData.email ||
            'Eleve'
        );
    }

    function splitDisplayName(displayName) {
        const clean = String(displayName || '').trim();
        if (!clean) {
            return { firstName: '', lastName: '' };
        }

        const parts = clean.split(/\s+/);
        if (parts.length === 1) {
            return { firstName: parts[0], lastName: '' };
        }

        return {
            firstName: parts[0],
            lastName: parts.slice(1).join(' ')
        };
    }

    function buildCertificateName() {
        const firstName = (firstNameInput?.value || '').trim();
        const lastName = (lastNameInput?.value || '').trim();
        const assembled = `${firstName} ${lastName}`.trim();
        return assembled || getDisplayName(user);
    }

    function saveCertificationSnapshot(certificateName) {
        const userKey = getProgressUserKey(user);
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

        map[userKey] = {
            unlocked: completion >= 100,
            completion,
            totalPoints: points,
            displayName: certificateName,
            generatedAt: new Date().toISOString()
        };

        localStorage.setItem(CERTIFICATION_KEY, JSON.stringify(map));
    }

    function preparerDiplome(forceAuto) {
        const firstName = (firstNameInput?.value || '').trim();
        const lastName = (lastNameInput?.value || '').trim();

        if (!forceAuto && (!firstName || !lastName)) {
            alert('Renseigne ton prenom et ton nom.');
            return;
        }

        const certificateName = buildCertificateName();
        if (nameOutput) {
            nameOutput.textContent = certificateName.toUpperCase();
        }
        if (xpOutput) {
            xpOutput.textContent = String(points);
        }

        if (formSection) {
            formSection.style.display = 'none';
        }
        if (certificateZone) {
            certificateZone.style.display = 'block';
        }
        if (pdfButton) {
            pdfButton.style.display = 'inline-flex';
        }

        saveCertificationSnapshot(certificateName);
    }

    async function telechargerPDF() {
        const certificateElement = document.getElementById('contenu-a-imprimer');
        if (!certificateElement) {
            return;
        }

        const filenameName = buildCertificateName()
            .replace(/\s+/g, '-')
            .replace(/[^A-Za-z0-9\-_]/g, '')
            .toLowerCase() || 'eleve';

        certificateElement.classList.add('export-pdf');
        try {
            const JsPdfCtor = window.jspdf?.jsPDF || window.jsPDF;
            if (typeof window.html2canvas === 'function' && JsPdfCtor) {
                const canvas = await window.html2canvas(certificateElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });

                const pdf = new JsPdfCtor({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4'
                });

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 5;
                const printableWidth = pageWidth - margin * 2;
                const printableHeight = pageHeight - margin * 2;

                let renderWidth = printableWidth;
                let renderHeight = (canvas.height * renderWidth) / canvas.width;

                if (renderHeight > printableHeight) {
                    renderHeight = printableHeight;
                    renderWidth = (canvas.width * renderHeight) / canvas.height;
                }

                const offsetX = (pageWidth - renderWidth) / 2;
                const offsetY = (pageHeight - renderHeight) / 2;
                const imageData = canvas.toDataURL('image/jpeg', 0.98);

                pdf.addImage(imageData, 'JPEG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');
                pdf.save(`certification-brainhack-${filenameName}.pdf`);
                return;
            }

            if (typeof window.html2pdf === 'function') {
                await window.html2pdf().set({
                    margin: [5, 5, 5, 5],
                    filename: `certification-brainhack-${filenameName}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: '#ffffff',
                        scrollX: 0,
                        scrollY: 0
                    },
                    pagebreak: { mode: ['css', 'legacy'] },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
                }).from(certificateElement).save();
                return;
            }

            alert('La generation PDF est indisponible pour le moment. Recharge la page et reessaie.');
        } finally {
            certificateElement.classList.remove('export-pdf');
        }
    }

    window.preparerDiplome = preparerDiplome;
    window.telechargerPDF = telechargerPDF;
});
