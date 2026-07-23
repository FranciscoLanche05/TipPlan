// ============================================================
// Firebase — Configuración Central
// ============================================================
// Este archivo inicializa Firebase y exporta las instancias
// de los servicios: Auth y Firestore.
// (Storage deshabilitado — requiere plan Blaze.)
// Las credenciales se leen del archivo .env de la raíz.
// ============================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

// Firebase es opcional durante el desarrollo local si todavía no existe .env.
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

// Exportar instancias de cada servicio
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export { isFirebaseConfigured };
// Inicialización segura que no rompe la app si faltan credenciales (ej. en Vercel)
let app;
try {
  if (!firebaseConfig.apiKey) throw new Error("Falta API KEY");
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.warn("⚠️ Firebase deshabilitado:", error.message);
}

// Exportar instancias nulas si Firebase no pudo inicializarse
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export default app;
