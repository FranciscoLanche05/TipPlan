import { useRef, useEffect } from "react";
import destinations from "../../../services/datos/destinations";
import DestinationCard from "./DestinationCard";
import styles from "./Destinations.module.css";

const Destinations = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollAmount = 0;
    let isHovered = false;

    const step = () => {
      if (carousel && !isHovered) {
        carousel.scrollLeft += 1;
        // Si llegamos al final del scroll, volver al principio
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 1) {
          carousel.scrollLeft = 0;
        }
      }
      scrollAmount = requestAnimationFrame(step);
    };
    
    scrollAmount = requestAnimationFrame(step);

    const handleMouseEnter = () => isHovered = true;
    const handleMouseLeave = () => isHovered = false;

    if (carousel) {
      carousel.addEventListener("mouseenter", handleMouseEnter);
      carousel.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(scrollAmount);
      if (carousel) {
        carousel.removeEventListener("mouseenter", handleMouseEnter);
        carousel.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <section id="destinos" className={styles.destinations}>
      <div className={styles.destinationsContainer}>
        <span className={styles.tag}>DESCUBRE EL MUNDO</span>

        <div className={styles.header}>
          <div className={styles.titleArea}>
            <h2>
              Destinos <span>más populares</span>
            </h2>
            <p className={styles.text}>
              Lugares icónicos de nuestro país y del mundo entero,
              listos para ser explorados.
            </p>
          </div>
        </div>

        <div className={styles.carouselWrapper}>
          <div className={styles.cards} ref={carouselRef}>
            {destinations.map((dest, index) => (
              <div key={dest.id} className={styles.cardWrapper}>
                <DestinationCard
                  destination={dest}
                  delay={index * 100}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
