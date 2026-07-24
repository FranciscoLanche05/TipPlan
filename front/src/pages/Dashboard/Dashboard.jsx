import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { getUserReservations, getUserTrips } from '@back/services/firestoreService';
import { Wallet, Briefcase, PlaneTakeoff, FolderPlus, FileQuestion, ChevronRight, ChevronDown, Plane, Bed, Car, Utensils, CalendarDays } from 'lucide-react';
import styles from './Dashboard.module.css';
import destinations from '../../services/datos/destinations';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user?.uid) {
        try {
          const res = await getUserReservations(user.uid);
          setReservations(res);
          const userTrips = await getUserTrips(user.uid);
          setTrips(userTrips);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDashboardData();
  }, [user]);

  // Analytics Processing
  const { totalSpent, activeCount, upcomingTrip, counts, actividades } = useMemo(() => {
    let spent = 0;
    let active = 0;
    let upcoming = null;
    let minDays = Infinity;
    const now = new Date();
    
    // Contadores por categoría
    const typeCounts = { vuelo: 0, hotel: 0, auto: 0, restaurante: 0 };
    const acts = [];

    reservations.forEach(res => {
      // Gastos
      let itemPrice = 0;
      if (res.price) {
        const num = parseFloat(String(res.price).replace(/[^\d.-]/g, ''));
        if (!isNaN(num)) itemPrice = num;
      } else if (res.precio || res.precioNoche || res.precioDia) {
        const num = parseFloat(res.precio || res.precioNoche || res.precioDia);
        if (!isNaN(num)) itemPrice = num;
      }
      spent += itemPrice;

      // Clasificación
      const type = res.type || '';
      if (type === 'vuelo') typeCounts.vuelo++;
      else if (type === 'hotel') typeCounts.hotel++;
      else if (type === 'auto') typeCounts.auto++;
      else if (type === 'restaurante') typeCounts.restaurante++;
      else if (type === 'actividad' || type === 'turistico') acts.push(res);

      if (res.status === 'Confirmado' || !res.status) {
        active++;
      }
    });

    // Calculamos el próximo viaje usando la lista de 'trips'
    trips.forEach(trip => {
      if (trip.startDate) {
        const dateObj = new Date(trip.startDate);
        // Normalizamos fecha de inicio quitando la parte de la hora si solo queremos comparar días
        const nowNoTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tripNoTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        
        if (tripNoTime >= nowNoTime) {
          const diffTime = Math.abs(tripNoTime - nowNoTime);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays < minDays) {
            minDays = diffDays;
            
            // Calculamos costo total de este viaje sumando sus reservas
            const tripRes = reservations.filter(r => r.tripId === trip.id);
            const tripCost = tripRes.reduce((sum, res) => {
              let itemPrice = 0;
              if (res.price) {
                const num = parseFloat(String(res.price).replace(/[^\d.-]/g, ''));
                if (!isNaN(num)) itemPrice = num;
              } else if (res.precio || res.precioNoche || res.precioDia) {
                const num = parseFloat(res.precio || res.precioNoche || res.precioDia);
                if (!isNaN(num)) itemPrice = num;
              }
              return sum + itemPrice;
            }, 0);

            upcoming = {
              ...trip,
              title: trip.title || 'Viaje sin nombre',
              location: trip.destination || 'Múltiples destinos',
              price: tripCost,
              dateStr: trip.startDate,
              days: diffDays
            };
          }
        }
      }
    });

    return { 
      totalSpent: spent, 
      activeCount: active,
      upcomingTrip: upcoming,
      counts: typeCounts,
      actividades: acts
    };
  }, [reservations, trips]);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Viajero';
  const initial = displayName.charAt(0).toUpperCase();

  // Tomamos los primeros 4 destinos para sugerencias
  const suggestedDestinations = destinations.slice(0, 4);

  if (loading) {
    return <div className={styles.dashboardPage} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>Cargando tu espacio personal...</div>;
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.personalSpaceWrapper}>
        
        <div className={styles.mainBody}>
          
          {/* Saludo */}
          <div className={styles.greetingSection}>
            <span className={styles.greetingTag}>Tu espacio personal</span>
            <h1 className={styles.greetingTitle}>Hola, {displayName}</h1>
            <p className={styles.greetingDesc}>Organiza tus reservas en viajes con el nombre que quieras</p>
          </div>

          {/* Banner de Próxima Salida (Si existe alguna) */}
          {upcomingTrip ? (
            <div className={styles.upcomingBanner}>
              <div className={styles.upcomingBannerBg}></div>
              <div className={styles.upcomingBannerIcon}>
                <PlaneTakeoff size={28} />
              </div>
              <div className={styles.upcomingBannerContent}>
                <div className={styles.upcomingBannerTag}>Próxima salida a la vista</div>
                <h3 className={styles.upcomingBannerTitle}>{upcomingTrip.title}</h3>
                <p className={styles.upcomingBannerDesc}>
                  Ubicación: {upcomingTrip.location.split(',')[0]} · Fecha: {upcomingTrip.dateStr} · Costo: ${upcomingTrip.price.toLocaleString('en-US')}
                </p>
              </div>
              <div className={styles.upcomingBannerDays}>
                <div className={styles.upcomingBannerDaysNum}>{upcomingTrip.days}</div>
                <div className={styles.upcomingBannerDaysText}>días</div>
              </div>
            </div>
          ) : (
            <div className={styles.upcomingBanner} style={{ opacity: 0.7 }}>
              <div className={styles.upcomingBannerIcon}>
                <PlaneTakeoff size={28} />
              </div>
              <div className={styles.upcomingBannerContent}>
                <div className={styles.upcomingBannerTag}>Sin salidas próximas</div>
                <h3 className={styles.upcomingBannerTitle}>¿A dónde quieres ir?</h3>
                <p className={styles.upcomingBannerDesc}>Explora abajo y comienza a planificar tu siguiente aventura.</p>
              </div>
            </div>
          )}

          {/* Tarjetas de Resumen (6 Cards) */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIconBox}><Wallet size={20} /></div>
              <div>
                <div className={styles.statLabel}>Total invertido</div>
                <div className={styles.statValue}>${totalSpent.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIconBox}><Briefcase size={20} /></div>
              <div>
                <div className={styles.statLabel}>Viajes activos</div>
                <div className={styles.statValue}>{activeCount}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconBox}><Plane size={20} /></div>
              <div>
                <div className={styles.statLabel}>Vuelos</div>
                <div className={styles.statValue}>{counts.vuelo}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconBox}><Bed size={20} /></div>
              <div>
                <div className={styles.statLabel}>Estadía (Hoteles)</div>
                <div className={styles.statValue}>{counts.hotel}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconBox}><Car size={20} /></div>
              <div>
                <div className={styles.statLabel}>Autos rentados</div>
                <div className={styles.statValue}>{counts.auto}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconBox}><Utensils size={20} /></div>
              <div>
                <div className={styles.statLabel}>Restaurantes</div>
                <div className={styles.statValue}>{counts.restaurante}</div>
              </div>
            </div>
          </div>

          {/* Resumen del Itinerario de Actividades */}
          <div className={styles.sectionTitle}>Itinerario del viaje</div>
          <div className={styles.itineraryCard}>
            <div className={styles.itineraryIconBox}>
              <CalendarDays size={24} />
            </div>
            <div className={styles.itineraryText}>
              <div className={styles.itineraryTitle}>
                {actividades.length} actividades programadas
              </div>
              <div className={styles.itinerarySub}>
                Revisa los tours y puntos de interés del itinerario de tu próximo viaje
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-secondary)" />
          </div>

          {/* Próximos Viajes */}
          <div className={styles.sectionTitle}>Próximos viajes</div>
          <div className={styles.tripsGrid}>
            
            {trips.map((trip) => {
              let daysLeftText = '';
              if (trip.startDate) {
                const diffTime = new Date(trip.startDate) - new Date();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                daysLeftText = diffDays >= 0 ? `${diffDays} días` : 'Pasado';
              }
              
              const tripRes = reservations.filter(r => r.tripId === trip.id);
              const tripCost = tripRes.reduce((sum, res) => {
                let itemPrice = 0;
                if (res.price) {
                  const num = parseFloat(String(res.price).replace(/[^\d.-]/g, ''));
                  if (!isNaN(num)) itemPrice = num;
                } else if (res.precio || res.precioNoche || res.precioDia) {
                  const num = parseFloat(res.precio || res.precioNoche || res.precioDia);
                  if (!isNaN(num)) itemPrice = num;
                }
                return sum + itemPrice;
              }, 0);

              return (
                <div 
                  key={trip.id} 
                  className={styles.tripCard}
                  onClick={() => navigate(ROUTES.DETALLE_VIAJE.replace(':id', trip.id))}
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className={styles.tripBanner} 
                    style={{ backgroundImage: `url(${trip.coverImage || ''})`, backgroundSize: 'cover' }}
                  >
                    <div className={styles.tripBannerOverlay}></div>
                    <span className={styles.tripDaysTag}>{daysLeftText}</span>
                  </div>
                  <div className={styles.tripInfo}>
                    <div className={styles.tripName}>{trip.title}</div>
                    <div className={styles.tripMeta}>{tripRes.length} reservas · ${tripCost.toLocaleString('en-US')}</div>
                  </div>
                </div>
              );
            })}

            <div 
              className={styles.newTripCard}
              onClick={() => navigate(ROUTES.NUEVO_VIAJE)}
            >  <FolderPlus size={26} />
              <span className={styles.newTripText}>Nuevo viaje</span>
            </div>

          </div>

          {/* Sin Asignar */}
          <div className={styles.sectionTitle}>Sin asignar</div>
          <div className={styles.unassignedCard}>
            <div className={styles.unassignedIconBox}>
              <FileQuestion size={20} />
            </div>
            <div className={styles.unassignedText}>
              <div className={styles.unassignedTitle}>{reservations.length} reservas sin asignar</div>
              <div className={styles.unassignedSub}>
                Muévelas a un viaje cuando quieras
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-secondary)" />
          </div>

          {/* Explora tu próximo destino */}
          <div className={styles.exploreSection}>
            <div className={styles.exploreHeader}>
              <h2 className={styles.exploreTitle}>Explora tu próximo destino</h2>
              <p className={styles.exploreSub}>Empieza un nuevo viaje reservando algo aquí</p>
            </div>
            
            <div className={styles.exploreGrid}>
              {suggestedDestinations.map(dest => (
                <div key={dest.id} className={styles.exploreCard}>
                  <div 
                    className={styles.exploreImage} 
                    style={{ backgroundImage: `url(${typeof dest.image === 'string' ? dest.image : dest.image?.src || dest.image})` }}
                  ></div>
                  <div className={styles.exploreInfo}>
                    <div className={styles.exploreLocation}>{dest.location}</div>
                    <div className={styles.explorePlace}>{dest.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
