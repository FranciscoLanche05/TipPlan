import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Planificador.module.css';
import { Calendar, Map, Wallet, CheckCircle, ArrowRight, Plane, Coffee, Navigation } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const Planificador = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState({
    destinations: [],
    dates: '',
    budget: '',
    travelStyle: ''
  });

  const availableDestinations = [
    "Islas Galápagos", "Parque Nacional Cotopaxi", "Quito (Centro Histórico)",
    "Amazonía (Cuyabeno)", "Baños de Agua Santa", "Cuenca", "Ruta del Spondylus"
  ];

  const handleDestinationToggle = (dest) => {
    setPlan(prev => {
      const isSelected = prev.destinations.includes(dest);
      if (isSelected) {
        return { ...prev, destinations: prev.destinations.filter(d => d !== dest) };
      } else {
        return { ...prev, destinations: [...prev.destinations, dest] };
      }
    });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSavePlan = () => {
    // Aquí iría la lógica para guardar el plan en el backend o en el estado global
    // Por ahora, simulamos y redirigimos a Mis Viajes
    alert("¡Tu plan de aventura ha sido guardado exitosamente!");
    navigate(ROUTES.MIS_VIAJES);
  };

  return (
    <div className={styles.planificadorPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Planificador de Aventura</h1>
          <p>Diseña tu viaje ideal por Ecuador paso a paso.</p>
        </div>

        <div className={styles.stepper}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
            <div className={styles.stepIcon}><Map size={20} /></div>
            <span>Destinos</span>
          </div>
          <div className={styles.stepDivider}></div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
            <div className={styles.stepIcon}><Wallet size={20} /></div>
            <span>Estilo & Presupuesto</span>
          </div>
          <div className={styles.stepDivider}></div>
          <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
            <div className={styles.stepIcon}><CheckCircle size={20} /></div>
            <span>Resumen</span>
          </div>
        </div>

        <div className={styles.card}>
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2>¿Qué lugares quieres explorar?</h2>
              <p className={styles.subtitle}>Selecciona uno o varios destinos para tu itinerario.</p>
              
              <div className={styles.destinationGrid}>
                {availableDestinations.map((dest, idx) => (
                  <button 
                    key={idx} 
                    className={`${styles.destOption} ${plan.destinations.includes(dest) ? styles.selected : ''}`}
                    onClick={() => handleDestinationToggle(dest)}
                  >
                    {plan.destinations.includes(dest) && <CheckCircle size={16} className={styles.checkIcon}/>}
                    {dest}
                  </button>
                ))}
              </div>

              <div className={styles.inputGroup}>
                <label><Calendar size={18} /> ¿Cuándo planeas viajar?</label>
                <input 
                  type="month" 
                  className={styles.inputField}
                  value={plan.dates}
                  onChange={(e) => setPlan({...plan, dates: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent}>
              <h2>Define tu estilo de viaje</h2>
              
              <div className={styles.inputGroup}>
                <label>Presupuesto estimado (por persona)</label>
                <div className={styles.optionsRow}>
                  {['Mochilero ($)', 'Estándar ($$)', 'Lujo ($$$)'].map(b => (
                    <button 
                      key={b}
                      className={`${styles.optionBtn} ${plan.budget === b ? styles.selected : ''}`}
                      onClick={() => setPlan({...plan, budget: b})}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Ritmo del viaje</label>
                <div className={styles.optionsRow}>
                  {['Relajado', 'Intermedio', 'Acelerado (Ver todo)'].map(s => (
                    <button 
                      key={s}
                      className={`${styles.optionBtn} ${plan.travelStyle === s ? styles.selected : ''}`}
                      onClick={() => setPlan({...plan, travelStyle: s})}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContent}>
              <h2>Resumen de tu Itinerario</h2>
              <div className={styles.summaryBox}>
                <div className={styles.summaryItem}>
                  <Navigation className={styles.summaryIcon}/>
                  <div>
                    <strong>Destinos seleccionados:</strong>
                    <p>{plan.destinations.length > 0 ? plan.destinations.join(", ") : "Ninguno"}</p>
                  </div>
                </div>
                <div className={styles.summaryItem}>
                  <Calendar className={styles.summaryIcon}/>
                  <div>
                    <strong>Fecha:</strong>
                    <p>{plan.dates || "Por definir"}</p>
                  </div>
                </div>
                <div className={styles.summaryItem}>
                  <Wallet className={styles.summaryIcon}/>
                  <div>
                    <strong>Presupuesto:</strong>
                    <p>{plan.budget || "Por definir"}</p>
                  </div>
                </div>
                <div className={styles.summaryItem}>
                  <Coffee className={styles.summaryIcon}/>
                  <div>
                    <strong>Estilo de viaje:</strong>
                    <p>{plan.travelStyle || "Por definir"}</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.aiSuggestion}>
                <Plane size={24} className={styles.aiIcon}/>
                <div>
                  <strong>Sugerencia de Inteligencia Artificial</strong>
                  <p>Basado en tu presupuesto {plan.budget} y ritmo {plan.travelStyle}, te recomendamos reservar las experiencias con al menos 2 meses de anticipación. Guardaremos esto en "Mis Viajes" para que puedas organizar las reservas paso a paso.</p>
                </div>
              </div>
            </div>
          )}

          <div className={styles.footer}>
            {step > 1 ? (
              <button className={styles.backBtn} onClick={handlePrev}>Atrás</button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button 
                className={styles.nextBtn} 
                onClick={handleNext}
                disabled={step === 1 && plan.destinations.length === 0}
              >
                Siguiente <ArrowRight size={18} />
              </button>
            ) : (
              <button className={styles.saveBtn} onClick={handleSavePlan}>
                Guardar e ir a Mis Viajes <CheckCircle size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planificador;
