// JavaScript spécifique aux mini-jeux

document.addEventListener('DOMContentLoaded', function() {
    
    // === JEU 1 : QUIZ IMAGES ===
    const quizBtns = document.querySelectorAll('.quiz-btn');
    const timerDisplay = document.querySelector('.timer');
    let timeLeft = 30;
    let timerInterval;
    
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerDisplay) {
                timerDisplay.textContent = timeLeft;
                timerDisplay.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    timerDisplay.style.transform = 'scale(1)';
                }, 200);
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showResult('Temps écoulé !');
            }
        }, 1000);
    }
    
    // Démarrer le timer au chargement
    setTimeout(startTimer, 1000);
    
    quizBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            clearInterval(timerInterval);
            const isAI = this.classList.contains('btn-ai');
            // Simulation de réponse (à remplacer par la vraie logique)
            showResult(isAI ? 'Bonne réponse !' : 'Mauvaise réponse...');
        });
    });
    
    function showResult(message) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        
        overlay.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #6366f1, #a855f7);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                color: white;
                max-width: 300px;
                animation: popIn 0.3s ease;
            ">
                <h3 style="font-size: 1.5rem; margin-bottom: 15px;">${message}</h3>
                <button onclick="this.closest('.result-overlay').remove()" style="
                    background: white;
                    color: #6366f1;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 10px;
                ">Continuer</button>
            </div>
        `;
        
        overlay.className = 'result-overlay';
        document.body.appendChild(overlay);
    }
    
    // === JEU 2 : TIMELINE INTERACTIVE ===
    const timelinePoints = document.querySelectorAll('.timeline-point');
    
    const timelineData = {
        '1950': 'Test de Turing - Alan Turing propose le célèbre test pour évaluer l\'intelligence des machines.',
        '1960': 'Début de l\'IA symbolique - Les premiers programmes de résolution de problèmes.',
        '1970': 'Hiver de l\'IA - Premier ralentissement des investissements en IA.',
        '1980': 'Systèmes experts - L\'IA entre dans le monde industriel.',
        '1990': 'Machine Learning - L\'apprentissage automatique prend son essor.',
        '2000': 'Deep Learning - Les réseaux de neurones profonds révolutionnent le domaine.',
        '2020': 'IA Générative - ChatGPT, DALL-E et l\'explosion de l\'IA grand public.'
    };
    
    timelinePoints.forEach(point => {
        point.addEventListener('click', function() {
            const year = this.querySelector('.point-year').textContent;
            const info = timelineData[year];
            
            // Créer une popup d'information
            const popup = document.createElement('div');
            popup.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.95);
                color: #1e1b4b;
                padding: 20px;
                border-radius: 15px;
                max-width: 250px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 100;
                font-size: 0.9rem;
                line-height: 1.5;
                animation: fadeInUp 0.3s ease;
            `;
            popup.innerHTML = `
                <strong style="color: #6366f1; font-size: 1.2rem; display: block; margin-bottom: 10px;">${year}</strong>
                ${info}
                <button onclick="this.parentElement.remove()" style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #64748b;
                ">×</button>
            `;
            
            // Positionner la popup
            const rect = this.getBoundingClientRect();
            const containerRect = this.closest('.timeline-container').getBoundingClientRect();
            popup.style.left = (rect.left - containerRect.left - 100) + 'px';
            popup.style.top = (rect.top - containerRect.top - 120) + 'px';
            
            // Supprimer les popups existantes
            this.closest('.timeline-container').querySelectorAll('div[style*="position: absolute"]').forEach(p => p.remove());
            
            this.closest('.timeline-container').appendChild(popup);
        });
    });
    
    // === JEU 3 : BALL BLAST ===
    const balls = document.querySelectorAll('.ball');
    const scoreElement = document.querySelector('.score');
    let score = 1540;
    
    balls.forEach(ball => {
        ball.addEventListener('click', function() {
            // Animation d'explosion
            this.style.transform = 'scale(1.5)';
            this.style.opacity = '0';
            
            // Augmenter le score
            const points = Math.floor(Math.random() * 100) + 50;
            score += points;
            scoreElement.textContent = `Score: ${score}`;
            scoreElement.style.transform = 'scale(1.2)';
            scoreElement.style.color = '#4ade80';
            
            setTimeout(() => {
                scoreElement.style.transform = 'scale(1)';
                scoreElement.style.color = '#fbbf24';
            }, 200);
            
            // Réapparaître après un délai
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.opacity = '1';
                this.style.transition = 'all 0.5s ease';
            }, 1000);
            
            // Effet de particules (simplifié)
            createParticles(this);
        });
    });
    
    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: #fbbf24;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width/2}px;
                top: ${rect.top + rect.height/2}px;
            `;
            document.body.appendChild(particle);
            
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    // Pause button
    const pauseBtn = document.querySelector('.pause-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            const gameArea = document.querySelector('.game-area');
            const isPaused = gameArea.style.animationPlayState === 'paused';
            
            gameArea.style.animationPlayState = isPaused ? 'running' : 'paused';
            this.textContent = isPaused ? '❚❚' : '▶';
        });
    }
    
    console.log('🎮 Mini-jeux BrainHack chargés !');
});