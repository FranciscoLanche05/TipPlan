import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed, or use default Helvetica
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FAFAF5', // matches brand light theme
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '2px solid #0d2118',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    color: '#0d2118', // Brand green
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#606d66',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    border: '1px solid #e2dfd9',
  },
  summaryTitle: {
    fontSize: 10,
    color: '#606d66',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    color: '#0d2118',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#0d2118',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#e2dfd9',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#e2dfd9',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#0d2118',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#e2dfd9',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tableCell: {
    margin: 8,
    fontSize: 10,
    color: '#333333',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 10,
    borderTop: '1px solid #e2dfd9',
    paddingTop: 10,
  }
});

const ExpensesReportPDF = ({ metrics, topExpenses, categories }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>TipPlan - Reporte Financiero</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        {/* Resumen */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Invertido</Text>
            <Text style={styles.summaryValue}>${metrics.total.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total de Reservas</Text>
            <Text style={styles.summaryValue}>{metrics.count}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Promedio / Reserva</Text>
            <Text style={styles.summaryValue}>${metrics.average.toLocaleString()}</Text>
          </View>
        </View>

        {/* Desglose por Categoría */}
        <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{...styles.tableColHeader, width: '50%'}}>
              <Text style={styles.tableCellHeader}>Categoría</Text>
            </View>
            <View style={{...styles.tableColHeader, width: '50%'}}>
              <Text style={styles.tableCellHeader}>Monto Total</Text>
            </View>
          </View>
          {Object.entries(categories).map(([cat, amount], i) => (
            <View style={styles.tableRow} key={i}>
              <View style={{...styles.tableCol, width: '50%'}}>
                <Text style={styles.tableCell}>{cat.toUpperCase()}</Text>
              </View>
              <View style={{...styles.tableCol, width: '50%'}}>
                <Text style={styles.tableCell}>${amount.toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Mayores Gastos */}
        <Text style={styles.sectionTitle}>Top Mayores Gastos</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{...styles.tableColHeader, width: '40%'}}>
              <Text style={styles.tableCellHeader}>Concepto</Text>
            </View>
            <View style={{...styles.tableColHeader, width: '20%'}}>
              <Text style={styles.tableCellHeader}>Categoría</Text>
            </View>
            <View style={{...styles.tableColHeader, width: '20%'}}>
              <Text style={styles.tableCellHeader}>Fecha</Text>
            </View>
            <View style={{...styles.tableColHeader, width: '20%'}}>
              <Text style={styles.tableCellHeader}>Precio</Text>
            </View>
          </View>
          {topExpenses.map((expense, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={{...styles.tableCol, width: '40%'}}>
                <Text style={styles.tableCell}>{expense.name || expense.title || expense.aerolinea || 'Reserva'}</Text>
              </View>
              <View style={{...styles.tableCol, width: '20%'}}>
                <Text style={styles.tableCell}>{expense.type || 'N/A'}</Text>
              </View>
              <View style={{...styles.tableCol, width: '20%'}}>
                <Text style={styles.tableCell}>{expense.date || expense.startDate || 'N/A'}</Text>
              </View>
              <View style={{...styles.tableCol, width: '20%'}}>
                <Text style={styles.tableCell}>${expense.priceParsed.toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer} fixed>
          Generado automáticamente por TipPlan • Tu organizador de viajes personal
        </Text>

      </Page>
    </Document>
  );
};

export default ExpensesReportPDF;
