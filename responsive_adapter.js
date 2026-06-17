const fs = require('fs');
const path = require('path');

const cssFiles = [
  {
    path: 'src/componentes/secciones/SobreNosotros/About.module.css',
    mobile: `
@media (max-width: 768px) {
  .aboutContainer {
    flex-direction: column;
    padding: 0 20px;
    gap: 40px;
  }
  .about { padding: 60px 0; }
  .content h1 { font-size: 32px; }
  .image img { min-height: 300px; }
}
`,
    tv: `
@media (min-width: 2000px) {
  .aboutContainer { max-width: none; width: 92%; }
  .content h1 { font-size: 64px; }
  .text { font-size: 24px; }
  .featureItem h3 { font-size: 24px; }
  .featureItem p { font-size: 18px; }
}
`
  },
  {
    path: 'src/componentes/comunes/Estadisticas/Body.module.css',
    mobile: `
@media (max-width: 768px) {
  .bodyContainer {
    flex-direction: column;
    gap: 30px;
    padding: 0 20px;
  }
  .body { padding: 40px 0; }
}
`,
    tv: `
@media (min-width: 2000px) {
  .bodyContainer { max-width: none; width: 92%; gap: 100px; }
  .stat_box h2 { font-size: 64px; }
  .stat_box p { font-size: 24px; }
}
`
  },
  {
    path: 'src/componentes/secciones/Destinos/Destinations.module.css',
    mobile: `
@media (max-width: 768px) {
  .destinationsContainer { padding: 0 20px; }
  .header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .header h1 { font-size: 32px; }
  .cards { grid-template-columns: 1fr; gap: 20px; }
}
`,
    tv: `
@media (min-width: 2000px) {
  .destinationsContainer { max-width: none; width: 92%; }
  .header h1 { font-size: 64px; }
  .cards { grid-template-columns: repeat(4, 1fr); gap: 40px; }
}
`
  },
  {
    path: 'src/componentes/secciones/Presupuesto/Budget.module.css',
    mobile: `
@media (max-width: 768px) {
  .budgetSection { padding: 60px 0; }
  .container { width: 90%; }
  .content { grid-template-columns: 1fr; gap: 40px; }
  .title { font-size: 32px; }
  .formGrid { grid-template-columns: 1fr; }
}
`,
    tv: `
@media (min-width: 2000px) {
  .container { max-width: none; width: 92%; }
  .title { font-size: 72px; }
  .description { font-size: 24px; }
  .featureItem h3 { font-size: 24px; }
  .featureItem p { font-size: 18px; }
  .input, .select { font-size: 20px; padding: 20px; }
  .btn_calculate { font-size: 24px; padding: 20px; }
}
`
  },
  {
    path: 'src/componentes/secciones/PreguntasFrecuentes/FAQ.module.css',
    mobile: `
@media (max-width: 768px) {
  .faqSection { padding: 60px 0; }
  .container { width: 90%; }
  .header { grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px; }
  .title { font-size: 32px; }
  .grid { grid-template-columns: 1fr; gap: 20px; }
}
`,
    tv: `
@media (min-width: 2000px) {
  .container { max-width: none; width: 92%; }
  .title { font-size: 64px; }
  .subtitle { font-size: 24px; }
  .question { font-size: 24px; padding: 30px; }
  .answer { font-size: 20px; padding: 0 30px 30px 30px; }
}
`
  },
  {
    path: 'src/componentes/comunes/PieDePagina/Footer.module.css',
    mobile: `
@media (max-width: 768px) {
  .footer { padding: 40px 0 20px 0; }
  .footerContent { grid-template-columns: 1fr; gap: 30px; }
  .footerBottom { flex-direction: column; gap: 15px; text-align: center; }
}
`,
    tv: `
@media (min-width: 2000px) {
  .footerContainer { max-width: none; width: 92%; }
  .footerDesc { font-size: 20px; }
  .footerSection h4 { font-size: 24px; }
  .footerSection a { font-size: 20px; }
}
`
  },
  {
    path: 'src/componentes/comunes/Encabezado/Header.module.css',
    mobile: `
@media (max-width: 768px) {
  .container { padding: 100px 20px 40px 20px; }
  .container h1 { font-size: 40px; line-height: 1.2; }
  .search_bar { flex-direction: column; border-radius: 15px; background: transparent; padding: 0; box-shadow: none; }
  .input_group { width: 100%; background: #ffffff; margin-bottom: 10px; border-radius: 10px; padding: 15px; }
  .input_group input, .input_group select { width: 100%; }
  .btn_search { width: 100%; border-radius: 10px; padding: 15px; }
  .input_divider { display: none; }
}
`,
    tv: `
@media (min-width: 2000px) {
  .container { max-width: 1200px; }
  .container h1 { font-size: 100px; }
  .container p { font-size: 28px; }
  .search_bar { padding: 20px; }
  .input_group label { font-size: 18px; }
  .input_group input, .input_group select { font-size: 24px; }
  .btn_search { font-size: 24px; padding: 20px 40px; }
}
`
  },
  {
    path: 'src/componentes/secciones/Blog/Blog.module.css',
    mobile: `
@media (max-width: 768px) {
  .blogSection { padding: 60px 20px; }
  .blogTitle { font-size: 32px; }
  .blogGrid { grid-template-columns: 1fr; gap: 30px; }
}
`,
    tv: `
@media (min-width: 2000px) {
  .blogContainer { max-width: none; width: 92%; }
  .blogTitle { font-size: 64px; }
  .blogGrid { grid-template-columns: repeat(4, 1fr); gap: 40px; }
  .cardTitle { font-size: 32px; }
  .cardExcerpt { font-size: 20px; }
}
`
  },
  {
    path: 'src/componentes/secciones/Experiencias/Experiences.module.css',
    mobile: `
@media (max-width: 768px) {
  .experiencesSection { padding: 60px 0; }
  .experiencesContainer { padding: 0 20px; }
  .experiencesTitle { font-size: 32px; }
  .experiencesGrid { grid-template-columns: 1fr; gap: 30px; }
}
`,
    tv: `
@media (min-width: 2000px) {
  .experiencesContainer { max-width: none; width: 92%; }
  .experiencesTitle { font-size: 64px; }
  .experiencesGrid { grid-template-columns: repeat(3, 1fr); gap: 60px; }
  .cardTitle { font-size: 32px; }
  .cardDesc { font-size: 20px; }
}
`
  },
  {
    path: 'src/componentes/secciones/MapaInteractivo/InteractiveMap.module.css',
    mobile: `
@media (max-width: 768px) {
  .mapSection { padding: 60px 0; }
  .mapContainer { padding: 0 20px; flex-direction: column; }
  .mapTextSide { flex: none; width: 100%; }
  .mapTitle { font-size: 32px; }
  .mapVisualSide { min-height: 400px; }
}
`,
    tv: `
@media (min-width: 2000px) {
  .mapContainer { max-width: none; width: 92%; gap: 100px; }
  .mapTitle { font-size: 64px; }
  .mapDesc { font-size: 24px; }
  .locationItem h4 { font-size: 28px; }
  .locationItem p { font-size: 20px; }
}
`
  }
];

cssFiles.forEach(file => {
  const absolutePath = path.join(__dirname, file.path);
  if (fs.existsSync(absolutePath)) {
    let content = fs.readFileSync(absolutePath, 'utf8');
    
    // Remove existing max-width: 768px or similar media queries entirely if they exist, to replace them cleanly.
    // This is a simple append, but if there are duplicates it might cause issues, so we'll just append it.
    
    // Append new media queries
    content += '\n' + file.mobile + '\n' + file.tv + '\n';
    
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log('Appended to', file.path);
  }
});
console.log("Responsive adaptation complete!");
