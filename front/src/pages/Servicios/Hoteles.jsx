import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveReservation } from '@back/services/firestoreService';
import { hotelesRealistas } from '../../services/datos/serviciosData';
import ReservationModal from '../../components/common/Modals/ReservationModal';
import ServiceLayout from '../../components/common/ServiceLayout/ServiceLayout';
import { Bed, Star, Check } from 'lucide-react';
import styles from './Servicios.module.css';

const Hoteles = () => {
  const { user, openLoginModal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState(hotelesRealistas);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const handleSearch = (term) => {
    if (!term) {
      setResults(hotelesRealistas);
      return;
    }
    const filtered = hotelesRealistas.filter(h => 
      h.ciudad.toLowerCase().includes(term.toLowerCase()) || 
      h.nombre.toLowerCase().includes(term.toLowerCase())
    );
    setResults(filtered);
  };

  const handleReserve = async (hotel) => {
    if (!user) {
      openLoginModal();
      return;
    }
    
    try {
      await saveReservation({
        userId: user.uid,
        type: 'hotel',
        title: `Estadía en ${hotel.nombre}`,
        location: hotel.ciudad,
        date: 'Fechas abiertas',
        price: `$${hotel.precioNoche}/noche`,
        status: 'Confirmado'
      });
      setSelectedHotel(hotel);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert("Hubo un error al reservar. Inténtalo de nuevo.");
    }
  };

  const renderHotelCard = (hotel) => (
    <div key={hotel.id} className={styles.kayakCard}>
      <div className={styles.kCardImage}>
        <img src={hotel.imagen} alt={hotel.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
        <button className={styles.favBtn}>♡</button>
      </div>
      
      <div className={styles.kCardBody}>
        <div className={styles.kCardHeader}>
          <h3>{hotel.nombre}</h3>
          <div className={styles.kCardMeta}>
            <span className={styles.ratingBadge}>{hotel.rating}</span>
            <span className={styles.ratingText}>Muy bueno ({hotel.resenas})</span>
            <div className={styles.stars}>
              {[...Array(hotel.estrellas)].map((_, i) => <Star key={i} size={12} fill="#eab308" color="#eab308" />)}
            </div>
          </div>
        </div>

        <div className={styles.kCardDetails}>
          <div className={styles.kCardProviders}>
            <div className={styles.providerRow}>
              <strong>{hotel.proveedor}</strong>
              <span>Cancelación gratis</span>
              <span>${hotel.precioNoche}</span>
            </div>
            <div className={styles.providerRow}>
              <span>Expedia</span>
              <span></span>
              <span>${hotel.precioNoche + 12}</span>
            </div>
          </div>
          
          <div className={styles.kCardAction}>
            <div className={styles.kPriceBox}>
              <span className={styles.kPriceLabel}>{hotel.proveedor}</span>
              <span className={styles.kPriceValue}>${hotel.precioNoche}</span>
              <span className={styles.kPriceSub}><Check size={12}/> Reserva directa</span>
            </div>
            <button className={styles.kActionBtn} onClick={() => handleReserve(hotel)}>Ver oferta</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ServiceLayout 
        title="Busca y compara hoteles" 
        subtitle="Encuentra las mejores ofertas de alojamiento en todo el mundo"
        results={results}
        renderCard={renderHotelCard}
        onSearch={handleSearch}
        searchPlaceholder="¿A dónde quieres ir? (Ej. Madrid, Quito)"
        showMap={true}
      />

      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="¡Reserva Confirmada!" 
        message={`Tu reserva en ${selectedHotel?.nombre} ha sido asegurada. Puedes gestionar tu estadía desde tu Dashboard.`}
      />
    </>
  );
};

export default Hoteles;
