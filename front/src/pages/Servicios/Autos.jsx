import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveReservation, getUserTrips, getTripById } from '@back/services/firestoreService';
import { autosRealistas } from '../../services/datos/serviciosData';
import ServiceLayout from '../../components/common/ServiceLayout/ServiceLayout';
import { Car, Check, X, CreditCard, ArrowRight } from 'lucide-react';
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

const Autos = () => {
  const { user, openLoginModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState(autosRealistas);
  const [selectedAuto, setSelectedAuto] = useState(null);

  const [tripIdFromUrl, setTripIdFromUrl] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripToSave, setSelectedTripToSave] = useState('');
  
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');

  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamic config state
  const [days, setDays] = useState(5);
  const [babySeats, setBabySeats] = useState(0);
  const [insurance, setInsurance] = useState('Básico');

  // Calculation
  const getCalculatedTotal = () => {
    if (!selectedAuto) return 0;
    let base = selectedAuto.precioDia * days;
    
    // Silla de bebé ($10 por día por silla)
    base += (babySeats * 10) * days;

    // Seguro
    if (insurance === 'Todo Riesgo') base += 15 * days;
    if (insurance === 'Premium') base += 30 * days;

    // Impuestos (12%)
    return base * 1.12;
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
      setResults(autosRealistas);
      return;
    }
    const cleanTerm = term.split(',')[0].trim().toLowerCase();
    const filtered = autosRealistas.filter(a => 
      a.ciudad?.toLowerCase().includes(cleanTerm) || 
      a.modelo?.toLowerCase().includes(cleanTerm) ||
      a.empresa?.toLowerCase().includes(cleanTerm)
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
      
      const simulatedAutos = [
        {
          id: `sim-${Date.now()}-1`,
          empresa: 'Hertz',
          modelo: `SUV Premium ${term.charAt(0).toUpperCase() + term.slice(1)}`,
          ciudad: term.charAt(0).toUpperCase() + term.slice(1),
          precioDia: Math.floor(Math.random() * (120 - 70) + 70),
          tipo: 'auto',
          imagen: 'https://loremflickr.com/600/400/suv,car?lock=' + Math.floor(Math.random() * 100),
          lat: coords.lat + (Math.random() * 0.02 - 0.01),
          lng: coords.lng + (Math.random() * 0.02 - 0.01),
          proveedor: 'Hertz',
          rating: (Math.random() * (9.8 - 8.5) + 8.5).toFixed(1),
        },
        {
          id: `sim-${Date.now()}-2`,
          empresa: 'Avis',
          modelo: `Sedán Económico`,
          ciudad: term.charAt(0).toUpperCase() + term.slice(1),
          precioDia: Math.floor(Math.random() * (60 - 30) + 30),
          tipo: 'auto',
          imagen: 'https://loremflickr.com/600/400/sedan,car?lock=' + Math.floor(Math.random() * 100),
          lat: coords.lat + (Math.random() * 0.02 - 0.01),
          lng: coords.lng + (Math.random() * 0.02 - 0.01),
          proveedor: 'Avis',
          rating: (Math.random() * (9.0 - 7.5) + 7.5).toFixed(1),
        }
      ];
      setResults(simulatedAutos);
    }
  };

  const openAutoDetail = (auto) => {
    if (!user) {
      openLoginModal();
      return;
    }
    setSelectedAuto(auto);
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
          destination: selectedAuto.ciudad,
          startDate: 'Próximamente',
          endDate: 'Próximamente',
          coverImage: selectedAuto.imagen,
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
        const autoDest = selectedAuto.ciudad.toLowerCase();
        
        const cleanTripDest = tripDest.split(',')[0].trim();
        const cleanAutoDest = autoDest.split(',')[0].trim();

        if (!cleanAutoDest.includes(cleanTripDest) && !cleanTripDest.includes(cleanAutoDest)) {
          toast.error(`La ciudad de recogida (${selectedAuto.ciudad}) no coincide con el destino de tu viaje (${selectedTripObj.destination}).`);
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
          type: 'auto',
          title: `Renta de ${selectedAuto.modelo} con ${selectedAuto.empresa}`,
          location: selectedAuto.ciudad,
          date: 'Fechas abiertas',
          price: selectedAuto.precioDia,
          status: 'Confirmado'
        });
        setIsPaying(false);
        setPaymentSuccess(true);
        toast.success("¡Alquiler Exitoso!");
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      } catch (error) {
        console.error("Error saving reservation:", error);
        toast.error("Hubo un error al procesar el alquiler.");
        setIsPaying(false);
      }
    }, 2000);
  };

  const handleMarkerClick = (auto) => {
    const el = document.getElementById(`auto-${auto.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add(styles.highlight);
      setTimeout(() => el.classList.remove(styles.highlight), 2000);
    }
  };

  const renderAutoCard = (auto) => (
    <div key={auto.id} id={`auto-${auto.id}`} className={styles.kayakCard}>
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
            <button className={styles.kActionBtn} onClick={() => openAutoDetail(auto)}>Ver oferta</button>
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
        onMarkerClick={handleMarkerClick}
      />

      {isModalOpen && selectedAuto && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <button className={modalStyles.modalClose} onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>
            
            {!paymentSuccess ? (
              <>
                <h2 className={modalStyles.modalTitle}>Confirmar y Rentar Auto</h2>
                
                <div className={modalStyles.modalFlightInfo}>
                  <div className={modalStyles.mLogo} style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={selectedAuto.imagen} alt="Auto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className={modalStyles.mDetails}>
                    <h3>{selectedAuto.modelo}</h3>
                    <p>{selectedAuto.ciudad} • {selectedAuto.empresa} • {selectedAuto.proveedor}</p>
                    <p style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px'}}>Kilometraje ilimitado • Seguro básico</p>
                  </div>
                  <div className={modalStyles.mPrice}>
                    <h2>${selectedAuto.precioDia}</h2>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>por día</span>
                  </div>
                </div>

                <div className={modalStyles.configSection}>
                  <div className={modalStyles.configRow}>
                    <label>Días de renta</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="30" 
                      value={days} 
                      onChange={e => setDays(Math.max(1, parseInt(e.target.value) || 1))} 
                    />
                  </div>
                  <div className={modalStyles.configRow}>
                    <label>Sillas de bebé</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="3" 
                      value={babySeats} 
                      onChange={e => setBabySeats(Math.max(0, parseInt(e.target.value) || 0))} 
                    />
                  </div>
                  <div className={modalStyles.configRow}>
                    <label>Cobertura Seguro</label>
                    <select value={insurance} onChange={e => setInsurance(e.target.value)}>
                      <option value="Básico">Seguro Básico (Incluido)</option>
                      <option value="Todo Riesgo">Todo Riesgo (+ $15/día)</option>
                      <option value="Premium">Premium Sin Deducible (+ $30/día)</option>
                    </select>
                  </div>
                </div>

                {!tripIdFromUrl && (
                  <div className={modalStyles.tripSelectionBox}>
                    <h4>¿A qué viaje deseas añadir este auto?</h4>
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
                          placeholder="Nombre del nuevo viaje (ej. Roadtrip Verano)" 
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

                <div className={modalStyles.paymentSection}>
                  <h4>Pasarela de Pago Segura</h4>
                  <div className={modalStyles.payCard}>
                    <CreditCard size={20} />
                    <input type="text" placeholder="Número de tarjeta" defaultValue="**** **** **** 4242" disabled />
                  </div>
                  <button 
                    className={modalStyles.comprarBtn} 
                    onClick={handleComprar}
                    disabled={isPaying}
                  >
                    {isPaying ? 'Procesando pago...' : `Pagar $${getCalculatedTotal().toFixed(2)}`}
                  </button>
                  <p style={{textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px'}}>
                    Incluye renta de {days} días, seguro y tasas.
                  </p>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ background: '#10b981', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Check size={32} color="#fff" />
                </div>
                <h2 style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)'}}>¡Reserva Confirmada!</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Tu renta de {selectedAuto.modelo} en {selectedAuto.ciudad} ha sido asegurada.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Autos;
