import { expect, test } from "@playwright/test";

const DEMO = "[data-to-code]";

test.describe("Dropdown Menu Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/dropdown-menu.html");
	});

	test("dropdown trigger - closed", async ({ page }) => {
		const trigger = page.locator(DEMO).locator("details summary").first();
		await expect(trigger).toHaveScreenshot("dropdown-trigger-closed.png");
	});

	test("dropdown trigger - open", async ({ page }) => {
		const details = page.locator(DEMO).locator("details").first();
		await details.locator("summary").click();

		const dropdown = page.locator(DEMO).locator("details").first();
		await expect(dropdown).toHaveScreenshot("dropdown-open.png");
	});

	test.describe("Dropdown Menu Items", () => {
		test("menu with items and shortcuts", async ({ page }) => {
			const details = page.locator(DEMO).locator("details").first();
			await details.locator("summary").click();

			const menu = page.locator(DEMO).locator('ul[role="menu"]').first();
			await expect(menu).toHaveScreenshot("dropdown-menu-items.png");
		});

		test("menu item hover", async ({ page }) => {
			const details = page.locator(DEMO).locator("details").first();
			await details.locator("summary").click();

			const menuItem = page
				.locator(DEMO)
				.locator('li[role="menuitem"]')
				.first();
			await menuItem.hover();
			await expect(menuItem).toHaveScreenshot("dropdown-menu-item-hover.png");
		});

		test("menu with separator", async ({ page }) => {
			const details = page.locator(DEMO).locator("details").first();
			await details.locator("summary").click();

			const menu = page.locator(DEMO).locator('ul[role="menu"]').first();
			await expect(menu).toHaveScreenshot("dropdown-menu-separator.png");
		});
	});

	test.describe("Dropdown Variants", () => {
		test("secondary dropdown", async ({ page }) => {
			const trigger = page.locator(DEMO).locator("summary.secondary");
			await expect(trigger).toHaveScreenshot("dropdown-secondary.png");
		});

		test("destructive dropdown", async ({ page }) => {
			const trigger = page.locator(DEMO).locator("summary.destructive");
			await expect(trigger).toHaveScreenshot("dropdown-destructive.png");
		});

		test("outline dropdown", async ({ page }) => {
			const trigger = page.locator(DEMO).locator("summary.outline").last();
			await expect(trigger).toHaveScreenshot("dropdown-outline.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const details = page.locator(DEMO).locator("details").first();
			await details.locator("summary").click();

			const dropdown = page.locator(DEMO).locator("details").first();
			await expect(dropdown).toHaveScreenshot("dropdown-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const details = page.locator(DEMO).locator("details").first();
			await details.locator("summary").click();

			const dropdown = page.locator(DEMO).locator("details").first();
			await expect(dropdown).toHaveScreenshot("dropdown-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const details = page.locator(DEMO).locator("details").first();
			await details.locator("summary").click();

			const dropdown = page.locator(DEMO).locator("details").first();
			await expect(dropdown).toHaveScreenshot("dropdown-desktop.png");
		});
	});
});
