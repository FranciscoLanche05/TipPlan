import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias para importar desde la carpeta back/
      "@back": path.resolve(__dirname, "../back"),
      // Asegurar que firebase se resuelva desde front/node_modules
      "firebase/app": path.resolve(__dirname, "node_modules/firebase/app"),
      "firebase/auth": path.resolve(__dirname, "node_modules/firebase/auth"),
      "firebase/firestore": path.resolve(__dirname, "node_modules/firebase/firestore"),
      "firebase/storage": path.resolve(__dirname, "node_modules/firebase/storage"),
    },
  },
  server: {
    fs: {
      allow: [
        path.resolve(__dirname),
        path.resolve(__dirname, "../back"),
      ],
    },
  },
});