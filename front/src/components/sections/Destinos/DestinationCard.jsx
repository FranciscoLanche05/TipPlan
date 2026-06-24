import styles from "./Destinations.module.css";

const DestinationCard = ({ destination, delay = 0 }) => {
  const { title, location, image, mapUrl } = destination;

  return (
    <div
      className={styles.card}
      data-aos="fade-up"
      data-aos-delay={delay}
      data-aos-duration="800"
      data-aos-once="true"
    >
      <img src={image} alt={title} />
      <div className={styles.overlay}>
        <span className={styles.city}>{location}</span>
        <h2>{title}</h2>
        <div className={styles.card_buttons}>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.map_btn}
          >
            📍 Ver mapa
          </a>
          <button className={styles.reserve_btn}>Reservar</button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
