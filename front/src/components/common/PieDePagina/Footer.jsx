import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          {/* Columna 1: Branding */}
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>Tip<span>Plan</span></div>
            <p className={styles.footerDesc}>
              Tu plataforma completa para planificar viajes en Ecuador con confianza y seguridad.
            </p>
            <div className={styles.footerSocials}>
              <a href="#" className={styles.socialLink} title="Facebook">f</a>
              <a href="#" className={styles.socialLink} title="Twitter">𝕏</a>
              <a href="#" className={styles.socialLink} title="Instagram">📷</a>
              <a href="#" className={styles.socialLink} title="LinkedIn">in</a>
            </div>
          </div>

          {/* Columna 2: Explorar */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Explorar</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#destinos">Destinos</a></li>
              <li><a href="#experiencias">Planificador de viajes</a></li>
              <li><a href="#mapa">Mapa del mundo</a></li>
              <li><a href="#presupuesto">Calculadora de presupuesto</a></li>
            </ul>
          </div>

          {/* Columna 3: Comunidad */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Comunidad</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#comunidad">Reseñas</a></li>
              <li><a href="#comunidad">Foros</a></li>
              <li><a href="#comunidad">Consejos de viajeros</a></li>
              <li><a href="#blog">Blog de viajes</a></li>
            </ul>
          </div>

          {/* Columna 4: Soporte */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Soporte</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#contacto">Contacto</a></li>
              <li><a href="#">Preguntas frecuentes</a></li>
              <li><a href="#">Centro de ayuda</a></li>
              <li><a href="#">Reportar problema</a></li>
            </ul>
          </div>

          {/* Columna 5: Legal */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Legal</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#">Términos de servicio</a></li>
              <li><a href="#">Política de privacidad</a></li>
              <li><a href="#">Política de cookies</a></li>
              <li><a href="#">Aviso legal</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.footerDivider}></div>
          <div className={styles.footerBottomContent}>
            <p className={styles.footerCopyright}>
              &copy; 2026 TipPlan. Todos los derechos reservados.
            </p>
            <p className={styles.footerTagline}>
              Hecho con 💚 para los viajeros de Ecuador
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
