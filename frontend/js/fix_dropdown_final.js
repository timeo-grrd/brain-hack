const fs = require('fs');
const path = require('path');

const rootPath = 'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\html';
const apiIaPath = 'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\api_ia';

const files = [
    ...fs.readdirSync(rootPath).filter(f => f.endsWith('.html')).map(f => path.join(rootPath, f)),
    ...fs.readdirSync(apiIaPath).filter(f => f.endsWith('.html')).map(f => path.join(apiIaPath, f))
];

const cleanDropdown = `          <div class="nav-dropdown">
            <a href="#" class="nav-link dropdown-toggle" onclick="event.preventDefault(); this.parentElement.classList.toggle('active');">Vérificateur d'IA ▾</a>
            <div class="dropdown-menu">
              <a href="/hackathon/HackAThon/frontend/html/verify_text.html" class="dropdown-item">Vérifier un texte</a>
              <a href="/hackathon/HackAThon/frontend/api_ia/api-ia-bouton.html" class="dropdown-item">Vérifier une image</a>
              <a href="/hackathon/HackAThon/frontend/html/verify_video.html" class="dropdown-item">Vérifier une vidéo</a>
              <a href="/hackathon/HackAThon/frontend/html/verify_audio.html" class="dropdown-item">Vérifier un son</a>
            </div>
          </div>`;

// Regex pour capturer le désordre récursif
// Il commence à <div class="nav-dropdown"> et contient "Vérificateur d'IA" plusieurs fois ou une seule fois mais avec des div mal fermées
// On va cibler la zone entre Mini-jeux et le thème sélecteur ou l'avatar
const recursiveNavRegex = /<div class="nav-dropdown">[\s\S]*?Vérificateur d'IA[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Tentative de remplacement de la zone spécifique
    // On cherche le bloc qui commence par <div class="nav-dropdown"> et finit juste avant <div class="theme-wrapper"
    const startTag = '<div class="nav-dropdown">';
    const endTag = '<div class="theme-wrapper"';
    
    let startIndex = content.indexOf(startTag);
    let endIndex = content.indexOf(endTag);
    
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        let oldPart = content.substring(startIndex, endIndex);
        // On s'assure que c'est bien le menu IA
        if (oldPart.includes("Vérificateur d'IA")) {
            content = content.substring(0, startIndex) + cleanDropdown + "\n" + content.substring(endIndex);
            fs.writeFileSync(file, content);
            console.log(`Fixed dropdown in ${path.basename(file)}`);
        }
    } else {
        console.log(`Skipped ${path.basename(file)} (tags not found or mismatch)`);
    }
}
