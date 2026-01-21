import { expect, test } from "@playwright/test";
import { buildUrl, DEMO } from "./test-utils";

test.describe("Aspect Ratio Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(buildUrl("/components/aspect-ratio.html"));
	});

	test("default aspect ratio - 3:1", async ({ page }) => {
		const aspectBox = page.locator(DEMO).locator(".aspect").first();
		await expect(aspectBox).toHaveScreenshot("aspect-ratio-default.png");
	});

	test.describe("Different Ratios", () => {
		test("ratio 1:1", async ({ page }) => {
			const aspectBox = page
				.locator(DEMO)
				.locator(".aspect")
				.filter({ hasText: "1:1" });
			await expect(aspectBox).toHaveScreenshot("aspect-ratio-1-1.png");
		});

		test("ratio 1:2", async ({ page }) => {
			const aspectBox = page
				.locator(DEMO)
				.locator(".aspect")
				.filter({ hasText: "1:2" });
			await expect(aspectBox).toHaveScreenshot("aspect-ratio-1-2.png");
		});

		test("ratio 4:3", async ({ page }) => {
			const aspectBox = page
				.locator(DEMO)
				.locator(".aspect")
				.filter({ hasText: "4:3" });
			await expect(aspectBox).toHaveScreenshot("aspect-ratio-4-3.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const aspectBox = page.locator(DEMO).locator(".aspect").first();
			await expect(aspectBox).toHaveScreenshot("aspect-ratio-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const aspectBox = page.locator(DEMO).locator(".aspect").first();
			await expect(aspectBox).toHaveScreenshot("aspect-ratio-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const aspectBox = page.locator(DEMO).locator(".aspect").first();
			await expect(aspectBox).toHaveScreenshot("aspect-ratio-desktop.png");
		});
	});
});
