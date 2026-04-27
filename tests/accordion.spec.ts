import { expect, test } from "@playwright/test";
import { schema } from "../packages/paleui/src/ui/accordion";
import {
	acc,
	attrsSelector,
	buildUrl,
	exLocator,
	expectPaddedSnap,
	expectSnap,
	focusByKeyboard,
	VIEWPORTS,
} from "./test-utils";

const componentKey = "accordion" as const;
const component = schema.components.accordion;
const { anatomy, dimensions } = component;
const root = anatomy.root;
const item = root.children.item;
const trigger = item.children.summary;

const statesKey = "states" satisfies keyof typeof component.examples;

const pageAnatomy = {
	header: "[data-header]",
};

for (const [viewport, size] of Object.entries(VIEWPORTS)) {
	test.describe(`${schema.meta.title} › ${viewport}`, () => {
		test.use({ viewport: size });

		test.describe("Anatomy", () => {
			test("captures all anatomy states", async ({ page }) => {
				await page.goto(buildUrl("/components/accordion"));

				const wrapper = page.locator(pageAnatomy.header).locator(root.selector);
				await expectSnap(schema, wrapper, root.name, viewport);

				const summary = page
					.locator(pageAnatomy.header)
					.locator(root.selector)
					.locator(item.selector)
					.first()
					.locator(trigger.selector);
				await summary.hover();
				await expectSnap(
					schema,
					summary,
					trigger.name,
					trigger.states.hover.name,
					viewport,
				);
				await page.mouse.move(0, 0);
				await focusByKeyboard(page, summary);
				await expectPaddedSnap(
					page,
					schema,
					summary,
					8,
					trigger.name,
					trigger.states.focus.name,
					viewport,
				);

				const stateItem = exLocator(
					page,
					componentKey,
					statesKey,
					"open" satisfies keyof NonNullable<typeof component.examples.states>,
				).locator(
					item.selector + attrsSelector(item.states.open.htmlAttrs ?? {}),
				);
				await expectSnap(
					schema,
					stateItem,
					item.name,
					item.states.open.name,
					viewport,
				);

				const disabledItem = exLocator(
					page,
					componentKey,
					statesKey,
					"disabled" satisfies keyof NonNullable<
						typeof component.examples.states
					>,
				).locator(
					item.selector + attrsSelector(item.states.disabled.htmlAttrs ?? {}),
				);
				await expectSnap(
					schema,
					disabledItem,
					item.name,
					item.states.disabled.name,
					viewport,
				);
			});
		});

		test.describe("Dimensions", () => {
			// Record keyed on every option — TypeScript errors if an option is added or removed
			const modeCases: Record<keyof typeof dimensions.mode.options, string> = {
				multi: dimensions.mode.options.multi.name ?? "multi",
				single: dimensions.mode.options.single.name ?? "single",
			};

			test("captures every mode state", async ({ page }) => {
				await page.goto(buildUrl("/components/accordion"));

				for (const [key, label] of Object.entries(modeCases) as [
					keyof typeof dimensions.mode.options,
					string,
				][]) {
					const wrapper = acc(page, componentKey, "mode", key, root.selector);
					await expectSnap(
						schema,
						wrapper,
						dimensions.mode.meta.title,
						label,
						viewport,
					);

					const summary = wrapper
						.locator(item.selector)
						.first()
						.locator(trigger.selector);
					await summary.hover();
					await expectSnap(
						schema,
						summary,
						dimensions.mode.meta.title,
						label,
						trigger.states.hover.name,
						viewport,
					);
					await page.mouse.move(0, 0);
					await focusByKeyboard(page, summary);
					await expectPaddedSnap(
						page,
						schema,
						summary,
						8,
						dimensions.mode.meta.title,
						label,
						trigger.states.focus.name,
						viewport,
					);
				}
			});
		});

		test.describe("Behavior", () => {
			const [firstModeKey] = Object.keys(dimensions.mode.options) as [
				keyof typeof dimensions.mode.options,
			];

			test("covers interaction behavior", async ({ page }) => {
				await page.goto(buildUrl("/components/accordion"));

				const example = exLocator(page, componentKey, "mode", firstModeKey);
				const closedItem = example.locator(item.selector).nth(1);
				const closedSummary = closedItem.locator(trigger.selector);

				await expect(closedItem).not.toHaveAttribute("open");
				await closedSummary.click();
				await expect(closedItem).toHaveAttribute("open");
				await closedSummary.click();
				await expect(closedItem).not.toHaveAttribute("open");

				const multiExample = exLocator(
					page,
					componentKey,
					"mode",
					"multi" satisfies keyof typeof dimensions.mode.options,
				);
				const multiItems = multiExample.locator(item.selector);

				await multiItems.nth(1).locator(trigger.selector).click();
				await multiItems.nth(2).locator(trigger.selector).click();

				await expect(multiItems.nth(0)).toHaveAttribute("open");
				await expect(multiItems.nth(1)).toHaveAttribute("open");
				await expect(multiItems.nth(2)).toHaveAttribute("open");

				const singleExample = exLocator(
					page,
					componentKey,
					"mode",
					"single" satisfies keyof typeof dimensions.mode.options,
				);
				const singleItems = singleExample.locator(item.selector);

				await expect(singleItems.nth(0)).toHaveAttribute("open");
				await singleItems.nth(1).locator(trigger.selector).click();

				await expect(singleItems.nth(0)).not.toHaveAttribute("open");
				await expect(singleItems.nth(1)).toHaveAttribute("open");

				const disabledItem = exLocator(
					page,
					componentKey,
					statesKey,
					"disabled" satisfies keyof NonNullable<
						typeof component.examples.states
					>,
				).locator(
					item.selector + attrsSelector(item.states.disabled.htmlAttrs ?? {}),
				);
				const disabledSummary = disabledItem.locator(trigger.selector);

				await expect(disabledItem).toHaveCSS("pointer-events", "none");
				await expect(disabledItem).toHaveAttribute("inert", "");

				await expect(disabledItem).not.toHaveAttribute("open");
				await disabledSummary.evaluate((element) =>
					(element as HTMLElement).focus(),
				);
				await expect(disabledSummary).not.toBeFocused();
				await page.keyboard.press("Enter");
				await expect(disabledItem).not.toHaveAttribute("open");
			});
		});
	});
}
