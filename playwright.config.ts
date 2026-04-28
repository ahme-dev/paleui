import { defineConfig, devices } from "@playwright/test";

// remote playwright server endpoint (set in devcontainer/CI environments)
const wsEndpoint = process.env.PW_TEST_CONNECT_WS_ENDPOINT;
const testPort = process.env.PALEUI_TEST_PORT || "4321";
const baseURL = (() => {
	if (!process.env.BASE_URL) {
		return `http://localhost:${testPort}`;
	}
	const resolvedBaseURL = new URL(process.env.BASE_URL);
	resolvedBaseURL.port = testPort;
	return resolvedBaseURL.origin;
})();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
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
      use: {
        ...devices["Desktop Safari"],
        deviceScaleFactor: 1,
      },
    },
  ],

  webServer: {
    command: `pnpm run build && PALEUI_TEST=true pnpm --filter site exec astro preview --host --port ${testPort}`,
    url: baseURL,
    timeout: 180_000,
    reuseExistingServer: false,
  },
});
