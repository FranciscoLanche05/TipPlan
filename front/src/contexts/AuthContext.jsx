// ============================================================
// Contexto de Autenticación (React Context)
// ============================================================
// Provee el estado del usuario actual a toda la aplicación.
// Envuelve la app y cualquier componente hijo puede acceder
// al usuario con useAuth().
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        const { initializeApp } = await import("firebase/app");
        const { getAuth, onAuthStateChanged } = await import("firebase/auth");
        const firebaseConfig = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
        };
        if (!firebaseConfig.apiKey) throw new Error("Firebase no configurado");
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        if (cancelled) return;

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
        });

        return unsubscribe;
      } catch (err) {
        console.warn("Firebase no está disponible:", err.message);
        if (!cancelled) setLoading(false);
      }
    };

    const cleanupPromise = initAuth();
    return () => {
      cancelled = true;
      cleanupPromise.then((unsub) => unsub?.());
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
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
