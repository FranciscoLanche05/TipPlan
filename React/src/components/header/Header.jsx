import "./Header.css"


function Header (){
    return(
    <header className="header">
        <div className="logo">
            Tip<span>Plan</span>
        </div>

        <nav className="nav">
        <a href="#">Nosotros</a>
        <a href="#">Destinos</a>
        <a href="#">Mundo</a>
        <a href="#">Planificador</a>
        <a href="#">Blog</a>
        <a href="#">Contactos</a>

        </nav>
        < button className="btn_viaje">
        Planificar viaje
        </button>
    </header>
    );
}
export default Header;