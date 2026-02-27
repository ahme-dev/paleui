import { defineConfig } from "astro/config";

export default defineConfig({
	outDir: "./dist",
	publicDir: "./public",
	server: {
		port: 3000,
		allowedHosts: true,
	},
});
