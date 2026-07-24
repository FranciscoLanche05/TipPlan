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
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

let app;
try {
  if (!isFirebaseConfigured) throw new Error("Falta API KEY o variables de entorno incompletas");
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.warn("⚠️ Firebase deshabilitado:", error.message);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// ─── Inicialización de Inteligencia Artificial (Gemini) ──────
export const ai = app ? getAI(app, { backend: new GoogleAIBackend() }) : null;

export const geminiModel = ai ? getGenerativeModel(ai, {
  model: "gemini-3.5-flash",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
  }
}) : null;

export default app;
