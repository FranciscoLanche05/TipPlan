// ============================================================
// Servicio de Autenticación (Firebase Auth)
// ============================================================
// Funciones para registro, login, logout y observar el estado
// de la sesión del usuario.
// ============================================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { COLLECTIONS } from "../models/collections";

// ─── Registro con Email y Contraseña ─────────────────────────
export const registerWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Actualizar el perfil con el nombre
  await updateProfile(user, { displayName });

  // Crear documento de usuario en Firestore
  await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
    email: user.email,
    displayName,
    photoURL: user.photoURL || "",
    createdAt: serverTimestamp(),
  });

  return user;
};

// ─── Login con Email y Contraseña ────────────────────────────
export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// ─── Login con Google ────────────────────────────────────────
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Crear/actualizar documento del usuario en Firestore
  await setDoc(
    doc(db, COLLECTIONS.USERS, user.uid),
    {
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
    },
    { merge: true } // No sobreescribir si ya existe
  );

  return user;
};

// ─── Login con Facebook (Demo por ahora) ─────────────────────
export const loginWithFacebook = async () => {
  // Simulación de modo demo para Facebook
  console.log("Iniciando sesión con Facebook (Modo Demo)");
  throw new Error("El inicio de sesión con Facebook está en modo demostración y requiere configuración adicional en Meta for Developers.");
};

// ─── Verificar si el correo ya está registrado ────────────────
export const checkEmailExists = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (err) {
    // Si la enumeración de emails está protegida en Firebase, lanzará un error.
    // En ese caso no podemos verificar y asumiremos que puede continuar para ver qué pasa.
    console.warn("No se pudo verificar el email, puede que la protección de enumeración esté activa:", err);
    return null; // Null indica que no se pudo determinar
  }
};

// ─── Cerrar Sesión ───────────────────────────────────────────
export const logout = async () => {
  await signOut(auth);
};

// ─── Observador de Estado de Autenticación ───────────────────
// Úsalo en un useEffect para saber si el usuario está logueado.
export const onAuthChange = (callback) => {
  if (!auth) throw new Error("Servicio de autenticación no inicializado");
  return onAuthStateChanged(auth, callback);
};
