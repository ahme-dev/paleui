import { expect, test } from "@playwright/test";
import { buildUrl, DEMO } from "./test-utils";

test.describe("Input Visual Snapshots", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(buildUrl("/components/input.html"));
	});

	test("default input", async ({ page }) => {
		const input = page.locator(DEMO).locator('input[type="text"]').first();
		await expect(input).toHaveScreenshot("input-default.png");
	});

	test.describe("Input Types", () => {
		test("text input", async ({ page }) => {
			const input = page.locator(DEMO).locator('input[type="text"]').first();
			await expect(input).toHaveScreenshot("input-text.png");
		});

		test("email input", async ({ page }) => {
			const input = page
				.locator(DEMO)
				.locator('input[type="email"][placeholder="Email"]');
			await expect(input).toHaveScreenshot("input-email.png");
		});

		test("password input", async ({ page }) => {
			const input = page.locator(DEMO).locator('input[type="password"]');
			await expect(input).toHaveScreenshot("input-password.png");
		});

		test("number input", async ({ page }) => {
			const input = page
				.locator(DEMO)
				.locator('input[type="number"][placeholder="Number"]');
			await expect(input).toHaveScreenshot("input-number.png");
		});

		test("search input", async ({ page }) => {
			const input = page
				.locator(DEMO)
				.locator('input[type="search"][placeholder="Search"]');
			await expect(input).toHaveScreenshot("input-search.png");
		});
	});

	test.describe("Input with Prefix/Suffix", () => {
		test("input with prefix", async ({ page }) => {
			const inputWrapper = page
				.locator(DEMO)
				.locator('label[role="textbox"]')
				.filter({ hasText: "$" })
				.first();
			await expect(inputWrapper).toHaveScreenshot("input-prefix.png");
		});

		test("input with suffix", async ({ page }) => {
			const inputWrapper = page
				.locator(DEMO)
				.locator('label[role="textbox"]')
				.filter({ hasText: "USD" });
			await expect(inputWrapper).toHaveScreenshot("input-suffix.png");
		});

		test("input with icon prefix", async ({ page }) => {
			const inputWrapper = page
				.locator(DEMO)
				.locator('label[role="textbox"]')
				.filter({ has: page.locator('input[placeholder="Search..."]') });
			await expect(inputWrapper).toHaveScreenshot("input-icon-prefix.png");
		});

		test("input with text prefix", async ({ page }) => {
			const inputWrapper = page
				.locator(DEMO)
				.locator('label[role="textbox"]')
				.filter({ hasText: "https://" });
			await expect(inputWrapper).toHaveScreenshot("input-text-prefix.png");
		});
	});

	test.describe("Textarea", () => {
		test("textarea default", async ({ page }) => {
			const textarea = page
				.locator(DEMO)
				.locator('textarea[placeholder="Enter your message..."]');
			await expect(textarea).toHaveScreenshot("textarea-default.png");
		});
	});

	test.describe("Input States", () => {
		test("disabled input", async ({ page }) => {
			const input = page.locator(DEMO).locator("input[disabled]");
			await expect(input).toHaveScreenshot("input-disabled.png");
		});

		test("readonly input", async ({ page }) => {
			const input = page.locator(DEMO).locator("input[readonly]");
			await expect(input).toHaveScreenshot("input-readonly.png");
		});

		test("input focus state", async ({ page }) => {
			const input = page.locator(DEMO).locator('input[type="text"]').first();
			await input.focus();
			await expect(input).toHaveScreenshot("input-focus.png");
		});

		test("input hover state", async ({ page }) => {
			const input = page.locator(DEMO).locator('input[type="text"]').first();
			await input.hover();
			await expect(input).toHaveScreenshot("input-hover.png");
		});
	});

	test.describe("Input with Labels", () => {
		test("input with label", async ({ page }) => {
			const container = page
				.locator(DEMO)
				.locator("div")
				.filter({ hasText: "Name" })
				.first();
			await expect(container).toHaveScreenshot("input-with-label.png");
		});

		test("textarea with label", async ({ page }) => {
			const container = page
				.locator(DEMO)
				.locator("div")
				.filter({ hasText: "Message" })
				.first();
			await expect(container).toHaveScreenshot("textarea-with-label.png");
		});
	});

	test.describe("Responsive Snapshots", () => {
		test("mobile viewport", async ({ page }) => {
			await page.setViewportSize({ width: 375, height: 667 });
			const input = page.locator(DEMO).locator('input[type="text"]').first();
			await expect(input).toHaveScreenshot("input-mobile.png");
		});

		test("tablet viewport", async ({ page }) => {
			await page.setViewportSize({ width: 768, height: 1024 });
			const input = page.locator(DEMO).locator('input[type="text"]').first();
			await expect(input).toHaveScreenshot("input-tablet.png");
		});

		test("desktop viewport", async ({ page }) => {
			await page.setViewportSize({ width: 1920, height: 1080 });
			const input = page.locator(DEMO).locator('input[type="text"]').first();
			await expect(input).toHaveScreenshot("input-desktop.png");
		});
	});
});
