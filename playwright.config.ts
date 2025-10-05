import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 5173);
const HOST = process.env.PLAYWRIGHT_HOST ?? "127.0.0.1";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    video: "off",
  },
  projects: [
    {
      name: "mobile",
      use: { ...devices["Pixel 5"], viewport: { width: 375, height: 812 } },
    },
    {
      name: "tablet",
      use: { ...devices["iPad Air"], viewport: { width: 820, height: 1180 } },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_WEB_SERVER ?? "npm run dev -- --host 0.0.0.0 --port 5173",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120_000,
  },
});
