import { expect, test } from "@playwright/test";

test.describe("Select Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/select.html");
	});

	test("default select", async ({ page }) => {
		const select = page.locator("select").first();
		await expect(select).toHaveScreenshot("select-default.png");
	});

	test.describe("Select States", () => {
		test("disabled select", async ({ page }) => {
			const select = page.locator("select[disabled]");
			await expect(select).toHaveScreenshot("select-disabled.png");
		});

		test("loading select", async ({ page }) => {
			const select = page.locator('select[aria-busy="true"]');
			await expect(select).toHaveScreenshot("select-loading.png");
		});

		test("focus state", async ({ page }) => {
			const select = page.locator("select").first();
			await select.focus();
			await expect(select).toHaveScreenshot("select-focus.png");
		});

		test("hover state", async ({ page }) => {
			const select = page.locator("select").first();
			await select.hover();
			await expect(select).toHaveScreenshot("select-hover.png");
		});
	});

	test.describe("Select with Groups", () => {
		test("grouped select", async ({ page }) => {
			const select = page.locator("select").last();
			await expect(select).toHaveScreenshot("select-grouped.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const select = page.locator("select").first();
			await expect(select).toHaveScreenshot("select-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const select = page.locator("select").first();
			await expect(select).toHaveScreenshot("select-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const select = page.locator("select").first();
			await expect(select).toHaveScreenshot("select-desktop.png");
		});
	});
});
