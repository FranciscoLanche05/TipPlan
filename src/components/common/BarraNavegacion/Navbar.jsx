import { useState } from "react";
import NavLinks from "./NavLinks";
import HamburgerButton from "./HamburgerButton";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        Tip<span>Plan</span>
      </div>
      <NavLinks isOpen={isOpen} />
      <button className={styles.btn_viaje}>Planificar viaje</button>
      <HamburgerButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </header>
  );
};

export default Navbar;
