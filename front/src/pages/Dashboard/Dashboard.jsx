import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserReservations } from '@back/services/firestoreService';
import { Plane, Bed, Car, Utensils, Compass, Calendar, MapPin, TrendingUp, CreditCard, CheckCircle, Clock, Search, Bell, MoreHorizontal, ArrowRight, Download, FileText } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import styles from './Dashboard.module.css';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area 
} from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReservationsReport from '../../components/pdf/ReservationsReport';
import ReservationReceipt from '../../components/pdf/ReservationReceipt';

const COLORS = ['#E8A020', '#1B5C3A', '#0C2D1E', '#8C9B90', '#F4F6F5'];

// --- Datos Simulados para gráficos cuando no hay suficiente data ---
const MOCK_BAR_DATA = [
  { name: 'Lun', sales: 1200 }, { name: 'Mar', sales: 2100 },
  { name: 'Mie', sales: 800 }, { name: 'Jue', sales: 1600 },
  { name: 'Vie', sales: 2800 }, { name: 'Sab', sales: 3400 },
  { name: 'Dom', sales: 1900 },
];

const MOCK_AREA_DATA = [
  { name: 'Ene', value: 10 }, { name: 'Feb', value: 25 },
  { name: 'Mar', value: 15 }, { name: 'Abr', value: 40 },
  { name: 'May', value: 35 }, { name: 'Jun', value: 60 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      if (user?.uid) {
        try {
          const res = await getUserReservations(user.uid);
          setReservations(res);
        } catch (error) {
          console.error("Error fetching reservations:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReservations();
  }, [user]);

  // Analytics Processing
  const { totalSpent, activeCount, completedCount, pieData, topRoutes, barData, areaData } = useMemo(() => {
    let spent = 0;
    let active = 0;
    let completed = 0;
    const typeCounts = {};
    const destCounts = {};
    
    // --- Preparación para gráficos de tiempo (Últimos 6 meses) ---
    const monthsStr = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const now = new Date();
    const bData = [];
    const aData = [];
    
    for(let i=5; i>=0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = monthsStr[d.getMonth()];
      bData.push({ name: mName, sales: 0, rawMonth: d.getMonth(), rawYear: d.getFullYear() });
      aData.push({ name: mName, value: 0, rawMonth: d.getMonth(), rawYear: d.getFullYear() });
    }

    reservations.forEach(res => {
      // Gastos
      let itemPrice = 0;
      if (res.price) {
        const num = parseFloat(res.price.replace(/[^\d.-]/g, ''));
        if (!isNaN(num)) {
          spent += num;
          itemPrice = num;
        }
      }
      
      // Status
      if (res.status === 'Confirmado' || !res.status) active++;
      else completed++;

      // Tipos (Donut Chart)
      const t = res.type || 'vuelo';
      typeCounts[t] = (typeCounts[t] || 0) + 1;

      // Rutas/Destinos
      if (res.location) {
        const dest = res.location.split(',')[0]; // Toma la primera parte
        destCounts[dest] = (destCounts[dest] || 0) + 1;
      }

      // Gráficos de Tiempo
      let dateObj = new Date();
      if (res.createdAt && res.createdAt.seconds) {
        dateObj = new Date(res.createdAt.seconds * 1000);
      }
      
      const mIdx = bData.findIndex(b => b.rawMonth === dateObj.getMonth() && b.rawYear === dateObj.getFullYear());
      if (mIdx !== -1) {
        aData[mIdx].value += 1;
        bData[mIdx].sales += itemPrice;
      } else if (dateObj > now) {
        // Reservas futuras van al mes actual
        aData[5].value += 1;
        bData[5].sales += itemPrice;
      }
    });

    const pData = Object.keys(typeCounts).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: typeCounts[key]
    }));

    // Top Rutas
    const routesArray = Object.keys(destCounts).map(k => ({
      name: k,
      count: destCounts[k]
    })).sort((a,b) => b.count - a.count).slice(0, 5);

    // Si no hay reservaciones, usar mock para que no se vea vacío el dashboard en demo
    const finalBarData = reservations.length === 0 ? MOCK_BAR_DATA : bData;
    const finalAreaData = reservations.length === 0 ? MOCK_AREA_DATA : aData;

    return { 
      totalSpent: spent, 
      activeCount: active,
      completedCount: completed,
      pieData: pData.length > 0 ? pData : [{name: 'Sin datos', value: 1}], 
      topRoutes: routesArray,
      barData: finalBarData,
      areaData: finalAreaData
    };
  }, [reservations]);


  const getIconForType = (type) => {
    switch(type) {
      case 'vuelo': return <Plane size={18} />;
      case 'hotel': return <Bed size={18} />;
      case 'auto': return <Car size={18} />;
      case 'restaurante': return <Utensils size={18} />;
      case 'actividad': return <Compass size={18} />;
      default: return <Calendar size={18} />;
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando tu panel analítico...</div>;
  }

  return (
    <div className={styles.dashboardPage}>
      
      {/* Top Header interno */}
      <div className={styles.topHeader}>
        <div className={styles.headerTitle}>
          <h2>Bienvenido de vuelta, {user?.displayName || 'Viajero'} 👋</h2>
        </div>
        {reservations.length > 0 && (
          <div className={styles.pdfButtons}>
            <PDFDownloadLink
              document={
                <ReservationsReport
                  reservations={reservations}
                  userName={user?.displayName}
                  userEmail={user?.email}
                />
              }
              fileName={`reporte-reservas-${Date.now()}.pdf`}
              className={styles.pdfDownloadBtn}
            >
              {({ blob, url, loading, error }) =>
                loading ? (
                  <span className={styles.pdfBtnContent}>
                    <Download size={16} /> Generando...
                  </span>
                ) : (
                  <span className={styles.pdfBtnContent}>
                    <FileText size={16} /> Descargar Reporte
                  </span>
                )
              }
            </PDFDownloadLink>
          </div>
        )}
      </div>

      {/* Contenedor Grid Principal */}
      <div className={styles.mainGrid}>
        
        {/* FILA 1: KPIs */}
        <div className={styles.kpiRow}>
          <div className={styles.kpiWidget}>
            <div className={styles.kpiContent}>
              <span className={styles.kpiLabel}>Reservas Totales</span>
              <span className={styles.kpiValue}>{reservations.length}</span>
              <span className={styles.kpiTrend}><TrendingUp size={14}/> +12%</span>
            </div>
            <div className={styles.kpiIconWrapper}><Calendar size={24} /></div>
          </div>
          
          <div className={styles.kpiWidget}>
            <div className={styles.kpiContent}>
              <span className={styles.kpiLabel}>Servicios Activos</span>
              <span className={styles.kpiValue}>{activeCount}</span>
              <span className={styles.kpiTrend}><TrendingUp size={14}/> +5%</span>
            </div>
            <div className={styles.kpiIconWrapper}><CheckCircle size={24} /></div>
          </div>

          <div className={styles.kpiWidget}>
            <div className={styles.kpiContent}>
              <span className={styles.kpiLabel}>Completados / Canc.</span>
              <span className={styles.kpiValue}>{completedCount}</span>
              <span className={`${styles.kpiTrend} ${styles.trendDown}`}><Clock size={14}/> -2%</span>
            </div>
            <div className={styles.kpiIconWrapper}><Clock size={24} /></div>
          </div>

          <div className={styles.kpiWidget}>
            <div className={styles.kpiContent}>
              <span className={styles.kpiLabel}>Inversión Total</span>
              <span className={styles.kpiValue}>${totalSpent.toFixed(0)}</span>
              <span className={styles.kpiTrend}><TrendingUp size={14}/> +8.5%</span>
            </div>
            <div className={styles.kpiIconWrapper}><CreditCard size={24} /></div>
          </div>
        </div>

        {/* FILA 2: Gráficos principales */}
        <div className={styles.chartsRow}>
          
          {/* Bar Chart */}
          <div className={`${styles.widget} ${styles.barWidget}`}>
            <div className={styles.widgetHeader}>
              <h3>Tendencia de Gastos</h3>
              <select className={styles.filterSelect}><option>Últimos 6 Meses</option></select>
            </div>
            <div className={styles.chartArea}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8C9B90', fontSize: 12}} dy={10} />
                  <Tooltip 
                    cursor={{fill: '#f4f6f5'}} 
                    contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Gasto']}
                  />
                  <Bar dataKey="sales" fill="#0C2D1E" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart */}
          <div className={`${styles.widget} ${styles.areaWidget}`}>
            <div className={styles.widgetHeader}>
              <h3>Flujo de Reservas</h3>
              <select className={styles.filterSelect}><option>Últimos 6 Meses</option></select>
            </div>
            <div className={styles.chartArea}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E8A020" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#E8A020" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8C9B90', fontSize: 12}} dy={10} />
                  <Tooltip 
                    contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} 
                    formatter={(value) => [`${value} reservas`, 'Total']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#E8A020" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart */}
          <div className={`${styles.widget} ${styles.donutWidget}`}>
            <div className={styles.widgetHeader}>
              <h3>Servicios Populares</h3>
              <MoreHorizontal size={20} className={styles.moreIcon} />
            </div>
            <div className={styles.donutArea}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.donutCenterIcon}><Plane size={24} color="#0C2D1E" /></div>
            </div>
            <div className={styles.donutLegend}>
              {pieData.map((entry, idx) => (
                <div key={idx} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{backgroundColor: COLORS[idx % COLORS.length]}}></span>
                  <span className={styles.legendName}>{entry.name}</span>
                  <span className={styles.legendVal}>{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FILA 3: Listas */}
        <div className={styles.listsRow}>
          
          {/* Recent Bookings Table */}
          <div className={`${styles.widget} ${styles.tableWidget}`}>
            <div className={styles.widgetHeader}>
              <h3>Últimas Reservaciones</h3>
              <a href="#all" className={styles.linkAction}>Ver todas</a>
            </div>
            {reservations.length === 0 ? (
              <div className={styles.emptyTable}>No hay reservaciones recientes.</div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.bookingsTable}>
                  <tbody>
                    {reservations.slice(0, 5).map(res => (
                      <tr key={res.id}>
                        <td>
                          <div className={styles.tbService}>
                            <div className={styles.tbIcon}>{getIconForType(res.type)}</div>
                            <div className={styles.tbTitleBox}>
                              <span className={styles.tbTitle}>{res.title}</span>
                              <span className={styles.tbSub}>{res.type?.toUpperCase()}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.tbRoute}>
                            <span className={styles.tbTime}>{res.date || 'Sin fecha'}</span>
                            <span className={styles.tbLoc}>{res.location}</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.tbStatusWrapper}>
                            <span className={`${styles.tbStatus} ${res.status === 'Confirmado' ? styles.stGreen : styles.stYellow}`}>
                              {res.status || 'Confirmado'}
                            </span>
                          </div>
                        </td>
                        <td align="right">
                          <span className={styles.tbPrice}>{res.price || 'N/A'}</span>
                        </td>
                        <td>
                          <PDFDownloadLink
                            document={
                              <ReservationReceipt
                                reservation={res}
                                userName={user?.displayName}
                                userEmail={user?.email}
                              />
                            }
                            fileName={`comprobante-${res.id?.slice(0, 8) || 'reserva'}.pdf`}
                            className={styles.receiptDownloadBtn}
                          >
                            {({ loading }) =>
                              loading ? (
                                <Download size={14} className={styles.spinning} />
                              ) : (
                                <Download size={14} />
                              )
                            }
                          </PDFDownloadLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top Routes */}
          <div className={`${styles.widget} ${styles.routesWidget}`}>
            <div className={styles.widgetHeader}>
              <h3>Top Destinos</h3>
              <MoreHorizontal size={20} className={styles.moreIcon} />
            </div>
            <div className={styles.routesList}>
              {topRoutes.length > 0 ? topRoutes.map((r, i) => (
                <div key={i} className={styles.routeItem}>
                  <div className={styles.routeInfo}>
                    <span className={styles.routeName}>{r.name}</span>
                    <span className={styles.routeCount}>{r.count} res.</span>
                  </div>
                  <div className={styles.routeBarBg}>
                    <div className={styles.routeBarFill} style={{width: `${(r.count / reservations.length) * 100}%`, backgroundColor: COLORS[i % COLORS.length]}}></div>
                  </div>
                </div>
              )) : (
                <div className={styles.emptyTable}>Sin destinos aún.</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
