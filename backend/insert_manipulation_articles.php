<?php
// backend/insert_manipulation_articles.php
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
        'title' => "Es-tu une marionnette sur ton téléphone ?",
        'slug' => 'ia-manipulation-65',
        'intro' => [
            "Tu t'es (probablement) déjà fait manipuler en ligne...",
            "Tu penses que c’est toi qui décides de regarder cette 15ème vidéo de chat ou ce tuto de danse à 23h30 ? Désolé de te décevoir, mais tu es sûrement guidé par une IA conçue pour \"pirater\" ton attention. Elle est cachée partout dans tes applis préférées."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. Le piège à dopamine",
                "content" => "Le but d'un réseau social n'est pas seulement de t'amuser, c'est de te garder connecté le plus longtemps possible. Pour ça, ils utilisent des algorithmes (des IA) qui surveillent tout ce que tu fais :<br><br>- Le temps que tu passes sur une vidéo (même sans mettre de \"like\").<br>- Ce que tes amis regardent.<br><br><b>Le chiffre fou :</b> 70 % de ce que l'on regarde sur YouTube nous est proposé par l'IA, on ne l'a pas cherché nous-mêmes ! En nous montrant des trucs rigolos ou choquants, l'IA fait fabriquer de la dopamine à notre cerveau (l'hormone du plaisir). Résultat : on n'arrive plus à s'arrêter de scroller."
            ],
            [
                "type" => "text",
                "title" => "2. Les Deepfakes : Ne crois pas tout ce que tu vois",
                "content" => "L'IA peut aussi créer de fausses réalités. Ce sont les Deepfakes. On peut faire dire n'importe quoi à un politique ou une star, et même voler ta voix pour faire croire à tes parents que tu es en danger !<br><br><b>À savoir :</b> Les fausses infos circulent 6 fois plus vite que les vraies, car l'IA sait que nous adorons partager ce qui nous choque."
            ],
            [
                "type" => "text",
                "title" => "3. La bulle de filtres",
                "content" => "L'IA ne te montre que des choses avec lesquelles tu es d'accord pour que tu restes \"confortable\". Tu finis par croire que tout le monde pense comme toi. C'est comme si tu étais enfermé dans une pièce où tu n'entends que l'écho de ta propre voix."
            ],
            [
                "type" => "summary",
                "title" => "Ton plan d'action :",
                "content" => "<b>Brise ta bulle :</b> Regarde exprès des comptes différents de tes habitudes.<br><br><b>Respire :</b> Avant de partager un truc incroyable, demande-toi : \"Est-ce vrai ?\". (Regarde les mains sur les photos, l'IA a souvent du mal à les dessiner !).<br><br><b>Mets un réveil :</b> Ne laisse pas l'IA décider de l'heure de ton dodo."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'art de la dopamine",
                "questions" => [
                    [
                        "id" => "man_1_65",
                        "label" => "1. Que fabrique ton cerveau quand tu regardes une vidéo drôle suggérée par l'IA ?",
                        "options" => [
                            ["label" => "De la mélatonine (hormone du sommeil)", "isCorrect" => "false"],
                            ["label" => "De la dopamine (hormone du plaisir)", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "man_2_65",
                        "label" => "2. Qu'est-ce qu'une \"bulle de filtres\" ?",
                        "options" => [
                            ["label" => "Quand l'IA ne te montre que des choses avec lesquelles tu es d'accord.", "isCorrect" => "true"],
                            ["label" => "Un nouveau filtre amusant sur TikTok.", "isCorrect" => "false"]
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
        'title' => "Attention, l'algorithme te surveille !",
        'slug' => 'ia-manipulation-43',
        'intro' => [
            "Qui est vraiment aux commandes quand tu scrolles ?",
            "Tu penses choisir tes vidéos sur TikTok ou Insta ? En réalité, tu es guidé par une Intelligence Artificielle ultra-puissante dont le métier est de capturer ton attention. Voici comment elle tire les ficelles."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. Algorithmes : La chasse à la dopamine",
                "content" => "Le business model des réseaux sociaux est simple : plus tu restes, plus ils vendent de publicités. L'IA analyse tes moindres faits et gestes pour te montrer exactement ce qui va te faire rester.<br><br><b>La stat qui tue :</b> Plus de 70 % des vidéos vues sur YouTube sont suggérées par l'algorithme.<br><br>L'IA utilise tes émotions (colère, rire) pour déclencher de la dopamine dans ton cerveau. C'est ce qui rend le \"défilement infini\" si addictif."
            ],
            [
                "type" => "text",
                "title" => "2. Deepfakes et désinformation",
                "content" => "Avec l'IA, on peut créer des Deepfakes (hypertrucages) : des vidéos où une personne semble dire ou faire des choses totalement fausses.<br><br><b>Le danger :</b> Selon le MIT, une fake news circule 6 fois plus vite qu'une vraie info. Pourquoi ? Parce que l'IA privilégie le spectaculaire et le choquant pour booster l'engagement."
            ],
            [
                "type" => "text",
                "title" => "3. Vivre dans une bulle",
                "content" => "L'IA t'enferme dans une \"bulle de filtres\". Elle ne te propose que des opinions similaires aux tiennes. À force, tu ne vois plus la diversité du monde et tu penses que ta réalité est la seule qui existe."
            ],
            [
                "type" => "summary",
                "title" => "Comment reprendre le contrôle :",
                "content" => "<b>Utilise la règle des 3 secondes :</b> Avant de partager, vérifie la source sur Google.<br><br><b>Défie l'algorithme :</b> Abonne-toi à des thèmes que tu ne connais pas pour \"perdre\" l'IA.<br><br><b>Limite le temps :</b> Si c'est gratuit, c'est que tu es le produit. Ton temps vaut de l'or, ne le donne pas gratuitement à une machine."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — Au coeur de l'algorithme",
                "questions" => [
                    [
                        "id" => "man_1_43",
                        "label" => "1. Pourquoi les fausses infos circulent-elles 6 fois plus vite ?",
                        "options" => [
                            ["label" => "Car l'IA booste spécifiquement ce qui est spectaculaire et choquant.", "isCorrect" => "true"],
                            ["label" => "Parce que les pirates informatiques les envoient à tout le monde par mail.", "isCorrect" => "false"]
                        ]
                    ],
                    [
                        "id" => "man_2_43",
                        "label" => "2. Que veut dire l'expression \"Si c'est gratuit, c'est que tu es le produit\" ?",
                        "options" => [
                            ["label" => "Que l'application te paiera plus tard si tu l'utilises beaucoup.", "isCorrect" => "false"],
                            ["label" => "Que l'application se finance en revendant ton attention et ton temps aux publicités.", "isCorrect" => "true"]
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
        'title' => "L'économie de l'attention et le piratage cognitif",
        'slug' => 'ia-manipulation-sp',
        'intro' => [
            "Tu penses être libre sur tes réseaux ? L'IA a un autre plan pour toi.",
            "Le but des géants de la tech n'est pas de t'informer, mais de monétiser ton temps de cerveau disponible. Pour cela, ils utilisent des algorithmes de recommandation qui sont de véritables \"pirates\" de l'attention."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. Le circuit de la récompense (Dopamine & IA)",
                "content" => "L'IA ne se contente pas de classer des vidéos. Elle prédit ce qui va provoquer une réaction biochimique dans ton cerveau. En analysant ton temps de visionnage et tes interactions, elle identifie tes points faibles émotionnels.<br><br>70 % des contenus consommés sur YouTube sont le résultat de ces suggestions algorithmiques.<br><br>Le défilement infini (\"infinite scroll\") supprime les barrières naturelles du cerveau, créant une boucle de rétroaction dont il est difficile de sortir."
            ],
            [
                "type" => "text",
                "title" => "II. Deepfakes : La fin de la preuve par l'image",
                "content" => "Grâce à l'IA générative, créer un Deepfake est devenu un jeu d'enfant. On peut cloner une voix en 3 secondes ou simuler un discours politique.<br><br><b>Conséquence :</b> Les fausses informations se propagent 6 fois plus vite sur X (Twitter) ou Facebook que les faits réels. L'algorithme favorise le \"clash\" car c'est ce qui génère le plus de temps d'écran."
            ],
            [
                "type" => "text",
                "title" => "III. La bulle de filtres : Un isolement invisible",
                "content" => "En te montrant uniquement ce que tu aimes, l'IA crée un environnement de confirmation. C'est la \"bulle de filtres\" : tu perds l'accès à la contradiction, ce qui renforce la polarisation de la société."
            ],
            [
                "type" => "summary",
                "title" => "Ton kit de survie numérique :",
                "content" => "<b>Audit visuel :</b> Apprends à repérer les erreurs des IA (reflets illogiques, textures de peau trop lisses, anomalies sur les mains).<br><br><b>Diversité volontaire :</b> Casse ton profil utilisateur en cherchant des sujets opposés à tes goûts habituels.<br><br><b>Hygiène mentale :</b> Fixe-toi des limites d'utilisation pour ne pas laisser l'IA gérer ton emploi du temps."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'économie cognitive",
                "questions" => [
                    [
                        "id" => "man_1_sp",
                        "label" => "1. Sur quoi se base le \"défilement infini\" pour créer une dépendance ?",
                        "options" => [
                            ["label" => "Sur un système biochimique de boucle de rétroaction ciblant la dopamine.", "isCorrect" => "true"],
                            ["label" => "Sur un algorithme aléatoire de génération d'images.", "isCorrect" => "false"]
                        ]
                    ],
                    [
                        "id" => "man_2_sp",
                        "label" => "2. Pourquoi l'algorithme favorise-t-il souvent le \"clash\" en ligne ?",
                        "options" => [
                            ["label" => "Parce que les développeurs cherchent délibérément à ruiner la réputation des politiciens.", "isCorrect" => "false"],
                            ["label" => "Car le clash est l'émotion qui génère le plus d'engagement et de temps d'écran.", "isCorrect" => "true"]
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
        'title' => "Ingénierie sociale et IA : L'illusion du libre arbitre",
        'slug' => 'ia-manipulation-ter',
        'intro' => [
            "Sommes-nous les architectes ou les sujets de nos vies numériques ?",
            "Derrière chaque interface se cache un système d'ingénierie sociale piloté par l'IA. Sa mission : maximiser l'engagement utilisateur au détriment, parfois, de la santé mentale et de la vérité factuelle."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. Les algorithmes de recommandation et l'économie de l'attention",
                "content" => "Le concept de \"choix\" est largement illusoire sur les plateformes. L'IA de recommandation agit comme un filtre invisible qui sélectionne notre réalité.<br><br><b>Statistique clé :</b> Le MIT a démontré que les fake news ont une vélocité 6 fois supérieure aux informations vérifiées.<br><br>L'IA exploite nos biais cognitifs et stimule la production de dopamine pour créer une dépendance comportementale. C'est l'essence même de l'économie de l'attention : votre temps de regard est la ressource la plus précieuse du marché."
            ],
            [
                "type" => "text",
                "title" => "II. Deepfakes et érosion de la confiance",
                "content" => "L'émergence des Deepfakes marque une rupture épistémologique : l'image et le son ne font plus office de preuve. L'IA peut aujourd'hui synthétiser une identité complète (voix, visage, expressions) pour manipuler l'opinion publique ou procéder à des escroqueries sophistiquées."
            ],
            [
                "type" => "text",
                "title" => "III. Polarisation et bulles de filtres",
                "content" => "L'algorithme privilégie l'homophilie (nous mettre en relation avec ceux qui nous ressemblent). En nous enfermant dans des bulles de filtres, l'IA réduit l'espace public de débat et favorise le radicalisme. Nous ne voyons plus le monde tel qu'il est, mais tel que l'algorithme pense que nous voulons le voir."
            ],
            [
                "type" => "summary",
                "title" => "Stratégies de résistance critique :",
                "content" => "<b>Déconstruction de l'image :</b> Développer un regard technique sur les médias (recherche inversée d'images, analyse des métadonnées).<br><br><b>Souveraineté attentionnelle :</b> Désactiver les notifications non-essentielles et refuser la lecture automatique (autoplay).<br><br><b>Sortie de la chambre d'écho :</b> Consulter activement des sources d'information variées et contradictoires pour \"rééduquer\" l'algorithme.<br><br><b>En résumé :</b> Si c'est gratuit, c'est que vous êtes le produit. Ne soyez pas la marionnette de l'IA, soyez son utilisateur averti."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — Anthropologie de l'algorithmie",
                "questions" => [
                    [
                        "id" => "man_1_ter",
                        "label" => "1. Quel phénomène psycho-sociologique les bulles de filtres favorisent-elles ?",
                        "options" => [
                            ["label" => "Une ouverture épistémologique et la découverte de nouvelles théories.", "isCorrect" => "false"],
                            ["label" => "La polarisation, l'homophilie et le radicalisme par la perte de l'espace de débat contradictoire.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "man_2_ter",
                        "label" => "2. Pourquoi le Deepfake marque-t-il une rupture épistémologique majeure ?",
                        "options" => [
                            ["label" => "Parce que l'authenticité de l'image et du son ne peut plus servir de preuve évidente.", "isCorrect" => "true"],
                            ["label" => "Car il permet à tout le monde de devenir acteur de cinéma facilement.", "isCorrect" => "false"]
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
            echo "Mise à jour de l'article manipulation (Slug: {$slug})\n";
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
            echo "Insertion de l'article manipulation (Slug: {$slug})\n";
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
