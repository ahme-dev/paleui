import { expect, test } from "@playwright/test";
import { schema } from "../packages/paleui/src/ui/badge";
import { acc, buildUrl, exLocator, expectSnap, VIEWPORTS } from "./test-utils";

const componentKey = "badge" as const;
const component = schema.components.badge;
const { anatomy, dimensions } = component;
const root = anatomy.root;
const rootSel = root.selector;

const pageAnatomy = {
	header: "[data-header]",
};

for (const [viewport, size] of Object.entries(VIEWPORTS)) {
	test.describe(`${schema.meta.title} › ${viewport}`, () => {
		test.use({ viewport: size });

		test("Anatomy", async ({ page }) => {
			await page.goto(buildUrl("/components/badge"));

			const badge = page.locator(pageAnatomy.header).locator(rootSel);
			await expectSnap(schema, badge, root.name, viewport);
		});

		test("Dimensions", async ({ page }) => {
			await page.goto(buildUrl("/components/badge"));

			const variantCases: Record<
				keyof typeof dimensions.variant.options,
				string
			> = {
				default: dimensions.variant.options.default.name ?? "default",
				secondary: dimensions.variant.options.secondary.name ?? "secondary",
				destructive:
					dimensions.variant.options.destructive.name ?? "destructive",
				outline: dimensions.variant.options.outline.name ?? "outline",
				ghost: dimensions.variant.options.ghost.name ?? "ghost",
			};

			for (const [key, label] of Object.entries(variantCases) as [
				keyof typeof dimensions.variant.options,
				string,
			][]) {
				const badge = acc(page, componentKey, "variant", key, rootSel);
				await expectSnap(
					schema,
					badge,
					dimensions.variant.meta.title,
					label,
					viewport,
				);
			}

			const contentCases: Record<
				keyof typeof dimensions.content.options,
				string
			> = {
				text: dimensions.content.options.text.name ?? "text",
				iconText: dimensions.content.options.iconText.name ?? "icon text",
				link: dimensions.content.options.link.name ?? "link",
			};

			for (const [key, label] of Object.entries(contentCases) as [
				keyof typeof dimensions.content.options,
				string,
			][]) {
				const badge = acc(page, componentKey, "content", key, rootSel);
				await expectSnap(
					schema,
					badge,
					dimensions.content.meta.title,
					label,
					viewport,
				);
			}

			const fitCases: Record<keyof typeof dimensions.fit.options, string> = {
				fit: dimensions.fit.options.fit.name ?? "fit",
			};

			for (const [key, label] of Object.entries(fitCases) as [
				keyof typeof dimensions.fit.options,
				string,
			][]) {
				const badge = acc(page, componentKey, "fit", key, rootSel);
				await expectSnap(
					schema,
					badge,
					dimensions.fit.meta.title,
					label,
					viewport,
				);
			}
		});

		test("Structure", async ({ page }) => {
			await page.goto(buildUrl("/components/badge"));

			const linkBadge = exLocator(
				page,
				componentKey,
				"content",
				"link" satisfies keyof typeof dimensions.content.options,
			).locator(rootSel);

			await expect(linkBadge.locator("a")).toHaveAttribute(
				"href",
				"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role",
			);

			const iconOnlyFitBadge = exLocator(
				page,
				componentKey,
				"fit",
				"fit" satisfies keyof typeof dimensions.fit.options,
			).locator(rootSel);

			await expect(iconOnlyFitBadge).toHaveText("99+");
			await expect(iconOnlyFitBadge.locator("svg")).toHaveCount(0);
		});
	});
}
