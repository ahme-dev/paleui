import {
	type Browser,
	type BrowserContext,
	type BrowserContextOptions,
	expect,
	type Locator,
	type Page,
} from "@playwright/test";

export const VIEWPORTS = {
	mobile: { width: 375, height: 667 },
	tablet: { width: 768, height: 1024 },
	desktop: { width: 1920, height: 1080 },
};

export const DEFAULT_TEST_PARAMS = {
	test: "true",
};

const DEFAULT_SNAPSHOT_PADDING = 8;
const DEFAULT_SNAPSHOT_MAX_DIFF_PIXELS = 250;
const DEFAULT_TEST_PORT = process.env.PALEUI_TEST_PORT || "4321";
const DEFAULT_BASE_URL =
	process.env.PW_BROWSER_BASE_URL ||
	process.env.BASE_URL ||
	`http://localhost:${DEFAULT_TEST_PORT}`;

type SnapshotSchema = {
	meta: {
		title: string;
	};
};

type ViewportSize = { width: number; height: number };

async function waitForPageToSettle(page: Page) {
	await page.waitForLoadState("networkidle");
	await page.evaluate(async () => {
		if ("fonts" in document) {
			await document.fonts.ready;
		}
		await new Promise<void>((resolve) =>
			requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
		);
	});
}

async function clearPageFocus(page: Page) {
	await page.mouse.move(0, 0);
	await page.evaluate(() => {
		window.scrollTo(0, 0);
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
	});
}

async function locatorIsFocused(locator: Locator) {
	return locator.evaluate((element) => element === document.activeElement);
}

function getClipBounds(
	page: Page,
	box: NonNullable<Awaited<ReturnType<Locator["boundingBox"]>>>,
	padding: number,
) {
	const viewport = page.viewportSize();
	if (!viewport) {
		throw new Error("Could not determine viewport size for screenshot.");
	}

	const left = Math.max(0, Math.floor(box.x - padding));
	const top = Math.max(0, Math.floor(box.y - padding));
	const right = Math.min(
		viewport.width,
		Math.ceil(box.x + box.width + padding),
	);
	const bottom = Math.min(
		viewport.height,
		Math.ceil(box.y + box.height + padding),
	);

	return {
		x: left,
		y: top,
		width: Math.max(1, right - left),
		height: Math.max(1, bottom - top),
	};
}

export function buildUrl(
	path: string,
	params: Record<string, string> = DEFAULT_TEST_PARAMS,
): string {
	if (!params || Object.keys(params).length === 0) {
		return path;
	}

	const queryString = new URLSearchParams(params).toString();
	return queryString ? `${path}?${queryString}` : path;
}

export async function openSharedPage(
	browser: Browser,
	path: string,
	viewport: ViewportSize,
	projectUse: Record<string, unknown> = {},
): Promise<{ context: BrowserContext; page: Page }> {
	const {
		acceptDownloads,
		bypassCSP,
		colorScheme,
		contrast,
		deviceScaleFactor,
		extraHTTPHeaders,
		forcedColors,
		geolocation,
		hasTouch,
		httpCredentials,
		ignoreHTTPSErrors,
		isMobile,
		javaScriptEnabled,
		locale,
		offline,
		permissions,
		proxy,
		reducedMotion,
		serviceWorkers,
		storageState,
		timezoneId,
		userAgent,
	} = projectUse;
	const contextOptions: BrowserContextOptions = {
		baseURL: DEFAULT_BASE_URL,
		viewport,
		acceptDownloads:
			typeof acceptDownloads === "boolean" ? acceptDownloads : undefined,
		bypassCSP: typeof bypassCSP === "boolean" ? bypassCSP : undefined,
		colorScheme:
			colorScheme === "light" ||
			colorScheme === "dark" ||
			colorScheme === "no-preference"
				? colorScheme
				: undefined,
		contrast:
			contrast === "more" || contrast === "no-preference"
				? contrast
				: undefined,
		deviceScaleFactor:
			typeof deviceScaleFactor === "number" ? deviceScaleFactor : undefined,
		extraHTTPHeaders:
			extraHTTPHeaders && typeof extraHTTPHeaders === "object"
				? (extraHTTPHeaders as Record<string, string>)
				: undefined,
		forcedColors:
			forcedColors === "active" || forcedColors === "none"
				? forcedColors
				: undefined,
		geolocation:
			geolocation && typeof geolocation === "object"
				? (geolocation as BrowserContextOptions["geolocation"])
				: undefined,
		hasTouch: typeof hasTouch === "boolean" ? hasTouch : undefined,
		httpCredentials:
			httpCredentials && typeof httpCredentials === "object"
				? (httpCredentials as BrowserContextOptions["httpCredentials"])
				: undefined,
		ignoreHTTPSErrors:
			typeof ignoreHTTPSErrors === "boolean" ? ignoreHTTPSErrors : undefined,
		isMobile: typeof isMobile === "boolean" ? isMobile : undefined,
		javaScriptEnabled:
			typeof javaScriptEnabled === "boolean" ? javaScriptEnabled : undefined,
		locale: typeof locale === "string" ? locale : undefined,
		offline: typeof offline === "boolean" ? offline : undefined,
		permissions: Array.isArray(permissions) ? permissions : undefined,
		proxy:
			proxy && typeof proxy === "object"
				? (proxy as BrowserContextOptions["proxy"])
				: undefined,
		reducedMotion:
			reducedMotion === "reduce" || reducedMotion === "no-preference"
				? reducedMotion
				: undefined,
		serviceWorkers:
			serviceWorkers === "allow" || serviceWorkers === "block"
				? serviceWorkers
				: undefined,
		storageState:
			typeof storageState === "string" || typeof storageState === "object"
				? (storageState as BrowserContextOptions["storageState"])
				: undefined,
		timezoneId: typeof timezoneId === "string" ? timezoneId : undefined,
		userAgent: typeof userAgent === "string" ? userAgent : undefined,
	};
	const context = await browser.newContext({
		...contextOptions,
	});
	const page = await context.newPage();
	await page.goto(buildUrl(path));
	await waitForPageToSettle(page);
	return { context, page };
}

export async function resetSharedPage(page: Page) {
	await clearPageFocus(page);
}

export async function focusByKeyboard(
	page: Page,
	locator: Locator,
	maxTabs: number = 200,
) {
	await resetSharedPage(page);

	for (let i = 0; i < maxTabs; i++) {
		await page.keyboard.press("Tab");
		if (await locatorIsFocused(locator)) return;
	}

	throw new Error("Could not focus locator via keyboard navigation.");
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

function isPage(value: Page | SnapshotSchema): value is Page {
	return typeof (value as Page).viewportSize === "function";
}

async function expectClippedSnap(
	page: Page,
	schema: SnapshotSchema,
	locator: Locator,
	padding: number,
	...parts: string[]
) {
	await waitForPageToSettle(page);
	await locator.scrollIntoViewIfNeeded();

	const box = await locator.boundingBox();
	if (!box) {
		throw new Error("Could not determine screenshot bounds for locator.");
	}

	const image = await page.screenshot({
		animations: "disabled",
		caret: "hide",
		clip: getClipBounds(page, box, padding),
	});

	await expect(image).toMatchSnapshot(
		toKebabCase([schema.meta.title, ...parts]) + ".png",
		{ maxDiffPixels: DEFAULT_SNAPSHOT_MAX_DIFF_PIXELS },
	);
}

export async function expectSnap(
	page: Page,
	schema: SnapshotSchema,
	locator: Locator,
	...parts: string[]
): Promise<void>;
export async function expectSnap(
	schema: SnapshotSchema,
	locator: Locator,
	...parts: string[]
): Promise<void>;
export async function expectSnap(
	arg1: Page | SnapshotSchema,
	arg2: SnapshotSchema | Locator,
	arg3: Locator | string,
	...parts: string[]
) {
	if (isPage(arg1)) {
		return expectClippedSnap(
			arg1,
			arg2 as SnapshotSchema,
			arg3 as Locator,
			DEFAULT_SNAPSHOT_PADDING,
			...parts,
		);
	}

	const locator = arg2 as Locator & { page?: () => Page };
	if (typeof locator.page !== "function") {
		throw new Error("Expected locator.page() support for padded screenshots.");
	}

	return expectClippedSnap(
		locator.page(),
		arg1,
		locator,
		DEFAULT_SNAPSHOT_PADDING,
		arg3 as string,
		...parts,
	);
}

export async function expectPaddedSnap(
	page: Page,
	schema: SnapshotSchema,
	locator: Locator,
	padding: number,
	...parts: string[]
) {
	return expectClippedSnap(page, schema, locator, padding, ...parts);
}

export function exLocator(
	page: Page,
	component: string,
	exKey: string,
	variant: string,
) {
	return page.locator(
		`[data-component="${component}"][data-example="${exKey}"][data-variant="${variant}"]`,
	);
}

export function acc(
	page: Page,
	component: string,
	exKey: string,
	variant: string,
	root: string,
) {
	return exLocator(page, component, exKey, variant).locator(root);
}

export function attrsSelector(
	htmlAttrs: Record<string, string | boolean>,
): string {
	return Object.entries(htmlAttrs)
		.map(([k, v]) => (v === true ? `[${k}]` : `[${k}="${v}"]`))
		.join("");
}
