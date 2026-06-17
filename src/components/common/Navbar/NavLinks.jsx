import styles from "./Navbar.module.css";

const links = [
  { href: "#", label: "Nosotros" },
  { href: "#", label: "Destinos" },
  { href: "#", label: "Mundo" },
  { href: "#", label: "Planificador" },
  { href: "#", label: "Blog" },
  { href: "#", label: "Contactos" },
];

const NavLinks = ({ isOpen }) => {
  return (
    <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`}>
      {links.map((link) => (
        <a key={link.label} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
};

export default NavLinks;
