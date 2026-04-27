import { expect, test } from "@playwright/test";
import { schema } from "../packages/paleui/src/ui/alert";
import { acc, buildUrl, exLocator, expectSnap, VIEWPORTS } from "./test-utils";

const componentKey = "alert" as const;
const component = schema.components.alert;
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
			await page.goto(buildUrl("/components/alert"));

			const alert = page.locator(pageAnatomy.header).locator(rootSel);
			await expectSnap(schema, alert, root.name, viewport);
		});

		test("Dimensions", async ({ page }) => {
			await page.goto(buildUrl("/components/alert"));

			const variantCases: Record<
				keyof typeof dimensions.variant.options,
				string
			> = {
				default: dimensions.variant.options.default.name ?? "default",
				destructive:
					dimensions.variant.options.destructive.name ?? "destructive",
			};

			for (const [key, label] of Object.entries(variantCases) as [
				keyof typeof dimensions.variant.options,
				string,
			][]) {
				const alert = acc(page, componentKey, "variant", key, rootSel);
				await expectSnap(
					schema,
					alert,
					dimensions.variant.meta.title,
					label,
					viewport,
				);
			}

			const contentCases: Record<
				keyof typeof dimensions.content.options,
				string
			> = {
				title: dimensions.content.options.title.name ?? "title",
				iconTitle: dimensions.content.options.iconTitle.name ?? "icon title",
				iconTitleDescription:
					dimensions.content.options.iconTitleDescription.name ??
					"icon title description",
			};

			for (const [key, label] of Object.entries(contentCases) as [
				keyof typeof dimensions.content.options,
				string,
			][]) {
				const alert = acc(page, componentKey, "content", key, rootSel);
				await expectSnap(
					schema,
					alert,
					dimensions.content.meta.title,
					label,
					viewport,
				);
			}
		});

		test("Structure", async ({ page }) => {
			await page.goto(buildUrl("/components/alert"));

			const defaultAlert = exLocator(
				page,
				componentKey,
				"variant",
				"default" satisfies keyof typeof dimensions.variant.options,
			).locator(rootSel);

			await expect(defaultAlert).toHaveAttribute("role", "alert");
			await expect(defaultAlert.locator("svg")).toHaveCount(1);
			await expect(defaultAlert.locator("p")).toHaveCount(1);
			await expect(defaultAlert.locator("small")).toHaveCount(1);

			const titleOnlyAlert = exLocator(
				page,
				componentKey,
				"content",
				"title" satisfies keyof typeof dimensions.content.options,
			).locator(rootSel);

			await expect(titleOnlyAlert.locator("svg")).toHaveCount(0);
			await expect(titleOnlyAlert.locator("small")).toHaveCount(0);
		});
	});
}
