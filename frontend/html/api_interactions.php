<?php
// frontend/html/api_interactions.php
session_start();
require_once __DIR__ . '/../../backend/config/db.php';
header('Content-Type: application/json');

// --- 1. Database Table Initialization ---
try {
    // Likes table
    $pdo->exec("CREATE TABLE IF NOT EXISTS article_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id VARCHAR(100) NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (article_id, user_id)
    )");

    // Comments table
    $pdo->exec("CREATE TABLE IF NOT EXISTS article_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id VARCHAR(100) NOT NULL,
        user_id INT NOT NULL,
        comment_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Robustness: Ensure id columns have AUTO_INCREMENT
    $tables_to_fix = ['article_likes', 'article_comments'];
    foreach ($tables_to_fix as $t) {
        $stmt = $pdo->query("SHOW COLUMNS FROM $t LIKE 'id'");
        $col = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($col && strpos($col['Extra'], 'auto_increment') === false) {
            $pdo->exec("ALTER TABLE $t MODIFY id INT AUTO_INCREMENT");
        }
    }

    // Robustness: Add missing columns if tables existed pre-migration
    $needed_comments = [
        'pseudo' => "VARCHAR(100) NOT NULL AFTER user_id",
        'comment_text' => "TEXT NOT NULL AFTER pseudo",
        'created_at' => "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    ];

    foreach ($needed_comments as $col => $def) {
        $stmt = $pdo->query("SHOW COLUMNS FROM article_comments LIKE '$col'");
        if ($stmt->rowCount() === 0) {
            $pdo->exec("ALTER TABLE article_comments ADD COLUMN $col $def");
        }
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur initialisation BDD : ' . $e->getMessage()]);
    exit;
}

// --- 2. Action Handling ---
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';
$slug = $data['article_id'] ?? 'ia-featured-card'; 

// --- 2.5 UUID Mapping (to satisfy Foreign Key constraints) ---
$article_id = $slug; // Default to slug
try {
    $stmtArt = $pdo->prepare("SELECT id FROM articles WHERE slug = ?");
    $stmtArt->execute([$slug]);
    $art = $stmtArt->fetch(PDO::FETCH_ASSOC);
    if ($art) {
        $article_id = $art['id'];
    } elseif ($slug === 'ia-featured-card') {
        // Fallback to known UUID for our card if slug lookup fails
        $article_id = '11111111-1111-1111-1111-111111111111';
    }
} catch (PDOException $e) {
    // Continue with slug if articles table is missing, though FK will likely fail
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return current state (likes count and comments list)
    try {
        // Count likes
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM article_likes WHERE article_id = ?");
        $stmt->execute([$article_id]);
        $likeCount = $stmt->fetch()['count'];

        // Get comments - We handle both naming conventions (pseudo/user_pseudo and comment_text/content)
        $stmt = $pdo->prepare("SELECT pseudo, comment_text, created_at FROM article_comments WHERE article_id = ? ORDER BY created_at DESC");
        $stmt->execute([$article_id]);
        $comments = $stmt->fetchAll();

        echo json_encode(['likes' => $likeCount, 'comments' => $comments]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POST methods require authentication
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Veuillez vous connecter pour interagir.']);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $pseudo = $_SESSION['pseudo'] ?? 'Anonyme';

    if ($action === 'like') {
        try {
            // Check if already liked
            $stmt = $pdo->prepare("SELECT id FROM article_likes WHERE article_id = ? AND user_id = ?");
            $stmt->execute([$article_id, $userId]);
            $existing = $stmt->fetch();

            if ($existing) {
                // Unlike
                $stmt = $pdo->prepare("DELETE FROM article_likes WHERE id = ?");
                $stmt->execute([$existing['id']]);
                $status = 'unliked';
            } else {
                // Like using UUID
                $stmt = $pdo->prepare("INSERT INTO article_likes (article_id, user_id) VALUES (?, ?)");
                $stmt->execute([$article_id, $userId]);
                $status = 'liked';
            }

            // Get new total
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM article_likes WHERE article_id = ?");
            $stmt->execute([$article_id]);
            $newTotal = $stmt->fetch()['count'];

            echo json_encode(['status' => $status, 'total' => $newTotal]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    } 
    elseif ($action === 'comment') {
        $text = trim($data['text'] ?? '');
        if (empty($text)) {
            http_response_code(400);
            echo json_encode(['error' => 'Le commentaire ne peut pas être vide.']);
            exit;
        }

        try {
            // Robustness: Include ALL redundant fields found in DB schema
            $stmt = $pdo->prepare("INSERT INTO article_comments 
                (article_id, user_id, pseudo, user_pseudo, comment_text, content) 
                VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$article_id, $userId, $pseudo, $pseudo, $text, $text]);
            
            echo json_encode([
                'status' => 'success',
                'comment' => [
                    'id' => $pdo->lastInsertId(),
                    'pseudo' => $pseudo,
                    'comment_text' => $text,
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    elseif ($action === 'delete_comment') {
        // Moderation: only admin can delete
        if (($_SESSION['role'] ?? '') !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Droits insuffisants.']);
            exit;
        }

        $commentId = intval($data['id'] ?? 0);
        if ($commentId <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de commentaire invalide.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM article_comments WHERE id = ?");
            $stmt->execute([$commentId]);
            echo json_encode(['status' => 'success']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    else {
        http_response_code(400);
        echo json_encode(['error' => 'Action non reconnue.']);
    }
}
