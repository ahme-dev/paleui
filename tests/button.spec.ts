import { readFileSync } from "node:fs";
import { expect, type Locator, test } from "@playwright/test";
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

const componentKey = "button" as const;
const component = schema.components.button;
const { anatomy, dimensions } = component;
const root = anatomy.root;
const rootSel = [root.selector].flat().join(", ");
const rootSelWithAttrs = (attrs: Record<string, string | boolean>) => {
	const a = attrsSelector(attrs);
	return [root.selector]
		.flat()
		.map((s) => s + a)
		.join(", ");
};

const statesKey = "states" satisfies keyof typeof component.examples;

const pageAnatomy = {
	header: "[data-header]",
};

async function readButtonStyles(locator: Locator) {
	return locator.evaluate((element) => {
		const styles = getComputedStyle(element);
		return {
			display: styles.display,
			alignItems: styles.alignItems,
			justifyContent: styles.justifyContent,
			paddingTop: styles.paddingTop,
			paddingRight: styles.paddingRight,
			paddingBottom: styles.paddingBottom,
			paddingLeft: styles.paddingLeft,
			borderRadius: styles.borderRadius,
			backgroundColor: styles.backgroundColor,
			color: styles.color,
			textDecorationLine: styles.textDecorationLine,
		};
	});
}

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
					componentKey,
					statesKey,
					"disabled" satisfies keyof NonNullable<
						typeof component.examples.states
					>,
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
					componentKey,
					statesKey,
					"busy" satisfies keyof NonNullable<typeof component.examples.states>,
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
						const button = acc(
							page,
							componentKey,
							"variant",
							variantKey,
							rootSel,
						);
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
						const button = acc(page, componentKey, "size", key, rootSel);
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
						componentKey,
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
						componentKey,
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
			test("anchor elements can reuse button classes for navigation styling", async ({
				page,
			}) => {
				await page.goto(buildUrl("/components/button"));

				await page.locator(pageAnatomy.header).evaluate((header) => {
					const anchor = document.createElement("a");
					anchor.href = "/components";
					anchor.className = "button secondary";
					anchor.textContent = "Anchor";
					header.appendChild(anchor);
				});

				const anchorButton = page.locator(
					`${pageAnatomy.header} > a.button.secondary`,
				);
				const nativeButton = acc(
					page,
					componentKey,
					"variant",
					"secondary" satisfies keyof typeof dimensions.variant.options,
					rootSel,
				);

				await expect(anchorButton).toHaveAttribute("href", "/components");
				const [anchorStyles, nativeStyles] = await Promise.all([
					readButtonStyles(anchorButton),
					readButtonStyles(nativeButton),
				]);
				expect(anchorStyles).toEqual(nativeStyles);
			});

			test("disabled and busy states stay inactive", async ({ page }) => {
				await page.goto(buildUrl("/components/button"));

				const disabledButton = exLocator(
					page,
					componentKey,
					statesKey,
					"disabled" satisfies keyof NonNullable<
						typeof component.examples.states
					>,
				).locator(rootSelWithAttrs(root.states.disabled.htmlAttrs ?? {}));

				await expect(disabledButton).toHaveCSS("pointer-events", "none");
				await expect(disabledButton).toBeDisabled();

				const busyButton = exLocator(
					page,
					componentKey,
					statesKey,
					"busy" satisfies keyof NonNullable<typeof component.examples.states>,
				).locator(rootSelWithAttrs(root.states.busy.htmlAttrs ?? {}));

				await expect(busyButton).toHaveAttribute("aria-busy", "true");
				await expect(busyButton).toBeDisabled();
			});
		});
	});
}
