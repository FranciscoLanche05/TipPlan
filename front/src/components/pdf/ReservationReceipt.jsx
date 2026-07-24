import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { parsePrice, formatDate, getTypeLabel, getTypeColor } from '../../core/utils/pdfHelpers';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#0c2d1e',
  },
  brandSection: {
    flexDirection: 'column',
  },
  brandName: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#0c2d1e',
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 10,
    color: '#8c9b90',
    letterSpacing: 1,
  },
  receiptLabel: {
    fontSize: 12,
    color: '#e5a93b',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  receiptNumber: {
    fontSize: 9,
    color: '#8c9b90',
    textAlign: 'right',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0c2d1e',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  clientLabel: {
    fontSize: 10,
    color: '#8c9b90',
  },
  clientValue: {
    fontSize: 10,
    color: '#1a1f1c',
    fontFamily: 'Helvetica-Bold',
  },
  detailCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fdf6e7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  typeText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0c2d1e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0c2d1e',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 10,
    color: '#8c9b90',
  },
  detailValue: {
    fontSize: 10,
    color: '#1a1f1c',
  },
  priceSection: {
    backgroundColor: '#0c2d1e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: '#8c9b90',
  },
  priceValue: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#e5a93b',
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#8c9b90',
  },
});

const ReservationReceipt = ({ reservation, userName, userEmail }) => {
  const price = parsePrice(reservation?.price);
  const date = formatDate(reservation?.createdAt);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandSection}>
            <Text style={styles.brandName}>TipPlan</Text>
            <Text style={styles.brandTagline}>TUS VIAJES, NUESTRO PLAN</Text>
          </View>
          <View>
            <Text style={styles.receiptLabel}>COMPROBANTE DE RESERVA</Text>
            <Text style={styles.receiptNumber}>
              Nro: {reservation?.id?.slice(0, 12)?.toUpperCase() || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Cliente</Text>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>Nombre:</Text>
            <Text style={styles.clientValue}>{userName || 'Viajero TipPlan'}</Text>
          </View>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>Correo:</Text>
            <Text style={styles.clientValue}>{userEmail || 'N/A'}</Text>
          </View>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>Fecha de emisión:</Text>
            <Text style={styles.clientValue}>{formatDate({ seconds: Date.now() / 1000 })}</Text>
          </View>
        </View>

        {/* Reservation Detail */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de la Reserva</Text>
          <View style={styles.detailCard}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{getTypeLabel(reservation?.type)}</Text>
            </View>
            <Text style={styles.detailTitle}>{reservation?.title || 'Sin título'}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ubicación:</Text>
              <Text style={styles.detailValue}>{reservation?.location || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha:</Text>
              <Text style={styles.detailValue}>{reservation?.date || 'Sin fecha'}</Text>
            </View>
            {reservation?.airline && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Aerolínea:</Text>
                <Text style={styles.detailValue}>{reservation.airline}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total a pagar</Text>
            <Text style={styles.priceValue}>{price > 0 ? `$${price}` : 'Gratuito'}</Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusSection}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{reservation?.status || 'Confirmado'}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>TipPlan - Sistema de Viajes EPN</Text>
          <Text style={styles.footerText}>Documento generado automáticamente</Text>
          <Text style={styles.footerText}>{date}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReservationReceipt;
