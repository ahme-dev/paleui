import { expect, test } from "@playwright/test";
import { buildUrl, DEMO } from "./test-utils";

test.describe("Separator Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(buildUrl("/components/separator.html"));
	});

	test("horizontal separator", async ({ page }) => {
		const separator = page.locator(DEMO).locator("hr").first();
		await expect(separator).toHaveScreenshot("separator-horizontal.png");
	});

	test("vertical separator", async ({ page }) => {
		const separator = page
			.locator(DEMO)
			.locator('[role="group"] span[role="separator"]')
			.first();
		await expect(separator).toHaveScreenshot("separator-vertical.png");
	});

	test("separator in context", async ({ page }) => {
		const container = page
			.locator(DEMO)
			.locator("div")
			.filter({ hasText: "PaleUI" })
			.first();
		await expect(container).toHaveScreenshot("separator-context.png");
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const container = page
				.locator(DEMO)
				.locator("div")
				.filter({ hasText: "PaleUI" })
				.first();
			await expect(container).toHaveScreenshot("separator-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const container = page
				.locator(DEMO)
				.locator("div")
				.filter({ hasText: "PaleUI" })
				.first();
			await expect(container).toHaveScreenshot("separator-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const container = page
				.locator(DEMO)
				.locator("div")
				.filter({ hasText: "PaleUI" })
				.first();
			await expect(container).toHaveScreenshot("separator-desktop.png");
		});
	});
});
