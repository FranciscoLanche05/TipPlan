const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 1. Rename directories
const renameMap = [
  { old: 'componentes', new: 'components' },
  { old: 'estilos', new: 'styles' },
  { old: 'enrutador', new: 'router' },
  { old: 'servicios', new: 'services' },
  { old: 'paginas', new: 'pages' },
  { old: 'plantillas', new: 'layouts' },
];

for (const { old: oldName, new: newName } of renameMap) {
  const oldPath = path.join(srcDir, oldName);
  const newPath = path.join(srcDir, newName);
  if (fs.existsSync(oldPath)) {
    fs.cpSync(oldPath, newPath, { recursive: true });
    fs.rmSync(oldPath, { recursive: true, force: true });
    console.log(`Renamed (copied/deleted) ${oldName} to ${newName}`);
  }
}

// 2. Rename internal directories in components
const componentsDir = path.join(srcDir, 'components');
if (fs.existsSync(componentsDir)) {
  const internalRenameMap = [
    { old: 'comunes', new: 'common' },
    { old: 'secciones', new: 'sections' },
  ];
  for (const { old: oldName, new: newName } of internalRenameMap) {
    const oldPath = path.join(componentsDir, oldName);
    const newPath = path.join(componentsDir, newName);
    if (fs.existsSync(oldPath)) {
      fs.cpSync(oldPath, newPath, { recursive: true });
      fs.rmSync(oldPath, { recursive: true, force: true });
      console.log(`Renamed components/${oldName} to components/${newName}`);
    }
  }
}

// 3. Recursive replacement in files
const replaceMap = [
  { regex: /\bcomponentes\b/g, replacement: 'components' },
  { regex: /\bcomunes\b/g, replacement: 'common' },
  { regex: /\bsecciones\b/g, replacement: 'sections' },
  { regex: /\bestilos\b/g, replacement: 'styles' },
  { regex: /\benrutador\b/g, replacement: 'router' },
  { regex: /\bservicios\b/g, replacement: 'services' },
  { regex: /\bpaginas\b/g, replacement: 'pages' },
  { regex: /\bplantillas\b/g, replacement: 'layouts' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const { regex, replacement } of replaceMap) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
processDirectory(path.join(__dirname, 'public')); // if any
if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  let m = false;
  for (const { regex, replacement } of replaceMap) {
    if (regex.test(html)) {
      html = html.replace(regex, replacement);
      m = true;
    }
  }
  if (m) {
    fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
    console.log(`Updated imports in index.html`);
  }
}

console.log("Restructure complete.");
