<?php
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$pseudo = $data['pseudo'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$role = $data['role'] ?? 'student';
$avatarUrl = $data['avatarUrl'] ?? null;

if (!$pseudo || !$email || !$password || !$role) {
    http_response_code(400);
    echo json_encode(['error' => 'Champs manquants']);
    exit;
}

// Vérifier si l'utilisateur existe déjà (par pseudo ou email)
$stmt = $pdo->prepare('SELECT id FROM users WHERE pseudo = ? OR email = ?');
$stmt->execute([$pseudo, $email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Utilisateur déjà existant']);
    exit;
}

// Hash du mot de passe
$hash = password_hash($password, PASSWORD_DEFAULT);

// Insertion en base
$stmt = $pdo->prepare('INSERT INTO users (pseudo, email, password, role, avatarUrl) VALUES (?, ?, ?, ?, ?)');
try {
    $stmt->execute([$pseudo, $email, $hash, $role, $avatarUrl]);
    $id = $pdo->lastInsertId();
    echo json_encode([
        'success' => true,
        'id' => $id,
        'pseudo' => $pseudo,
        'email' => $email,
        'role' => $role,
        'avatarUrl' => $avatarUrl,
        'totalXp' => 0 // à adapter si champ existant
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'inscription', 'details' => $e->getMessage()]);
}
