import { expect, test } from "@playwright/test";

test.describe("Alert Dialog Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/alert-dialog.html");
	});

	test("alert dialog trigger button", async ({ page }) => {
		const button = page
			.locator("button.destructive")
			.filter({ hasText: "Remove" });
		await expect(button).toHaveScreenshot("alert-dialog-trigger.png");
	});

	test("alert dialog open", async ({ page }) => {
		const button = page
			.locator("button.destructive")
			.filter({ hasText: "Remove" });
		await button.click();

		const dialog = page.locator("dialog#remove_modal");
		await expect(dialog).toHaveScreenshot("alert-dialog-open.png");
	});

	test.describe("Alert Dialog Components", () => {
		test("alert dialog header", async ({ page }) => {
			const button = page
				.locator("button.destructive")
				.filter({ hasText: "Remove" });
			await button.click();

			const header = page.locator("dialog hgroup");
			await expect(header).toHaveScreenshot("alert-dialog-header.png");
		});

		test("alert dialog buttons", async ({ page }) => {
			const button = page
				.locator("button.destructive")
				.filter({ hasText: "Remove" });
			await button.click();

			const form = page.locator("dialog form");
			await expect(form).toHaveScreenshot("alert-dialog-buttons.png");
		});

		test("alert dialog cancel button", async ({ page }) => {
			const button = page
				.locator("button.destructive")
				.filter({ hasText: "Remove" });
			await button.click();

			const cancelButton = page.locator("dialog form button.outline");
			await expect(cancelButton).toHaveScreenshot("alert-dialog-cancel.png");
		});

		test("alert dialog confirm button", async ({ page }) => {
			const button = page
				.locator("button.destructive")
				.filter({ hasText: "Remove" });
			await button.click();

			const confirmButton = page
				.locator("dialog form button")
				.filter({ hasText: "Confirm" });
			await expect(confirmButton).toHaveScreenshot("alert-dialog-confirm.png");
		});
	});

	test.describe("Alert Dialog States", () => {
		test("alert dialog with backdrop", async ({ page }) => {
			const button = page
				.locator("button.destructive")
				.filter({ hasText: "Remove" });
			await button.click();

			await page.waitForSelector("dialog[open]");

			await expect(page).toHaveScreenshot("alert-dialog-with-backdrop.png");
		});

		test("cancel button hover", async ({ page }) => {
			const button = page
				.locator("button.destructive")
				.filter({ hasText: "Remove" });
			await button.click();

			const cancelButton = page.locator("dialog form button.outline");
			await cancelButton.hover();
			await expect(cancelButton).toHaveScreenshot(
				"alert-dialog-cancel-hover.png",
			);
		});

		test("confirm button hover", async ({ page }) => {
			const button = page
				.locator("button.destructive")
				.filter({ hasText: "Remove" });
			await button.click();

			const confirmButton = page
				.locator("dialog form button")
				.filter({ hasText: "Confirm" });
			await confirmButton.hover();
			await expect(confirmButton).toHaveScreenshot(
				"alert-dialog-confirm-hover.png",
			);
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const button = page
				.locator("button.destructive")
				.filter({ hasText: "Remove" });
			await button.click();

			const dialog = page.locator("dialog#remove_modal");
			await expect(dialog).toHaveScreenshot("alert-dialog-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const button = page
				.locator("button.destructive")
				.filter({ hasText: "Remove" });
			await button.click();

			const dialog = page.locator("dialog#remove_modal");
			await expect(dialog).toHaveScreenshot("alert-dialog-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const button = page
				.locator("button.destructive")
				.filter({ hasText: "Remove" });
			await button.click();

			const dialog = page.locator("dialog#remove_modal");
			await expect(dialog).toHaveScreenshot("alert-dialog-desktop.png");
		});
	});
});
