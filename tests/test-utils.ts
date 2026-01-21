export const DEMO = "[data-to-code]";

export const VIEWPORTS = {
	mobile: { width: 375, height: 667 },
	tablet: { width: 768, height: 1024 },
	desktop: { width: 1920, height: 1080 },
};

export const DEFAULT_TEST_PARAMS = {
	test: "true",
};

/**
 * Build a URL with optional query parameters

 * @example
 * // Use default test params
 * buildUrl("/components/button.html")
 * // => "/components/button.html?test=true"
 *
 * @example
 * // Override with custom params
 * buildUrl("/components/button.html", { test: "true", theme: "dark" })
 * // => "/components/button.html?test=true&theme=dark"
 *
 * @example
 * // No params
 * buildUrl("/components/button.html", {})
 * // => "/components/button.html"
 */
export function buildUrl(
	path: string,
	params: Record<string, string> = DEFAULT_TEST_PARAMS,
): string {
	if (!params || Object.keys(params).length === 0) {
		return path;
	}

	const url = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		url.set(key, value);
	});

	const queryString = url.toString();
	return queryString ? `${path}?${queryString}` : path;
}
