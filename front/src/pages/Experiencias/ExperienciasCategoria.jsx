import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { experienciasData } from '../../services/datos/experienciasData';
import styles from './ExperienciasCategoria.module.css';
import { ArrowLeft, MapPin, Clock, DollarSign } from 'lucide-react';

const ExperienciasCategoria = () => {
  const { categoria } = useParams();
  const data = experienciasData[categoria];

  if (!data) {
    return (
      <div className={styles.notFound}>
        <h2>Categoría no encontrada</h2>
        <p>Lo sentimos, no pudimos encontrar experiencias para "{categoria}".</p>
        <Link to="/" className={styles.backBtn}>Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={20} /> Volver
        </Link>
        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.subtitle}>{data.description}</p>
      </div>

      <div className={styles.grid}>
        {data.items.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={item.image} alt={item.title} />
            </div>
            <div className={styles.content}>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <MapPin size={16} className={styles.icon} />
                  <span>{item.location}</span>
                </div>
                <div className={styles.detailItem}>
                  <Clock size={16} className={styles.icon} />
                  <span>{item.duration}</span>
                </div>
                <div className={styles.detailItem}>
                  <DollarSign size={16} className={styles.icon} />
                  <span>{item.price}</span>
                </div>
              </div>
              <button className={styles.actionBtn}>Agregar al Planificador</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienciasCategoria;
