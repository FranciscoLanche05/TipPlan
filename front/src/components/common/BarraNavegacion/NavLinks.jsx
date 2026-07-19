import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import { ROUTES } from "../../../constants/routes";
import {
  Info,
  MapPin,
  Globe,
  BookOpen,
  MessageCircle,
  Plane,
  Calendar,
  Settings,
} from "lucide-react";

// Enlaces de navegación con anclas a las secciones e íconos
const links = [
  { href: "#nosotros", label: "Nosotros", icon: Info },
  { href: "#destinos", label: "Destinos", icon: MapPin },
  { href: "#mapa", label: "Mundo", icon: Globe },
  { href: "#blog", label: "Blog", icon: BookOpen },
  { href: "#faq", label: "Contactos", icon: MessageCircle },
];

const NavLinks = ({ onClose }) => {
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (onClose) onClose();
  };

  return (
    <nav className={styles.sidebarNav}>
      {isAuthenticated && (
        <>
          <Link
            to={ROUTES.MIS_VIAJES}
            className={styles.sidebarLink}
            onClick={handleClick}
            style={{ textDecoration: "none" }}
          >
            <Plane size={20} />
            <span>Mis viajes</span>
          </Link>
          <Link
            to={ROUTES.RESERVAS}
            className={styles.sidebarLink}
            onClick={handleClick}
            style={{ textDecoration: "none" }}
          >
            <Calendar size={20} />
            <span>Reservas</span>
          </Link>
          <Link
            to={ROUTES.CONFIGURACION}
            className={styles.sidebarLink}
            onClick={handleClick}
            style={{ textDecoration: "none" }}
          >
            <Settings size={20} />
            <span>Configuración de cuenta</span>
          </Link>
        </>
      )}

      <div className={styles.sidebarDivider} />

      {links.map((link) => {
        const IconComponent = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            className={styles.sidebarLink}
            onClick={handleClick}
          >
            <IconComponent size={20} />
            <span>{link.label}</span>
          </a>
        );
      })}
    </nav>
  );
};

export default NavLinks;
