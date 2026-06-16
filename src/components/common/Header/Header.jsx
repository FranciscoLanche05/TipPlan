import styles from "./Header.module.css";
import bgHeader from "../../../images/cotopaxi.webp";

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
          <button className={styles.btn_explorar}>
            Explorar Destinos →
          </button>
          <button className={styles.btn_plan}>
            ▶ Planificar mi aventura
          </button>
        </div>
      </div>
    </section>
  );
};

export default Header;
