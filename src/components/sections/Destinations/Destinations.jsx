import destinations from "../../../services/data/destinations";
import DestinationCard from "./DestinationCard";
import styles from "./Destinations.module.css";

const Destinations = () => {
  return (
    <section className={styles.destinations}>
      <span className={styles.tag}>ECUADOR</span>

      <div className={styles.header}>
        <h1>
          Destinos <span>más populares</span>
        </h1>
        <p className={styles.text}>
          Los lugares más icónicos de nuestro
          hermoso país, listos para explorar.
        </p>
      </div>

      <div className={styles.cards}>
        {destinations.map((dest, index) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            delay={index * 150}
          />
        ))}
      </div>
    </section>
  );
};

export default Destinations;
