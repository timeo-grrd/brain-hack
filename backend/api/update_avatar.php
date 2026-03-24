<?php
// backend/api/update_avatar.php
session_start();
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // A adapter avec l'URL en prod si credentials: true

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée.']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Non authentifié.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (empty($data['id_avatar'])) {
    echo json_encode(['status' => 'error', 'message' => 'Identifiant d\'avatar manquant.']);
    exit;
}

try {
    $stmt = $pdo->prepare('UPDATE users SET id_avatar = :id_avatar WHERE id = :id');
    $stmt->execute([
        ':id_avatar' => $data['id_avatar'],
        ':id' => $_SESSION['user_id']
    ]);
    
    $stmt2 = $pdo->prepare('SELECT avatar_url FROM avatars WHERE id = :id');
    $stmt2->execute([':id' => $data['id_avatar']]);
    $avatar = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success', 
        'message' => 'Avatar mis à jour.', 
        'new_avatar_url' => $avatar ? $avatar['avatar_url'] : null
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : '.$e->getMessage()]);
}
