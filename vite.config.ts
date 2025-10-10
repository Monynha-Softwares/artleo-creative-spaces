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
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("three") || id.includes("@react-three")) {
            return "three";
          }

          if (id.includes("framer-motion")) {
            return "framer-motion";
          }

          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (id.includes("@tanstack")) {
            return "tanstack";
          }

          if (id.includes("react-dom") || id.includes("scheduler")) {
            return "react-dom";
          }

          if (id.includes("@radix-ui")) {
            return "radix";
          }

          if (id.includes("lucide-react")) {
            return "icons";
          }

          if (id.includes("recharts")) {
            return "recharts";
          }

          if (id.includes("gsap")) {
            return "gsap";
          }

          if (id.includes("zustand")) {
            return "zustand";
          }

          if (id.includes("cmdk")) {
            return "cmdk";
          }

          if (id.includes("sonner")) {
            return "sonner";
          }

          if (id.includes("date-fns")) {
            return "date-fns";
          }

          if (id.includes("react-hook-form") || id.includes("@hookform")) {
            return "react-hook-form";
          }

          if (id.includes("zod")) {
            return "zod";
          }

          return "vendor";
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
