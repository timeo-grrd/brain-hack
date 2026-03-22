<?php
header('Content-Type: application/json');

// Récupère le slug depuis l'URL
$uri = $_SERVER['REQUEST_URI'];
$matches = [];
if (preg_match('#/comment/([^/]+)$#', $uri, $matches)) {
    $slug = $matches[1];
    // Ici tu pourrais charger les commentaires depuis la BDD
    echo json_encode([
        'comments' => [],
        'slug' => $slug
    ]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
