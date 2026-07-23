import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, X, Navigation, Briefcase, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReservationReceipt from '../../pdf/ReservationReceipt';
import { ROUTES } from '../../../constants/routes';
import styles from './ReservationModal.module.css';

const ReservationModal = ({ isOpen, onClose, title, message, reservationData, user }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToDashboard = () => {
    onClose();
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className={styles.iconContainer}>
          <CheckCircle size={48} className={styles.successIcon} />
        </div>
        
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        
        <div className={styles.buttonGroup}>
          <button className={styles.secondaryBtn} onClick={onClose}>
            <Navigation size={18} />
            Seguir explorando
          </button>
          <button className={styles.primaryBtn} onClick={handleGoToDashboard}>
            <Briefcase size={18} />
            Ver mi reserva
          </button>
        </div>

        {reservationData && (
          <div className={styles.pdfButtonWrapper}>
            <PDFDownloadLink
              document={
                <ReservationReceipt
                  reservation={reservationData}
                  userName={user?.displayName || user?.email || 'Viajero TipPlan'}
                  userEmail={user?.email || 'N/A'}
                />
              }
              fileName={`comprobante-${reservationData.id?.slice(0, 8) || 'reserva'}.pdf`}
              className={styles.pdfDownloadBtn}
            >
              {({ loading }) => (
                <>
                  <Download size={16} />
                  {loading ? 'Generando...' : 'Descargar Comprobante'}
                </>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationModal;
