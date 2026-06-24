import styles from "./About.module.css";

const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className={styles.feature}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FeatureItem;
