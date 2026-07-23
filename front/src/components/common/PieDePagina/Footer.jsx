import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../../contexts/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { X } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBodyText, setModalBodyText] = useState('');

  const genericContent = {
    "Contacto": "Puedes contactarnos enviando un correo a soporte@tipplan.com o llamando al +593 99 999 9999. Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00.",
    "Preguntas Frecuentes": "1. ¿Cómo creo un itinerario?\n2. ¿Cuáles son los métodos de pago?\n3. ¿Cómo modifico mi perfil?\n(Respuestas detalladas estarán disponibles en la versión final).",
    "Centro de Ayuda": "Encuentra tutoriales, guías paso a paso y artículos de soporte para aprovechar al máximo TipPlan. (Sección en construcción).",
    "Reportar Problema": "Si experimentas problemas técnicos, por favor escríbenos a bugs@tipplan.com adjuntando capturas de pantalla y una descripción del error.",
    "Términos de Servicio": "Al utilizar TipPlan, aceptas nuestros términos de servicio. Eres responsable de mantener la confidencialidad de tu cuenta y de la exactitud de los datos en tus planificaciones.",
    "Política de Privacidad": "Respetamos tu privacidad. Tus datos personales y la información de tus viajes se almacenan de forma segura y nunca se comparten con terceros sin tu consentimiento.",
    "Política de Cookies": "Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies analíticas para mejorar tu experiencia. Puedes administrarlas desde tu navegador.",
    "Aviso Legal": "TipPlan actúa como una plataforma tecnológica para planificar viajes. Los servicios turísticos reales son responsabilidad de los proveedores finales de cada destino.",
    "Redes Sociales": "¡Síguenos en nuestras redes sociales oficiales para descubrir los mejores tips de viaje por Ecuador y las últimas novedades de la plataforma!"
  };

  const handleAuthNavigation = (e, route) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(route);
    } else {
      openLoginModal();
    }
  };

  const handleComingSoon = (e, title, isSocial = false) => {
    e.preventDefault();
    setModalTitle(title);
    setModalBodyText(isSocial ? genericContent["Redes Sociales"] : (genericContent[title] || "Esta sección se encuentra en desarrollo. ¡Pronto estará disponible!"));
    setShowModal(true);
  };

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
              <a href="#" className={styles.socialLink} onClick={(e) => handleComingSoon(e, "Facebook", true)} title="Facebook" aria-label="Ir a Facebook">f</a>
              <a href="#" className={styles.socialLink} onClick={(e) => handleComingSoon(e, "Twitter", true)} title="Twitter" aria-label="Ir a Twitter">𝕏</a>
              <a href="#" className={styles.socialLink} onClick={(e) => handleComingSoon(e, "Instagram", true)} title="Instagram" aria-label="Ir a Instagram">📷</a>
              <a href="#" className={styles.socialLink} onClick={(e) => handleComingSoon(e, "LinkedIn", true)} title="LinkedIn" aria-label="Ir a LinkedIn">in</a>
            </div>
          </div>

          {/* Columna 2: Servicios */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Servicios</h4>
            <ul className={styles.footerLinks}>
              <li><a href={ROUTES.VUELOS} onClick={(e) => handleAuthNavigation(e, ROUTES.VUELOS)}>Vuelos</a></li>
              <li><a href={ROUTES.HOTELES} onClick={(e) => handleAuthNavigation(e, ROUTES.HOTELES)}>Hoteles</a></li>
              <li><a href={ROUTES.AUTOS} onClick={(e) => handleAuthNavigation(e, ROUTES.AUTOS)}>Autos</a></li>
              <li><a href={ROUTES.RESTAURANTES} onClick={(e) => handleAuthNavigation(e, ROUTES.RESTAURANTES)}>Restaurantes</a></li>
              <li><a href={ROUTES.ACTIVIDADES} onClick={(e) => handleAuthNavigation(e, ROUTES.ACTIVIDADES)}>Actividades</a></li>
            </ul>
          </div>

          {/* Columna 3: Viajes */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Mis Viajes</h4>
            <ul className={styles.footerLinks}>
              <li><a href={ROUTES.DASHBOARD} onClick={(e) => handleAuthNavigation(e, ROUTES.DASHBOARD)}>Dashboard</a></li>
              <li><a href={ROUTES.MIS_VIAJES} onClick={(e) => handleAuthNavigation(e, ROUTES.MIS_VIAJES)}>Ver mis viajes</a></li>
              <li><a href={ROUTES.NUEVO_VIAJE} onClick={(e) => handleAuthNavigation(e, ROUTES.NUEVO_VIAJE)}>Nuevo Viaje</a></li>
            </ul>
          </div>

          {/* Columna 4: Soporte */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Soporte</h4>
            <ul className={styles.footerLinks}>
              <li><a href="/#faq">Contacto</a></li>
              <li><a href="/#faq">Preguntas frecuentes</a></li>
              <li><a href="/#faq">Centro de ayuda</a></li>
              <li><a href="#" onClick={(e) => handleComingSoon(e, "Reportar Problema")}>Reportar problema</a></li>
            </ul>
          </div>

          {/* Columna 5: Legal */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Legal</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#" onClick={(e) => handleComingSoon(e, "Términos de Servicio")}>Términos de servicio</a></li>
              <li><a href="#" onClick={(e) => handleComingSoon(e, "Política de Privacidad")}>Política de privacidad</a></li>
              <li><a href="#" onClick={(e) => handleComingSoon(e, "Política de Cookies")}>Política de cookies</a></li>
              <li><a href="#" onClick={(e) => handleComingSoon(e, "Aviso Legal")}>Aviso legal</a></li>
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

      {/* Modal Coming Soon */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)} aria-label="Cerrar modal">
              <X size={24} />
            </button>
            <h2 className={styles.modalTitle}>{modalTitle}</h2>
            <div className={styles.modalBody}>
              <p style={{ whiteSpace: 'pre-line' }}>{modalBodyText}</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
