import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar", isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onCancel}>
          <X size={20} />
        </button>
        
        <div className={styles.iconContainer} style={{ color: isDestructive ? '#ef4444' : '#f4a02c', backgroundColor: isDestructive ? '#fef2f2' : '#fefce8' }}>
          <AlertTriangle size={28} />
        </div>
        
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>
          <button 
            className={isDestructive ? styles.confirmBtnDestructive : styles.confirmBtn} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
