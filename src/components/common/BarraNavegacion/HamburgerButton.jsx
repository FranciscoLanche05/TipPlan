import styles from "./Navbar.module.css";

const HamburgerButton = ({ isOpen, onClick }) => {
  return (
    <button
      className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ""}`}
      onClick={onClick}
      aria-label="Menú de navegación"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default HamburgerButton;
