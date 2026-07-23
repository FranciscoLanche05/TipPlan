import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { ROUTES } from "../../../../constants/routes";
import styles from "./UserDropdown.module.css";
import {
  User,
  Lock,
  Heart,
  Clock,
  Briefcase,
  Search,
  Bell,
  Globe,
  HelpCircle,
  Building,
  LogOut,
  ChevronRight,
  Plane,
  Bed,
  Car,
  Utensils,
  Compass
} from "lucide-react";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Usuario';
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      {/* Botón (User Pill) */}
      <button className={styles.userButton} onClick={toggleDropdown}>
        <div className={styles.avatar}>{initial}</div>
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.header}>
            <span className={styles.greeting}>Hola de nuevo, {displayName}</span>
            <ChevronRight size={16} className={styles.chevron} />
          </div>


          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Cuenta</h4>
            <Link to={`${ROUTES.CONFIGURACION}/perfil`} className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <User size={18} />
              <span>Información personal</span>
            </Link>
            <Link to={`${ROUTES.CONFIGURACION}/seguridad`} className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <Lock size={18} />
              <span>Seguridad de la cuenta</span>
            </Link>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Mis viajes</h4>
            <Link to={`${ROUTES.CONFIGURACION}/favoritos`} className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <Heart size={18} />
              <span>Favoritos</span>
            </Link>
            <Link to={`${ROUTES.CONFIGURACION}/recientes`} className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <Clock size={18} />
              <span>Vistos recientemente</span>
            </Link>
            <Link to={ROUTES.RESERVAS} className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <Briefcase size={18} />
              <span>Reservas</span>
            </Link>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Preferencias</h4>
            <Link to={`${ROUTES.CONFIGURACION}/busqueda`} className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <Search size={18} />
              <span>Preferencias de búsqueda</span>
            </Link>
            <Link to={`${ROUTES.CONFIGURACION}/notificaciones`} className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <Bell size={18} />
              <span>Notificaciones</span>
            </Link>
            <Link to={`${ROUTES.CONFIGURACION}/idioma`} className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <Globe size={18} />
              <span>Idioma y moneda</span>
            </Link>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Ayuda</h4>
            <Link to={`${ROUTES.CONFIGURACION}/ayuda`} className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <HelpCircle size={18} />
              <span>Ayuda</span>
            </Link>
            <Link to={`${ROUTES.CONFIGURACION}/empresas`} className={styles.menuItem} onClick={() => setIsOpen(false)}>
              <Building size={18} />
              <span>TipPlan para agencias</span>
            </Link>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <LogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
