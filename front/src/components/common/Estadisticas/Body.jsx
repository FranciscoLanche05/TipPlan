import styles from "./Body.module.css";

const Body = () => {
  return (
    <section className={styles.body}>
      <div className={styles.bodyContainer}>
        <div className={styles.stat_box}>
          <h2>50+</h2>
          <p>Destinos disponibles</p>
        </div>
        <div className={styles.stat_box}>
          <h2>7</h2>
          <p>Continentes cubiertos</p>
        </div>
        <div className={styles.stat_box}>
          <h2>12K+</h2>
          <p>Viajeros satisfechos</p>
        </div>
        <div className={styles.stat_box}>
          <h2>100%</h2>
          <p>Gratuito para siempre</p>
        </div>
      </div>
    </section>
  );
};

export default Body;
