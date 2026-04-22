import { expect, test } from "@playwright/test";
import { schema } from "../packages/paleui/src/ui/accordion";
import {
	acc,
	attrsSelector,
	buildUrl,
	exLocator,
	expectSnap,
	VIEWPORTS,
} from "./test-utils";

const { anatomy, dimensions } = schema;
const root = anatomy.root;
const item = root.children.item;
const trigger = item.children.summary;

const statesKey = "states" satisfies keyof typeof schema.examples;

const pageAnatomy = {
	header: "[data-header]",
};

for (const [viewport, size] of Object.entries(VIEWPORTS)) {
	test.describe(`${schema.meta.title} › ${viewport}`, () => {
		test.use({ viewport: size });

		test.beforeEach(async ({ page }) => {
			await page.goto(buildUrl("/components/accordion"));
		});

		test.describe("Anatomy", () => {
			test(root.name, async ({ page }) => {
				const wrapper = page
					.locator(pageAnatomy.header)
					.locator(root.selector);
				await expectSnap(schema, wrapper, root.name, viewport);
			});

			test(`${trigger.name} › ${trigger.states.hover.name}`, async ({ page }) => {
				const summary = page
					.locator(pageAnatomy.header)
					.locator(root.selector)
					.locator(item.selector)
					.first()
					.locator(trigger.selector);
				await summary.hover();
				await expectSnap(schema, summary, trigger.name, trigger.states.hover.name, viewport);
			});

			test(`${trigger.name} › ${trigger.states.focus.name}`, async ({ page }) => {
				const summary = page
					.locator(pageAnatomy.header)
					.locator(root.selector)
					.locator(item.selector)
					.first()
					.locator(trigger.selector);
				await summary.focus();
				await expectSnap(schema, summary, trigger.name, trigger.states.focus.name, viewport);
			});

			test(`${item.name} › ${item.states.open.name}`, async ({ page }) => {
				const stateItem = exLocator(
					page,
					statesKey,
					"open" satisfies keyof NonNullable<typeof schema.examples.states>,
				).locator(item.selector + attrsSelector(item.states.open.htmlAttrs ?? {}));
				await expectSnap(schema, stateItem, item.name, item.states.open.name, viewport);
			});

			test(`${item.name} › ${item.states.disabled.name}`, async ({ page }) => {
				const stateItem = exLocator(
					page,
					statesKey,
					"disabled" satisfies keyof NonNullable<typeof schema.examples.states>,
				).locator(item.selector + attrsSelector(item.states.disabled.htmlAttrs ?? {}));
				await expectSnap(schema, stateItem, item.name, item.states.disabled.name, viewport);
			});
		});

		test.describe("Dimensions", () => {
			// Record keyed on every option — TypeScript errors if an option is added or removed
			const modeCases: Record<keyof typeof dimensions.mode.options, string> = {
				multi: dimensions.mode.options.multi.name ?? "multi",
				single: dimensions.mode.options.single.name ?? "single",
			};

			for (const [key, label] of Object.entries(modeCases) as [keyof typeof dimensions.mode.options, string][]) {
				test(label, async ({ page }) => {
					const wrapper = acc(page, "mode", key, root.selector);
					await expectSnap(schema, wrapper, dimensions.mode.meta.title, label, viewport);
				});

				test(`${label} › ${trigger.states.hover.name}`, async ({ page }) => {
					const summary = acc(page, "mode", key, root.selector)
						.locator(item.selector)
						.first()
						.locator(trigger.selector);
					await summary.hover();
					await expectSnap(schema, summary, dimensions.mode.meta.title, label, trigger.states.hover.name, viewport);
				});

				test(`${label} › ${trigger.states.focus.name}`, async ({ page }) => {
					const summary = acc(page, "mode", key, root.selector)
						.locator(item.selector)
						.first()
						.locator(trigger.selector);
					await summary.focus();
					await expectSnap(schema, summary, dimensions.mode.meta.title, label, trigger.states.focus.name, viewport);
				});
			}
		});

		test.describe("Behavior", () => {
			const [firstModeKey] = Object.keys(dimensions.mode.options) as [keyof typeof dimensions.mode.options];

			test(`${item.name} toggles on click`, async ({ page }) => {
				const example = exLocator(page, "mode", firstModeKey);
				const closedItem = example.locator(item.selector).nth(1);
				const closedSummary = closedItem.locator(trigger.selector);

				await expect(closedItem).not.toHaveAttribute("open");
				await closedSummary.click();
				await expect(closedItem).toHaveAttribute("open");
				await closedSummary.click();
				await expect(closedItem).not.toHaveAttribute("open");
			});

			test(`${dimensions.mode.meta.title} › ${dimensions.mode.options.multi.name}: multiple items open simultaneously`, async ({
				page,
			}) => {
				const example = exLocator(
					page,
					"mode",
					"multi" satisfies keyof typeof dimensions.mode.options,
				);
				const items = example.locator(item.selector);

				await items.nth(1).locator(trigger.selector).click();
				await items.nth(2).locator(trigger.selector).click();

				await expect(items.nth(0)).toHaveAttribute("open");
				await expect(items.nth(1)).toHaveAttribute("open");
				await expect(items.nth(2)).toHaveAttribute("open");
			});

			test(`${dimensions.mode.meta.title} › ${dimensions.mode.options.single.name}: opening one closes others`, async ({
				page,
			}) => {
				const example = exLocator(
					page,
					"mode",
					"single" satisfies keyof typeof dimensions.mode.options,
				);
				const items = example.locator(item.selector);

				await expect(items.nth(0)).toHaveAttribute("open");
				await items.nth(1).locator(trigger.selector).click();

				await expect(items.nth(0)).not.toHaveAttribute("open");
				await expect(items.nth(1)).toHaveAttribute("open");
			});

			test(`${item.name} › ${item.states.disabled.name}: not interactive`, async ({
				page,
			}) => {
				const disabledItem = exLocator(
					page,
					statesKey,
					"disabled" satisfies keyof NonNullable<typeof schema.examples.states>,
				).locator(item.selector + attrsSelector(item.states.disabled.htmlAttrs ?? {}));

				await expect(disabledItem).toHaveCSS("pointer-events", "none");
			});
		});
	});
}
