import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveReservation } from '@back/services/firestoreService';
import { restaurantesRealistas } from '../../services/datos/serviciosData';
import ReservationModal from '../../components/common/Modals/ReservationModal';
import ServiceLayout from '../../components/common/ServiceLayout/ServiceLayout';
import { Utensils, Star, Check } from 'lucide-react';
import styles from './Servicios.module.css';

const Restaurantes = () => {
  const { user, openLoginModal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState(restaurantesRealistas);
  const [selectedRest, setSelectedRest] = useState(null);

  const handleSearch = (term) => {
    if (!term) {
      setResults(restaurantesRealistas);
      return;
    }
    const filtered = restaurantesRealistas.filter(r => 
      r.ciudad.toLowerCase().includes(term.toLowerCase()) || 
      r.nombre.toLowerCase().includes(term.toLowerCase()) ||
      r.tipoComida.toLowerCase().includes(term.toLowerCase())
    );
    setResults(filtered);
  };

  const handleReserve = async (rest) => {
    if (!user) {
      openLoginModal();
      return;
    }
    
    try {
      await saveReservation({
        userId: user.uid,
        type: 'restaurante',
        title: `Mesa en ${rest.nombre}`,
        location: rest.ciudad,
        date: 'Fecha abierta',
        price: 'Reserva gratuita',
        status: 'Confirmado'
      });
      setSelectedRest(rest);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert("Hubo un error al reservar. Inténtalo de nuevo.");
    }
  };

  const renderRestCard = (rest) => (
    <div key={rest.id} className={styles.kayakCard}>
      <div className={styles.kCardImage}>
        <img src={rest.imagen} alt={rest.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
        <button className={styles.favBtn}>♡</button>
      </div>
      
      <div className={styles.kCardBody}>
        <div className={styles.kCardHeader}>
          <h3>{rest.nombre}</h3>
          <div className={styles.kCardMeta}>
            <span className={styles.ratingBadge}>{rest.rating}</span>
            <span className={styles.ratingText}>Excepcional ({rest.resenas})</span>
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '5px' }}>
            {rest.tipoComida} • {rest.ciudad}
          </div>
        </div>

        <div className={styles.kCardDetails}>
          <div className={styles.kCardProviders}>
            <div className={styles.providerRow}>
              <strong>{rest.proveedor}</strong>
              <span>Confirmación Inmediata</span>
            </div>
            <div className={styles.providerRow}>
              <span>Precio Promedio: {rest.precioPromedio}</span>
            </div>
          </div>
          
          <div className={styles.kCardAction}>
            <div className={styles.kPriceBox}>
              <span className={styles.kPriceLabel}>Reserva de mesa</span>
              <span className={styles.kPriceValue}>Gratis</span>
              <span className={styles.kPriceSub}><Check size={12}/> Paga en el local</span>
            </div>
            <button className={styles.kActionBtn} onClick={() => handleReserve(rest)}>Reservar mesa</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ServiceLayout 
        title="Restaurantes y Gastronomía" 
        subtitle="Descubre y reserva en los mejores restaurantes del mundo"
        results={results}
        renderCard={renderRestCard}
        onSearch={handleSearch}
        searchPlaceholder="Ciudad, restaurante o tipo de comida..."
        showMap={true}
      />

      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="¡Mesa Reservada!" 
        message={`Tu mesa en ${selectedRest?.nombre} te está esperando. Gestionala desde tu Dashboard.`}
      />
    </>
  );
};

export default Restaurantes;
