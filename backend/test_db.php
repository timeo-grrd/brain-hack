<?php
require_once __DIR__ . '/config/db.php';

try {
    $pdo->query('SELECT 1');
    echo 'Connexion BDD OK';
} catch (PDOException $e) {
    echo 'Erreur PDO : ' . $e->getMessage();
}
