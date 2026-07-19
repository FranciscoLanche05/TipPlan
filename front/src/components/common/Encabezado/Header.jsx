import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./Header.module.css";

const Header = () => {
  const { openLoginModal } = useAuth();

  return (
    <section
      className={styles.header}
      data-aos="fade-in"
      data-aos-duration="1200"
      data-aos-once="true"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.videoBackground}
      >
        <source src="/images/coverr-beautiful-valley-at-golden-hour-3055-1080p.mp4" type="video/mp4" />
      </video>

      <div className={styles.container}>
        <span className={styles.tag}>✦ TU PLATAFORMA DE VIAJES EN ECUADOR</span>
        <h1>
          Tu próxima <br />
          <span>aventura</span>
          <br />
          empieza aquí
        </h1>
        <p>
          Planifica, organiza y vive cada viaje sin complicaciones.
          Descubre destinos increíbles con guías, mapas y consejos
          en un solo lugar.
        </p>
        <div className={styles.buttons}>
          <a href="#destinos" className={styles.btn_explorar} style={{ textDecoration: 'none', display: 'inline-block' }}>
            Explorar Destinos →
          </a>
          <button 
            onClick={openLoginModal} 
            className={styles.btn_plan} 
            style={{ textDecoration: 'none', display: 'inline-block', cursor: 'pointer' }}
          >
            ▶ Planificar mi aventura
          </button>
        </div>
      </div>
    </section>
  );
};

export default Header;
