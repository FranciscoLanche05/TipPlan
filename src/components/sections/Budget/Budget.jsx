import styles from './Budget.module.css';
import BudgetForm from './BudgetForm';
import SectionTag from '../../ui/SectionTag/SectionTag';

export default function Budget() {
  return (
    <section className={styles.budgetSection} id="budget">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftContent}>
            <SectionTag>PLANIFICADOR</SectionTag>
            <h1 className={styles.title}>
              Diseña tu viaje <span className={styles.highlight}>perfecto</span>
            </h1>
            <p className={styles.description}>
              Cuéntanos tus preferencias y nosotros te orientamos hacia la aventura ideal.
            </p>

            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📅</div>
                <div>
                  <h3>Itinerario personalizado</h3>
                  <p>Generamos un plan día a día adaptado a tu tiempo disponible y estilo de viaje.</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>💰</div>
                <div>
                  <h3>Control de presupuesto</h3>
                  <p>Te ayudamos a distribuir tu presupuesto de forma inteligente sin sacrificar experiencias.</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📱</div>
                <div>
                  <h3>Acceso desde tu móvil</h3>
                  <p>Próximamente disponible en Google Play y App Store para llevar tu itinerario en el bolsillo.</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>❤️</div>
                <div>
                  <h3>Asesoría personalizada</h3>
                  <p>Nuestro equipo revisa tu plan y te da recomendaciones basadas en experiencia real de viaje.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightContent}>
            <BudgetForm />
          </div>
        </div>
      </div>
    </section>
  );
}
