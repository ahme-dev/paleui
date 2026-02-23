import * as fs from "node:fs";
import * as path from "node:path";
import type {
	TAnatomyRoot,
	TCSS,
	TSchema,
	TStates,
	TStyleBlock,
} from "./shared/types";

function indent(str: string, level = 1): string {
	const tabs = "\t".repeat(level);
	return str
		.split("\n")
		.map((line) => (line.trim() ? tabs + line.trim() : line))
		.join("\n");
}

function cssArrayToString(css: TCSS): string {
	return css.join("\n");
}

function renderStateSelector(states: TStates, state: string): string | null {
	const stateOption = states.options[state];
	if (!stateOption?.selector) return null;
	const parts = stateOption.selector.split(",").map((s) => s.trim());
	return parts.map((p) => `&${p}`).join(",\n");
}

function getAnatomyChild(
	anatomy: Record<string, TAnatomyRoot>,
	part: string,
): { selector: string; direct: boolean; visibleWhen: string | null } | null {
	if (part === "root")
		return { selector: "&", direct: false, visibleWhen: null };

	const root = anatomy.root;
	const child = root?.children?.[part];
	if (!child?.selector) return null;

	return {
		selector: child.selector,
		direct: child.direct === true,
		visibleWhen: child.visibleWhen || null,
	};
}

function buildNestingSelector(rawSelector: string, isDirect: boolean): string {
	if (rawSelector.startsWith("::")) {
		return `&${rawSelector}`;
	}
	const prefix = isDirect ? "> " : "";
	return rawSelector
		.split(",")
		.map((s) => `${prefix}${s.trim()}`)
		.join(",\n");
}

function buildStatePrefixedSelector(
	stateSelector: string,
	rawSelector: string,
	isDirect: boolean,
): string {
	const stateParts = stateSelector.split(",").map((s) => s.trim());

	if (rawSelector.startsWith("::")) {
		return stateParts.map((sp) => `${sp}${rawSelector}`).join(",\n");
	}

	const childParts = rawSelector.split(",").map((s) => s.trim());
	const combinator = isDirect ? " > " : " ";

	return stateParts
		.flatMap((sp) => childParts.map((cp) => `${sp}${combinator}${cp}`))
		.join(",\n");
}

function renderComponent(schema: TSchema): string {
	const rootAnatomy = schema.anatomy.root;
	const selectors = Array.isArray(rootAnatomy.selector)
		? [...rootAnatomy.selector]
		: [rootAnatomy.selector];
	const selectorStr = selectors.join(",\n");

	const lines: string[] = [];
	lines.push(`${selectorStr} {`);

	const { anatomy, states, styles, dimensions } = schema;

	// 1. Root base styles
	if (styles.root?.base?.length) {
		lines.push(indent(cssArrayToString(styles.root.base)));
	}

	// 2. Child elements (icon, spinner when not state-dependent)
	for (const [part, style] of Object.entries(styles)) {
		if (part === "root" || part === "text") continue;

		const childInfo = getAnatomyChild(anatomy, part);
		if (!childInfo || childInfo.selector === "&") continue;

		const { selector, direct, visibleWhen } = childInfo;

		// If visibleWhen is set, render under that state's selector
		if (visibleWhen && style.base?.length) {
			const stateSelector = renderStateSelector(states, visibleWhen);
			if (stateSelector) {
				const combinedSelector = buildStatePrefixedSelector(
					stateSelector,
					selector,
					direct,
				);
				lines.push(
					indent(
						`${combinedSelector} {\n${indent(cssArrayToString(style.base))}\n}`,
					),
				);
			}
		} else if (style.base?.length) {
			// Regular child element
			const childSelector = buildNestingSelector(selector, direct);
			lines.push(
				indent(
					`${childSelector} {\n${indent(cssArrayToString(style.base))}\n}`,
				),
			);
		}
	}

	// 3. Dimensions (variants, sizes, etc.) - each dimension's options become classes
	for (const dim of Object.values(dimensions)) {
		for (const [optionName, optionStyles] of Object.entries(dim.options)) {
			if (optionName === "default") continue;

			const content: string[] = [];

			// Process each part's styles for this option
			for (const [part, partStyle] of Object.entries(
				optionStyles as Record<string, Partial<TStyleBlock>>,
			)) {
				const childInfo = getAnatomyChild(anatomy, part);

				if (part === "root" || childInfo?.selector === "&") {
					// Root styles for this variant
					if (partStyle.base?.length) {
						content.push(cssArrayToString(partStyle.base));
					}

					// State overrides for this variant
					if (partStyle.states) {
						for (const [state, stateStyles] of Object.entries(
							partStyle.states,
						)) {
							if (!stateStyles || !stateStyles.length) continue;
							const stateSelector = renderStateSelector(states, state);
							if (stateSelector) {
								content.push(
									`${stateSelector} {\n${indent(cssArrayToString(stateStyles))}\n}`,
								);
							}
						}
					}
				} else if (childInfo) {
					// Child element styles for this variant
					const childSelector = buildNestingSelector(
						childInfo.selector,
						childInfo.direct,
					);
					if (partStyle.base?.length) {
						content.push(
							`${childSelector} {\n${indent(cssArrayToString(partStyle.base))}\n}`,
						);
					}
				}
			}

			if (content.length > 0) {
				lines.push(
					indent(`&.${optionName} {\n${indent(content.join("\n\n"))}\n}`),
				);
			}
		}
	}

	// 4. Root states (hover, focus, disabled, busy, etc.)
	if (styles.root?.states) {
		for (const [state, stateStyles] of Object.entries(styles.root.states)) {
			if (!stateStyles || !stateStyles.length) continue;
			const stateSelector = renderStateSelector(states, state);
			if (stateSelector) {
				lines.push(
					indent(
						`${stateSelector} {\n${indent(cssArrayToString(stateStyles))}\n}`,
					),
				);
			}
		}
	}

	// 5. Child element states (e.g., icon hidden when busy)
	for (const [part, style] of Object.entries(styles)) {
		if (part === "root" || part === "text") continue;
		if (!style.states) continue;

		const childInfo = getAnatomyChild(anatomy, part);
		if (!childInfo || childInfo.selector === "&") continue;
		if (childInfo.visibleWhen) continue; // Already handled above

		for (const [state, stateStyles] of Object.entries(style.states)) {
			if (!stateStyles || !stateStyles.length) continue;
			const stateSelector = renderStateSelector(states, state);
			if (stateSelector) {
				const combinedSelector = buildStatePrefixedSelector(
					stateSelector,
					childInfo.selector,
					childInfo.direct,
				);
				lines.push(
					indent(
						`${combinedSelector} {\n${indent(cssArrayToString(stateStyles))}\n}`,
					),
				);
			}
		}
	}

	lines.push("}");

	return lines.join("\n");
}

const UI_DIR = path.resolve(import.meta.dirname, "ui");
const SHARED_DIR = path.resolve(import.meta.dirname, "shared");
const WATCH_MODE = process.argv.includes("--watch");

function renderSchema(schema: unknown): string | null {
	const s = schema as Record<string, unknown>;
	if (s?.partial === true && typeof s.raw === "string") {
		return s.raw;
	}
	if (s?.anatomy && s?.styles && s?.dimensions) {
		return renderComponent(s as TSchema);
	}
	return null;
}

async function generateCSS() {
	const files = fs.readdirSync(UI_DIR);
	const tsFiles = files.filter(
		(file) => file.endsWith(".ts") && !file.startsWith("_"),
	);

	let generated = 0;

	for (const file of tsFiles) {
		const componentName = path.basename(file, ".ts");
		const cssPath = path.join(UI_DIR, `${componentName}.css`);
		const mod = await import(`./ui/${componentName}.ts?t=${Date.now()}`);

		let css: string | null = null;

		if (Array.isArray(mod.schema)) {
			const parts: string[] = [];
			for (const entry of mod.schema) {
				const rendered = renderSchema(entry);
				if (rendered) parts.push(rendered);
			}
			css = parts.length > 0 ? parts.join("\n\n") : null;
		} else {
			css = renderSchema(mod.schema);
		}

		if (!css) continue;

		fs.writeFileSync(cssPath, css, "utf-8");

		if (!WATCH_MODE) {
			console.log(`✓ Generated: ${componentName}.css`);
		}
		generated++;
	}

	if (WATCH_MODE) {
		console.log(
			`[${new Date().toLocaleTimeString()}] Generated ${generated} CSS file(s)`,
		);
	} else {
		console.log(`\nDone! Generated ${generated} file(s).`);
	}
}

if (WATCH_MODE) {
	console.log("Watching for changes in src/ui/*.ts and src/shared/*.ts...\n");
	generateCSS();

	fs.watch(UI_DIR, { recursive: true }, async (_, filename) => {
		if (filename?.endsWith(".ts") && !filename.startsWith("_")) {
			await generateCSS();
		}
	});

	fs.watch(SHARED_DIR, { recursive: true }, async (_, filename) => {
		if (filename?.endsWith(".ts")) {
			await generateCSS();
		}
	});
} else {
	console.log("Generating CSS from TypeScript files...\n");
	generateCSS();
}
