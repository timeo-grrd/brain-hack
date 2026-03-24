<?php
session_start();
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Accès refusé.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query('
            SELECT u.id, u.pseudo, u.email, COALESCE(c.nom_groupe, "Sans Classe") as classe_nom 
            FROM users u 
            LEFT JOIN classes c ON u.id_classe = c.id 
            WHERE u.role = "student" 
            ORDER BY u.pseudo ASC
        ');
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'users' => $users]);
    }
    elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID manquant.']);
            exit;
        }
        $stmt = $pdo->prepare('DELETE FROM users WHERE id = :id AND role = "student"');
        $stmt->execute(['id' => $id]);
        echo json_encode(['status' => 'success', 'message' => 'Élève supprimé.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : '.$e->getMessage()]);
}
