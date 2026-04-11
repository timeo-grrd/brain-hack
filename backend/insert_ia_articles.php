<?php
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

// 6ème - 5ème
$intro_65 = ["Ton téléphone est-il plus intelligent que toi ?\nSpoiler alert : Non ! Mais c'est vrai qu'on peut se poser la question. Quand tu as du mal sur un exercice de maths ou que tu cherches la capitale d'un pays lointain, ton smartphone trouve la réponse en une seconde. L'Intelligence Artificielle (IA) qui est à l'intérieur peut battre des champions d'échecs ou traduire des textes dans 100 langues.\nAlors, qui est le vrai chef ? Faisons le match !"];

$sections_65 = [
    [
        "type" => "text",
        "title" => "Round 1 : La force de calcul (Avantage : Smartphone)",
        "content" => "Si on parle de vitesse, la machine gagne. Ton téléphone ne ressent pas la fatigue et n'oublie rien.\n<br><br><b>La vitesse :</b> Le cerveau de ton téléphone (le processeur) peut faire 35 000 milliards de calculs par seconde !<br><b>La mémoire :</b> Il peut retenir des millions de pages Wikipédia par cœur. Toi, tu as parfois du mal à te souvenir de ce que tu as mangé hier midi.\n<br><br><i>Mais attention : le téléphone ne \"comprend\" pas ce qu'il lit. Il fait juste des calculs ultra-rapides.</i>"
    ],
    [
        "type" => "text",
        "title" => "Round 2 : La vraie intelligence (Avantage : Toi)",
        "content" => "L'intelligence, ce n'est pas juste calculer vite. C'est s'adapter, inventer, et avoir du bon sens. Et là, l'IA est perdue.\n<br><br><b>Le bon sens :</b> Si tu vois un parapluie ouvert dans le salon, tu trouves ça bizarre. L'IA ne connaît pas le monde réel : elle ne sait pas ce que c'est d'être mouillé par la pluie.<br><b>L'énergie (ton super-pouvoir) :</b> Ton cerveau contient 86 milliards de neurones. Pour réfléchir, rêver et faire battre ton cœur, il consomme l'énergie d'une petite ampoule (20 Watts). Pour faire fonctionner une IA comme ChatGPT, il faut des ordinateurs géants qui consomment autant d'électricité qu'une ville entière !\n<br><br>L'IA est un peu comme un \"perroquet savant\". Elle devine le mot qui vient après l'autre, mais elle n'a pas de conscience ni d'émotions."
    ],
    [
        "type" => "table",
        "title" => "Le Bilan du Match",
        "headers" => ["Capacité", "Ton Cerveau (Humain)", "Ton Smartphone (IA)"],
        "rows" => [
            ["Vitesse de calcul", "Lente", "Ultra-rapide"],
            ["Apprentissage", "Quelques exemples suffisent", "A besoin de millions de données"],
            ["Créativité et Bon sens", "Élevée (tu inventes, tu ressens)", "Nulle (elle copie et assemble)"],
            ["Énergie", "20 Watts (Super écologique)", "Des millions de Watts (Très polluant)"]
        ]
    ],
    [
        "type" => "summary",
        "title" => "Conclusion : C'est toi le boss !",
        "content" => "Ton téléphone est juste une super calculatrice. C'est un outil génial, mais il a besoin de toi pour lui donner des ordres et vérifier qu'il ne se trompe pas. L'IA ne te remplacera pas, mais savoir bien s'en servir est un grand avantage. Le pilote, c'est toi !"
    ],
    [
        "type" => "quiz",
        "title" => "🧠 Mini-Quiz — Défie l'IA !",
        "questions" => [
            [
                "id" => "65_q1",
                "label" => "1. Que manque-t-il à l'IA par rapport à nous ?",
                "options" => [
                    ["label" => "La vitesse de calcul", "isCorrect" => false],
                    ["label" => "Le bon sens et les émotions", "isCorrect" => true],
                    ["label" => "La mémoire", "isCorrect" => false]
                ]
            ],
            [
                "id" => "65_q2",
                "label" => "2. Combien d'énergie ton cerveau utilise-t-il ?",
                "options" => [
                    ["label" => "Autant qu'une ville", "isCorrect" => false],
                    ["label" => "Presque rien (20 Watts)", "isCorrect" => true],
                    ["label" => "Des millions de Watts", "isCorrect" => false]
                ]
            ]
        ]
    ]
];

// 4ème - 3ème
$intro_43 = ["Ton téléphone est-il plus intelligent que toi ?\nSpoiler : Non. Mais l'illusion est presque parfaite. Aujourd'hui, quand tu galères sur un problème complexe ou que tu cherches une information obscure, ton smartphone te répond instantanément. L'Intelligence Artificielle (IA) intégrée génère des images, traduit des textes entiers et bat les meilleurs joueurs d'échecs.\nAlors, face à la machine, qui est vraiment aux commandes ?"];

$sections_43 = [
    [
        "type" => "text",
        "title" => "Round 1 : Le traitement de données (Avantage : Smartphone)",
        "content" => "Si l'on s'en tient à la vitesse brute et à la mémoire, la machine écrase l'humain. Elle ne connaît ni la fatigue, ni l'étourderie.\n<br><br><b>La puissance brute :</b> Les puces des smartphones récents réalisent plus de 35 billions (35 000 milliards) d'opérations par seconde pour faire tourner l'IA.\n<br><b>Le stockage :</b> Ton téléphone mémorise des millions de pages web au mot près. Ton cerveau, lui, a ses propres failles de mémoire.\n<br><br><i>Cependant, l'IA excelle uniquement dans le traitement de données. Elle repère des modèles mathématiques à la vitesse de la lumière, mais elle ne \"comprend\" absolument rien à ce qu'elle génère.</i>"
    ],
    [
        "type" => "text",
        "title" => "Round 2 : L'adaptabilité et le bon sens (Avantage : Humain)",
        "content" => "L'intelligence véritable englobe la créativité, l'empathie et la logique du monde réel. Sur ce terrain, l'IA est hors-jeu.\n<br><br><b>La logique humaine :</b> Un parapluie ouvert dans un salon te paraîtra illogique. L'IA, elle, n'a aucune expérience physique du monde. Elle ignore la sensation de la pluie.\n<br><b>Le miracle énergétique :</b> Ton cerveau abrite 86 milliards de neurones. Il fonctionne, réfléchit et gère ton corps avec seulement 20 Watts (l'équivalent d'une petite ampoule LED).\n<br><b>Le gouffre écologique :</b> Entraîner une IA générative demande des milliers de serveurs géants qui consomment l'équivalent électrique d'une petite ville.\n<br><br>En réalité, l'IA est un \"perroquet stochastique\" (basé sur des probabilités). Elle prédit simplement le mot le plus logique à placer après le précédent, sans conscience ni émotion."
    ],
    [
        "type" => "table",
        "title" => "Le Tableau des Scores",
        "headers" => ["Capacité", "Cerveau Humain", "Smartphone (IA)"],
        "rows" => [
            ["Traitement de l'info", "Lent mais complexe", "Ultra-rapide mais basique"],
            ["Méthode d'apprentissage", "Intuitif (peu d'exemples)", "Statistique (des millions de données)"],
            ["Créativité / Bon sens", "Excellente (intuition, émotion)", "Inexistante (imitation pure)"],
            ["Bilan carbone", "20 Watts (Très écologique)", "Gigantesque (Impact fort)"]
        ]
    ],
    [
        "type" => "summary",
        "title" => "Conclusion : Tu restes le maître du jeu",
        "content" => "Ton téléphone n'est qu'une calculatrice sous stéroïdes. C'est un outil puissant, mais qui dépend de toi pour être dirigé et surveillé (les IA inventent souvent des fausses informations, ce qu'on appelle des \"hallucinations\"). L'IA ne te remplacera pas, mais la personne qui saura la maîtriser aura un coup d'avance."
    ],
    [
        "type" => "quiz",
        "title" => "🧠 Mini-Quiz — L'illusion de l'IA",
        "questions" => [
            [
                "id" => "43_q1",
                "label" => "1. Qu'est-ce qu'une \"hallucination\" pour une IA ?",
                "options" => [
                    ["label" => "C'est quand elle invente de fausses informations", "isCorrect" => true],
                    ["label" => "C'est un bug d'affichage écran", "isCorrect" => false],
                    ["label" => "C'est quand elle devient créative avec des images", "isCorrect" => false]
                ]
            ],
            [
                "id" => "43_q2",
                "label" => "2. Comment l'IA générative fabrique ses textes ?",
                "options" => [
                    ["label" => "Elle ressent des émotions et les écrit", "isCorrect" => false],
                    ["label" => "En prédisant statistiquement le mot le plus logique", "isCorrect" => true],
                    ["label" => "Elle demande à de vrais humains en coulisse", "isCorrect" => false]
                ]
            ]
        ]
    ]
];


// Seconde - Première
$intro_sp = ["Votre smartphone est-il plus intelligent que vous ?\nSpoiler alert : Non. Cependant, le doute est légitime. Face à un problème de mathématiques ardu ou une recherche complexe, votre smartphone fournit une réponse en une fraction de seconde. Les systèmes d'Intelligence Artificielle (IA) actuels battent des grands maîtres aux échecs, génèrent des œuvres d'art visuelles et maîtrisent des dizaines de langues.\nMais cette puissance de calcul est-elle synonyme d'intelligence ? Comparons nos capacités."];

$sections_sp = [
    [
        "type" => "text",
        "title" => "1. Puissance de calcul et traitement statistique (Avantage : Machine)",
        "content" => "Si l'on définit l'intelligence uniquement par la vitesse de traitement et la capacité de mémorisation, la machine l'emporte. L'IA ne subit ni fatigue cognitive ni baisse de concentration.\n<br><br><b>La démesure technologique :</b> Le processeur neuronal d'un smartphone récent exécute plus de 35 billions d'opérations à la seconde.\n<br><b>La base de données :</b> Une IA accède instantanément à l'équivalent de millions d'encyclopédies.\n<br><br><i>Néanmoins, l'IA ne fait que du traitement de données et des probabilités. Elle identifie des motifs (patterns) mathématiques extrêmement complexes, mais elle est dépourvue de toute compréhension sémantique de ce qu'elle produit.</i>"
    ],
    [
        "type" => "text",
        "title" => "2. Cognition, bon sens et efficacité énergétique (Avantage : Humain)",
        "content" => "La véritable intelligence réside dans l'adaptabilité, l'esprit critique, l'empathie et la compréhension du contexte.\n<br><br><b>Le sens des réalités :</b> Si une image montre un parapluie ouvert en intérieur, vous percevez immédiatement l'incohérence. L'IA, elle, n'a aucune expérience empirique du monde.\n<br><b>L'optimisation biologique :</b> Votre cerveau, composé d'environ 86 milliards de neurones, gère des tâches d'une complexité inouïe (conscience, régulation du corps, réflexion abstraite) en consommant à peine 20 Watts (soit une ampoule basse consommation).\n<br><b>Le coût environnemental de l'IA :</b> À l'inverse, l'entraînement de modèles comme ChatGPT requiert des data centers titanesques, dont la consommation électrique équivaut à celle d'une agglomération entière.\n<br><br>L'IA générative fonctionne finalement comme un perroquet probabiliste : elle assemble les mots selon leur probabilité d'apparition conjointe, sans aucune intention créative originale."
    ],
    [
        "type" => "table",
        "title" => "Comparatif Cognitif vs Artificiel",
        "headers" => ["Critère", "Humain (Cognition)", "Machine (IA)"],
        "rows" => [
            ["Vitesse d'exécution", "Modérée", "Instantanée"],
            ["Processus d'apprentissage", "Qualitatif (déduction, abstraction)", "Quantitatif (Deep learning)"],
            ["Esprit critique & Contexte", "Maîtrisé", "Absent (erreurs fréquentes)"],
            ["Efficacité énergétique", "Exceptionnelle (20 Watts)", "Énergivore (Impact majeur)"]
        ]
    ],
    [
        "type" => "summary",
        "title" => "Conclusion : L'outil nécessite une conscience",
        "content" => "Votre téléphone est un formidable accélérateur de productivité, une \"calculatrice sous stéroïdes\". Mais il a un besoin impératif de votre esprit critique pour formuler des requêtes (prompts), vérifier la véracité de ses réponses (pour éviter les fameuses \"hallucinations\" de l'IA) et encadrer son usage éthiquement. Ce n'est pas l'IA qui vous remplacera, mais potentiellement un autre humain qui saura mieux l'utiliser que vous."
    ],
    [
        "type" => "quiz",
        "title" => "🧠 Mini-Quiz — L'Avantage Humain",
        "questions" => [
            [
                "id" => "sp_q1",
                "label" => "1. Quel processus d'apprentissage caractérise l'Intelligence Artificielle ?",
                "options" => [
                    ["label" => "La déduction qualitative", "isCorrect" => false],
                    ["label" => "L'expérience empirique du monde physique", "isCorrect" => false],
                    ["label" => "L'identification quantitative de motifs (Deep learning)", "isCorrect" => true]
                ]
            ],
            [
                "id" => "sp_q2",
                "label" => "2. Pourquoi évoque-t-on les 20 Watts concernant le cerveau humain ?",
                "options" => [
                    ["label" => "C'est sa puissance électrique pour émettre de la lumière", "isCorrect" => false],
                    ["label" => "C'est l'illustration de son efficacité énergétique exceptionnelle", "isCorrect" => true],
                    ["label" => "C'est le minimum requis pour ne pas s'endormir le matin", "isCorrect" => false]
                ]
            ]
        ]
    ]
];

// Terminale
$intro_ter = ["Votre téléphone est-il plus intelligent que vous ?\nLa réponse courte est non. Pourtant, la question soulève un véritable enjeu épistémologique et philosophique. Lorsque votre smartphone résout un système d'équations complexe ou synthétise la géopolitique d'un pays en un dixième de seconde, il mime la réflexion. L'Intelligence Artificielle (IA) générative produit des textes, du code ou des images avec une fluidité bluffante.\nFaut-il pour autant confondre puissance computationnelle et intelligence véritable ?"];

$sections_ter = [
    [
        "type" => "text",
        "title" => "I. La suprématie du calcul et de l'architecture algorithmique",
        "content" => "Sur le plan strictement quantitatif, l'architecture d'un smartphone surpasse les capacités humaines. La machine ignore les biais de fatigue et les limites de la mémoire à court terme.\n<br><br><b>Puissance de traitement :</b> Les puces dédiées à l'IA (NPU) des smartphones récents réalisent plus de 35 billions d'opérations par seconde.\n<br><b>Traitement de l'information :</b> L'IA excelle dans la reconnaissance de patterns statistiques à l'échelle du Big Data.\n<br><br><i>Toutefois, ce processus est purement mathématique. L'IA ne \"comprend\" pas le monde ; elle calcule des vecteurs de probabilités pour lier des mots ou des pixels entre eux. C'est le principe du \"perroquet stochastique\".</i>"
    ],
    [
        "type" => "text",
        "title" => "II. Le monopole humain : Conscience, intentionnalité et thermodynamique",
        "content" => "L'intelligence humaine se définit par la conscience de soi, l'intentionnalité (le fait de donner du sens), l'empathie et la compréhension empirique du monde physique.\n<br><br><b>L'expérience du réel :</b> Le bon sens humain perçoit immédiatement l'absurdité d'un parapluie ouvert dans un salon. L'IA générative n'a pas de corps, pas d'environnement physique ; sa seule réalité est le texte.\n<br><b>Le miracle thermodynamique :</b> Le cerveau humain (86 milliards de neurones) est une merveille d'optimisation énergétique. Il soutient la conscience, la pensée abstraite et l'homéostasie du corps avec une puissance d'environ 20 Watts.\n<br><b>La fracture écologique :</b> En opposition, l'entraînement et l'inférence des grands modèles de langage (LLM) exigents des centres de données colossaux, soulevant des problématiques écologiques majeures (consommation d'eau et d'électricité)."
    ],
    [
        "type" => "table",
        "title" => "Synthèse des paradigmes",
        "headers" => ["Caractéristique", "Intelligence Biologique", "Intelligence Artificielle"],
        "rows" => [
            ["Nature de l'opération", "Sémantique (Sens)", "Syntaxique et Statistique"],
            ["Apprentissage", "Heuristique (Généralisation)", "Inductif (Massives databases)"],
            ["Intentionnalité", "Consciente et créative", "Nulle (Assemblage probabiliste)"],
            ["Rendement énergétique", "Optimal (~20W)", "Critique (Gourmand en ressources)"]
        ]
    ],
    [
        "type" => "summary",
        "title" => "Conclusion : L'esprit critique comme boussole",
        "content" => "Votre smartphone n'est pas une entité pensante ; c'est un outil statistique prodigieux. Il dépend entièrement de la supervision humaine pour le diriger, encadrer ses biais algorithmiques, et surtout, pallier ses \"hallucinations\" (lorsque la machine affirme avec aplomb des faits statistiquement probables mais factuellement faux). L'enjeu de demain n'est pas la compétition avec l'IA, mais la maîtrise éthique et critique de cet outil. Le pilote de cette révolution, c'est l'humain."
    ],
    [
        "type" => "quiz",
        "title" => "🧠 Mini-Quiz — Épistémologie de l'IA",
        "questions" => [
            [
                "id" => "ter_q1",
                "label" => "1. Sur quel plan l'Intelligence Biologique (Humaine) possède-t-elle le monopole absolu ?",
                "options" => [
                    ["label" => "L'induction statistique", "isCorrect" => false],
                    ["label" => "L'intentionnalité sémantique et la compréhension empirique", "isCorrect" => true],
                    ["label" => "La syntaxe probabiliste", "isCorrect" => false]
                ]
            ],
            [
                "id" => "ter_q2",
                "label" => "2. Pourquoi qualifie-t-on les LLM de \"perroquets stochastiques\" ?",
                "options" => [
                    ["label" => "Car ils se contentent de calculer des vecteurs de probabilités sans comprendre le sens", "isCorrect" => true],
                    ["label" => "Car ils imitent toutes les voix humaines à la perfection", "isCorrect" => false],
                    ["label" => "Car leur rendement énergétique thermodynamique est inefficace", "isCorrect" => false]
                ]
            ]
        ]
    ]
];

$articles = [
    "6ème-5ème" => ["intro" => json_encode($intro_65), "sections" => json_encode($sections_65)],
    "4ème-3ème" => ["intro" => json_encode($intro_43), "sections" => json_encode($sections_43)],
    "Seconde-Première" => ["intro" => json_encode($intro_sp), "sections" => json_encode($sections_sp)],
    "Terminale" => ["intro" => json_encode($intro_ter), "sections" => json_encode($sections_ter)]
];

// Clean existing exact matched articles to prevent huge duplication on reset
try {
    // Delete potential earlier attempts
    $stmt = $pdo->prepare("DELETE FROM articles WHERE slug LIKE 'ia-featured-card-%'");
    $stmt->execute();
    $stmt = $pdo->prepare("DELETE FROM articles WHERE slug = 'ia-featured-card'");
    $stmt->execute();
    
    // Fallback if the legacy article with no slug '11111111-1111-1111-1111-111111111111' is present
    $stmt = $pdo->prepare("DELETE FROM articles WHERE id = '11111111-1111-1111-1111-111111111111'");
    $stmt->execute();
} catch(Exception $e) {}

$stmt_ins = $pdo->prepare("INSERT INTO articles (id, slug, title, intro, sections, id_classe, created_at) VALUES (?, ?, 'L\'intelligence au téléphone', ?, ?, ?, NOW())");

$slug_map = [
    "6ème-5ème" => "ia-featured-card-65",
    "4ème-3ème" => "ia-featured-card-43",
    "Seconde-Première" => "ia-featured-card-sp",
    "Terminale" => "ia-featured-card-ter"
];

foreach ($articles as $nom_groupe => $article_data) {
    echo "Processing $nom_groupe...\n";
    $stmt = $pdo->prepare("SELECT id FROM classes WHERE nom_groupe = ?");
    $stmt->execute([$nom_groupe]);
    $classe = $stmt->fetch();
    
    if($classe) {
        $stmt_ins->execute([
            generateUuid(),
            $slug_map[$nom_groupe],
            $article_data['intro'],
            $article_data['sections'],
            $classe['id']
        ]);
        echo "Inserted for $nom_groupe (Class ID: {$classe['id']})\n";
    } else {
        echo "Class not found: $nom_groupe\n";
    }
}

echo "Done.\n";
