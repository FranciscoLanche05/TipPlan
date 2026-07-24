// pdfHelpers.js
// Funciones útiles para formatear datos en los documentos PDF

export const formatPrice = (price) => {
  if (!price && price !== 0) return "$0.00";
  // Si el precio ya viene como string y tiene $, lo dejamos así
  if (typeof price === "string" && price.includes("$")) return price;
  
  // Limpiamos todo caracter que no sea digito o punto
  const num = parseFloat(String(price).replace(/[^\d.-]/g, ''));
  if (isNaN(num)) return "$0.00";
  return `$${num.toFixed(2)}`;
};

export const formatDate = (dateString) => {
  if (!dateString || dateString === 'Próximamente' || dateString === 'Fechas abiertas') return 'Por confirmar';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('es-EC', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  } catch (e) {
    return dateString;
  }
};

export const getTypeLabel = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'vuelo': return 'Boleto Aéreo';
    case 'hotel': return 'Voucher de Alojamiento';
    case 'vehiculo': case 'auto': return 'Voucher de Renta de Auto';
    case 'actividad': return 'Entrada / Actividad';
    case 'restaurante': return 'Reserva de Restaurante';
    default: return 'Comprobante de Reserva';
  }
};

export const getTypeColor = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'vuelo': return '#0284c7'; // Azul
    case 'hotel': return '#7c3aed'; // Morado
    case 'vehiculo': case 'auto': return '#ea580c'; // Naranja
    case 'actividad': return '#059669'; // Verde
    case 'restaurante': return '#e11d48'; // Rojo
    default: return '#475569'; // Gris
  }
};
