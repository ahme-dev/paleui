import { expect, test } from "@playwright/test";

test.describe("Dialog Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/dialog.html");
	});

	test("dialog trigger button", async ({ page }) => {
		const button = page.locator("button").filter({ hasText: "Share" });
		await expect(button).toHaveScreenshot("dialog-trigger.png");
	});

	test("dialog open", async ({ page }) => {
		const button = page.locator("button").filter({ hasText: "Share" });
		await button.click();

		const dialog = page.locator("dialog#share_modal");
		await expect(dialog).toHaveScreenshot("dialog-open.png");
	});

	test.describe("Dialog Components", () => {
		test("dialog header", async ({ page }) => {
			const button = page.locator("button").filter({ hasText: "Share" });
			await button.click();

			const header = page.locator("dialog hgroup");
			await expect(header).toHaveScreenshot("dialog-header.png");
		});

		test("dialog input", async ({ page }) => {
			const button = page.locator("button").filter({ hasText: "Share" });
			await button.click();

			const input = page.locator('dialog input[type="text"]');
			await expect(input).toHaveScreenshot("dialog-input.png");
		});

		test("dialog close button", async ({ page }) => {
			const button = page.locator("button").filter({ hasText: "Share" });
			await button.click();

			const closeButton = page.locator("dialog form button.secondary");
			await expect(closeButton).toHaveScreenshot("dialog-close-button.png");
		});
	});

	// test.describe("Dialog States", () => {
	// 	test("dialog backdrop", async ({ page }) => {
	// 		const button = page.locator("button").filter({ hasText: "Share" });
	// 		await button.click();

	// 		await page.waitForSelector("dialog[open]");

	// 		await expect(page).toHaveScreenshot("dialog-with-backdrop.png");
	// 	});
	// });

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const button = page.locator("button").filter({ hasText: "Share" });
			await button.click();

			const dialog = page.locator("dialog#share_modal");
			await expect(dialog).toHaveScreenshot("dialog-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const button = page.locator("button").filter({ hasText: "Share" });
			await button.click();

			const dialog = page.locator("dialog#share_modal");
			await expect(dialog).toHaveScreenshot("dialog-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const button = page.locator("button").filter({ hasText: "Share" });
			await button.click();

			const dialog = page.locator("dialog#share_modal");
			await expect(dialog).toHaveScreenshot("dialog-desktop.png");
		});
	});
});
