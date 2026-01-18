import { expect, test } from "@playwright/test";

test.describe("Avatar Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/avatar.html");
	});

	test("avatar with image", async ({ page }) => {
		const avatar = page.locator("picture").nth(1);
		await expect(avatar).toHaveScreenshot("avatar-with-image.png");
	});

	test("avatar with fallback", async ({ page }) => {
		const avatar = page.locator("picture").first();
		await expect(avatar).toHaveScreenshot("avatar-fallback.png");
	});

	test.describe("Avatar Sizing", () => {
		test("square avatar - large", async ({ page }) => {
			const avatar = page.locator("picture.square").first();
			await expect(avatar).toHaveScreenshot("avatar-square-large.png");
		});

		test("square avatar - small", async ({ page }) => {
			const avatar = page.locator("picture.square").nth(1);
			await expect(avatar).toHaveScreenshot("avatar-square-small.png");
		});
	});

	test.describe("Avatar Groups", () => {
		test("avatar group", async ({ page }) => {
			const group = page.locator('div[role="group"]').first();
			await expect(group).toHaveScreenshot("avatar-group.png");
		});

		test("avatar group with overflow", async ({ page }) => {
			const group = page.locator('div[role="group"]').first();
			const overflowBadge = group.locator("picture").last();
			await expect(overflowBadge).toHaveScreenshot("avatar-group-overflow.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const avatar = page.locator("picture").nth(1);
			await expect(avatar).toHaveScreenshot("avatar-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const avatar = page.locator("picture").nth(1);
			await expect(avatar).toHaveScreenshot("avatar-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const avatar = page.locator("picture").nth(1);
			await expect(avatar).toHaveScreenshot("avatar-desktop.png");
		});
	});
});
