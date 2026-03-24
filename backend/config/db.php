<?php
// backend/config/db.php


$host = '127.0.0.1';
$db   = 'brainhack';
$user = 'root';
$pass = 'root';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    error_log("Erreur de connexion BDD : " . $e->getMessage()); // Log serveur uniquement
    echo json_encode(['error' => 'Erreur interne de connexion à la base de données']);
    exit;
}
