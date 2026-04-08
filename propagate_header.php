<?php
// propagate_header.php
// Automates the synchronization of the header across all HTML files.

$baseDir = __DIR__;
$htmlFiles = [
    $baseDir . '/frontend/html/Apropos.html',
    $baseDir . '/frontend/html/authentification.html',
    $baseDir . '/frontend/html/certification.html',
    $baseDir . '/frontend/html/compte.html',
    $baseDir . '/frontend/html/dashboard_prof.html',
    $baseDir . '/frontend/html/games.html',
    $baseDir . '/frontend/html/index.html',
    $baseDir . '/frontend/html/kpi_admin.html',
    $baseDir . '/frontend/html/mentions-legales.html',
    $baseDir . '/frontend/html/verify_audio.html',
    $baseDir . '/frontend/html/verify_text.html',
    $baseDir . '/frontend/html/verify_video.html'
];

$sourceFile = $baseDir . '/frontend/html/index.html';
if (!file_exists($sourceFile)) {
    die("Source file (index.html) not found at: $sourceFile\n");
}

$sourceContent = file_get_contents($sourceFile);
if (!preg_match('/<nav class="navbar">.*?<\/nav>/s', $sourceContent, $matches)) {
    die("Could not find <nav class=\"navbar\"> in source file.\n");
}
$unifiedHeader = $matches[0];

foreach ($htmlFiles as $file) {
    if ($file === $sourceFile) continue;
    
    if (!file_exists($file)) {
        echo "File not found: $file\n";
        continue;
    }

    echo "Processing $file...\n";
    $content = file_get_contents($file);

    // Replace the entire nav block
    $newContent = preg_replace('/<nav class="navbar">.*?<\/nav>/s', $unifiedHeader, $content);
    
    if ($newContent !== null && $newContent !== $content) {
        file_put_contents($file, $newContent);
        echo "Successfully updated $file\n";
    } else {
        echo "No changes needed or could not find navbar in $file\n";
    }
}

echo "Done.\n";
?>
