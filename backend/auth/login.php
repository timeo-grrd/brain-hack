<?php
// backend/auth/login.php
session_start();
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email et mot de passe requis']);
    exit;
}

// Vérifier si l'utilisateur existe
try {
    $stmt = $pdo->prepare('
        SELECT u.*, a.avatar_url 
        FROM users u 
        LEFT JOIN avatars a ON u.id_avatar = a.id 
        WHERE u.email = ?
    ');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['pseudo']  = $user['pseudo'];
        $_SESSION['role']    = $user['role'];
        $_SESSION['avatar_url'] = $user['avatar_url'];

        echo json_encode([
            'status' => 'success',
            'redirectUrl' => $user['role'] === 'teacher' ? 'dashboard_prof.html' : 'index.html',
            'token' => 'dummy-token-for-hackathon',
            'id' => $user['id'],
            'pseudo' => $user['pseudo'],
            'email' => $user['email'],
            'role' => $user['role'],
            'id_classe' => $user['id_classe'] ?? null,
            'id_avatar' => $user['id_avatar'] ?? null,
            'avatarUrl' => $user['avatar_url'] ?? null,
            'theme_daltonien' => $user['theme_daltonien'] ?? 'normal',
            'totalXp' => $user['total_xp'] ?? 0
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Identifiants incorrects']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Erreur BDD login : " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur inattendue : ' . $e->getMessage()]);
}
