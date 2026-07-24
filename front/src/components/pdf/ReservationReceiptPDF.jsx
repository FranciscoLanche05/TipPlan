import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatPrice, formatDate, getTypeLabel, getTypeColor } from '../../core/utils/pdfHelpers';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#f8fafc',
    fontFamily: 'Helvetica',
  },
  ticketContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  receiptType: {
    fontSize: 12,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  body: {
    padding: 25,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    borderTopStyle: 'dashed',
    marginVertical: 15,
  },
  footer: {
    backgroundColor: '#f1f5f9',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 9,
    color: '#94a3b8',
    textAlign: 'center',
  }
});

const ReservationReceiptPDF = ({ reservation, tripTitle }) => {
  const themeColor = getTypeColor(reservation.type);

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        <View style={styles.ticketContainer}>
          
          <View style={[styles.header, { backgroundColor: themeColor, borderBottomColor: themeColor }]}>
            <Text style={styles.logoText}>TipPlan</Text>
            <Text style={styles.receiptType}>{getTypeLabel(reservation.type)}</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.title}>{reservation.name || reservation.title || reservation.aerolinea || 'Reserva'}</Text>
            
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Destino / Locación</Text>
                <Text style={styles.value}>{reservation.location || 'Por definir'}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Fecha</Text>
                <Text style={styles.value}>{formatDate(reservation.date || reservation.startDate)}</Text>
              </View>
            </View>

            {tripTitle && (
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Viaje Asociado</Text>
                  <Text style={styles.value}>{tripTitle}</Text>
                </View>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Titular de la reserva</Text>
                <Text style={styles.value}>Registrado en plataforma</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Estado</Text>
                <Text style={[styles.value, { color: '#059669' }]}>Confirmado</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.statusBadge}>Comprobante Electrónico</Text>
            <Text style={styles.price}>{formatPrice(reservation.price || reservation.precio || reservation.precioNoche || reservation.precioDia)}</Text>
          </View>

        </View>

        <Text style={styles.disclaimer}>Este comprobante es generado por TipPlan y sirve como referencia de la planificación del usuario. No reemplaza el boarding pass o confirmación oficial del proveedor.</Text>
      </Page>
    </Document>
  );
};

export default ReservationReceiptPDF;
