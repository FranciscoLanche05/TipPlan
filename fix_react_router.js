const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let newContent = content.replace(/react-enrutador-dom/g, 'react-router-dom');
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Fixed ${filePath}`);
      }
    }
  }
}

walkDir(srcDir);
// also main.jsx
let content = fs.readFileSync(path.join(srcDir, 'main.jsx'), 'utf8');
let newContent = content.replace(/react-enrutador-dom/g, 'react-router-dom');
if (content !== newContent) {
  fs.writeFileSync(path.join(srcDir, 'main.jsx'), newContent, 'utf8');
  console.log(`Fixed main.jsx`);
}
console.log("Done");
