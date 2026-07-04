import styles from "./Header.module.css";
import bgHeader from "../../../imagenes/cotopaxi.webp";

const Header = () => {
  return (
    <section
      className={styles.header}
      style={{ backgroundImage: `url(${bgHeader})` }}
      data-aos="fade-in"
      data-aos-duration="1200"
      data-aos-once="true"
    >
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
          <a href="#planificador" className={styles.btn_plan} style={{ textDecoration: 'none', display: 'inline-block' }}>
            ▶ Planificar mi aventura
          </a>
        </div>
      </div>
    </section>
  );
};

export default Header;
