<?php
// propagate_header.php
// Automates the addition of the XP counter to the header of all HTML files.

$htmlFiles = [
    'c:\laragon\www\hackathon\HackAThon\frontend\html\Apropos.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\authentification.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\certification.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\compte.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\dashboard_prof.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\games.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\index.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\kpi_admin.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\mentions-legales.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\verify_audio.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\verify_text.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\html\verify_video.html',
    'c:\laragon\www\hackathon\HackAThon\frontend\api_ia\api-ia-bouton.html',
    'c:\laragon\www\hackathon\HackAThon\python_games\api_ia\api-ia-bouton.html',
    'c:\laragon\www\hackathon\HackAThon\python_games\games\ball-blast\index.html'
];

$mobileXp = '          <!-- XP Counter mobile -->
          <span class="header-xp-display" style="display:none;" id="mobile-xp-display">⚡ XP : <strong id="header-xp-counter-mobile">0</strong></span>';

$desktopXp = '        <span class="header-xp-display">⚡ Total XP : <strong id="header-xp-counter">0</strong> XP</span>';

foreach ($htmlFiles as $file) {
    if (!file_exists($file)) {
        echo "File not found: $file\n";
        continue;
    }

    echo "Processing $file...\n";
    $content = file_get_contents($file);

    // 1. Mobile XP (after close-btn)
    if (!strpos($content, 'id="header-xp-counter-mobile"')) {
        $content = preg_replace('/(<div class="close-btn">.<\/div>)/u', "$1\n$mobileXp", $content);
    }

    // 2. Desktop XP (before nav-actions)
    if (!strpos($content, 'id="header-xp-counter"')) {
        $content = str_replace('<div class="nav-actions">', "$desktopXp\n\n        <div class=\"nav-actions\">", $content);
    }

    file_put_contents($file, $content);
}

echo "Done.\n";
