// ============================================================
// Contexto de Autenticación (React Context)
// ============================================================
// Provee el estado del usuario actual a toda la aplicación,
// junto con las acciones de login, registro y logout.
// Envuelve la app y cualquier componente hijo puede acceder
// al usuario con useAuth().
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthChange,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logout as firebaseLogout,
} from "@back/services/authService";
import { update } from "@back/services/firestoreService";
import { COLLECTIONS } from "@back/models/collections";

// ─── Traducción de errores de Firebase a español ─────────────
const mapAuthError = (err) => {
  const code = err?.code || "";
  const map = {
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
    "auth/user-not-found": "No existe una cuenta con este correo.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/email-already-in-use": "Ya existe una cuenta con este correo.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/operation-not-allowed": "Operación no permitida.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
    "auth/network-request-failed": "Sin conexión. Revisa tu internet.",
    "auth/popup-closed-by-user": "Se cerró la ventana de Google.",
  };
  return map[code] || err?.message || "Ocurrió un error inesperado.";
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthChange((firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Auth context offline:", err.message);
      setLoading(false);
    }
  }, []);

  const clearError = () => setAuthError(null);

  // ─── Login con email y contraseña ──────────────────────────
  const login = async (email, password) => {
    clearError();
    try {
      const u = await loginWithEmail(email, password);
      return u;
    } catch (err) {
      setAuthError(mapAuthError(err));
      throw err;
    }
  };

  // ─── Registro: credenciales + datos personales en Firestore ─
  const register = async (email, password, displayName, profileData = {}) => {
    clearError();
    try {
      const u = await registerWithEmail(email, password, displayName);
      // Guardar datos personales adicionales en el documento del usuario
      if (Object.keys(profileData).length > 0) {
        await update(COLLECTIONS.USERS, u.uid, profileData);
      }
      return u;
    } catch (err) {
      setAuthError(mapAuthError(err));
      throw err;
    }
  };

  // ─── Login con Google ──────────────────────────────────────
  const loginGoogle = async () => {
    clearError();
    try {
      return await loginWithGoogle();
    } catch (err) {
      setAuthError(mapAuthError(err));
      throw err;
    }
  };

  // ─── Cerrar sesión ─────────────────────────────────────────
  const logout = async () => {
    clearError();
    try {
      await firebaseLogout();
    } catch (err) {
      setAuthError(mapAuthError(err));
      throw err;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    authError,
    clearError,
    login,
    register,
    loginGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar en cualquier componente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
