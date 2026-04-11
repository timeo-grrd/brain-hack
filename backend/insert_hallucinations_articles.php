<?php
// backend/insert_hallucinations_articles.php
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
    // Force set
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
        'title' => "Attention, l'IA est une grande menteuse !",
        'slug' => 'ia-hallucinations-65',
        'intro' => [
            "Quand ChatGPT te ment droit dans les yeux (et pourquoi)",
            "Tu prépares un exposé ? L’IA te répond en 3 secondes avec un texte super bien écrit. C’est parfait… sauf que parfois, tout est faux ! Elle peut inventer une bataille qui n’a jamais existé ou un roi imaginaire. Pourquoi ? Parce que l'IA peut avoir des \"hallucinations\"."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. L’IA n’est pas un dictionnaire, c’est une machine à deviner",
                "content" => "Le piège, c'est de croire que l'IA est comme Google. C’est faux.<br><b>Google :</b> cherche des informations qui existent vraiment sur Internet.<br><b>L’IA :</b> invente du texte mot après mot. Son seul but est de deviner quel mot va bien après le précédent.<br><br>C’est comme le clavier de ton téléphone qui te propose des mots. Si tu tapes \"Il pleut des...\", il propose \"cordes\". L'IA fait pareil, mais en beaucoup plus puissant. Elle ne cherche pas la vérité, elle cherche à faire une belle phrase."
            ],
            [
                "type" => "text",
                "title" => "2. Le copain qui ne veut jamais dire \"Je ne sais pas\"",
                "content" => "Si l’IA ne connaît pas la réponse, elle panique et elle improvise ! Elle mélange des infos pour te donner une réponse qui a l’air vraie.<br><br><b>La stat qui choque :</b> Les IA inventent n'importe quoi entre 3 % et 27 % du temps. C’est énorme !<br><br><b>L'histoire vraie :</b> Aux États-Unis, un avocat a utilisé ChatGPT pour un procès. L’IA a inventé des anciennes affaires juridiques qui n'existaient pas. L'avocat a tout donné au juge et il a eu de gros ennuis. S'il s'est fait piéger, imagine pour ton exposé !"
            ],
            [
                "type" => "summary",
                "title" => "Ton kit de survie :",
                "content" => "<b>Ne fais jamais confiance à 100 %.</b> L'IA est un assistant rapide, mais un peu mythomane.<br><br><b>Vérifie les sources.</b> Si elle te donne un lien, clique dessus ! Parfois, elle invente même les adresses web.<br><br><b>Utilise ton cerveau.</b> Si une info te semble bizarre, vérifie-la sur un vrai site (comme Wikipédia ou un dictionnaire)."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'art de deviner",
                "questions" => [
                    [
                        "id" => "hal_1_65",
                        "label" => "1. Quelle est la différence principale entre Google et l'IA ?",
                        "options" => [
                            ["label" => "L'IA cherche les vrais sites, Google invente le texte.", "isCorrect" => "false"],
                            ["label" => "Google cherche les vrais sites, l'IA devine et invente le texte.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "hal_2_65",
                        "label" => "2. Que fait l'IA si elle ne connait pas la réponse à ta question ?",
                        "options" => [
                            ["label" => "Elle dit toujours \"Je ne sais pas\".", "isCorrect" => "false"],
                            ["label" => "Elle panique, improvise et peut faire des hallucinations.", "isCorrect" => "true"]
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
        'title' => "Hallucinations, quand l'IA perd le fil",
        'slug' => 'ia-hallucinations-43',
        'intro' => [
            "Pourquoi l'IA t'invente des histoires (avec un aplomb incroyable)",
            "Tu poses une question pour ton devoir d'histoire et l'IA te pond un texte ultra-détaillé. Le ton est sérieux, les dates sont là... mais rien n'est vrai. Bienvenue dans le monde des \"hallucinations\" de l'IA."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. Prédire n'est pas savoir",
                "content" => "Contrairement à un moteur de recherche qui te renvoie vers des sources réelles, l'IA générative est un prédicteur de mots.<br><br>Elle calcule statistiquement quel mot a le plus de probabilités d'apparaître après le précédent. Elle ne comprend pas le sens de ce qu'elle raconte. Si tu lui demandes un fait obscur, elle va construire une phrase grammaticalement parfaite, même si l'information est totalement bidon."
            ],
            [
                "type" => "text",
                "title" => "2. Le syndrome de l'improvisation",
                "content" => "L'IA déteste dire \"Je ne sais pas\". Face à un vide de connaissances, elle préfère mélanger des morceaux d'informations pour fabriquer une réponse crédible.<br><br><b>Le risque :</b> Selon l'entreprise Vectara, jusqu'à un quart (27 %) des réponses d'une IA peuvent être des inventions pures.<br><br><b>L'exemple de l'avocat :</b> En 2023, un avocat américain a perdu sa crédibilité car il a cité des jugements inventés par ChatGPT devant un tribunal. L'IA avait même inventé les numéros de dossiers !"
            ],
            [
                "type" => "summary",
                "title" => "Tes réflexes anti-fake :",
                "content" => "<b>Doute systématique :</b> L'IA est une aide à la rédaction, pas une source de vérité.<br><br><b>Vérification croisée :</b> Une info trouvée sur l'IA doit être confirmée par une source fiable (livre, site officiel).<br><br><b>Méfiance sur les sources :</b> L'IA peut inventer des citations ou des titres de livres. Vérifie qu'ils existent vraiment avant de les noter."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'art de l'improvisation",
                "questions" => [
                    [
                        "id" => "hal_1_43",
                        "label" => "1. Sur quoi se base l'IA générative pour écrire ses réponses ?",
                        "options" => [
                            ["label" => "Sur un calcul statistique des probabilités du mot suivant.", "isCorrect" => "true"],
                            ["label" => "Sur un dictionnaire en ligne qu'elle lit en temps réel.", "isCorrect" => "false"]
                        ]
                    ],
                    [
                        "id" => "hal_2_43",
                        "label" => "2. Quel a été le problème de l'avocat américain en 2023 avec ChatGPT ?",
                        "options" => [
                            ["label" => "L'IA a cité des affaires juridiques qui n'existaient pas.", "isCorrect" => "true"],
                            ["label" => "L'IA a insulté le juge pendant l'audience.", "isCorrect" => "false"]
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
        'title' => "L'IA et le piège de la probabilité",
        'slug' => 'ia-hallucinations-sp',
        'intro' => [
            "Le syndrome de l'hallucination : pourquoi l'IA sacrifie la vérité au style",
            "L'Intelligence Artificielle est capable de rédiger une dissertation en quelques secondes. Mais derrière cette assurance se cache un défaut majeur : l'hallucination. L'IA peut affirmer avec une certitude absolue des faits historiques ou scientifiques totalement erronés."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. Un moteur de probabilités, pas un moteur de recherche",
                "content" => "Il est crucial de comprendre la différence technique :<br><br><b>Moteur de recherche :</b> Indexation et redirection vers des données stockées.<br><br><b>IA Générative :</b> Inférence statistique. L'IA ne consulte pas une base de données de faits, elle génère une suite de \"tokens\" (mots ou morceaux de mots) basée sur des probabilités de cooccurrence.<br><br>Si elle manque de données précises, elle privilégiera la cohérence du langage sur l'exactitude des faits. Elle ne cherche pas le \"vrai\", mais le \"vraisemblable\"."
            ],
            [
                "type" => "text",
                "title" => "II. L'aplomb du \"perroquet stochastique\"",
                "content" => "Les chercheurs appellent souvent les IA des \"perroquets stochastiques\". Elles répètent des modèles sans conscience.<br><br><b>Étude Vectara :</b> Le taux d'erreur (hallucination) varie de 3 % à 27 % selon les modèles. Cela signifie que la fiabilité n'est jamais garantie à 100 %.<br><br><b>L'affaire juridique de 2023 :</b> Un avocat new-yorkais a été sanctionné par la justice pour avoir déposé un mémoire contenant six décisions de justice inexistantes, générées par ChatGPT. L'IA lui avait pourtant assuré que ces sources étaient réelles. Cela prouve que même les professionnels peuvent être trompés par le ton persuasif de la machine."
            ],
            [
                "type" => "summary",
                "title" => "Guide de survie critique :",
                "content" => "<b>Utiliser l'IA pour la forme, pas pour le fond :</b> Elle est excellente pour structurer un plan ou reformuler, médiocre pour fournir des faits bruts.<br><br><b>Exiger et vérifier les preuves :</b> Ne jamais copier-coller une date ou un nom sans une vérification externe.<br><br><b>L'IA \"hallucine\" par design :</b> Ce n'est pas un bug, c'est le mode de fonctionnement même de la génération de texte."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'inférence statistique",
                "questions" => [
                    [
                        "id" => "hal_1_sp",
                        "label" => "1. Que privilégie l'IA générative lorsqu'elle manque de données ?",
                        "options" => [
                            ["label" => "L'exactitude historique absolue des faits.", "isCorrect" => "false"],
                            ["label" => "La cohérence du langage et le style (le vraisemblable).", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "hal_2_sp",
                        "label" => "2. Comment les chercheurs décrivent-ils parfois les IA ?",
                        "options" => [
                            ["label" => "Comme des perroquets stochastiques.", "isCorrect" => "true"],
                            ["label" => "Comme des moteurs de bases de données parfaites.", "isCorrect" => "false"]
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
        'title' => "Épistémologie de l'IA : Pourquoi la machine hallucine",
        'slug' => 'ia-hallucinations-ter',
        'intro' => [
            "Vérité vs Vraisemblance : Décrypter les hallucinations des LLM",
            "En philosophie ou en sciences, la vérité repose sur une adéquation au réel. Pour une Intelligence Artificielle générative (LLM), la vérité n'existe pas : seule compte la probabilité statistique. C'est ce qui mène aux \"hallucinations\", ces moments où l'IA affirme des contre-vérités avec une assurance déconcertante."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. La mécanique de l'illusion : Le prédicteur de tokens",
                "content" => "Contrairement à une base de connaissances (type Wikipédia), l'IA ne possède pas de modèle du monde. Elle fonctionne par inférence. À partir d'un \"prompt\", elle calcule la suite de mots la plus probable mathématiquement.<br><br>Si le sujet est pointu, l'algorithme comble les lacunes par de l'extrapolation. Comme elle a été entraînée pour être utile et fluide, elle préfère générer une réponse erronée plutôt que d'admettre son ignorance. C'est le principe du \"vraisemblable\" qui l'emporte sur le \"vrai\"."
            ],
            [
                "type" => "text",
                "title" => "II. Les enjeux de la fiabilité (Le facteur Vectara)",
                "content" => "Les statistiques de l'entreprise Vectara montrent que l'hallucination est structurelle : entre 3 % et 27 % des outputs sont factuellement faux.<br><br><b>Conséquence éthique et professionnelle :</b> L'exemple célèbre de l'avocat américain Steven Schwartz, sanctionné pour avoir utilisé des jurisprudences fictives créées par ChatGPT, illustre le danger de la \"confiance aveugle\". L'IA n'est pas une autorité cognitive, mais un outil de traitement du langage."
            ],
            [
                "type" => "text",
                "title" => "III. Méthodologie et Esprit Critique",
                "content" => "Pour un élève de Terminale, l'usage de l'IA doit s'accompagner d'une rigueur scientifique :<br><br><b>Vérification de l'existence des sources :</b> L'IA invente souvent des références bibliographiques ou des URL en combinant des noms d'auteurs réels avec des titres probables.<br><br><b>Triangulation des données :</b> Toute information cruciale doit être confirmée par au moins deux sources indépendantes et primaires.<br><br><b>Analyse de la posture :</b> Le ton docte de l'IA est une caractéristique de son entraînement (RLHF), pas un gage de validité."
            ],
            [
                "type" => "summary",
                "title" => "En résumé",
                "content" => "L'IA est un outil de synthèse et de forme puissant, mais elle est ontologiquement incapable de garantir la vérité. Le garant du savoir, c'est vous."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'illusion probabiliste",
                "questions" => [
                    [
                        "id" => "hal_1_ter",
                        "label" => "1. D'un point de vue épistémologique, comment fonctionne la génération de texte des LLM ?",
                        "options" => [
                            ["label" => "Par une inférence statistique favorisant le vraisemblable, sans modèle du monde.", "isCorrect" => "true"],
                            ["label" => "Par une vérification sémantique croisée avec des adéquations au réel.", "isCorrect" => "false"]
                        ]
                    ],
                    [
                        "id" => "hal_2_ter",
                        "label" => "2. Pourquoi le ton de l'IA paraît-il si certain, même lorsqu'elle hallucine ?",
                        "options" => [
                            ["label" => "C'est une spécificité technique inévitable liée à la présence d'Internet.", "isCorrect" => "false"],
                            ["label" => "Ce ton docte résulte de son entraînement (notamment le RLHF), et non d'une validation factuelle.", "isCorrect" => "true"]
                        ]
                    ]
                ]
            ]
        ]
    ]
];

try {
    foreach ($articlesData as $levelKey => $data) {
        $id_classe = $classes[$levelKey];
        $slug = $data['slug'];

        $checkStmt = $pdo->prepare("SELECT id FROM articles WHERE slug = ?");
        $checkStmt->execute([$slug]);
        
        if ($checkStmt->fetch()) {
            echo "Mise à jour de l'article hallucination (Slug: {$slug}) avec classe $id_classe\n";
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
            echo "Insertion de l'article hallucination (Slug: {$slug}) avec classe $id_classe\n";
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
