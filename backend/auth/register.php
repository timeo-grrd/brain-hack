<?php
// backend/auth/register.php
session_start();
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

// Sécurisation basique des entrées
$pseudo = isset($data['pseudo']) ? htmlspecialchars(trim($data['pseudo'])) : null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$id_classe = $data['id_classe'] ?? null;
if ($id_classe === '') $id_classe = null;
$id_avatar = $data['id_avatar'] ?? null;

// Validation stricte du rôle
$allowedRoles = ['student', 'teacher'];
$roleInput = $data['role'] ?? 'student';
$role = in_array($roleInput, $allowedRoles) ? $roleInput : 'student';

// Si professeur, on ignore l'id_classe
if ($role === 'teacher') {
    $id_classe = null;
}

// Vérification des champs requis
if (!$pseudo || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Veuillez remplir le pseudo, l\'email et le mot de passe.']);
    exit;
}

// Vérification du format de l'email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Format d\'email invalide.']);
    exit;
}

// Vérification de la longueur du mot de passe
if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Le mot de passe doit contenir au moins 6 caractères.']);
    exit;
}

// Vérifier si l'utilisateur existe déjà (par pseudo ou email)
try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE pseudo = ? OR email = ?');
    $stmt->execute([$pseudo, $email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['status' => 'error', 'message' => 'Cet email ou ce pseudo est déjà utilisé.']);
        exit;
    }

    // Hash du mot de passe
    $hash = password_hash($password, PASSWORD_DEFAULT);

    function generateUuid() {
        return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
            mt_rand( 0, 0xffff ),
            mt_rand( 0, 0x0fff ) | 0x4000,
            mt_rand( 0, 0x3fff ) | 0x8000,
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
        );
    }
    $userId = generateUuid();

    // Insertion en base (avec bindValue pour le vrai NULL SQL)
    $stmt = $pdo->prepare('INSERT INTO users (id, pseudo, email, password_hash, role, id_classe, id_avatar) VALUES (:id, :pseudo, :email, :hash, :role, :id_classe, :id_avatar)');
    $stmt->bindValue(':id', $userId);
    $stmt->bindValue(':pseudo', $pseudo);
    $stmt->bindValue(':email', $email);
    $stmt->bindValue(':hash', $hash);
    $stmt->bindValue(':role', $role);
    $stmt->bindValue(':id_classe', $id_classe, $id_classe === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindValue(':id_avatar', $id_avatar, $id_avatar === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    
    $stmt->execute();
    
    // Récupérer l'URL de l'avatar pour le retour JSON et la session
    $avatarUrl = null;
    if ($id_avatar) {
        $stmtAv = $pdo->prepare('SELECT avatar_url FROM avatars WHERE id = ?');
        $stmtAv->execute([$id_avatar]);
        $av = $stmtAv->fetch(PDO::FETCH_ASSOC);
        if ($av) $avatarUrl = $av['avatar_url'];
    }

    $_SESSION['user_id'] = $userId;
    $_SESSION['pseudo']  = $pseudo;
    $_SESSION['role']    = $role;
    $_SESSION['avatar_url'] = $avatarUrl;

    echo json_encode([
        'status' => 'success',
        'redirectUrl' => $role === 'teacher' ? 'dashboard_prof.html' : 'index.html',
        'id' => $userId,
        'pseudo' => $pseudo,
        'email' => $email,
        'role' => $role,
        'id_classe' => $id_classe,
        'id_avatar' => $id_avatar,
        'avatarUrl' => $avatarUrl,
        'theme_daltonien' => 'normal',
        'total_xp' => 0
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Erreur BDD register : " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Erreur SQL : ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur inattendue : ' . $e->getMessage()]);
}
