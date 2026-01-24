import * as fs from "node:fs";
import * as path from "node:path";
import postcss from "postcss";
import * as sass from "sass";

const SRC = path.resolve(import.meta.dirname, "src");

const STATE_SELECTORS: Record<string, string[]> = {
	disabled: [":disabled", "[disabled]", "[aria-disabled"],
	busy: ["[aria-busy"],
	open: ["[open]"],
	checked: [":checked"],
};

const INTERACTION_SELECTORS: Record<string, string[]> = {
	hover: [":hover"],
	"focus-visible": [":focus-visible"],
	"focus-within": [":focus-within"],
	focus: [":focus"],
};

const SCHEMA_FIELDS = new Set([
	"variants",
	"size",
	"state",
	"interactionState",
	"children",
	"custom",
	"peer",
	"suggested",
	"slot",
]);

// Semantic child names that map to multiple selectors
const CHILD_ALIASES: Record<string, string[]> = {
	heading: ["h1", "h2", "h3", "h4", "h5", "h6"],
};

function parseSchema(filePath: string) {
	const content = fs.readFileSync(filePath, "utf-8");

	const components: {
		root: string;
		variants: {
			field: string;
			value: string;
		}[];
		states: string[];
		interactionStates: string[];
		children: string[];
	}[] = [];

	const typeBlocks = content
		.split(/^(?:export\s+)?type\s+\w+\s*=\s*\{/m)
		.slice(1);

	for (const block of typeBlocks) {
		const rootKeys = [
			...block.matchAll(/^\t"?([^":\n\t]+?)"?\s*:\s*\{/gm),
		].filter((m) => !SCHEMA_FIELDS.has(m[1]));

		for (const rootMatch of rootKeys) {
			const root = rootMatch[1];
			const startIdx = (rootMatch.index ?? 0) + rootMatch[0].length;
			const subBlock = extractBlock(block, startIdx);

			const component: (typeof components)[number] = {
				root,
				variants: [],
				states: [],
				interactionStates: [],
				children: [],
			};

			// Parse variants/size (non-"default" values → class selectors)
			const variantPattern = /\b(variants|size)\s*:\s*((?:\|?\s*"[^"]*"\s*)+)/g;
			for (const match of subBlock.matchAll(variantPattern)) {
				const values = [...match[2].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
				for (const value of values) {
					if (value !== "default") {
						component.variants.push({ field: match[1], value });
					}
				}
			}

			// Parse state field
			const stateMatch = subBlock.match(
				/^\t*state\s*:\s*((?:"[^"]*"\s*\|?\s*)+)/m,
			);
			if (stateMatch) {
				const values = [...stateMatch[1].matchAll(/"([^"]+)"/g)].map(
					(m) => m[1],
				);
				for (const value of values) {
					if (value !== "default") {
						component.states.push(value);
					}
				}
			}

			// Parse interactionState field
			const interMatch = subBlock.match(
				/^\t*interactionState\s*:\s*((?:"[^"]*"\s*\|?\s*)+)/m,
			);
			if (interMatch) {
				const values = [...interMatch[1].matchAll(/"([^"]+)"/g)].map(
					(m) => m[1],
				);
				component.interactionStates.push(...values);
			}

			// Parse immediate children keys from the children block
			const childrenMatch = subBlock.match(/^\t*children\s*:\s*\{/m);
			if (childrenMatch) {
				const childStart = (childrenMatch.index ?? 0) + childrenMatch[0].length;
				const childBlock = extractBlock(subBlock, childStart);
				const baseIndent = childBlock.match(/^(\t*)\S/m)?.[1] ?? "\t";
				const childRe = new RegExp(
					`^${baseIndent}"?([^":\\n\\t?]+?)"?\\??\\s*:`,
					"gm",
				);
				const childKeys = [...childBlock.matchAll(childRe)];
				for (const ck of childKeys) {
					const key = ck[1].trim().replace(/\d+$/, "");
					if (SCHEMA_FIELDS.has(key)) continue;
					component.children.push(key);
				}
			}

			components.push(component);
		}
	}

	return components;
}

function extractBlock(str: string, startIdx: number): string {
	let depth = 1;
	let i = startIdx;
	while (i < str.length && depth > 0) {
		if (str[i] === "{") depth++;
		if (str[i] === "}") depth--;
		i++;
	}
	return str.slice(startIdx, i - 1);
}

function extractFromScss(filePath: string) {
	const result = sass.compile(filePath, { loadPaths: [SRC] });
	const root = postcss.parse(result.css);
	const classes = new Set<string>();
	const selectors: string[] = [];

	root.walkRules((rule) => {
		selectors.push(rule.selector);
		const classMatches = rule.selector.matchAll(/\.([a-zA-Z_-][\w-]*)/g);
		for (const m of classMatches) {
			classes.add(m[1]);
		}
	});

	return { classes, selectors };
}

function hasSelector(selectors: string[], patterns: string[]): boolean {
	return patterns.some((pattern) =>
		selectors.some((sel) => sel.includes(pattern)),
	);
}

function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Collect all .ts schema files that have a matching .scss file
const tsFiles = fs
	.readdirSync(SRC)
	.filter((f) => f.endsWith(".ts"))
	.filter((f) => fs.existsSync(path.join(SRC, f.replace(".ts", ".scss"))));

const results: { name: string; errors: string[] }[] = [];

for (const tsFile of tsFiles) {
	const name = tsFile.replace(".ts", "");
	const tsPath = path.join(SRC, tsFile);
	const scssPath = path.join(SRC, `${name}.scss`);

	const components = parseSchema(tsPath);
	if (components.length === 0) continue;

	let scss: ReturnType<typeof extractFromScss>;
	try {
		scss = extractFromScss(scssPath);
	} catch (err) {
		results.push({
			name,
			errors: [`SCSS compile error: ${(err as Error).message}`],
		});
		continue;
	}

	const errors: string[] = [];

	const allKnownClasses = new Set<string>();

	for (const comp of components) {
		// root selector exists
		const rootNormalized = comp.root.replace(/"/g, "");
		const rootInCss = scss.selectors.some((sel) => {
			if (rootNormalized.startsWith(".")) {
				return sel.includes(rootNormalized);
			}
			if (rootNormalized.startsWith("[")) {
				return sel.includes(rootNormalized.replace(/"/g, ""));
			}
			const pattern = new RegExp(
				`(^|[\\s,>+~])${escapeRegex(rootNormalized)}([\\s,.>+~:[{]|$)`,
			);
			return pattern.test(sel);
		});
		if (!rootInCss) {
			errors.push(`  scss ✗ | ts ✓  root selector: ${rootNormalized}`);
		}

		// If root is a class, add it to known classes
		if (rootNormalized.startsWith(".")) {
			allKnownClasses.add(rootNormalized.slice(1));
		}

		// variants/size classes
		for (const v of comp.variants) {
			allKnownClasses.add(v.value);
			if (!scss.classes.has(v.value)) {
				errors.push(`  scss ✗ | ts ✓  .${v.value} (from ${v.field})`);
			}
		}

		// states
		for (const state of comp.states) {
			const patterns = STATE_SELECTORS[state];
			if (patterns && !hasSelector(scss.selectors, patterns)) {
				errors.push(
					`  scss ✗ | ts ✓  state: ${state} (expected ${patterns.join(" or ")})`,
				);
			}
		}

		// interaction states
		for (const inter of comp.interactionStates) {
			const patterns = INTERACTION_SELECTORS[inter];
			if (patterns && !hasSelector(scss.selectors, patterns)) {
				errors.push(
					`  scss ✗ | ts ✓  interaction: ${inter} (expected ${patterns.join(" or ")})`,
				);
			}
		}

		// children selectors
		for (const child of comp.children) {
			const childNormalized = child.replace(/"/g, "");
			allKnownClasses.add(childNormalized);

			const candidates = CHILD_ALIASES[childNormalized] ?? [childNormalized];

			const childInCss = candidates.some((candidate) => {
				if (scss.classes.has(candidate)) return true;
				return scss.selectors.some((sel) => {
					if (candidate.startsWith("[")) {
						return sel.includes(candidate);
					}
					const pattern = new RegExp(
						`(^|[\\s,>+~])${escapeRegex(candidate)}([\\s,.>+~:[{]|$)`,
					);
					return pattern.test(sel);
				});
			});
			if (!childInCss) {
				errors.push(`  scss ✗ | ts ✓  child: ${childNormalized}`);
			}
		}
	}

	// SCSS classes not declared in TS schema
	for (const cls of scss.classes) {
		if (!allKnownClasses.has(cls)) {
			errors.push(`  scss ✓ | ts ✗  .${cls}`);
		}
	}

	results.push({ name, errors });
}

const passed = results.filter((r) => r.errors.length === 0);
const failed = results.filter((r) => r.errors.length > 0);

for (const r of passed) {
	console.log(`\x1b[32m✓ ${r.name}\x1b[0m`);
}
for (const r of failed) {
	console.log(`\x1b[31m✗ ${r.name}\x1b[0m`);
	for (const e of r.errors) console.log(e);
}
