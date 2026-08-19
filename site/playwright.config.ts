import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./browser-tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:43118",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-light",
      use: { ...devices["Desktop Chrome"], colorScheme: "light" },
    },
    {
      name: "desktop-dark",
      use: { ...devices["Desktop Chrome"], colorScheme: "dark" },
    },
    {
      name: "mobile-light",
      use: { ...devices["Pixel 7"], colorScheme: "light" },
    },
  ],
  webServer: {
    command: "node ./node_modules/vite/bin/vite.js preview --config vite.static.config.ts --host 127.0.0.1 --port 43118",
    url: "http://127.0.0.1:43118",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
