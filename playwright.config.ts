import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  reporter: process.env.GREDA_THEME_AUDIT
    ? [["list"], ["html", { open: "never" }], ["json", { outputFile: "test-results/theme-audit.json" }]]
    : "list",
  use: {
    baseURL: "http://127.0.0.1:6007",
    browserName: "chromium",
    channel: process.env.CI ? undefined : "chrome",
    viewport: { width: 1100, height: 800 },
  },
  webServer: {
    command: "node scripts/serve-storybook.mjs",
    url: "http://127.0.0.1:6007",
    reuseExistingServer: !process.env.CI,
  },
});
