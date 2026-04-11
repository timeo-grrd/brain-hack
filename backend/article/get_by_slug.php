<?php
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

// Récupère le slug de l'article depuis l'URL
$uri = $_SERVER['REQUEST_URI'];
$matches = [];
if (preg_match('#/article/([a-zA-Z0-9\-_]+)#', $uri, $matches)) {
    $slug = $matches[1];
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Slug article manquant']);
    exit;
}

if ($slug === 'ia-featured-card') {
    session_start();
    $suffix = '65'; // default
    if (isset($_SESSION['user_id'])) {
        $stmtU = $pdo->prepare('SELECT classes.nom_groupe FROM users LEFT JOIN classes ON users.id_classe = classes.id WHERE users.id = ?');
        $stmtU->execute([$_SESSION['user_id']]);
        $userC = $stmtU->fetch();
        if ($userC && $userC['nom_groupe']) {
            switch ($userC['nom_groupe']) {
                case '4ème-3ème': $suffix = '43'; break;
                case 'Seconde-Première': $suffix = 'sp'; break;
                case 'Terminale': $suffix = 'ter'; break;
            }
        }
    }
    $slug = 'ia-featured-card-' . $suffix;
}

$stmt = $pdo->prepare('SELECT * FROM articles WHERE slug = ?');
$stmt->execute([$slug]);
$article = $stmt->fetch();

if ($article) {
    // Si le champ sections est une chaîne JSON, le décoder
    if (isset($article['sections']) && is_string($article['sections'])) {
        $decoded = json_decode($article['sections'], true);
        if ($decoded !== null) {
            $article['sections'] = $decoded;
        }
    }
    echo json_encode($article);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Article introuvable']);
}
