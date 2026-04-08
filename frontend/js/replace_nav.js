const fs = require('fs');
const path = require('path');

const rootPath = 'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\html';
const apiIaPath = 'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\api_ia';

const files = [
    ...fs.readdirSync(rootPath).filter(f => f.endsWith('.html')).map(f => path.join(rootPath, f)),
    ...fs.readdirSync(apiIaPath).filter(f => f.endsWith('.html')).map(f => path.join(apiIaPath, f))
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');

    // 1. Modifier les href absolus
    content = content.replace(/href="[^"]*index\.html"/g, 'href="/hackathon/HackAThon/frontend/html/index.html"');
    content = content.replace(/href="[^"]*games\.html"/g, 'href="/hackathon/HackAThon/frontend/html/games.html"');
    content = content.replace(/href="[^"]*api-ia-bouton\.html"/g, 'href="/hackathon/HackAThon/frontend/api_ia/api-ia-bouton.html"');
    content = content.replace(/href="[^"]*Apropos\.html"/g, 'href="/hackathon/HackAThon/frontend/html/Apropos.html"');
    content = content.replace(/href="[^"]*authentification\.html\?mode=login"/g, 'href="/hackathon/HackAThon/frontend/html/authentification.html?mode=login"');
    content = content.replace(/href="[^"]*authentification\.html\?mode=register"/g, 'href="/hackathon/HackAThon/frontend/html/authentification.html?mode=register"');

    // 2. Transformer le themeSelector en class et retirer nav-link pour fixer le burger
    content = content.replace(/id="themeSelector"/g, 'class="theme-selector"');
    content = content.replace(/class="theme-wrapper nav-link"/g, 'class="theme-wrapper"');

    fs.writeFileSync(file, content);
}
console.log('Done modifying ' + files.length + ' files.');
