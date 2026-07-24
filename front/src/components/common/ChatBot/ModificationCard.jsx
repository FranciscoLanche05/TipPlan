import React, { useState } from 'react';
import { RefreshCw, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { vuelosRealistas, hotelesRealistas, restaurantesRealistas, autosRealistas } from '../../../services/datos/serviciosData';
import styles from './ModificationCard.module.css';

export default function ModificationCard({ modification, currentReservations, onConfirm, onCancel, isReplacing }) {
  if (!modification || !modification.hasModification) return null;

  // Encontrar la reserva vieja (el documento de firestore en la RAM actual)
  const oldRes = currentReservations.find(r => r.id === modification.oldReservationId);
  
  // Encontrar el servicio nuevo del catálogo
  let newServiceData = null;
  if (modification.type === 'vuelo') newServiceData = vuelosRealistas.find(v => v.id === modification.newServiceId);
  if (modification.type === 'hotel') newServiceData = hotelesRealistas.find(h => h.id === modification.newServiceId);
  if (modification.type === 'restaurante') newServiceData = restaurantesRealistas.find(r => r.id === modification.newServiceId);
  if (modification.type === 'auto') newServiceData = autosRealistas.find(a => a.id === modification.newServiceId);

  if (!oldRes || !newServiceData) return <div className={styles.errorText}>No se pudo cargar la comparación de reservas.</div>;

  const oldName = oldRes.data?.aerolinea || oldRes.data?.nombre || oldRes.data?.modelo || "Reserva anterior";
  const newName = newServiceData.aerolinea || newServiceData.nombre || newServiceData.modelo;
  
  const oldPrice = oldRes.price || oldRes.data?.precio || oldRes.data?.precioNoche || oldRes.data?.precioPromedio || oldRes.data?.precioDia || "$0";
  const newPrice = newServiceData.precio || newServiceData.precioNoche || newServiceData.precioPromedio || newServiceData.precioDia;

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <RefreshCw size={16} className={styles.iconBlue} />
        <h3>Propuesta de Cambio</h3>
      </div>
      
      <div className={styles.cardBody}>
        {/* Old item */}
        <div className={styles.itemOld}>
          <div className={styles.itemMeta}>
            <span className={styles.badgeOld}>Actual</span>
            <span className={styles.title}>{oldName}</span>
          </div>
          <span className={styles.priceOld}>${oldPrice}</span>
        </div>

        <div className={styles.arrowDivider}>
          <ArrowRight size={18} />
        </div>

        {/* New item */}
        <div className={styles.itemNew}>
          <div className={styles.itemMeta}>
            <span className={styles.badgeNew}>Nuevo</span>
            <span className={styles.title}>{newName}</span>
          </div>
          <span className={styles.priceNew}>${newPrice}</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button 
          className={styles.cancelBtn} 
          onClick={onCancel}
          disabled={isReplacing}
        >
          Descartar
        </button>
        <button 
          className={styles.confirmBtn} 
          onClick={() => onConfirm(oldRes.id, modification.type, newServiceData)}
          disabled={isReplacing}
        >
          {isReplacing ? (
            <>
              <Loader2 size={16} className={styles.spinner} />
              Reemplazando...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Aceptar Cambio
            </>
          )}
        </button>
      </div>
    </div>
  );
}
