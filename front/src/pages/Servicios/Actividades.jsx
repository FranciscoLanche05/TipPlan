import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveReservation, getUserTrips, getTripById } from '@back/services/firestoreService';
import { actividadesPorCiudad } from '../../services/datos/serviciosData';
import ServiceLayout from '../../components/common/ServiceLayout/ServiceLayout';
import { Compass, Check, X, CreditCard } from 'lucide-react';
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

const Actividades = () => {
  const { user, openLoginModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const todasLasActividades = Object.values(actividadesPorCiudad).flat();
  const [results, setResults] = useState(todasLasActividades);
  const [selectedAct, setSelectedAct] = useState(null);

  const [tripIdFromUrl, setTripIdFromUrl] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripToSave, setSelectedTripToSave] = useState('');
  
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');

  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamic config state
  const [people, setPeople] = useState(1);
  const [passType, setPassType] = useState('General');

  // Calculation
  const getCalculatedTotal = () => {
    if (!selectedAct) return 0;
    let base = selectedAct.precio * people;
    
    if (passType === 'Acceso Rápido') base *= 1.3;
    if (passType === 'VIP') base *= 1.8;
    
    return Math.round(base);
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

  const getCityFromActivity = (actId) => {
    let city = 'Varias';
    Object.entries(actividadesPorCiudad).forEach(([c, acts]) => {
      if(acts.find(a => a.id === actId)) city = c;
    });
    return city;
  };

  const handleSearch = (term) => {
    if (!term) {
      setResults(todasLasActividades);
      return;
    }
    const cleanTerm = term.split(',')[0].trim().toLowerCase();
    const filtered = todasLasActividades.filter(a => {
      const cityMatches = Object.entries(actividadesPorCiudad).some(([ciudad, acts]) => 
        ciudad?.toLowerCase().includes(cleanTerm) && acts.find(act => act.id === a.id)
      );
      return cityMatches || a.titulo?.toLowerCase().includes(cleanTerm);
    });
    
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
      
      const simulatedActs = [
        {
          id: `sim-${Date.now()}-1`,
          titulo: `City Tour Panorámico ${term.charAt(0).toUpperCase() + term.slice(1)}`,
          ciudad: term.charAt(0).toUpperCase() + term.slice(1),
          duracion: '3h',
          precio: Math.floor(Math.random() * (50 - 20) + 20),
          tipo: 'actividad',
          imagen: 'https://loremflickr.com/600/400/tour,city?lock=' + Math.floor(Math.random() * 100),
          lat: coords.lat + (Math.random() * 0.02 - 0.01),
          lng: coords.lng + (Math.random() * 0.02 - 0.01),
          proveedor: 'GetYourGuide',
          rating: (Math.random() * (9.8 - 8.5) + 8.5).toFixed(1),
          resenas: Math.floor(Math.random() * 500)
        },
        {
          id: `sim-${Date.now()}-2`,
          titulo: `Excursión Aventura`,
          ciudad: term.charAt(0).toUpperCase() + term.slice(1),
          duracion: '6h',
          precio: Math.floor(Math.random() * (120 - 50) + 50),
          tipo: 'actividad',
          imagen: 'https://loremflickr.com/600/400/adventure?lock=' + Math.floor(Math.random() * 100),
          lat: coords.lat + (Math.random() * 0.02 - 0.01),
          lng: coords.lng + (Math.random() * 0.02 - 0.01),
          proveedor: 'Viator',
          rating: (Math.random() * (9.0 - 7.5) + 7.5).toFixed(1),
          resenas: Math.floor(Math.random() * 300)
        }
      ];
      setResults(simulatedActs);
    }
  };

  const openActDetail = (act) => {
    if (!user) {
      openLoginModal();
      return;
    }
    
    // Asign city if simulated (which already has it), or get from dictionary
    const city = act.ciudad || getCityFromActivity(act.id);
    setSelectedAct({ ...act, ciudadDisplay: city });
    
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
          destination: selectedAct.ciudadDisplay,
          startDate: 'Próximamente',
          endDate: 'Próximamente',
          coverImage: selectedAct.imagen,
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
        const actDest = selectedAct.ciudadDisplay.toLowerCase();
        
        const cleanTripDest = tripDest.split(',')[0].trim();
        const cleanActDest = actDest.split(',')[0].trim();

        if (!cleanActDest.includes(cleanTripDest) && !cleanTripDest.includes(cleanActDest)) {
          toast.error(`La ciudad de la actividad (${selectedAct.ciudadDisplay}) no coincide con el destino de tu viaje (${selectedTripObj.destination}).`);
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
          type: 'actividad',
          title: `Tour: ${selectedAct.titulo}`,
          location: selectedAct.ciudadDisplay,
          date: 'Fecha abierta',
          price: getCalculatedTotal(),
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
    }, 2000);
  };

  const handleMarkerClick = (act) => {
    const el = document.getElementById(`act-${act.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add(styles.highlight);
      setTimeout(() => el.classList.remove(styles.highlight), 2000);
    }
  };

  const renderActCard = (act) => (
    <div key={act.id} id={`act-${act.id}`} className={styles.kayakCard}>
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
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '5px' }}>
            ⏳ Duración: {act.duracion} • {act.ciudad || getCityFromActivity(act.id)}
          </div>
        </div>

        <div className={styles.kCardDetails}>
          <div className={styles.kCardProviders}>
            <div className={styles.providerRow}>
              <strong>{act.proveedor || 'Proveedor local'}</strong>
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
            <button className={styles.kActionBtn} onClick={() => openActDetail(act)}>Ver disponibilidad</button>
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
        onMarkerClick={handleMarkerClick}
      />

      {isModalOpen && selectedAct && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <button className={modalStyles.modalClose} onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>

            {!paymentSuccess ? (
              <>
                <h2 className={modalStyles.modalTitle}>Confirmar Actividad</h2>
                
                <div className={modalStyles.modalFlightInfo}>
                  <div className={modalStyles.mLogo} style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={selectedAct.imagen} alt="Actividad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className={modalStyles.mDetails}>
                    <h3>{selectedAct.titulo}</h3>
                    <p>{selectedAct.ciudadDisplay} • {selectedAct.duracion} • {selectedAct.proveedor}</p>
                    <p style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px'}}>Cancelación gratuita • Guía profesional</p>
                  </div>
                  <div className={modalStyles.mPrice}>
                    <h2>${selectedAct.precio}</h2>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>precio base p/p</span>
                  </div>
                </div>

                <div className={modalStyles.configSection}>
                  <div className={modalStyles.configRow}>
                    <label>Asistentes (Personas)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="20" 
                      value={people} 
                      onChange={e => setPeople(Math.max(1, parseInt(e.target.value) || 1))} 
                    />
                  </div>
                  <div className={modalStyles.configRow}>
                    <label>Tipo de Pase</label>
                    <select value={passType} onChange={e => setPassType(e.target.value)}>
                      <option value="General">Entrada General (Base)</option>
                      <option value="Acceso Rápido">Acceso Rápido (+30%)</option>
                      <option value="VIP">Tour Privado VIP (+80%)</option>
                    </select>
                  </div>
                </div>

                {!tripIdFromUrl && (
                  <div className={modalStyles.tripSelectionBox}>
                    <h4>¿A qué viaje deseas añadir esta actividad?</h4>
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
                          placeholder="Nombre del nuevo viaje (ej. Aventura Fin de Semana)" 
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
                    {isPaying ? 'Procesando pago...' : `Pagar reserva por $${getCalculatedTotal()}`}
                  </button>
                  <p style={{textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px'}}>
                    Total para {people} persona(s) con pase {passType}
                  </p>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ background: '#10b981', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Check size={32} color="#fff" />
                </div>
                <h2 style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)'}}>¡Reserva Confirmada!</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Tu tour "{selectedAct.titulo}" en {selectedAct.ciudadDisplay} está asegurado.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Actividades;
