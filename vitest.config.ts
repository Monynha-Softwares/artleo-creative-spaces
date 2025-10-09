import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  typeof viteConfig === "function" ? viteConfig({ mode: "test", command: "test" }) : viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./vitest.setup.ts"],
      css: true,
      include: ["src/**/*.{test,spec}.{ts,tsx}"]
    },
  }),
);
