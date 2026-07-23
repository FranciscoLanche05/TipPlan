import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { BorderBeam } from "@stianlarsen/border-beam";

import {
  Info,
  MapPin,
  Globe,
  BookOpen,
  MessageCircle,
  Plane,
  Calendar,
  Settings,
  LayoutDashboard,
  Bed,
  Car,
  Utensils,
  Compass,
  Sparkles
} from "lucide-react";

// Enlaces de navegación con anclas a las secciones e íconos
const links = [
  { href: "#nosotros", label: "Nosotros", icon: Info },
  { href: "#destinos", label: "Destinos", icon: MapPin },
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
            to={ROUTES.DASHBOARD}
            className={styles.sidebarLink}
            onClick={handleClick}
            style={{ textDecoration: "none" }}
          >
            <LayoutDashboard size={20} />
            <span>Tu espacio personal</span>
          </Link>
          <Link
            to={ROUTES.NUEVO_VIAJE}
            className={`${styles.sidebarLink} ${styles.aiLink}`}
            onClick={handleClick}
            style={{ textDecoration: "none", position: "relative", overflow: "hidden" }}
          >
            <Sparkles size={20} color="#f4a02c" />
            <span>Planifica con IA</span>
            <BorderBeam size={60} duration={3} delay={0} colorFrom="#f4a02c" colorTo="#ffffff" />
          </Link>
          <Link
            to={ROUTES.VUELOS}
            className={styles.sidebarLink}
            onClick={handleClick}
            style={{ textDecoration: "none" }}
          >
            <Plane size={20} />
            <span>Reservar Vuelos</span>
          </Link>
          <Link
            to={ROUTES.HOTELES}
            className={styles.sidebarLink}
            onClick={handleClick}
            style={{ textDecoration: "none" }}
          >
            <Bed size={20} />
            <span>Buscar Hoteles</span>
          </Link>
          <Link
            to={ROUTES.AUTOS}
            className={styles.sidebarLink}
            onClick={handleClick}
            style={{ textDecoration: "none" }}
          >
            <Car size={20} />
            <span>Rentar Autos</span>
          </Link>
          <Link
            to={ROUTES.RESTAURANTES}
            className={styles.sidebarLink}
            onClick={handleClick}
            style={{ textDecoration: "none" }}
          >
            <Utensils size={20} />
            <span>Restaurantes</span>
          </Link>
          <Link
            to={ROUTES.ACTIVIDADES}
            className={styles.sidebarLink}
            onClick={handleClick}
            style={{ textDecoration: "none" }}
          >
            <Compass size={20} />
            <span>Ver Actividades</span>
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
