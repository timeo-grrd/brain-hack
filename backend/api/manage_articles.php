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
            SELECT a.id, a.title, a.intro, a.created_at, COALESCE(c.nom_groupe, "Toutes (Public)") as classe_nom 
            FROM articles a 
            LEFT JOIN classes c ON a.id_classe = c.id 
            ORDER BY a.created_at DESC
        ');
        $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'articles' => $articles]);
    }
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['title']) || empty($data['intro']) || empty($data['content'])) {
            echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont requis.']);
            exit;
        }
        
        $id_classe = ($data['id_classe'] === 'all' || empty($data['id_classe'])) ? null : $data['id_classe'];
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
        $sections = json_encode([['type' => 'text', 'content' => $data['content']]]);
        
        $stmt = $pdo->prepare('INSERT INTO articles (title, slug, intro, sections, id_classe, created_at) VALUES (:title, :slug, :intro, :sections, :id_classe, NOW())');
        
        // Execute params with dynamic NULL binding if necessary
        $stmt->bindValue(':title', $data['title']);
        $stmt->bindValue(':slug', $slug);
        $stmt->bindValue(':intro', $data['intro']);
        $stmt->bindValue(':sections', $sections);
        
        if ($id_classe === null) {
            $stmt->bindValue(':id_classe', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(':id_classe', $id_classe, PDO::PARAM_INT);
        }
        
        $stmt->execute();
        echo json_encode(['status' => 'success', 'message' => 'Article créé.']);
    }
    elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID manquant.']);
            exit;
        }
        $stmt = $pdo->prepare('DELETE FROM articles WHERE id = :id');
        $stmt->execute(['id' => $id]);
        echo json_encode(['status' => 'success', 'message' => 'Article supprimé.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : '.$e->getMessage()]);
}
