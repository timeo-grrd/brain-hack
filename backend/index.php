<?php
// Fichier de routage principal pour l'API


// Autoriser le CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Répondre aux requêtes OPTIONS (prévol CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$path = str_replace($scriptName, '', $requestUri);
$path = strtok($path, '?'); // retire la query string
$path = trim($path, '/');




// Route dynamique pour /article/{id} (numérique)
if (preg_match('#^article/\\d+$#', $path)) {
    require __DIR__ . '/article/get.php';
    exit;
}

// Route dynamique pour /article/{slug} (alphanumérique, tirets, underscores)
if (preg_match('#^article/[a-zA-Z0-9\-_]+$#', $path)) {
    require __DIR__ . '/article/get_by_slug.php';
    exit;
}

// Route dynamique pour /comment/{articleId}/count
if (preg_match('#^comment/[^/]+/count$#', $path)) {
    require __DIR__ . '/comment/count.php';
    exit;
}

// Ex: /auth/register => auth/register.php
if ($path && file_exists(__DIR__ . '/' . $path . '.php')) {
    require __DIR__ . '/' . $path . '.php';
    exit;
}

// 404 si aucune route ne correspond
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not found', 'route' => $path]);
