const fs = require('fs');
const path = require('path');

const htmlDir = 'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\html';
const scriptTag = '<script src="../js/header-auth.js"></script>';

const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(htmlDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Eviter les doublons
    if (content.includes('header-auth.js')) {
        console.log(`Déjà présent : ${file}`);
        return;
    }
    
    // Injecter avant </body>
    if (content.includes('</body>')) {
        content = content.replace('</body>', `  ${scriptTag}\n</body>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Injecté dans : ${file}`);
    } else {
        console.log(`Pas de </body> dans : ${file}`);
    }
});

console.log('Injection terminée.');
