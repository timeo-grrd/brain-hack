<?php
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

// Récupère l'ID de l'article depuis l'URL
$uri = $_SERVER['REQUEST_URI'];
$matches = [];
if (preg_match('#/article/(\d+)#', $uri, $matches)) {
    $articleId = $matches[1];
} else {
    http_response_code(400);
    echo json_encode(['error' => 'ID article manquant']);
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM articles WHERE id = ?');
$stmt->execute([$articleId]);
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
