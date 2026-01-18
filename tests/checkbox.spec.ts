import { expect, test } from "@playwright/test";

test.describe("Checkbox Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/checkbox.html");
	});

	const getCheckbox = (page: import("@playwright/test").Page) =>
		page.locator("#component-display input[type='checkbox']").first();

	const getLabel = (page: import("@playwright/test").Page) =>
		page.locator("#component-display label").first();

	test("default checkbox - unchecked", async ({ page }) => {
		const checkbox = getCheckbox(page);
		await expect(checkbox).toHaveScreenshot("checkbox-unchecked.png");
	});

	test("default checkbox - checked", async ({ page }) => {
		const checkbox = getCheckbox(page);
		await checkbox.check();
		await expect(checkbox).toHaveScreenshot("checkbox-checked.png");
	});

	test.describe("Checkbox with Label", () => {
		test("checkbox with label", async ({ page }) => {
			const label = getLabel(page);
			await expect(label).toHaveScreenshot("checkbox-with-label.png");
		});

		test("checkbox with details", async ({ page }) => {
			const label = page.locator("#component-display label").nth(1);
			await expect(label).toHaveScreenshot("checkbox-with-details.png");
		});
	});

	test.describe("Checkbox States", () => {
		test("hover state", async ({ page }) => {
			const checkbox = getCheckbox(page);
			await checkbox.hover();
			await expect(checkbox).toHaveScreenshot("checkbox-hover.png");
		});

		test("focus state", async ({ page }) => {
			const checkbox = getCheckbox(page);
			await checkbox.focus();
			await expect(checkbox).toHaveScreenshot("checkbox-focus.png");
		});

		test("checked and hovered", async ({ page }) => {
			const checkbox = getCheckbox(page);
			await checkbox.check();
			await checkbox.hover();
			await expect(checkbox).toHaveScreenshot("checkbox-checked-hover.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const label = getLabel(page);
			await expect(label).toHaveScreenshot("checkbox-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const label = getLabel(page);
			await expect(label).toHaveScreenshot("checkbox-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const label = getLabel(page);
			await expect(label).toHaveScreenshot("checkbox-desktop.png");
		});
	});
});
