import viajeros from "../../../images/viajeros_11zon.webp";
import FeatureItem from "./FeatureItem";
import styles from "./About.module.css";

const features = [
  {
    icon: "🗺️",
    title: "Guías locales expertas",
    description:
      "Información curada por viajeros reales con experiencia de primera mano en cada destino.",
  },
  {
    icon: "⚡",
    title: "Planificación en minutos",
    description:
      "Herramientas intuitivas que te permiten organizar todo tu viaje de forma rápida y sin complicaciones.",
  },
  {
    icon: "📍",
    title: "Mapas y ubicaciones exactas",
    description:
      "Integración directa con Google Maps para que encuentres cada destino sin problemas.",
  },
];

const About = () => {
  return (
    <section className={styles.about} data-aos="fade-left" data-aos-duration="1000" data-aos-once="true">
      <div className={styles.image}>
        <img src={viajeros} alt="Viajeros explorando" />
        <div className={styles.card}>
          <h2>2021</h2>
          <p>Fundado en Ecuador</p>
        </div>
      </div>

      <div className={styles.content}>
        <span className={styles.tag}>SOBRE NOSOTROS</span>
        <h1>
          Hacemos que <br />
          planificar sea <br />
          <span>emocionante</span>
        </h1>
        <p className={styles.text}>
          Nuestra visión es transformar la manera en que las personas viven
          sus viajes, convirtiendo la planificación en una experiencia simple,
          intuitiva y emocionante.
        </p>
        <div className={styles.features}>
          {features.map((f) => (
            <FeatureItem
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
