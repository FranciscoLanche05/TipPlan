// ============================================================
// Barrel Export — Backend
// ============================================================
// Punto de entrada único para importar cualquier servicio
// del backend desde el frontend.
//
// Uso: import { loginWithEmail, getDestinations } from "../backend";
// ============================================================

// Configuración
export { auth, db, storage } from "./config/firebase";

// Modelos
export { COLLECTIONS, SCHEMAS } from "./models/collections";

// Servicios de Autenticación
export {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logout,
  onAuthChange,
} from "./services/authService";

// Servicios de Base de Datos (Firestore)
export {
  getAll,
  getById,
  create,
  update,
  remove,
  batchCreate,
  getDestinations,
  addDestination,
  updateDestination,
  deleteDestination,
  getFAQs,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  getBlogPosts,
  getBlogPost,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getUserItineraries,
  saveItinerary,
  updateItinerary,
  deleteItinerary,
  getUserBudgets,
  saveBudget,
  updateBudget,
  deleteBudget,
  sendContactMessage,
  getStats,
} from "./services/firestoreService";

// Servicios de Almacenamiento (Storage)
export {
  uploadFile,
  getFileURL,
  deleteFile,
  listFiles,
} from "./services/storageService";

// Migración de datos
export { runMigration } from "./seedData";
