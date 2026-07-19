import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './Configuracion.module.css';
import {
  ChevronLeft,
  User,
  Lock,
  Heart,
  Clock,
  Briefcase,
  Search,
  Bell,
  Globe
} from 'lucide-react';

// Componente para el interruptor (Toggle)
const ToggleSwitch = ({ label, description, defaultChecked }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className={styles.settingGroup}>
      <div className={styles.settingHeader}>
        <div>
          <div className={styles.settingTitle}>{label}</div>
          <div className={styles.settingDesc}>{description}</div>
        </div>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={checked} 
            onChange={(e) => setChecked(e.target.checked)} 
          />
          <span className={styles.slider}></span>
        </label>
      </div>
    </div>
  );
};

const ConfiguracionCuenta = () => {
  const { "*": currentTab } = useParams();
  const navigate = useNavigate();

  const tab = currentTab || 'notificaciones';

  const menuItems = [
    { id: 'perfil', label: 'Información personal', icon: User },
    { id: 'seguridad', label: 'Seguridad de la cuenta', icon: Lock },
    { id: 'favoritos', label: 'Favoritos', icon: Heart },
    { id: 'recientes', label: 'Vistos recientemente', icon: Clock },
    { id: 'reservas', label: 'Reservas', icon: Briefcase, isExternal: true, path: ROUTES.RESERVAS },
    { id: 'busqueda', label: 'Preferencias de búsqueda', icon: Search },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'idioma', label: 'Idioma y moneda', icon: Globe },
  ];

  const renderContent = () => {
    switch (tab) {
      case 'notificaciones':
        return (
          <>
            <div className={styles.header}>
              <h1>Notificaciones</h1>
              <p>Elige tus preferencias de comunicación.</p>
            </div>
            
            <ToggleSwitch 
              label="Emails promocionales" 
              description="Actívalos y recibe ofertas de hotel, consejos de destinos, alertas de reducción de precios y recordatorios de búsqueda."
              defaultChecked={true}
            />
            <ToggleSwitch 
              label="Ofertas e ideas de viaje" 
              description="Boletín semanal con ofertas seleccionadas e ideas de viaje para la temporada"
              defaultChecked={true}
            />
            <ToggleSwitch 
              label="Consejos sobre destinos" 
              description="Boletín mensual con destinos seleccionados para inspirarte"
              defaultChecked={true}
            />
            <ToggleSwitch 
              label="Reducción de precios en alojamientos que viste" 
              description="Alertas por correo electrónico si bajan los precios de los alojamientos que viste recientemente"
              defaultChecked={true}
            />
            <ToggleSwitch 
              label="Recordatorios de búsqueda" 
              description="Recordatorios por correo electrónico para que retomes tu búsqueda"
              defaultChecked={true}
            />
            <ToggleSwitch 
              label="Tus alertas de precios" 
              description="Alertas por email si bajan los precios de los alojamientos que sigues"
              defaultChecked={true}
            />
          </>
        );
      default:
        const activeItem = menuItems.find(item => item.id === tab);
        return (
          <div className={styles.emptyState}>
            <h2>{activeItem?.label || 'Módulo'}</h2>
            <p>Esta sección está actualmente en construcción.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.configPage}>
      <div className={styles.container}>
        {/* Barra Lateral Izquierda */}
        <div className={styles.sidebar}>
          <button className={styles.backBtn} onClick={() => navigate(ROUTES.HOME)}>
            <ChevronLeft size={18} />
            Volver
          </button>
          
          <div className={styles.navSection}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              if (item.isExternal) {
                return (
                  <Link 
                    key={item.id} 
                    to={item.path} 
                    className={styles.navItem}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              }
              
              return (
                <Link
                  key={item.id}
                  to={`${ROUTES.CONFIGURACION}/${item.id}`}
                  className={`${styles.navItem} ${tab === item.id ? styles.active : ''}`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionCuenta;
