import "./About.css";

function About(){

    return(

        <section className="about">

            <div className="about_image">

                <img
                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                    alt="Viajeros explorando"
                />

                <div className="about_card">
                    <h2>2021</h2>
                    <p>Fundado en Ecuador</p>
                </div>

            </div>

            <div className="about_content">

                <span className="about_tag">
                    SOBRE NOSOTROS
                </span>

                <h1>
                    Hacemos que <br />
                    planificar sea <br />
                    <span>emocionante</span>
                </h1>

                <p className="about_text">
                    Nuestra visión es transformar la manera en que las personas viven
                    sus viajes, convirtiendo la planificación en una experiencia simple,
                    intuitiva y emocionante.
                </p>

                <div className="about_features">

                    <div className="feature">

                        <div className="icon">
                            🗺️
                        </div>

                        <div>
                            <h3>Guías locales expertas</h3>

                            <p>
                                Información curada por viajeros reales con experiencia
                                de primera mano en cada destino.
                            </p>
                        </div>

                    </div>

                    <div className="feature">

                        <div className="icon">
                            ⚡
                        </div>

                        <div>
                            <h3>Planificación en minutos</h3>

                            <p>
                                Herramientas intuitivas que te permiten organizar
                                todo tu viaje de forma rápida y sin complicaciones.
                            </p>
                        </div>

                    </div>

                    <div className="feature">

                        <div className="icon">
                            📍
                        </div>

                        <div>
                            <h3>Mapas y ubicaciones exactas</h3>

                            <p>
                                Integración directa con Google Maps para que encuentres
                                cada destino sin problemas.
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default About;