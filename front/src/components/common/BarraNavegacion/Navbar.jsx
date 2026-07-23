import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavLinks from "./NavLinks";
import UserDropdown from "./UserDropdown/UserDropdown";
import styles from "./Navbar.module.css";
import { ROUTES } from "../../../constants/routes";
import { useAuth } from "../../../contexts/AuthContext";
import { Menu, X, User, LogOut, MapPin, Calendar, Sparkles } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout, openLoginModal } = useAuth();
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
    setIsOpen(false);
    navigate("/");
  };

  // Bloquear scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className={styles.navbar}>
        {/* Lado izquierdo: Hamburguesa + Logo */}
        <div className={styles.leftGroup}>
          <button
            className={styles.menuBtn}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menú de navegación"
          >
            <Menu size={22} />
          </button>

          <Link
            to="/"
            className={styles.logo}
            style={{ textDecoration: "none" }}
            onClick={() => {
              if (window.location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            Tip<span>Plan</span>
          </Link>
        </div>

        {/* Lado derecho: Botones de acción */}
        <div className={styles.actions}>
          {isAuthenticated && (
            <button className={styles.googleAiBtn} onClick={() => navigate(ROUTES.NUEVO_VIAJE)}>
              <div className={styles.googleAiBtnContent}>
                <Sparkles size={18} color="#1a73e8" />
                <span>Ask IA</span>
              </div>
            </button>
          )}
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <button className={styles.btn_login} onClick={openLoginModal} aria-label="Iniciar sesión">
              <User size={16} />
              <span>Iniciar sesión</span>
            </button>
          )}
        </div>
      </header>

      {/* Overlay oscuro */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar deslizable desde la izquierda */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link
            to="/"
            className={styles.sidebarLogo}
            style={{ textDecoration: "none" }}
            onClick={() => setIsOpen(false)}
          >
            Tip<span>Plan</span>
          </Link>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <NavLinks onClose={() => setIsOpen(false)} />

        {/* Sección de sesión en el sidebar */}
        <div className={styles.sidebarFooter}>
          {isAuthenticated ? (
            <>
              <Link
                to={ROUTES.MIS_VIAJES}
                className={styles.sidebarUserCard}
                style={{ textDecoration: "none" }}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.sidebarAvatar}>{initial}</span>
                <div className={styles.sidebarUserInfo}>
                  <span className={styles.sidebarUserName}>{displayName}</span>
                  <span className={styles.sidebarUserLabel}>Ver mi perfil</span>
                </div>
              </Link>
              <button className={styles.sidebarLogoutBtn} onClick={handleLogout}>
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            </>
          ) : (
            <button
              className={styles.sidebarLoginBtn}
              onClick={() => {
                setIsOpen(false);
                openLoginModal();
              }}
            >
              <User size={18} />
              <span>Iniciar sesión</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
