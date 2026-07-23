import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveReservation } from '@back/services/firestoreService';
import { actividadesPorCiudad } from '../../services/datos/serviciosData';
import ReservationModal from '../../components/common/Modals/ReservationModal';
import ServiceLayout from '../../components/common/ServiceLayout/ServiceLayout';
import { Compass, Star, Check } from 'lucide-react';
import styles from './Servicios.module.css';

const Actividades = () => {
  const { user, openLoginModal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const todasLasActividades = Object.values(actividadesPorCiudad).flat();
  const [results, setResults] = useState(todasLasActividades);
  const [selectedAct, setSelectedAct] = useState(null);
  const [reservationData, setReservationData] = useState(null);

  const handleSearch = (term) => {
    if (!term) {
      setResults(todasLasActividades);
      return;
    }
    const filtered = todasLasActividades.filter(a => 
      a.titulo.toLowerCase().includes(term.toLowerCase()) || 
      // Buscar la ciudad comparando con las llaves de actividadesPorCiudad
      Object.entries(actividadesPorCiudad).some(([ciudad, acts]) => 
        ciudad.toLowerCase().includes(term.toLowerCase()) && acts.find(act => act.id === a.id)
      )
    );
    setResults(filtered);
  };

  const handleReserve = async (act) => {
    if (!user) {
      openLoginModal();
      return;
    }
    
    // Find the city for this activity to pass to location
    let city = 'Varias';
    Object.entries(actividadesPorCiudad).forEach(([c, acts]) => {
      if(acts.find(a => a.id === act.id)) city = c;
    });

    try {
      const resData = {
        userId: user.uid,
        type: 'actividad',
        title: `Tour: ${act.titulo}`,
        location: city,
        date: 'Fecha abierta',
        price: `$${act.precio}`,
        status: 'Confirmado'
      };
      const id = await saveReservation(resData);
      setReservationData({ id, ...resData });
      setSelectedAct(act);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert("Hubo un error al reservar. Inténtalo de nuevo.");
    }
  };

  const renderActCard = (act) => (
    <div key={act.id} className={styles.kayakCard}>
      <div className={styles.kCardImage}>
        <img src={act.imagen} alt={act.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
        <button className={styles.favBtn}>♡</button>
      </div>
      
      <div className={styles.kCardBody}>
        <div className={styles.kCardHeader}>
          <h3>{act.titulo}</h3>
          <div className={styles.kCardMeta}>
            <span className={styles.ratingBadge}>{act.rating}</span>
            <span className={styles.ratingText}>Excelente ({act.resenas})</span>
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '5px' }}>
            ⏳ Duración: {act.duracion}
          </div>
        </div>

        <div className={styles.kCardDetails}>
          <div className={styles.kCardProviders}>
            <div className={styles.providerRow}>
              <strong>{act.proveedor}</strong>
              <span>Guía incluido</span>
            </div>
            <div className={styles.providerRow}>
              <span>Cancelación gratuita</span>
            </div>
          </div>
          
          <div className={styles.kCardAction}>
            <div className={styles.kPriceBox}>
              <span className={styles.kPriceLabel}>Por persona</span>
              <span className={styles.kPriceValue}>${act.precio}</span>
              <span className={styles.kPriceSub}><Check size={12}/> Cupos disponibles</span>
            </div>
            <button className={styles.kActionBtn} onClick={() => handleReserve(act)}>Ver disponibilidad</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ServiceLayout 
        title="Tours y Actividades" 
        subtitle="Descubre las mejores experiencias, tours y excursiones"
        results={results}
        renderCard={renderActCard}
        onSearch={handleSearch}
        searchPlaceholder="Busca por ciudad o actividad..."
        showMap={true}
      />

      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="¡Tour Reservado!" 
        message={`Tu actividad "${selectedAct?.titulo}" ha sido confirmada. Gestionala desde tu Dashboard.`}
        reservationData={reservationData}
        user={user}
      />
    </>
  );
};

export default Actividades;
