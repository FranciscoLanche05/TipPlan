import styles from './MainLayout.module.css';
import Home from '../../pages/Home/Home';

export default function MainLayout() {
  return (
    <div className={styles.mainLayout}>
      <Home />
    </div>
  );
}
