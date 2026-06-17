const fs = require('fs');
const path = require('path');

const cssFilesToUpdate = [
  'src/componentes/secciones/SobreNosotros/About.module.css',
  'src/componentes/comunes/Estadisticas/Body.module.css',
  'src/componentes/secciones/Destinos/Destinations.module.css',
  'src/componentes/secciones/Experiencias/Experiences.module.css',
  'src/componentes/secciones/MapaInteractivo/InteractiveMap.module.css',
  'src/componentes/secciones/Presupuesto/Budget.module.css',
  'src/componentes/secciones/PreguntasFrecuentes/FAQ.module.css',
  'src/componentes/secciones/Blog/Blog.module.css',
  'src/componentes/comunes/PieDePagina/Footer.module.css',
  'src/componentes/comunes/BarraNavegacion/Navbar.module.css'
];

cssFilesToUpdate.forEach(relativePath => {
  const absolutePath = path.join(__dirname, relativePath);
  if (!fs.existsSync(absolutePath)) return;

  let content = fs.readFileSync(absolutePath, 'utf8');

  // Change all max-width 1200px or 1300px to 1440px and width 92%
  content = content.replace(/max-width:\s*1200px;/g, 'max-width: 1440px;\n  width: 92%;');
  content = content.replace(/max-width:\s*1300px;/g, 'max-width: 1440px;\n  width: 92%;');

  // Specific to Navbar
  if (relativePath.includes('Navbar.module.css')) {
    content = content.replace(/padding:\s*12px\s+max\(40px,\s*calc\(\(100%\s*-\s*1200px\)\s*\/\s*2\)\);/, 'padding: 12px 4%;');
  }

  // Specific to Footer
  if (relativePath.includes('Footer.module.css')) {
    content = content.replace(/padding:\s*80px\s+80px\s+40px\s+80px;/g, 'padding: 80px 0 40px 0;');
  }

  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log(`Updated ${relativePath}`);
});

console.log("CSS adjustments complete.");
