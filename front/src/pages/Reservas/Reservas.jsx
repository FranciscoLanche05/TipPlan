import React from 'react';
import destinations from "../../services/datos/destinations";
import styles from "./Reservas.module.css";

const Reservas = () => {
  return (
    <div className={styles.reservasPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Módulo de Reservas</h1>
          <p>
            Elige tu próximo destino. Aquí encontrarás la lista de lugares 
            disponibles para reservar tu próxima aventura inolvidable.
          </p>
        </div>

        <div className={styles.grid}>
          {destinations.map((dest) => (
            <div key={dest.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={dest.image} alt={dest.title} />
              </div>
              <div className={styles.content}>
                <span className={styles.location}>{dest.location}</span>
                <h2 className={styles.title}>{dest.title}</h2>
                <button 
                  className={styles.actionBtn}
                  onClick={() => alert(`Reserva para ${dest.title} iniciada. (Funcionalidad en desarrollo)`)}
                >
                  Continuar Reserva
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reservas;
