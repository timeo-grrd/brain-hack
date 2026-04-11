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

$slug = 'cest-quoi-lia';
$title = "C'est quoi l'IA ?";

$intro = [
    "Tu entends ce mot 50 fois par jour : aux infos, au lycée, sur TikTok... \"L'IA a fait ci\", \"L'IA va faire ça\". Mais si on te demande d'expliquer ce que c'est exactement à tes grands-parents, tu dis quoi ? Un robot invisible ? Un super-cerveau dans le cloud ?",
    "<strong>Brisons le mythe tout de suite :</strong> l'Intelligence Artificielle n'a rien d'intelligent au sens humain. C'est un programme informatique géant, basé sur des mathématiques et des statistiques ultra-poussées. Son but ? Imiter la façon dont les humains apprennent et résolvent des problèmes."
];

$sections = [
    [
        "type" => "text",
        "title" => "1. Comment on \"éduque\" une IA (Le test du petit chat)",
        "content" => "Pour comprendre l'IA, il faut comprendre comment on la programme. C'est ce qu'on appelle le Machine Learning (l'apprentissage automatique). Imaginons que tu veuilles apprendre à un ordinateur à reconnaître une photo de chat.<br><br><strong>La vieille méthode (sans IA) :</strong> Le programmeur devait écrire des milliers de règles manuelles. \"Un chat a deux oreilles pointues, des moustaches, une queue, des poils...\" Le problème ? Si tu lui montres un chat sans poils (comme un Sphynx) ou une photo de chat de dos, l'ordinateur plante. Il ne reconnaît plus les règles.<br><br><strong>La méthode IA (Machine Learning) :</strong> Le programmeur ne donne aucune règle. Il se contente de montrer à l'ordinateur 10 millions de photos de chats et 10 millions de photos de chiens, en lui disant qui est qui. En analysant les pixels, l'ordinateur va finir par \"deviner\" tout seul les points communs mathématiques qui font qu'un chat est un chat. Il a appris par l'exemple."
    ],
    [
        "type" => "text",
        "title" => "2. Son carburant : Tes données (La \"Data\")",
        "content" => "L'IA est comme une voiture de course de Formule 1. Le moteur est surpuissant, mais sans carburant, il ne sert à rien. Le carburant de l'IA, ce sont les données (textes, images, vidéos, musiques).<br><br><i>La stat vertigineuse :</i> Pour entraîner un modèle comme celui de ChatGPT, les ingénieurs lui ont fait \"lire\" quasiment tout ce qui existe sur internet : des millions d'articles Wikipédia, des milliards de pages web, des livres numérisés... Pour te donner une idée, si tu devais lire tout ce que cette IA a ingurgité, il te faudrait plus de 20 000 ans sans jamais dormir !<br><br>C'est pour ça que l'IA a soudainement explosé ces dernières années : parce qu'avec nos smartphones et internet, on produit des milliards de données chaque jour pour la nourrir."
    ],
    [
        "type" => "table",
        "title" => "3. Les deux grandes familles de l'IA",
        "headers" => ["Type d'IA", "Ce qu'elle fait", "Où tu la trouves"],
        "rows" => [
            ["L'IA Analytique (L'ancienne)", "Elle analyse des données pour faire des choix ou des recommandations.", "L'algorithme de TikTok, les recommandations Netflix, Google Maps qui calcule le meilleur trajet, la reconnaissance faciale de ton téléphone."],
            ["L'IA Générative (La nouvelle star)", "Elle ne se contente plus d'analyser, elle crée de nouvelles choses (texte, image, son) à partir de ce qu'elle a appris.", "ChatGPT (texte), Midjourney (images), Suno (musique)."]
        ]
    ],
    [
        "type" => "summary",
        "title" => "En résumé",
        "content" => "L'IA, ce n'est pas un cerveau magique. C'est un algorithme hyper-entraîné qui joue aux devinettes à la vitesse de la lumière. Il ne comprend pas ce qu'est un chat ou ce qu'est la Révolution française, il sait juste comment ces concepts sont représentés statistiquement dans sa base de données !"
    ],
    [
        "type" => "quiz",
        "title" => "🧠 Mini-Quiz : As-tu bien suivi ? (Gagne de l'XP !)",
        "questions" => [
            [
                "id" => "q1_cql",
                "label" => "1. Comment le Machine Learning apprend-il à reconnaître un chat ?",
                "options" => [
                    ["label" => "En lisant des règles tapées par un humain", "isCorrect" => "false"],
                    ["label" => "En analysant des millions d'exemples", "isCorrect" => "true"]
                ]
            ],
            [
                "id" => "q2_cql",
                "label" => "2. Quel est le carburant indispensable de l'IA ?",
                "options" => [
                    ["label" => "L'électricité magique", "isCorrect" => "false"],
                    ["label" => "Les données (La Data)", "isCorrect" => "true"]
                ]
            ]
        ]
    ]
];

try {
    // Vérifier si l'article existe déjà pour ce slug (et id_classe NULL)
    $checkStmt = $pdo->prepare("SELECT id FROM articles WHERE slug = ? AND id_classe IS NULL");
    $checkStmt->execute([$slug]);
    if ($checkStmt->fetch()) {
        echo "L'article universel '$slug' existe déjà. Mise à jour de son contenu...\n";
        $updateStmt = $pdo->prepare("UPDATE articles SET title = ?, intro = ?, sections = ? WHERE slug = ? AND id_classe IS NULL");
        $updateStmt->execute([
            $title,
            json_encode($intro),
            json_encode($sections),
            $slug
        ]);
        echo "Mise à jour réussie.\n";
    } else {
        $uuid = generateUuid();
        $insertStmt = $pdo->prepare("INSERT INTO articles (id, title, slug, id_classe, intro, sections) VALUES (?, ?, ?, ?, ?, ?)");
        $insertStmt->execute([
            $uuid,
            $title,
            $slug,
            null,
            json_encode($intro),
            json_encode($sections)
        ]);
        echo "Insertion réussie de l'article universel '$slug' (UUID: $uuid).\n";
    }
} catch (PDOException $e) {
    die("Erreur BDD : " . $e->getMessage() . "\n");
}
