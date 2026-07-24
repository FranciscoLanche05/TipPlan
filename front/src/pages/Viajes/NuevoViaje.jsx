import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createTrip, saveReservation, getAll } from '@back/services/firestoreService';
import { ROUTES } from '../../constants/routes';
import { generateItinerary } from '../../services/aiService';
import ItineraryCard from '../../components/common/ChatBot/ItineraryCard';
import PaymentGatewayModal from '../../components/common/Modals/PaymentGatewayModal';
import { vuelosRealistas, hotelesRealistas, restaurantesRealistas } from '../../services/datos/serviciosData';
import { PlaneTakeoff, MapPin, Calendar, ImageIcon, ChevronLeft, ChevronRight, Loader2, Sparkles, Send, Map, Bed, Plane, X } from 'lucide-react';
import { BorderBeam } from '@stianlarsen/border-beam';
import styles from './NuevoViaje.module.css';

const NuevoViaje = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    coverImage: '',
    status: 'Planeado'
  });

  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await getAll("destinations", "title");
        setDestinations(data);
      } catch (err) {
        console.error("Error loading destinations from Firebase:", err);
      }
    };
    loadDestinations();
  }, []);

  const [imageType, setImageType] = useState('predefined'); // 'predefined' o 'url'
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleGenericImage = () => {
    const randomId = Math.floor(Math.random() * 10000);
    setFormData(prev => ({ ...prev, coverImage: `https://picsum.photos/seed/${randomId}/600/400` }));
  };
  
  const normalizeText = (text) => text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  const searchTerms = normalizeText(formData.destination.trim()).split(/\s+/);

  const filteredDestinations = searchTerms[0] === '' 
    ? [] 
    : destinations.filter(d => {
        const fullText = normalizeText(d.title) + " " + normalizeText(d.location);
        return searchTerms.every(term => fullText.includes(term));
      });
  
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);

  const handleAiSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const newHistory = [...chatHistory, { role: 'user', text: query }];
    setChatHistory(newHistory);
    setQuery('');
    setIsTyping(true);
    
    try {
      const response = await generateItinerary(query);
      setChatHistory([
        ...newHistory, 
        { role: 'ai', text: response.message, itinerary: response.itinerary }
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory([
        ...newHistory, 
        { role: 'ai', text: 'Lo siento, hubo un problema conectando con el asistente de inteligencia artificial.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const initiatePayment = (itinerary) => {
    if (!user) {
      alert("Por favor inicia sesión para crear viajes.");
      return;
    }
    
    // Calculate total
    const flight = vuelosRealistas.find(v => v.id === itinerary.flightId);
    const hotel = hotelesRealistas.find(h => h.id === itinerary.hotelId);
    
    let total = 0;
    if (flight) total += flight.precio;
    if (hotel) total += hotel.precioNoche * (itinerary.days || 1);
    
    setTotalPaymentAmount(total);
    setSelectedItinerary(itinerary);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedItinerary) return;
    
    setIsCreatingTrip(true);
    setIsPaymentModalOpen(false);
    
    try {
      const flight = vuelosRealistas.find(v => v.id === selectedItinerary.flightId);
      const hotel = hotelesRealistas.find(h => h.id === selectedItinerary.hotelId);
      const restaurant = restaurantesRealistas.find(r => r.id === selectedItinerary.restaurantId);

      // 1. Create the main trip
      const tripData = {
        title: `Viaje a ${selectedItinerary.destination || 'Destino'}`,
        destination: selectedItinerary.destination,
        startDate: selectedItinerary.startDate || 'Próximamente',
        endDate: selectedItinerary.endDate || 'Próximamente',
        userId: user.uid,
        coverImage: 'https://images.unsplash.com/photo-1436491865332-7a615061c443?q=80&w=2000'
      };
      
      const tripId = await createTrip(tripData);

      // 2. Create reservations using 'type' instead of 'tipo' for DetalleViaje compatibility
      if (flight) {
        await saveReservation({ tripId, userId: user.uid, type: 'vuelo', price: flight.precio, data: flight });
      }
      if (hotel) {
        await saveReservation({ tripId, userId: user.uid, type: 'hotel', price: hotel.precioNoche, data: hotel });
      }
      if (restaurant) {
        // Restaurants don't have a strict pre-paid price, but we save the reservation
        await saveReservation({ tripId, userId: user.uid, type: 'restaurante', price: 0, data: restaurant });
      }

      // 3. Redirect to trip details
      navigate(ROUTES.DETALLE_VIAJE.replace(':id', tripId));
    } catch (error) {
      console.error('Error creando viaje desde IA:', error);
      alert('Hubo un error al generar tus reservas. Intenta nuevamente.');
      setIsCreatingTrip(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDestinationSelect = (dest) => {
    setFormData(prev => ({
      ...prev,
      destination: dest.location,
      coverImage: typeof dest.image === 'string' ? dest.image : dest.image?.src || dest.image,
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const tripId = await createTrip({
        ...formData,
        userId: user.uid
      });
      navigate(ROUTES.DETALLE_VIAJE.replace(':id', tripId));
    } catch (error) {
      console.error('Error al crear el viaje:', error);
      alert('Hubo un error al crear el viaje. Intenta de nuevo.');
      setLoading(false);
    }
  };

  // Collage Images
  const col1 = destinations.slice(0, Math.ceil(destinations.length / 2));
  const col2 = destinations.slice(Math.ceil(destinations.length / 2));

  const renderColumnImages = (items) => (
    <>
      {items.map((dest, i) => (
        <img key={i} src={typeof dest.image === 'string' ? dest.image : dest.image?.src || dest.image} className={styles.collageImg} alt={dest.title || 'Destino'} />
      ))}
      {items.map((dest, i) => (
        <img key={`dup-${i}`} src={typeof dest.image === 'string' ? dest.image : dest.image?.src || dest.image} className={styles.collageImg} alt={dest.title || 'Destino'} />
      ))}
    </>
  );

  const handleCancelItinerary = (msgIndex) => {
    const newHistory = [...chatHistory];
    newHistory[msgIndex].itinerary = null;
    newHistory[msgIndex].text = newHistory[msgIndex].text + " (Propuesta descartada)";
    setChatHistory(newHistory);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPane}>
        <div className={styles.header}>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>¿A dónde te lleva tu próxima aventura?</h1>
            <p className={styles.subTitle}>Empieza dándole un nombre y seleccionando tu destino.</p>
            
            <div className={styles.aiButtonWrapper}>
              <button className={styles.aiTriggerButton} onClick={() => setIsAiOpen(true)}>
                <Sparkles size={20} color="#ffffff" />
                <span>Planifica tu viaje</span>
                <BorderBeam size={80} duration={4} borderWidth={2} colorFrom="#ff0080" colorTo="#7928ca" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombre del viaje</label>
              <div className={styles.inputWrapper}>
                <PlaneTakeoff className={styles.inputIcon} size={20} />
                <input
                  type="text"
                  name="title"
                  required
                  className={styles.input}
                  placeholder="Ej. Vacaciones de Verano en Europa"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Destino Principal</label>
              <div className={styles.inputWrapper} style={{ position: 'relative' }}>
                <MapPin className={styles.inputIcon} size={20} />
                <input
                  type="text"
                  name="destination"
                  required
                  autoComplete="off"
                  className={styles.input}
                  placeholder="Ej. París, Francia"
                  value={formData.destination}
                  onChange={(e) => {
                    handleChange(e);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    if (formData.destination) setShowSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                
                {showSuggestions && formData.destination && (
                  <div className={styles.suggestionsDropdown}>
                    {filteredDestinations.length > 0 ? (
                      filteredDestinations.map(dest => (
                        <div 
                          key={dest.id} 
                          className={styles.suggestionItem}
                          onClick={() => handleDestinationSelect(dest)}
                        >
                          <MapPin size={16} className={styles.suggestionItemIcon} />
                          <div className={styles.suggestionItemText}>
                            <strong>{dest.title}</strong>
                            <span>{dest.location}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noSuggestions}>
                        Destino no disponible, lo sentimos 😢
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Fecha de ida</label>
                <div className={styles.inputWrapper}>
                  <Calendar className={styles.inputIcon} size={20} />
                  <input
                    type="date"
                    name="startDate"
                    required
                    className={styles.input}
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Fecha de vuelta</label>
                <div className={styles.inputWrapper}>
                  <Calendar className={styles.inputIcon} size={20} />
                  <input
                    type="date"
                    name="endDate"
                    required
                    className={styles.input}
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.imageSelectorHeader}>
                <label className={styles.label}>Imagen de Portada</label>
                <div className={styles.imageTypeToggle}>
                  <button 
                    type="button" 
                    className={imageType === 'predefined' ? styles.activeToggle : styles.toggle}
                    onClick={() => setImageType('predefined')}
                  >
                    Sugerencias
                  </button>
                  <button 
                    type="button" 
                    className={styles.toggle}
                    onClick={handleGenericImage}
                  >
                    Genérica
                  </button>
                  <button 
                    type="button" 
                    className={imageType === 'url' ? styles.activeToggle : styles.toggle}
                    onClick={() => setImageType('url')}
                  >
                    URL Personalizada
                  </button>
                </div>
              </div>

              {imageType === 'url' ? (
                <div className={styles.inputWrapper}>
                  <ImageIcon className={styles.inputIcon} size={20} />
                  <input
                    type="url"
                    name="coverImage"
                    className={styles.input}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={formData.coverImage}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <div className={styles.carouselContainer}>
                  <button type="button" className={styles.carouselBtn} onClick={scrollLeft}>
                    <ChevronLeft size={20} />
                  </button>
                  <div className={styles.imageSuggestionsGrid} ref={carouselRef}>
                    {destinations.map(dest => (
                      <div 
                        key={dest.id} 
                        className={`${styles.suggestionCard} ${formData.coverImage === (typeof dest.image === 'string' ? dest.image : dest.image?.src || dest.image) ? styles.selectedSuggestion : ''}`}
                        onClick={() => handleDestinationSelect(dest)}
                      >
                        <div 
                          className={styles.suggestionImg}
                          style={{ backgroundImage: `url(${typeof dest.image === 'string' ? dest.image : dest.image?.src || dest.image})` }}
                        ></div>
                        <span className={styles.suggestionName}>{dest.title}</span>
                      </div>
                    ))}
                  </div>
                  <button type="button" className={styles.carouselBtn} onClick={scrollRight}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? <Loader2 className={styles.spinner} size={20} /> : 'Crear Viaje'}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.rightPane}>
        <div className={styles.scrollColumn}>
          {renderColumnImages(col1)}
        </div>
        <div className={`${styles.scrollColumn} ${styles.reverse}`}>
          {renderColumnImages(col2)}
        </div>
      </div>

      {/* Cajón lateral para la IA */}
      <div className={`${styles.aiDrawer} ${isAiOpen ? styles.drawerOpen : ''}`}>
        
        {/* Header del Chat */}
        <div className={styles.aiPanelHeader}>
          <button className={styles.closeAiBtn} onClick={() => setIsAiOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        {/* Área de Mensajes del Chat */}
        <div className={styles.aiChatArea}>
          <div className={styles.chatMessages}>
            {chatHistory.length === 0 ? (
              <div className={styles.emptyStateContainer}>
                <div className={styles.emptyStateHero}>
                  <Sparkles className={styles.heroSparkle} size={48} />
                  <h1 className={styles.heroTitle}>Pregúntame</h1>
                </div>
                <p className={styles.heroSubtitle}>
                  Diseña el itinerario perfecto para tu próxima aventura
                </p>
              </div>
            ) : (
              <>
                {chatHistory.map((msg, index) => (
              <div key={index} className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageRowUser : styles.messageRowAi}`}>
                {msg.role === 'ai' && (
                  <div className={styles.avatarAi}>
                    <Sparkles size={16} />
                  </div>
                )}
                <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}>
                  {msg.text}
                  {msg.itinerary && (
                  <ItineraryCard 
                    itinerary={msg.itinerary} 
                    onConfirm={() => initiatePayment(msg.itinerary)}
                    onCancel={() => handleCancelItinerary(index)}
                    isCreating={isCreatingTrip}
                  />
                )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.messageRow} ${styles.messageRowAi}`}>
                <div className={styles.avatarAi}>
                  <Sparkles size={14} />
                </div>
                <div className={`${styles.messageBubble} ${styles.bubbleAi}`}>
                  <Loader2 className={styles.typingSpinner} size={14} /> Pensando...
                </div>
              </div>
            )}
            </>
            )}
          </div>
          
          {/* Input Box Rediseñado (Kayak style) */}
          <div className={styles.aiInputContainer}>
            <form onSubmit={handleAiSend} className={styles.aiInputForm}>
              <div className={styles.aiInputWrapper}>
                <textarea 
                  className={styles.aiInput} 
                  placeholder="¿A dónde quieres viajar y qué te gustaría hacer?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAiSend(e);
                    }
                  }}
                  rows={3}
                />
                
                <div className={styles.kayakInputActions}>
                  <button type="button" className={styles.kayakActionBtn} title="Añadir adjunto">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                  
                  <div className={styles.kayakRightActions}>
                    <button type="button" className={styles.kayakActionBtn} title="Dictar por voz">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                    </button>
                    <button type="submit" className={`${styles.aiSendBtn} ${query.trim() ? styles.activeBtn : ''}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className={styles.aiDisclaimer}>
              IA-powered; la IA puede cometer errores. Al usar el Modo IA aceptas nuestros <a href="#">Términos</a> y <a href="#">Política de Privacidad</a>
            </div>
          </div>
        </div>
      </div>
      
      <PaymentGatewayModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={totalPaymentAmount}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
};

export default NuevoViaje;
