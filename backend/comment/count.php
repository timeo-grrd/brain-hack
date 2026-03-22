<?php
// Retourne un nombre de commentaires fictif pour chaque article
header('Content-Type: application/json');

// Extraire l'articleId depuis l'URL
$uri = $_SERVER['REQUEST_URI'];
$matches = [];
if (preg_match('#/comment/([^/]+)/count#', $uri, $matches)) {
    $articleId = $matches[1];
    // Ici, tu pourrais faire une vraie requête SQL pour compter les commentaires
    // Pour l'instant, on retourne toujours 0
    echo json_encode(['count' => 0]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
