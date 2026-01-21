import { expect, test } from "@playwright/test";
import { buildUrl, DEMO } from "./test-utils";

test.describe("Tabs Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(buildUrl("/components/tabs.html"));
	});

	const getExampleTabs = (page: import("@playwright/test").Page) =>
		page.locator(DEMO).locator(".tabs.max-width").first();

	test("default tabs", async ({ page }) => {
		const tabs = getExampleTabs(page);
		await expect(tabs).toHaveScreenshot("tabs-default.png");
	});

	test.describe("Tab States", () => {
		test("first tab selected", async ({ page }) => {
			const tablist = getExampleTabs(page).locator('span[role="tablist"]');
			await expect(tablist).toHaveScreenshot("tabs-first-selected.png");
		});

		test("second tab selected", async ({ page }) => {
			const tabs = getExampleTabs(page);
			const secondTab = tabs.locator('label[for="tab2"]');
			await secondTab.click();

			const tablist = tabs.locator('span[role="tablist"]');
			await expect(tablist).toHaveScreenshot("tabs-second-selected.png");
		});

		test("tab hover state", async ({ page }) => {
			const tabs = getExampleTabs(page);
			const secondTab = tabs.locator('label[for="tab2"]');
			await secondTab.hover();
			await expect(secondTab).toHaveScreenshot("tabs-hover.png");
		});

		test("tab focus state", async ({ page }) => {
			const tabs = getExampleTabs(page);
			const secondTab = tabs.locator('label[for="tab2"]');
			await secondTab.focus();
			await expect(secondTab).toHaveScreenshot("tabs-focus.png");
		});
	});

	test.describe("Tab Panels", () => {
		test("first panel visible", async ({ page }) => {
			const tabs = getExampleTabs(page);
			const panel = tabs.locator('div[role="tabpanel"]').first();
			await expect(panel).toHaveScreenshot("tabs-panel-first.png");
		});

		test("second panel visible", async ({ page }) => {
			const tabs = getExampleTabs(page);
			const secondTab = tabs.locator('label[for="tab2"]');
			await secondTab.click();

			const panel = tabs.locator('div[role="tabpanel"]').nth(1);
			await expect(panel).toBeVisible();
			await expect(panel).toHaveScreenshot("tabs-panel-second.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const tabs = getExampleTabs(page);
			await expect(tabs).toHaveScreenshot("tabs-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const tabs = getExampleTabs(page);
			await expect(tabs).toHaveScreenshot("tabs-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const tabs = getExampleTabs(page);
			await expect(tabs).toHaveScreenshot("tabs-desktop.png");
		});
	});
});
