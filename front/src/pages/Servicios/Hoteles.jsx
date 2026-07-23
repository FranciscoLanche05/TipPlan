import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveReservation, getUserTrips, getTripById } from '@back/services/firestoreService';
import { hotelesRealistas } from '../../services/datos/serviciosData';
import ServiceLayout from '../../components/common/ServiceLayout/ServiceLayout';
import { Bed, Star, Check, X, CreditCard, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './Servicios.module.css';
import modalStyles from './Vuelos.module.css'; // Reuse modal styles from Vuelos

// Coordenadas base para simulaciones de búsquedas dinámicas
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

const Hoteles = () => {
  const { user, openLoginModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState(hotelesRealistas);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [tripIdFromUrl, setTripIdFromUrl] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripToSave, setSelectedTripToSave] = useState('');
  
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');

  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamic config state
  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);
  const [roomCategory, setRoomCategory] = useState('Estándar');

  // Calculation
  const getCalculatedTotal = () => {
    if (!selectedHotel) return 0;
    
    // Base price per night
    let base = selectedHotel.precioNoche * nights;
    
    // Extra guests surcharge (assume base price is for 2 people)
    if (guests > 2) {
      base += (guests - 2) * (selectedHotel.precioNoche * 0.15) * nights; 
    }

    // Room category multiplier
    if (roomCategory === 'Vista al Mar / Suite') base *= 1.4;
    if (roomCategory === 'Presidencial') base *= 2.0;
    
    return Math.round(base);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tripId = params.get('tripId');
    if (tripId) {
      setTripIdFromUrl(tripId);
      // Auto-filter by trip destination
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
      setResults(hotelesRealistas);
      return;
    }
    const cleanTerm = term.split(',')[0].trim().toLowerCase();
    const filtered = hotelesRealistas.filter(h => 
      h.ciudad?.toLowerCase().includes(cleanTerm) || 
      h.nombre?.toLowerCase().includes(cleanTerm)
    );

    if (filtered.length > 0) {
      setResults(filtered);
    } else {
      // Simulación dinámica de hoteles si el destino no está en la base de datos fija
      let coords = cityCoordinates[cleanTerm];
      
      if (!coords) {
        // Generar coordenadas aleatorias realistas si no conocemos la ciudad
        coords = { 
          lat: (Math.random() * 60 - 30), 
          lng: (Math.random() * 60 - 100) 
        };
      }
      
      const simulatedHotels = [
        {
          id: `sim-${Date.now()}-1`,
          nombre: `Hotel Plaza ${term.charAt(0).toUpperCase() + term.slice(1)}`,
          ciudad: term.charAt(0).toUpperCase() + term.slice(1),
          estrellas: 5,
          precioNoche: Math.floor(Math.random() * (250 - 150) + 150),
          tipo: 'hotel',
          imagen: 'https://loremflickr.com/600/400/luxury,hotel?lock=' + Math.floor(Math.random() * 100),
          lat: coords.lat + (Math.random() * 0.02 - 0.01),
          lng: coords.lng + (Math.random() * 0.02 - 0.01),
          proveedor: 'Booking.com',
          rating: (Math.random() * (9.8 - 8.5) + 8.5).toFixed(1),
          resenas: Math.floor(Math.random() * 2000 + 100),
          comodidades: 'Piscina, Spa'
        },
        {
          id: `sim-${Date.now()}-2`,
          nombre: `Resort & Spa ${term.charAt(0).toUpperCase() + term.slice(1)}`,
          ciudad: term.charAt(0).toUpperCase() + term.slice(1),
          estrellas: 4,
          precioNoche: Math.floor(Math.random() * (150 - 80) + 80),
          tipo: 'hotel',
          imagen: 'https://loremflickr.com/600/400/resort,hotel?lock=' + Math.floor(Math.random() * 100),
          lat: coords.lat + (Math.random() * 0.02 - 0.01),
          lng: coords.lng + (Math.random() * 0.02 - 0.01),
          proveedor: 'Expedia',
          rating: (Math.random() * (9.0 - 7.5) + 7.5).toFixed(1),
          resenas: Math.floor(Math.random() * 1000 + 50),
          comodidades: 'Desayuno incluido'
        },
        {
          id: `sim-${Date.now()}-3`,
          nombre: `Boutique Hotel Centro`,
          ciudad: term.charAt(0).toUpperCase() + term.slice(1),
          estrellas: 3,
          precioNoche: Math.floor(Math.random() * (90 - 40) + 40),
          tipo: 'hotel',
          imagen: 'https://loremflickr.com/600/400/boutique,hotel?lock=' + Math.floor(Math.random() * 100),
          lat: coords.lat + (Math.random() * 0.02 - 0.01),
          lng: coords.lng + (Math.random() * 0.02 - 0.01),
          proveedor: 'Hotels.com',
          rating: (Math.random() * (8.5 - 7.0) + 7.0).toFixed(1),
          resenas: Math.floor(Math.random() * 500 + 20),
          comodidades: 'Wifi gratis'
        }
      ];
      setResults(simulatedHotels);
    }
  };

  const openHotelDetail = (hotel) => {
    if (!user) {
      openLoginModal();
      return;
    }
    setSelectedHotel(hotel);
    setIsModalOpen(true);
    setPaymentSuccess(false);
    setIsPaying(false);
  };

  const handleComprar = async () => {
    let targetTripId = tripIdFromUrl || selectedTripToSave;

    if (!targetTripId) {
      toast.error("Debe escoger o crear un viaje primero");
      return;
    }
    
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
          destination: selectedHotel.ciudad,
          startDate: 'Próximamente',
          endDate: 'Próximamente',
          coverImage: selectedHotel.imagen,
          status: 'Planeado'
        });
        targetTripId = newTripId;
      } catch (error) {
        toast.error("Hubo un error al crear el viaje");
        setIsPaying(false);
        return;
      }
    } else {
      // Validate destination match for existing trips
      const selectedTripObj = userTrips.find(t => t.id === targetTripId);
      if (selectedTripObj && selectedTripObj.destination) {
        const tripDest = selectedTripObj.destination.toLowerCase();
        const hotelDest = selectedHotel.ciudad.toLowerCase();
        
        // Split by comma in case of "Madrid, España"
        const cleanTripDest = tripDest.split(',')[0].trim();
        const cleanHotelDest = hotelDest.split(',')[0].trim();

        if (!cleanHotelDest.includes(cleanTripDest) && !cleanTripDest.includes(cleanHotelDest)) {
          toast.error(`La ciudad del hotel (${selectedHotel.ciudad}) no coincide con el destino de tu viaje (${selectedTripObj.destination}).`);
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
          type: 'hotel',
          title: `Estadía en ${selectedHotel.nombre}`,
          location: selectedHotel.ciudad,
          date: 'Fechas abiertas',
          price: getCalculatedTotal(),
          status: 'Confirmado',
          airline: selectedHotel.proveedor // mapping provider
        });
        setIsPaying(false);
        setPaymentSuccess(true);
        toast.success("¡Compra Exitosa!");
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
      } catch (error) {
        console.error("Error saving reservation:", error);
        toast.error("Hubo un error al procesar la compra.");
        setIsPaying(false);
      }
    }, 2000);
  };

  const handleMarkerClick = (hotelId) => {
    const el = document.getElementById(`hotel-${hotelId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Destello visual temporal
      el.style.transition = 'box-shadow 0.3s';
      el.style.boxShadow = '0 0 0 3px #166534';
      setTimeout(() => {
        el.style.boxShadow = 'none';
      }, 1500);
    }
  };

  const renderHotelCard = (hotel) => (
    <div key={hotel.id} id={`hotel-${hotel.id}`} className={styles.kayakCard}>
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
            <button className={styles.kActionBtn} onClick={() => openHotelDetail(hotel)}>Ver oferta</button>
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
        onMarkerClick={handleMarkerClick}
      />

      {isModalOpen && selectedHotel && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <button className={modalStyles.modalClose} onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>
            
            {!paymentSuccess ? (
              <>
                <h2 className={modalStyles.modalTitle}>Confirmar y Comprar Hotel</h2>
                
                <div className={modalStyles.modalFlightInfo}>
                  <div className={modalStyles.mLogo} style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={selectedHotel.imagen} alt="Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className={modalStyles.mDetails}>
                    <h3>{selectedHotel.nombre}</h3>
                    <p>{selectedHotel.ciudad} • {selectedHotel.estrellas} Estrellas • {selectedHotel.proveedor}</p>
                    <p style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>2 Personas • 3 Noches • {selectedHotel.comodidades}</p>
                  </div>
                  <div className={modalStyles.mPrice}>
                    <h2>${selectedHotel.precioNoche}</h2>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>precio base p/n</span>
                  </div>
                </div>

                <div className={modalStyles.configSection}>
                  <div className={modalStyles.configRow}>
                    <label>Noches de estadía</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="30" 
                      value={nights} 
                      onChange={e => setNights(Math.max(1, parseInt(e.target.value) || 1))} 
                    />
                  </div>
                  <div className={modalStyles.configRow}>
                    <label>Huéspedes</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="8" 
                      value={guests} 
                      onChange={e => setGuests(Math.max(1, parseInt(e.target.value) || 1))} 
                    />
                  </div>
                  <div className={modalStyles.configRow}>
                    <label>Habitación</label>
                    <select value={roomCategory} onChange={e => setRoomCategory(e.target.value)}>
                      <option value="Estándar">Estándar (Base)</option>
                      <option value="Vista al Mar / Suite">Vista al Mar / Suite (+40%)</option>
                      <option value="Presidencial">Presidencial (+100%)</option>
                    </select>
                  </div>
                </div>

                {!tripIdFromUrl && (
                  <div className={modalStyles.tripSelectionBox}>
                    <h4>¿A qué viaje deseas añadir esta estadía?</h4>
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
                          placeholder="Nombre del nuevo viaje (ej. Vacaciones Verano)" 
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
                    {isPaying ? 'Procesando pago...' : `Comprar por $${getCalculatedTotal()}`}
                  </button>
                  <p style={{textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '12px'}}>
                    Total por {nights} noche(s) para {guests} huésped(es)
                  </p>
                </div>
              </>
            ) : (
              <div className={modalStyles.successState}>
                <div className={modalStyles.successIcon}><Check size={40} /></div>
                <h2>¡Compra Exitosa!</h2>
                <p>Tu estadía ha sido reservada y guardada en tu viaje.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Hoteles;
