import { expect, test } from "@playwright/test";
import { buildUrl, DEMO } from "./test-utils";

// Selector for accordion group wrapper
const ACCORDION_GROUP = "[data-accordion]";

test.describe("Accordion Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(buildUrl("/components/accordion.html"));
	});

	test("accordion group has data-accordion attribute", async ({ page }) => {
		const accordionGroup = page.locator(DEMO).locator(ACCORDION_GROUP).first();
		await expect(accordionGroup).toBeVisible();
	});

	test("default accordion - closed", async ({ page }) => {
		const accordionGroup = page.locator(DEMO).locator(ACCORDION_GROUP).first();
		await expect(accordionGroup).toHaveScreenshot(
			"accordion-default-closed.png",
		);
	});

	test("default accordion - open", async ({ page }) => {
		const accordionGroup = page.locator(DEMO).locator(ACCORDION_GROUP).first();
		const accordion = accordionGroup
			.locator('details[role="region"]')
			.filter({ hasText: "Product Information" });
		await accordion.locator("summary").click();
		await expect(accordionGroup).toHaveScreenshot("accordion-default-open.png");
	});

	test.describe("Accordion Variants", () => {
		test("multiple accordions - all can open", async ({ page }) => {
			const accordionGroup = page
				.locator(DEMO)
				.locator(ACCORDION_GROUP)
				.filter({ hasText: "All can be opened" });
			const accordion1 = accordionGroup
				.locator('details[role="region"]')
				.first();
			const accordion2 = accordionGroup
				.locator('details[role="region"]')
				.last();

			// Open both
			await accordion1.locator("summary").click();
			await accordion2.locator("summary").click();

			await expect(accordionGroup).toHaveScreenshot(
				"accordion-multiple-open.png",
			);
		});

		test("single open accordion - with name attribute", async ({ page }) => {
			const accordionGroup = page
				.locator(DEMO)
				.locator(ACCORDION_GROUP)
				.filter({ hasText: "A: Only this" });
			const accordion1 = accordionGroup
				.locator('details[role="region"][name="only"]')
				.filter({ hasText: "A: Only this" });
			const accordion2 = accordionGroup
				.locator('details[role="region"][name="only"]')
				.filter({ hasText: "B: Only this" });

			await accordion1.locator("summary").click();
			await expect(accordionGroup).toHaveScreenshot(
				"accordion-single-open-first.png",
			);

			await accordion2.locator("summary").click();
			await expect(accordionGroup).toHaveScreenshot(
				"accordion-single-open-second.png",
			);
		});
	});

	test.describe("Accordion States", () => {
		test("hover state on summary", async ({ page }) => {
			const summary = page
				.locator(DEMO)
				.locator('details[role="region"]')
				.filter({ hasText: "Product Information" })
				.locator("summary");
			await summary.hover();
			await expect(summary).toHaveScreenshot("accordion-summary-hover.png");
		});

		test("focus state on summary", async ({ page }) => {
			const summary = page
				.locator(DEMO)
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
			const accordionGroup = page
				.locator(DEMO)
				.locator(ACCORDION_GROUP)
				.first();
			const accordion = accordionGroup
				.locator('details[role="region"]')
				.filter({ hasText: "Product Information" });
			await accordion.locator("summary").click();
			await expect(accordionGroup).toHaveScreenshot("accordion-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const accordionGroup = page
				.locator(DEMO)
				.locator(ACCORDION_GROUP)
				.first();
			const accordion = accordionGroup
				.locator('details[role="region"]')
				.filter({ hasText: "Product Information" });
			await accordion.locator("summary").click();
			await expect(accordionGroup).toHaveScreenshot("accordion-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const accordionGroup = page
				.locator(DEMO)
				.locator(ACCORDION_GROUP)
				.first();
			const accordion = accordionGroup
				.locator('details[role="region"]')
				.filter({ hasText: "Product Information" });
			await accordion.locator("summary").click();
			await expect(accordionGroup).toHaveScreenshot("accordion-desktop.png");
		});
	});
});
