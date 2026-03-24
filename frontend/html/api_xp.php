<?php
// frontend/html/api_xp.php
session_start();
// Debug session
error_log("API_XP: session_id = " . session_id());
error_log("API_XP: user_id = " . ($_SESSION['user_id'] ?? 'NULL'));
require_once __DIR__ . '/../../backend/config/db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non connecté']);
    exit;
}

$userId = $_SESSION['user_id'];
$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    if ($action === 'get_xp') {
        $stmt = $pdo->prepare("SELECT total_xp FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['total_xp' => $user['total_xp'] ?? 0]);
    } 
    elseif ($action === 'add_xp') {
        $amount = intval($_GET['amount'] ?? $_POST['amount'] ?? 0);
        if ($amount < 0) $amount = 0; // Sécurité

        $stmt = $pdo->prepare("UPDATE users SET total_xp = total_xp + ? WHERE id = ?");
        $stmt->execute([$amount, $userId]);

        // Récupérer le nouveau total
        $stmt = $pdo->prepare("SELECT total_xp FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode(['status' => 'success', 'new_total' => $user['total_xp'] ?? 0]);
    } 
    else {
        http_response_code(400);
        echo json_encode(['error' => 'Action invalide']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
