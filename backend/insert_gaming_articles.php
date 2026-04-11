<?php
// backend/insert_gaming_articles.php
require_once __DIR__ . '/config/db.php';

function generateUuid() {
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
        mt_rand( 0, 0xffff ),
        mt_rand( 0, 0x0fff ) | 0x4000,
        mt_rand( 0, 0x3fff ) | 0x8000,
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}

// Fetch classes from DB to guarantee correct UUIDs
$stmtClass = $pdo->query("SELECT id, nom_groupe FROM classes");
$dbClasses = $stmtClass->fetchAll(PDO::FETCH_ASSOC);

$classes = [];
foreach ($dbClasses as $row) {
    if (strpos($row['nom_groupe'], '6') !== false) $classes['65'] = $row['id'];
    if (strpos($row['nom_groupe'], '4') !== false) $classes['43'] = $row['id'];
    if (strpos($row['nom_groupe'], 'Seconde') !== false) $classes['sp'] = $row['id'];
    if (strpos($row['nom_groupe'], 'Terminale') !== false) $classes['ter'] = $row['id'];
}

$articlesData = [
    // ---------------------------------------------------------
    // NIVEAU 6ème - 5ème
    // ---------------------------------------------------------
    '65' => [
        'title' => "Pourquoi l'ordi triche tout le temps ?",
        'slug' => 'ia-gaming-65',
        'intro' => [
            "Comment l'IA triche dans tes jeux vidéo préférés",
            "Tu as déjà hurlé parce qu'un bot t'a mis un tir impossible ? Ou jeté ta manette parce qu'une voiture t'a doublé juste avant l'arrivée sur Mario Kart ? Rassure-toi, tu n'es pas nul. L'ordinateur est juste un tricheur professionnel, et c'est fait exprès !"
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. Le \"Wallhack\" : Il voit à travers les murs",
                "content" => "Dans les jeux de guerre ou de stratégie, tu dois chercher l'ennemi. Mais l'IA, elle, sait exactement où tu es caché. Le code du jeu lui donne ta position et ta vie en temps réel. Si elle fait semblant de te chercher, c'est juste pour te faire croire qu'elle est \"humaine\"."
            ],
            [
                "type" => "text",
                "title" => "2. La télépathie : Il lit dans tes pensées",
                "content" => "Dans les jeux de combat, l'IA ne regarde pas ton personnage. Elle \"lit\" les touches sur lesquelles tu appuies sur ta manette. Dès que tu presses \"Attaque\", elle le sait en une milliseconde et déclenche une parade. C'est de la triche pure !"
            ],
            [
                "type" => "text",
                "title" => "3. L'élastique : Il te rattrape toujours",
                "content" => "C'est le grand classique des jeux de course (comme Need for Speed). Si tu as trop d'avance, le jeu booste secrètement la vitesse de l'IA pour qu'elle te colle aux fesses. À l'inverse, si tu es dernier, l'IA ralentit pour t'attendre."
            ],
            [
                "type" => "summary",
                "title" => "Pourquoi tricher ? Le bilan des développeurs",
                "content" => "<b>Pour le fun :</b> Un jeu trop facile est ennuyeux. L'IA triche pour que le score reste serré.<br><b>Pour économiser la console :</b> Faire une IA \"intelligente\" fatigue la console. Tricher est beaucoup plus simple.<br><b>Pour l'aventure :</b> L'IA doit juste être un bon acteur pour te faire vivre une belle histoire.<br><br><i>La stat qui calme : En 2019, une vraie IA (OpenAI Five) a appris à jouer à Dota 2 sans tricher. Elle a battu les champions du monde dans 99,4 % des matchs. Donc, si l'IA ne trichait pas et utilisait sa vraie puissance, tu ne gagnerais jamais !</i>"
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'IA dans les jeux",
                "questions" => [
                    [
                        "id" => "gam_1_65",
                        "label" => "1. Qu'est ce que l'effet élastique dans un jeu de course ?",
                        "options" => [
                            ["label" => "L'IA change de forme pour percuter ta voiture.", "isCorrect" => "false"],
                            ["label" => "Le jeu booste ou ralentit l'IA selon ta position pour garder le suspense.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "gam_2_65",
                        "label" => "2. Pourquoi les créateurs font-ils tricher les bots ?",
                        "options" => [
                            ["label" => "Pour que le jeu reste amusant et pour moins fatiguer la console.", "isCorrect" => "true"],
                            ["label" => "Parce qu'ils détestent les joueurs et veulent les frustrer.", "isCorrect" => "false"]
                        ]
                    ]
                ]
            ]
        ]
    ],

    // ---------------------------------------------------------
    // NIVEAU 4ème - 3ème
    // ---------------------------------------------------------
    '43' => [
        'title' => "Sous le capot, l'IA est une tricheuse",
        'slug' => 'ia-gaming-43',
        'intro' => [
            "Pourquoi les jeux vidéo nous mentent (pour notre bien)",
            "On a tous connu cette frustration : un bot qui nous élimine avec une précision surhumaine. Mais savais-tu que l'IA de ton jeu n'est pas \"intelligente\" ? C'est un ensemble de scripts programmés pour briser les règles."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. L'omniscience (Wallhack intégré)",
                "content" => "Contrairement à toi, l'ordinateur n'a pas besoin de regarder l'écran. Il a accès directement à la base de données du jeu. Il connaît ta position exacte, même derrière un mur de fumée. Les développeurs ajoutent souvent des délais de réaction pour que l'IA ait l'air \"juste\", mais c'est une illusion."
            ],
            [
                "type" => "text",
                "title" => "2. L'Input Reading (Lecture de commandes)",
                "content" => "Dans les jeux comme Street Fighter ou Elden Ring, l'IA intercepte tes commandes avant même que l'animation ne commence. Elle ne réagit pas à ce qu'elle voit, mais à ce que tu fais sur ta manette. C'est pour ça qu'elle semble anticiper tous tes coups."
            ],
            [
                "type" => "text",
                "title" => "3. Le Rubberbanding (L'effet élastique)",
                "content" => "Dans les jeux de course, l'IA défie les lois de la physique. Si tu es trop rapide, elle reçoit un boost de vitesse invisible pour maintenir le suspense. C'est ce qu'on appelle l'effet élastique : la distance entre toi et tes adversaires est gérée par le jeu pour rester stressante."
            ],
            [
                "type" => "summary",
                "title" => "Pourquoi les créateurs font-ils ça ?",
                "content" => "<b>\"Créer une IA qui réfléchit vraiment comme un humain demande des calculs colossaux. Tricher permet de garder le jeu fluide et amusant sans faire exploser le processeur de la console.\"</b><br><br><b>À retenir :</b> Si on mettait une IA de pointe (comme celle qui a battu les champions de Dota 2) dans ton jeu, elle serait imbattable. La triche est un \"mal nécessaire\" pour que tu puisses gagner de temps en temps tout en ayant du défi !"
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — Les coulisses du script",
                "questions" => [
                    [
                        "id" => "gam_1_43",
                        "label" => "1. Comment l'IA arrive-t-elle à anticiper parfaitement un coup dans un jeu de combat ?",
                        "options" => [
                            ["label" => "Grâce à l'Input Reading : elle intercepte directement les touches de ta manette.", "isCorrect" => "true"],
                            ["label" => "Grâce à des caméras perfectionnées qui l'aident à analyser l'écran.", "isCorrect" => "false"]
                        ]
                    ],
                    [
                        "id" => "gam_2_43",
                        "label" => "2. Selon les développeurs, pourquoi l'ordinateur fait-il du Rubberbanding (effet élastique) ?",
                        "options" => [
                            ["label" => "Pour punir le joueur s'il roule trop vite et l'empêcher d'avoir une médaille.", "isCorrect" => "false"],
                            ["label" => "Pour maintenir le suspense et conserver le jeu amusant et stressant.", "isCorrect" => "true"]
                        ]
                    ]
                ]
            ]
        ]
    ],

    // ---------------------------------------------------------
    // SECONDE - PREMIERE
    // ---------------------------------------------------------
    'sp' => [
        'title' => "Game Design, quand l'IA triche par nécessité",
        'slug' => 'ia-gaming-sp',
        'intro' => [
            "Le paradoxe de l'Intelligence Artificielle dans le Gaming",
            "Dans le jeu vidéo, l'IA n'a pas pour but d'être \"intelligente\" au sens noble, mais d'être un adversaire crédible. Pour y parvenir avec peu de ressources, elle utilise des techniques de triche systématiques."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. L'omniscience algorithmique",
                "content" => "Dans les jeux de stratégie (RTS) ou de tir (FPS), l'IA ne subit pas le \"brouillard de guerre\". Elle possède une vue d'ensemble du code source en temps réel. Sa difficulté ne vient pas de sa réflexion, mais de la liberté que le développeur lui donne pour utiliser ces informations interdites."
            ],
            [
                "type" => "text",
                "title" => "II. Le traitement des inputs (Input Reading)",
                "content" => "L'IA possède un avantage injuste : elle traite l'information à la milliseconde. Dans un jeu de combat, elle peut déclencher un contre au moment exact où vous pressez un bouton, rendant la parade parfaite. C'est une lecture directe des données d'entrée (inputs) du joueur."
            ],
            [
                "type" => "text",
                "title" => "III. La Difficulté Dynamique (Rubberbanding)",
                "content" => "Le Rubberbanding est une technique de Game Design utilisée pour éviter la frustration.<br><b>Le but :</b> Maintenir le joueur dans \"l'état de Flow\" (ni trop dur, ni trop facile).<br><b>Le moyen :</b> Booster artificiellement les statistiques des bots (vitesse, dégâts) selon la performance du joueur."
            ],
            [
                "type" => "table",
                "title" => "Comparatif : Triche vs Intelligence",
                "headers" => ["Critère", "IA de Jeu (Scriptée)", "Vraie IA (Apprentissage)"],
                "rows" => [
                    ["Fonctionnement", "Triche (lit tes touches)", "Apprend par essais/erreurs"],
                    ["Objectif", "Amuser le joueur", "Gagner à tout prix"],
                    ["Performance", "Limitée par le code", "Potentiellement imbattable"]
                ]
            ],
            [
                "type" => "summary",
                "title" => "Conclusion",
                "content" => "La triche est un outil de mise en scène. Sans elle, les bots seraient soit totalement stupides, soit tellement efficaces qu'ils rendraient le jeu injouable."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'art du Game Design",
                "questions" => [
                    [
                        "id" => "gam_1_sp",
                        "label" => "1. Quel est l'objectif premier du Rubberbanding dans la conception d'un jeu ?",
                        "options" => [
                            ["label" => "Créer un système physique extrêmement réaliste et inviolable.", "isCorrect" => "false"],
                            ["label" => "Maintenir le joueur dans \"l'état de Flow\" sans qu'il s'ennuie ni s'énerve.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "gam_2_sp",
                        "label" => "2. Quelle est la différence majeure d'objectif entre l'IA de jeu scriptée et une vraie IA d'apprentissage ?",
                        "options" => [
                            ["label" => "L'IA scriptée doit amuser le joueur, la vraie IA veut gagner à tout prix.", "isCorrect" => "true"],
                            ["label" => "L'IA scriptée veut gagner, l'IA d'apprentissage veut amuser le joueur.", "isCorrect" => "false"]
                        ]
                    ]
                ]
            ]
        ]
    ],

    // ---------------------------------------------------------
    // TERMINALE
    // ---------------------------------------------------------
    'ter' => [
        'title' => "Entre Scripting et Heuristique, l'illusion de l'adversaire",
        'slug' => 'ia-gaming-ter',
        'intro' => [
            "Épistémologie de l'IA de jeu : Pourquoi la triche est un impératif technique",
            "L'Intelligence Artificielle dans le jeu vidéo (Game AI) diffère fondamentalement des modèles de Deep Learning. Son objectif n'est pas la résolution d'un problème, mais la simulation d'une opposition satisfaisante. Pour optimiser l'expérience utilisateur, les développeurs utilisent des biais algorithmiques qui s'apparentent à de la triche."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. Omniscience et accès aux variables d'état",
                "content" => "L'IA de jeu n'est pas un agent autonome percevant son environnement via des capteurs ; elle est une partie intégrante du programme. Elle a accès aux variables d'état (position du joueur, inventaire, PV) sans aucune latence. Le défi pour les développeurs est de brider cette omniscience pour créer un \"Fair Play\" artificiel."
            ],
            [
                "type" => "text",
                "title" => "II. L'Input Reading et la réactivité instantanée",
                "content" => "Le temps de réaction humain moyen est d'environ 200-250 ms. L'IA, elle, traite l'information dès le cycle d'exécution du processeur (quelques millisecondes). En lisant les inputs de la manette, elle peut \"anticiper\" une action avant même qu'elle ne soit rendue à l'écran, créant un sentiment de télépathie numérique."
            ],
            [
                "type" => "text",
                "title" => "III. Le Rubberbanding et la régulation de l'engagement",
                "content" => "Le Dynamic Difficulty Adjustment (DDA) utilise des algorithmes d'élastique pour modifier les lois physiques du jeu (vitesse, accélération) en temps réel. C'est une manipulation de l'équité du jeu pour garantir que le joueur reste engagé émotionnellement."
            ],
            [
                "type" => "text",
                "title" => "IV. La réalité de la puissance : Le cas OpenAI Five",
                "content" => "En 2019, OpenAI Five a prouvé que si l'on donne à une véritable IA (basée sur l'apprentissage par renforcement) les mêmes contraintes qu'à un humain, elle finit par atteindre un taux de victoire de 99,4 % contre l'élite mondiale."
            ],
            [
                "type" => "summary",
                "title" => "En bref",
                "content" => "La triche dans le jeu vidéo est un compromis nécessaire. Une IA qui ne tricherait pas et qui \"réfléchirait\" vraiment consommerait trop de ressources processeur ou, si elle était trop performante, détruirait simplement l'intérêt ludique. <b>L'IA de jeu n'est pas une intelligence, c'est une chorégraphie.</b>"
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — Architectes de l'illusion",
                "questions" => [
                    [
                        "id" => "gam_1_ter",
                        "label" => "1. Que permet le traitement d'information asymétrique de l''Input Reading' ?",
                        "options" => [
                            ["label" => "Il bride la réactivité de l'IA pour la rendre plus humaine et lente.", "isCorrect" => "false"],
                            ["label" => "Il offre à l'IA une anticipation surnaturelle en lisant l'exécution matérielle avant le rendu visuel.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "gam_2_ter",
                        "label" => "2. Comment qualifier l'objectif fondamental de la Game AI selon les développeurs ?",
                        "options" => [
                            ["label" => "C'est une chorégraphie technique destinée à simuler une opposition satisfaisante.", "isCorrect" => "true"],
                            ["label" => "C'est l'émulation stricte d'un réseau de neurones et du Deep Learning pour résoudre une équation.", "isCorrect" => "false"]
                        ]
                    ]
                ]
            ]
        ]
    ]
];

try {
    foreach ($articlesData as $levelKey => $data) {
        if (!isset($classes[$levelKey])) {
            echo "Avertissement: UUID non trouvé pour $levelKey\n";
            continue;
        }

        $id_classe = $classes[$levelKey];
        $slug = $data['slug'];

        $checkStmt = $pdo->prepare("SELECT id FROM articles WHERE slug = ?");
        $checkStmt->execute([$slug]);
        
        if ($checkStmt->fetch()) {
            echo "Mise à jour de l'article gaming (Slug: {$slug})\n";
            $updateStmt = $pdo->prepare("UPDATE articles SET title = ?, intro = ?, sections = ?, id_classe = ? WHERE slug = ?");
            $updateStmt->execute([
                $data['title'],
                json_encode($data['intro']),
                json_encode($data['sections']),
                $id_classe,
                $slug
            ]);
        } else {
            $uuid = generateUuid();
            echo "Insertion de l'article gaming (Slug: {$slug})\n";
            $insertStmt = $pdo->prepare("INSERT INTO articles (id, title, slug, id_classe, intro, sections) VALUES (?, ?, ?, ?, ?, ?)");
            $insertStmt->execute([
                $uuid,
                $data['title'],
                $slug,
                $id_classe,
                json_encode($data['intro']),
                json_encode($data['sections'])
            ]);
        }
    }
    
    echo "Terminé avec succès !\n";
} catch (PDOException $e) {
    die("Erreur BDD : " . $e->getMessage() . "\n");
}
