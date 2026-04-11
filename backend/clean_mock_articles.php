<?php
require_once __DIR__ . '/config/db.php';

try {
    $stmt = $pdo->prepare("DELETE FROM articles WHERE id_classe IS NULL AND slug != 'cest-quoi-lia'");
    $stmt->execute();
    echo "Nettoyage réussi des anciens articles factices.";
} catch (PDOException $e) {
    die("Erreur BDD : " . $e->getMessage());
}
