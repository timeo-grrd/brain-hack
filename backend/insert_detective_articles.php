<?php
// backend/insert_detective_articles.php
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
        'title' => "Deviens un détective du Web !",
        'slug' => 'ia-detective-65',
        'intro' => [
            "Comment repérer une image ou une info bidon ?",
            "Tu te souviens de la photo du Pape en doudoune de rappeur ? C’était une image créée par une IA ! Aujourd'hui, n'importe qui peut fabriquer une fausse image ou une vidéo truquée en deux minutes. Mais pas de panique : les machines laissent souvent des traces. Voici tes astuces pour ne plus te faire piéger."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. Images : Cherche le \"bug\"",
                "content" => "L'IA est très forte, mais elle déteste les petits détails compliqués. Si tu as un doute, zoome sur :<br><br>- <b>Les mains et les dents :</b> C’est le point faible de l’IA. Parfois, elle dessine 6 doigts, ou des dents toutes bizarres et trop nombreuses.<br>- <b>Le texte dans l'image :</b> Regarde les panneaux ou les logos sur les vêtements. Souvent, l’IA écrit du charabia ou des lettres qui ressemblent à du martien.<br>- <b>La physique :</b> Est-ce que les reflets dans les miroirs sont bons ? Est-ce que les ombres vont dans le bon sens ? Souvent, l'IA se trompe."
            ],
            [
                "type" => "text",
                "title" => "2. Texte : Le robot trop poli",
                "content" => "Si tu reçois un message ou que tu lis un article, l'IA a souvent une façon de parler très \"robotique\" :<br><br>- Elle est toujours hyper polie et ne fait jamais d'humour.<br>- Elle utilise toujours les mêmes mots de liaison comme \"Cependant\", \"En conclusion\" ou \"Il est important de\"."
            ],
            [
                "type" => "text",
                "title" => "3. Vidéos : Regarde les yeux",
                "content" => "Dans les fausses vidéos (les Deepfakes), la personne cligne très peu des yeux ou de façon bizarre. Regarde aussi la bouche : est-ce que le son correspond bien au mouvement des lèvres ?"
            ],
            [
                "type" => "summary",
                "title" => "La règle d'or :",
                "content" => "Si une info te choque ou te fait rire très fort, demande à un adulte ou cherche sur un moteur de recherche si un vrai journal en parle. <b>Ne partage jamais avant d'avoir vérifié !</b>"
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'Œil de Lynx",
                "questions" => [
                    [
                        "id" => "det_1_65",
                        "label" => "1. Quel est souvent un bon indice pour repérer une image créée par une IA ?",
                        "options" => [
                            ["label" => "Les couleurs sont toujours en noir et blanc.", "isCorrect" => "false"],
                            ["label" => "Les mains ont parfois 6 doigts ou des formes bizarres.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "det_2_65",
                        "label" => "2. Comment reconnait-on souvent un texte écrit par un robot ?",
                        "options" => [
                            ["label" => "Il est hyper poli et n'utilise jamais d'humour.", "isCorrect" => "true"],
                            ["label" => "Il fait toujours beaucoup de fautes d'orthographe.", "isCorrect" => "false"]
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
        'title' => "Manuel de survie face aux contenus truqués",
        'slug' => 'ia-detective-43',
        'intro' => [
            "Comment savoir si ce que tu vois est réel ?",
            "Avec l’IA, le faux ressemble de plus en plus au vrai. Entre les influenceurs qui font de fausses pubs et les images de célébrités truquées, il est facile de se faire avoir. Voici comment activer ton radar anti-fake."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. Analyser les images au microscope",
                "content" => "Les générateurs comme Midjourney laissent des indices visibles pour ceux qui savent regarder :<br><br>- <b>Les anomalies anatomiques :</b> Les mains fusionnées, les oreilles étranges ou les dents asymétriques.<br>- <b>L'arrière-plan :</b> L'IA est douée pour le sujet principal, mais elle \"fume\" souvent sur les détails au fond (foules floues, écritures bizarres, objets qui flottent)."
            ],
            [
                "type" => "table",
                "title" => "2. Le style de rédaction IA",
                "headers" => ["Indice", "Texte Humain", "Texte IA"],
                "rows" => [
                    ["Ton", "Varié, humour, avis tranchés.", "Neutre, lisse, très poli."],
                    ["Mots-clés", "Vocabulaire de tous les jours.", "\"Il est crucial de\", \"Cependant\"."],
                    ["Structure", "Parfois un peu brouillonne.", "Listes à puces et paragraphes parfaits."]
                ]
            ],
            [
                "type" => "text",
                "title" => "3. Audio et Vidéo : Le test du réalisme",
                "content" => "Pour les clones de voix ou les vidéos truquées, écoute bien : l'IA a souvent une voix trop fluide, sans respiration, sans hésitation (les fameux \"euh...\")."
            ],
            [
                "type" => "summary",
                "title" => "Le bon réflexe : Remonte à la source.",
                "content" => "Si tu vois une info incroyable sur TikTok :<br><br><b>Sors de l'appli.</b><br><b>Vérifie sur Google :</b> Si aucun grand média (journal, radio) n'en parle, c'est sûrement faux.<br><b>Recherche d'image :</b> Utilise Google Lens pour voir d'où vient l'image à l'origine."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'inspecteur des Fakes",
                "questions" => [
                    [
                        "id" => "det_1_43",
                        "label" => "1. Où l'IA cache-t-elle souvent ses erreurs dans une image ?",
                        "options" => [
                            ["label" => "En plein milieu sur le visage principal.", "isCorrect" => "false"],
                            ["label" => "Dans l'arrière-plan avec des textes bizarres ou des foules floues.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "det_2_43",
                        "label" => "2. Quel est le meilleur réflexe si une image incroyable apparaît sur tes réseaux ?",
                        "options" => [
                            ["label" => "Sortir de l'appli et faire une recherche Google Lens ou vérifier sur un média.", "isCorrect" => "true"],
                            ["label" => "La transférer à ses amis pour leur demander ce qu'ils en pensent.", "isCorrect" => "false"]
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
        'title' => "Esprit critique et détection des artefacts d'IA",
        'slug' => 'ia-detective-sp',
        'intro' => [
            "Comment ne pas devenir la victime de la désinformation par IA ?",
            "Aujourd'hui, l'image n'est plus une preuve. La photo du Pape en doudoune ou les deepfakes politiques montrent que la frontière entre réel et virtuel est devenue poreuse. Pour ne pas se laisser manipuler, il faut apprendre à repérer les traces techniques laissées par les algorithmes."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. Les artefacts visuels et géométriques",
                "content" => "Malgré ses progrès, l'IA générative (comme DALL-E) peine avec la cohérence logique :<br><br>- <b>Incohérence lumineuse :</b> Vérifiez la direction des sources lumineuses et la correspondance des reflets dans les yeux ou les miroirs.<br>- <b>Détails typographiques :</b> L'IA génère souvent des glyphes qui imitent l'alphabet sans en respecter la sémantique. Les panneaux de signalisation ou les étiquettes sont souvent illisibles."
            ],
            [
                "type" => "text",
                "title" => "II. Détecter la signature stylistique des LLM (ChatGPT, Claude...)",
                "content" => "Un texte généré par une IA est souvent reconnaissable à sa \"platitude\" :<br><br>- <b>La structure systématique :</b> L'IA adore les introductions formelles, les listes à puces et les conclusions qui résument tout.<br>- <b>L'absence de subjectivité :</b> Contrairement à un humain, l'IA évite de prendre position et utilise un ton excessivement consensuel.<br><br><i>Note :</i> Ne vous fiez pas aveuglément aux outils \"détecteurs d'IA\" en ligne, ils génèrent souvent des faux positifs. Votre analyse est plus fiable."
            ],
            [
                "type" => "text",
                "title" => "III. Vidéos et Voix : La vallée de l'étrange",
                "content" => "Pour les deepfakes, observez la synchro labiale (notamment sur les consonnes occlusives comme P, B, M) et le rythme de la respiration. Une voix clonée manque souvent de micro-variations émotionnelles."
            ],
            [
                "type" => "summary",
                "title" => "Stratégie de vérification :",
                "content" => "Utilisez la recherche inversée (Google Lens, TinEye). Si une image est fausse, des sites de fact-checking l'auront probablement déjà identifiée. En cas de doute, suivez la règle d'or : <b>une émotion forte (colère, choc) doit toujours déclencher une vérification.</b>"
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — Analyse des Artefacts",
                "questions" => [
                    [
                        "id" => "det_1_sp",
                        "label" => "1. Que faut-il analyser pour repérer une incohérence lumineuse dans une image d'IA ?",
                        "options" => [
                            ["label" => "La direction des reflets dans les miroirs et les yeux.", "isCorrect" => "true"],
                            ["label" => "La teinte générale et la saturation des couleurs.", "isCorrect" => "false"]
                        ]
                    ],
                    [
                        "id" => "det_2_sp",
                        "label" => "2. Pourquoi les détecteurs d'IA automatiques ne sont-ils pas totalement fiables ?",
                        "options" => [
                            ["label" => "Parce qu'ils génèrent souvent des faux positifs (accuser un humain de l'écriture d'une machine).", "isCorrect" => "true"],
                            ["label" => "Parce qu'ils ne fonctionnent que sur des images et non sur du texte.", "isCorrect" => "false"]
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
        'title' => "Épistémologie de la preuve à l'ère des Deepfakes",
        'slug' => 'ia-detective-ter',
        'intro' => [
            "Comment authentifier l'information dans un monde saturé par l'IA ?",
            "Nous sommes entrés dans une ère où l'évidence visuelle est contestable. La manipulation par IA (images, vidéos, textes) oblige à repenser notre rapport à la preuve et à l'information."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. Analyse technique des artefacts de génération",
                "content" => "L'IA générative ne possède pas de compréhension des lois physiques. Pour repérer un contenu synthétique, il faut traquer l'incohérence :<br><br>- <b>L'entropie des détails :</b> Observez les zones de haute fréquence (doigts, dents, arrière-plans complexes). L'IA y génère souvent des fusions illogiques ou des répétitions de motifs (patterns).<br>- <b>Cohérence sémantique du texte :</b> Les LLM produisent des textes syntaxiquement parfaits mais parfois sémantiquement creux, marqués par une hyper-structuration et un usage abusif de connecteurs logiques (\"En conclusion\", \"Par ailleurs\")."
            ],
            [
                "type" => "table",
                "title" => "II. Comparatif des signatures cognitives",
                "headers" => ["Critère", "Production Humaine", "Production Artificielle"],
                "rows" => [
                    ["Style", "Idiolecte marqué, fautes, nuances.", "Style neutre, normé, sans biais."],
                    ["Structure", "Rythme asymétrique, digressions.", "Symétrie parfaite, listes structurées."],
                    ["Objectif", "Expression d'une opinion ou d'un fait.", "Optimisation de la réponse au prompt."]
                ]
            ],
            [
                "type" => "text",
                "title" => "III. La méthodologie du \"Fact-Checking\" avancé",
                "content" => "Face à un contenu suspect, la détection visuelle ne suffit plus. Il faut appliquer une méthode journalistique :<br><br>- <b>La Triangulation :</b> L'information est-elle corroborée par des sources primaires institutionnelles ou des agences de presse reconnues ?<br>- <b>Analyse des métadonnées et recherche inversée :</b> Utiliser des outils pour retrouver l'origine d'un fichier et vérifier s'il n'a pas été détourné de son contexte initial.<br>- <b>Le test de l'émotion :</b> L'IA est souvent utilisée pour créer des contenus à forte viralité (biais de confirmation). Si un contenu flatte vos convictions ou provoque un choc émotionnel immédiat, la probabilité d'une manipulation est plus élevée."
            ],
            [
                "type" => "summary",
                "title" => "Conclusion :",
                "content" => "Votre esprit critique est le dernier rempart. À l'heure de l'IA, la règle change : <b>ne croyez plus ce que vous voyez, croyez ce que vous avez vérifié.</b>"
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'ère du Doute Methodique",
                "questions" => [
                    [
                        "id" => "det_1_ter",
                        "label" => "1. Que signifie le 'test de l'émotion' face à un contenu IA ?",
                        "options" => [
                            ["label" => "La propension d'un algorithme à tester nos limites avant de nous censurer.", "isCorrect" => "false"],
                            ["label" => "Le fait qu'un contenu provoquant un choc émotionnel immédiat a plus de risques d'être une manipulation virale.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "det_2_ter",
                        "label" => "2. Qu'est-ce que la triangulation dans la méthodologie du Fast-Checking ?",
                        "options" => [
                            ["label" => "La corroboration d'une information par des sources primaires ou agences reconnues multiples.", "isCorrect" => "true"],
                            ["label" => "L'analyse des trois points de fuite dans une image génératrice d'incohérences.", "isCorrect" => "false"]
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
            echo "Mise à jour de l'article detective (Slug: {$slug})\n";
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
            echo "Insertion de l'article detective (Slug: {$slug})\n";
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
