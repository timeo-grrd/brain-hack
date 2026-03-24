const fs = require('fs');
const file = 'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\html\\authentification.html';
let content = fs.readFileSync(file, 'utf8');

const targetStr = '<div class="avatar-selection" id="avatarContainer" style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">';
const replacementStr = '<div class="avatar-selection" id="avatarContainer" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; justify-items: center;">';

if(content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(file, content);
    console.log('Flex remplace par Grid sur authentification.html');
} else {
    console.log('Cible non trouvee dans authentification.html');
}
