import { defineConfig, devices } from "@playwright/test";

// remote playwright server endpoint (set in devcontainer/CI environments)
const wsEndpoint = process.env.PW_TEST_CONNECT_WS_ENDPOINT;
// - devcontainer: http://dev:3000 
// - local/standalone: http://localhost:3000
const baseURL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",

    // connect to remote playwright server if endpoint is set
    ...(wsEndpoint && {
      connectOptions: {
        wsEndpoint,
      },
    }),
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        launchOptions: {
          firefoxUserPrefs: {
            "network.stricttransportsecurity.preloadlist": false,
            "network.proxy.allow_bypass": true,
            "network.dns.disableIPv6": false,
          },
        },
      },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});