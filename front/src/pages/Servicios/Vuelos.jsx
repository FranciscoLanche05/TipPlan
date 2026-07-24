import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { saveReservation, getUserTrips, getTripById } from '@back/services/firestoreService';
import { vuelosRealistas } from '../../services/datos/serviciosData';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Search, ArrowRight, Clock, Star, TrendingUp, Check, ChevronDown, Bell, ArrowLeft, X, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './Vuelos.module.css';

const Vuelos = () => {
  const { user, openLoginModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchTermFrom, setSearchTermFrom] = useState('Quito (UIO)');
  const [searchTermTo, setSearchTermTo] = useState('');
  const [results, setResults] = useState(vuelosRealistas);
  const [activeTab, setActiveTab] = useState('barato');
  const [aiQuery, setAiQuery] = useState('');
  
  const [selectedVuelo, setSelectedVuelo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripIdFromUrl, setTripIdFromUrl] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripToSave, setSelectedTripToSave] = useState('');
  
  // Create Trip state inline
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');

  // Payment state
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamic config state
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState('Económica');

  // Calculation
  const getCalculatedTotal = () => {
    if (!selectedVuelo) return 0;
    let base = selectedVuelo.precio * passengers;
    if (flightClass === 'Business') base *= 2;
    if (flightClass === 'Primera Clase') base *= 3.5;
    return base;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tripId = params.get('tripId');
    if (tripId) {
      setTripIdFromUrl(tripId);
      // Auto-filter by trip destination
      getTripById(tripId).then(trip => {
        if (trip && trip.destination) {
          setSearchTermTo(trip.destination);
          handleSearch(searchTermFrom, trip.destination);
        }
      });
    } else {
      handleSearch(searchTermFrom, searchTermTo);
    }

    if (user?.uid) {
      getUserTrips(user.uid).then(setUserTrips);
    }
  }, [location.search, user]);

  const handleSearch = (from, to) => {
    let filtered = vuelosRealistas;
    if (from) {
      filtered = filtered.filter(v => v.origen?.toLowerCase().includes(from.toLowerCase()));
    }
    if (to) {
      const cleanTo = to.split(',')[0].trim().toLowerCase();
      const exactMatch = filtered.filter(v => v.destino?.toLowerCase().includes(cleanTo));
      if (exactMatch.length > 0) {
        filtered = exactMatch;
      } else {
        // Generate a mock flight on the fly for the searched destination
        filtered = [
          {
            id: `mock-${Date.now()}`,
            aerolinea: 'Aerolínea Global',
            origen: from || 'Quito (UIO)',
            destino: to,
            duracion: '5h 30m',
            precio: Math.floor(Math.random() * 500) + 150,
            tipo: 'vuelo',
            proveedor: 'Expedia',
            escalas: 'Directo',
            logo: 'https://ui-avatars.com/api/?name=Global&background=0D2118&color=fff&size=128'
          },
          ...filtered.slice(0, 3)
        ];
      }
    }
    setResults(filtered);
  };

  const handleFilterClick = (tab) => {
    setActiveTab(tab);
    let sorted = [...results];
    if (tab === 'barato') {
      sorted.sort((a, b) => a.precio - b.precio);
    } else if (tab === 'duracion') {
      sorted.sort((a, b) => a.duracion.localeCompare(b.duracion));
    }
    setResults(sorted);
  };

  const openFlightDetail = (vuelo) => {
    setSelectedVuelo(vuelo);
    setIsModalOpen(true);
    setPaymentSuccess(false);
    setIsPaying(false);
  };

  const handleComprar = async () => {
    if (!user) {
      openLoginModal();
      return;
    }

    let targetTripId = tripIdFromUrl || selectedTripToSave;

    if (!targetTripId) {
      toast.error("Debe escoger o crear un viaje primero");
      return;
    }
    
    // Wait, if selectedTripToSave === 'NEW', then we should have already created it. 
    // Actually, I'll handle creation before reaching this function, or inside this function.
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
          destination: selectedVuelo.destino,
          startDate: 'Próximamente',
          endDate: 'Próximamente',
          coverImage: selectedVuelo.logo,
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
        const flightDest = selectedVuelo.destino.toLowerCase();
        
        // Remove code like (MAD) to compare
        const cleanTripDest = tripDest.split(',')[0].trim();
        const cleanFlightDest = flightDest.split('(')[0].trim();

        if (!cleanFlightDest.includes(cleanTripDest) && !cleanTripDest.includes(cleanFlightDest)) {
          toast.error(`El destino del vuelo (${selectedVuelo.destino}) no coincide con el destino de tu viaje (${selectedTripObj.destination}).`);
          return;
        }
      }
    }

    setIsPaying(true);
    // Simulate payment process
    setTimeout(async () => {
      try {
        await saveReservation({
          userId: user.uid,
          tripId: targetTripId,
          type: 'vuelo',
          title: `Vuelo ${selectedVuelo.origen} a ${selectedVuelo.destino}`,
          location: selectedVuelo.destino,
          date: 'Fecha de vuelo',
          price: getCalculatedTotal(),
          status: 'Confirmado',
          airline: selectedVuelo.aerolinea
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

  return (
    <div className={styles.pageRoot}>
      <div className={styles.topSearchBanner}>
        <div className={styles.searchControlsRow}>
          <div className={styles.dropdownGroupSelect}>
            <select className={styles.nativeSelect}>
              <option>Ida y vuelta</option>
              <option>Solo ida</option>
              <option>Múltiples destinos</option>
            </select>
          </div>
          <div className={styles.dropdownGroupSelect}>
            <select className={styles.nativeSelect}>
              <option>1 adulto</option>
              <option>2 adultos</option>
              <option>3 adultos</option>
            </select>
          </div>
          <div className={styles.dropdownGroupSelect}>
            <select className={styles.nativeSelect}>
              <option>Económica</option>
              <option>Premium</option>
              <option>Business</option>
              <option>Primera clase</option>
            </select>
          </div>
        </div>
        
        <div className={styles.searchInputsContainer}>
          <div className={styles.inputWrap}>
            <input 
              type="text" 
              value={searchTermFrom} 
              onChange={e => setSearchTermFrom(e.target.value)} 
              placeholder="¿De dónde sales?" 
            />
          </div>
          <div className={styles.swapBtn}><ArrowRight size={16}/></div>
          <div className={styles.inputWrap}>
            <input 
              type="text" 
              value={searchTermTo} 
              onChange={e => setSearchTermTo(e.target.value)} 
              placeholder="¿A dónde vas?" 
            />
          </div>
          <div className={styles.inputWrap}>
            <input type="text" placeholder="Fechas" defaultValue="Mar. 15 - Jue. 20" />
          </div>
          <button className={styles.searchSubmitBtn} onClick={() => handleSearch(searchTermFrom, searchTermTo)}>
            Buscar
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Sidebar */}
        <div className={styles.leftSidebar}>
          <div className={styles.priceTrackWidget}>
            <div className={styles.trackHeader}>
              <TrendingUp size={20} color="#166534" />
              <h3>Reserva ahora</h3>
            </div>
            <p>Esperamos que los precios suban $10 en los próximos 30 días.</p>
            <div className={styles.trackToggleRow}>
              <span>Rastreo de precios</span>
              <div className={styles.toggleSwitch}></div>
            </div>
          </div>

          <div className={styles.smartFiltersWidget}>
            <div className={styles.smartHeader}>
              <Star size={16} />
              <h3>Filtros inteligentes</h3>
              <ChevronDown size={16} style={{marginLeft: 'auto'}}/>
            </div>
            <p className={styles.smartSub}>Con tecnología de IA. La IA puede cometer errores.</p>
            <textarea 
              className={styles.smartInput} 
              placeholder="¿Buscas algo en particular? Intenta lo siguiente: Quiero ver vuelos directos de menos de 300 USD."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
            ></textarea>
            <button className={styles.smartFilterBtn}>Filtrar vuelos</button>
          </div>
        </div>

        {/* Right Results */}
        <div className={styles.resultsArea}>
          {/* Tabs */}
          <div className={styles.tabsRow}>
            <div 
              className={`${styles.tabItem} ${activeTab === 'barato' ? styles.activeTab : ''}`}
              onClick={() => handleFilterClick('barato')}
            >
              <strong>El más barato</strong>
              <span>${results[0]?.precio || 0} • {results[0]?.duracion || ''}</span>
            </div>
            <div 
              className={`${styles.tabItem} ${activeTab === 'mejor' ? styles.activeTab : ''}`}
              onClick={() => handleFilterClick('mejor')}
            >
              <strong>El mejor</strong>
              <span>${(results[0]?.precio || 0) + 15} • {results[0]?.duracion || ''}</span>
            </div>
            <div 
              className={`${styles.tabItem} ${activeTab === 'duracion' ? styles.activeTab : ''}`}
              onClick={() => handleFilterClick('duracion')}
            >
              <strong>Menor duración</strong>
              <span>${(results[0]?.precio || 0) + 40} • Rápido</span>
            </div>
          </div>

          <h4 className={styles.resultsTitle}>Mejores vuelos de salida</h4>

          <div className={styles.flightList}>
            {results.map((vuelo, i) => (
              <div key={vuelo.id} className={`${styles.flightCard} ${i === 0 ? styles.featuredCard : ''}`}>
                {i === 0 && <div className={styles.featuredBadge}>Mejor opción seleccionada</div>}
                <div className={styles.flightCardInner}>
                  <div className={styles.flightLogo}>
                    <img src={vuelo.logo} alt={vuelo.aerolinea} />
                  </div>
                  <div className={styles.flightTimes}>
                    <div className={styles.timeMain}>08:00 – 12:00</div>
                    <div className={styles.flightRoute}>{vuelo.origen} – {vuelo.destino}</div>
                    <div className={styles.airlineName}>{vuelo.aerolinea}</div>
                  </div>
                  <div className={styles.flightStops}>
                    <div className={styles.stopText}>{vuelo.duracion}</div>
                    <div className={styles.stopDesc}>{vuelo.escalas}</div>
                  </div>
                  <div className={styles.flightPriceCol}>
                    <div className={styles.priceMain}>${vuelo.precio}</div>
                    <div className={styles.priceSub}>Económica</div>
                    <button className={styles.selectFlightBtn} onClick={() => openFlightDetail(vuelo)}>
                      Seleccionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETALLE Y COMPRA MODAL */}
      {isModalOpen && selectedVuelo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>
            
            {!paymentSuccess ? (
              <>
                <h2 className={styles.modalTitle}>Confirmar y Comprar Vuelo</h2>
                
                <div className={styles.modalFlightInfo}>
                  <div className={styles.mLogo}><img src={selectedVuelo.logo} alt="Logo" /></div>
                  <div className={styles.mDetails}>
                    <h3>{selectedVuelo.origen} <ArrowRight size={14}/> {selectedVuelo.destino}</h3>
                    <p>{selectedVuelo.aerolinea} • {selectedVuelo.duracion} • {selectedVuelo.escalas}</p>
                  </div>
                  <div className={styles.mPrice}>
                    <h2>${selectedVuelo.precio}</h2>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>precio base p/p</span>
                  </div>
                </div>

                <div className={styles.configSection}>
                  <div className={styles.configRow}>
                    <label>Pasajeros</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={passengers} 
                      onChange={e => setPassengers(Math.max(1, parseInt(e.target.value) || 1))} 
                    />
                  </div>
                  <div className={styles.configRow}>
                    <label>Clase</label>
                    <select value={flightClass} onChange={e => setFlightClass(e.target.value)}>
                      <option value="Económica">Económica (Base)</option>
                      <option value="Business">Business (+100%)</option>
                      <option value="Primera Clase">Primera Clase (+250%)</option>
                    </select>
                  </div>
                </div>

                {!tripIdFromUrl && (
                  <div className={styles.tripSelectionBox}>
                    <h4>¿A qué viaje deseas añadir este vuelo?</h4>
                    <select 
                      value={selectedTripToSave} 
                      onChange={(e) => setSelectedTripToSave(e.target.value)}
                      className={styles.tripSelect}
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
                          className={styles.tripSelect}
                          value={newTripTitle}
                          onChange={(e) => setNewTripTitle(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {tripIdFromUrl && (
                  <div className={styles.tripInfoAlert}>
                    <Check size={16} /> Se añadirá automáticamente a tu viaje actual.
                  </div>
                )}

                <div className={styles.paymentSection}>
                  <h4>Pasarela de Pago Segura</h4>
                  <div className={styles.payCard}>
                    <CreditCard size={20} />
                    <input type="text" placeholder="Número de tarjeta" defaultValue="**** **** **** 4242" disabled />
                  </div>
                  <button 
                    className={styles.comprarBtn} 
                    onClick={handleComprar}
                    disabled={isPaying}
                  >
                    {isPaying ? 'Procesando pago...' : `Comprar por $${getCalculatedTotal()}`}
                  </button>
                  <p style={{textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px'}}>
                    {passengers} Pasajero(s) en clase {flightClass}
                  </p>
                </div>
              </>
            ) : (
              <div className={styles.successState}>
                <div className={styles.successIcon}><Check size={40} /></div>
                <h2>¡Compra Exitosa!</h2>
                <p>Tu vuelo ha sido reservado y guardado en tu viaje.</p>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Vuelos;
