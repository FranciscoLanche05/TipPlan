// ============================================================
// Modelos — Definición de Colecciones de Firestore
// ============================================================
// Centraliza los nombres de las colecciones y sus estructuras
// para evitar errores de tipeo y tener un solo punto de verdad.
// ============================================================

export const COLLECTIONS = {
  USERS: "usuarios",
  DESTINATIONS: "destinos",
  FAQ: "preguntas_frecuentes",
  BLOG: "blog",
  ITINERARIES: "itinerarios",
  BUDGETS: "presupuestos",
  STATS: "estadisticas",
  FEATURES: "caracteristicas",
  CONTACTS: "contactos",
  RESERVATIONS: "reservaciones",
};

// Esquemas de referencia (documentación, no se validan en runtime)
// Sirven para que el equipo sepa qué campos tiene cada documento.

export const SCHEMAS = {
  destination: {
    // id: auto-generado por Firestore
    title: "", // string — nombre del destino
    location: "", // string — ciudad, país
    imageUrl: "", // string — URL de la imagen en Storage
    mapUrl: "", // string — enlace a Google Maps
    order: 0, // number — orden de aparición
    createdAt: null, // timestamp
  },

  faq: {
    question: "", // string
    answer: "", // string
    order: 0, // number
  },

  blog: {
    title: "", // string
    excerpt: "", // string — resumen corto
    content: "", // string — contenido completo
    imageUrl: "", // string
    author: "", // string
    category: "", // string
    createdAt: null, // timestamp
  },

  itinerary: {
    userId: "", // string — ref al usuario dueño
    destination: "", // string
    days: [], // array de objetos { day, activities[] }
    createdAt: null, // timestamp
    updatedAt: null, // timestamp
  },

  budget: {
    userId: "", // string
    total: 0, // number
    categories: [], // array { id, label, pct, amount }
    createdAt: null, // timestamp
  },

  user: {
    email: "", // string
    displayName: "", // string
    photoURL: "", // string
    createdAt: null, // timestamp
  },

  contact: {
    name: "", // string
    email: "", // string
    message: "", // string
    createdAt: null, // timestamp
  },
};
