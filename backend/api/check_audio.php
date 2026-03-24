<?php
// backend/api/check_audio.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    exit;
}

if (!isset($_FILES['audio']) || $_FILES['audio']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['status' => 'error', 'message' => 'Veuillez uploader un fichier audio valide.']);
    exit;
}

// LOGIQUE D'APPEL API ELEVENLABS / CHATGPT
/*
$url = 'https://api.fake-voice-detector.com/analyze';
*/

sleep(1); // Simulation réseau
echo json_encode([
    'status' => 'success', 
    'message' => "Simulation Backend Audio réussie.\nNom du fichier reçu : " . $_FILES['audio']['name'] . "\n\n(L'API externe de détection de clonage vocal est prête à être connectée dans check_audio.php)."
]);
