import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './Blog.module.css';

const articles = [
  {
    id: 1,
    emoji: '🌴',
    category: 'Destinos',
    title: 'Guía completa: Las mejores playas de Ecuador',
    excerpt: 'Descubre los secretos mejor guardados de las costas ecuatorianas, desde playas tranquilas hasta destinos de aventura.',
    author: 'Marco Vélez',
    date: '15 mayo 2026',
    content: 'Ecuador alberga algunas de las playas más hermosas y diversas de Sudamérica. Desde la vibrante vida de Montañita, paraíso de los surfistas, hasta la prístina arena de Los Frailes en el Parque Nacional Machalilla. Más al norte, Mompiche ofrece una vibra relajada y paisajes exuberantes. Cada playa tiene su propio encanto, gastronomía única (¡no te pierdas un buen ceviche manaba!) y actividades para todos los gustos. Recuerda viajar con respeto al ecosistema y apoyar la economía local.'
  },
  {
    id: 2,
    emoji: '🛂',
    category: 'Documentación',
    title: 'Documentos necesarios para viajar al extranjero',
    excerpt: 'Todo lo que necesitas saber sobre pasaportes, visas y requisitos de entrada en diferentes países.',
    author: 'Ana Gonzáles',
    date: '12 mayo 2026',
    content: 'Antes de emprender tu próxima aventura internacional, asegúrate de tener todos los documentos en regla. Tu pasaporte debe tener al menos 6 meses de vigencia desde la fecha de retorno. Verifica siempre los requisitos de visado del país de destino; algunos ofrecen visas a la llegada (VOA), mientras que otros requieren trámites de semanas de anticipación. No olvides contratar un seguro de viaje médico y revisar si necesitas vacunas específicas (como la fiebre amarilla).'
  },
  {
    id: 3,
    emoji: '🛡️',
    category: 'Seguridad',
    title: 'Cómo viajar de forma segura: Tips imprescindibles',
    excerpt: 'Consejos prácticos para mantener tu seguridad en destinos desconocidos y disfrutar sin preocupaciones.',
    author: 'Roberto Silva',
    date: '10 mayo 2026',
    content: 'La seguridad es prioridad en cualquier viaje. Al llegar a un nuevo destino, siempre comparte tu itinerario con familiares o amigos. Evita llevar grandes sumas de efectivo y guarda copias digitales de tus documentos importantes en la nube. Usa el transporte oficial y mantente atento a tu entorno, especialmente en áreas concurridas. Confía en tu instinto y recuerda que la mejor herramienta de seguridad es siempre la prevención.'
  },
  {
    id: 4,
    emoji: '🌦️',
    category: 'Clima',
    title: 'Guía de climas: Prepárate para cada estación',
    excerpt: 'Entiende los patrones climáticos de Ecuador y prepara tu equipaje según la época del año.',
    author: 'Daniela López',
    date: '8 mayo 2026',
    content: 'El clima en Ecuador varía drásticamente según la región. En los Andes (Sierra), el clima es templado pero frío en las noches, por lo que las capas de ropa son esenciales. La Costa es cálida y húmeda, especialmente de enero a mayo (temporada de lluvias). En la Amazonía (Oriente) espera un clima tropical y húmedo todo el año. Para Galápagos, el clima es influenciado por las corrientes oceánicas: cálido de diciembre a mayo y más fresco de junio a noviembre.'
  },
  {
    id: 5,
    emoji: '🎭',
    category: 'Cultura',
    title: 'Respeta y vive la cultura local: Etiqueta del viajero',
    excerpt: 'Aprende sobre tradiciones, costumbres y normas de cortesía para ser un viajero responsable.',
    author: 'Patricia Ruiz',
    date: '5 mayo 2026',
    content: 'Viajar es una oportunidad para aprender de otras culturas. Al visitar comunidades en Ecuador, muestra respeto por sus tradiciones y formas de vida. Pide permiso antes de tomar fotografías a las personas, y apoya a los artesanos comprando productos locales en lugar de regatear excesivamente. La amabilidad abre muchas puertas; un simple "buenos días" o "gracias" en el idioma local puede transformar por completo tu experiencia.'
  },
  {
    id: 6,
    emoji: '✈️',
    category: 'Viajes',
    title: 'Itinerarios imprescindibles: 7 y 15 días por Ecuador',
    excerpt: 'Rutas probadas que combinan la riqueza de la costa, sierra y Amazonía para viajeros con poco tiempo.',
    author: 'Gustavo Torres',
    date: '2 mayo 2026',
    content: '¿Tienes 7 días? Te recomendamos la ruta Quito - Cotopaxi - Quilotoa - Baños, perfecta para experimentar los Andes y la puerta a la Amazonía. Si tienes 15 días, expande la ruta anterior para incluir un viaje en tren hacia la Nariz del Diablo, una visita a las ruinas de Ingapirca, la histórica ciudad de Cuenca y termina relajándote en las hermosas playas de la ruta del Spondylus. ¡Ecuador en 4 mundos te espera!'
  }
];

export default function Blog() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const openArticle = (e, article) => {
    e.preventDefault();
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  return (
    <section id="blog" className={styles.blogSection}>
      <div className={styles.blogContainer}>
        <div className={styles.blogHeader}>
          <span className={styles.blogTag}>BLOG Y CONSEJOS</span>
          <h2 className={styles.blogTitle}>
            Blog y Consejos de <em>Viaje</em>
          </h2>
          <p className={styles.blogSubtitle}>
            Artículos sobre tips de viaje, documentación, seguridad, clima y
            cultura local.
          </p>
        </div>

        {/* Grid de Artículos */}
        <div className={styles.blogGrid}>
          {articles.map((article) => (
            <div key={article.id} className={styles.blogCard}>
              <div className={styles.blogImage}>{article.emoji}</div>
              <div className={styles.blogContent}>
                <span className={styles.blogCategory}>{article.category}</span>
                <h3 className={styles.blogArticleTitle}>{article.title}</h3>
                <p className={styles.blogExcerpt}>{article.excerpt}</p>
                <div className={styles.blogMeta}>
                  <span className={styles.blogAuthor}>por {article.author}</span>
                  <span className={styles.blogDate}>{article.date}</span>
                </div>
                <a 
                  href="#" 
                  className={styles.blogReadLink} 
                  onClick={(e) => openArticle(e, article)}
                >
                  Leer artículo →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal del Artículo */}
      {selectedArticle && (
        <div className={styles.modalOverlay} onClick={closeArticle}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeArticle} aria-label="Cerrar artículo">
              <X size={24} />
            </button>
            <div className={styles.modalHeader}>
              <div className={styles.modalEmoji}>{selectedArticle.emoji}</div>
              <span className={styles.modalCategory}>{selectedArticle.category}</span>
            </div>
            <h2 className={styles.modalTitle}>{selectedArticle.title}</h2>
            <div className={styles.modalMeta}>
              <span className={styles.modalAuthor}>por {selectedArticle.author}</span>
              <span className={styles.modalDate}>{selectedArticle.date}</span>
            </div>
            <div className={styles.modalBody}>
              <p>{selectedArticle.content}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
