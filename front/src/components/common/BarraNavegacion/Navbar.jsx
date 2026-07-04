import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavLinks from "./NavLinks";
import HamburgerButton from "./HamburgerButton";
import styles from "./Navbar.module.css";
import { ROUTES } from "../../../constants/routes";
import { useAuth } from "../../../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Inicial del nombre del usuario para el avatar
  const initial = user?.displayName
    ? user.displayName.charAt(0)
    : user?.email
    ? user.email.charAt(0)
    : "U";

  const displayName = user?.displayName || (user?.email ? user.email.split("@")[0] : "Usuario");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className={styles.navbar}>
      <Link 
        to="/" 
        className={styles.logo} 
        style={{ textDecoration: "none" }}
        onClick={() => {
          // Si ya estamos en la página de inicio, hacemos scroll arriba
          if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        Tip<span>Plan</span>
      </Link>
      <NavLinks isOpen={isOpen} />
      <div className={styles.actions}>
        {isAuthenticated ? (
          <>
            <div className={styles.userMenu}>
              <Link to={ROUTES.MIS_VIAJES} className={styles.userName} style={{ textDecoration: "none" }}>
                {displayName}
              </Link>
              <Link to={ROUTES.MIS_VIAJES} className={styles.avatar} style={{ textDecoration: "none" }}>
                {initial}
              </Link>
              <button className={styles.btn_logout} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              className={styles.btn_viaje}
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              Planificar viaje
            </button>
            <Link to={ROUTES.LOGIN} className={styles.btn_login}>
              Iniciar sesión
            </Link>
          </>
        )}
      </div>
      <HamburgerButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </header>
  );
};

export default Navbar;
