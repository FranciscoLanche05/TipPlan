import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, RadialLinearScale } from 'chart.js';
import { Doughnut, Bar, Line, PolarArea } from 'react-chartjs-2';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import ExpensesReportPDF from '../../pdf/ExpensesReportPDF';
import styles from './MetricsDashboard.module.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, RadialLinearScale);

const MetricsDashboard = ({ data, trips }) => {

  const { metrics, categories, topExpenses, tripExpenses, timelineData, countByCategory } = useMemo(() => {
    let total = 0;
    const catMap = {};
    const countMap = {};
    const tripMap = {};
    const timeMap = {};
    const validExpenses = [];

    data.forEach(res => {
      let price = 0;
      if (res.price) {
        const num = parseFloat(String(res.price).replace(/[^\d.-]/g, ''));
        if (!isNaN(num)) price = num;
      } else if (res.precio || res.precioNoche || res.precioDia) {
        const num = parseFloat(res.precio || res.precioNoche || res.precioDia);
        if (!isNaN(num)) price = num;
      }
      
      total += price;
      validExpenses.push({ ...res, priceParsed: price });

      const type = res.type || 'otros';
      catMap[type] = (catMap[type] || 0) + price;
      countMap[type] = (countMap[type] || 0) + 1;

      if (res.tripId) {
        tripMap[res.tripId] = (tripMap[res.tripId] || 0) + price;
      }

      // Timeline logic
      if (res.date || res.startDate) {
        const dStr = res.date || res.startDate;
        let monthKey = 'Sin Fecha';
        
        // Try parsing DD/MM/YYYY or YYYY-MM-DD
        let d = new Date(dStr);
        if (isNaN(d.getTime())) {
          // Si es un formato raro o dice 'Fechas abiertas', no usamos gráfica de tiempo real para este, 
          // pero trataremos de agregarlo a 'Pendientes'.
          monthKey = 'Pendiente/Abierto';
        } else {
          monthKey = d.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
        }
        timeMap[monthKey] = (timeMap[monthKey] || 0) + price;
      } else {
        timeMap['Pendiente/Abierto'] = (timeMap['Pendiente/Abierto'] || 0) + price;
      }
    });

    const count = validExpenses.length;
    const average = count > 0 ? total / count : 0;

    // Top 5 expenses
    const top = [...validExpenses].sort((a, b) => b.priceParsed - a.priceParsed).slice(0, 5);

    // Map trip IDs to names
    const mappedTrips = {};
    Object.entries(tripMap).forEach(([id, cost]) => {
      const trip = trips?.find(t => t.id === id);
      const name = trip?.title || 'Viaje General';
      mappedTrips[name] = (mappedTrips[name] || 0) + cost;
    });

    return { 
      metrics: { total, count, average: Math.round(average) },
      categories: catMap,
      topExpenses: top,
      tripExpenses: mappedTrips,
      timelineData: timeMap,
      countByCategory: countMap
    };
  }, [data, trips]);

  // Chart Data
  const brandColors = [
    '#0d2118', // dark green
    '#e5a93b', // gold
    '#f4a02c', // strong gold
    '#166534', // success green
    '#94a3b8', // muted grey
    '#0284c7', // blue
  ];

  const pieData = {
    labels: Object.keys(categories).map(k => k.toUpperCase()),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: brandColors,
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: Object.keys(tripExpenses),
    datasets: [
      {
        label: 'Gasto Total ($)',
        data: Object.values(tripExpenses),
        backgroundColor: '#e5a93b',
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: 'var(--text-secondary)' } }
    }
  };

  const lineData = {
    labels: Object.keys(timelineData),
    datasets: [
      {
        label: 'Gasto Mensual ($)',
        data: Object.values(timelineData),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  const polarData = {
    labels: Object.keys(countByCategory).map(k => k.toUpperCase()),
    datasets: [
      {
        label: 'Cantidad de Reservas',
        data: Object.values(countByCategory),
        backgroundColor: brandColors.map(c => c + '80'), // Add transparency
        borderWidth: 1,
      }
    ]
  };

  const polarOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Botón de Descarga PDF */}
      <PDFDownloadLink 
        document={<ExpensesReportPDF metrics={metrics} topExpenses={topExpenses} categories={categories} />} 
        fileName="TipPlan_Reporte_Financiero.pdf"
        className={styles.pdfDownloadBtn}
      >
        {({ loading }) => (
          <>
            <Download size={16} />
            {loading ? 'Generando PDF...' : 'Descargar Reporte (PDF)'}
          </>
        )}
      </PDFDownloadLink>

      {/* Tarjetas de Resumen */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryTitle}>Gasto Total</div>
          <div className={styles.summaryValue}>${metrics.total.toLocaleString()}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryTitle}>Total de Reservas</div>
          <div className={styles.summaryValue}>{metrics.count}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryTitle}>Promedio / Reserva</div>
          <div className={styles.summaryValue}>${metrics.average.toLocaleString()}</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Gastos por Categoría</div>
          <div className={styles.chartContent}>
            {Object.keys(categories).length > 0 ? (
              <Doughnut data={pieData} options={pieOptions} />
            ) : (
              <p>No hay datos</p>
            )}
          </div>
        </div>

        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Gastos por Viaje</div>
          <div className={styles.chartContent}>
            {Object.keys(tripExpenses).length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <p>No hay datos agrupados por viaje</p>
            )}
          </div>
        </div>
        
        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Flujo de Gastos en el Tiempo</div>
          <div className={styles.chartContent}>
            {Object.keys(timelineData).length > 0 ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <p>No hay fechas registradas</p>
            )}
          </div>
        </div>

        <div className={styles.chartBox}>
          <div className={styles.chartTitle}>Volumen de Transacciones por Categoría</div>
          <div className={styles.chartContent}>
            {Object.keys(countByCategory).length > 0 ? (
              <PolarArea data={polarData} options={polarOptions} />
            ) : (
              <p>No hay datos</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MetricsDashboard;
