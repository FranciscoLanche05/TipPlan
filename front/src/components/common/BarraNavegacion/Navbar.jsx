import { useState } from "react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import HamburgerButton from "./HamburgerButton";
import styles from "./Navbar.module.css";
import { ROUTES } from "../../../constants/routes";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        Tip<span>Plan</span>
      </div>
      <NavLinks isOpen={isOpen} />
      <div className={styles.actions}>
        <button className={styles.btn_viaje}>Planificar viaje</button>
        <Link to={ROUTES.LOGIN} className={styles.btn_login}>
          Iniciar sesión
        </Link>
      </div>
      <HamburgerButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </header>
  );
};

export default Navbar;
