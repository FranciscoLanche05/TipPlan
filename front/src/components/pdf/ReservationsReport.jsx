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
  brandName: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#0c2d1e',
  },
  reportLabel: {
    fontSize: 12,
    color: '#e5a93b',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  reportDate: {
    fontSize: 9,
    color: '#8c9b90',
    textAlign: 'right',
    marginTop: 4,
  },
  clientSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 15,
    marginBottom: 25,
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
  summarySection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0c2d1e',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0c2d1e',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 8,
    color: '#8c9b90',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  breakdownSection: {
    marginBottom: 25,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    marginRight: 10,
  },
  breakdownLabel: {
    flex: 1,
    fontSize: 10,
    color: '#334155',
  },
  breakdownCount: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0c2d1e',
  },
  breakdownBarBg: {
    width: 100,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginLeft: 10,
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: 6,
    borderRadius: 3,
  },
  tableSection: {
    marginBottom: 25,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0c2d1e',
    borderRadius: 4,
    padding: 8,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableCell: {
    fontSize: 9,
    color: '#334155',
  },
  tableCellBold: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0c2d1e',
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

const COLORS = ['#1B5C3A', '#E8A020', '#0C2D1E', '#8C9B90', '#2563EB'];

const ReservationsReport = ({ reservations, userName, userEmail }) => {
  const totalSpent = reservations.reduce((sum, r) => sum + parsePrice(r.price), 0);

  const typeCounts = {};
  reservations.forEach((r) => {
    const t = r.type || 'otro';
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });
  const maxCount = Math.max(...Object.values(typeCounts), 1);

  const reportDate = formatDate({ seconds: Date.now() / 1000 });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>TipPlan</Text>
          </View>
          <View>
            <Text style={styles.reportLabel}>REPORTE DE RESERVAS</Text>
            <Text style={styles.reportDate}>Generado: {reportDate}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.clientSection}>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>Cliente:</Text>
            <Text style={styles.clientValue}>{userName || 'Viajero TipPlan'}</Text>
          </View>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>Correo:</Text>
            <Text style={styles.clientValue}>{userEmail || 'N/A'}</Text>
          </View>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>Total de reservas:</Text>
            <Text style={styles.clientValue}>{reservations.length}</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Resumen Ejecutivo</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{reservations.length}</Text>
              <Text style={styles.summaryLabel}>Reservas</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>${totalSpent.toFixed(0)}</Text>
              <Text style={styles.summaryLabel}>Gasto Total</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {Object.keys(typeCounts).length}
              </Text>
              <Text style={styles.summaryLabel}>Categorías</Text>
            </View>
          </View>
        </View>

        {/* Breakdown by Type */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Desglose por Tipo</Text>
          {Object.entries(typeCounts).map(([type, count], idx) => (
            <View key={type} style={styles.breakdownRow}>
              <View
                style={[styles.breakdownDot, { backgroundColor: COLORS[idx % COLORS.length] }]}
              />
              <Text style={styles.breakdownLabel}>{getTypeLabel(type)}</Text>
              <Text style={styles.breakdownCount}>{count}</Text>
              <View style={styles.breakdownBarBg}>
                <View
                  style={[
                    styles.breakdownBarFill,
                    {
                      width: `${(count / maxCount) * 100}%`,
                      backgroundColor: COLORS[idx % COLORS.length],
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Reservations Table */}
        <View style={styles.tableSection}>
          <Text style={styles.sectionTitle}>Detalle de Reservas</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Tipo</Text>
            <Text style={[styles.tableHeaderCell, { width: '30%' }]}>Título</Text>
            <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Ubicación</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Fecha</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'right' }]}>Precio</Text>
          </View>
          {reservations.map((r, idx) => (
            <View key={r.id || idx} style={styles.tableRow}>
              <Text style={styles.tableCellBold, { width: '15%' }}>{getTypeLabel(r.type)}</Text>
              <Text style={styles.tableCell, { width: '30%' }}>{r.title || 'N/A'}</Text>
              <Text style={styles.tableCell, { width: '25%' }}>{r.location || 'N/A'}</Text>
              <Text style={styles.tableCell, { width: '15%' }}>{r.date || 'N/A'}</Text>
              <Text style={styles.tableCellBold, { width: '15%', textAlign: 'right' }}>
                {r.price || '$0'}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>TipPlan - Sistema de Viajes EPN</Text>
          <Text style={styles.footerText}>Reporte generado automáticamente</Text>
          <Text style={styles.footerText}>{reportDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReservationsReport;
