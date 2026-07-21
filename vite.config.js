import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root, "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(root, "src"),
        // Compatibility shims: let ported components keep their original
        // `next/*` import lines so markup (and the design) stays untouched.
        "next/image": path.resolve(root, "src/shared/Image.jsx"),
        "next/link": path.resolve(root, "src/shared/Link.jsx"),
        "next/navigation": path.resolve(root, "src/shared/navigation.js"),
        "next/font/google": path.resolve(root, "src/shared/fonts.js"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Split heavy, rarely-changing libraries into their own chunks so a
          // page that never charts anything doesn't pay for recharts, and so
          // these stay cached across app deploys.
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            charts: ["recharts", "chart.js", "react-chartjs-2"],
            pdf: ["jspdf", "html2canvas"],
            carousel: ["swiper", "react-slick", "react-multi-carousel"],
          },
        },
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        // Mirrors the old next.config.ts rewrite: /api/* -> Express backend
        "/api": {
          target: env.VITE_API_PROXY || "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
  };
});
