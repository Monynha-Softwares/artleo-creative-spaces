import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
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
              return "chunk-three";
            }

            if (id.includes("framer-motion")) {
              return "chunk-framer-motion";
            }

            if (id.includes("@supabase")) {
              return "chunk-supabase";
            }

            if (id.includes("lucide-react")) {
              return "chunk-icons";
            }

            if (id.includes("@tanstack")) {
              return "chunk-query";
            }
          }

          return undefined;
        },
      },
    },
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
