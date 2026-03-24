<?php
/**
 * API KPI - Backend Phase 2
 * Retourne les statistiques réelles de la base de données au format JSON.
 */

require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // 0. Migration (Table Certifications si absente)
    $pdo->exec("CREATE TABLE IF NOT EXISTS certifications (
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        displayName VARCHAR(255) NOT NULL,
        unlocked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_certifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $data = [];

    // 1. Statistiques Globales (Cards)
    
    // Total Utilisateurs
    $stmt = $pdo->query('SELECT COUNT(*) as total FROM users');
    $data['overview']['total_users'] = $stmt->fetch()['total'];

    // Total XP
    $stmt = $pdo->query('SELECT SUM(total_xp) as total FROM users');
    $data['overview']['total_xp'] = round(($stmt->fetch()['total'] ?? 0) / 1000, 1) . 'k';

    // Total Jeux Joués
    $stmt = $pdo->query('SELECT COUNT(*) as total FROM gamesessions');
    $data['overview']['total_games'] = $stmt->fetch()['total'];

    // IA Verifications (Proxy)
    $stmt = $pdo->query("
        SELECT COUNT(*) as total 
        FROM gamesessions gs
        JOIN minigames m ON gs.minigame_id = m.id
        WHERE m.name LIKE '%ia%' OR m.name LIKE '%deepfake%'
    ");
    $data['overview']['total_ai_checks'] = $stmt->fetch()['total'];

    // NOUVELLES CARDS Phase 3
    // Certifications Délivrées
    $stmt = $pdo->query('SELECT COUNT(*) as total FROM certifications');
    $data['overview']['total_certifications'] = $stmt->fetch()['total'] ?? 0;

    // Taux de Réussite Global (score >= 50%)
    $stmt = $pdo->query('SELECT ROUND(AVG(score >= 50) * 100, 1) as rate FROM gamesessions');
    $data['overview']['success_rate'] = ($stmt->fetch()['rate'] ?? 0) . '%';


    // 2. Bar Chart - Répartition par Niveau Scolaire (Classes)
    $stmt = $pdo->query("
        SELECT c.nom_groupe as label, COUNT(u.id) as value 
        FROM classes c 
        LEFT JOIN users u ON u.id_classe = c.id 
        GROUP BY c.id, c.nom_groupe
        ORDER BY c.nom_groupe ASC
    ");
    $data['charts']['level_distribution'] = $stmt->fetchAll();


    // 3. Doughnut - Utilisation des Outils IA / Jeux
    $stmt = $pdo->query("
        SELECT m.name as label, COUNT(gs.id) as value 
        FROM minigames m 
        JOIN gamesessions gs ON gs.minigame_id = m.id 
        GROUP BY m.id, m.name
    ");
    $data['charts']['usage_stats'] = $stmt->fetchAll();


    // 4. Radar Chart - Compétences par Média
    $stmt = $pdo->query("
        SELECT 
            CASE 
                WHEN m.name LIKE '%ia%' OR m.name LIKE '%quiz%' THEN 'Texte'
                WHEN m.name LIKE '%deepfake%' OR m.name LIKE '%photo%' THEN 'Image'
                WHEN m.name LIKE '%video%' OR m.name LIKE '%streamer%' THEN 'Vidéo'
                ELSE 'Audio' 
            END as label,
            AVG(gs.score) as value
        FROM minigames m
        JOIN gamesessions gs ON gs.minigame_id = m.id
        GROUP BY label
    ");
    $data['charts']['radar_skills'] = $stmt->fetchAll();


    // 5. Line Chart - Évolution des scores (7 derniers jours)
    $stmt = $pdo->query("
        SELECT DATE_FORMAT(completed_at, '%a') as label, AVG(score) as value
        FROM gamesessions 
        WHERE completed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(completed_at), DATE_FORMAT(completed_at, '%a')
        ORDER BY DATE(completed_at) ASC
    ");
    $data['charts']['score_evolution'] = $stmt->fetchAll();


    // 6. Tableau - Dernières Inscriptions
    $stmt = $pdo->query("
        SELECT u.id, u.pseudo, c.nom_groupe as classe, u.created_at 
        FROM users u
        LEFT JOIN classes c ON u.id_classe = c.id
        ORDER BY u.created_at DESC 
        LIMIT 5
    ");
    $data['recent_users'] = $stmt->fetchAll();

    echo json_encode(['status' => 'success', 'data' => $data]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : ' . $e->getMessage()]);
}
