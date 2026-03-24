<?php
// backend/api/get_prof_dashboard.php
session_start();
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

// Vérification stricte de la session "teacher"
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 'teacher') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Accès refusé. Réservé aux professeurs.']);
    exit;
}

try {
    $stmt = $pdo->prepare('
        SELECT u.id, u.pseudo, u.total_xp, u.id_classe, 
               COALESCE(c.nom_groupe, "Sans Classe") as classe_nom
        FROM users u
        LEFT JOIN classes c ON u.id_classe = c.id
        WHERE u.role = "student"
        ORDER BY u.total_xp DESC
    ');
    
    $stmt->execute();
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $totalStudents = count($students);
    $totalXp = 0;
    
    foreach ($students as &$s) {
        $totalXp += $s['total_xp'];
    }
    
    $avgXp = $totalStudents > 0 ? round($totalXp / $totalStudents) : 0;
    
    echo json_encode([
        'status' => 'success',
        'kpi' => [
            'total_students' => $totalStudents,
            'avg_xp'         => $avgXp
        ],
        'students' => $students
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur : ' . $e->getMessage()]);
}
