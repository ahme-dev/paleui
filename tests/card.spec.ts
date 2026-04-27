import { expect, test } from "@playwright/test";
import { schema } from "../packages/paleui/src/ui/card";
import { acc, buildUrl, exLocator, expectSnap, VIEWPORTS } from "./test-utils";

const componentKey = "card" as const;
const component = schema.components.card;
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
			await page.goto(buildUrl("/components/card"));

			const card = page.locator(pageAnatomy.header).locator(rootSel);
			await expectSnap(schema, card, root.name, viewport);

			const header = exLocator(
				page,
				componentKey,
				"content",
				"default" satisfies keyof typeof dimensions.content.options,
			)
				.locator(rootSel)
				.locator(root.children.header.selector);
			await expectSnap(schema, header, root.children.header.name, viewport);

			const footer = exLocator(
				page,
				componentKey,
				"content",
				"default" satisfies keyof typeof dimensions.content.options,
			)
				.locator(rootSel)
				.locator(root.children.footer.selector);
			await expectSnap(schema, footer, root.children.footer.name, viewport);

			const image = exLocator(
				page,
				componentKey,
				"content",
				"media" satisfies keyof typeof dimensions.content.options,
			)
				.locator(rootSel)
				.locator(root.children.img.selector);
			await expectSnap(schema, image, root.children.img.name, viewport);
		});

		test("Dimensions", async ({ page }) => {
			await page.goto(buildUrl("/components/card"));

			const contentCases: Record<
				keyof typeof dimensions.content.options,
				string
			> = {
				default: dimensions.content.options.default.name ?? "default",
				media: dimensions.content.options.media.name ?? "media",
				compact: dimensions.content.options.compact.name ?? "compact",
			};

			for (const [key, label] of Object.entries(contentCases) as [
				keyof typeof dimensions.content.options,
				string,
			][]) {
				const card = acc(page, componentKey, "content", key, rootSel);
				await expectSnap(
					schema,
					card,
					dimensions.content.meta.title,
					label,
					viewport,
				);
			}
		});

		test("Structure", async ({ page }) => {
			await page.goto(buildUrl("/components/card"));

			const defaultCard = exLocator(
				page,
				componentKey,
				"content",
				"default" satisfies keyof typeof dimensions.content.options,
			).locator(rootSel);

			await expect(defaultCard).toHaveCount(1);
			await expect(defaultCard.locator("header")).toHaveCount(1);
			await expect(defaultCard.locator("footer")).toHaveCount(1);

			const mediaCard = exLocator(
				page,
				componentKey,
				"content",
				"media" satisfies keyof typeof dimensions.content.options,
			).locator(rootSel);

			await expect(mediaCard.locator("img")).toHaveAttribute(
				"alt",
				"Dashboard preview",
			);
		});
	});
}
