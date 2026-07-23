import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "TipPlan - Planifica tu aventura",
        short_name: "TipPlan",
        description: "Planifica, organiza y vive cada viaje sin complicaciones.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/pwa-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
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