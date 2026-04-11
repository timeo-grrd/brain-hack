<?php
require_once __DIR__ . '/config/db.php';
$stmt = $pdo->query("SELECT id, nom_groupe FROM classes");
$classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($classes);
