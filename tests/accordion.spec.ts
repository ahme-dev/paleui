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
const item = anatomy.root.children.item;
const trigger = item.children.summary;

const [modeKey] = Object.keys(dimensions);
const [firstOptionKey] = Object.keys(dimensions.mode.options);
const modeTitle = dimensions.mode.meta.title;
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
			test(anatomy.root.name, async ({ page }) => {
				const wrapper = page
					.locator(pageAnatomy.header)
					.locator(anatomy.root.selector);

				await expectSnap(schema, wrapper, anatomy.root.name, viewport);
			});

			for (const [stateKey] of Object.entries(schema.examples.states ?? {})) {
				const state = item.states[stateKey as keyof typeof item.states];
				if (!("htmlAttrs" in state)) continue;
				const { htmlAttrs } = state;
				test(`${item.name} › ${state.name}`, async ({ page }) => {
					const stateItem = exLocator(page, statesKey, stateKey).locator(
						item.selector + attrsSelector(htmlAttrs),
					);

					await expectSnap(schema, stateItem, item.name, state.name, viewport);
				});
			}

			test(`${trigger.name} › ${trigger.states.hover.name}`, async ({
				page,
			}) => {
				const summary = page
					.locator(pageAnatomy.header)
					.locator(anatomy.root.selector)
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
			});

			test(`${trigger.name} › ${trigger.states.focus.name}`, async ({
				page,
			}) => {
				const summary = page
					.locator(pageAnatomy.header)
					.locator(anatomy.root.selector)
					.locator(item.selector)
					.first()
					.locator(trigger.selector);

				await summary.focus();

				await expectSnap(
					schema,
					summary,
					trigger.name,
					trigger.states.focus.name,
					viewport,
				);
			});
		});

		test.describe("Dimensions", () => {
			for (const [optionKey, option] of Object.entries(
				dimensions.mode.options,
			)) {
				test(`${modeTitle}: ${option.name}`, async ({ page }) => {
					const wrapper = acc(page, modeKey, optionKey, anatomy.root.selector);

					await expectSnap(
						schema,
						wrapper,
						modeTitle,
						option.name ?? optionKey,
						viewport,
					);
				});
			}
		});

		test.describe("Behavior", () => {
			test.skip(
				viewport !== "mobile",
				"Behavior tested at mobile viewport only",
			);

			const { multi, single } = dimensions.mode.options;

			test(`${item.name} toggles on click`, async ({ page }) => {
				const example = exLocator(page, modeKey, firstOptionKey);
				const closedItem = example.locator(item.selector).nth(1);
				const closedSummary = closedItem.locator(trigger.selector);

				await expect(closedItem).not.toHaveAttribute("open");
				await closedSummary.click();
				await expect(closedItem).toHaveAttribute("open");
				await closedSummary.click();
				await expect(closedItem).not.toHaveAttribute("open");
			});

			test(`${modeTitle} › ${multi.name}: multiple items open simultaneously`, async ({
				page,
			}) => {
				const example = exLocator(page, modeKey, "multi");
				const items = example.locator(item.selector);

				await items.nth(1).locator(trigger.selector).click();
				await items.nth(2).locator(trigger.selector).click();

				await expect(items.nth(0)).toHaveAttribute("open");
				await expect(items.nth(1)).toHaveAttribute("open");
				await expect(items.nth(2)).toHaveAttribute("open");
			});

			test(`${modeTitle} › ${single.name}: opening one closes others`, async ({
				page,
			}) => {
				const example = exLocator(page, modeKey, "single");
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
				).locator(
					item.selector + attrsSelector(item.states.disabled.htmlAttrs),
				);

				await expect(disabledItem).toHaveCSS("pointer-events", "none");
			});
		});
	});
}
