import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import { ROUTES } from "../../../constants/routes";

// Enlaces de navegación con anclas a las secciones (ids reales del Home)
const links = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#destinos", label: "Destinos" },
  { href: "#mapa", label: "Mundo" },
  { href: "#planificador", label: "Planificador" },
  { href: "#blog", label: "Blog" },
  { href: "#faq", label: "Contactos" },
];

const NavLinks = ({ isOpen }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`}>
      {links.map((link) => (
        <a key={link.label} href={link.href}>
          {link.label}
        </a>
      ))}

      {/* Opciones de sesión (visibles en móvil, ya que userMenu se oculta) */}
      {isAuthenticated ? (
        <>
          <Link to={ROUTES.MIS_VIAJES} style={{ textDecoration: "none" }}>
            Mis viajes
          </Link>
          <button className={styles.btn_logout} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <Link to={ROUTES.LOGIN} className={styles.btn_login_mobile} style={{ textDecoration: "none" }}>
          Iniciar sesión
        </Link>
      )}
    </nav>
  );
};

export default NavLinks;
