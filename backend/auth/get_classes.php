<?php
// backend/auth/get_classes.php
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

try {
    // Récupère toutes les classes triées par ordre chronologique (via FIELD)
    $stmt = $pdo->query("SELECT id, nom_groupe FROM classes ORDER BY FIELD(nom_groupe, '6ème-5ème', '4ème-3ème', 'Seconde-Première', 'Terminale')");
    $classes = $stmt->fetchAll();
    echo json_encode($classes);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la récupération des classes']);
}
