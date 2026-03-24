<?php
// backend/api/create_article.php
session_start();
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Accès refusé.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['title']) || empty($data['intro']) || empty($data['sections'])) {
    echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont requis.']);
    exit;
}

try {
    $id_classe = ($data['id_classe'] === 'all' || empty($data['id_classe'])) ? null : $data['id_classe'];
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
    
    // Convert array of sections into JSON string
    $sections = json_encode($data['sections']);
    
    $stmt = $pdo->prepare('INSERT INTO articles (title, slug, intro, sections, id_classe, created_at) VALUES (:title, :slug, :intro, :sections, :id_classe, NOW())');
    
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
    echo json_encode(['status' => 'success', 'message' => 'Article créé avec succès.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : '.$e->getMessage()]);
}
