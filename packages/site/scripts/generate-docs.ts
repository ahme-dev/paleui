import * as fs from "node:fs";
import * as path from "node:path";

const SITE_PAGES = path.resolve(import.meta.dirname, "../src/pages/components");
const PALEUI_SRC = path.resolve(import.meta.dirname, "../../paleui/src");

type DocModule = Record<string, any>;

function extractDocsFromModule(mod: DocModule, componentName: string) {
	const docsKey = `${componentName}Docs`;
	const docs = mod[docsKey];

	if (!docs || !docs.header || !docs.examples) {
		return null;
	}

	return docs;
}

async function generateDocs(mod: DocModule, componentName: string) {
	console.log(`Generating documentation for ${componentName}...`);

	const docs = extractDocsFromModule(mod, componentName);
	if (!docs) {
		console.log(`⊘ Skipping ${componentName} (no Docs export)`);
		return;
	}

	const { header } = docs;

	const astro = `---
import Header from "@/components/Header.astro";
import Section from "@/components/Section.astro";
import Subsection from "@/components/Subsection.astro";
import ComponentLayout from "../../layouts/ComponentLayout.astro";
---

<ComponentLayout title="${header.title} - PaleUI">
	<Header
		title="${header.title}"
		subtitle="${header.subtitle}"
		links={${JSON.stringify(header.mdn || [])}}
	>
		${docs.examples[0]?.examples?.[0] || ""}
	</Header>

	<Section title="Examples" >
${docs.examples
	.map(
		(
			ex: any,
		) => `\t\t<Subsection title="${ex.title}" subtitle="${ex.subtitle || ""}">
${
	ex.notes
		? `\t\t\t<Fragment slot="above">
${Array.isArray(ex.notes) ? ex.notes.map((n: string) => `\t\t\t\t<p>${n}</p>`).join("\n") : `\t\t\t\t<p>${ex.notes}</p>`}
\t\t\t</Fragment>

`
		: ""
}${ex.examples.map((html: string) => `\t\t\t${html}`).join("\n")}
\t\t</Subsection>
`,
	)
	.join("\n")}	</Section>
</ComponentLayout>
`;

	const outputFile = path.join(SITE_PAGES, `${componentName}.astro`);

	fs.writeFileSync(outputFile, astro, "utf-8");
	console.log(`✓ Generated: ${outputFile}`);
}

console.log("Discovering component files...\n");

const files = fs.readdirSync(PALEUI_SRC);
const componentFiles = files.filter(
	(file) => file.endsWith(".ts") && !file.startsWith("_"),
);

console.log(`Found ${componentFiles.length} component files\n`);

for (const file of componentFiles) {
	const componentName = path.basename(file, ".ts");
	try {
		const mod = await import(`../../paleui/src/${componentName}.ts`);
		await generateDocs(mod, componentName);
	} catch (error) {
		console.error(`✗ Error processing ${componentName}:`, error);
	}
}

console.log("\nDone!");
