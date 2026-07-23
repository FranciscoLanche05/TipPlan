const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const parsePrice = (priceString) => {
  if (!priceString) return 0;
  const cleaned = priceString.replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return 'Sin fecha';
  const date = timestamp?.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);
  if (isNaN(date.getTime())) return 'Sin fecha';
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const getTypeLabel = (type) => {
  const labels = {
    vuelo: 'Vuelo',
    hotel: 'Hotel',
    auto: 'Auto',
    restaurante: 'Restaurante',
    actividad: 'Actividad',
  };
  return labels[type] || type;
};

export const getTypeColor = (type) => {
  const colors = {
    vuelo: '#1B5C3A',
    hotel: '#E8A020',
    auto: '#0C2D1E',
    restaurante: '#8C9B90',
    actividad: '#2563EB',
  };
  return colors[type] || '#0C2D1E';
};
