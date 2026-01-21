import { expect, test } from "@playwright/test";
import { buildUrl, DEMO } from "./test-utils";

test.describe("Button Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(buildUrl("/components/button.html"));
	});

	test("default button", async ({ page }) => {
		const button = page
			.locator(DEMO)
			.locator("button")
			.filter({ hasText: "Click" })
			.first();
		await expect(button).toHaveScreenshot("button-default.png");
	});

	test.describe("Button Variants", () => {
		test("primary button", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button")
				.filter({ hasText: "Default" });
			await expect(button).toHaveScreenshot("button-primary.png");
		});

		test("secondary button", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button.secondary")
				.filter({ hasText: "Secondary" });
			await expect(button).toHaveScreenshot("button-secondary.png");
		});

		test("destructive button", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button.destructive")
				.filter({ hasText: "Destructive" });
			await expect(button).toHaveScreenshot("button-destructive.png");
		});

		test("outline button", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button.outline")
				.filter({ hasText: "Outline" });
			await expect(button).toHaveScreenshot("button-outline.png");
		});

		test("ghost button", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button.ghost")
				.filter({ hasText: "Ghost" });
			await expect(button).toHaveScreenshot("button-ghost.png");
		});

		test("link button", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator('a.link[role="button"]')
				.filter({ hasText: "Link" });
			await expect(button).toHaveScreenshot("button-link.png");
		});
	});

	test.describe("Button States", () => {
		test("disabled button", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button[disabled]")
				.filter({ hasText: "Disabled Button" });
			await expect(button).toHaveScreenshot("button-disabled.png");
		});

		test("loading button", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator('button[aria-busy="true"]')
				.filter({ hasText: "Loading Button" });
			await expect(button).toHaveScreenshot("button-loading.png");
		});

		test("loading icon button", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator('button[aria-busy="true"].icon.destructive');
			await expect(button).toHaveScreenshot("button-loading-icon.png");
		});

		test("hover state - primary", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button")
				.filter({ hasText: "Default" });
			await button.hover();
			await expect(button).toHaveScreenshot("button-primary-hover.png");
		});

		test("hover state - secondary", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button.secondary")
				.filter({ hasText: "Secondary" });
			await button.hover();
			await expect(button).toHaveScreenshot("button-secondary-hover.png");
		});

		test("focus state - primary", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button")
				.filter({ hasText: "Default" });
			await button.focus();
			await expect(button).toHaveScreenshot("button-primary-focus.png");
		});
	});

	test.describe("Buttons with Icons", () => {
		test("button with icon and text", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button")
				.filter({ hasText: "Mark" });
			await expect(button).toHaveScreenshot("button-with-icon-and-text.png");
		});

		test("icon only button", async ({ page }) => {
			const button = page.locator(DEMO).locator("button.icon.secondary");
			await expect(button).toHaveScreenshot("button-icon-only.png");
		});

		test("destructive button with icon", async ({ page }) => {
			const button = page
				.locator(DEMO)
				.locator("button.destructive")
				.filter({ hasText: "Delete" });
			await expect(button).toHaveScreenshot("button-destructive-with-icon.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const button = page
				.locator(DEMO)
				.locator("button")
				.filter({ hasText: "Default" });
			await expect(button).toHaveScreenshot("button-primary-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const button = page
				.locator(DEMO)
				.locator("button")
				.filter({ hasText: "Default" });
			await expect(button).toHaveScreenshot("button-primary-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const button = page
				.locator(DEMO)
				.locator("button")
				.filter({ hasText: "Default" });
			await expect(button).toHaveScreenshot("button-primary-desktop.png");
		});
	});
});
