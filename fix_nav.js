const fs = require('fs');
const path = require('path');

const dirs = [
    'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\html',
    'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\api_ia'
];

let count = 0;

for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => path.join(dir, f));
    
    for (const file of files) {
        let content = fs.readFileSync(file, 'utf-8');
        if (content.includes('event.preventDefault();')) {
            content = content.replace(/onclick="event\.preventDefault\(\);\s*/g, 'onclick="');
            fs.writeFileSync(file, content);
            count++;
        }
    }
}
console.log('Fixed ' + count + ' HTML files.');
