import React from 'react';
import { Plane, Hotel, Utensils, Car, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { vuelosRealistas, hotelesRealistas, restaurantesRealistas, autosRealistas } from '../../../services/datos/serviciosData';
import styles from './ItineraryCard.module.css';

export default function ItineraryCard({ itinerary, onConfirm, onCancel, isCreating }) {
  if (!itinerary) return null;

  // Buscar los detalles reales en los datos simulados basados en los IDs devueltos por la IA
  const flight = vuelosRealistas.find(v => v.id === itinerary.flightId);
  const hotel = hotelesRealistas.find(h => h.id === itinerary.hotelId);
  const restaurant = restaurantesRealistas.find(r => r.id === itinerary.restaurantId);
  const car = autosRealistas.find(a => a.id === itinerary.carId);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <div className={styles.headerTitle}>
          <MapPin size={18} className={styles.iconGold} />
          <h3>Aventura en {itinerary.destination || flight.destino}</h3>
        </div>
        <span className={styles.daysBadge}>{itinerary.days || 3} Días</span>
      </div>

      <div className={styles.cardBody}>
        {/* Vuelo */}
        {flight && (
          <div className={styles.itemRow}>
            <div className={styles.itemIconWrapper}>
              <Plane size={16} />
            </div>
            <div className={styles.itemDetails}>
              <p className={styles.itemTitle}>Vuelo con {flight.aerolinea}</p>
              <p className={styles.itemSub}>{flight.origen} ➔ {flight.destino}</p>
            </div>
            <div className={styles.itemPrice}>${flight.precio}</div>
          </div>
        )}

        {/* Hotel */}
        {hotel && (
          <div className={styles.itemRow}>
            <div className={styles.itemIconWrapper}>
              <Hotel size={16} />
            </div>
            <div className={styles.itemDetails}>
              <p className={styles.itemTitle}>{hotel.nombre}</p>
              <p className={styles.itemSub}>{hotel.estrellas} Estrellas • {hotel.ciudad}</p>
            </div>
            <div className={styles.itemPrice}>${hotel.precioNoche}/noche</div>
          </div>
        )}

        {/* Restaurante */}
        {restaurant && (
          <div className={styles.itemRow}>
            <div className={styles.itemIconWrapper}>
              <Utensils size={16} />
            </div>
            <div className={styles.itemDetails}>
              <p className={styles.itemTitle}>{restaurant.nombre}</p>
              <p className={styles.itemSub}>{restaurant.tipoComida} • {restaurant.ciudad}</p>
            </div>
            <div className={styles.itemPrice}>{restaurant.precioPromedio}</div>
          </div>
        )}

        {/* Auto */}
        {car && (
          <div className={styles.itemRow}>
            <div className={styles.itemIconWrapper}>
              <Car size={16} />
            </div>
            <div className={styles.itemDetails}>
              <p className={styles.itemTitle}>{car.modelo}</p>
              <p className={styles.itemSub}>{car.empresa} • {car.ciudad}</p>
            </div>
            <div className={styles.itemPrice}>${car.precioDia}/día</div>
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <button className={styles.cancelBtn} onClick={onCancel}>
          Descartar
        </button>
        <button 
          className={styles.confirmBtn} 
          onClick={onConfirm}
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              Creando Viaje...
            </>
          ) : (
            <>
              <CheckCircle size={18} />
              Crear Viaje y Reservar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
