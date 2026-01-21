import { expect, test } from "@playwright/test";

const DEMO = "[data-to-code]";

test.describe("Alert Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/alert.html");
	});

	test("default alert", async ({ page }) => {
		const alert = page
			.locator(DEMO)
			.locator('div[role="alert"]')
			.filter({ hasText: "Unable to remove item" });
		await expect(alert).toHaveScreenshot("alert-default.png");
	});

	test.describe("Alert Styles", () => {
		test("default style", async ({ page }) => {
			const alert = page
				.locator(DEMO)
				.locator('div[role="alert"]')
				.filter({ hasText: "Default" })
				.first();
			await expect(alert).toHaveScreenshot("alert-style-default.png");
		});

		test("destructive style", async ({ page }) => {
			const alert = page
				.locator(DEMO)
				.locator('div[role="alert"].destructive')
				.filter({ hasText: "Destructive" });
			await expect(alert).toHaveScreenshot("alert-style-destructive.png");
		});
	});

	test.describe("Alert with Icons", () => {
		test("alert with icon", async ({ page }) => {
			const alert = page
				.locator(DEMO)
				.locator('div[role="alert"]')
				.filter({ hasText: "Unable to remove item" });
			await expect(alert).toHaveScreenshot("alert-with-icon.png");
		});

		test("alert with icon and title", async ({ page }) => {
			const alert = page
				.locator(DEMO)
				.locator('div[role="alert"]')
				.filter({ hasText: "An alert with an icon" })
				.last();
			await expect(alert).toHaveScreenshot("alert-icon-title.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const alert = page
				.locator(DEMO)
				.locator('div[role="alert"]')
				.filter({ hasText: "Unable to remove item" });
			await expect(alert).toHaveScreenshot("alert-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const alert = page
				.locator(DEMO)
				.locator('div[role="alert"]')
				.filter({ hasText: "Unable to remove item" });
			await expect(alert).toHaveScreenshot("alert-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const alert = page
				.locator(DEMO)
				.locator('div[role="alert"]')
				.filter({ hasText: "Unable to remove item" });
			await expect(alert).toHaveScreenshot("alert-desktop.png");
		});
	});
});
