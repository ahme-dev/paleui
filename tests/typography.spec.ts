import { expect, test } from "@playwright/test";
import { pageSchema } from "../packages/paleui/src/ui/typography";
import { acc, buildUrl, exLocator, expectSnap, VIEWPORTS } from "./test-utils";

const heading = pageSchema.components.heading;
const text = pageSchema.components.text;
const code = pageSchema.components.code;
const utility = pageSchema.components.utility;

const pageAnatomy = {
	header: "[data-header]",
};

for (const [viewport, size] of Object.entries(VIEWPORTS)) {
	test.describe(`${pageSchema.meta.title} › ${viewport}`, () => {
		test.use({ viewport: size });

		test("Anatomy", async ({ page }) => {
			await page.goto(buildUrl("/components/typography"));

			const preview = page.locator(`${pageAnatomy.header} > section`).first();
			await expectSnap(page, pageSchema, preview, "Preview", viewport);
		});

		test("Dimensions", async ({ page }) => {
			await page.goto(buildUrl("/components/typography"));

			const headingCases: Record<
				keyof typeof heading.dimensions.level.options,
				string
			> = {
				h1: heading.dimensions.level.options.h1.name ?? "h1",
				h2: heading.dimensions.level.options.h2.name ?? "h2",
				h3: heading.dimensions.level.options.h3.name ?? "h3",
				h4: heading.dimensions.level.options.h4.name ?? "h4",
			};

			for (const [key, label] of Object.entries(headingCases) as [
				keyof typeof heading.dimensions.level.options,
				string,
			][]) {
				const typography = acc(
					page,
					"heading",
					"level",
					key,
					heading.anatomy.root.selector,
				);
				await expectSnap(
					pageSchema,
					typography,
					heading.anatomy.root.name,
					label,
					viewport,
				);
			}

			const textCases: Record<
				keyof typeof text.dimensions.kind.options,
				string
			> = {
				paragraph: text.dimensions.kind.options.paragraph.name ?? "paragraph",
				blockquote:
					text.dimensions.kind.options.blockquote.name ?? "blockquote",
				list: text.dimensions.kind.options.list.name ?? "list",
			};

			for (const [key, label] of Object.entries(textCases) as [
				keyof typeof text.dimensions.kind.options,
				string,
			][]) {
				const typography = acc(
					page,
					"text",
					"kind",
					key,
					text.anatomy.root.selector,
				);
				await expectSnap(
					pageSchema,
					typography,
					text.anatomy.root.name,
					label,
					viewport,
				);
			}

			const codeCases: Record<
				keyof typeof code.dimensions.kind.options,
				string
			> = {
				inlineCode:
					code.dimensions.kind.options.inlineCode.name ?? "inline code",
				codeBlock: code.dimensions.kind.options.codeBlock.name ?? "code block",
			};

			for (const [key, label] of Object.entries(codeCases) as [
				keyof typeof code.dimensions.kind.options,
				string,
			][]) {
				const typography = acc(
					page,
					"code",
					"kind",
					key,
					code.anatomy.root.selector,
				);
				await expectSnap(
					pageSchema,
					typography,
					code.anatomy.root.name,
					label,
					viewport,
				);
			}

			const utilityCases: Record<
				keyof typeof utility.dimensions.style.options,
				string
			> = {
				lead: utility.dimensions.style.options.lead.name ?? "lead",
				large: utility.dimensions.style.options.large.name ?? "large",
				small: utility.dimensions.style.options.small.name ?? "small",
				muted: utility.dimensions.style.options.muted.name ?? "muted",
			};

			for (const [key, label] of Object.entries(utilityCases) as [
				keyof typeof utility.dimensions.style.options,
				string,
			][]) {
				const typography = acc(
					page,
					"utility",
					"style",
					key,
					utility.anatomy.root.selector,
				);
				await expectSnap(
					pageSchema,
					typography,
					utility.anatomy.root.name,
					label,
					viewport,
				);
			}
		});

		test("Structure", async ({ page }) => {
			await page.goto(buildUrl("/components/typography"));

			const preview = page.locator(`${pageAnatomy.header} > section`).first();

			await expect(preview.locator("h1")).toHaveCount(1);
			await expect(preview.locator("h2")).toHaveCount(1);
			await expect(preview.locator("blockquote")).toHaveCount(1);
			await expect(preview.locator(".lead")).toHaveCount(1);

			const codeBlockExample = exLocator(
				page,
				"code",
				"kind",
				"codeBlock" satisfies keyof typeof code.dimensions.kind.options,
			);

			await expect(codeBlockExample.locator("pre")).toHaveCount(1);
			await expect(codeBlockExample.locator("pre > code")).toHaveCount(1);

			await expect(
				exLocator(
					page,
					"utility",
					"style",
					"lead" satisfies keyof typeof utility.dimensions.style.options,
				).locator(".lead"),
			).toHaveCount(1);
			await expect(
				exLocator(
					page,
					"utility",
					"style",
					"muted" satisfies keyof typeof utility.dimensions.style.options,
				).locator(".muted"),
			).toHaveCount(1);
		});
	});
}
