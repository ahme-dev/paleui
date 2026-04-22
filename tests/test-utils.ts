import { expect, type Locator, type Page } from "@playwright/test";

export const VIEWPORTS = {
	mobile: { width: 375, height: 667 },
	tablet: { width: 768, height: 1024 },
	desktop: { width: 1920, height: 1080 },
};

export const DEFAULT_TEST_PARAMS = {
	test: "true",
};

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

export function toKebabCase(str: string | string[]) {
	const parts = Array.isArray(str) ? str : [str];
	return parts
		.map((s) =>
			s
				.split(" ")
				.map((el) => el.toLowerCase())
				.join("-"),
		)
		.join("-");
}

export async function expectVisible(locator: Locator) {
	await expect(locator).toBeVisible();
}

export async function expectSnap(
	schema: {
		meta: {
			title: string;
		};
	},
	locator: Locator,
	...parts: string[]
) {
	await locator.scrollIntoViewIfNeeded();
	await expect(locator).toHaveScreenshot(
		toKebabCase([schema.meta.title, ...parts]) + ".png",
	);
}

//
// Selectors
//

export function exLocator(page: Page, exKey: string, variant: string) {
	return page.locator(`[data-example="${exKey}"][data-variant="${variant}"]`);
}

export function acc(page: Page, exKey: string, variant: string, root: string) {
	return exLocator(page, exKey, variant).locator(root);
}

export function attrsSelector(
	htmlAttrs: Record<string, string | boolean>,
): string {
	return Object.entries(htmlAttrs)
		.map(([k, v]) => (v === true ? `[${k}]` : `[${k}="${v}"]`))
		.join("");
}
