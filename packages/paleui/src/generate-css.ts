import * as fs from "node:fs";
import * as path from "node:path";
import type {
	TAnatomy,
	TAnatomyChild,
	TAnatomyGrandchild,
	TCSS,
	TSchema,
	TSelectors,
	TStyleBlock,
} from "./shared/types";

const red = (s: string) => `\x1b[41m ${s} \x1b[0m`;

function block(selector: string, css: string): string {
	return `${selector} {\n${css}\n}`;
}

function joinCss(css: TCSS): string {
	return css.map((decl) => (decl.endsWith(";") ? decl : `${decl};`)).join("\n");
}

//
// Select
//

const SELECTOR_MAP: Record<TSelectors, string> = {
	lastChild: "&:last-child",
	firstChild: "&:first-child",
	notLastChild: "&:not(:last-child)",
	notFirstChild: "&:not(:first-child)",
	onlyChild: "&:only-child",
	odd: "&:nth-child(odd)",
	even: "&:nth-child(even)",
};

function resolvePartState(
	partStates: Record<string, { selector: string }> | undefined,
	stateKey: string,
): string | null {
	const opt = partStates?.[stateKey];
	if (!opt?.selector) return null;
	return opt.selector
		.split(",")
		.map((s) => `&${s.trim()}`)
		.join(",\n");
}

function childPartSel(
	child: Pick<TAnatomyChild, "selector" | "direct">,
): string {
	const raw = child.selector ?? "";
	if (!raw) return "";
	if (raw.startsWith("::")) return `&${raw}`;
	const prefix = child.direct ? "> " : "";
	return raw
		.split(",")
		.map((s) => `${prefix}${s.trim()}`)
		.join(",\n");
}

function gcPartSel(
	gc: Pick<TAnatomyGrandchild, "selector" | "direct">,
): string {
	const raw = gc.selector ?? "";
	if (!raw) return "";
	if (raw.startsWith("::")) return `&${raw}`;
	const prefix = gc.direct ? "> " : "";
	return raw
		.split(",")
		.map((s) => `${prefix}${s.trim()}`)
		.join(",\n");
}

function gcWithParentStateSel(
	parentStateSel: string,
	gc: Pick<TAnatomyGrandchild, "selector" | "direct">,
): string {
	const raw = gc.selector ?? "";
	if (!raw) return "";
	const combinator = gc.direct ? " > " : " ";
	return parentStateSel
		.split(",")
		.map((s) => s.trim())
		.flatMap((ps) =>
			raw.split(",").map((gs) => `&${ps}${combinator}${gs.trim()}`),
		)
		.join(",\n");
}

function childWithRootStateSel(
	rootStateSel: string,
	child: Pick<TAnatomyChild, "selector" | "direct">,
): string {
	const raw = child.selector ?? "";
	if (!raw) return "";
	if (raw.startsWith("::")) {
		return rootStateSel
			.split(",")
			.map((s) => `&${s.trim()}${raw}`)
			.join(",\n");
	}
	const combinator = child.direct ? " > " : " ";
	return rootStateSel
		.split(",")
		.map((s) => s.trim())
		.flatMap((rs) =>
			raw.split(",").map((cs) => `&${rs}${combinator}${cs.trim()}`),
		)
		.join(",\n");
}

//
// Render
//

function renderSelectorBlocks(
	selectors: Partial<Record<TSelectors, TCSS>> | undefined,
): string[] {
	if (!selectors) return [];
	return Object.entries(selectors).flatMap(([key, css]) => {
		if (!css?.length) return [];
		const sel = SELECTOR_MAP[key as TSelectors];
		return sel ? [block(sel, joinCss(css))] : [];
	});
}

function renderGrandchildParts(
	gcDef: TAnatomyGrandchild,
	gcStyle: Partial<TStyleBlock> | undefined,
	parentStates: Record<string, { selector: string }> | undefined,
): { main: string | null; siblings: string[] } {
	if (!gcDef.selector || !gcStyle) return { main: null, siblings: [] };

	const gcParts: string[] = [];
	const siblings: string[] = [];

	if (gcStyle.base?.length) {
		gcParts.push(joinCss(gcStyle.base));
	}

	for (const [stateKey, css] of Object.entries(gcStyle.states ?? {})) {
		if (!css?.length) continue;
		if (gcDef.states?.[stateKey]) {
			const sel = resolvePartState(gcDef.states, stateKey);
			if (sel) gcParts.push(block(sel, joinCss(css)));
		} else if (parentStates?.[stateKey]) {
			const parentStateSel = parentStates[stateKey].selector;
			siblings.push(
				block(gcWithParentStateSel(parentStateSel, gcDef), joinCss(css)),
			);
		}
	}

	const sel = gcPartSel(gcDef);
	const main = gcParts.length ? block(sel, gcParts.join("\n")) : null;
	return { main, siblings };
}

function renderChildBlock(
	childKey: string,
	childDef: TAnatomyChild,
	styles: Record<string, Partial<TStyleBlock>>,
	rootStates?: Record<string, { selector: string }>,
): { main: string | null; siblings: string[] } {
	if (!childDef.selector) return { main: null, siblings: [] };

	const childStyle = styles[childKey];
	const parts: string[] = [];
	const siblings: string[] = [];

	if (childStyle?.base?.length) {
		parts.push(joinCss(childStyle.base));
	}

	for (const [stateKey, css] of Object.entries(childStyle?.states ?? {})) {
		if (!css?.length) continue;
		const childStateSel = resolvePartState(childDef.states, stateKey);
		if (childStateSel) {
			parts.push(block(childStateSel, joinCss(css)));
		} else if (rootStates?.[stateKey]) {
			siblings.push(
				block(
					childWithRootStateSel(rootStates[stateKey].selector, childDef),
					joinCss(css),
				),
			);
		}
	}

	parts.push(...renderSelectorBlocks(childStyle?.selectors));

	for (const [gcKey, gcDef] of Object.entries(childDef.children ?? {})) {
		if (!gcDef.selector) continue;
		const { main, siblings: gcSiblings } = renderGrandchildParts(
			gcDef,
			styles[gcKey],
			childDef.states,
		);
		if (main) parts.push(main);
		siblings.push(...gcSiblings);
	}

	const sel = childPartSel(childDef);
	const main = parts.length ? block(sel, parts.join("\n")) : null;
	return { main, siblings };
}

function renderDimensionOption(
	name: string,
	optionStyles: Record<string, Partial<TStyleBlock>>,
	anatomy: TAnatomy,
): string | null {
	const content: string[] = [];

	for (const [part, partStyle] of Object.entries(optionStyles)) {
		const hasCss =
			partStyle.base?.length ||
			Object.values(partStyle.states ?? {}).some((c) => c?.length) ||
			Object.values(partStyle.selectors ?? {}).some((c) => c?.length);
		if (!hasCss) continue;

		if (part === "root") {
			if (partStyle.base?.length) content.push(joinCss(partStyle.base));
			for (const [sk, css] of Object.entries(partStyle.states ?? {})) {
				if (!css?.length) continue;
				const sel = resolvePartState(anatomy.root.states, sk);
				if (sel) content.push(block(sel, joinCss(css)));
			}
			content.push(...renderSelectorBlocks(partStyle.selectors));
			continue;
		}

		const childDef = anatomy.root.children?.[part];
		if (childDef?.selector) {
			const lines: string[] = [];
			if (partStyle.base?.length) lines.push(joinCss(partStyle.base));
			for (const [sk, css] of Object.entries(partStyle.states ?? {})) {
				if (!css?.length) continue;
				const sel = resolvePartState(childDef.states, sk);
				if (sel) lines.push(block(sel, joinCss(css)));
			}
			lines.push(...renderSelectorBlocks(partStyle.selectors));
			if (lines.length)
				content.push(block(childPartSel(childDef), lines.join("\n")));
			continue;
		}

		for (const parentChild of Object.values(anatomy.root.children ?? {})) {
			const gcDef = parentChild.children?.[part];
			if (!gcDef?.selector) continue;
			const { main } = renderGrandchildParts(
				gcDef,
				partStyle,
				parentChild.states,
			);
			if (main) content.push(main);
			break;
		}
	}

	if (!content.length) return null;
	return block(`&.${name}`, content.join("\n"));
}

function renderComponent(schema: TSchema, prefix: string): string {
	const { anatomy, styles, dimensions } = schema;

	const rootSelectors = Array.isArray(anatomy.root.selector)
		? [...anatomy.root.selector]
		: [anatomy.root.selector];
	const selectorStr = (
		prefix ? rootSelectors.map((s) => `${prefix} ${s}`) : rootSelectors
	).join(",\n");

	const body: string[] = [];

	if (styles.root?.base?.length) {
		body.push(joinCss(styles.root.base));
	}

	for (const [sk, css] of Object.entries(styles.root?.states ?? {})) {
		if (!css?.length) continue;
		const sel = resolvePartState(anatomy.root.states, sk);
		if (sel) body.push(block(sel, joinCss(css)));
	}

	for (const s of renderSelectorBlocks(styles.root?.selectors)) {
		body.push(s);
	}

	for (const dim of Object.values(dimensions ?? {})) {
		for (const [name, optionStyles] of Object.entries(dim.options)) {
			if (name === "default") continue;
			const rendered = renderDimensionOption(
				name,
				optionStyles as Record<string, Partial<TStyleBlock>>,
				anatomy,
			);
			if (rendered) body.push(rendered);
		}
	}

	for (const [childKey, childDef] of Object.entries(
		anatomy.root.children ?? {},
	)) {
		const { main, siblings } = renderChildBlock(
			childKey,
			childDef,
			styles,
			anatomy.root.states,
		);
		if (main) body.push(main);
		body.push(...siblings);
	}

	return `${selectorStr} {\n${body.join("\n")}\n}`;
}

const prefixArg = process.argv.find((a) => a.startsWith("--prefix="));
const PREFIX =
	prefixArg !== undefined
		? prefixArg.slice("--prefix=".length)
		: "[data-paleui]";

function renderSchema(schema: unknown): string | null {
	const s = schema as Record<string, unknown>;
	if (s?.partial === true && typeof s.raw === "string") return s.raw;
	if (s?.anatomy && s?.styles && s?.dimensions)
		return renderComponent(s as TSchema, PREFIX);
	return null;
}

//
// Generate
//

const UI_DIR = path.resolve(import.meta.dirname, "ui");
const SHARED_DIR = path.resolve(import.meta.dirname, "shared");
const WATCH_MODE = process.argv.includes("--watch");

async function generateCSS() {
	const tsFiles = fs
		.readdirSync(UI_DIR)
		.filter((file) => file.endsWith(".ts") && !file.startsWith("_"));

	let generated = 0;
	for (const file of tsFiles) {
		const componentName = path.basename(file, ".ts");
		const mod = await import(`./ui/${componentName}.ts?t=${Date.now()}`);
		const schemas = Array.isArray(mod.schema) ? mod.schema : [mod.schema];
		const parts = schemas
			.map(renderSchema)
			.filter((s: string | null): s is string => s !== null);
		if (!parts.length) continue;

		fs.writeFileSync(
			path.join(UI_DIR, `${componentName}.css`),
			parts.join("\n\n"),
			"utf-8",
		);
		if (!WATCH_MODE) console.log(`\t✓ Generated: ${componentName}.css`);
		generated++;
	}

	console.log(
		WATCH_MODE
			? `[${new Date().toLocaleTimeString()}] Generated ${generated} CSS file(s)`
			: `${red(`Done! Generated ${generated} file(s)`)}\n`,
	);
}

if (WATCH_MODE) {
	console.log(
		red("Watching for changes in src/ui/*.ts and src/shared/*.ts..."),
	);
	generateCSS();

	fs.watch(UI_DIR, { recursive: true }, async (_, filename) => {
		if (filename?.endsWith(".ts") && !filename.startsWith("_"))
			await generateCSS();
	});

	fs.watch(SHARED_DIR, { recursive: true }, async (_, filename) => {
		if (filename?.endsWith(".ts")) await generateCSS();
	});
} else {
	console.log(red("Generating CSS from TypeScript files..."));
	generateCSS();
}
