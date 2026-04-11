<?php
// backend/insert_usurpation_articles.php
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
        'title' => "Ton streamer préféré est peut-être un robot !",
        'slug' => 'ia-usurpation-65',
        'intro' => [
            "Cette vidéo n'existe pas (et c'est un piège)",
            "Tu scrolles tranquillement et paf : Squeezie ou Inoxtag apparaît. Il te regarde et te dit : « Salut l'équipe, j'offre un iPhone 15 aux 100 premiers qui cliquent ici ! ». Sa voix est la même, son visage aussi. Sauf que… ce n'est pas lui. C'est une IA qui a volé son apparence."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. Le braquage de voix",
                "content" => "Les streamers parlent pendant des heures en vidéo. Pour une IA, c'est un jeu d'enfant d'apprendre à les imiter.<br><b>Le chiffre qui fait peur :</b> Aujourd'hui, une IA n'a besoin que de 3 secondes de ta voix pour pouvoir la cloner et te faire dire n'importe quoi."
            ],
            [
                "type" => "text",
                "title" => "2. Pourquoi font-ils ça ? L'arnaque à la carte bleue",
                "content" => "Le but n'est pas de te faire rire, mais de voler l'argent de tes parents.<br><b>L'histoire vraie :</b> Fin 2023, une fausse vidéo de MrBeast promettait des iPhones pour 2 euros. Des milliers de jeunes ont cliqué, donné les numéros de carte bleue de leurs parents… et tout a été piraté. Le vrai MrBeast n'était même pas au courant !"
            ],
            [
                "type" => "text",
                "title" => "3. Les influenceurs qui n'existent pas",
                "content" => "Certaines stars d'Instagram n'ont même pas de corps !<br><b>Exemple :</b> Aitana Lopez, une influenceuse aux cheveux roses, gagne 10 000 € par mois en faisant des pubs. Pourtant, elle n'existe pas. C'est une image créée par ordinateur. Ses abonnés parlent à du vide."
            ],
            [
                "type" => "table",
                "title" => "Comment repérer le piège ?",
                "headers" => ["Indice", "Probable IA (Arnaque)", "Vrai Créateur"],
                "rows" => [
                    ["Le compte", "Un nom bizarre (ex: Inox_Cadeau_99).", "La chaîne officielle avec le badge bleu."],
                    ["L'offre", "C'est gratuit, clique vite !", "Une vidéo normale, sans argent magique."],
                    ["Le visage", "La bouche bouge un peu bizarrement.", "C'est naturel, on entend les respirations."]
                ]
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — Démêler le Vrai du Faux",
                "questions" => [
                    [
                        "id" => "usu_1_65",
                        "label" => "1. De combien de temps d'enregistrement une IA a-t-elle besoin pour cloner 100% de ta voix ?",
                        "options" => [
                            ["label" => "De plusieurs heures d'enregistrement en studio.", "isCorrect" => "false"],
                            ["label" => "D'environ 3 secondes seulement.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "usu_2_65",
                        "label" => "2. Qui est Aitana Lopez ?",
                        "options" => [
                            ["label" => "Une influenceuse 100 % virtuelle forgée par une IA qui gagne beaucoup d'argent.", "isCorrect" => "true"],
                            ["label" => "La créatrice de l'arnaque aux faux iPhones sur TikTok.", "isCorrect" => "false"]
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
        'title' => "Deepfakes et faux influenceurs, l'illusion totale",
        'slug' => 'ia-usurpation-43',
        'intro' => [
            "Ne crois pas tout ce que ton écran te raconte",
            "Tu penses reconnaître ton YouTubeur favori dans une story TikTok ? Méfie-toi. Aujourd'hui, avec l'IA, l'usurpation d'identité est devenue ultra-facile. On appelle ça le Deepfake."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "1. Le clonage vocal et visuel",
                "content" => "Comme les créateurs de contenu postent énormément, les IA ont des tonnes de données pour s'entraîner.<br><b>Vitesse record :</b> En seulement 3 secondes, un logiciel peut copier ton grain de voix. En rajoutant un filtre sur le visage d'un acteur, l'IA crée un double parfait de n'importe quelle star."
            ],
            [
                "type" => "text",
                "title" => "2. L'objectif : Vider ton compte en banque",
                "content" => "Ces vidéos servent souvent à des arnaques au \"cadeau gratuit\".<br><b>L'exemple MrBeast :</b> Une IA imitant le célèbre YouTubeur a piégé des milliers de personnes en promettant des iPhones presque gratuits. C'était un site de phishing (hameçonnage) pour voler des coordonnées bancaires."
            ],
            [
                "type" => "text",
                "title" => "3. L'influence sans humain",
                "content" => "Il existe désormais des influenceuses 100 % virtuelles, comme Aitana Lopez. Elle a des centaines de milliers d'abonnés, elle voyage (en images générées) et gagne des milliers d'euros. Mais elle n'est faite que de pixels."
            ],
            [
                "type" => "summary",
                "title" => "Ton kit de détection :",
                "content" => "- <b>Vérifie la source :</b> Est-ce le compte officiel certifié ?<br>- <b>Analyse la vidéo :</b> L'IA a souvent du mal avec la synchro des lèvres et les clignements d'yeux.<br>- <b>L'offre trop belle :</b> Si on te promet de l'argent ou un cadeau cher contre un clic, fuis. C'est une arnaque."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'anti-arnaque",
                "questions" => [
                    [
                        "id" => "usu_1_43",
                        "label" => "1. Qu'est-ce qu'une tentative de \"phishing\" (hameçonnage) comme dans l'exemple de MrBeast ?",
                        "options" => [
                            ["label" => "L'utilisation de la confiance d'un visage célèbre pour tromper les gens et voler leurs coordonnées bancaires.", "isCorrect" => "true"],
                            ["label" => "L'utilisation du Deepfake uniquement pour augmenter le nombre d'abonnés de manière légale.", "isCorrect" => "false"]
                        ]
                    ],
                    [
                        "id" => "usu_2_43",
                        "label" => "2. Que révèle l'existence d'Aitana Lopez sur le monde des réseaux sociaux ?",
                        "options" => [
                            ["label" => "Que n'importe qui peut devenir célèbre sans jamais poster de vidéo.", "isCorrect" => "false"],
                            ["label" => "Que des agences peuvent créer de fausses stars génératrices de revenus réels à l'aide de l'IA.", "isCorrect" => "true"]
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
        'title' => "L'ère de l'usurpation d'identité 2.0",
        'slug' => 'ia-usurpation-sp',
        'intro' => [
            "Quand l'IA transforme tes streamers préférés en chevaux de Troie",
            "L'Intelligence Artificielle générative a ouvert la porte à une nouvelle forme de cybercriminalité : l'ingénierie sociale par Deepfake. Le visage de MrBeast ou la voix d'Inoxtag deviennent des outils pour manipuler ton cerveau."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. La data comme matière première",
                "content" => "Les créateurs de contenu sont vulnérables car leur identité numérique est publique.<br><b>Clonage vocal :</b> Avec un échantillon de 3 secondes, les modèles de Text-to-Speech imitent l'intonation et l'accent à la perfection.<br><b>Superposition faciale :</b> L'IA plaque le visage du streamer sur un complice pour rendre l'arnaque crédible."
            ],
            [
                "type" => "text",
                "title" => "II. L'économie de l'arnaque",
                "content" => "En 2023, l'arnaque à l'iPhone de \"MrBeast\" sur TikTok a montré l'efficacité de cette méthode. L'urgence (\"Seulement pour les 100 premiers\") combinée à une figure de confiance (le streamer) court-circuite l'esprit critique. Résultat : des milliers de comptes bancaires s'évaporent."
            ],
            [
                "type" => "text",
                "title" => "III. La montée des avatars synthétiques",
                "content" => "Le cas d'Aitana Lopez pose une question éthique : peut-on être fan d'une personne qui n'existe pas ? Cette influenceuse virtuelle gagne 10 000 €/mois sans jamais avoir respiré. Les marques préfèrent parfois ces modèles IA : ils ne vieillissent pas, ne font pas de polémique et coûtent moins cher."
            ],
            [
                "type" => "table",
                "title" => "Tableau de vigilance",
                "headers" => ["Point de contrôle", "Signal d'alerte (IA / Arnaque)", "Validation (Réel)"],
                "rows" => [
                    ["Authenticité", "Compte récent, peu d'abonnés, pas de badge.", "Historique de posts ancien, compte certifié."],
                    ["Contenu", "Promesse de gain immédiat ou offre choc.", "Contenu habituel du créateur."],
                    ["Audio-visuel", "Voix métallique, grain de peau trop lisse.", "Imperfections naturelles, bruits ambiants."]
                ]
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'ingénierie sociale 2.0",
                "questions" => [
                    [
                        "id" => "usu_1_sp",
                        "label" => "1. Comment appelle-t-on la forme de cybercriminalité qui utilise la confiance envers une personne pour manipuler la cible ?",
                        "options" => [
                            ["label" => "Le brute-forcing algorithmique.", "isCorrect" => "false"],
                            ["label" => "L'ingénierie sociale (Social Engineering).", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "usu_2_sp",
                        "label" => "2. Pourquoi certaines marques préfèrent-elles faire appel à des avatars générés comme Aitana Lopez ?",
                        "options" => [
                            ["label" => "Parce que ces avatars virtuels coûtent moins cher et n'engendrent aucune polémique imprévisible.", "isCorrect" => "true"],
                            ["label" => "Parce qu'elles peuvent légalement pirater l'image des vrais influenceurs de cette manière.", "isCorrect" => "false"]
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
        'title' => "Identité numérique et simulacres à l'ère de l'IA",
        'slug' => 'ia-usurpation-ter',
        'intro' => [
            "De l'usurpation au virtuel : quand l'IA dématérialise l'influence",
            "L'apparition de vidéos hyper-réalistes détournant l'image de personnalités publiques marque une rupture majeure. Nous n'assistons plus seulement à des montages grossiers, mais à la création de simulacres capables de tromper nos sens et de manipuler nos comportements économiques."
        ],
        'sections' => [
            [
                "type" => "text",
                "title" => "I. Le clonage d'identité : un enjeu de cybersécurité",
                "content" => "L'IA générative utilise le deep learning pour modéliser des caractéristiques biométriques (voix, micro-expressions).<br><b>Menace :</b> Il suffit de quelques secondes d'audio pour briser la confiance. Ce \"braquage vocal\" permet de créer des contenus promotionnels frauduleux avec une autorité perçue immense.<br><br><b>Cas d'école :</b> L'arnaque MrBeast sur TikTok a exploité le biais de confiance envers une figure de générosité pour soutirer des données bancaires à grande échelle via du social engineering."
            ],
            [
                "type" => "text",
                "title" => "II. La vacuité de l'influence : l'exemple Aitana Lopez",
                "content" => "L'émergence d'influenceurs 100 % synthétiques comme Aitana Lopez interroge notre rapport à l'altérité.<br><b>Modèle économique :</b> Ces avatars générés par des agences captent des revenus publicitaires réels (jusqu'à 10 000 €/mois) en simulant une vie humaine. C'est le stade ultime de la marchandisation de l'image : l'humain disparaît au profit d'un algorithme de perfection esthétique."
            ],
            [
                "type" => "text",
                "title" => "III. Méthodologie de défense critique",
                "content" => "Face à la prolifération des Deepfakes, la vérification doit devenir un réflexe systémique :<br><br>- <b>Analyse de la chaîne de diffusion :</b> L'URL et le handle du compte sont les premiers indicateurs de fraude.<br>- <b>Examen des artefacts de synthèse :</b> Chercher les incohérences dans la synchro labiale (phonèmes complexes) et les anomalies de textures (cheveux, arrière-plan).<br>- <b>Principe de prudence financière :</b> Aucun créateur légitime ne demande de coordonnées bancaires ou de micro-paiements en échange de cadeaux via des publicités sponsorisées."
            ],
            [
                "type" => "summary",
                "title" => "À retenir :",
                "content" => "Dans un monde de \"post-vérité\" numérique, l'émotion est l'arme de l'arnaqueur. Si une vidéo cherche à provoquer un sentiment d'urgence ou une excitation démesurée, elle est probablement générée par une machine."
            ],
            [
                "type" => "quiz",
                "title" => "🧠 Mini-Quiz — L'ère du Simulacre numérique",
                "questions" => [
                    [
                        "id" => "usu_1_ter",
                        "label" => "1. Sur quel biais cognitif majeur reposait l'arnaque financière des fausses vidéos de MrBeast ?",
                        "options" => [
                            ["label" => "Le biais d'ancrage visuel lié à la résolution supérieure d'une vidéo Deepfake.", "isCorrect" => "false"],
                            ["label" => "Le biais d'autorité et de confiance aveugle envers une figure perçue comme un créateur familier.", "isCorrect" => "true"]
                        ]
                    ],
                    [
                        "id" => "usu_2_ter",
                        "label" => "2. Comment décrire le modèle économique qui soutient les avatars virtuels de type Aitana Lopez ?",
                        "options" => [
                            ["label" => "La commercialisation pure de l'attention et de l'image algorithmique effaçant les coûts humains.", "isCorrect" => "true"],
                            ["label" => "Le financement participatif d'initiatives solidaires sans but publicitaire.", "isCorrect" => "false"]
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
            echo "Mise à jour de l'article usurpation (Slug: {$slug})\n";
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
            echo "Insertion de l'article usurpation (Slug: {$slug})\n";
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
