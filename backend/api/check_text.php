<?php
// backend/api/check_text.php
header('Content-Type: application/json');

// Autoriser le CORS si frontend/backend sur domaines dif
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$texte = $data['text'] ?? '';

if (empty(trim($texte))) {
    echo json_encode(['status' => 'error', 'message' => 'Le texte est vide']);
    exit;
}

/* 
================================================================================
INSÈRE TON APPEL API CHATGPT (Ou autre LLM) ICI 

$apiKey = 'sk-TON_API_KEY';
$url = 'https://api.openai.com/v1/chat/completions';

// LE PROMPT SYSTÈME IDÉAL :
$systemPrompt = "Tu es un expert en linguistique numérique et détection d'IA. 
Analyse le texte suivant pour déterminer s'il a été généré par une Intelligence Artificielle (ChatGPT, Claude, etc.) ou écrit par un humain.
Prête attention au ton (qui est souvent trop lisse/aseptisé), à la structure (paragraphes très uniformes) et aux tics de langage courants de l'IA.
Rends-moi un diagnostic de probabilité en pourcentage (ex: Probabilité IA : 85%) suivi d'un bref résumé des indices qui t'ont mené à cette conclusion.";

$payload = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        ['role' => 'system', 'content' => $systemPrompt],
        ['role' => 'user', 'content' => $texte]
    ],
    'temperature' => 0.2
];

// Configuration cURL :
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
curl_close($ch);
// Renvoie la réponse JSON traitée :
// echo json_encode(['status' => 'success', 'message' => json_decode($response)->choices[0]->message->content]);
================================================================================
*/

// Fake réponse temporaire en attendant ta clé API externe :
sleep(1); // Simule le temps de traitement de l'IA
echo json_encode([
    'status' => 'success', 
    'message' => "Ceci est une simulation de l'API.\n\nProbabilité IA : En attente du raccordement OpenAI.\n(Ouvre backend/api/check_text.php pour configurer ta clé !)"
]);
