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
