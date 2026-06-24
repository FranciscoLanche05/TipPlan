// ============================================================
// Contexto de Autenticación (React Context)
// ============================================================
// Provee el estado del usuario actual a toda la aplicación.
// Envuelve la app y cualquier componente hijo puede acceder
// al usuario con useAuth().
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange } from "@back/services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios de sesión (login/logout)
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
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
