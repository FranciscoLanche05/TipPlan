import "./body1.css";

function Body1(){

    return(

        <section className="body">

            <div className="body_content">

                <span className="tag">
                    ✦ TU PLATAFORMA DE VIAJES EN ECUADOR
                </span>

                <h1>
                    Tu próxima <br />
                    <span>aventura</span><br />
                    empieza aquí
                </h1>

                <p>
                    Planifica, organiza y vive cada viaje sin complicaciones.
                    Descubre destinos increíbles con guías, mapas y consejos
                    en un solo lugar.
                </p>

                <div className="body_buttons">

                    <button className="btn_explorar">
                        Explorar Destinos →
                    </button>

                    <button className="btn_plan">
                        ▶ Planificar mi aventura
                    </button>

                </div>

            </div>

            <div className="stats">

                <div className="stat_box">
                    <h2>50+</h2>
                    <p>Destinos disponibles</p>
                </div>

                <div className="stat_box">
                    <h2>7</h2>
                    <p>Continentes cubiertos</p>
                </div>

                <div className="stat_box">
                    <h2>12K+</h2>
                    <p>Viajeros satisfechos</p>
                </div>

                <div className="stat_box">
                    <h2>100%</h2>
                    <p>Gratuito para siempre</p>
                </div>

            </div>

        </section>

    );

}

export default Body1;