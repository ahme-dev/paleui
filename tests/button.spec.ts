import { expect, test } from "@playwright/test";
import { schema } from "../packages/paleui/src/ui/button";
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
const rootSel = [root.selector].flat().join(", ");
const rootSelWithAttrs = (attrs: Record<string, string | boolean>) => {
	const a = attrsSelector(attrs);
	return [root.selector]
		.flat()
		.map((s) => s + a)
		.join(", ");
};

const statesKey = "states" satisfies keyof typeof schema.examples;

const pageAnatomy = {
	header: "[data-header]",
};

for (const [viewport, size] of Object.entries(VIEWPORTS)) {
	test.describe(`${schema.meta.title} › ${viewport}`, () => {
		test.use({ viewport: size });

		test.beforeEach(async ({ page }) => {
			await page.goto(buildUrl("/components/button"));
		});

		test.describe("Anatomy", () => {
			test(root.name, async ({ page }) => {
				const button = page.locator(pageAnatomy.header).locator(rootSel);

				await expectSnap(schema, button, root.name, viewport);
			});

			for (const [stateKey] of Object.entries(schema.examples.states ?? {})) {
				const state = root.states[stateKey as keyof typeof root.states];
				if (!("htmlAttrs" in state)) continue;
				const { htmlAttrs } = state;
				test(`${root.name} › ${state.name}`, async ({ page }) => {
					const stateButton = exLocator(page, statesKey, stateKey).locator(
						rootSelWithAttrs(htmlAttrs),
					);

					await expectSnap(
						schema,
						stateButton,
						root.name,
						state.name,
						viewport,
					);
				});
			}

			test(`${root.name} › ${root.states.hover.name}`, async ({ page }) => {
				const button = page.locator(pageAnatomy.header).locator(rootSel);

				await button.hover();

				await expectSnap(
					schema,
					button,
					root.name,
					root.states.hover.name,
					viewport,
				);
			});

			test(`${root.name} › ${root.states.focus.name}`, async ({ page }) => {
				const button = page.locator(pageAnatomy.header).locator(rootSel);

				await button.focus();

				await expectSnap(
					schema,
					button,
					root.name,
					root.states.focus.name,
					viewport,
				);
			});
		});

		test.describe("Dimensions", () => {
			for (const [dimKey, dim] of Object.entries(dimensions)) {
				for (const [optionKey, option] of Object.entries(dim.options)) {
					test(`${dim.meta.title}: ${option.name ?? optionKey}`, async ({
						page,
					}) => {
						const button = acc(page, dimKey, optionKey, rootSel);

						await expectSnap(
							schema,
							button,
							dim.meta.title,
							option.name ?? optionKey,
							viewport,
						);
					});
				}
			}
		});

		test.describe("Behavior", () => {
			test.skip(
				viewport !== "mobile",
				"Behavior tested at mobile viewport only",
			);

			test(`${root.name} › ${root.states.disabled.name}: not interactive`, async ({
				page,
			}) => {
				const disabledButton = exLocator(page, statesKey, "disabled").locator(
					rootSelWithAttrs(
						root.states.disabled.htmlAttrs as Record<string, string | boolean>,
					),
				);

				await expect(disabledButton).toHaveCSS("pointer-events", "none");
			});
		});
	});
}
