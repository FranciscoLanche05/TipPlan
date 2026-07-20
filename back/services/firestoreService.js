// ============================================================
// Servicio de Base de Datos (Firestore)
// ============================================================
// Operaciones CRUD genéricas + funciones específicas para
// cada colección del proyecto.
// ============================================================

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../models/collections";

// ═══════════════════════════════════════════════════════════════
// OPERACIONES GENÉRICAS (reutilizables para cualquier colección)
// ═══════════════════════════════════════════════════════════════

// ─── Obtener todos los documentos de una colección ───────────
export const getAll = async (collectionName, orderField = "createdAt") => {
  const q = query(collection(db, collectionName), orderBy(orderField, "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ─── Obtener un documento por ID ─────────────────────────────
export const getById = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

// ─── Crear un documento nuevo ────────────────────────────────
export const create = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// ─── Actualizar un documento ─────────────────────────────────
export const update = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// ─── Eliminar un documento ───────────────────────────────────
export const remove = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

// ─── Escritura por lotes (batch) ─────────────────────────────
// Útil para migrar datos estáticos o hacer varias escrituras atómicas.
export const batchCreate = async (collectionName, dataArray) => {
  const batch = writeBatch(db);
  dataArray.forEach((item) => {
    const docRef = doc(collection(db, collectionName));
    batch.set(docRef, { ...item, createdAt: serverTimestamp() });
  });
  await batch.commit();
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES ESPECÍFICAS POR COLECCIÓN
// ═══════════════════════════════════════════════════════════════

// ─── Destinos ────────────────────────────────────────────────
export const getDestinations = () => getAll(COLLECTIONS.DESTINATIONS, "order");
export const addDestination = (data) => create(COLLECTIONS.DESTINATIONS, data);
export const updateDestination = (id, data) =>
  update(COLLECTIONS.DESTINATIONS, id, data);
export const deleteDestination = (id) =>
  remove(COLLECTIONS.DESTINATIONS, id);

// ─── Preguntas Frecuentes ────────────────────────────────────
export const getFAQs = () => getAll(COLLECTIONS.FAQ, "order");
export const addFAQ = (data) => create(COLLECTIONS.FAQ, data);
export const updateFAQ = (id, data) => update(COLLECTIONS.FAQ, id, data);
export const deleteFAQ = (id) => remove(COLLECTIONS.FAQ, id);

// ─── Blog ────────────────────────────────────────────────────
export const getBlogPosts = () => getAll(COLLECTIONS.BLOG, "createdAt");
export const getBlogPost = (id) => getById(COLLECTIONS.BLOG, id);
export const addBlogPost = (data) => create(COLLECTIONS.BLOG, data);
export const updateBlogPost = (id, data) =>
  update(COLLECTIONS.BLOG, id, data);
export const deleteBlogPost = (id) => remove(COLLECTIONS.BLOG, id);

// ─── Itinerarios (por usuario) ───────────────────────────────
export const getUserItineraries = async (userId) => {
  const q = query(
    collection(db, COLLECTIONS.ITINERARIES),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const saveItinerary = (data) => create(COLLECTIONS.ITINERARIES, data);
export const updateItinerary = (id, data) =>
  update(COLLECTIONS.ITINERARIES, id, data);
export const deleteItinerary = (id) =>
  remove(COLLECTIONS.ITINERARIES, id);

// ─── Presupuestos (por usuario) ──────────────────────────────
export const getUserBudgets = async (userId) => {
  const q = query(
    collection(db, COLLECTIONS.BUDGETS),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const saveBudget = (data) => create(COLLECTIONS.BUDGETS, data);
export const updateBudget = (id, data) =>
  update(COLLECTIONS.BUDGETS, id, data);
export const deleteBudget = (id) => remove(COLLECTIONS.BUDGETS, id);

// ─── Contacto ────────────────────────────────────────────────
export const sendContactMessage = (data) =>
  create(COLLECTIONS.CONTACTS, data);

// ─── Estadísticas ────────────────────────────────────────────
export const getStats = () => getAll(COLLECTIONS.STATS, "order");

// ─── Reservaciones (Vuelos, Hoteles, Autos, Restaurantes, etc) ───
export const getUserReservations = async (userId) => {
  const q = query(
    collection(db, COLLECTIONS.RESERVATIONS),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const saveReservation = (data) => create(COLLECTIONS.RESERVATIONS, data);
export const updateReservation = (id, data) => update(COLLECTIONS.RESERVATIONS, id, data);
export const deleteReservation = (id) => remove(COLLECTIONS.RESERVATIONS, id);
