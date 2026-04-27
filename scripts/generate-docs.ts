import * as fs from "node:fs";
import * as path from "node:path";
import type {
	TAnatomy,
	TComponentSchema,
	TPageSchema,
} from "../packages/paleui/src/shared/types";
import { STATES_EXAMPLE_KEY } from "../packages/paleui/src/shared/types";

const red = (s: string) => `\x1b[41m ${s} \x1b[0m`;

const SITE_PAGES = path.resolve(
	import.meta.dirname,
	"../packages/site/src/pages/components",
);
const PALEUI_UI = path.resolve(
	import.meta.dirname,
	"../packages/paleui/src/ui",
);
const PALEUI_SHARED = path.resolve(
	import.meta.dirname,
	"../packages/paleui/src/shared",
);
const WATCH_MODE = process.argv.includes("--watch");

const lastGenerated = new Map<string, number>();

function toAboveSlot(blocks: readonly string[]): string {
	return blocks.length > 0
		? `<Fragment slot="above">${blocks.join("")}</Fragment>`
		: "";
}

function toParagraphs(descriptions: readonly string[]): string[] {
	return descriptions.map((description) => `<p>${description}</p>`);
}

function componentLabel(
	key: string,
	component: TComponentSchema,
): string {
	return component.anatomy.root.name || key;
}

function describePart(
	key: string,
	part: {
		selector?: string;
		name: string;
		description: readonly string[];
		type: "pseudo" | "element" | "text";
		optional?: boolean;
	},
): string {
	const token =
		part.selector && part.type !== "text"
			? part.selector
			: key.replace(/([A-Z])/g, "-$1").toLowerCase();
	const label = token.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	const description = part.description.join(" ").trim().replace(/\.$/, "");
	const optional = part.optional ? " Optional." : "";
	return `<li><code>${label}</code> — <strong>${part.name}</strong>. ${description}.${optional}</li>`;
}

function generateUsageParts(root: TAnatomy["root"]): string {
	const items: string[] = [];

	for (const [childKey, child] of Object.entries(root.children ?? {})) {
		items.push(describePart(childKey, child));

		for (const [grandchildKey, grandchild] of Object.entries(child.children ?? {})) {
			items.push(describePart(grandchildKey, grandchild));
		}
	}

	return items.length ? `<ul>${items.join("")}</ul>` : "";
}

function generateUsageSections(
	entries: [string, TComponentSchema][],
): string {
	if (!entries.length) return "";

	const multipleComponents = entries.length > 1;
	const sections = entries
		.map(([key, component]) => {
			const root = component.anatomy.root;
			const above = toAboveSlot([
				...toParagraphs(root.description),
				generateUsageParts(root),
			].filter(Boolean));
			const title = multipleComponents ? ` title="${componentLabel(key, component)}"` : "";
			return `<Subsection${title} codeOnly>${above}${root.example ?? ""}</Subsection>`;
		})
		.join("");

	return `<Section title="Usage">${sections}</Section>`;
}

function isDocsSchema(value: unknown): value is TPageSchema {
	return Boolean(
		value &&
			typeof value === "object" &&
			"meta" in value &&
			"components" in value,
	);
}

function selectDocsSchema(input: unknown): TPageSchema | null {
	if (Array.isArray(input)) {
		return input.find(isDocsSchema) ?? null;
	}

	return isDocsSchema(input) ? input : null;
}

function generateDocsFromSchema(mod: { schema: unknown }) {
	const schema = selectDocsSchema(mod.schema);
	if (!schema) {
		return null;
	}

	if (!schema?.meta || !schema?.components) {
		return null;
	}

	const { meta, components } = schema;
	const componentEntries = Object.entries(components);
	const multipleComponents = componentEntries.length > 1;
	const headerRawHtml =
		schema.headerExample ??
		componentEntries[0]?.[1].anatomy.root.example ??
		"";

	const sections = componentEntries.flatMap(([componentKey, component]) => {
		const label = componentLabel(componentKey, component);
		const dimensionEntries = Object.entries(component.dimensions);
		const multipleDimensions = dimensionEntries.length > 1;
		const rendered = dimensionEntries.map(([dimKey, dim]) => {
			const wrappedExamples = Object.entries(component.examples[dimKey] ?? {}).map(
				([variant, html]) =>
					`<div data-component="${componentKey}" data-example="${dimKey}" data-variant="${variant}">${html}</div>`,
			);

			return {
				title:
					multipleComponents
						? multipleDimensions
							? `${label}: ${dim.meta.title}`
							: label
						: dim.meta.title,
				description: dim.meta.description,
				examples: [
					`<div data-component="${componentKey}" data-dimension="${dimKey}">${wrappedExamples.join("")}</div>`,
				],
			};
		});

		if (
			component.examples[STATES_EXAMPLE_KEY] &&
			Object.keys(component.examples[STATES_EXAMPLE_KEY]).length
		) {
			const wrappedStates = Object.entries(
				component.examples[STATES_EXAMPLE_KEY],
			).map(
				([name, html]) =>
					`<div data-component="${componentKey}" data-example="${STATES_EXAMPLE_KEY}" data-variant="${name}">${html}</div>`,
			);

			rendered.push({
				title:
					multipleComponents ? `${label}: States` : "States",
				description: [
					`Similar to all components, the ${label.toLowerCase()} and its parts can be in certain states.`,
				],
				examples: [
					`<div data-component="${componentKey}" data-dimension="${STATES_EXAMPLE_KEY}">${wrappedStates.join("")}</div>`,
				],
			});
		}

		return rendered;
	});

	const structureSection = generateUsageSections(componentEntries);

	return { meta, sections, structureSection, headerRawHtml };
}

async function generateDocs(mod: { schema: unknown }, componentName: string) {
	const docs = generateDocsFromSchema(mod);
	if (!docs) {
		// console.log(`⊘ Skipping "${componentName}" (no schema/examples export)`);
		return;
	}

	const { meta, sections, structureSection, headerRawHtml } = docs;

	const belowSlot = meta.description?.length
		? `<Fragment slot="below">${meta.description.map((d: string) => `<p>${d}</p>`).join("")}</Fragment>`
		: "";

	const examplesSection =
		sections.length > 0
			? `<Section title="Examples">${sections
					.map((section) => {
						const above = section.description
							? `<Fragment slot="above">${section.description.map((n: string) => `<p>${n}</p>`).join("")}</Fragment>`
							: "";
						return `<Subsection title="${section.title}">${above}${section.examples.join("")}</Subsection>`;
					})
					.join("")}</Section>`
			: "";

	const headerHtml = headerRawHtml
		? `<div data-header>${headerRawHtml}</div>`
		: "";

	const astro = `---
// AUTO-GENERATED BY GENERATE-DOCS.TS
// DO NOT EDIT
import Header from "@/components/Header.astro";
import Section from "@/components/Section.astro";
import Subsection from "@/components/Subsection.astro";
import SideLayout from "../../layouts/SideLayout.astro";
---
<SideLayout title="${meta.title} - PaleUI">
<Header title="${meta.title}" subtitle="${meta.subtitle}" links={${JSON.stringify(meta.tags || [])}}>
${headerHtml}${belowSlot}
</Header>
${structureSection}${examplesSection}
</SideLayout>
`;

	const outputFile = path.join(SITE_PAGES, `${componentName}.astro`);

	fs.writeFileSync(outputFile, astro, "utf-8");
	console.log(`\t✓ Generated: ${outputFile}`);
	lastGenerated.set(componentName, Date.now());
}

async function generateAllDocs() {
	const files = fs.readdirSync(PALEUI_UI);
	const componentFiles = files.filter(
		(file) => file.endsWith(".ts") && !file.startsWith("_") && file !== "all.ts",
	);

	let generated = 0;
	for (const file of componentFiles) {
		const componentName = path.basename(file, ".ts");
		const filePath = path.join(PALEUI_UI, file);
		const mtime = fs.statSync(filePath).mtimeMs;
		if (mtime <= (lastGenerated.get(componentName) ?? 0)) continue;
		try {
			const mod = await import(
				`../packages/paleui/src/ui/${componentName}.ts?t=${Date.now()}`
			);
			await generateDocs(mod, componentName);
			generated++;
		} catch (error) {
			console.error(`\t✗ Error processing ${componentName}:`, error);
		}
	}

	return generated;
}

if (WATCH_MODE) {
	console.log(red("Watching for changes in paleui/src/ui/*.ts and shared/*.ts..."));
	generateAllDocs();

	fs.watch(PALEUI_UI, { recursive: true }, async (_, filename) => {
		if (
			filename?.endsWith(".ts") &&
			!filename.startsWith("_") &&
			filename !== "all.ts"
		) {
			const componentName = path.basename(filename, ".ts");
			try {
				const mod = await import(
					`../packages/paleui/src/ui/${componentName}.ts?t=${Date.now()}`
				);
				await generateDocs(mod, componentName);
			} catch (error) {
				console.error(`✗ Error processing ${componentName}:`, error);
			}
		}
	});

	fs.watch(PALEUI_SHARED, { recursive: true }, async (_, filename) => {
		if (filename?.endsWith(".ts")) {
			lastGenerated.clear();
			await generateAllDocs();
		}
	});
} else {
	console.log(red("Discovering component files..."));
	const generated = await generateAllDocs();
	console.log(red(`Done! Generated ${generated} doc(s)`) + "\n");
}
