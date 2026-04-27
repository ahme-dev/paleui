import { defineConfig } from "astro/config";

const isTestMode = process.env.PALEUI_TEST === "true";

export default defineConfig({
	outDir: "./dist",
	publicDir: "./public",
	devToolbar: {
		enabled: !isTestMode,
	},
	server: {
		port: 3000,
		allowedHosts: true,
	},
});
