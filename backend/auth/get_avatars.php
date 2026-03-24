<?php
// backend/auth/get_avatars.php
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

try {
    // Récupère les avatars disponibles (Dédoublonnés, sans Hacker/Cerveau/Robot)
    $stmt = $pdo->query("
        SELECT min(id) as id, nom, max(avatar_url) as avatar_url 
        FROM avatars 
        WHERE nom NOT IN ('Cervea', 'Hacker', 'Robot', 'Cerveau')
        GROUP BY nom 
        ORDER BY nom ASC
    ");
    $avatars = $stmt->fetchAll();
    echo json_encode($avatars);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des avatars']);
}
