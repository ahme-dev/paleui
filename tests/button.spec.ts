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

			test(`${root.name} › ${root.states.disabled.name}`, async ({ page }) => {
				const stateButton = exLocator(
					page,
					statesKey,
					"disabled" satisfies keyof NonNullable<typeof schema.examples.states>,
				).locator(rootSelWithAttrs(root.states.disabled.htmlAttrs ?? {}));
				await expectSnap(
					schema,
					stateButton,
					root.name,
					root.states.disabled.name,
					viewport,
				);
			});

			test(`${root.name} › ${root.states.busy.name}`, async ({ page }) => {
				const stateButton = exLocator(
					page,
					statesKey,
					"busy" satisfies keyof NonNullable<typeof schema.examples.states>,
				).locator(rootSelWithAttrs(root.states.busy.htmlAttrs ?? {}));
				await expectSnap(
					schema,
					stateButton,
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

				for (const [key, label] of Object.entries(variantCases) as [
					keyof typeof dimensions.variant.options,
					string,
				][]) {
					test(label, async ({ page }) => {
						const button = acc(page, "variant", key, rootSel);
						await expectSnap(
							schema,
							button,
							dimensions.variant.meta.title,
							label,
							viewport,
						);
					});

					test(`${label} › ${root.states.hover.name}`, async ({ page }) => {
						const button = acc(page, "variant", key, rootSel);
						await button.hover();
						await expectSnap(
							schema,
							button,
							dimensions.variant.meta.title,
							label,
							root.states.hover.name,
							viewport,
						);
					});

					test(`${label} › ${root.states.focus.name}`, async ({ page }) => {
						const button = acc(page, "variant", key, rootSel);
						await button.focus();
						await expectSnap(
							schema,
							button,
							dimensions.variant.meta.title,
							label,
							root.states.focus.name,
							viewport,
						);
					});
				}
			});

			test.describe(dimensions.size.meta.title, () => {
				const sizeCases: Record<keyof typeof dimensions.size.options, string> =
					{
						xs: dimensions.size.options.xs.name ?? "xs",
						sm: dimensions.size.options.sm.name ?? "sm",
						default: dimensions.size.options.default.name ?? "default",
						lg: dimensions.size.options.lg.name ?? "lg",
					};

				for (const [key, label] of Object.entries(sizeCases) as [
					keyof typeof dimensions.size.options,
					string,
				][]) {
					test(label, async ({ page }) => {
						const button = acc(page, "size", key, rootSel);
						await expectSnap(
							schema,
							button,
							dimensions.size.meta.title,
							label,
							viewport,
						);
					});
				}
			});

			test.describe(dimensions.icon.meta.title, () => {
				const iconCases: Record<keyof typeof dimensions.icon.options, string> =
					{
						icon: dimensions.icon.options.icon.name ?? "icon",
					};

				for (const [key, label] of Object.entries(iconCases) as [
					keyof typeof dimensions.icon.options,
					string,
				][]) {
					test(label, async ({ page }) => {
						const button = acc(page, "icon", key, rootSel);
						await expectSnap(
							schema,
							button,
							dimensions.icon.meta.title,
							label,
							viewport,
						);
					});
				}
			});

			test.describe(dimensions.round.meta.title, () => {
				const roundCases: Record<
					keyof typeof dimensions.round.options,
					string
				> = {
					round: dimensions.round.options.round.name ?? "round",
				};

				for (const [key, label] of Object.entries(roundCases) as [
					keyof typeof dimensions.round.options,
					string,
				][]) {
					test(label, async ({ page }) => {
						const button = acc(page, "round", key, rootSel);
						await expectSnap(
							schema,
							button,
							dimensions.round.meta.title,
							label,
							viewport,
						);
					});
				}
			});
		});

		test.describe("Behavior", () => {
			test(`${root.name} › ${root.states.disabled.name}: not interactive`, async ({
				page,
			}) => {
				const disabledButton = exLocator(
					page,
					statesKey,
					"disabled" satisfies keyof NonNullable<typeof schema.examples.states>,
				).locator(rootSelWithAttrs(root.states.disabled.htmlAttrs ?? {}));

				await expect(disabledButton).toHaveCSS("pointer-events", "none");
			});
		});
	});
}
