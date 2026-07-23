import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById, getUserReservations, updateTrip, deleteTrip } from '@back/services/firestoreService';
import { ROUTES } from '../../constants/routes';
import { 
  ArrowLeft, Folder, Pencil, Calendar, Plane, Bed, Briefcase, MapPin, 
  X, FileText, Coins, Cloud, Hand, Sun, CloudRain, Ticket, CalendarDays, 
  UserPlus, Plus, Car, Utensils, Loader2, Trash2, Save
} from 'lucide-react';
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
    { id: 'vehiculo', icon: Car, label: 'Vehículos' },
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
      case 'vehiculo': route = ROUTES.AUTOS; break;
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
      case 'vehiculo': return <Car size={18} />;
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
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '18px', fontWeight: 'bold' }}
                  placeholder="Título"
                />
                <input 
                  type="date" 
                  value={editTripData.startDate}
                  onChange={e => setEditTripData({...editTripData, startDate: e.target.value})}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <input 
                  type="date" 
                  value={editTripData.endDate}
                  onChange={e => setEditTripData({...editTripData, endDate: e.target.value})}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <button onClick={handleUpdateTrip} style={{ padding: '8px 12px', background: '#166534', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Save size={14}/> Guardar</button>
                <button onClick={() => setIsEditingTrip(false)} style={{ padding: '8px 12px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
              </div>
            ) : (
              <div className={styles.titleTextGroup}>
                <span className={styles.titleText}>{trip.title}</span>
                <button onClick={() => setIsEditingTrip(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
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
                  <button onClick={() => handleAddService('vehiculo')} className={styles.addBtnSm}><Car size={14}/> Añadir Vehículo</button>
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

    </div>
  );
};

export default DetalleViaje;
