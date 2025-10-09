import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three")) {
              return "three";
            }
            if (id.includes("@react-three")) {
              return "react-three";
            }
            if (id.includes("framer-motion")) {
              return "framer-motion";
            }
            if (id.includes("react-router")) {
              return "react-router";
            }
            if (id.includes("@tanstack/react-query")) {
              return "react-query";
            }
          }
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    css: true,
    exclude: [...configDefaults.exclude, "playwright/**"],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
}));
