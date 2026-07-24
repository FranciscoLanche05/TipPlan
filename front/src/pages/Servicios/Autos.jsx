import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveReservation } from '@back/services/firestoreService';
import { autosRealistas } from '../../services/datos/serviciosData';
import ReservationModal from '../../components/common/Modals/ReservationModal';
import ServiceLayout from '../../components/common/ServiceLayout/ServiceLayout';
import { Car, Star, Check } from 'lucide-react';
import styles from './Servicios.module.css';

const Autos = () => {
  const { user, openLoginModal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState(autosRealistas);
  const [selectedAuto, setSelectedAuto] = useState(null);

  const handleSearch = (term) => {
    if (!term) {
      setResults(autosRealistas);
      return;
    }
    const filtered = autosRealistas.filter(a => 
      a.ciudad.toLowerCase().includes(term.toLowerCase()) || 
      a.modelo.toLowerCase().includes(term.toLowerCase()) ||
      a.empresa.toLowerCase().includes(term.toLowerCase())
    );
    setResults(filtered);
  };

  const handleReserve = async (auto) => {
    if (!user) {
      openLoginModal();
      return;
    }
    
    try {
      await saveReservation({
        userId: user.uid,
        type: 'auto',
        title: `Renta de ${auto.modelo} con ${auto.empresa}`,
        location: auto.ciudad,
        date: 'Fechas abiertas',
        price: `$${auto.precioDia}/día`,
        status: 'Confirmado'
      });
      setSelectedAuto(auto);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert("Hubo un error al reservar. Inténtalo de nuevo.");
    }
  };

  const renderAutoCard = (auto) => (
    <div key={auto.id} className={styles.kayakCard}>
      <div className={styles.kCardImage}>
        <img src={auto.imagen} alt={auto.modelo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
        <button className={styles.favBtn}>♡</button>
      </div>
      
      <div className={styles.kCardBody}>
        <div className={styles.kCardHeader}>
          <h3>{auto.modelo}</h3>
          <div className={styles.kCardMeta}>
            <span className={styles.ratingBadge}>{auto.rating}</span>
            <span className={styles.ratingText}>Excelente</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>• {auto.empresa} en {auto.ciudad}</span>
          </div>
        </div>

        <div className={styles.kCardDetails}>
          <div className={styles.kCardProviders}>
            <div className={styles.providerRow}>
              <strong>{auto.proveedor}</strong>
              <span>Kilometraje ilimitado</span>
              <span>${auto.precioDia}</span>
            </div>
            <div className={styles.providerRow}>
              <span>Kayak</span>
              <span></span>
              <span>${auto.precioDia + 5}</span>
            </div>
          </div>
          
          <div className={styles.kCardAction}>
            <div className={styles.kPriceBox}>
              <span className={styles.kPriceLabel}>{auto.proveedor}</span>
              <span className={styles.kPriceValue}>${auto.precioDia}</span>
              <span className={styles.kPriceSub}><Check size={12}/> Oferta especial</span>
            </div>
            <button className={styles.kActionBtn} onClick={() => handleReserve(auto)}>Ver oferta</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ServiceLayout 
        title="Alquiler de autos" 
        subtitle="Compara los mejores precios para rentar autos en tu destino"
        results={results}
        renderCard={renderAutoCard}
        onSearch={handleSearch}
        searchPlaceholder="Ciudad de recogida (Ej. Quito, Madrid)"
        showMap={true}
      />

      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="¡Auto Reservado!" 
        message={`Tu reserva del ${selectedAuto?.modelo} ha sido confirmada. Gestionala desde tu Dashboard.`}
      />
    </>
  );
};

export default Autos;
