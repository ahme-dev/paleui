import * as fs from "node:fs";
import * as path from "node:path";
import type {
	TAnatomyRoot,
	TCSS,
	TSchema,
	TStates,
	TStyleBlock,
} from "./shared/types";

const red = (s: string) => `\x1b[41m ${s} \x1b[0m`;

function indent(str: string, level = 1): string {
	const tabs = "\t".repeat(level);
	return str
		.split("\n")
		.map((line) => (line.trim() ? tabs + line.trim() : line))
		.join("\n");
}

function block(selector: string, css: string): string {
	return `${selector} {\n${indent(css)}\n}`;
}

function joinCss(css: TCSS): string {
	return css.join("\n");
}

function resolveStateSelector(states: TStates, state: string): string | null {
	const opt = states.options[state];
	if (!opt?.selector) return null;
	return opt.selector
		.split(",")
		.map((s) => `&${s.trim()}`)
		.join(",\n");
}

function resolveAnatomyChild(
	anatomy: Record<string, TAnatomyRoot>,
	part: string,
): { selector: string; direct: boolean; visibleWhen: string | null } | null {
	if (part === "root")
		return { selector: "&", direct: false, visibleWhen: null };
	const child = anatomy.root?.children?.[part];
	if (!child?.selector) return null;
	return {
		selector: child.selector,
		direct: child.direct === true,
		visibleWhen: child.visibleWhen ?? null,
	};
}

function nestingSelector(rawSelector: string, isDirect: boolean): string {
	if (rawSelector.startsWith("::")) return `&${rawSelector}`;
	const prefix = isDirect ? "> " : "";
	return rawSelector
		.split(",")
		.map((s) => `${prefix}${s.trim()}`)
		.join(",\n");
}

function statePrefixedSelector(
	stateSel: string,
	rawSelector: string,
	isDirect: boolean,
): string {
	const stateParts = stateSel.split(",").map((s) => s.trim());
	if (rawSelector.startsWith("::")) {
		return stateParts.map((sp) => `${sp}${rawSelector}`).join(",\n");
	}
	const childParts = rawSelector.split(",").map((s) => s.trim());
	const combinator = isDirect ? " > " : " ";
	return stateParts
		.flatMap((sp) => childParts.map((cp) => `${sp}${combinator}${cp}`))
		.join(",\n");
}

function renderDimensionOption(
	name: string,
	optionStyles: Record<string, Partial<TStyleBlock>>,
	anatomy: TSchema["anatomy"],
	states: TStates,
): string | null {
	const content = Object.entries(optionStyles).flatMap(([part, partStyle]) => {
		const child = resolveAnatomyChild(anatomy, part);

		if (part === "root" || child?.selector === "&") {
			return [
				...(partStyle.base?.length ? [joinCss(partStyle.base)] : []),
				...Object.entries(partStyle.states ?? {}).flatMap(([state, css]) => {
					if (!css?.length) return [];
					const sel = resolveStateSelector(states, state);
					return sel ? [block(sel, joinCss(css))] : [];
				}),
			];
		}

		if (!child || !partStyle.base?.length) return [];
		return [
			block(
				nestingSelector(child.selector, child.direct),
				joinCss(partStyle.base),
			),
		];
	});

	if (!content.length) return null;
	return indent(block(`&.${name}`, content.join("\n\n")));
}

function renderComponent(schema: TSchema, prefix: string): string {
	const { anatomy, states, styles, dimensions } = schema;

	const rootSelectors = Array.isArray(anatomy.root.selector)
		? [...anatomy.root.selector]
		: [anatomy.root.selector];
	const selectorStr = (
		prefix ? rootSelectors.map((s) => `${prefix} ${s}`) : rootSelectors
	).join(",\n");

	// precompute child parts (reused for base styles and state overrides)
	const childParts = Object.entries(styles).filter(
		([part]) => part !== "root" && part !== "text",
	);

	const body = [
		// root base
		...(styles.root?.base?.length ? [indent(joinCss(styles.root.base))] : []),

		// child base styles (grouped under state selector if visibleWhen)
		...childParts.flatMap(([part, style]) => {
			const child = resolveAnatomyChild(anatomy, part);
			if (!child || child.selector === "&" || !style.base?.length) return [];
			if (child.visibleWhen) {
				const sel = resolveStateSelector(states, child.visibleWhen);
				if (!sel) return [];
				return [
					indent(
						block(
							statePrefixedSelector(sel, child.selector, child.direct),
							joinCss(style.base),
						),
					),
				];
			}
			return [
				indent(
					block(
						nestingSelector(child.selector, child.direct),
						joinCss(style.base),
					),
				),
			];
		}),

		// dimension variants → .className blocks
		...Object.values(dimensions).flatMap((dim) =>
			Object.entries(dim.options)
				.filter(([name]) => name !== "default")
				.flatMap(([name, optionStyles]) => {
					const rendered = renderDimensionOption(
						name,
						optionStyles as Record<string, Partial<TStyleBlock>>,
						anatomy,
						states,
					);
					return rendered ? [rendered] : [];
				}),
		),

		// root states
		...Object.entries(styles.root?.states ?? {}).flatMap(([state, css]) => {
			if (!css?.length) return [];
			const sel = resolveStateSelector(states, state);
			return sel ? [indent(block(sel, joinCss(css)))] : [];
		}),

		// child element states (visibleWhen children already handled above)
		...childParts.flatMap(([part, style]) => {
			const child = resolveAnatomyChild(anatomy, part);
			if (
				!child ||
				child.selector === "&" ||
				child.visibleWhen ||
				!style.states
			)
				return [];
			return Object.entries(style.states).flatMap(([state, css]) => {
				if (!css?.length) return [];
				const sel = resolveStateSelector(states, state);
				if (!sel) return [];
				return [
					indent(
						block(
							statePrefixedSelector(sel, child.selector, child.direct),
							joinCss(css),
						),
					),
				];
			});
		}),
	].join("\n");

	return `${selectorStr} {\n${body}\n}`;
}

const UI_DIR = path.resolve(import.meta.dirname, "ui");
const SHARED_DIR = path.resolve(import.meta.dirname, "shared");
const WATCH_MODE = process.argv.includes("--watch");
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
