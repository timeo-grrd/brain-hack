<?php
// backend/insert_school_articles.php
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
        'title' => "Devoirs et IA : Super-pouvoir ou gros piège ?",
        'slug' => 'ia-school-65',
        'intro' => [
            "Faire ses devoirs avec l'IA : l'astuce de génie ou le pire cauchemar ?",
            "Il est dimanche soir, 22h, et tu as oublié ton exposé de SVT pour demain. La tentation est forte : ouvrir ChatGPT, copier le sujet, et faire un gros copier-coller (C/C). En 10 secondes, c'est fini. Magique ? Non, c'est un piège !"
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. Pourquoi le mode \"Copier-Coller\" est ton ennemi",
                "content" => "- <b>Le hors-sujet :</b> L'IA ne va pas dans ton collège. Elle peut te donner des réponses trop compliquées ou qui n'ont rien à voir avec ce que le prof a demandé.<br>- <b>Les mensonges :</b> L'IA peut inventer des dates ou des citations. Si tu les recopies, tu auras une mauvaise note pour avoir écrit des bêtises.<br>- <b>Le vide le jour du contrôle :</b> Si l'IA réfléchit à ta place, ton cerveau s'endort. Le jour de l'examen, sans téléphone, tu seras tout seul face à ta feuille blanche."
            ],
            [
                "type" => "text",
                "title" => "2. Comment les profs te grillent tout de suite",
                "content" => "Ton prof connaît ta façon de parler. Si soudainement tu écris comme un robot avec des mots compliqués comme \"néanmoins\" ou \"il est crucial de souligner\", il va avoir un gros doute. Et si il te demande d'expliquer un mot que tu as écrit et que tu ne sais pas le faire... tu es démasqué !"
            ],
            [
                "type" => "text",
                "title" => "3. L'astuce de génie : L'IA comme \"Super Coach\"",
                "content" => "L'idée, c'est d'utiliser l'IA pour t'aider à comprendre, pas pour travailler à ta place :<br>- <b>Pour trouver des idées :</b> Ne lui demande pas d'écrire, demande-lui : \"Donne-moi 3 idées de thèmes pour mon exposé sur les volcans.\"<br>- <b>Pour comprendre :</b> \"Explique-moi les fractions comme si j'avais 8 ans.\"<br>- <b>Pour réviser :</b> \"Pose-moi 5 questions pour voir si je connais bien ma leçon d'histoire.\""
            ],
            [
                "type" => "summary",
                "title" => "À retenir :",
                "content" => "L'IA est comme un entraîneur de sport. Si c'est lui qui soulève les poids, c'est lui qui devient musclé, pas toi !"
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'anti Copier-Coller",
                "questions" => [
                    [
                        "id" => "sch_1_65",
                        "label" => "1. Pourquoi l'IA peut-elle te faire avoir une mauvaise note si tu fais un simple Copier-Coller ?",
                        "options" => [
                            ["label" => "Parce que l'IA va envoyer un message à tes parents.", "isCorrect" => "false"],
                            ["label" => "Parce qu'elle peut inventer des dates ou être totalement hors-sujet par rapport à ton cours.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "sch_2_65",
                        "label" => "2. Comment le prof peut-il deviner que tu as utilisé l'IA ?",
                        "options" => [
                            ["label" => "Parce que tu utilises des mots trop compliqués et pas normaux pour ton âge (comme 'néanmoins').", "isCorrect" => "true"],
                            ["label" => "Parce que ton texte sera écrit à l'ordinateur.", "isCorrect" => "false"]
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
        'title' => "IA et Devoirs : Ne sois pas une victime du copier-coller",
        'slug' => 'ia-school-43',
        'intro' => [
            "L'astuce de génie pour progresser ou le piège qui va te couler ?",
            "L'IA peut rédiger une dissertation en 10 secondes. Pour un élève de 3ème qui a la flemme, ça ressemble au paradis. Mais en réalité, c'est le meilleur moyen de rater ton année (et ton Brevet)."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. Le piège du \"C/C\" (Copier-Coller)",
                "content" => "Demander à l'IA de faire ton travail à ta place, c'est prendre trois gros risques :<br>- <b>L'hallucination :</b> L'IA invente des faits historiques ou des formules de maths.<br>- <b>Le décalage :</b> Elle utilise des notions de lycée ou d'université que tu n'as pas encore apprises.<br>- <b>L'échec à l'examen :</b> Sans ton \"assistant\" le jour du Brevet, ton cerveau sera incapable de construire un raisonnement tout seul."
            ],
            [
                "type" => "text",
                "title" => "2. Ton prof est plus malin que tu ne le penses",
                "content" => "Les profs voient passer des centaines de copies. Ils repèrent tout de suite le style \"IA\" : c'est trop parfait, trop lisse, et rempli de mots de liaison bizarres (\"en outre\", \"il est indéniable que\"). Plus d'un enseignant sur deux a déjà sanctionné un élève pour ça."
            ],
            [
                "type" => "table",
                "title" => "3. Utilise l'IA comme un prof particulier 24h/24",
                "headers" => ["Ce qu'il ne faut PAS faire", "Ce qu'il FAUT faire (Le Super-Pouvoir)"],
                "rows" => [
                    ["Écris ma rédaction de français.", "Donne-moi un plan pour ma rédaction."],
                    ["Fais mes exercices de maths.", "Explique-moi cette règle que je n'ai pas comprise."],
                    ["Copier sans lire.", "Demander à l'IA de te tester avec un quiz."]
                ]
            ],
            [
                "type" => "summary",
                "title" => "Le conseil :",
                "content" => "L'IA doit être ton coach, pas ton remplaçant. Si elle fait tout le boulot, c'est elle qui devient intelligente, pas toi."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'élève intelligent",
                "questions" => [
                    [
                        "id" => "sch_1_43",
                        "label" => "1. Quel est le plus gros risque à l'examen (comme le Brevet) si on a toujours utilisé l'IA pour ses devoirs ?",
                        "options" => [
                            ["label" => "Que le cerveau n'ait pas appris à construire un raisonnement tout seul face à une copie blanche.", "isCorrect" => "true"],
                            ["label" => "Que les examinateurs vérifient ton téléphone et effacent la copie.", "isCorrect" => "false"]
                        ]
                    ],
                    [
                        "id" => "sch_2_43",
                        "label" => "2. Quelle est la bonne manière d'utiliser l'IA pour une rédaction ?",
                        "options" => [
                            ["label" => "Faire écrire toute la rédaction et changer quelques mots pour cacher la triche.", "isCorrect" => "false"],
                            ["label" => "Demander à l'IA de l'aide pour structurer le plan ou trouver des idées de sujets.", "isCorrect" => "true"]
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
        'title' => "Stratégie IA : Deviens un élève augmenté, pas un robot",
        'slug' => 'ia-school-sp',
        'intro' => [
            "Faire ses devoirs avec l'IA : l'astuce de génie ou le sabordage intellectuel ?",
            "Avec le Bac qui approche, l'IA générative semble être l'outil miracle. Mais attention : l'utiliser comme une béquille pour éviter l'effort est le pire calcul possible pour tes études supérieures."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. Le danger de l'atrophie cognitive",
                "content" => "Le \"Copier-Coller\" automatique présente trois failles majeures :<br>- <b>L'absence de sémantique :</b> L'IA ne comprend pas ton cours. Elle génère du texte probable, pas forcément exact. Tu risques de rendre un devoir techniquement \"joli\" mais totalement hors-sujet.<br>- <b>Les hallucinations factuelles :</b> Elle peut inventer des citations de poètes ou des dates de traités.<br>- <b>Le crash du Bac :</b> L'examen se fait sans écran. Si ton cerveau n'a pas appris à structurer une pensée toute l'année, la feuille blanche est garantie."
            ],
            [
                "type" => "text",
                "title" => "II. La signature stylistique de la machine",
                "content" => "Les enseignants développent un flair pour l'IA. Elle a un vocabulaire standardisé et une structure trop prévisible (listes à puces systématiques, paragraphes de taille identique). Utiliser des termes comme \"en conclusion\", \"il est impératif de noter\" ou \"néanmoins\" alors que ce n'est pas ton style habituel te grillera en 30 secondes."
            ],
            [
                "type" => "text",
                "title" => "III. La méthode \"élève augmenté\"",
                "content" => "L'IA est un excellent partenaire de brainstorming :<br>- <b>Débloquer la page blanche :</b> \"Donne-moi 5 angles différents pour traiter ce sujet de géographie.\"<br>- <b>Vulgarisation :</b> \"Explique-moi la différence entre mitose et méiose simplement.\"<br>- <b>Correction critique :</b> Donne-lui ton propre texte et demande-lui : \"Quels sont les points faibles de mon argumentation ?\""
            ],
            [
                "type" => "summary",
                "title" => "L'analogie à retenir :",
                "content" => "Si ton coach sportif soulève les haltères à ta place, c'est lui qui prend du muscle. Utilise l'IA pour comprendre, pas pour remplacer ton intelligence."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'élève augmenté",
                "questions" => [
                    [
                        "id" => "sch_1_sp",
                        "label" => "1. Que signifie le risque d'atrophie cognitive face à l'utilisation mécanique de l'IA ?",
                        "options" => [
                            ["label" => "Ton cerveau perd l'habitude d'organiser ses idées, rendant l'examen blanc terrifiant.", "isCorrect" => "true"],
                            ["label" => "Ta mémoire à court terme diminue à cause de la lumière bleue des écrans.", "isCorrect" => "false"]
                        ]
                    ],
                    [
                        "id" => "sch_2_sp",
                        "label" => "2. Quelle erreur stylistique trahit souvent l'élève utilisant grossièrement un LLM (comme ChatGPT) ?",
                        "options" => [
                            ["label" => "Insérer beaucoupTropDeMajusculesSansEspace.", "isCorrect" => "false"],
                            ["label" => "L'utilisation de structures trop lisses, de listes à puces systématiques et de mots de liaison génériques.", "isCorrect" => "true"]
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
        'title' => "Éthique et Méthodologie : L'IA, partenaire ou parasite ?",
        'slug' => 'ia-school-ter',
        'intro' => [
            "Utiliser l'IA pour ses devoirs : optimisation ou suicide intellectuel ?",
            "En Terminale, la charge de travail est lourde. L'IA générative peut paraître salvatrice pour boucler une dissertation de philo ou un exercice de spécialité. Mais l'utiliser de manière mécanique est une erreur stratégique majeure."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. Le risque de la dépendance algorithmique",
                "content" => "Déléguer la production de ses devoirs à une IA comporte des risques épistémologiques :<br>- <b>Hallucinations et sources apocryphes :</b> L'IA peut générer des références bibliographiques inexistantes.<br>- <b>Déconnexion pédagogique :</b> L'IA ne connaît pas les exigences spécifiques du Bulletin Officiel (BO) ou les attentes de votre professeur.<br>- <b>L'atrophie de la réflexion :</b> La compétence la plus recherchée dans le supérieur est la capacité d'analyse critique. En copiant-collant, vous déléguez votre propre processus d'apprentissage."
            ],
            [
                "type" => "text",
                "title" => "II. La détection stylométrique",
                "content" => "Les enseignants repèrent la \"prose statistique\" de l'IA : un ton excessivement neutre, une structure de paragraphe parfaitement symétrique et un usage abusif de connecteurs logiques (\"en outre\", \"nonobstant\", \"il est crucial de souligner\"). Le test ultime reste l'interrogation orale : si l'élève est incapable d'expliciter son propre raisonnement, la fraude est avérée."
            ],
            [
                "type" => "table",
                "title" => "III. Vers une utilisation heuristique de l'IA",
                "headers" => ["Usage Parasitaire (Le Piège)", "Usage Heuristique (Le Levier)"],
                "rows" => [
                    ["Générer l'intégralité d'un commentaire.", "Demander des pistes d'analyse ou un plan détaillé."],
                    ["Résumer un livre sans l'avoir lu.", "Demander une explication sur un passage précis et complexe."],
                    ["Utiliser l'IA pour masquer ses lacunes.", "Demander à l'IA de générer un sujet de type Bac pour s'entraîner."]
                ]
            ],
            [
                "type" => "summary",
                "title" => "Conclusion :",
                "content" => "L'intelligence artificielle est un multiplicateur de puissance. Si vous multipliez zéro (votre effort) par l'IA, le résultat reste zéro. Utilisez l'IA pour challenger votre pensée, pas pour l'éteindre. Le pilote, c'est vous."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — Épistémologie et Méthode",
                "questions" => [
                    [
                        "id" => "sch_1_ter",
                        "label" => "1. Selon les enseignants, quelle est la limite de l'IA face aux attentes académiques officielles ?",
                        "options" => [
                            ["label" => "Elle ne connaît pas précisément les exigences méthodologiques du Bulletin Officiel (BO).", "isCorrect" => "true"],
                            ["label" => "Elle ne connaît aucune date historique correcte car elle n'a pas accès à Internet.", "isCorrect" => "false"]
                        ]
                    ],
                    [
                        "id" => "sch_2_ter",
                        "label" => "2. Comment qualifier l'usage où l'on demande à l'IA d'expliquer un passage complexe plutôt que de rédiger ?",
                        "options" => [
                            ["label" => "C'est un usage parasitaire axé sur la triche intellectuelle.", "isCorrect" => "false"],
                            ["label" => "C'est un usage heuristique et un effet de levier pour la compréhension.", "isCorrect" => "true"]
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
            echo "Mise à jour de l'article school (Slug: {$slug})\n";
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
            echo "Insertion de l'article school (Slug: {$slug})\n";
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
