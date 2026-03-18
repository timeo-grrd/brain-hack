// ============================================
// GESTION DES MINI-JEUX
// ============================================

// Données des jeux

// QUIZ DATA
const quizQuestions = [
    {
        question: "Qu'est-ce que l'intelligence artificielle ?",
        answers: [
            "Un programme informatique qui simule l'intelligence humaine",
            "Un robot physique",
            "Un langage de programmation",
            "Un type d'ordinateur"
        ],
        correct: 0
    },
    {
        question: "Quel est un exemple courant de désinformation ?",
        answers: [
            "Les informations vérifiées par les journalistes",
            "Les rumeurs sans fondement partagées en ligne",
            "Les livres scientifiques",
            "Les articles évalués par des pairs"
        ],
        correct: 1
    },
    {
        question: "Qu'est-ce qu'un deepfake ?",
        answers: [
            "Un type d'intelligence artificielle",
            "Une fausse identité en ligne",
            "Une vidéo ou image créée par IA pour imiter quelqu'un",
            "Un pirate informatique"
        ],
        correct: 2
    },
    {
        question: "Comment identifier une source fiable ?",
        answers: [
            "Si elle a beaucoup de partages",
            "Si elle est écrite en majuscules",
            "Si elle cite ses sources et auteurs",
            "Si elle contient des émoticônes"
        ],
        correct: 2
    },
    {
        question: "Qu'est-ce qu'une bulle informationnelle ?",
        answers: [
            "Un type de publicité",
            "Un filtre qui affiche surtout les informations alignées avec vos convictions",
            "Un bug internet",
            "Un réseau social"
        ],
        correct: 1
    }
];

// DETECTOR DATA
const detectStatements = [
    { statement: "L'eau bout à 100°C au niveau de la mer", correct: true },
    { statement: "Les humains n'utilisent que 10% de leur cerveau", correct: false },
    { statement: "Les virus informatiques sont créés par des hackers", correct: true },
    { statement: "Internet a été inventé en 2000", correct: false },
    { statement: "La Lune affecte les marées de la Terre", correct: true },
    { statement: "Les vaccins causent l'autisme", correct: false },
    { statement: "Python est un langage de programmation", correct: true },
    { statement: "Les humains ont marché sur Mars en 1969", correct: false }
];

// DEEPFAKE DATA (simulated with emojis)
const deepfakeImages = [
    { image: "👨‍💼", authentic: true, explanation: "Ceci est une vraie personne" },
    { image: "🤖", authentic: false, explanation: "Ceci a été généré par IA" },
    { image: "🎬", authentic: false, explanation: "Ceci est une manipulation vidéo" },
    { image: "📸", authentic: true, explanation: "Ceci est une photo authentique" },
    { image: "✨", authentic: false, explanation: "Ceci a été retouché numériquement" }
];

// === QUIZ GAME ===

let quizState = {
    current: 0,
    score: 0,
    answered: false,
    selectedAnswer: null
};

function startQuiz() {
    quizState = {
        current: 0,
        score: 0,
        answered: false,
        selectedAnswer: null
    };
    showQuizQuestion();
}

function showQuizQuestion() {
    const start = document.getElementById('quizStart');
    const question = document.getElementById('quizQuestion');
    const end = document.getElementById('quizEnd');

    if (start) start.style.display = 'none';
    if (end) end.style.display = 'none';
    if (question) question.style.display = 'block';

    const q = quizQuestions[quizState.current];
    if (!q) return;

    // Mettre à jour la barre de progression
    const progress = ((quizState.current + 1) / quizQuestions.length) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = progress + '%';

    // Afficher la question
    const questionText = document.getElementById('questionText');
    if (questionText) questionText.textContent = q.question;

    // Afficher les réponses
    const answersContainer = document.getElementById('answersContainer');
    if (answersContainer) {
        answersContainer.innerHTML = '';
        q.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.onclick = () => selectAnswer(index);
            answersContainer.appendChild(btn);
        });
    }

    // Cacher le résultat
    const result = document.getElementById('quizResult');
    if (result) result.style.display = 'none';

    quizState.answered = false;
    quizState.selectedAnswer = null;
}

function selectAnswer(index) {
    if (quizState.answered) return;

    const q = quizQuestions[quizState.current];
    quizState.selectedAnswer = index;
    quizState.answered = true;

    // Marquer le bouton comme sélectionné
    const buttons = document.querySelectorAll('.answer-btn');
    buttons[index].classList.add('selected');

    // Vérifier la réponse
    if (index === q.correct) {
        quizState.score++;
        showQuizResult('✓ Correct !', true);
    } else {
        showQuizResult('✗ Incorrect', false);
    }
}

function showQuizResult(text, isCorrect) {
    const result = document.getElementById('quizResult');
    const resultText = document.getElementById('resultText');

    if (result && resultText) {
        result.style.display = 'block';
        result.className = 'quiz-result ' + (isCorrect ? 'correct' : 'incorrect');
        resultText.innerHTML = `${text} <br><small>${isCorrect ? 'Bonne réponse !' : 'La bonne réponse était : ' + quizQuestions[quizState.current].answers[quizQuestions[quizState.current].correct]}</small>`;
    }
}

function nextQuestion() {
    quizState.current++;

    if (quizState.current < quizQuestions.length) {
        showQuizQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    const question = document.getElementById('quizQuestion');
    const end = document.getElementById('quizEnd');

    if (question) question.style.display = 'none';
    if (end) end.style.display = 'block';

    const finalScore = document.getElementById('finalScore');
    const percentage = Math.round((quizState.score / quizQuestions.length) * 100);

    if (finalScore) {
        finalScore.innerHTML = `
            <p>Vous avez obtenu : <strong>${quizState.score}/${quizQuestions.length}</strong></p>
            <p>Score : <strong>${percentage}%</strong></p>
        `;
    }

    // Mettre à jour les statistiques utilisateur
    if (window.currentUser) {
        updateUserStats('quiz', quizState.score, quizQuestions.length);
    }
}

function resetQuiz() {
    startQuiz();
}

// === DETECTOR GAME ===

let detectState = {
    current: 0,
    score: 0,
    answered: false
};

function startDetector() {
    detectState = {
        current: 0,
        score: 0,
        answered: false
    };
    showDetectStatement();
}

function showDetectStatement() {
    const start = document.getElementById('detectStart');
    const game = document.getElementById('detectGame');
    const end = document.getElementById('detectEnd');

    if (start) start.style.display = 'none';
    if (end) end.style.display = 'none';
    if (game) game.style.display = 'block';

    const statement = detectStatements[detectState.current];
    if (!statement) return;

    // Mettre à jour la barre de progression
    const progress = ((detectState.current + 1) / detectStatements.length) * 100;
    const progressFill = document.getElementById('detectProgressFill');
    if (progressFill) progressFill.style.width = progress + '%';

    // Afficher le statement
    const statementText = document.getElementById('statementText');
    if (statementText) statementText.textContent = statement.statement;

    // Cacher le résultat
    const result = document.getElementById('detectResult');
    if (result) result.style.display = 'none';

    detectState.answered = false;
}

function answerDetect(isTrue) {
    if (detectState.answered) return;

    const statement = detectStatements[detectState.current];
    detectState.answered = true;

    if (isTrue === statement.correct) {
        detectState.score++;
        showDetectResult('✓ Correct !', true, statement.correct);
    } else {
        showDetectResult('✗ Incorrect', false, statement.correct);
    }
}

function showDetectResult(text, isCorrect, correct) {
    const result = document.getElementById('detectResult');
    const feedback = document.getElementById('detectFeedback');

    if (result && feedback) {
        result.style.display = 'block';
        feedback.textContent = `${text} Cette affirmation est ${correct ? 'VRAIE' : 'FAUSSE'}`;
    }
}

function nextDetect() {
    detectState.current++;

    if (detectState.current < detectStatements.length) {
        showDetectStatement();
    } else {
        endDetector();
    }
}

function endDetector() {
    const game = document.getElementById('detectGame');
    const end = document.getElementById('detectEnd');

    if (game) game.style.display = 'none';
    if (end) end.style.display = 'block';

    const score = document.getElementById('detectScore');
    const percentage = Math.round((detectState.score / detectStatements.length) * 100);

    if (score) {
        score.innerHTML = `
            <p>Vous avez obtenu : <strong>${detectState.score}/${detectStatements.length}</strong></p>
            <p>Score : <strong>${percentage}%</strong></p>
        `;
    }

    // Mettre à jour les statistiques utilisateur
    if (window.currentUser) {
        updateUserStats('detecteur', detectState.score, detectStatements.length);
    }
}

function resetDetector() {
    startDetector();
}

// === DEEPFAKE GAME ===

let deepfakeState = {
    current: 0,
    score: 0,
    answered: false
};

function startDeepfake() {
    deepfakeState = {
        current: 0,
        score: 0,
        answered: false
    };
    showDeepfakeImage();
}

function showDeepfakeImage() {
    const start = document.getElementById('deepfakeStart');
    const game = document.getElementById('deepfakeGame');
    const end = document.getElementById('deepfakeEnd');

    if (start) start.style.display = 'none';
    if (end) end.style.display = 'none';
    if (game) game.style.display = 'block';

    const item = deepfakeImages[deepfakeState.current];
    if (!item) return;

    // Mettre à jour la barre de progression
    const progress = ((deepfakeState.current + 1) / deepfakeImages.length) * 100;
    const progressFill = document.getElementById('deepfakeProgressFill');
    if (progressFill) progressFill.style.width = progress + '%';

    // Afficher l'image
    const imageDisplay = document.getElementById('imageDisplay');
    if (imageDisplay) {
        imageDisplay.textContent = item.image;
        imageDisplay.style.fontSize = '6rem';
    }

    // Cacher le résultat
    const result = document.getElementById('deepfakeResult');
    if (result) result.style.display = 'none';

    deepfakeState.answered = false;
}

function answerDeepfake(isAuthentic) {
    if (deepfakeState.answered) return;

    const item = deepfakeImages[deepfakeState.current];
    deepfakeState.answered = true;

    if (isAuthentic === item.authentic) {
        deepfakeState.score++;
        showDeepfakeResult('✓ Correct !', true, item);
    } else {
        showDeepfakeResult('✗ Incorrect', false, item);
    }
}

function showDeepfakeResult(text, isCorrect, item) {
    const result = document.getElementById('deepfakeResult');
    const feedback = document.getElementById('deepfakeFeedback');

    if (result && feedback) {
        result.style.display = 'block';
        feedback.innerHTML = `${text} <br><small>${item.explanation}</small>`;
    }
}

function nextDeepfake() {
    deepfakeState.current++;

    if (deepfakeState.current < deepfakeImages.length) {
        showDeepfakeImage();
    } else {
        endDeepfake();
    }
}

function endDeepfake() {
    const game = document.getElementById('deepfakeGame');
    const end = document.getElementById('deepfakeEnd');

    if (game) game.style.display = 'none';
    if (end) end.style.display = 'block';

    const score = document.getElementById('deepfakeScore');
    const percentage = Math.round((deepfakeState.score / deepfakeImages.length) * 100);

    if (score) {
        score.innerHTML = `
            <p>Vous avez obtenu : <strong>${deepfakeState.score}/${deepfakeImages.length}</strong></p>
            <p>Score : <strong>${percentage}%</strong></p>
        `;
    }

    // Mettre à jour les statistiques utilisateur
    if (window.currentUser) {
        updateUserStats('deepfake', deepfakeState.score, deepfakeImages.length);
    }
}

function resetDeepfake() {
    startDeepfake();
}

// Export des fonctions
window.startQuiz = startQuiz;
window.nextQuestion = nextQuestion;
window.resetQuiz = resetQuiz;
window.startDetector = startDetector;
window.nextDetect = nextDetect;
window.resetDetector = resetDetector;
window.answerDetect = answerDetect;
window.startDeepfake = startDeepfake;
window.nextDeepfake = nextDeepfake;
window.resetDeepfake = resetDeepfake;
window.answerDeepfake = answerDeepfake;

document.addEventListener('DOMContentLoaded', function () {
    const realVsAiCard = document.getElementById('real-vs-ai-card');
    const aiHistoryCard = document.getElementById('ai-history-card');
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const realVsAiLocalUrl = 'http://localhost:8501';
    const realVsAiHostedUrl = 'https://brainhack-jeu.azurewebsites.net';
    const aiHistoryLocalUrl = 'http://localhost:8502';
    const aiHistoryHostedUrl = 'https://brainhack-quizhistoireia.azurewebsites.net';

    const realVsAiUrl = isLocalHost ? realVsAiLocalUrl : realVsAiHostedUrl;
    const aiHistoryUrl = isLocalHost ? aiHistoryLocalUrl : aiHistoryHostedUrl;

    const setupCardRedirect = function (cardElement, destinationUrl, options) {
        if (!cardElement) return;

        cardElement.style.cursor = 'pointer';
        cardElement.setAttribute('role', 'button');
        cardElement.setAttribute('tabindex', '0');

        const openPythonGame = function () {
            window.open(destinationUrl, '_blank', 'noopener,noreferrer');
        };

        cardElement.addEventListener('click', function (event) {
            if (options && options.ignoreButtonClicks && event.target.closest('button')) return;
            openPythonGame();
        });

        cardElement.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPythonGame();
            }
        });
    };

    setupCardRedirect(realVsAiCard, realVsAiUrl, { ignoreButtonClicks: true });
    setupCardRedirect(aiHistoryCard, aiHistoryUrl, { ignoreButtonClicks: false });
});