import styles from './Budget.module.css';
import { useBudgetCalculator } from '../../../hooks/useBudgetCalculator';
import { destinationsData } from '../../../services/datos/destinations';

export default function BudgetForm() {
  const {
    budget,
    duration,
    destination,
    name,
    email,
    travelDate,
    handleBudgetChange,
    handleDurationChange,
    handleDestinationChange,
    handleNameChange,
    handleEmailChange,
    handleTravelDateChange,
    handleSubmit
  } = useBudgetCalculator();

  return (
    <form className={styles.budgetForm}>
      <div className={styles.formHeader}>
        <h2>Cuéntanos tu aventura</h2>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="name">NOMBRE</label>
          <input
            id="name"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">CORREO</label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="destination">¿A DÓNDE QUIERES IR?</label>
        <select
          id="destination"
          value={destination}
          onChange={(e) => handleDestinationChange(e.target.value)}
          className={styles.select}
        >
          <option value="">Selecciona un destino...</option>
          {destinationsData.map((dest) => (
            <option key={dest.id} value={dest.name}>
              {dest.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="travelDate">FECHA DE VIAJE</label>
          <input
            id="travelDate"
            type="date"
            value={travelDate}
            onChange={(e) => handleTravelDateChange(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="duration">DURACIÓN</label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => handleDurationChange(e.target.value)}
            className={styles.select}
          >
            <option value="1 - 3 días">1 - 3 días</option>
            <option value="4 - 7 días">4 - 7 días</option>
            <option value="1 - 2 semanas">1 - 2 semanas</option>
            <option value="2 - 4 semanas">2 - 4 semanas</option>
            <option value="1+ mes">1+ mes</option>
          </select>
        </div>
      </div>

      <div className={styles.budgetSection}>
        <label>PRESUPUESTO ESTIMADO (USD)</label>
        <div className={styles.sliderContainer}>
          <span className={styles.minValue}>$100</span>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={budget}
            onChange={(e) => handleBudgetChange(Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.maxValue}>$5,000</span>
        </div>
        <div className={styles.budgetDisplay}>
          <span className={styles.budgetValue}>${budget}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className={styles.submitButton}
      >
        Enviar mi plan de viaje +
      </button>
    </form>
  );
}
