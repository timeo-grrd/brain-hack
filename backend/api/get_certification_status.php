<?php
// backend/api/get_certification_status.php
session_start();
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non connecté']);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // 1. Récupérer l'XP
    $stmt = $pdo->prepare("SELECT total_xp, pseudo, email FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Utilisateur non trouvé']);
        exit;
    }

    // 2. Récupérer les articles lus (si on avait une table, mais ici c'est encore en localStorage dans le front)
    // Pour le hackathon, on va juste renvoyer l'XP et le pseudo officiel de la BDD.
    
    echo json_encode([
        'status' => 'success',
        'pseudo' => $user['pseudo'],
        'email' => $user['email'],
        'total_xp' => (int)$user['total_xp'],
        'is_expert' => ($user['total_xp'] >= 100) // Seuil arbitraire pour "Expert"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
