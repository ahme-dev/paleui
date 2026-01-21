import { expect, test } from "@playwright/test";

const DEMO = "[data-to-code]";

test.describe("Breadcrumbs Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/breadcrumbs.html");
	});

	test("default breadcrumbs", async ({ page }) => {
		const breadcrumbs = page
			.locator(DEMO)
			.locator('nav[aria-label="breadcrumb"]')
			.first();
		await expect(breadcrumbs).toHaveScreenshot("breadcrumbs-default.png");
	});

	test.describe("Breadcrumb Variants", () => {
		test("breadcrumbs with custom separator", async ({ page }) => {
			const breadcrumbs = page
				.locator(DEMO)
				.locator('nav[aria-label="breadcrumb"]')
				.filter({ hasText: "Home" })
				.nth(1);
			await expect(breadcrumbs).toHaveScreenshot(
				"breadcrumbs-custom-separator.png",
			);
		});

		test("breadcrumbs with icons", async ({ page }) => {
			const breadcrumbs = page
				.locator(DEMO)
				.locator('nav[aria-label="breadcrumb"]')
				.filter({ hasText: "Projects" });
			await expect(breadcrumbs).toHaveScreenshot("breadcrumbs-with-icons.png");
		});

		test("breadcrumbs collapsed", async ({ page }) => {
			const breadcrumbs = page
				.locator(DEMO)
				.locator('nav[aria-label="breadcrumb"]')
				.filter({ hasText: "Navigation" });
			await expect(breadcrumbs).toHaveScreenshot("breadcrumbs-collapsed.png");
		});
	});

	test.describe("Breadcrumb States", () => {
		test("breadcrumb link hover", async ({ page }) => {
			const link = page
				.locator(DEMO)
				.locator('nav[aria-label="breadcrumb"]')
				.first()
				.locator("a")
				.first();
			await link.hover();
			await expect(link).toHaveScreenshot("breadcrumbs-link-hover.png");
		});

		test("breadcrumb link focus", async ({ page }) => {
			const link = page
				.locator(DEMO)
				.locator('nav[aria-label="breadcrumb"]')
				.first()
				.locator("a")
				.first();
			await link.focus();
			await expect(link).toHaveScreenshot("breadcrumbs-link-focus.png");
		});

		test("current page item", async ({ page }) => {
			const currentItem = page
				.locator(DEMO)
				.locator('nav[aria-label="breadcrumb"]')
				.first()
				.locator('li[aria-current="page"]');
			await expect(currentItem).toHaveScreenshot("breadcrumbs-current.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const breadcrumbs = page
				.locator(DEMO)
				.locator('nav[aria-label="breadcrumb"]')
				.first();
			await expect(breadcrumbs).toHaveScreenshot("breadcrumbs-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const breadcrumbs = page
				.locator(DEMO)
				.locator('nav[aria-label="breadcrumb"]')
				.first();
			await expect(breadcrumbs).toHaveScreenshot("breadcrumbs-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const breadcrumbs = page
				.locator(DEMO)
				.locator('nav[aria-label="breadcrumb"]')
				.first();
			await expect(breadcrumbs).toHaveScreenshot("breadcrumbs-desktop.png");
		});
	});
});
