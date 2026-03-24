/**
 * chatbot.js — BrainHack Chatbot
 * Chatbot 100% front-end, sans API externe. Système de mots-clés.
 */
(function () {
    // ──────────────────────────────────────────────────────────────────
    //  ÉTAGES DE LOGIQUE & ÉTATS
    // ──────────────────────────────────────────────────────────────────
    let isSoundEnabled = false;
    let isWaitingForQuizAnswer = false;
    let recognition = null;

    // ──────────────────────────────────────────────────────────────────
    //  BASE DE CONNAISSANCES (mots-clés → réponses)
    // ──────────────────────────────────────────────────────────────────
    const RULES = [
        {
            keywords: ['bonjour', 'salut', 'coucou', 'hello', 'bonsoir'],
            responses: [
                "Bonjour ! Prêt à hacker ton cerveau aujourd'hui ? 🧠",
                "Salut ! Je suis BrainBot, ton assistant. Comment puis-je t'aider ?",
                "Coucou ! Bienvenue sur BrainHack 👋"
            ]
        },
        {
            keywords: ['score', 'classement', 'points', 'xp', 'rang', 'profil', 'dashboard'],
            responses: ["Je t'y emmène immédiatement ! 📊"],
            action: { redirect: '/hackathon/HackAThon/frontend/html/compte.html', delay: 1500 }
        },
        {
            keywords: ['aide', 'comment', 'help', 'quoi', 'quoi faire'],
            responses: [
                "Je suis là pour t'aider à naviguer sur BrainHack. Que cherches-tu ?",
                "Tu peux me poser des questions sur les mini-jeux, les articles, ou ton compte !",
                "Essaie des mots comme 'mini-jeux', 'articles', 'avatar', ou 'score' 😉"
            ]
        },
        {
            keywords: ['jeu', 'mini-jeu', 'game', 'jouer', 'jeux', 'joue', 'jouer'],
            responses: ["Je t'y emmène immédiatement ! 🎮 Accroche-toi, les mini-jeux arrivent !"],
            action: { redirect: '/hackathon/HackAThon/frontend/html/games.html', delay: 1500 }
        },
        {
            keywords: ['article', 'lire', 'contenu', 'apprendre'],
            responses: [
                "Les articles sont disponibles depuis la page d'accueil. Chaque article lu compte pour ta progression ! 📖",
                "Lis les articles pour débloquer ta certification BrainHack !",
                "La connaissance, c'est le vrai pouvoir 🧠 Retrouve tous les articles sur l'accueil."
            ]
        },
        {
            keywords: ['avatar', 'photo', 'profil', 'image'],
            responses: [
                "Tu peux changer ton avatar depuis la page 'Mon Compte' !",
                "Choisis parmi nos avatars colorés dans la page de profil 🎨",
                "Va dans 'Mon Compte' → 'Changer d'avatar' pour personnaliser ton look !"
            ]
        },
        {
            keywords: ['inscription', 'créer', 'compte', "s'inscrire", 'rejoindre'],
            responses: [
                "Pour créer un compte, clique sur 'S'inscrire' dans le menu ! C'est rapide ⚡",
                "L'inscription est gratuite et te donne accès à tous les mini-jeux et articles."
            ]
        },
        {
            keywords: ['connexion', 'login', 'se connecter', 'mot de passe'],
            responses: [
                "Clique sur 'Connexion' dans le menu pour accéder à ton compte.",
                "Si tu as oublié ton mot de passe, utilise le lien 'Mot de passe oublié ?' sur la page de connexion."
            ]
        },
        {
            keywords: ['ia', 'intelligence artificielle', 'fake', 'deepfake', 'vérifier'],
            responses: [
                "Le Vérificateur d'IA te permet d'analyser du texte, des images, vidéos ou sons pour détecter les fakes ! 🔍",
                "Tu veux apprendre à détecter les fake news et deepfakes ? Nos articles et jeux sont fait pour ça !",
                "L'IA peut créer du contenu trompeur. BrainHack t'apprend à les détecter !"
            ]
        },
        {
            keywords: ['certification', 'diplôme', 'badge'],
            responses: [
                "La certification BrainHack se débloque quand tu as lu tous les articles obligatoires !",
                "Lis 100% des articles requis pour obtenir ton badge de certification 🏆",
                "Ta certif est visible sur la page 'Mon Compte' une fois débloquée."
            ]
        },
        {
            keywords: ['merci', 'super', 'cool', 'génial', 'parfait', 'top'],
            responses: [
                "Avec plaisir ! 😊 N'hésite pas si tu as d'autres questions.",
                "De rien ! Bonne session de cerveau-hacking ! 🚀",
                "Cool ! Je suis là si tu as besoin d'autre chose 👌"
            ]
        },
        {
            keywords: ['professeur', 'prof', 'enseignant', 'classe'],
            responses: [
                "Le dashboard enseignant permet aux profs de gérer les élèves et les classes.",
                "Les professeurs accèdent à leur espace dédié après connexion avec un compte prof.",
                "Tu es prof ? Connecte-toi et accède à ton dashboard d'administration !"
            ]
        },
        {
            keywords: ['au revoir', 'bye', 'à bientôt', 'tchao', 'bonne journée'],
            responses: [
                "À bientôt ! Continue à entraîner ton cerveau 🧠💪",
                "Au revoir ! Reviens vite hackeur de cerveaux ! 👋",
                "Bonne journée ! N'oublie pas de lire tes articles 😄"
            ]
        },
        // Easter Egg
        {
            keywords: ['brainhack42'], // Exact match for the easter egg
            responses: ["Bienvenue dans la Matrice, Neo. 🕶️"],
            action: { easterEgg: 'matrix' } // Custom action type
        },
        // Niveau 4 : Quiz (Flash Challenge)
        {
            keywords: ['defi', 'quiz', 'jeu', 'question'],
            responses: ["Vrai ou Faux : Un Deepfake est toujours facile à repérer à l'œil nu ? 🤔"],
            action: { type: 'quiz' }
        }
    ];

    const DEFAULT_RESPONSES = [
        "Hum, je ne suis qu'un bot basique... Je n'ai pas compris. Essaie des mots simples comme 'aide', 'score', ou 'bonjour' !",
        "Je ne connais pas encore ce sujet 🤔 Essaie : mini-jeux, articles, avatar, score ou certification.",
        "Oops ! Ce mot m'échappe. Demande-moi de l'aide avec 'aide' ou 'comment' 😅"
    ];

    // CSS additionnel : Quick Replies + Mode Matrix
    const EXTRA_CSS = `
        .chatbot-quick-replies {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            margin-top: 8px;
            animation: chatFadeIn 0.3s ease;
        }
        .chatbot-quick-btn {
            background: transparent;
            border: 1.5px solid #6366f1;
            color: #6366f1;
            border-radius: 20px;
            padding: 5px 13px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            white-space: nowrap;
        }
        .chatbot-quick-btn:hover {
            background: #6366f1;
            color: white;
        }

        #chatbot-header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #chatbot-toggle-sound {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        #chatbot-toggle-sound:hover {
            background: rgba(255,255,255,0.35);
        }

        #chatbot-mic-btn {
            background: #f0f4ff;
            border: none;
            color: #6366f1;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            transition: all 0.2s;
            flex-shrink: 0;
            margin-right: 5px;
        }

        #chatbot-mic-btn.active {
            background: #ef4444;
            color: white;
            animation: chatbotPulseMic 1.5s infinite;
        }

        @keyframes chatbotPulseMic {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        /* Mode Matrix Easter Egg */
        #chatbot-window.matrix-mode { background: #000 !important; }
        #chatbot-window.matrix-mode #chatbot-messages { background: #000 !important; }
        #chatbot-window.matrix-mode #chatbot-input-area { background: #001a00 !important; border-top-color: #00ff41 !important; }
        #chatbot-window.matrix-mode #chatbot-input { background: #001a00 !important; color: #00ff41 !important; border-color: #00ff41 !important; font-family: monospace !important; }
        #chatbot-window.matrix-mode .chatbot-msg-bot { background: #001a00 !important; color: #00ff41 !important; border: 1px solid #00ff41 !important; box-shadow: 0 0 8px rgba(0,255,65,0.3) !important; font-family: monospace !important; }
        #chatbot-window.matrix-mode .chatbot-typing span { background: #00ff41 !important; }
        #chatbot-window.matrix-mode #chatbot-header { background: #001a00 !important; border-bottom: 1px solid #00ff41 !important; }
    `;

    // ──────────────────────────────────────────────────────────────────
    //  INJECTION DU HTML
    // ──────────────────────────────────────────────────────────────────
    const chatHTML = `
        <div id="brainhack-chatbot">
            <!-- Bulle flottante -->
            <button id="chatbot-toggle" aria-label="Ouvrir le chat" title="Assistant BrainHack">
                <span id="chatbot-toggle-icon">💬</span>
            </button>

            <!-- Fenêtre de chat -->
            <div id="chatbot-window" class="chatbot-closed">
                <div id="chatbot-header">
                    <div id="chatbot-header-info">
                        <span id="chatbot-avatar">🤖</span>
                        <div>
                            <strong>BrainBot</strong>
                            <small>Assistant BrainHack</small>
                        </div>
                    </div>
                    <div id="chatbot-header-actions">
                        <button id="chatbot-toggle-sound" title="Activer le son" aria-label="Toggle sound">🔇</button>
                        <button id="chatbot-close" aria-label="Fermer le chat">✕</button>
                    </div>
                </div>

                <div id="chatbot-messages" aria-live="polite">
                    <!-- Les messages s'injectent ici -->
                </div>

                <div id="chatbot-input-area">
                    <input
                        type="text"
                        id="chatbot-input"
                        placeholder="Écris ta question..."
                        maxlength="200"
                        autocomplete="off"
                    />
                    <button id="chatbot-mic-btn" title="Utiliser le micro" aria-label="Voice input">🎤</button>
                    <button id="chatbot-send" aria-label="Envoyer">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    // ──────────────────────────────────────────────────────────────────
    //  INJECTION DU CSS
    // ──────────────────────────────────────────────────────────────────
    const chatCSS = `
        #brainhack-chatbot {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            font-family: 'Segoe UI', system-ui, sans-serif;
        }

        #chatbot-toggle {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            color: white;
        }

        #chatbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 28px rgba(99, 102, 241, 0.65);
        }

        #chatbot-window {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 340px;
            max-height: 480px;
            background: #ffffff;
            border-radius: 18px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.18);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform-origin: bottom right;
        }

        #chatbot-window.chatbot-closed {
            opacity: 0;
            transform: scale(0.6);
            pointer-events: none;
        }

        #chatbot-window.chatbot-open {
            opacity: 1;
            transform: scale(1);
            pointer-events: all;
        }

        #chatbot-header {
            background: linear-gradient(135deg, #6366f1, #a855f7);
            padding: 14px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: white;
        }

        #chatbot-header-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        #chatbot-avatar {
            font-size: 1.6rem;
            line-height: 1;
        }

        #chatbot-header strong {
            display: block;
            font-size: 0.95rem;
        }

        #chatbot-header small {
            font-size: 0.72rem;
            opacity: 0.85;
        }

        #chatbot-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        #chatbot-close:hover {
            background: rgba(255,255,255,0.35);
        }

        #chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #f8f9ff;
            max-height: 310px;
        }

        #chatbot-messages::-webkit-scrollbar {
            width: 4px;
        }

        #chatbot-messages::-webkit-scrollbar-thumb {
            background: #c4b5fd;
            border-radius: 2px;
        }

        .chatbot-msg {
            max-width: 80%;
            padding: 10px 14px;
            border-radius: 18px;
            font-size: 0.87rem;
            line-height: 1.5;
            word-break: break-word;
            animation: chatFadeIn 0.25s ease;
        }

        @keyframes chatFadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .chatbot-msg-user {
            background: linear-gradient(135deg, #6366f1, #818cf8);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }

        .chatbot-msg-bot {
            background: white;
            color: #1e1b4b;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }

        .chatbot-typing {
            display: flex;
            gap: 5px;
            padding: 12px 16px;
            align-items: center;
        }

        .chatbot-typing span {
            width: 7px;
            height: 7px;
            background: #a855f7;
            border-radius: 50%;
            animation: chatTyping 1.2s infinite;
        }

        .chatbot-typing span:nth-child(2) { animation-delay: 0.2s; }
        .chatbot-typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes chatTyping {
            0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
            40%            { transform: scale(1.3); opacity: 1; }
        }

        #chatbot-input-area {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 14px;
            background: white;
            border-top: 1px solid #e8e8f0;
        }

        #chatbot-input {
            flex: 1;
            border: 1.5px solid #e0e0ef;
            border-radius: 24px;
            padding: 9px 16px;
            font-size: 0.87rem;
            outline: none;
            background: #f8f9ff;
            color: #1e1b4b;
            transition: border-color 0.2s;
        }

        #chatbot-input:focus {
            border-color: #6366f1;
            background: white;
        }

        #chatbot-send {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        #chatbot-send:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 12px rgba(99,102,241,0.4);
        }

        @media (max-width: 400px) {
            #chatbot-window { width: 300px; }
        }
    `;

    // ──────────────────────────────────────────────────────────────────
    //  LOGIQUE DU BOT
    // ──────────────────────────────────────────────────────────────────
    // Normalise : minuscules, sans accents, sans ponctuation
    function cleanText(str) {
        return str.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Retirer accents
            .replace(/[?!.,;:'"()\-]/g, ' ') // Retirer ponctuation
            .replace(/\s+/g, ' ')
            .trim();
    }

    function findRule(input) {
        const normalized = cleanText(input);
        for (const rule of RULES) {
            if (rule.keywords.some(kw => normalized.includes(cleanText(kw)))) {
                return rule;
            }
        }
        return null;
    }

    function findResponse(input) {
        const cleanInput = cleanText(input);

        // Quiz Logic State (Niveau 4)
        if (isWaitingForQuizAnswer) {
            isWaitingForQuizAnswer = false;
            if (cleanInput.includes('faux')) {
                return {
                    text: "Bravo ! Tu as raison. ✅ Un deepfake peut être très difficile à repérer, même pour un expert. Restons vigilants ! 👮‍♂️",
                    suggestions: ['🎮 Jouer', '🏆 Mon Score', '❓ Aide']
                };
            } else if (cleanInput.includes('vrai')) {
                return {
                    text: "Mauvaise réponse ! ❌ Les deepfakes modernes sont devenus extrêmement réalistes. Il ne faut jamais se fier uniquement à ses yeux ! 🕵️‍♂️",
                    suggestions: ['🎮 Jouer', '🏆 Mon Score', '❓ Aide']
                };
            } else {
                isWaitingForQuizAnswer = true;
                return { text: "Réponds par 'Vrai' ou 'Faux' ! 😉", suggestions: ['✅ Vrai', '❌ Faux'] };
            }
        }

        // Easter Egg : code secret exact
        if (cleanInput === 'brainhack42') {
            return {
                text: 'Bypass de securite reussi... Mode developpeur active ! 🕵️‍♂️',
                action: { easterEgg: 'matrix' }
            };
        }

        const rule = findRule(input);
        if (!rule) return { text: DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)], action: null };
        
        if (rule.action && rule.action.type === 'quiz') {
            isWaitingForQuizAnswer = true;
            return {
                text: rule.responses[Math.floor(Math.random() * rule.responses.length)],
                suggestions: ['✅ Vrai', '❌ Faux']
            };
        }

        return {
            text: rule.responses[Math.floor(Math.random() * rule.responses.length)],
            action: rule.action || null
        };
    }

    // Synthèse Vocale (Niveau 4)
    function speak(text) {
        if (!isSoundEnabled || !window.speechSynthesis) return;
        try {
            window.speechSynthesis.cancel(); // Stoppe la lecture en cours
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (e) { console.error("SpeechSynthesis error:", e); }
    }

    function addMessage(text, isUser, suggestions) {
        const msgArea = document.getElementById('chatbot-messages');
        // Supprimer les anciens quick-replies avant chaque nouveau message
        msgArea.querySelectorAll('.chatbot-quick-replies').forEach(el => el.remove());

        const div = document.createElement('div');
        div.className = 'chatbot-msg ' + (isUser ? 'chatbot-msg-user' : 'chatbot-msg-bot');
        div.textContent = text;
        msgArea.appendChild(div);

        // Quick Replies (suggestions)
        if (!isUser && Array.isArray(suggestions) && suggestions.length > 0) {
            const repliesEl = document.createElement('div');
            repliesEl.className = 'chatbot-quick-replies';
            suggestions.forEach(label => {
                const btn = document.createElement('button');
                btn.className = 'chatbot-quick-btn';
                btn.textContent = label;
                btn.addEventListener('click', () => {
                    repliesEl.remove();
                    const input = document.getElementById('chatbot-input');
                    input.value = label;
                    handleSend();
                });
                repliesEl.appendChild(btn);
            });
            msgArea.appendChild(repliesEl);
        }

        msgArea.scrollTop = msgArea.scrollHeight;
    }

    // Mode Matrix Easter Egg
    function activateMatrixMode() {
        const win = document.getElementById('chatbot-window');
        win.classList.add('matrix-mode');
        setTimeout(() => win.classList.remove('matrix-mode'), 10000);
    }

    function showTyping() {
        const msgArea = document.getElementById('chatbot-messages');
        const typing = document.createElement('div');
        typing.className = 'chatbot-msg chatbot-msg-bot chatbot-typing';
        typing.id = 'chatbot-typing-indicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        msgArea.appendChild(typing);
        msgArea.scrollTop = msgArea.scrollHeight;
    }

    function hideTyping() {
        const t = document.getElementById('chatbot-typing-indicator');
        if (t) t.remove();
    }

    function handleSend() {
        const input = document.getElementById('chatbot-input');
        const text = (input.value || '').trim();
        if (!text) return;
        input.value = '';

        addMessage(text, true);
        showTyping();

        setTimeout(() => {
            hideTyping();
            const result = findResponse(text);
            addMessage(result.text, false, result.suggestions);

            // Synthèse vocale si activée et pas de mode Matrix (Niveau 4)
            if (!result.action || result.action.easterEgg !== 'matrix') {
                speak(result.text);
            }

            if (result.action && result.action.redirect) {
                setTimeout(() => {
                    window.location.href = result.action.redirect;
                }, result.action.delay || 1500);
            }
            if (result.action && result.action.easterEgg === 'matrix') {
                activateMatrixMode();
            }
        }, 500 + Math.random() * 300);
    }

    // ──────────────────────────────────────────────────────────────────
    //  INIT
    // ──────────────────────────────────────────────────────────────────
    function init() {
        // Injecter le CSS
        const styleEl = document.createElement('style');
        styleEl.textContent = chatCSS;
        document.head.appendChild(styleEl);

        // Injecter le HTML
        const wrapper = document.createElement('div');
        wrapper.innerHTML = chatHTML.trim();
        document.body.appendChild(wrapper.firstChild);

        // Injecter CSS additionnel (quick replies + matrix)
        const extraStyleEl = document.createElement('style');
        extraStyleEl.textContent = EXTRA_CSS;
        document.head.appendChild(extraStyleEl);

        // Message de bienvenue avec Context Awareness
        setTimeout(() => {
            let pseudo = null;
            try {
                const raw = localStorage.getItem('currentUser') || localStorage.getItem('userData');
                if (raw) {
                    const user = JSON.parse(raw);
                    pseudo = user.pseudo || user.name || null;
                }
            } catch (_) {}

            const path = window.location.pathname;
            let welcome, suggestions;

            if (path.includes('dashboard_prof')) {
                welcome = 'Bonjour Professeur ! 🏫 Que souhaitez-vous gérer aujourd\'hui ?';
                suggestions = ['📊 Leaderboard', '🙋 Gérer les élèves', '❓ Aide'];
            } else if (path.includes('games')) {
                welcome = 'Prêt à faire fumer tes neurones ? 💥🧠 Bonne chance sur ce jeu !';
                suggestions = ['🏆 Mon Score', '❓ Aide', '📚 Articles'];
            } else {
                welcome = pseudo
                    ? `Salut ${pseudo} ! 👋 Prêt à déjouer les IA aujourd'hui ?`
                    : "Salut ! Moi c'est BrainBot 🤖 Que puis-je faire pour toi ?";
                suggestions = ['🎮 Jouer', '🏆 Mon Score', '❓ Aide'];
            }

            addMessage(welcome, false, suggestions);
        }, 800);

        // Events
        document.getElementById('chatbot-toggle').addEventListener('click', () => {
            const win = document.getElementById('chatbot-window');
            const isOpen = win.classList.contains('chatbot-open');
            win.classList.toggle('chatbot-open', !isOpen);
            win.classList.toggle('chatbot-closed', isOpen);
            document.getElementById('chatbot-toggle-icon').textContent = isOpen ? '💬' : '✕';
            if (!isOpen) document.getElementById('chatbot-input').focus();
        });

        document.getElementById('chatbot-close').addEventListener('click', () => {
            const win = document.getElementById('chatbot-window');
            win.classList.remove('chatbot-open');
            win.classList.add('chatbot-closed');
            document.getElementById('chatbot-toggle-icon').textContent = '💬';
        });

        document.getElementById('chatbot-send').addEventListener('click', handleSend);

        // Toggle Son (Niveau 4)
        document.getElementById('chatbot-toggle-sound').addEventListener('click', function() {
            isSoundEnabled = !isSoundEnabled;
            this.textContent = isSoundEnabled ? '🔊' : '🔇';
            this.title = isSoundEnabled ? 'Désactiver le son' : 'Activer le son';
        });

        // Reconnaissance Vocale (Niveau 4)
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const micBtn = document.getElementById('chatbot-mic-btn');
        const input = document.getElementById('chatbot-input');

        if (SpeechRecognition && micBtn) {
            recognition = new SpeechRecognition();
            recognition.lang = 'fr-FR';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                micBtn.classList.add('active');
            };

            recognition.onend = () => {
                micBtn.classList.remove('active');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                input.value = transcript;
                handleSend();
            };

            recognition.onerror = () => {
                micBtn.classList.remove('active');
            };

            micBtn.addEventListener('click', () => {
                try {
                    recognition.start();
                } catch (e) { recognition.stop(); }
            });
        } else if (micBtn) {
            micBtn.style.display = 'none'; // Pas supporté par le navigateur
        }

        document.getElementById('chatbot-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
