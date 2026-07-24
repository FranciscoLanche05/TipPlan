// ============================================================
// Contexto de Tema (React Context)
// ============================================================
// Maneja el modo claro/oscuro de toda la aplicación.
// Persiste la preferencia en localStorage y respeta la
// preferencia del sistema operativo la primera vez que se
// visita el sitio. Aplica el atributo data-theme al <html>
// para que las variables CSS (front/src/styles/variables.css)
// cambien automáticamente en toda la app.
// ============================================================

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

const STORAGE_KEY = "tipplan-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  ).matches;
  return prefersDark ? "dark" : "light";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = (e) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    
    // Si no soporta View Transitions, cambiar normal
    if (!document.startViewTransition) {
      document.documentElement.setAttribute("data-theme", nextTheme);
      setTheme(nextTheme);
      return;
    }
    
    const transition = document.startViewTransition(() => {
      // Sincrónico: Aplicar la variable CSS inmediatamente antes de que capture el "new" frame
      document.documentElement.setAttribute("data-theme", nextTheme);
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      // La animación expande el tema nuevo (new) desde el centro hacia afuera
      const clipPath = [
        `circle(0px at 50% 50%)`,
        `circle(100vmax at 50% 50%)`
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 600,
          easing: "ease-in-out",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  const value = {
    theme,
    isDark: theme === "dark",
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
}
