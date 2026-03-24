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
        $stmt = $pdo->query('SELECT id, nom_groupe FROM classes ORDER BY nom_groupe ASC');
        $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'classes' => $classes]);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['nom_groupe'])) {
            echo json_encode(['status' => 'error', 'message' => 'Nom de classe requis.']);
            exit;
        }
        $stmt = $pdo->prepare('INSERT INTO classes (nom_groupe) VALUES (:nom)');
        $stmt->execute(['nom' => htmlspecialchars($data['nom_groupe'])]);
        echo json_encode(['status' => 'success', 'message' => 'Classe créée.']);
    }
    elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID manquant.']);
            exit;
        }
        $stmt = $pdo->prepare('DELETE FROM classes WHERE id = :id');
        $stmt->execute(['id' => $id]);
        echo json_encode(['status' => 'success', 'message' => 'Classe supprimée.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : '.$e->getMessage()]);
}
