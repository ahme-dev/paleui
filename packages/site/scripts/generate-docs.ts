import * as fs from "node:fs";
import * as path from "node:path";

const SITE_PAGES = path.resolve(import.meta.dirname, "../src/pages/components");

async function generateDocs(componentName: string, dryRun = false) {
	console.log(`Generating documentation for ${componentName}...`);

	const mod = await import(`../../paleui/src/${componentName}.ts`);
	const { [`${componentName}Meta`]: meta, [`${componentName}Docs`]: docs } =
		mod;

	if (!meta || !docs) {
		throw new Error(
			`Missing ${componentName}Meta or ${componentName}Docs exports`,
		);
	}

	const astro = `---
import Header from "@/components/Header.astro";
import Section from "@/components/Section.astro";
import Subsection from "@/components/Subsection.astro";
import ComponentLayout from "../../layouts/ComponentLayout.astro";
---

<ComponentLayout title="${meta.title} - PaleUI">
	<Header
		title="${meta.title}"
		subtitle="${meta.subtitle}"
		links={${JSON.stringify(meta.mdn || [])}}
	>
		${docs.examples[0]?.examples?.[docs.header?.defaultValue ? docs.examples.findIndex((e: any) => e.title === "Variants") : 0] || ""}
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

	if (dryRun) {
		console.log("\n=== DRY RUN ===");
		console.log(`Would write to: ${outputFile}`);
		console.log("\n=== GENERATED CONTENT ===");
		console.log(astro);
	} else {
		fs.writeFileSync(outputFile, astro, "utf-8");
		console.log(`✓ Generated: ${outputFile}`);
	}
}

const args = process.argv.slice(2);
const componentArg = args.find((arg) => arg.startsWith("--component="));
const dryRun = args.includes("--dry-run");

if (componentArg) {
	const component = componentArg.split("=")[1];
	await generateDocs(component, dryRun);
} else {
	console.error("Usage: tsx generate-docs.ts --component=<name> [--dry-run]");
	process.exit(1);
}
