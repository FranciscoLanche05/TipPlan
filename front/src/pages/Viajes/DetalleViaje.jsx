import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById, getUserReservations, updateTrip, deleteTrip, deleteReservation, saveReservation } from '@back/services/firestoreService';
import { ROUTES } from '../../constants/routes';
import { generateModification } from '../../services/aiModifierService';
import ModificationCard from '../../components/common/ChatBot/ModificationCard';
import { 
  ArrowLeft, Folder, Pencil, Calendar, Plane, Bed, Briefcase, MapPin, 
  X, FileText, Coins, Cloud, Hand, Sun, CloudRain, Ticket, CalendarDays, 
  UserPlus, Plus, Car, Utensils, Loader2, Trash2, Save, Download, Sparkles, Send
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TripItineraryPDF from '../../components/pdf/TripItineraryPDF';
import ReservationReceiptPDF from '../../components/pdf/ReservationReceiptPDF';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/common/Modals/ConfirmModal';
import styles from './DetalleViaje.module.css';

const DetalleViaje = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todas');
  
  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editTripData, setEditTripData] = useState({ title: '', destination: '', startDate: '', endDate: '' });

  // AI Modifier States
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const tripData = await getTripById(id);
        setTrip(tripData);
        if (tripData) {
          setEditTripData({
            title: tripData.title || '',
            destination: tripData.destination || '',
            startDate: tripData.startDate !== 'Próximamente' ? tripData.startDate : '',
            endDate: tripData.endDate !== 'Próximamente' ? tripData.endDate : ''
          });
          const allRes = await getUserReservations(tripData.userId);
          const tripRes = allRes.filter(r => r.tripId === id);
          setReservations(tripRes);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [id]);

  if (loading) {
    return <div className={styles.loadingContainer}><Loader2 className={styles.spinner} size={32} /></div>;
  }

  if (!trip) {
    return <div className={styles.loadingContainer}>Viaje no encontrado.</div>;
  }

  // Cost calculations
  const totalSpent = reservations.reduce((sum, res) => {
    let itemPrice = 0;
    if (res.price) {
      const num = parseFloat(String(res.price).replace(/[^\d.-]/g, ''));
      if (!isNaN(num)) itemPrice = num;
    } else if (res.precio || res.precioNoche || res.precioDia) {
      const num = parseFloat(res.precio || res.precioNoche || res.precioDia);
      if (!isNaN(num)) itemPrice = num;
    }
    return sum + itemPrice;
  }, 0);
  
  const estimatedBudget = 1500; // Mock budget for UI purposes

  // Filtering
  const filters = [
    { id: 'Todas', icon: Calendar, label: 'Todas' },
    { id: 'vuelo', icon: Plane, label: 'Vuelos' },
    { id: 'hotel', icon: Bed, label: 'Hoteles' },
    { id: 'actividad', icon: Briefcase, label: 'Actividades' },
    { id: 'auto', icon: Car, label: 'Vehículos' },
    { id: 'restaurante', icon: Utensils, label: 'Restaurantes' }
  ];

  const filteredReservations = activeFilter === 'Todas' 
    ? reservations 
    : reservations.filter(r => (r.type || '').toLowerCase() === activeFilter.toLowerCase());

  // Navigation helpers
  const handleAddService = (type) => {
    let route = '';
    switch(type) {
      case 'vuelo': route = ROUTES.VUELOS; break;
      case 'hotel': route = ROUTES.HOTELES; break;
      case 'actividad': route = ROUTES.ACTIVIDADES; break;
      case 'auto': route = ROUTES.AUTOS; break;
      case 'restaurante': route = ROUTES.RESTAURANTES; break;
      default: route = ROUTES.NUEVO_VIAJE;
    }
    navigate(`${route}?tripId=${id}`);
  };

  const getServiceIcon = (type) => {
    switch((type || '').toLowerCase()) {
      case 'vuelo': return <Plane size={18} />;
      case 'hotel': return <Bed size={18} />;
      case 'actividad': return <Briefcase size={18} />;
      case 'auto': return <Car size={18} />;
      case 'restaurante': return <Utensils size={18} />;
      default: return <Ticket size={18} />;
    }
  };

  const getDaysUntil = (dateString) => {
    if (!dateString || dateString === 'Próximamente') return '?';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return '?';
    const diffTime = Math.abs(dateObj - new Date());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleUpdateTrip = async () => {
    try {
      await updateTrip(id, {
        title: editTripData.title || 'Viaje Sin Nombre',
        destination: editTripData.destination || 'Destino',
        startDate: editTripData.startDate || 'Próximamente',
        endDate: editTripData.endDate || 'Próximamente'
      });
      setTrip(prev => ({...prev, ...editTripData, startDate: editTripData.startDate || 'Próximamente', endDate: editTripData.endDate || 'Próximamente'}));
      setIsEditingTrip(false);
      toast.success('Viaje actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el viaje');
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(id);
      setIsDeleteModalOpen(false);
      toast.success('Viaje eliminado correctamente');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error('Error al eliminar el viaje');
      setIsDeleteModalOpen(false);
    }
  };

  const handleAiSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const newHistory = [...chatHistory, { role: 'user', text: query }];
    setChatHistory(newHistory);
    setQuery('');
    setIsTyping(true);
    
    try {
      const response = await generateModification(query, reservations, trip.destination);
      setChatHistory([
        ...newHistory, 
        { role: 'ai', text: response.message, modification: response.modification }
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory([
        ...newHistory, 
        { role: 'ai', text: 'Hubo un error contactando a la inteligencia artificial.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleConfirmReplacement = async (oldReservationId, type, newServiceData) => {
    setIsReplacing(true);
    try {
      // 1. Delete old reservation
      await deleteReservation(oldReservationId);
      
      // 2. Save new reservation
      await saveReservation({
        tripId: id,
        userId: trip.userId,
        type: type,
        price: newServiceData.precio || newServiceData.precioNoche || newServiceData.precioPromedio || 0,
        data: newServiceData
      });

      toast.success("Reserva actualizada correctamente");
      
      // Reload reservations
      const allRes = await getUserReservations(trip.userId);
      setReservations(allRes.filter(r => r.tripId === id));
      
      // Close AI panel automatically for better UX
      setIsAiOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al reemplazar la reserva");
    } finally {
      setIsReplacing(false);
    }
  };

  const handleCancelModification = (msgIndex) => {
    const newHistory = [...chatHistory];
    newHistory[msgIndex].modification = null;
    newHistory[msgIndex].text = newHistory[msgIndex].text + " (Propuesta descartada)";
    setChatHistory(newHistory);
  };

  return (
    <div className={styles.mockRoot}>
      <div className={styles.mockBody}>
        
        {/* LEFT COLUMN */}
        <div>
          <div className={styles.backLink} onClick={() => navigate(ROUTES.DASHBOARD)}>
            <ArrowLeft size={15} /> Volver a mis viajes
          </div>

          <div className={styles.titleSection}>
            <div className={styles.titleIcon}>
              <Folder size={22} />
            </div>
            {isEditingTrip ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  value={editTripData.title}
                  onChange={e => setEditTripData({...editTripData, title: e.target.value})}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-soft)', fontSize: '18px', fontWeight: 'bold' }}
                  placeholder="Título"
                />
                <input 
                  type="date" 
                  value={editTripData.startDate}
                  onChange={e => setEditTripData({...editTripData, startDate: e.target.value})}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-soft)' }}
                />
                <input 
                  type="date" 
                  value={editTripData.endDate}
                  onChange={e => setEditTripData({...editTripData, endDate: e.target.value})}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-soft)' }}
                />
                <button onClick={handleUpdateTrip} style={{ padding: '8px 12px', background: '#166534', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Save size={14}/> Guardar</button>
                <button onClick={() => setIsEditingTrip(false)} style={{ padding: '8px 12px', background: 'var(--bg-muted)', color: 'var(--text-secondary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
              </div>
            ) : (
              <div className={styles.titleTextGroup}>
                <span className={styles.titleText}>{trip.title}</span>
                <button onClick={() => setIsEditingTrip(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <Pencil size={14} className={styles.editIcon} />
                </button>
                <button onClick={() => setIsDeleteModalOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', marginLeft: 'auto', display: 'flex', alignItems: 'center' }} title="Eliminar viaje">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          <div className={styles.filterGroup}>
            {filters.map(f => {
              const Icon = f.icon;
              const isActive = activeFilter === f.id;
              return (
                <span 
                  key={f.id} 
                  className={isActive ? styles.filterBadgeActive : styles.filterBadge}
                  onClick={() => setActiveFilter(f.id)}
                >
                  <Icon size={13} style={{ verticalAlign: '-2px', marginRight: '4px' }} /> 
                  {f.label}
                </span>
              );
            })}
          </div>

          <div className={styles.reservationsContainer}>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((res, idx) => (
                <div key={idx} className={styles.resCard}>
                  <div className={styles.resIcon}>
                    {getServiceIcon(res.type)}
                  </div>
                  <div className={styles.resInfo}>
                    <div className={styles.resTitle}>{res.name || res.title || res.aerolinea || 'Reserva'}</div>
                    <div className={styles.resMeta}>
                      <span><MapPin size={12} style={{marginRight: '4px'}}/> {res.location || trip.destination}</span>
                      <span><Calendar size={12} style={{marginRight: '4px'}}/> {res.date || res.startDate || trip.startDate}</span>
                    </div>
                  </div>
                  <span className={styles.resPrice}>
                    ${res.price || res.precio || res.precioNoche || res.precioDia || 0}
                  </span>
                  <span className={styles.resStatus}>Confirmado</span>
                  <PDFDownloadLink
                    document={<ReservationReceiptPDF reservation={res} tripTitle={trip.title} />}
                    fileName={`comprobante_${(res.name || res.title || res.aerolinea || 'reserva').replace(/\s+/g, '_')}.pdf`}
                    style={{ textDecoration: 'none', marginLeft: 'auto', marginRight: '5px' }}
                  >
                    {({ loading }) => (
                      <button className={styles.resDeleteBtn} style={{ color: 'var(--accent-blue)' }} title="Descargar comprobante" disabled={loading}>
                        {loading ? <Loader2 size={14} className={styles.spinner} /> : <Download size={14} />}
                      </button>
                    )}
                  </PDFDownloadLink>
                  <button className={styles.resDeleteBtn} aria-label="Cancelar reserva">
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}><Folder size={24} /></div>
                <p className={styles.emptyText}>Aún no tienes reservas aquí</p>
                <div className={styles.addButtonsRow}>
                  <button onClick={() => handleAddService('vuelo')} className={styles.addBtnSm}><Plane size={14}/> Añadir Vuelo</button>
                  <button onClick={() => handleAddService('hotel')} className={styles.addBtnSm}><Bed size={14}/> Añadir Hotel</button>
                  <button onClick={() => handleAddService('auto')} className={styles.addBtnSm}><Car size={14}/> Añadir Vehículo</button>
                  <button onClick={() => handleAddService('restaurante')} className={styles.addBtnSm}><Utensils size={14}/> Añadir Restaurante</button>
                  <button onClick={() => handleAddService('actividad')} className={styles.addBtnSm}><Briefcase size={14}/> Añadir Actividad</button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.tipsSectionTitle}>Consejos para tu viaje a {trip.destination || 'tu destino'}</div>
          <div className={styles.tipsGrid}>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}><FileText size={16} /></div>
              <div className={styles.tipTitle}>Visa y documentos</div>
              <div className={styles.tipDesc}>Verifica los requisitos de visa y validez de pasaporte para tu destino.</div>
            </div>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}><Coins size={16} /></div>
              <div className={styles.tipTitle}>Moneda</div>
              <div className={styles.tipDesc}>Lleva efectivo y revisa si tu tarjeta no cobra comisiones internacionales.</div>
            </div>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}><Cloud size={16} /></div>
              <div className={styles.tipTitle}>Clima en la fecha</div>
              <div className={styles.tipDesc}>Revisa el pronóstico para empacar adecuadamente.</div>
            </div>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}><Hand size={16} /></div>
              <div className={styles.tipTitle}>Cultura</div>
              <div className={styles.tipDesc}>Infórmate sobre costumbres locales para ser un viajero respetuoso.</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightCol}>
          
          <div className={styles.countdownWidget}>
            <div className={styles.widgetLabelLight}>Salida en</div>
            <div className={styles.countdownValue}>{getDaysUntil(trip.startDate)} días</div>
            <div className={styles.countdownDate}>{trip.startDate || 'Próximamente'}</div>
          </div>

          <div className={styles.budgetWidget}>
            <div className={styles.widgetLabel}>Gasto del viaje</div>
            <div className={styles.budgetValues}>
              <span className={styles.budgetSpent}>${totalSpent}</span>
              <span className={styles.budgetTotal}>de ${estimatedBudget}</span>
            </div>
            <div className={styles.progressBarBg}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${Math.min((totalSpent / estimatedBudget) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.weatherWidget}>
            <div className={styles.widgetLabel}>Clima aproximado</div>
            <div className={styles.weatherDays}>
              <div className={styles.weatherDay}>
                <div className={styles.dayLabel}>Mar</div>
                <Sun size={20} className={styles.sunIcon} />
                <div className={styles.tempLabel}>26°</div>
              </div>
              <div className={styles.weatherDay}>
                <div className={styles.dayLabel}>Mié</div>
                <Cloud size={20} className={styles.cloudIcon} />
                <div className={styles.tempLabel}>23°</div>
              </div>
              <div className={styles.weatherDay}>
                <div className={styles.dayLabel}>Jue</div>
                <CloudRain size={20} className={styles.cloudIcon} />
                <div className={styles.tempLabel}>21°</div>
              </div>
              <div className={styles.weatherDay}>
                <div className={styles.dayLabel}>Vie</div>
                <Sun size={20} className={styles.sunIcon} />
                <div className={styles.tempLabel}>25°</div>
              </div>
            </div>
          </div>

          <div className={styles.summaryWidget}>
            <div className={styles.widgetLabel}>Resumen</div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryRowLabel}><Ticket size={15} /> Reservas</span>
              <span className={styles.summaryRowValue}>{reservations.length}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryRowLabel}><MapPin size={15} /> Destinos</span>
              <span className={styles.summaryRowValue}>1</span>
            </div>
            <div className={styles.summaryRowNoBorder}>
              <span className={styles.summaryRowLabel}><CalendarDays size={15} /> Duración</span>
              <span className={styles.summaryRowValue}>
                {getDaysUntil(trip.endDate) !== '?' && getDaysUntil(trip.startDate) !== '?' 
                  ? (getDaysUntil(trip.endDate) - getDaysUntil(trip.startDate) + ' días') 
                  : '? días'}
              </span>
            </div>
          </div>

          <div className={styles.shareWidget}>
            <div className={styles.widgetLabel}>Compartir viaje</div>
            <div className={styles.avatarsRow}>
              <div className={styles.avatar} style={{ zIndex: 2 }}>M</div>
              <div className={styles.avatar} style={{ zIndex: 1, marginLeft: '-10px' }}>J</div>
              <span className={styles.avatarsText}>2 acompañantes</span>
            </div>
            <button className={styles.inviteBtn}>
              <UserPlus size={14} /> Invitar a alguien
            </button>
          </div>

          <button className={styles.mainAddBtn} onClick={() => handleAddService('vuelo')}>
            <Plus size={16} /> Agregar reserva
          </button>

          <PDFDownloadLink
            document={<TripItineraryPDF trip={trip} reservations={reservations} />}
            fileName={`itinerario_${trip.title.replace(/\s+/g, '_')}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <button className={styles.mainAddBtn} style={{ marginTop: '10px', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-soft)' }} disabled={loading}>
                {loading ? <Loader2 size={16} className={styles.spinner} /> : <FileText size={16} />} 
                {loading ? ' Generando PDF...' : ' Exportar Itinerario (PDF)'}
              </button>
            )}
          </PDFDownloadLink>

        </div>

      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Eliminar Viaje"
        message={`¿Estás seguro de que deseas eliminar el viaje "${trip.title}" y todo su contenido? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar viaje"
        cancelText="Cancelar"
        isDestructive={true}
        onConfirm={handleDeleteTrip}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Floating Ask IA Button */}
      {!isAiOpen && (
        <button 
          className={styles.floatingAiBtn}
          onClick={() => setIsAiOpen(true)}
          title="Modificar viaje con IA"
        >
          <Sparkles size={20} />
          <span>Ask IA</span>
        </button>
      )}

      {/* AI Drawer */}
      <div className={`${styles.aiDrawer} ${isAiOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <Sparkles size={18} className={styles.iconGold} />
            <h2>Modificador IA</h2>
          </div>
          <button className={styles.closeDrawerBtn} onClick={() => setIsAiOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.chatArea}>
          {chatHistory.length === 0 ? (
            <div className={styles.emptyChat}>
              <Sparkles size={40} className={styles.emptyIcon} />
              <h3>¿Qué quieres cambiar?</h3>
              <p>Dime qué reserva quieres cambiar y buscaré una alternativa. (Ej: "Cámbiame el vuelo por uno de KLM")</p>
            </div>
          ) : (
            <div className={styles.messageList}>
              {chatHistory.map((msg, index) => (
                <div key={index} className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageRowUser : styles.messageRowAi}`}>
                  {msg.role === 'ai' && (
                    <div className={styles.avatarAi}>
                      <Sparkles size={16} />
                    </div>
                  )}
                  <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}>
                    {msg.text}
                    {msg.modification && (
                      <ModificationCard 
                        modification={msg.modification}
                        currentReservations={reservations}
                        onConfirm={handleConfirmReplacement}
                        onCancel={() => handleCancelModification(index)}
                        isReplacing={isReplacing}
                      />
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={`${styles.messageRow} ${styles.messageRowAi}`}>
                  <div className={styles.avatarAi}>
                    <Sparkles size={16} />
                  </div>
                  <div className={`${styles.messageBubble} ${styles.bubbleAi}`}>
                    <Loader2 className={styles.spinner} size={14} /> Buscando alternativas...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.inputArea}>
          <form onSubmit={handleAiSend} className={styles.chatForm}>
            <input 
              type="text" 
              placeholder="Escribe tu modificación..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.chatInput}
            />
            <button type="submit" className={styles.sendBtn} disabled={!query.trim() || isTyping}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default DetalleViaje;
