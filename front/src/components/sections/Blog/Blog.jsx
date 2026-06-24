import styles from './Blog.module.css';

export default function Blog() {
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
          <div className={styles.blogCard}>
            <div className={styles.blogImage}>🌴</div>
            <div className={styles.blogContent}>
              <span className={styles.blogCategory}>Destinos</span>
              <h3 className={styles.blogArticleTitle}>
                Guía completa: Las mejores playas de Ecuador
              </h3>
              <p className={styles.blogExcerpt}>
                Descubre los secretos mejor guardados de las costas
                ecuatorianas, desde playas tranquilas hasta destinos de
                aventura.
              </p>
              <div className={styles.blogMeta}>
                <span className={styles.blogAuthor}>por Marco Vélez</span>
                <span className={styles.blogDate}>15 mayo 2026</span>
              </div>
              <a href="#" className={styles.blogReadLink}>Leer artículo →</a>
            </div>
          </div>

          <div className={styles.blogCard}>
            <div className={styles.blogImage}>🛂</div>
            <div className={styles.blogContent}>
              <span className={styles.blogCategory}>Documentación</span>
              <h3 className={styles.blogArticleTitle}>
                Documentos necesarios para viajar al extranjero
              </h3>
              <p className={styles.blogExcerpt}>
                Todo lo que necesitas saber sobre pasaportes, visas y requisitos
                de entrada en diferentes países.
              </p>
              <div className={styles.blogMeta}>
                <span className={styles.blogAuthor}>por Ana Gonzáles</span>
                <span className={styles.blogDate}>12 mayo 2026</span>
              </div>
              <a href="#" className={styles.blogReadLink}>Leer artículo →</a>
            </div>
          </div>

          <div className={styles.blogCard}>
            <div className={styles.blogImage}>🛡️</div>
            <div className={styles.blogContent}>
              <span className={styles.blogCategory}>Seguridad</span>
              <h3 className={styles.blogArticleTitle}>
                Cómo viajar de forma segura: Tips imprescindibles
              </h3>
              <p className={styles.blogExcerpt}>
                Consejos prácticos para mantener tu seguridad en destinos
                desconocidos y disfrutar sin preocupaciones.
              </p>
              <div className={styles.blogMeta}>
                <span className={styles.blogAuthor}>por Roberto Silva</span>
                <span className={styles.blogDate}>10 mayo 2026</span>
              </div>
              <a href="#" className={styles.blogReadLink}>Leer artículo →</a>
            </div>
          </div>

          <div className={styles.blogCard}>
            <div className={styles.blogImage}>🌦️</div>
            <div className={styles.blogContent}>
              <span className={styles.blogCategory}>Clima</span>
              <h3 className={styles.blogArticleTitle}>
                Guía de climas: Prepárate para cada estación
              </h3>
              <p className={styles.blogExcerpt}>
                Entiende los patrones climáticos de Ecuador y prepara tu
                equipaje según la época del año.
              </p>
              <div className={styles.blogMeta}>
                <span className={styles.blogAuthor}>por Daniela López</span>
                <span className={styles.blogDate}>8 mayo 2026</span>
              </div>
              <a href="#" className={styles.blogReadLink}>Leer artículo →</a>
            </div>
          </div>

          <div className={styles.blogCard}>
            <div className={styles.blogImage}>🎭</div>
            <div className={styles.blogContent}>
              <span className={styles.blogCategory}>Cultura</span>
              <h3 className={styles.blogArticleTitle}>
                Respeta y vive la cultura local: Etiqueta del viajero
              </h3>
              <p className={styles.blogExcerpt}>
                Aprende sobre tradiciones, costumbres y normas de cortesía para
                ser un viajero responsable.
              </p>
              <div className={styles.blogMeta}>
                <span className={styles.blogAuthor}>por Patricia Ruiz</span>
                <span className={styles.blogDate}>5 mayo 2026</span>
              </div>
              <a href="#" className={styles.blogReadLink}>Leer artículo →</a>
            </div>
          </div>

          <div className={styles.blogCard}>
            <div className={styles.blogImage}>✈️</div>
            <div className={styles.blogContent}>
              <span className={styles.blogCategory}>Viajes</span>
              <h3 className={styles.blogArticleTitle}>
                Itinerarios imprescindibles: 7 y 15 días por Ecuador
              </h3>
              <p className={styles.blogExcerpt}>
                Rutas probadas que combinan la riqueza de la costa, sierra y
                Amazonía para viajeros con poco tiempo.
              </p>
              <div className={styles.blogMeta}>
                <span className={styles.blogAuthor}>por Gustavo Torres</span>
                <span className={styles.blogDate}>2 mayo 2026</span>
              </div>
              <a href="#" className={styles.blogReadLink}>Leer artículo →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
