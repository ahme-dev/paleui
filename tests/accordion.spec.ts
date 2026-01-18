import { expect, test } from "@playwright/test";

test.describe("Accordion Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/components/accordion.html");
	});

	test("default accordion - closed", async ({ page }) => {
		const accordion = page
			.locator('details[role="region"]')
			.filter({ hasText: "Product Information" });
		await expect(accordion).toHaveScreenshot("accordion-default-closed.png");
	});

	test("default accordion - open", async ({ page }) => {
		const accordion = page
			.locator('details[role="region"]')
			.filter({ hasText: "Product Information" });
		await accordion.locator("summary").click();
		await expect(accordion).toHaveScreenshot("accordion-default-open.png");
	});

	test.describe("Accordion Variants", () => {
		test("multiple accordions - all can open", async ({ page }) => {
			const accordion1 = page
				.locator('details[role="region"]')
				.filter({ hasText: "All can be opened" })
				.first();
			const accordion2 = page
				.locator('details[role="region"]')
				.filter({ hasText: "All can be opened" })
				.last();

			// Open both
			await accordion1.locator("summary").click();
			await accordion2.locator("summary").click();

			const container = page.locator(".flex-col.max-width").first();
			await expect(container).toHaveScreenshot("accordion-multiple-open.png");
		});

		test("single open accordion - with name attribute", async ({ page }) => {
			const accordion1 = page
				.locator('details[role="region"][name="only"]')
				.filter({ hasText: "A: Only this" });
			const accordion2 = page
				.locator('details[role="region"][name="only"]')
				.filter({ hasText: "B: Only this" });

			await accordion1.locator("summary").click();
			await expect(accordion1).toHaveScreenshot(
				"accordion-single-open-first.png",
			);

			await accordion2.locator("summary").click();
			await expect(accordion2).toHaveScreenshot(
				"accordion-single-open-second.png",
			);
		});
	});

	test.describe("Accordion States", () => {
		test("hover state on summary", async ({ page }) => {
			const summary = page
				.locator('details[role="region"]')
				.filter({ hasText: "Product Information" })
				.locator("summary");
			await summary.hover();
			await expect(summary).toHaveScreenshot("accordion-summary-hover.png");
		});

		test("focus state on summary", async ({ page }) => {
			const summary = page
				.locator('details[role="region"]')
				.filter({ hasText: "Product Information" })
				.locator("summary");
			await summary.focus();
			await expect(summary).toHaveScreenshot("accordion-summary-focus.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const accordion = page
				.locator('details[role="region"]')
				.filter({ hasText: "Product Information" });
			await accordion.locator("summary").click();
			await expect(accordion).toHaveScreenshot("accordion-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const accordion = page
				.locator('details[role="region"]')
				.filter({ hasText: "Product Information" });
			await accordion.locator("summary").click();
			await expect(accordion).toHaveScreenshot("accordion-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const accordion = page
				.locator('details[role="region"]')
				.filter({ hasText: "Product Information" });
			await accordion.locator("summary").click();
			await expect(accordion).toHaveScreenshot("accordion-desktop.png");
		});
	});
});
