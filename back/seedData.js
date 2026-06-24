// ============================================================
// Script de Migración — Sube data estática a Firestore
// ============================================================
// Ejecuta este archivo UNA VEZ desde la consola del navegador
// o importándolo temporalmente para poblar Firestore con los
// datos que antes estaban hardcodeados en archivos .js
// ============================================================

import { batchCreate } from "./services/firestoreService";
import { COLLECTIONS } from "./models/collections";

// ─── Datos de Destinos ───────────────────────────────────────
const destinationsData = [
  {
    title: "Virgen del Panecillo",
    location: "QUITO, ECUADOR",
    imageUrl: "/imagenes/panecillo_11zon.webp",
    mapUrl: "https://maps.google.com/?q=Virgen+del+Panecillo+Quito",
    order: 1,
  },
  {
    title: "Mitad del Mundo",
    location: "QUITO, ECUADOR",
    imageUrl: "/imagenes/mitad_mundog_11zon.webp",
    mapUrl: "https://maps.google.com/?q=Mitad+del+Mundo+Quito",
    order: 2,
  },
  {
    title: "Basílica del Voto Nacional",
    location: "QUITO, ECUADOR",
    imageUrl: "/imagenes/basilica_11zon.webp",
    mapUrl: "https://maps.google.com/?q=Basilica+del+Voto+Nacional+Quito",
    order: 3,
  },
  {
    title: "Malecón 2000",
    location: "GUAYAQUIL, ECUADOR",
    imageUrl: "/imagenes/malecon_11zon.webp",
    mapUrl: "https://maps.google.com/?q=Malecon+2000+Guayaquil",
    order: 4,
  },
];

// ─── Datos de Preguntas Frecuentes ───────────────────────────
const faqData = [
  {
    question: "¿Cuánto tiempo antes debo planificar mi viaje?",
    answer:
      "Recomendamos planificar tu viaje con al menos 2-3 meses de anticipación para obtener mejores precios en vuelos y alojamientos. Sin embargo, TipPlan puede ayudarte a organizar viajes en cualquier momento.",
    order: 1,
  },
  {
    question: "¿Puedo personalizar mi itinerario en TipPlan?",
    answer:
      "¡Claro! TipPlan te permite personalizar completamente tu itinerario. Puedes ajustar las fechas, duración, destino y presupuesto según tus preferencias.",
    order: 2,
  },
  {
    question: "¿Hay algún costo por usar TipPlan?",
    answer:
      "TipPlan es completamente gratuito. No cobras nada por crear y personalizar tus itinerarios de viaje.",
    order: 3,
  },
  {
    question: "¿TipPlan tiene información actualizada?",
    answer:
      "Sí, actualizamos constantemente nuestra base de datos de destinos, precios y recomendaciones para ofrecerte la información más reciente.",
    order: 4,
  },
  {
    question: "¿Qué destinos internacionales están disponibles?",
    answer:
      "Tenemos una amplia selección de destinos internacionales populares. Puedes explorar nuestro catálogo completo en la sección de destinos.",
    order: 5,
  },
  {
    question: "¿TipPlan estará disponible como app móvil?",
    answer:
      "Sí, estamos trabajando en una versión móvil de TipPlan que estará disponible próximamente en Google Play y App Store.",
    order: 6,
  },
];

// ─── Lista de destinos para el buscador del Header ───────────
const searchDestinations = [
  { name: "París, Francia", order: 1 },
  { name: "Barcelona, España", order: 2 },
  { name: "Roma, Italia", order: 3 },
  { name: "Amsterdam, Países Bajos", order: 4 },
  { name: "Berlín, Alemania", order: 5 },
  { name: "Londres, Reino Unido", order: 6 },
  { name: "Estambul, Turquía", order: 7 },
  { name: "Cancún, México", order: 8 },
  { name: "Nueva York, Estados Unidos", order: 9 },
  { name: "Tokio, Japón", order: 10 },
  { name: "Bangkok, Tailandia", order: 11 },
  { name: "Dubái, Emiratos Árabes", order: 12 },
];

// ─── Ejecutar Migración ──────────────────────────────────────
export const runMigration = async () => {
  try {
    console.log("🚀 Iniciando migración de datos a Firestore...");

    console.log("  📍 Migrando destinos...");
    await batchCreate(COLLECTIONS.DESTINATIONS, destinationsData);

    console.log("  ❓ Migrando preguntas frecuentes...");
    await batchCreate(COLLECTIONS.FAQ, faqData);

    console.log("  🔍 Migrando destinos del buscador...");
    await batchCreate("destinos_buscador", searchDestinations);

    console.log("✅ ¡Migración completada exitosamente!");
    return true;
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    return false;
  }
};
