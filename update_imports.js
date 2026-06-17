const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Map of old paths to new Spanish paths
const pathMap = {
  'components/common/Navbar': 'componentes/comunes/BarraNavegacion',
  'components/common/Header': 'componentes/comunes/Encabezado',
  'components/common/Body': 'componentes/comunes/Estadisticas',
  'components/common/Footer': 'componentes/comunes/PieDePagina',
  'components/sections/About': 'componentes/secciones/SobreNosotros',
  'components/sections/Destinations': 'componentes/secciones/Destinos',
  'components/sections/Experiences': 'componentes/secciones/Experiencias',
  'components/sections/InteractiveMap': 'componentes/secciones/MapaInteractivo',
  'components/sections/Budget': 'componentes/secciones/Presupuesto',
  'components/sections/FAQ': 'componentes/secciones/PreguntasFrecuentes',
  'components/sections/Blog': 'componentes/secciones/Blog',
  'components/ui/SectionTag': 'componentes/ui/EtiquetaSeccion',
  'layouts/MainLayout': 'plantillas/PlantillaPrincipal',
  'pages/Home': 'paginas/Inicio',
  'router': 'enrutador',
  'services/data': 'servicios/datos',
  'styles': 'estilos',
  'images': 'imagenes'
};

// Function to replace imports in a file
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace absolute-like aliases if any (assuming relative for now)
  // The strategy: We'll replace the folder names in any string that looks like a path.
  // Since we use relative paths, they might look like '../../components/common/Navbar'
  
  for (const [oldPath, newPath] of Object.entries(pathMap)) {
    // Replace paths with forward slashes
    const regex = new RegExp(oldPath.replace(/\//g, '\\/'), 'g');
    content = content.replace(regex, newPath);
  }

  // Also replace single word folders that might be used directly
  content = content.replace(/\/components\//g, '/componentes/');
  content = content.replace(/\/layouts\//g, '/plantillas/');
  content = content.replace(/\/pages\//g, '/paginas/');
  content = content.replace(/\/router/g, '/enrutador');
  content = content.replace(/\/services\//g, '/servicios/');
  content = content.replace(/\/styles\//g, '/estilos/');
  content = content.replace(/\/images\//g, '/imagenes/');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  }
}

// Walk through all files in the new Spanish structure and update imports
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // Don't go into old directories
      if (!['components', 'layouts', 'pages', 'router', 'services', 'styles', 'images'].includes(file)) {
        walkDir(filePath);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      updateImports(filePath);
    }
  }
}

walkDir(srcDir);
// Also update main.jsx
updateImports(path.join(srcDir, 'main.jsx'));

console.log("Imports updated successfully!");
