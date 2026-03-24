<?php
// backend/api/check_video.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    exit;
}

if (!isset($_FILES['video']) || $_FILES['video']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['status' => 'error', 'message' => 'Veuillez uploader un fichier vidéo valide.']);
    exit;
}

// LOGIQUE D'APPEL API LATERALE
/*
$url = 'https://api.fake-video-detector.com/v1/analyze';
// Upload en multipart...
*/

sleep(1); // Simulation réseau
echo json_encode([
    'status' => 'success', 
    'message' => "Simulation Backend Audio/Video réussie.\nNom du fichier reçu : " . $_FILES['video']['name'] . "\n\n(L'API externe de détection de Deepfake Vidéo n'est pas encore connectée. Voir check_video.php)."
]);
