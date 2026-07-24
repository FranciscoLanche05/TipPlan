import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { formatPrice, formatDate, getTypeLabel, getTypeColor } from '../../core/utils/pdfHelpers';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#f4a02c',
    paddingBottom: 10,
  },
  appLogo: {
    fontSize: 24,
    color: '#0a1712',
    fontWeight: 'bold',
  },
  appLogoHighlight: {
    color: '#f4a02c',
  },
  title: {
    fontSize: 28,
    color: '#0a1712',
    marginTop: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 5,
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f2ea',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 14,
    color: '#0a1712',
    marginTop: 4,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#0a1712',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5,
  },
  resCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  resTypeBar: {
    width: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  resContent: {
    flex: 1,
  },
  resTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0a1712',
  },
  resDetails: {
    flexDirection: 'row',
    marginTop: 6,
  },
  resText: {
    fontSize: 10,
    color: '#475569',
    marginRight: 15,
  },
  resPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0a1712',
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  }
});

const TripItineraryPDF = ({ trip, reservations }) => {
  const totalSpent = reservations.reduce((sum, res) => {
    const num = parseFloat(String(res.price || res.precio || res.precioNoche || res.precioDia || '0').replace(/[^\d.-]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.appLogo}>Tip<Text style={styles.appLogoHighlight}>Plan</Text></Text>
          <Text style={styles.title}>{trip.title || 'Viaje Sin Nombre'}</Text>
          <Text style={styles.subtitle}>Destino: {trip.destination || 'Por definir'}</Text>
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Fecha de Inicio</Text>
            <Text style={styles.summaryValue}>{formatDate(trip.startDate)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Fecha de Fin</Text>
            <Text style={styles.summaryValue}>{formatDate(trip.endDate)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total de Reservas</Text>
            <Text style={styles.summaryValue}>{reservations.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Costo Acumulado</Text>
            <Text style={styles.summaryValue}>{formatPrice(totalSpent)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Desglose del Itinerario</Text>

        {reservations.length > 0 ? (
          reservations.map((res, idx) => (
            <View key={idx} style={styles.resCard}>
              <View style={[styles.resTypeBar, { backgroundColor: getTypeColor(res.type) }]} />
              <View style={styles.resContent}>
                <Text style={styles.resTitle}>{res.name || res.title || res.aerolinea || 'Reserva'}</Text>
                <Text style={{ fontSize: 10, color: getTypeColor(res.type), marginTop: 2 }}>{getTypeLabel(res.type)}</Text>
                <View style={styles.resDetails}>
                  <Text style={styles.resText}>Locación: {res.location || trip.destination}</Text>
                  <Text style={styles.resText}>Fecha: {formatDate(res.date || res.startDate || trip.startDate)}</Text>
                </View>
              </View>
              <Text style={styles.resPrice}>{formatPrice(res.price || res.precio || res.precioNoche || res.precioDia)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Aún no hay reservas registradas para este viaje.</Text>
        )}

        <View style={styles.footer}>
          <Text>Este documento fue generado automáticamente por TipPlan.</Text>
          <Text>Para gestionar tus reservas, visita nuestra plataforma web.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TripItineraryPDF;
