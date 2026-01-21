import { expect, test } from "@playwright/test";

const DEMO = "[data-to-code]";

test.describe("Badge Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/badge.html");
	});

	test("default badge with icon", async ({ page }) => {
		const badge = page
			.locator(DEMO)
			.locator('div[role="status"]')
			.filter({ hasText: "Verified" });
		await expect(badge).toHaveScreenshot("badge-default.png");
	});

	test.describe("Badge Styles", () => {
		test("default style", async ({ page }) => {
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"]')
				.filter({ hasText: "Default" });
			await expect(badge).toHaveScreenshot("badge-style-default.png");
		});

		test("secondary style", async ({ page }) => {
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"].secondary')
				.filter({ hasText: "Secondary" });
			await expect(badge).toHaveScreenshot("badge-style-secondary.png");
		});

		test("destructive style", async ({ page }) => {
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"].destructive')
				.filter({ hasText: "Destructive" });
			await expect(badge).toHaveScreenshot("badge-style-destructive.png");
		});

		test("outline style", async ({ page }) => {
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"].outline')
				.filter({ hasText: "Outline" });
			await expect(badge).toHaveScreenshot("badge-style-outline.png");
		});

		test("ghost style", async ({ page }) => {
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"].ghost')
				.filter({ hasText: "Ghost" });
			await expect(badge).toHaveScreenshot("badge-style-ghost.png");
		});
	});

	test.describe("Badge with Icons", () => {
		test("badge with icon and text", async ({ page }) => {
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"]')
				.filter({ hasText: "Marked" });
			await expect(badge).toHaveScreenshot("badge-icon-text.png");
		});

		test("destructive badge with icon", async ({ page }) => {
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"].destructive')
				.filter({ hasText: "Archived" });
			await expect(badge).toHaveScreenshot("badge-destructive-icon.png");
		});
	});

	test.describe("Badge Sizing", () => {
		test("fit badge - icon only", async ({ page }) => {
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"].fit.destructive')
				.first();
			await expect(badge).toHaveScreenshot("badge-fit-icon.png");
		});

		test("fit badge - text", async ({ page }) => {
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"].fit.outline')
				.filter({ hasText: "99+" });
			await expect(badge).toHaveScreenshot("badge-fit-text.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"]')
				.filter({ hasText: "Verified" });
			await expect(badge).toHaveScreenshot("badge-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"]')
				.filter({ hasText: "Verified" });
			await expect(badge).toHaveScreenshot("badge-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const badge = page
				.locator(DEMO)
				.locator('div[role="status"]')
				.filter({ hasText: "Verified" });
			await expect(badge).toHaveScreenshot("badge-desktop.png");
		});
	});
});
