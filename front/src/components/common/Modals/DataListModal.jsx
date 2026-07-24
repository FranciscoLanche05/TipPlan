import React, { useEffect } from 'react';
import { X, Calendar, MapPin, DollarSign } from 'lucide-react';
import styles from './DataListModal.module.css';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import MetricsDashboard from './MetricsDashboard';

const DataListModal = ({ isOpen, onClose, title, data, type, trips }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.setProperty('overflow', 'hidden', 'important');
      document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (!data || data.length === 0) {
      return (
        <div className={styles.emptyState}>
          <p>No hay información disponible para mostrar.</p>
        </div>
      );
    }

    if (type === 'trips') {
      return (
        <div className={styles.listContainer}>
          {data.map((trip) => (
            <div key={trip.id} className={styles.listItem} onClick={() => navigate(ROUTES.DETALLE_VIAJE.replace(':id', trip.id))}>
              <div className={styles.itemHeader}>
                <h4>{trip.title || 'Viaje sin nombre'}</h4>
                <span className={styles.statusBadge}>Activo</span>
              </div>
              <div className={styles.itemDetails}>
                <div className={styles.detailRow}><MapPin size={14} /> {trip.destination || 'Por definir'}</div>
                <div className={styles.detailRow}><Calendar size={14} /> {trip.startDate || 'Fechas abiertas'}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'all_expenses') {
      return <MetricsDashboard data={data} trips={trips} />;
    }

    if (type === 'reservations') {
      return (
        <div className={styles.listContainer}>
          {data.map((res, index) => {
            const priceStr = res.price || res.precio || res.precioNoche || res.precioDia || 0;
            const num = parseFloat(String(priceStr).replace(/[^\d.-]/g, ''));
            const price = isNaN(num) ? 0 : num;

            return (
              <div key={res.id || index} className={styles.listItem}>
                <div className={styles.itemHeader}>
                  <h4>{res.name || res.title || res.aerolinea || 'Reserva'}</h4>
                  <span className={styles.priceTag}>${price.toLocaleString('en-US')}</span>
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.detailRow}><MapPin size={14} /> {res.location || 'Locación no especificada'}</div>
                  <div className={styles.detailRow}>
                    <Calendar size={14} /> {res.date || res.startDate || 'Fechas abiertas'} 
                    {res.type && <span className={styles.typeTag}> • {res.type}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (type === 'itinerary') {
      const trip = data.trip;
      const acts = data.activities || [];
      return (
        <div className={styles.itineraryContainer}>
          <div className={styles.itineraryHeader}>
            <div className={styles.itineraryTitle}>{trip.title}</div>
            <div className={styles.itineraryDest}><MapPin size={16}/> {trip.location}</div>
            <div className={styles.itineraryDates}>
              <Calendar size={16}/> {trip.dateStr}
            </div>
          </div>
          
          <h4 className={styles.sectionTitle}>Actividades Programadas ({acts.length})</h4>
          {acts.length > 0 ? (
            <div className={styles.listContainer}>
              {acts.map((act, i) => (
                <div key={i} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <h4>{act.name || act.title || 'Actividad'}</h4>
                    <span className={styles.statusBadge}>Confirmado</span>
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.detailRow}><MapPin size={14} /> {act.location || trip.location}</div>
                    <div className={styles.detailRow}><Calendar size={14} /> {act.date || act.startDate || trip.dateStr}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No has programado actividades para este viaje.</p>
          )}
          
          <button className={styles.actionBtn} onClick={() => navigate(ROUTES.DETALLE_VIAJE.replace(':id', trip.id))}>
            Ir a los detalles del viaje
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        style={type === 'all_expenses' ? { maxWidth: '95vw', width: '100%', maxHeight: '95vh' } : {}}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.body}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DataListModal;
