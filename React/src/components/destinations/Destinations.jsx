import "./Destinations.css";

function Destinations(){

    return(

        <section className="destinations">

            <span className="destination_tag">
                ECUADOR
            </span>

            <div className="destination_header">

    <h1>
        Destinos <span>más populares</span>
    </h1>

    <p className="destination_text">
        Los lugares más icónicos de nuestro
        hermoso país, listos para explorar.
    </p>

</div>

            <div className="cards">

                <div className="card">

                    <img
                        src="https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f"
                        alt="Virgen del Panecillo"
                    />

                    <div className="overlay">

                        <span className="city">
                            QUITO , ECUADOR
                        </span>

                        <h2>Virgen del Panecillo</h2>

                        <div className="card_buttons">
                            

                            <a
                             href="https://maps.google.com/?q=Virgen+del+Panecillo+Quito"
                            target="_blank"
                            className="map_btn"
                            >
                            📍 Ver mapa
                            </a>
                                
                            <button className="reserve_btn">
                                Reservar
                            </button>

                        </div>

                    </div>

                </div>

                <div className="card">

                    <img
                        src="https://images.unsplash.com/photo-1589909202802-8f4aadce1849"
                        alt="Mitad del Mundo"
                    />

                    <div className="overlay">

                        <span className="city">
                            QUITO , ECUADOR
                        </span>

                        <h2>Mitad del Mundo</h2>

                        <div className="card_buttons">

                             <a
                              href="https://maps.google.com/?q=Mitad+del+Mundo+Quito"
                            target="_blank"
                            className="map_btn"
                            >
                            📍 Ver mapa
                            </a>

                            <button className="reserve_btn">
                                Reservar
                            </button>

                        </div>

                    </div>

                </div>

                <div className="card">

                    <img
                        src="https://images.unsplash.com/photo-1577412647305-991150c7d163"
                        alt="Basílica del Voto Nacional"
                    />

                    <div className="overlay">

                        <span className="city">
                            QUITO , ECUADOR
                        </span>

                        <h2>
                            Basílica del Voto
                            Nacional
                        </h2>

                        <div className="card_buttons">

                             <a
                             href="https://maps.google.com/?q=Basilica+del+Voto+Nacional+Quito"
                            target="_blank"
                            className="map_btn"
                            >
                            📍 Ver mapa
                            </a>

                            <button className="reserve_btn">
                                Reservar
                            </button>

                        </div>

                    </div>

                </div>

                <div className="card">

                    <img
                        src="https://images.unsplash.com/photo-1577587230708-187fdbef4d91"
                        alt="Malecón 2000"
                    />

                    <div className="overlay">

                        <span className="city">
                            GUAYAQUIL , ECUADOR
                        </span>

                        <h2>Malecón 2000</h2>

                        <div className="card_buttons">

                                <a
                                    href="https://maps.google.com/?q=Malecon+2000+Guayaquil"
                                    target="_blank"
                                    className="map_btn"
                                 >
                                📍 Ver mapa
                                 </a>

                               

                            <button className="reserve_btn">
                                Reservar
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default Destinations;