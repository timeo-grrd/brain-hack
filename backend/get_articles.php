<?php
// backend/get_articles.php
require_once __DIR__ . '/config/db.php';
header('Content-Type: application/json');

$id_classe = $_GET['id_classe'] ?? null;

try {
    if ($id_classe) {
        // Renvoie les articles de la classe + les articles génériques (NULL)
        $stmt = $pdo->prepare('
            SELECT a.id, a.slug, a.title, a.intro, a.id_classe, a.created_at, c.nom_groupe 
            FROM articles a
            LEFT JOIN classes c ON a.id_classe = c.id
            WHERE a.id_classe = ? OR a.id_classe IS NULL 
            ORDER BY a.created_at DESC
        ');
        $stmt->execute([$id_classe]);
    } else {
        // Renvoie tous les articles
        $stmt = $pdo->query('
            SELECT a.id, a.slug, a.title, a.intro, a.id_classe, a.created_at, c.nom_groupe 
            FROM articles a
            LEFT JOIN classes c ON a.id_classe = c.id
            ORDER BY a.created_at DESC
        ');
    }
    
    $articles = $stmt->fetchAll();
    echo json_encode($articles);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des articles']);
}
