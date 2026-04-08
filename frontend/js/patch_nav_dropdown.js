const fs = require('fs');
const path = require('path');

const rootPath = 'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\html';
const apiIaPath = 'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\api_ia';

const files = [
    ...fs.readdirSync(rootPath).filter(f => f.endsWith('.html')).map(f => path.join(rootPath, f)),
    ...fs.readdirSync(apiIaPath).filter(f => f.endsWith('.html')).map(f => path.join(apiIaPath, f))
];

const replacement = `
          <div class="nav-dropdown">
            <a href="#" class="nav-link dropdown-toggle" onclick="event.preventDefault(); this.parentElement.classList.toggle('active');">Vérificateur d'IA ▾</a>
            <div class="dropdown-menu">
              <a href="/hackathon/HackAThon/frontend/html/verify_text.html" class="dropdown-item">Vérifier un texte</a>
              <a href="/hackathon/HackAThon/frontend/api_ia/api-ia-bouton.html" class="dropdown-item">Vérifier une image</a>
              <a href="/hackathon/HackAThon/frontend/html/verify_video.html" class="dropdown-item">Vérifier une vidéo</a>
              <a href="/hackathon/HackAThon/frontend/html/verify_audio.html" class="dropdown-item">Vérifier un son</a>
            </div>
          </div>
`;

let count = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');

    const regex = /<a[^>]*href="[^"]*api-ia-bouton\.html"[^>]*>[\s\S]*?<\/a>\s*/;
    
    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(file, content);
        count++;
    }
}
console.log('Done modifying ' + count + ' files for dropdown.');
