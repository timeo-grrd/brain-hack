const fs = require('fs');
const path = require('path');

const htmlDir = 'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\html';
const scriptTag = '<script src="../js/chatbot.js"></script>';
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(htmlDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('chatbot.js')) {
        console.log(`Déjà présent : ${file}`);
        return;
    }
    // Injecter juste avant </body>
    if (content.includes('</body>')) {
        content = content.replace('</body>', `  ${scriptTag}\n</body>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Injecté : ${file}`);
    }
});
console.log('Injection chatbot terminée.');
