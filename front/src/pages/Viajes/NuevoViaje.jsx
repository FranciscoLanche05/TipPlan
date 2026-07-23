import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createTrip, getAll } from '@back/services/firestoreService';
import { ROUTES } from '../../constants/routes';
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
  
  // AI Panel State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: '¡Hola! Soy tu asistente de viajes inteligente. ¿Qué te gustaría que te recomiende para este viaje?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAiSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const newHistory = [...chatHistory, { role: 'user', text: query }];
    setChatHistory(newHistory);
    setQuery('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatHistory([
        ...newHistory, 
        { role: 'ai', text: '¡Suena increíble! Basado en tu idea, aquí tienes algunas sugerencias que podrían inspirar tu itinerario.' }
      ]);
    }, 1500);
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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPane}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>¿A dónde te lleva tu próxima aventura?</h1>
            <p className={styles.subTitle}>Empieza dándole un nombre y seleccionando tu destino.</p>
            
            <div className={styles.aiButtonWrapper}>
              <button className={styles.aiTriggerButton} onClick={() => setIsAiOpen(true)}>
                <Sparkles size={20} color="#ffffff" />
                <span>Planifica con IA</span>
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

      {/* Slide-out AI Panel */}
      <div className={`${styles.aiPanelOverlay} ${isAiOpen ? styles.panelOpen : ''}`} onClick={() => setIsAiOpen(false)}>
        <div className={styles.aiPanelContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.aiPanelHeader}>
            <div className={styles.aiHeaderTitle}>
              <Sparkles size={20} color="var(--accent-gold-strong)" />
              <h2>Asistente Inteligente</h2>
            </div>
            <button className={styles.closeAiBtn} onClick={() => setIsAiOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className={styles.aiChatArea}>
            <div className={styles.chatMessages}>
              {chatHistory.map((msg, index) => (
                <div key={index} className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageRowUser : styles.messageRowAi}`}>
                  {msg.role === 'ai' && <div className={styles.avatarAi}><Sparkles size={14} /></div>}
                  <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={`${styles.messageRow} ${styles.messageRowAi}`}>
                  <div className={styles.avatarAi}><Sparkles size={14} /></div>
                  <div className={`${styles.messageBubble} ${styles.bubbleAi}`}>
                    <Loader2 className={styles.typingSpinner} size={14} /> Pensando...
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleAiSend} className={styles.aiInputForm}>
              <div className={styles.aiInputWrapper}>
                <input 
                  type="text" 
                  className={styles.aiInput} 
                  placeholder="Ej. Recomiéndame un hotel..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className={styles.aiSendBtn}>
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevoViaje;
