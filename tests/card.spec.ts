import { expect, test } from "@playwright/test";

const DEMO = "[data-to-code]";

test.describe("Card Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/card.html");
	});

	test("default card", async ({ page }) => {
		const card = page.locator(DEMO).locator("article").first();
		await expect(card).toHaveScreenshot("card-default.png");
	});

	test.describe("Card Structure", () => {
		test("card header", async ({ page }) => {
			const header = page.locator(DEMO).locator("article header").first();
			await expect(header).toHaveScreenshot("card-header.png");
		});

		test("card footer", async ({ page }) => {
			const footer = page.locator(DEMO).locator("article footer").first();
			await expect(footer).toHaveScreenshot("card-footer.png");
		});

		test("card with image", async ({ page }) => {
			const card = page.locator(DEMO).locator("article").first();
			const image = card.locator("img");
			await expect(image).toHaveScreenshot("card-image.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const card = page.locator(DEMO).locator("article").first();
			await expect(card).toHaveScreenshot("card-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const card = page.locator(DEMO).locator("article").first();
			await expect(card).toHaveScreenshot("card-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const card = page.locator(DEMO).locator("article").first();
			await expect(card).toHaveScreenshot("card-desktop.png");
		});
	});
});
