import React, { useState } from 'react';
import { CreditCard, Lock, X, Loader2, CheckCircle } from 'lucide-react';
import styles from './PaymentGatewayModal.module.css';

export default function PaymentGatewayModal({ isOpen, onClose, totalAmount, onConfirmPayment }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate network delay for payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Delay before closing to show success state
      setTimeout(() => {
        setIsSuccess(false);
        onConfirmPayment();
      }, 1500);
    }, 2000);
  };

  // Basic formatting helpers
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    const formatted = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted.slice(0, 19));
  };

  const handleExpiryChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      setExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
    } else {
      setExpiry(val);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        
        {isSuccess ? (
          <div className={styles.successState}>
            <CheckCircle size={64} className={styles.successIcon} />
            <h2>¡Pago Aprobado!</h2>
            <p>Tus reservas están siendo confirmadas...</p>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <div className={styles.headerTitle}>
                <CreditCard size={24} />
                <h2>Completar Reserva</h2>
              </div>
              <button className={styles.closeBtn} onClick={onClose} disabled={isProcessing}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.orderSummary}>
                <span>Total a Pagar</span>
                <span className={styles.totalAmount}>${totalAmount.toFixed(2)}</span>
              </div>

              <form onSubmit={handleSubmit} className={styles.paymentForm}>
                <div className={styles.inputGroup}>
                  <label>Nombre en la tarjeta</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Número de Tarjeta</label>
                  <div className={styles.cardInputWrapper}>
                    <input 
                      type="text" 
                      required 
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      disabled={isProcessing}
                    />
                    <CreditCard size={18} className={styles.inputIcon} />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Vencimiento (MM/AA)</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="MM/AA"
                      value={expiry}
                      onChange={handleExpiryChange}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>CVC</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="123"
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className={styles.secureBadge}>
                  <Lock size={14} />
                  <span>Pago seguro encriptado de 256 bits</span>
                </div>

                <button type="submit" className={styles.payBtn} disabled={isProcessing || cardNumber.length < 19 || expiry.length < 5 || cvc.length < 3 || !name}>
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className={styles.spinner} />
                      Procesando...
                    </>
                  ) : (
                    `Pagar $${totalAmount.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
