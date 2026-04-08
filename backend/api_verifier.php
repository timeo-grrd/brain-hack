<?php
/**
 * api_verifier.php - Pipeline Forensic Professionnel (Whisper Robust & Video Debug)
 * Centralise les analyses Texte, Image, Audio et Vidéo via OpenAI.
 * Retourne TOUJOURS : {"verdict": "IA|HUMAIN", "confidence": "95%", "argumentation": "..."}
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

// =========================================================================
// CONFIGURATION
// =========================================================================
$api_token = 'sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
$chat_url = 'https://api.openai.com/v1/chat/completions';
$whisper_url = 'https://api.openai.com/v1/audio/transcriptions';

// =========================================================================
// RÉCUPÉRATION DES DONNÉES
// =========================================================================
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true) ?? [];

$textToVerify = $_POST['text'] ?? $input['text'] ?? '';
$isImage = isset($_FILES['image']);
$isAudio = isset($_FILES['audio']);
$isVideo = isset($_FILES['video']);

// Logiciel de nettoyage JSON OpenAI
function cleanOpenAIJson($response) {
    $clean = preg_replace('/^```json\s*/', '', $response);
    $clean = preg_replace('/\s*```$/', '', $clean);
    return trim($clean);
}

// Fonction cURL Générique
function callOpenAI($url, $token, $payload, $isMultipart = false) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    
    if ($isMultipart) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token
        ]);
    } else {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ]);
    }
    
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['body' => $res, 'code' => $code];
}

// =========================================================================
// PIPELINE D'ANALYSE
// =========================================================================

$finalResponse = [
    'verdict' => 'ERREUR',
    'confidence' => '0%',
    'argumentation' => 'Analyse non effectuée.'
];

try {
    if ($isVideo) {
        // --- BLINDEUR DE TAILLE ---
        if ($_FILES['video']['size'] > 25 * 1024 * 1024) {
            echo json_encode(['verdict' => 'ERREUR', 'argumentation' => 'La vidéo est trop lourde. OpenAI limite les fichiers à 25 Mo maximum.']);
            exit;
        }

        // --- ÉTAPE B : Whisper (Extraction Audio avec Error Discovery) ---
        $cfile = new CURLFile($_FILES['video']['tmp_name'], $_FILES['video']['type'], $_FILES['video']['name']);
        $whisperPayload = ['file' => $cfile, 'model' => 'whisper-1'];
        
        $whisperRes = callOpenAI($whisper_url, $api_token, $whisperPayload, true);
        $whisper_data = json_decode($whisperRes['body'], true);

        if (isset($whisper_data['error'])) {
            throw new Exception("Erreur API Whisper : " . $whisper_data['error']['message']);
        }

        $transcription = $whisper_data['text'] ?? '';
        if (empty(trim($transcription))) {
            echo json_encode(['verdict' => 'HUMAIN', 'confidence' => '100%', 'argumentation' => 'Aucune voix ou dialogue détecté dans cette vidéo. L\'analyse forensique audio est impossible.']);
            exit;
        }

        // --- ÉTAPE C : GPT-4o ---
        $prompt = "Tu es un expert en criminalistique numérique (Video Forensics). Analyse cette transcription extraite d'une vidéo : \"$transcription\". Les vidéos générées par IA (Sora, HeyGen, etc.) ont souvent des scripts sans aucun mot de remplissage, une diction mathématiquement parfaite et manquent d'hésitations humaines. Déduis si cette vidéo utilise un avatar IA ou un humain. Réponds UNIQUEMENT au format JSON strict : {\"verdict\": \"IA\" ou \"HUMAIN\", \"confidence\": \"X%\", \"argumentation\": \"3 points techniques expliquant ton choix\"}.";
        
        $gptPayload = ['model' => 'gpt-4o-mini', 'messages' => [['role' => 'user', 'content' => $prompt]], 'response_format' => ['type' => 'json_object']];
        $res = callOpenAI($chat_url, $api_token, $gptPayload);
        $finalResponse = json_decode(cleanOpenAIJson(json_decode($res['body'], true)['choices'][0]['message']['content']), true);

    } elseif ($isAudio) {
        // --- ANALYSE AUDIO (Whisper Robust) ---
        if ($_FILES['audio']['size'] > 25 * 1024 * 1024) {
            echo json_encode(['verdict' => 'ERREUR', 'argumentation' => 'Le fichier audio est trop lourd (Max 25 Mo).']); exit;
        }

        $cfile = new CURLFile($_FILES['audio']['tmp_name'], $_FILES['audio']['type'], $_FILES['audio']['name']);
        $whisperPayload = ['file' => $cfile, 'model' => 'whisper-1'];
        $whisperRes = callOpenAI($whisper_url, $api_token, $whisperPayload, true);
        $whisper_data = json_decode($whisperRes['body'], true);

        if (isset($whisper_data['error'])) throw new Exception("Erreur API Whisper : " . $whisper_data['error']['message']);
        $transcription = $whisper_data['text'] ?? '';

        if (empty(trim($transcription))) {
            echo json_encode(['verdict' => 'HUMAIN', 'confidence' => '100%', 'argumentation' => 'Silence ou aucun dialogue détecté.']); exit;
        }

        $prompt = "Tu es un expert en détection de voix synthétique. Analyse la transcription : \"$transcription\". Déduis si c'est un script lu par une IA. Réponds UNIQUEMENT au format JSON strict : {\"verdict\": \"IA\" ou \"HUMAIN\", \"confidence\": \"X%\", \"argumentation\": \"3 points techniques\"}.";
        $gptPayload = ['model' => 'gpt-4o-mini', 'messages' => [['role' => 'user', 'content' => $prompt]], 'response_format' => ['type' => 'json_object']];
        $res = callOpenAI($chat_url, $api_token, $gptPayload);
        $finalResponse = json_decode(cleanOpenAIJson(json_decode($res['body'], true)['choices'][0]['message']['content']), true);

    } elseif ($isImage) {
        // --- ANALYSE IMAGE Fixé ---
        $tmp_name = $_FILES['image']['tmp_name'];
        $mime_type = mime_content_type($tmp_name);
        $base64_image = base64_encode(file_get_contents($tmp_name));
        $image_payload = "data:" . $mime_type . ";base64," . $base64_image;
        
        $prompt = "Tu es un expert en criminalistique numérique. Analyse cette image pour détecter des artefacts de génération IA. Réponds UNIQUEMENT au format JSON strict : {\"verdict\": \"IA\" ou \"HUMAIN\", \"confidence\": \"X%\", \"argumentation\": \"3 points techniques\"}.";
        
        $payload = ['model' => 'gpt-4o-mini', 'messages' => [['role' => 'user', 'content' => [['type' => 'text', 'text' => $prompt], ['type' => 'image_url', 'image_url' => ['url' => $image_payload]]]]], 'response_format' => ['type' => 'json_object']];
        $res = callOpenAI($chat_url, $api_token, $payload);
        $finalResponse = json_decode(cleanOpenAIJson(json_decode($res['body'], true)['choices'][0]['message']['content']), true);

    } elseif (!empty($textToVerify)) {
        // --- ANALYSE TEXTE ---
        $prompt = "Tu es un expert en linguistique forensique. Analyse ce texte pour détecter s'il a été écrit par une IA. Réponds UNIQUEMENT au format JSON strict : {\"verdict\": \"IA\" ou \"HUMAIN\", \"confidence\": \"X%\", \"argumentation\": \"3 points techniques\"}.";
        $payload = ['model' => 'gpt-4o-mini', 'messages' => [['role' => 'system', 'content' => $prompt], ['role' => 'user', 'content' => $textToVerify]], 'response_format' => ['type' => 'json_object']];
        $res = callOpenAI($chat_url, $api_token, $payload);
        $finalResponse = json_decode(cleanOpenAIJson(json_decode($res['body'], true)['choices'][0]['message']['content']), true);

    } else {
        throw new Exception("Aucune donnée reçue.");
    }

} catch (Exception $e) {
    echo json_encode(['verdict' => 'ERREUR', 'confidence' => '0%', 'argumentation' => $e->getMessage()]);
    exit;
}

echo json_encode($finalResponse);
exit;
