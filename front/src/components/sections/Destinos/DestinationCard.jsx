import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { ROUTES } from "../../../constants/routes";
import styles from "./Destinations.module.css";

const DestinationCard = ({ destination, delay = 0 }) => {
  const { title, location, image, mapUrl } = destination;
  const { isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();

  const handleReserve = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      navigate(ROUTES.RESERVAS || "/reservas");
    }
  };

  return (
    <div
      className={styles.card}
      data-aos="fade-up"
      data-aos-delay={delay}
      data-aos-duration="800"
      data-aos-once="true"
    >
      <img src={image} alt={title} className={styles.card_img} />
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
          <button className={styles.reserve_btn} onClick={handleReserve}>
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
