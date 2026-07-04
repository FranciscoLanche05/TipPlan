import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './InteractiveMap.module.css';
import SectionTag from '../../ui/EtiquetaSeccion/SectionTag';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons based on category
const createIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const ICONS = {
  turistico: createIcon('#e5a93b'),
  restaurante: createIcon('#d96b43'),
  hospedaje: createIcon('#4e7039'),
  ruta: createIcon('#6b9ab8')
};

const LOCATIONS = [
  { id: 1, name: 'Mitad del Mundo', type: 'turistico', lat: -0.00215, lng: -78.45583, desc: 'Monumento a la línea ecuatorial.' },
  { id: 2, name: 'El Panecillo', type: 'turistico', lat: -0.2291, lng: -78.5186, desc: 'Mirador icónico de Quito.' },
  { id: 3, name: 'Restaurante Hasta la Vuelta Señor', type: 'restaurante', lat: -0.2201, lng: -78.5127, desc: 'Comida típica en el centro.' },
  { id: 4, name: 'Hotel Casa Gangotena', type: 'hospedaje', lat: -0.2235, lng: -78.5152, desc: 'Lujo en el centro histórico.' },
  { id: 5, name: 'Laguna del Quilotoa', type: 'ruta', lat: -0.8601, lng: -78.9037, desc: 'Laguna en el cráter del volcán.' }
];

export default function InteractiveMap() {
  const [filter, setFilter] = useState('todos');

  const filteredLocations = filter === 'todos' 
    ? LOCATIONS 
    : LOCATIONS.filter(loc => loc.type === filter);

  return (
    <section id="mapa" className={styles.mapSection}>
      <div className={styles.mapContainer}>
        {/* COLUMNA IZQUIERDA: TEXTO + FILTROS */}
        <div className={styles.mapTextSide}>
          <SectionTag>EXPLORA EN MAPA</SectionTag>
          <h2 className={styles.mapTitle}>
            Mapa <span className={styles.mapTitleItalic}>Interactivo</span>
          </h2>
          <p className={styles.mapDescription}>
            Visualiza rutas turísticas, puntos de interés, restaurantes y
            hospedajes directamente en el mapa. Todo en un solo lugar.
          </p>

          {/* FILTROS */}
          <div className={styles.mapFilters}>
            <button
              className={`${styles.filterBtn} ${filter === 'todos' ? styles.filterActive : ''}`}
              onClick={() => setFilter('todos')}
            >
              🗺️ Todos
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'turistico' ? styles.filterActive : ''}`}
              onClick={() => setFilter('turistico')}
            >
              📸 Turísticos
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'restaurante' ? styles.filterActive : ''}`}
              onClick={() => setFilter('restaurante')}
            >
              🥘 Restaurantes
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'hospedaje' ? styles.filterActive : ''}`}
              onClick={() => setFilter('hospedaje')}
            >
              🏨 Hospedajes
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'ruta' ? styles.filterActive : ''}`}
              onClick={() => setFilter('ruta')}
            >
              🛤️ Rutas
            </button>
          </div>

          {/* LEYENDA */}
          <div className={styles.mapLegend}>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.dotTuristico}`}></span>
              <span>Puntos turísticos</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.dotRestaurante}`}></span>
              <span>Restaurantes</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.dotHospedaje}`}></span>
              <span>Hospedajes</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.dotRuta}`}></span>
              <span>Rutas</span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: IFRAME DEL MAPA */}
        <div className={styles.mapEmbedSide}>
          <div className={styles.mapEmbedWrapper}>
            <MapContainer 
              center={[-0.2201681, -78.5127734]} 
              zoom={10} 
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%', zIndex: 1 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredLocations.map(loc => (
                <Marker 
                  key={loc.id} 
                  position={[loc.lat, loc.lng]}
                  icon={ICONS[loc.type]}
                >
                  <Popup>
                    <strong style={{ display: 'block', marginBottom: '5px' }}>{loc.name}</strong>
                    {loc.desc}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
