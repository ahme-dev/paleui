import * as fs from "node:fs";
import * as path from "node:path";
import type { TAnatomy, TSchema } from "../packages/paleui/src/shared/types";
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

function describeChild(
	selector: string | undefined,
	type: string,
	description: readonly string[],
	optional: boolean,
): string {
	const opt = optional ? " (optional)" : "";
	const desc = description.join(" ");
	if (selector && type !== "text") {
		const safeSel = selector.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		return `<code>${safeSel}</code> — ${desc}${opt}.`;
	}
	return `${desc}${opt}.`;
}

function generateAnatomyDescription(anatomy: TAnatomy): string[] {
	const descriptions: string[] = [];
	const root = anatomy.root;

	if (root.description?.length) {
		descriptions.push(...root.description);
	} else {
		const sel =
			typeof root.selector === "string" ? root.selector : root.selector[0];
		descriptions.push(`Built on the <code>&lt;${sel}&gt;</code> element.`);
	}

	if (!root.children) return descriptions;

	for (const child of Object.values(root.children)) {
		if (child.description?.length) {
			descriptions.push(
				describeChild(child.selector, child.type, child.description, child.optional ?? false),
			);
		}

		if (!child.children) continue;

		for (const gc of Object.values(child.children)) {
			if (gc.description?.length) {
				descriptions.push(
					describeChild(gc.selector, gc.type, gc.description, gc.optional ?? false),
				);
			}
		}
	}

	return descriptions;
}

function generateStructureSection(schema: TSchema): string {
	if (!schema.anatomy) return "";

	const root = schema.anatomy.root;
	const descriptions = generateAnatomyDescription(schema.anatomy);
	const example = root.example;

	if (descriptions.length === 0 && !example) return "";

	const aboveSlot =
		descriptions.length > 0
			? `<Fragment slot="above">${descriptions.map((d) => `<p>${d}</p>`).join("")}</Fragment>`
			: "";

	return `<Section title="Usage"><Subsection codeOnly>${aboveSlot}${example || ""}</Subsection></Section>`;
}

function isDocsSchema(value: unknown): value is TSchema {
	return Boolean(
		value &&
			typeof value === "object" &&
			"meta" in value &&
			"anatomy" in value &&
			"dimensions" in value &&
			"examples" in value,
	);
}

function selectDocsSchema(input: unknown): TSchema | null {
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

	if (!schema?.meta || !schema?.anatomy || !schema?.examples || !schema?.dimensions) {
		return null;
	}

	const { meta, anatomy, dimensions, examples } = schema;

	const headerRawHtml = anatomy.root.example ?? "";

	const sections = Object.entries(dimensions).map(([dimKey, dim]) => {
		const wrappedExamples = Object.entries(examples[dimKey] ?? {}).map(
			([variant, html]) =>
				`<div data-example="${dimKey}" data-variant="${variant}">${html}</div>`,
		);
		return {
			title: dim.meta.title,
			description: dim.meta.description,
			examples: [`<div data-dimension="${dimKey}">${wrappedExamples.join("")}</div>`],
		};
	});

	if (examples[STATES_EXAMPLE_KEY] && Object.keys(examples[STATES_EXAMPLE_KEY]).length) {
		const wrappedStates = Object.entries(examples[STATES_EXAMPLE_KEY]).map(
			([name, html]) =>
				`<div data-example="${STATES_EXAMPLE_KEY}" data-variant="${name}">${html}</div>`,
		);
		sections.push({
			title: "States",
			description: [`Similar to all components, the ${meta.title?.toLowerCase()} and its parts can be in certain states.`],
			examples: [`<div data-dimension="${STATES_EXAMPLE_KEY}">${wrappedStates.join("")}</div>`],
		});
	}

	const structureSection = generateStructureSection(schema);

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
