import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { schema } from "../packages/paleui/src/ui/button";
import {
	acc,
	attrsSelector,
	buildUrl,
	exLocator,
	expectSnap,
	focusByKeyboard,
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

test.describe(`${schema.meta.title} › Package CSS`, () => {
	test("loading spinner animation is provided by main.css", () => {
		const buttonCss = readFileSync(
			new URL("../packages/paleui/lib/button.css", import.meta.url),
			"utf-8",
		);
		const mainCss = readFileSync(
			new URL("../packages/paleui/lib/main.css", import.meta.url),
			"utf-8",
		);

		expect(buttonCss).toContain("animation: spin");
		expect(mainCss).toContain("@keyframes spin");
	});
});

for (const [viewport, size] of Object.entries(VIEWPORTS)) {
	test.describe(`${schema.meta.title} › ${viewport}`, () => {
		test.describe.configure({ timeout: 60_000 });
		test.use({ viewport: size });

		test.describe("Anatomy", () => {
			test("captures all anatomy states", async ({ page }) => {
				await page.goto(buildUrl("/components/button"));

				const button = page.locator(pageAnatomy.header).locator(rootSel);
				await expectSnap(page, schema, button, root.name, viewport);
				await button.hover();
				await expectSnap(
					page,
					schema,
					button,
					root.name,
					root.states.hover.name,
					viewport,
				);
				await page.mouse.move(0, 0);
				await focusByKeyboard(page, button);
				await expectSnap(
					page,
					schema,
					button,
					root.name,
					root.states.focus.name,
					viewport,
				);

				const stateButton = exLocator(
					page,
					statesKey,
					"disabled" satisfies keyof NonNullable<typeof schema.examples.states>,
				).locator(rootSelWithAttrs(root.states.disabled.htmlAttrs ?? {}));
				await expectSnap(
					page,
					schema,
					stateButton,
					root.name,
					root.states.disabled.name,
					viewport,
				);

				const busyButton = exLocator(
					page,
					statesKey,
					"busy" satisfies keyof NonNullable<typeof schema.examples.states>,
				).locator(rootSelWithAttrs(root.states.busy.htmlAttrs ?? {}));
				await expectSnap(
					page,
					schema,
					busyButton,
					root.name,
					root.states.busy.name,
					viewport,
				);
			});
		});

		test.describe("Dimensions", () => {
			test.describe(dimensions.variant.meta.title, () => {
				const variantCases: Record<
					keyof typeof dimensions.variant.options,
					string
				> = {
					default: dimensions.variant.options.default.name ?? "default",
					outline: dimensions.variant.options.outline.name ?? "outline",
					secondary: dimensions.variant.options.secondary.name ?? "secondary",
					ghost: dimensions.variant.options.ghost.name ?? "ghost",
					destructive:
						dimensions.variant.options.destructive.name ?? "destructive",
					link: dimensions.variant.options.link.name ?? "link",
				};

				test("captures every variant state", async ({ page }) => {
					await page.goto(buildUrl("/components/button"));

					for (const [variantKey, variantLabel] of Object.entries(
						variantCases,
					) as [keyof typeof dimensions.variant.options, string][]) {
						const button = acc(page, "variant", variantKey, rootSel);
						await expectSnap(
							page,
							schema,
							button,
							dimensions.variant.meta.title,
							variantLabel,
							viewport,
						);
						await button.hover();
						await expectSnap(
							page,
							schema,
							button,
							dimensions.variant.meta.title,
							variantLabel,
							root.states.hover.name,
							viewport,
						);
						await page.mouse.move(0, 0);
						await focusByKeyboard(page, button);
						await expectSnap(
							page,
							schema,
							button,
							dimensions.variant.meta.title,
							variantLabel,
							root.states.focus.name,
							viewport,
						);
					}
				});
			});

			test.describe(dimensions.size.meta.title, () => {
				const sizeCases: Record<keyof typeof dimensions.size.options, string> =
					{
						xs: dimensions.size.options.xs.name ?? "xs",
						sm: dimensions.size.options.sm.name ?? "sm",
						default: dimensions.size.options.default.name ?? "default",
						lg: dimensions.size.options.lg.name ?? "lg",
					};

				test("captures every size", async ({ page }) => {
					await page.goto(buildUrl("/components/button"));

					for (const [key, label] of Object.entries(sizeCases) as [
						keyof typeof dimensions.size.options,
						string,
					][]) {
						const button = acc(page, "size", key, rootSel);
						await expectSnap(
							page,
							schema,
							button,
							dimensions.size.meta.title,
							label,
							viewport,
						);
					}
				});
			});

			test.describe(dimensions.icon.meta.title, () => {
				test("captures icon option", async ({ page }) => {
					await page.goto(buildUrl("/components/button"));

					const iconButton = acc(
						page,
						"icon",
						"icon" satisfies keyof typeof dimensions.icon.options,
						rootSel,
					);
					await expectSnap(
						page,
						schema,
						iconButton,
						dimensions.icon.meta.title,
						dimensions.icon.options.icon.name ?? "icon",
						viewport,
					);
				});
			});

			test.describe(dimensions.round.meta.title, () => {
				test("captures round option", async ({ page }) => {
					await page.goto(buildUrl("/components/button"));

					const roundButton = acc(
						page,
						"round",
						"round" satisfies keyof typeof dimensions.round.options,
						rootSel,
					);
					await expectSnap(
						page,
						schema,
						roundButton,
						dimensions.round.meta.title,
						dimensions.round.options.round.name ?? "round",
						viewport,
					);
				});
			});
		});

		test.describe("Behavior", () => {
			test("disabled and busy states stay inactive", async ({ page }) => {
				await page.goto(buildUrl("/components/button"));

				const disabledButton = exLocator(
					page,
					statesKey,
					"disabled" satisfies keyof NonNullable<typeof schema.examples.states>,
				).locator(rootSelWithAttrs(root.states.disabled.htmlAttrs ?? {}));

				await expect(disabledButton).toHaveCSS("pointer-events", "none");
				await expect(disabledButton).toBeDisabled();

				const busyButton = exLocator(
					page,
					statesKey,
					"busy" satisfies keyof NonNullable<typeof schema.examples.states>,
				).locator(rootSelWithAttrs(root.states.busy.htmlAttrs ?? {}));

				await expect(busyButton).toHaveAttribute("aria-busy", "true");
				await expect(busyButton).toBeDisabled();
			});
		});
	});
}
