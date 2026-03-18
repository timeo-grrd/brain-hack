// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {

    function openIaArticleModal() {
        const existingModal = document.querySelector('.ia-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true" aria-labelledby="iaModalTitle">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <h2 id="iaModalTitle">C'est quoi l'IA ?</h2>
                    <p>
                        Tu entends ce mot 50 fois par jour : aux infos, au lycée, sur TikTok... "L'IA a fait ci", "L'IA va faire ça".
                        Mais si on te demande d'expliquer ce que c'est exactement à tes grands-parents, tu dis quoi ?
                        Un robot invisible ? Un super-cerveau dans le cloud ?
                    </p>
                    <p>
                        Brisons le mythe tout de suite : l'Intelligence Artificielle n'a rien d'intelligent au sens humain.
                        C'est un programme informatique géant, basé sur des mathématiques et des statistiques ultra-poussées.
                        Son but ? Imiter la façon dont les humains apprennent et résolvent des problèmes.
                    </p>
                </div>

                <div class="ia-modal-body">
                    <section class="ia-section">
                        <h3>1. Comment on "éduque" une IA (Le test du petit chat)</h3>
                        <p>
                            Pour comprendre l'IA, il faut comprendre comment on la programme. C'est ce qu'on appelle le Machine Learning
                            (l'apprentissage automatique).
                        </p>
                        <p>
                            Imaginons que tu veuilles apprendre à un ordinateur à reconnaître une photo de chat.
                        </p>
                        <div class="ia-note-grid">
                            <article class="ia-note ia-note-old">
                                <h4>La vieille méthode (sans IA)</h4>
                                <p>
                                    Le programmeur devait écrire des milliers de règles manuelles :
                                    "Un chat a deux oreilles pointues, des moustaches, une queue, des poils...".
                                    Le problème ? Si tu lui montres un chat sans poils (comme un Sphynx) ou une photo de chat de dos,
                                    l'ordinateur plante. Il ne reconnaît plus les règles.
                                </p>
                            </article>
                            <article class="ia-note ia-note-new">
                                <h4>La méthode IA (Machine Learning)</h4>
                                <p>
                                    Le programmeur ne donne aucune règle. Il se contente de montrer à l'ordinateur 10 millions de photos de chats
                                    et 10 millions de photos de chiens, en lui disant qui est qui. En analysant les pixels, l'ordinateur va finir
                                    par "deviner" tout seul les points communs mathématiques qui font qu'un chat est un chat.
                                    Il a appris par l'exemple.
                                </p>
                            </article>
                        </div>
                    </section>

                    <section class="ia-section">
                        <h3>2. Son carburant : tes données (la "Data")</h3>
                        <p>
                            L'IA est comme une voiture de course de Formule 1. Le moteur est surpuissant,
                            mais sans carburant, il ne sert à rien. Le carburant de l'IA, ce sont les données (textes, images, vidéos, musiques).
                        </p>
                        <p class="ia-highlight">
                            La stat vertigineuse : pour entraîner un modèle comme celui de ChatGPT, les ingénieurs lui ont fait "lire" quasiment tout ce
                            qui existe sur internet : des millions d'articles Wikipédia, des milliards de pages web, des livres numérisés...
                            Si tu devais lire tout ce que cette IA a ingurgité, il te faudrait plus de 20 000 ans
                            sans jamais dormir.
                        </p>
                        <p>
                            C'est pour ça que l'IA a soudainement explosé ces dernières années : parce qu'avec nos smartphones et internet,
                            on produit des milliards de données chaque jour pour la nourrir.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>3. Les deux grandes familles de l'IA</h3>
                        <div class="ia-table-wrap">
                            <table class="ia-table">
                                <thead>
                                    <tr>
                                        <th>Type d'IA</th>
                                        <th>Ce qu'elle fait</th>
                                        <th>Où tu la trouves</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>L'IA analytique (l'ancienne)</td>
                                        <td>Elle analyse des données pour faire des choix ou des recommandations.</td>
                                        <td>L'algorithme de TikTok, les recommandations Netflix, Google Maps, la reconnaissance faciale de ton téléphone.</td>
                                    </tr>
                                    <tr>
                                        <td>L'IA générative (la nouvelle star)</td>
                                        <td>Elle ne se contente plus d'analyser, elle crée de nouvelles choses (texte, image, son) à partir de ce qu'elle a appris.</td>
                                        <td>ChatGPT (texte), Midjourney (images), Suno (musique).</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section class="ia-section ia-summary">
                        <h3>En résumé</h3>
                        <p>
                            L'IA, ce n'est pas un cerveau magique. C'est un algorithme hyper-entraîné qui joue aux devinettes à la vitesse de la lumière.
                            Il ne comprend pas ce qu'est un chat ou ce qu'est la Révolution française, il sait juste comment ces concepts
                            sont représentés statistiquement dans sa base de données.
                        </p>
                    </section>
                </div>
            </div>
        `;

        let onEscape;
        const closeModal = function () {
            modalOverlay.remove();
            document.body.style.overflow = '';
            if (onEscape) {
                document.removeEventListener('keydown', onEscape);
            }
        };

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        onEscape = function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', onEscape);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
    }

    function openPhoneIntelligenceModal() {
        const existingModal = document.querySelector('.ia-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true" aria-labelledby="phoneModalTitle">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <h2 id="phoneModalTitle">Ton téléphone est-il plus intelligent que toi ?</h2>
                    <p>
                        Spoiler alert : non. Mais c'est vrai qu'il y a de quoi se poser la question.
                        Quand tu galères sur un problème de maths ou que tu cherches la capitale d'un pays obscur,
                        ton smartphone trouve la réponse en une fraction de seconde.
                    </p>
                    <p>
                        L'Intelligence Artificielle (IA) qui est dedans peut battre des champions d'échecs,
                        générer des images de toutes pièces et traduire des textes dans 100 langues différentes.
                        Alors, qui est le vrai boss ? Pour le savoir, faisons le match : Ton cerveau vs ton smartphone.
                    </p>
                </div>

                <div class="ia-modal-body">
                    <section class="ia-section">
                        <h3>Round 1 : La force de calcul (Avantage : Smartphone)</h3>
                        <p>
                            Si on parle uniquement de vitesse et de mémoire brute, la machine gagne haut la main.
                            Ton téléphone ne ressent pas la fatigue, ne fait pas d'erreurs d'étourderie et n'oublie rien.
                        </p>
                        <p class="ia-highlight">
                            La stat qui tue : le processeur d'un smartphone ultra-récent est capable de réaliser plus de
                            35 billions (35 000 milliards) d'opérations par seconde juste pour faire tourner l'IA.
                        </p>
                        <p>
                            La mémoire : ton téléphone peut stocker des millions de pages Wikipédia qu'il peut te recracher au mot près.
                            Ton cerveau, lui, a parfois du mal à se souvenir de ce que tu as mangé mardi midi.
                        </p>
                        <p>
                            L'IA excelle dans le traitement de données : elle repère des modèles mathématiques ultra-rapidement.
                            Mais attention, elle ne comprend pas ce qu'elle lit ou calcule : elle fait surtout des statistiques
                            à la vitesse de la lumière.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>Round 2 : La vraie intelligence (Avantage : Toi)</h3>
                        <p>
                            L'intelligence, ce n'est pas juste du calcul mental rapide. C'est l'adaptabilité,
                            la créativité, le bon sens et l'empathie. Et là, l'IA est complètement à la ramasse.
                        </p>
                        <div class="ia-note-grid">
                            <article class="ia-note ia-note-old">
                                <h4>Le bon sens</h4>
                                <p>
                                    Si tu vois un parapluie ouvert dans un salon, tu trouves ça bizarre.
                                    Une IA ne connaît pas le monde réel : elle ne sait pas ce qu'est la pluie
                                    ou le fait d'être mouillé.
                                </p>
                            </article>
                            <article class="ia-note ia-note-new">
                                <h4>L'énergie (le vrai miracle)</h4>
                                <p>
                                    Ton cerveau contient environ 86 milliards de neurones et consomme environ 20 Watts
                                    (l'équivalent d'une petite ampoule LED) pour réfléchir, rêver et faire battre ton coeur.
                                </p>
                            </article>
                        </div>
                        <p class="ia-highlight">
                            Le gouffre de l'IA : pour entraîner un gros modèle comme ChatGPT,
                            il faut des milliers d'ordinateurs géants qui consomment autant d'électricité
                            qu'une petite ville entière.
                        </p>
                        <p>
                            À retenir : l'IA est un perroquet savant. Elle prédit le mot qui a le plus de probabilité d'arriver après un autre.
                            Elle n'a pas de conscience, pas d'émotions et aucune vraie créativité qui ne soit pas copiée
                            sur des données humaines.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>Le bilan du match</h3>
                        <div class="ia-table-wrap">
                            <table class="ia-table">
                                <thead>
                                    <tr>
                                        <th>Capacité</th>
                                        <th>Ton cerveau (humain)</th>
                                        <th>Ton smartphone (IA)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Vitesse de calcul pur</td>
                                        <td>Lente</td>
                                        <td>Ultra-rapide</td>
                                    </tr>
                                    <tr>
                                        <td>Apprentissage</td>
                                        <td>Quelques exemples suffisent</td>
                                        <td>A besoin de millions de données</td>
                                    </tr>
                                    <tr>
                                        <td>Créativité et bon sens</td>
                                        <td>Élevée (tu inventes, tu ressens)</td>
                                        <td>Nulle (elle copie et assemble)</td>
                                    </tr>
                                    <tr>
                                        <td>Consommation d'énergie</td>
                                        <td>20 Watts (super écologique)</td>
                                        <td>Des millions de Watts (très polluant)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section class="ia-section ia-summary">
                        <h3>Conclusion : c'est toi le boss</h3>
                        <p>
                            Ton téléphone n'est pas plus intelligent que toi, c'est une calculatrice sous stéroïdes.
                            C'est un outil incroyablement puissant, mais qui a absolument besoin de toi pour lui donner des instructions,
                            vérifier qu'il ne dit pas n'importe quoi (hallucinations) et l'utiliser de manière éthique.
                        </p>
                        <p>
                            L'IA ne te remplacera pas. Par contre, la personne qui saura bien utiliser l'IA aura un énorme avantage.
                            Le pilote, c'est toi.
                        </p>
                    </section>
                </div>
            </div>
        `;

        let onEscape;
        const closeModal = function () {
            modalOverlay.remove();
            document.body.style.overflow = '';
            if (onEscape) {
                document.removeEventListener('keydown', onEscape);
            }
        };

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        onEscape = function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', onEscape);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
    }

    function openChatgptLiesModal() {
        const existingModal = document.querySelector('.ia-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true" aria-labelledby="chatgptLiesModalTitle">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <h2 id="chatgptLiesModalTitle">Quand ChatGPT te ment droit dans les yeux (et pourquoi)</h2>
                    <p>
                        Tu lui poses une question pour ton exposé d'histoire. En trois secondes, l'IA te pond une réponse ultra-détaillée,
                        avec des dates, des noms complexes et un ton hyper confiant. C'est parfait... sauf que c'est totalement faux.
                    </p>
                    <p>
                        Elle vient d'inventer une bataille qui n'a jamais eu lieu ou un roi qui n'a jamais existé.
                        Pourquoi une machine si intelligente fait-elle des erreurs aussi énormes ?
                        Bienvenue dans le monde fascinant (et un peu flippant) des hallucinations.
                    </p>
                </div>

                <div class="ia-modal-body">
                    <section class="ia-section">
                        <h3>L'IA n'est pas Wikipédia, c'est un prédicteur</h3>
                        <p>
                            Le plus grand piège avec des IA comme ChatGPT, Claude ou Gemini, c'est de croire qu'elles fonctionnent comme Google.
                            C'est faux.
                        </p>
                        <p>
                            Un moteur de recherche va chercher des informations qui existent sur des sites web.
                            Une IA générative, elle, invente du texte mot après mot.
                            Son but est de deviner quel mot a le plus de chances d'arriver après le précédent.
                        </p>
                        <p>
                            C'est comme le clavier intuitif de ton téléphone qui propose le mot suivant dans un SMS,
                            mais en un milliard de fois plus puissant.
                        </p>
                        <p class="ia-highlight">
                            Le problème : l'IA ne comprend pas ce qu'elle écrit et n'a aucune notion de vérité.
                            Elle veut surtout fabriquer une phrase qui a l'air correcte et logique.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>Le syndrome du pote qui ne veut jamais dire : "Je ne sais pas"</h3>
                        <p>
                            Si l'IA n'a pas la réponse exacte dans ses données, au lieu de dire "Désolé, je ne sais pas",
                            elle improvise. Elle mélange plusieurs morceaux d'informations pour produire une réponse qui semble vraie.
                        </p>
                        <p>
                            C'est ce que les scientifiques appellent une hallucination :
                            elle te ment droit dans les yeux avec un aplomb incroyable.
                        </p>
                        <p class="ia-highlight">
                            La stat qui calme : selon une étude de Vectara, les grands modèles d'IA inventent des informations
                            entre 3 % et 27 % du temps selon le sujet et le modèle.
                            Jusqu'à un quart de ce qu'elle raconte peut être bidon.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>L'histoire vraie : le bad buzz de l'avocat</h3>
                        <p>
                            En 2023, aux États-Unis, un avocat a utilisé ChatGPT pour préparer sa plaidoirie.
                            Il a demandé des exemples de jugements passés.
                        </p>
                        <p>
                            L'IA lui a fourni des affaires juridiques parfaites, avec numéros de dossiers et citations.
                            Il a transmis tout ça au juge.
                        </p>
                        <p class="ia-highlight">
                            Le problème ? Aucune de ces affaires n'existait.
                            ChatGPT avait tout inventé de A à Z. L'avocat a été condamné à une amende et a failli perdre sa licence.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>Ton kit de survie anti-mensonges</h3>
                        <div class="ia-note-grid">
                            <article class="ia-note ia-note-old">
                                <h4>1. Ne fais jamais aveuglément confiance</h4>
                                <p>
                                    Considère l'IA comme un assistant très rapide, mais un peu mythomane sur les bords.
                                </p>
                            </article>
                            <article class="ia-note ia-note-new">
                                <h4>2. Exige des sources</h4>
                                <p>
                                    Parfois l'IA invente aussi de fausses URL. Clique toujours sur les liens
                                    pour vérifier qu'ils existent vraiment.
                                </p>
                            </article>
                        </div>
                        <p style="margin-top: 12px;">
                            3. Le test du bon sens : si une info paraît bizarre ou trop parfaite,
                            vérifie-la dans un vrai moteur de recherche.
                            L'IA est excellente pour reformuler, trouver des idées ou expliquer un concept complexe,
                            mais elle est mauvaise pour garantir la vérité absolue.
                        </p>
                    </section>

                    <section class="ia-section ia-summary">
                        <h3>En résumé</h3>
                        <p>
                            L'IA est très douée pour parler, mais elle n'est pas programmée pour dire la vérité.
                            Fais toujours marcher ton esprit critique.
                        </p>
                    </section>
                </div>
            </div>
        `;

        let onEscape;
        const closeModal = function () {
            modalOverlay.remove();
            document.body.style.overflow = '';
            if (onEscape) {
                document.removeEventListener('keydown', onEscape);
            }
        };

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        onEscape = function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', onEscape);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
    }

    function openManipulationOnlineModal() {
        const existingModal = document.querySelector('.ia-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true" aria-labelledby="manipulationModalTitle">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <h2 id="manipulationModalTitle">Tu t'es (probablement) déjà fait manipuler en ligne...</h2>
                    <p>
                        Tu penses être aux commandes quand tu scrolles sur TikTok, Instagram ou YouTube ?
                        Tu crois que c'est toi qui choisis de regarder cette quinzième vidéo de chats ou ce tuto de danse à 23h30 ?
                    </p>
                    <p>
                        En réalité, tu as probablement été guidé par une IA conçue pour pirater ton attention.
                        L'IA n'est pas seulement dans ChatGPT : elle est cachée dans presque toutes tes applications préférées.
                    </p>
                    <p>
                        Voici comment la machine tire les ficelles, et comment tu peux éviter de finir en marionnette.
                    </p>
                </div>

                <div class="ia-modal-body">
                    <section class="ia-section">
                        <h3>1. Le piège à dopamine : l'algorithme de recommandation</h3>
                        <p>
                            Le but numéro un d'un réseau social n'est pas de t'amuser.
                            C'est de te garder connecté le plus longtemps possible pour te montrer un maximum de publicités.
                            Pour y arriver, ils utilisent des algorithmes surpuissants qui analysent tes moindres faits et gestes.
                        </p>
                        <p>L'IA étudie :</p>
                        <ul class="ia-list">
                            <li>Le temps que tu passes sur une vidéo, même sans liker.</li>
                            <li>Les mots-clés de tes recherches.</li>
                            <li>Ce que tes amis regardent.</li>
                        </ul>
                        <p class="ia-highlight">
                            La stat qui fait réfléchir : plus de 70 % de ce qui est regardé sur YouTube n'est pas cherché
                            par les utilisateurs, mais directement suggéré par l'algorithme de recommandation.
                        </p>
                        <p>
                            L'IA a compris qu'en te montrant des contenus qui provoquent des émotions fortes
                            (colère, rire, indignation), ton cerveau libère de la dopamine.
                            Résultat : tu n'arrives plus à lâcher ton écran. C'est le principe du défilement infini.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>2. Les deepfakes : ne crois plus tes propres yeux</h3>
                        <p>
                            Au-delà de te scotcher à ton écran, l'IA est maintenant capable de fabriquer de fausses réalités.
                            Tu as peut-être vu des photos du Pape en doudoune ou des vidéos d'acteurs/politiques disant des choses
                            qu'ils n'ont jamais prononcées.
                        </p>
                        <p>
                            Ces montages hyper-réalistes s'appellent des deepfakes.
                            Avec quelques secondes de voix enregistrée, une IA peut cloner un timbre de voix
                            et faire dire n'importe quoi.
                        </p>
                        <p class="ia-highlight">
                            La stat de l'illusion : selon une étude du MIT, les fausses informations circulent 6 fois plus vite
                            que les vraies sur les réseaux sociaux.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>3. La bulle de filtres : tu ne vois qu'un bout du monde</h3>
                        <p>
                            Parce que l'algorithme veut que tu restes confortable et que tu continues de scroller,
                            il va surtout te montrer des opinions avec lesquelles tu es déjà d'accord.
                        </p>
                        <p>
                            Si tu aimes un type de musique, un jeu vidéo ou une idée politique,
                            l'IA t'inonde de contenus similaires. C'est la bulle de filtres.
                            Le danger : tu finis par croire que tout le monde pense comme toi.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>Le plan d'action pour reprendre les commandes</h3>
                        <ul class="ia-list">
                            <li><strong>Brise ta bulle :</strong> abonne-toi volontairement à des sujets hors de tes habitudes.</li>
                            <li><strong>Règle des 3 secondes :</strong> avant de partager, respire et vérifie la source.</li>
                            <li><strong>Mets un réveil :</strong> ne laisse pas l'IA décider de ton heure de coucher.</li>
                        </ul>
                        <p style="margin-top: 10px;">
                            Astuce : les IA ont encore souvent du mal avec certains détails visuels
                            (mains, reflets, incohérences fines).
                        </p>
                    </section>

                    <section class="ia-section ia-summary">
                        <h3>En résumé</h3>
                        <p>
                            Si c'est gratuit, c'est souvent toi le produit.
                            Ton attention vaut de l'or pour les plateformes, et l'IA sert à la capturer.
                            Sois plus malin qu'elles.
                        </p>
                    </section>
                </div>
            </div>
        `;

        let onEscape;
        const closeModal = function () {
            modalOverlay.remove();
            document.body.style.overflow = '';
            if (onEscape) {
                document.removeEventListener('keydown', onEscape);
            }
        };

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        onEscape = function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', onEscape);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
    }

    function openDeepfakeDetectModal() {
        const existingModal = document.querySelector('.ia-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true" aria-labelledby="deepfakeModalTitle">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <h2 id="deepfakeModalTitle">Comment repérer un Deepfake (et ne pas passer pour un pigeon)</h2>
                    <p>
                        Tu penses que repérer une fausse vidéo, c'est facile ? Détrompe-toi.
                        Les deepfakes sont devenus si puissants qu'ils trompent des adultes,
                        des banquiers et même des experts en sécurité.
                    </p>
                    <p>
                        Début 2024, à Hong Kong, un employé a participé à une visioconférence avec son directeur financier.
                        Il a viré 25 millions de dollars... avant de découvrir qu'il était le seul humain dans l'appel.
                        Tous les autres visages et voix étaient des deepfakes générés par des escrocs.
                    </p>
                </div>

                <div class="ia-modal-body">
                    <section class="ia-section">
                        <h3>1. Le visage : cherche le bug dans la matrice</h3>
                        <p>
                            L'IA est forte pour générer une peau crédible, mais elle gère mal la physique réelle.
                            Sur une vidéo suspecte, mets en pause et inspecte les détails.
                        </p>
                        <ul class="ia-list">
                            <li><strong>Lunettes et reflets :</strong> lumière incohérente, verres qui fondent dans la joue.</li>
                            <li><strong>Cheveux et contours :</strong> bord de tête flou, cheveux qui bougent comme un casque.</li>
                            <li><strong>Clignement des yeux :</strong> rythme trop régulier, mécanique et sans variation naturelle.</li>
                        </ul>
                    </section>

                    <section class="ia-section">
                        <h3>2. Le son : l'arnaque de la voix clonée</h3>
                        <p>
                            Aujourd'hui, cloner une voix est parfois plus simple que cloner un visage.
                            Beaucoup d'arnaques passent par WhatsApp, Discord ou un appel vocal.
                        </p>
                        <ul class="ia-list">
                            <li><strong>Emotion plate :</strong> le ton est correct, mais sans vrai stress ni respiration saccadée.</li>
                            <li><strong>Son métallique :</strong> léger effet robot, surtout sur les consonnes dures (T, P, K).</li>
                            <li><strong>Désynchronisation :</strong> les lèvres ne correspondent pas aux sons B/M (physiquement impossible).</li>
                        </ul>
                    </section>

                    <section class="ia-section">
                        <h3>Ta check-list anti-Deepfake</h3>
                        <div class="ia-table-wrap">
                            <table class="ia-table">
                                <thead>
                                    <tr>
                                        <th>Ce que tu observes</th>
                                        <th>Comportement humain (normal)</th>
                                        <th>Comportement IA (deepfake)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>L'éclairage (ombres)</td>
                                        <td>Les ombres bougent logiquement avec la lumière.</td>
                                        <td>La lumière reste figée sur le visage malgré les mouvements.</td>
                                    </tr>
                                    <tr>
                                        <td>Les dents</td>
                                        <td>Contours visibles : incisives, canines, détails naturels.</td>
                                        <td>Bande blanche uniforme, sans séparation claire.</td>
                                    </tr>
                                    <tr>
                                        <td>Mouvements de main</td>
                                        <td>Gestes fluides : toucher le visage, passer la main dans les cheveux.</td>
                                        <td>Mains évitent le visage ou déforment la zone bouche/nez.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section class="ia-section">
                        <h3>La règle d'or : Vérifie-le-ailleurs</h3>
                        <p>
                            Les créateurs de deepfakes comptent sur ton impulsivité : te choquer pour te faire partager vite.
                        </p>
                        <p class="ia-highlight">
                            Ferme l'application, ouvre ton navigateur et vérifie l'info dans des médias fiables.
                            Si un fait est vraiment énorme, il sera repris partout en quelques minutes.
                            Si tu ne le vois que sur un compte obscur, méfiance maximale.
                        </p>
                    </section>

                    <section class="ia-section ia-summary">
                        <h3>En résumé</h3>
                        <p>
                            Un deepfake convaincant n'est pas toujours visible au premier regard.
                            Observe les détails (reflets, lèvres, voix, gestes), puis vérifie toujours l'info à la source.
                        </p>
                    </section>
                </div>
            </div>
        `;

        let onEscape;
        const closeModal = function () {
            modalOverlay.remove();
            document.body.style.overflow = '';
            if (onEscape) {
                document.removeEventListener('keydown', onEscape);
            }
        };

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        onEscape = function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', onEscape);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
    }

    function openAiCheatsGamesModal() {
        const existingModal = document.querySelector('.ia-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true" aria-labelledby="aiCheatsGamesModalTitle">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <h2 id="aiCheatsGamesModalTitle">Comment l'IA triche dans tes jeux vidéo préférés</h2>
                    <p>
                        Tu as déjà hurlé devant ton écran parce qu'un bot t'a mis un headshot impossible ?
                        Ou parce qu'un adversaire IA t'a doublé à un mètre de la ligne d'arrivée ?
                    </p>
                    <p>
                        Rassure-toi : ce n'est pas juste toi. L'IA de nombreux jeux est programmée pour tricher,
                        afin de maintenir le challenge et le rythme de la partie.
                    </p>
                </div>

                <div class="ia-modal-body">
                    <section class="ia-section">
                        <h3>1. Le wallhack intégré (l'omniscience)</h3>
                        <p>
                            Dans les jeux de stratégie ou de tir tactique, toi tu explores la carte.
                            L'IA, elle, peut avoir accès en temps réel à ta position, ta santé et ta base.
                        </p>
                        <p>
                            Si un bot semble hésiter avant de te trouver, c'est souvent une animation scriptée
                            pour donner l'illusion d'un comportement humain.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>2. La lecture dans les pensées (input reading)</h3>
                        <p>
                            Dans les jeux de combat ou boss fights difficiles, l'IA ne réagit pas comme un humain.
                            Elle peut lire directement les entrées de ta manette/clavier.
                        </p>
                        <p class="ia-highlight">
                            À la milliseconde où tu appuies sur attaque, le jeu peut déjà déclencher blocage/esquive côté IA.
                            C'est de la télépathie numérique.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>3. Le syndrome de l'élastique (rubberbanding)</h3>
                        <p>
                            Dans les jeux de course, si tu prends trop d'avance, l'IA peut recevoir un boost caché
                            pour te rattraper. Si tu es trop loin derrière, elle peut ralentir pour te garder dans la course.
                        </p>
                        <p>
                            Ce n'est pas forcément une meilleure conduite : c'est un réglage de gameplay pour garder la tension.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>Pourquoi les développeurs font ça ?</h3>
                        <div class="ia-table-wrap">
                            <table class="ia-table">
                                <thead>
                                    <tr>
                                        <th>La vraie raison</th>
                                        <th>L'explication technique</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Garder le jeu amusant</td>
                                        <td>Éviter un jeu trop facile (ennuyeux) ou trop dur (frustrant), et conserver des parties serrées.</td>
                                    </tr>
                                    <tr>
                                        <td>Économiser le processeur</td>
                                        <td>Une IA vraiment humaine coûte très cher en calcul. Tricher via scripts coûte beaucoup moins.</td>
                                    </tr>
                                    <tr>
                                        <td>L'illusion suffit</td>
                                        <td>L'IA doit surtout être un bon acteur pour te faire vivre une belle aventure.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section class="ia-section">
                        <h3>La stat qui calme</h3>
                        <p>
                            En 2019, OpenAI Five a affronté des champions d'esport sur Dota 2 avec les mêmes informations que les humains.
                            Résultat : l'IA a gagné 99,4 % des matchs après des mois d'entraînement.
                        </p>
                    </section>

                    <section class="ia-section ia-summary">
                        <h3>En résumé</h3>
                        <p>
                            Si les jeux utilisaient partout des IA surpuissantes et totalement équitables,
                            tu ne gagnerais presque jamais. La triche contrôlée sert surtout à rendre les parties plus fun.
                        </p>
                    </section>
                </div>
            </div>
        `;

        let onEscape;
        const closeModal = function () {
            modalOverlay.remove();
            document.body.style.overflow = '';
            if (onEscape) {
                document.removeEventListener('keydown', onEscape);
            }
        };

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        onEscape = function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', onEscape);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
    }

    function openStreamerFakeVideoModal() {
        const existingModal = document.querySelector('.ia-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true" aria-labelledby="streamerFakeModalTitle">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <h2 id="streamerFakeModalTitle">Cette vidéo de ton streamer préféré n'existe pas</h2>
                    <p>
                        Tu scrolles, et ton streamer préféré te regarde dans les yeux,
                        t'appelle "le sang" et te promet un cadeau incroyable.
                        Le visage, la voix, les tics... tout semble parfait.
                    </p>
                    <p>
                        Sauf un détail : ce n'est pas lui. Il n'a jamais tourné cette vidéo.
                        Bienvenue dans l'ère de l'usurpation d'identité 2.0.
                    </p>
                </div>

                <div class="ia-modal-body">
                    <section class="ia-section">
                        <h3>1. Le braquage vocal : l'IA te vole la voix</h3>
                        <p>
                            Les créateurs de contenu sont des cibles parfaites : ils ont des centaines d'heures de vidéos publiques.
                            C'est un buffet à volonté pour entraîner une IA à copier leur voix et leurs expressions.
                        </p>
                        <p class="ia-highlight">
                            Stat qui fait peur : certains outils n'ont besoin que de 3 secondes d'audio
                            pour cloner une voix de façon très crédible.
                        </p>
                        <p>
                            Avec quelques minutes vidéo en plus, l'IA peut poser ce faux visage sur un acteur
                            et lui faire dire absolument n'importe quoi.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>2. Pourquoi font-ils ça ? L'arnaque à la carte bleue</h3>
                        <p>
                            Ces deepfakes ne servent pas seulement à faire des blagues.
                            Le but principal est souvent de voler de l'argent aux abonnés.
                        </p>
                        <p class="ia-highlight">
                            Exemple concret : fin 2023, une fausse vidéo de MrBeast promettait un iPhone 15 à prix ridicule.
                            Des milliers de personnes ont cliqué et saisi des données bancaires.
                            Le vrai créateur n'y était pour rien.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>3. Les influenceurs qui n'ont jamais existé</h3>
                        <p>
                            L'IA va encore plus loin : elle peut créer de faux streamers ou influenceurs de A à Z,
                            avec des photos, des partenariats et des communautés entières.
                        </p>
                        <p>
                            Exemple d'Aitana Lopez : influenceuse virtuelle suivie par des centaines de milliers de personnes,
                            monétisée par des marques, alors qu'aucune personne réelle n'existe derrière ce visage.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>Comment ne pas tomber dans le piège ?</h3>
                        <div class="ia-table-wrap">
                            <table class="ia-table">
                                <thead>
                                    <tr>
                                        <th>L'indice</th>
                                        <th>Ce qui doit t'alerter (probable IA)</th>
                                        <th>La vraie vie (vrai créateur)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Le compte qui publie</td>
                                        <td>Compte bizarre du style "Nom_Gifts_2024" avec très peu d'abonnés.</td>
                                        <td>Chaîne officielle, souvent vérifiée avec badge.</td>
                                    </tr>
                                    <tr>
                                        <td>L'offre proposée</td>
                                        <td>"Clique sur ce lien pour recevoir ton cadeau gratuit".</td>
                                        <td>Contenu normal, sans promesse d'argent/cadeau miracle.</td>
                                    </tr>
                                    <tr>
                                        <td>Le visage et la bouche</td>
                                        <td>Voix légèrement robotique, lèvres bizarres, respiration artificielle.</td>
                                        <td>Voix naturelle, hésitations et souffle réalistes.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section class="ia-section ia-summary">
                        <h3>À retenir</h3>
                        <p>
                            Si une vidéo te met en urgence émotionnelle ("vite, clique avant que ça disparaisse"),
                            c'est souvent une arnaque dopée à l'IA.
                            Ralentis, vérifie la source et ne donne jamais d'infos bancaires sur un lien douteux.
                        </p>
                    </section>
                </div>
            </div>
        `;

        let onEscape;
        const closeModal = function () {
            modalOverlay.remove();
            document.body.style.overflow = '';
            if (onEscape) {
                document.removeEventListener('keydown', onEscape);
            }
        };

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        onEscape = function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', onEscape);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
    }

    function openHomeworkAiModal() {
        const existingModal = document.querySelector('.ia-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true" aria-labelledby="homeworkAiModalTitle">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <h2 id="homeworkAiModalTitle">Faire ses devoirs avec l'IA : l'astuce de génie ou le pire piège ?</h2>
                    <p>
                        Dimanche 22h, devoir pour demain : la tentation du copier-coller via ChatGPT est énorme.
                        En 10 secondes, tout semble réglé. Magique ? Pas vraiment.
                    </p>
                    <p>
                        Utiliser l'IA à ta place est un piège. L'utiliser avec toi peut devenir un super-pouvoir.
                        Toute la différence est là.
                    </p>
                </div>

                <div class="ia-modal-body">
                    <section class="ia-section">
                        <h3>1. Le pire piège : le mode copier-coller</h3>
                        <p>
                            Si tu demandes à l'IA de faire le devoir de A à Z, tu t'exposes à trois gros risques :
                        </p>
                        <ul class="ia-list">
                            <li><strong>Hors-sujet :</strong> l'IA ignore les attentes précises de ton prof et de votre cours.</li>
                            <li><strong>Fausses sources :</strong> citations, dates ou références inventées peuvent te griller direct.</li>
                            <li><strong>Crash à l'examen :</strong> ton cerveau ne s'entraîne plus, et le jour J tu bloques.</li>
                        </ul>
                    </section>

                    <section class="ia-section">
                        <h3>2. Comment les profs te repèrent en 30 secondes</h3>
                        <p>
                            Les profs lisent des centaines de copies et connaissent ton niveau.
                            L'IA laisse des traces faciles à repérer.
                        </p>
                        <ul class="ia-list">
                            <li><strong>Vocabulaire robot :</strong> style soudain ultra-formel qui ne te ressemble pas.</li>
                            <li><strong>Perfection ennuyeuse :</strong> texte lisse, sans avis perso, sans relief.</li>
                            <li><strong>Test oral :</strong> si tu ne peux pas expliquer un mot de ta copie, c'est fini.</li>
                        </ul>
                        <p class="ia-highlight">
                            Selon plusieurs sondages récents, plus d'un enseignant sur deux dit avoir déjà repéré
                            et sanctionné des devoirs générés par IA.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>3. L'astuce de génie : l'IA comme prof particulier</h3>
                        <p>
                            Le but n'est pas d'interdire l'IA, mais de l'utiliser comme un coach 24h/24.
                        </p>
                        <ul class="ia-list">
                            <li><strong>Débloquer une page blanche :</strong> demande des idées de plans, puis rédige toi-même.</li>
                            <li><strong>Comprendre un cours :</strong> fais expliquer un concept difficile avec des exemples simples.</li>
                            <li><strong>T'entraîner :</strong> demande des quiz/QCM pour réviser activement.</li>
                        </ul>
                    </section>

                    <section class="ia-section">
                        <h3>Le tableau du bon élève connecté</h3>
                        <div class="ia-table-wrap">
                            <table class="ia-table">
                                <thead>
                                    <tr>
                                        <th>Ce qu'il ne faut PAS faire (le piège)</th>
                                        <th>Ce qu'il FAUT faire (le super-pouvoir)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>"Écris mon devoir sur la Seconde Guerre mondiale."</td>
                                        <td>"Corrige les fautes d'orthographe de mon brouillon."</td>
                                    </tr>
                                    <tr>
                                        <td>"Résume ce livre pour ma fiche de lecture."</td>
                                        <td>"Pose-moi des questions pour vérifier que j'ai compris ce livre."</td>
                                    </tr>
                                    <tr>
                                        <td>Copier-coller sans lire ni comprendre.</td>
                                        <td>L'utiliser comme dictionnaire, coach et partenaire de révision.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section class="ia-section ia-summary">
                        <h3>À retenir</h3>
                        <p>
                            Considère l'IA comme un entraîneur sportif :
                            si l'entraîneur soulève les poids à ta place, ce n'est pas toi qui progresses.
                            Utilise l'IA pour t'entraîner, mais c'est toi qui dois faire l'effort final.
                        </p>
                    </section>
                </div>
            </div>
        `;

        let onEscape;
        const closeModal = function () {
            modalOverlay.remove();
            document.body.style.overflow = '';
            if (onEscape) {
                document.removeEventListener('keydown', onEscape);
            }
        };

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        onEscape = function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', onEscape);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
    }

    function openFutureJobModal() {
        const existingModal = document.querySelector('.ia-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true" aria-labelledby="futureJobModalTitle">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <h2 id="futureJobModalTitle">Un robot va-t-il piquer ton futur métier ?</h2>
                    <p>
                        Entre orientation, examens et pression pour trouver ta voie, on ajoute souvent une angoisse de plus :
                        "les IA vont remplacer tout le monde".
                    </p>
                    <p>
                        Respire : le scénario Terminator n'est pas au programme.
                        Le travail va changer en profondeur, mais pas disparaître d'un coup.
                    </p>
                </div>

                <div class="ia-modal-body">
                    <section class="ia-section">
                        <h3>1. L'IA ne vole pas des métiers, elle prend des corvées</h3>
                        <p>
                            Un métier, ce n'est pas une seule tâche : c'est un ensemble d'actions très différentes.
                            L'IA automatise surtout les tâches répétitives et lourdes.
                        </p>
                        <p>
                            Exemple avocat : l'IA peut lire 10 000 pages de lois en quelques secondes,
                            mais elle ne sait ni convaincre un juge, ni rassurer un client, ni avoir une intuition brillante en audience.
                        </p>
                        <p class="ia-highlight">
                            Selon Goldman Sachs, l'IA générative pourrait impacter environ 300 millions d'emplois.
                            "Impacter" ne veut pas dire "détruire" : elle transforme surtout les tâches.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>2. Métiers qui mutent, métiers blindés, nouveaux métiers</h3>
                        <div class="ia-table-wrap">
                            <table class="ia-table">
                                <thead>
                                    <tr>
                                        <th>Les métiers qui vont muter</th>
                                        <th>Les métiers blindés</th>
                                        <th>Les métiers créés par l'IA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Traducteurs, codeurs, comptables, rédacteurs web.</td>
                                        <td>Plombiers, électriciens, chirurgiens, boulangers.</td>
                                        <td>Prompt engineer, spécialiste en éthique de l'IA.</td>
                                    </tr>
                                    <tr>
                                        <td>Pourquoi ? L'IA traite très bien texte/chiffres/code de base.</td>
                                        <td>Pourquoi ? Un robot reste limité dans les gestes fins du monde réel.</td>
                                        <td>Pourquoi ? Il faut des humains pour piloter et encadrer les IA.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p style="margin-top: 10px;">
                            Et n'oublie pas les métiers de l'humain : infirmiers, psychologues, profs, éducateurs.
                            L'empathie et l'écoute ne se codent pas simplement.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>3. La vraie compétition</h3>
                        <p class="ia-highlight">
                            "L'IA ne te remplacera pas. Par contre, une personne qui sait utiliser l'IA te remplacera."
                        </p>
                        <p>
                            Dans beaucoup de domaines créatifs/tech, tu ne seras pas en duel contre l'outil,
                            mais contre quelqu'un qui sait l'utiliser mieux et plus vite.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>Ton plan d'action : miser sur les soft skills</h3>
                        <ul class="ia-list">
                            <li><strong>Esprit critique :</strong> détecter les infos fausses et les réponses bancales.</li>
                            <li><strong>Adaptabilité :</strong> apprendre à apprendre dans un monde qui bouge vite.</li>
                            <li><strong>Créativité originale :</strong> proposer des idées que l'IA ne fait pas émerger seule.</li>
                        </ul>
                    </section>

                    <section class="ia-section ia-summary">
                        <h3>En résumé</h3>
                        <p>
                            Ne choisis pas ton métier en fonction de la peur de l'IA.
                            Choisis ce qui te passionne, puis apprends à utiliser les outils IA de ton domaine
                            pour devenir une version augmentée de toi-même.
                        </p>
                    </section>
                </div>
            </div>
        `;

        let onEscape;
        const closeModal = function () {
            modalOverlay.remove();
            document.body.style.overflow = '';
            if (onEscape) {
                document.removeEventListener('keydown', onEscape);
            }
        };

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        onEscape = function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', onEscape);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
    }

    function openAiReplaceHumanityModal() {
        const existingModal = document.querySelector('.ia-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'ia-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="ia-modal" role="dialog" aria-modal="true" aria-labelledby="aiReplaceHumanityModalTitle">
                <button class="ia-modal-close" aria-label="Fermer">×</button>
                <div class="ia-modal-header">
                    <h2 id="aiReplaceHumanityModalTitle">L'IA va-t-elle remplacer l'humanité ?</h2>
                    <p>
                        Entre Terminator, Matrix et Ultron, on imagine vite des machines qui se rebellent.
                        Excellent pour le cinéma, mais dans la vraie vie, faut-il paniquer ?
                    </p>
                    <p>
                        Spoiler : non, on ne va pas se faire remplacer par des robots tueurs.
                        Mais les vrais risques existent et ils sont plus subtils.
                    </p>
                </div>

                <div class="ia-modal-body">
                    <section class="ia-section">
                        <h3>1. Le mythe du robot qui se réveille</h3>
                        <p>
                            Les scientifiques distinguent l'IA spécialisée (celle qu'on a) et l'IA générale
                            (une machine capable d'égaler l'humain partout, qui n'existe pas aujourd'hui).
                        </p>
                        <p>
                            Nos IA actuelles sont fortes sur une tâche précise, pas sur tout.
                            ChatGPT écrit, Midjourney illustre, d'autres conduisent...
                            mais elles n'ont ni volonté propre ni conscience.
                        </p>
                        <p class="ia-highlight">
                            Les experts estiment qu'une IA générale est encore loin : des décennies, voire plus.
                        </p>
                    </section>

                    <section class="ia-section">
                        <h3>2. Le vrai danger, ce n'est pas Skynet, c'est nous</h3>
                        <p>
                            Le risque principal n'est pas une IA qui décide seule de détruire le monde,
                            mais l'usage que des humains font d'outils très puissants.
                        </p>
                        <ul class="ia-list">
                            <li><strong>Manipulation de masse :</strong> deepfakes politiques, désinformation, élections influencées.</li>
                            <li><strong>Armes autonomes :</strong> drones capables de sélectionner des cibles sans humain direct.</li>
                            <li><strong>Inégalités :</strong> concentration du pouvoir IA entre quelques géants technologiques.</li>
                        </ul>
                    </section>

                    <section class="ia-section">
                        <h3>3. Le match : cinéma vs réalité</h3>
                        <div class="ia-table-wrap">
                            <table class="ia-table">
                                <thead>
                                    <tr>
                                        <th>Ce qu'on craint (science-fiction)</th>
                                        <th>Ce qu'il faut surveiller (réalité)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Des robots développent des sentiments et nous détestent.</td>
                                        <td>Des algorithmes nous enferment dans des bulles et nous divisent.</td>
                                    </tr>
                                    <tr>
                                        <td>Une IA prend le contrôle des codes nucléaires.</td>
                                        <td>Des pirates utilisent l'IA pour créer des cyberattaques plus efficaces.</td>
                                    </tr>
                                    <tr>
                                        <td>Les humains deviennent des esclaves des machines.</td>
                                        <td>Les humains deviennent accros à des contenus générés et optimisés par IA.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section class="ia-section ia-summary">
                        <h3>Conclusion : le futur sera un travail d'équipe</h3>
                        <p>
                            Comme pour la voiture ou l'électricité, on progresse en créant des règles.
                            Les lois commencent déjà à encadrer l'IA (par exemple l'AI Act européen).
                        </p>
                        <p>
                            Le modèle de demain, c'est le centaure : intuition et empathie humaines
                            + puissance de calcul de la machine.
                            Et le point clé reste le même : c'est toujours nous qui tenons la prise.
                        </p>
                    </section>
                </div>
            </div>
        `;

        let onEscape;
        const closeModal = function () {
            modalOverlay.remove();
            document.body.style.overflow = '';
            if (onEscape) {
                document.removeEventListener('keydown', onEscape);
            }
        };

        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        modalOverlay.querySelector('.ia-modal-close').addEventListener('click', closeModal);

        onEscape = function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', onEscape);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';
    }
    
    // Gestion du menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Fermer le menu mobile quand on clique sur un lien
    const navLinkItems = document.querySelectorAll('.nav-link');
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Animation au scroll pour les cartes d'articles
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer toutes les cartes d'articles
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Effet de parallaxe subtil sur le hero
    const heroBg = document.querySelector('.circuit-pattern');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }
    
    // Gestion des likes (simulation)
    const statButtons = document.querySelectorAll('.stat');
    statButtons.forEach(stat => {
        stat.style.cursor = 'pointer';
        stat.addEventListener('click', function(e) {
            e.stopPropagation();
            const svg = this.querySelector('svg');
            const text = this.childNodes[2];
            
            if (this.classList.contains('liked')) {
                this.classList.remove('liked');
                svg.style.fill = 'currentColor';
                svg.style.color = 'rgba(255, 255, 255, 0.7)';
                // Décrémenter (simulation)
                let count = parseInt(text.textContent);
                text.textContent = ' ' + (count - 1);
            } else {
                this.classList.add('liked');
                svg.style.fill = '#ec4899';
                svg.style.color = '#ec4899';
                // Incrémenter (simulation)
                let count = parseInt(text.textContent);
                text.textContent = ' ' + (count + 1);
            }
        });
    });
    
    // Navigation smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Effet de hover sur les cartes avec tilt 3D subtil
    const cards = document.querySelectorAll('.article-card, .featured-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Lazy loading des images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Notification toast pour les actions
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--card-bg);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 500;
            transform: translateY(100px);
            transition: transform 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.style.transform = 'translateY(0)', 100);
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    const featuredIaCard = document.getElementById('ia-featured-card');
    if (featuredIaCard) {
        featuredIaCard.setAttribute('role', 'button');
        featuredIaCard.setAttribute('tabindex', '0');
        featuredIaCard.addEventListener('click', openIaArticleModal);
        featuredIaCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openIaArticleModal();
            }
        });
    }

    const phoneIntelligenceCard = document.getElementById('phone-intelligence-card');
    if (phoneIntelligenceCard) {
        phoneIntelligenceCard.setAttribute('role', 'button');
        phoneIntelligenceCard.setAttribute('tabindex', '0');
        phoneIntelligenceCard.addEventListener('click', openPhoneIntelligenceModal);
        phoneIntelligenceCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPhoneIntelligenceModal();
            }
        });
    }

    const chatgptLiesCard = document.getElementById('chatgpt-lies-card');
    if (chatgptLiesCard) {
        chatgptLiesCard.setAttribute('role', 'button');
        chatgptLiesCard.setAttribute('tabindex', '0');
        chatgptLiesCard.addEventListener('click', openChatgptLiesModal);
        chatgptLiesCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openChatgptLiesModal();
            }
        });
    }

    const manipulationOnlineCard = document.getElementById('manipulation-online-card');
    if (manipulationOnlineCard) {
        manipulationOnlineCard.setAttribute('role', 'button');
        manipulationOnlineCard.setAttribute('tabindex', '0');
        manipulationOnlineCard.addEventListener('click', openManipulationOnlineModal);
        manipulationOnlineCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openManipulationOnlineModal();
            }
        });
    }

    const deepfakeDetectCard = document.getElementById('deepfake-detect-card');
    if (deepfakeDetectCard) {
        deepfakeDetectCard.setAttribute('role', 'button');
        deepfakeDetectCard.setAttribute('tabindex', '0');
        deepfakeDetectCard.addEventListener('click', openDeepfakeDetectModal);
        deepfakeDetectCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openDeepfakeDetectModal();
            }
        });
    }

    const aiCheatsGamesCard = document.getElementById('ai-cheats-games-card');
    if (aiCheatsGamesCard) {
        aiCheatsGamesCard.setAttribute('role', 'button');
        aiCheatsGamesCard.setAttribute('tabindex', '0');
        aiCheatsGamesCard.addEventListener('click', openAiCheatsGamesModal);
        aiCheatsGamesCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openAiCheatsGamesModal();
            }
        });
    }

    const streamerFakeVideoCard = document.getElementById('streamer-fake-video-card');
    if (streamerFakeVideoCard) {
        streamerFakeVideoCard.setAttribute('role', 'button');
        streamerFakeVideoCard.setAttribute('tabindex', '0');
        streamerFakeVideoCard.addEventListener('click', openStreamerFakeVideoModal);
        streamerFakeVideoCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openStreamerFakeVideoModal();
            }
        });
    }

    const homeworkAiCard = document.getElementById('homework-ai-card');
    if (homeworkAiCard) {
        homeworkAiCard.setAttribute('role', 'button');
        homeworkAiCard.setAttribute('tabindex', '0');
        homeworkAiCard.addEventListener('click', openHomeworkAiModal);
        homeworkAiCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openHomeworkAiModal();
            }
        });
    }

    const futureJobCard = document.getElementById('future-job-card');
    if (futureJobCard) {
        futureJobCard.setAttribute('role', 'button');
        futureJobCard.setAttribute('tabindex', '0');
        futureJobCard.addEventListener('click', openFutureJobModal);
        futureJobCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openFutureJobModal();
            }
        });
    }

    const aiReplaceHumanityCard = document.getElementById('ai-replace-humanity-card');
    if (aiReplaceHumanityCard) {
        aiReplaceHumanityCard.setAttribute('role', 'button');
        aiReplaceHumanityCard.setAttribute('tabindex', '0');
        aiReplaceHumanityCard.addEventListener('click', openAiReplaceHumanityModal);
        aiReplaceHumanityCard.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openAiReplaceHumanityModal();
            }
        });
    }

    // Ajouter des événements de clic sur les articles pour simulation
    document.querySelectorAll('.article-card:not(#phone-intelligence-card):not(#chatgpt-lies-card):not(#manipulation-online-card):not(#deepfake-detect-card):not(#ai-cheats-games-card):not(#streamer-fake-video-card):not(#homework-ai-card):not(#future-job-card):not(#ai-replace-humanity-card)').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h2, h3').textContent;
            showToast(`Ouverture de : ${title.substring(0, 30)}...`);
        });
    });
    
    // Header scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    console.log('🧠 BrainHack chargé avec succès !');
});