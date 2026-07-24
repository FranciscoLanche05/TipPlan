import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { getTripById } from '@back/services/firestoreService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './ServiceLayout.module.css';
import { Search, Map as MapIcon, SlidersHorizontal, X } from 'lucide-react';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Price marker icon
const createPriceIcon = (price) => {
  return L.divIcon({
    className: styles.customMarker,
    html: `<div class="${styles.markerPrice}">$${price}</div>`,
    iconSize: [40, 24],
    iconAnchor: [20, 24],
  });
};

const MapUpdater = ({ center, markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (center) {
      map.setView(center, 12);
    }
  }, [center, markers, map]);
  return null;
};

const ServiceLayout = ({ 
  title, 
  subtitle, 
  results, 
  renderCard, 
  onSearch, 
  searchPlaceholder = "¿A dónde vas?", 
  showMap = true,
  onMarkerClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [providerFilters, setProviderFilters] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (showMap) {
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          setIsMapReady(true);
        }, 0);
      });
    }
  }, [showMap]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tripId = params.get('tripId');
    if (tripId) {
      getTripById(tripId).then(trip => {
        if (trip && trip.destination) {
          setSearchTerm(trip.destination);
          // Only trigger onSearch once initially
          if (onSearch) onSearch(trip.destination);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  const toggleProvider = (provider) => {
    if (providerFilters.includes(provider)) {
      setProviderFilters(providerFilters.filter(p => p !== provider));
    } else {
      setProviderFilters([...providerFilters, provider]);
    }
  };

  // 1. Filtrar por Proveedores (Varios a la vez)
  let processedResults = [...results];
  if (providerFilters.length > 0) {
    processedResults = processedResults.filter(r => providerFilters.includes(r.proveedor));
  }

  // Función de ayuda para extraer el precio numérico independientemente del servicio
  const getPrice = (item) => {
    if (item.precio) return item.precio;
    if (item.precioNoche) return item.precioNoche;
    if (item.precioDia) return item.precioDia;
    if (item.precioPromedio) return item.precioPromedio.length; // "$$$" -> 3
    return 0;
  };

  // 2. Ordenar Resultados (Incluyendo Filtro Inteligente)
  if (sortOption === 'price_asc') {
    processedResults.sort((a, b) => getPrice(a) - getPrice(b));
  } else if (sortOption === 'price_desc') {
    processedResults.sort((a, b) => getPrice(b) - getPrice(a));
  } else if (sortOption === 'rating_desc') {
    processedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortOption === 'smart') {
    // Filtro Inteligente: Mejor relación Calidad/Precio (Rating / Price)
    processedResults.sort((a, b) => {
      const scoreA = (a.rating || 0) / (getPrice(a) || 1);
      const scoreB = (b.rating || 0) / (getPrice(b) || 1);
      return scoreB - scoreA;
    });
  }

  const markers = processedResults.filter(r => r.lat && r.lng);
  const defaultCenter = markers.length > 0 ? [markers[0].lat, markers[0].lng] : [40.4168, -3.7038]; // Default Madrid

  // Obtener proveedores únicos para el filtro
  const uniqueProviders = [...new Set(results.map(r => r.proveedor).filter(Boolean))];

  return (
    <div className={styles.layoutContainer}>
      {/* Overlay invisible para cerrar dropdowns al hacer clic fuera */}
      {openDropdown && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} 
          onClick={() => setOpenDropdown(null)}
        />
      )}
      
      {/* Top Search Bar */}
      <div className={styles.topHeader}>
        <div className={styles.headerTopRow}>
          <div className={styles.titles}>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              value={searchTerm} 
              onChange={e => {
                setSearchTerm(e.target.value);
                if (onSearch) onSearch(e.target.value); // Búsqueda en tiempo real
              }} 
            />
            <button type="submit" className={styles.searchBtn}>Buscar</button>
          </form>
        </div>

        {/* Filters Bar (Kayak Style) */}
        <div className={styles.filtersBar}>
          <button className={styles.filterBtn} onClick={() => { setSortOption(''); setProviderFilters([]); }} aria-label="Limpiar filtros">
            <SlidersHorizontal size={16} /> Restablecer filtros 
            {providerFilters.length > 0 && <span className={styles.badge}>{providerFilters.length}</span>}
          </button>
          
          <div className={styles.dropdownWrapper} style={{ zIndex: openDropdown === 'sort' ? 102 : 100 }}>
            <button 
              className={`${styles.filterBtn} ${sortOption ? styles.filterActive : ''}`}
              onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            >
              ✨ Ordenar por <span className={styles.arrow}>▼</span>
            </button>
            {openDropdown === 'sort' && (
              <div className={styles.dropdownPopover} style={{ zIndex: 105 }}>
                <button 
                  className={`${styles.dropdownItem} ${sortOption === 'smart' ? styles.dropdownItemActive : ''}`}
                  onClick={() => { setSortOption('smart'); setOpenDropdown(null); }}
                >
                  ⭐ Mejor relación Calidad/Precio (Recomendado)
                </button>
                <button 
                  className={`${styles.dropdownItem} ${sortOption === 'rating_desc' ? styles.dropdownItemActive : ''}`}
                  onClick={() => { setSortOption('rating_desc'); setOpenDropdown(null); }}
                >
                  🌟 Mejor valorados primero
                </button>
                <button 
                  className={`${styles.dropdownItem} ${sortOption === 'price_asc' ? styles.dropdownItemActive : ''}`}
                  onClick={() => { setSortOption('price_asc'); setOpenDropdown(null); }}
                >
                  💰 Precios más bajos primero
                </button>
                <button 
                  className={`${styles.dropdownItem} ${sortOption === 'price_desc' ? styles.dropdownItemActive : ''}`}
                  onClick={() => { setSortOption('price_desc'); setOpenDropdown(null); }}
                >
                  💸 Precios más altos primero
                </button>
              </div>
            )}
          </div>

          {uniqueProviders.length > 0 && (
            <div className={styles.dropdownWrapper} style={{ zIndex: openDropdown === 'provider' ? 102 : 100 }}>
              <button 
                className={`${styles.filterBtn} ${providerFilters.length > 0 ? styles.filterActive : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'provider' ? null : 'provider')}
              >
                Proveedor {providerFilters.length > 0 && `(${providerFilters.length})`} <span className={styles.arrow}>▼</span>
              </button>
              {openDropdown === 'provider' && (
                <div className={styles.dropdownPopover} style={{ zIndex: 105, maxHeight: '300px', overflowY: 'auto' }}>
                  {uniqueProviders.map(p => (
                    <button 
                      key={p}
                      className={`${styles.dropdownItem} ${providerFilters.includes(p) ? styles.dropdownItemActive : ''}`}
                      onClick={() => toggleProvider(p)}
                    >
                      <input 
                        type="checkbox" 
                        checked={providerFilters.includes(p)} 
                        onChange={() => {}} // dummy onChange to suppress react warning, state is handled by button click
                        style={{ cursor: 'pointer' }}
                      />
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {showMap && (
            <button className={styles.mobileMapBtn} onClick={() => setIsMobileMapOpen(true)} aria-label="Abrir mapa">
              <MapIcon size={16} /> Ver mapa
            </button>
          )}
        </div>
      </div>

      {/* Main Content (Split Screen) */}
      <div className={`${styles.mainContent} ${!showMap ? styles.noMap : ''}`}>
        
        {/* Left Column: Results List */}
        <div className={styles.resultsColumn}>
          <div className={styles.resultsMeta}>
            <span>✓ Misión cumplida. Encontramos {processedResults.length} resultados.</span>
          </div>
          
          <div className={styles.cardsList}>
            {processedResults.length > 0 ? (
              processedResults.map((item, index) => renderCard(item, index))
            ) : (
              <div className={styles.noResults}>
                <h3>No hay resultados</h3>
                <p>Intenta buscar con otros términos o eliminar los filtros.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map */}
        {showMap && (
          <div className={`${styles.mapColumn} ${isMobileMapOpen ? styles.mapOpenMobile : ''}`}>
            {isMobileMapOpen && (
              <button className={styles.closeMapBtn} onClick={() => setIsMobileMapOpen(false)} aria-label="Cerrar mapa">
                <X size={24} /> Cerrar mapa
              </button>
            )}
            <div className={styles.mapStickyContainer}>
              {isMapReady && (
                <MapContainer center={defaultCenter} zoom={12} className={styles.leafletMap}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <MapUpdater center={defaultCenter} markers={markers} />
                  
                  {markers.map(m => {
                    const price = m.precio || m.precioNoche || m.precioDia || m.precioPromedio;
                    return (
                      <Marker 
                        key={m.id} 
                        position={[m.lat, m.lng]} 
                        icon={createPriceIcon(price)}
                        eventHandlers={{
                          click: () => {
                            if (onMarkerClick) onMarkerClick(m.id);
                          }
                        }}
                      >
                        <Popup className={styles.customPopup}>
                          <strong>{m.nombre || m.empresa || m.titulo}</strong><br/>
                          {m.proveedor && <small>Vía {m.proveedor}</small>}<br/>
                          Precio: ${price}
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ServiceLayout;
