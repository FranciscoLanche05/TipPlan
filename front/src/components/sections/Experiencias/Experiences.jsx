import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ROUTES } from '../../../constants/routes';
import styles from './Experiences.module.css';
import SectionTag from '../../ui/EtiquetaSeccion/SectionTag';

export default function Experiences() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();

  const handlePlanificarClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(ROUTES.NUEVO_VIAJE);
    } else {
      openLoginModal();
    }
  };

  const handleCategoryClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(ROUTES.ACTIVIDADES);
    } else {
      openLoginModal();
    }
  };

  return (
    <section id="experiencias" className={styles.experiencesSection}>
      <div className={styles.experiencesContainer}>
        {/* CABECERA */}
        <div className={styles.experiencesHeader}>
          <SectionTag>AVENTURA & CULTURA</SectionTag>
          <h2 className={styles.experiencesTitle}>
            Experiencias y <span className={styles.experiencesTitleItalic}>Actividades</span>
          </h2>
          <p className={styles.experiencesSubtitle}>
            Desde excursiones en la selva hasta gastronomía local: vive Ecuador
            de una forma que nunca olvidarás.
          </p>
        </div>

        {/* GRID DE TARJETAS */}
        <div className={styles.experiencesGrid}>
          <div className={styles.expCard}>
            <div className={`${styles.expIconWrap} ${styles.expIconGreen}`}>🥾</div>
            <h3 className={styles.expTitle}>Excursiones</h3>
            <p className={styles.expDesc}>
              Rutas guiadas por volcanes, reservas naturales y comunidades
              indígenas del Ecuador.
            </p>
            <a href="/actividades" onClick={handleCategoryClick} className={styles.expLink}>Ver tours →</a>
          </div>

          <div className={styles.expCard}>
            <div className={`${styles.expIconWrap} ${styles.expIconGold}`}>🧗</div>
            <h3 className={styles.expTitle}>Aventura extrema</h3>
            <p className={styles.expDesc}>
              Rafting, canopy, escalada en roca y más. Para los que buscan
              adrenalina pura.
            </p>
            <a href="/actividades" onClick={handleCategoryClick} className={styles.expLink}>Ver actividades →</a>
          </div>

          <div className={styles.expCard}>
            <div className={`${styles.expIconWrap} ${styles.expIconOrange}`}>🥘</div>
            <h3 className={styles.expTitle}>Gastronomía</h3>
            <p className={styles.expDesc}>
              Descubre los sabores auténticos del Ecuador: mercados,
              restaurantes locales y food tours.
            </p>
            <a href="/actividades" onClick={handleCategoryClick} className={styles.expLink}>Ver experiencias →</a>
          </div>

          <div className={styles.expCard}>
            <div className={`${styles.expIconWrap} ${styles.expIconSage}`}>🎉</div>
            <h3 className={styles.expTitle}>Eventos locales</h3>
            <p className={styles.expDesc}>
              Festivales, ferias artesanales y celebraciones culturales que no
              te puedes perder.
            </p>
            <a href="/actividades" onClick={handleCategoryClick} className={styles.expLink}>Ver eventos →</a>
          </div>
        </div>

        {/* BANNER INFERIOR CTA */}
        <div className={styles.experiencesCtaBanner}>
          <div className={styles.ctaBannerText}>
            <h3>¿No sabes por dónde empezar?</h3>
            <p>
              Cuéntanos tus intereses y te recomendamos la experiencia perfecta
              para ti.
            </p>
          </div>
          <button onClick={handlePlanificarClick} className={styles.ctaBannerBtn}>
            Planificar mi aventura →
          </button>
        </div>
      </div>
    </section>
  );
}
