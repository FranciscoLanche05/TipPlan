import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveReservation, getUserTrips, getTripById } from '@back/services/firestoreService';
import { restaurantesRealistas } from '../../services/datos/serviciosData';
import ServiceLayout from '../../components/common/ServiceLayout/ServiceLayout';
import { Utensils, Check, X, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './Servicios.module.css';
import modalStyles from './Vuelos.module.css'; // Reuse modal styles

// Coordenadas base para simulaciones dinámicas
const cityCoordinates = {
  'lima': { lat: -12.0464, lng: -77.0428 },
  'bogota': { lat: 4.7110, lng: -74.0721 },
  'bogotá': { lat: 4.7110, lng: -74.0721 },
  'buenos aires': { lat: -34.6037, lng: -58.3816 },
  'santiago': { lat: -33.4489, lng: -70.6693 },
  'miami': { lat: 25.7617, lng: -80.1918 },
  'nueva york': { lat: 40.7128, lng: -74.0060 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'parís': { lat: 48.8566, lng: 2.3522 },
  'roma': { lat: 41.9028, lng: 12.4964 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'londres': { lat: 51.5074, lng: -0.1278 }
};

const Restaurantes = () => {
  const { user, openLoginModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState(restaurantesRealistas);
  const [selectedRest, setSelectedRest] = useState(null);

  const [tripIdFromUrl, setTripIdFromUrl] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripToSave, setSelectedTripToSave] = useState('');
  
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');

  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamic config state
  const [people, setPeople] = useState(2);
  const [tableType, setTableType] = useState('Salón Principal');

  // Calculation
  const getCalculatedTotal = () => {
    let base = 0;
    if (tableType === 'Terraza / Ventana') base = 5;
    if (tableType === 'Zona VIP / Privada') base = 20;
    return base;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tripId = params.get('tripId');
    if (tripId) {
      setTripIdFromUrl(tripId);
      getTripById(tripId).then(trip => {
        if (trip && trip.destination) {
          handleSearch(trip.destination);
        }
      });
    }

    if (user?.uid) {
      getUserTrips(user.uid).then(setUserTrips);
    }
  }, [location.search, user]);

  const handleSearch = (term) => {
    if (!term) {
      setResults(restaurantesRealistas);
      return;
    }
    const cleanTerm = term.split(',')[0].trim().toLowerCase();
    const filtered = restaurantesRealistas.filter(r => 
      r.ciudad?.toLowerCase().includes(cleanTerm) || 
      r.nombre?.toLowerCase().includes(cleanTerm) ||
      r.tipoComida?.toLowerCase().includes(cleanTerm)
    );
    
    if (filtered.length > 0) {
      setResults(filtered);
    } else {
      let coords = cityCoordinates[cleanTerm];
      
      if (!coords) {
        coords = { 
          lat: (Math.random() * 60 - 30), 
          lng: (Math.random() * 60 - 100) 
        };
      }
      
      const simulatedRests = [
        {
          id: `sim-${Date.now()}-1`,
          nombre: `La Brasserie ${term.charAt(0).toUpperCase() + term.slice(1)}`,
          ciudad: term.charAt(0).toUpperCase() + term.slice(1),
          tipoComida: 'Fina y Gourmet',
          imagen: 'https://loremflickr.com/600/400/restaurant,food?lock=' + Math.floor(Math.random() * 100),
          lat: coords.lat + (Math.random() * 0.02 - 0.01),
          lng: coords.lng + (Math.random() * 0.02 - 0.01),
          proveedor: 'TheFork',
          rating: (Math.random() * (9.8 - 8.5) + 8.5).toFixed(1),
          precioPromedio: '$$$$',
          precioNoche: 0 // Mock for map logic
        },
        {
          id: `sim-${Date.now()}-2`,
          nombre: `Bistro Local`,
          ciudad: term.charAt(0).toUpperCase() + term.slice(1),
          tipoComida: 'Comida Local',
          imagen: 'https://loremflickr.com/600/400/bistro,food?lock=' + Math.floor(Math.random() * 100),
          lat: coords.lat + (Math.random() * 0.02 - 0.01),
          lng: coords.lng + (Math.random() * 0.02 - 0.01),
          proveedor: 'OpenTable',
          rating: (Math.random() * (9.0 - 7.5) + 7.5).toFixed(1),
          precioPromedio: '$$',
          precioNoche: 0
        }
      ];
      setResults(simulatedRests);
    }
  };

  const openRestDetail = (rest) => {
    if (!user) {
      openLoginModal();
      return;
    }
    setSelectedRest(rest);
    if (tripIdFromUrl) {
      setSelectedTripToSave(tripIdFromUrl);
    } else if (userTrips.length > 0) {
      setSelectedTripToSave(userTrips[0].id);
    } else {
      setSelectedTripToSave('NEW');
    }
    setPaymentSuccess(false);
    setIsModalOpen(true);
  };

  const handleComprar = async () => {
    if (!selectedTripToSave) {
      toast.error("Por favor, selecciona o crea un viaje primero");
      return;
    }

    let targetTripId = selectedTripToSave;

    if (selectedTripToSave === 'NEW') {
      if (!newTripTitle.trim()) {
        toast.error("Por favor, ingresa el nombre de tu nuevo viaje");
        return;
      }
      setIsPaying(true);
      try {
        const { createTrip } = await import('@back/services/firestoreService');
        const newTripId = await createTrip({
          userId: user.uid,
          title: newTripTitle,
          destination: selectedRest.ciudad,
          startDate: 'Próximamente',
          endDate: 'Próximamente',
          coverImage: selectedRest.imagen,
          status: 'Planeado'
        });
        targetTripId = newTripId;
      } catch (error) {
        toast.error("Hubo un error al crear el viaje");
        setIsPaying(false);
        return;
      }
    } else {
      const selectedTripObj = userTrips.find(t => t.id === targetTripId);
      if (selectedTripObj && selectedTripObj.destination) {
        const tripDest = selectedTripObj.destination.toLowerCase();
        const restDest = selectedRest.ciudad.toLowerCase();
        
        const cleanTripDest = tripDest.split(',')[0].trim();
        const cleanRestDest = restDest.split(',')[0].trim();

        if (!cleanRestDest.includes(cleanTripDest) && !cleanTripDest.includes(cleanRestDest)) {
          toast.error(`La ciudad del restaurante (${selectedRest.ciudad}) no coincide con el destino de tu viaje (${selectedTripObj.destination}).`);
          return;
        }
      }
    }

    setIsPaying(true);
    setTimeout(async () => {
      try {
        await saveReservation({
          userId: user.uid,
          tripId: targetTripId,
          type: 'restaurante',
          title: `Mesa en ${selectedRest.nombre}`,
          location: selectedRest.ciudad,
          date: 'Fecha abierta',
          price: getCalculatedTotal() > 0 ? `$${getCalculatedTotal()} (Reserva Preferencial)` : 'Reserva gratuita',
          status: 'Confirmado'
        });
        setIsPaying(false);
        setPaymentSuccess(true);
        toast.success("¡Reserva Exitosa!");
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      } catch (error) {
        console.error("Error saving reservation:", error);
        toast.error("Hubo un error al procesar la reserva.");
        setIsPaying(false);
      }
    }, 1500);
  };

  const handleMarkerClick = (rest) => {
    const el = document.getElementById(`rest-${rest.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add(styles.highlight);
      setTimeout(() => el.classList.remove(styles.highlight), 2000);
    }
  };

  const renderRestCard = (rest) => (
    <div key={rest.id} id={`rest-${rest.id}`} className={styles.kayakCard}>
      <div className={styles.kCardImage}>
        <img src={rest.imagen} alt={rest.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
        <button className={styles.favBtn}>♡</button>
      </div>
      
      <div className={styles.kCardBody}>
        <div className={styles.kCardHeader}>
          <h3>{rest.nombre}</h3>
          <div className={styles.kCardMeta}>
            <span className={styles.ratingBadge}>{rest.rating}</span>
            <span className={styles.ratingText}>Excepcional</span>
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
            <button className={styles.kActionBtn} onClick={() => openRestDetail(rest)}>Reservar mesa</button>
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
        onMarkerClick={handleMarkerClick}
      />

      {isModalOpen && selectedRest && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <button className={modalStyles.modalClose} onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>
            
            {!paymentSuccess ? (
              <>
                <h2 className={modalStyles.modalTitle}>Confirmar Reserva de Mesa</h2>
                
                <div className={modalStyles.modalFlightInfo}>
                  <div className={modalStyles.mLogo} style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={selectedRest.imagen} alt="Restaurante" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className={modalStyles.mDetails}>
                    <h3>{selectedRest.nombre}</h3>
                    <p>{selectedRest.ciudad} • {selectedRest.tipoComida} • {selectedRest.proveedor}</p>
                    <p style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>Mesa para 2 • Confirmación inmediata</p>
                  </div>
                  <div className={modalStyles.mPrice}>
                    <h2>Gratis</h2>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>reserva base</span>
                  </div>
                </div>

                <div className={modalStyles.configSection}>
                  <div className={modalStyles.configRow}>
                    <label>Comensales</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="15" 
                      value={people} 
                      onChange={e => setPeople(Math.max(1, parseInt(e.target.value) || 1))} 
                    />
                  </div>
                  <div className={modalStyles.configRow}>
                    <label>Tipo de mesa</label>
                    <select value={tableType} onChange={e => setTableType(e.target.value)}>
                      <option value="Salón Principal">Salón Principal (Gratis)</option>
                      <option value="Terraza / Ventana">Terraza / Ventana (Reserva: $5)</option>
                      <option value="Zona VIP / Privada">Zona VIP / Privada (Reserva: $20)</option>
                    </select>
                  </div>
                </div>

                {!tripIdFromUrl && (
                  <div className={modalStyles.tripSelectionBox}>
                    <h4>¿A qué viaje deseas añadir esta reserva?</h4>
                    <select 
                      value={selectedTripToSave} 
                      onChange={(e) => setSelectedTripToSave(e.target.value)}
                      className={modalStyles.tripSelect}
                    >
                      <option value="">Selecciona un viaje...</option>
                      {userTrips.map(t => (
                        <option key={t.id} value={t.id}>{t.title} - {t.destination}</option>
                      ))}
                      <option value="NEW">+ Crear nuevo viaje</option>
                    </select>
                    
                    {selectedTripToSave === 'NEW' && (
                      <div style={{ marginTop: '12px' }}>
                        <input 
                          type="text" 
                          placeholder="Nombre del nuevo viaje (ej. Gastronomía Trip)" 
                          className={modalStyles.tripSelect}
                          value={newTripTitle}
                          onChange={(e) => setNewTripTitle(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {tripIdFromUrl && (
                  <div className={modalStyles.tripInfoAlert}>
                    <Check size={16} /> Se añadirá automáticamente a tu viaje actual.
                  </div>
                )}

                <div className={modalStyles.paymentSection} style={{ borderTop: 'none', background: 'transparent' }}>
                  {getCalculatedTotal() > 0 && (
                    <div className={modalStyles.payCard} style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
                      <CreditCard size={20} />
                      <input type="text" placeholder="Número de tarjeta" defaultValue="**** **** **** 4242" disabled />
                    </div>
                  )}
                  <button 
                    className={modalStyles.comprarBtn} 
                    onClick={handleComprar}
                    disabled={isPaying}
                  >
                    {isPaying ? 'Confirmando...' : (getCalculatedTotal() > 0 ? `Pagar Reserva ($${getCalculatedTotal()})` : 'Confirmar Reserva de Mesa')}
                  </button>
                  <p style={{textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '12px'}}>
                    Mesa para {people} en {tableType}
                  </p>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ background: '#10b981', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Check size={32} color="#fff" />
                </div>
                <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#0f172a'}}>¡Reserva Exitosa!</h2>
                <p style={{ color: '#64748b', marginTop: '8px' }}>Tu mesa en {selectedRest.nombre} ha sido confirmada.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Restaurantes;
