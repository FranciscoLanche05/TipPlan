import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Ruta protegida:
 * - Mientras carga la sesión, muestra un spinner.
 * - Si no hay sesión, redirige a /login.
 * - Si hay sesión, renderiza las rutas hijas (Outlet).
 */
export default function ProtectedRoute() {
  const { loading, isAuthenticated, openLoginModal } = useAuth();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && !hasTriggered) {
      openLoginModal();
      setHasTriggered(true);
    }
  }, [loading, isAuthenticated, openLoginModal, hasTriggered]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-surface-alt)",
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: "4px solid var(--border-soft)",
          borderTopColor: "var(--accent-gold-strong)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
