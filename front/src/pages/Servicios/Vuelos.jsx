import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveReservation } from '@back/services/firestoreService';
import { vuelosRealistas } from '../../services/datos/serviciosData';
import ReservationModal from '../../components/common/Modals/ReservationModal';
import ServiceLayout from '../../components/common/ServiceLayout/ServiceLayout';
import { Plane, Check } from 'lucide-react';
import styles from './Servicios.module.css';

const Vuelos = () => {
  const { user, openLoginModal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState(vuelosRealistas);
  const [selectedVuelo, setSelectedVuelo] = useState(null);
  const [reservationData, setReservationData] = useState(null);

  const handleSearch = (term) => {
    if (!term) {
      setResults(vuelosRealistas);
      return;
    }
    const filtered = vuelosRealistas.filter(v => 
      v.origen.toLowerCase().includes(term.toLowerCase()) || 
      v.destino.toLowerCase().includes(term.toLowerCase()) ||
      v.aerolinea.toLowerCase().includes(term.toLowerCase())
    );
    setResults(filtered);
  };

  const handleReserve = async (vuelo) => {
    if (!user) {
      openLoginModal();
      return;
    }
    
    try {
      const resData = {
        userId: user.uid,
        type: 'vuelo',
        title: `Vuelo ${vuelo.origen} a ${vuelo.destino}`,
        location: `${vuelo.origen} -> ${vuelo.destino}`,
        date: 'Fecha abierta',
        price: `$${vuelo.precio}`,
        status: 'Confirmado',
        airline: vuelo.aerolinea
      };
      const id = await saveReservation(resData);
      setReservationData({ id, ...resData });
      setSelectedVuelo(vuelo);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert("Hubo un error al reservar. Inténtalo de nuevo.");
    }
  };

  const renderFlightCard = (vuelo) => (
    <div key={vuelo.id} className={styles.kayakCard} style={{ height: 'auto', padding: '15px' }}>
      <div className={styles.kCardBody} style={{ padding: 0 }}>
        <div className={styles.kCardHeader} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={vuelo.logo} alt={vuelo.aerolinea} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div>
            <h3 style={{ marginBottom: '5px' }}>{vuelo.origen} - {vuelo.destino}</h3>
            <span style={{ color: '#64748b', fontSize: '14px' }}>{vuelo.aerolinea} • {vuelo.escalas}</span>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right', paddingRight: '20px' }}>
            <span style={{ display: 'block', fontWeight: '600', color: '#1e293b' }}>{vuelo.duracion}</span>
          </div>
        </div>

        <div className={styles.kCardDetails}>
          <div className={styles.kCardProviders}>
            <div className={styles.providerRow}>
              <strong>{vuelo.proveedor}</strong>
              <span>${vuelo.precio}</span>
            </div>
            <div className={styles.providerRow}>
              <span>Sitio Oficial</span>
              <span>${vuelo.precio + 45}</span>
            </div>
          </div>
          
          <div className={styles.kCardAction}>
            <div className={styles.kPriceBox}>
              <span className={styles.kPriceLabel}>{vuelo.proveedor}</span>
              <span className={styles.kPriceValue}>${vuelo.precio}</span>
              <span className={styles.kPriceSub}><Check size={12}/> Mejor oferta</span>
            </div>
            <button className={styles.kActionBtn} onClick={() => handleReserve(vuelo)}>Ver vuelo</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ServiceLayout 
        title="Busca y compara vuelos" 
        subtitle="Encuentra las mejores conexiones dentro de Ecuador y hacia el mundo"
        results={results}
        renderCard={renderFlightCard}
        onSearch={handleSearch}
        searchPlaceholder="¿A dónde quieres volar? (Ej. Madrid, Quito)"
        showMap={false}
      />

      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="¡Vuelo Reservado!" 
        message={`Tu vuelo con ${selectedVuelo?.aerolinea} ha sido guardado exitosamente. Puedes gestionarlo desde tu Dashboard.`}
        reservationData={reservationData}
        user={user}
      />
    </>
  );
};

export default Vuelos;
