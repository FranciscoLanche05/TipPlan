import { Outlet } from 'react-router-dom';
import Navbar from '../../components/common/BarraNavegacion/Navbar';
import Footer from '../../components/common/PieDePagina/Footer';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.mainLayout}>
      <Navbar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
