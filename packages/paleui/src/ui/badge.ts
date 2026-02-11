import { icons } from "../shared/icons";
import { pad, reset } from "../shared/mixins";
import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";
import { capitalize } from "../shared/utils";

const meta = defineMeta({
	title: "Badge",
	subtitle: "Small status indicator.",
	tags: [
		{
			title: 'MDN: role="status"',
			url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: '[role="status"]' as const,
		description: ["Badge container using the ARIA status role."],
		children: {
			svg: {
				selector: "svg",
				description: ["Optional icon element"],
				type: "element",
				optional: true,
			},
			a: {
				selector: "a",
				description: ["Optional link element"],
				type: "element",
				optional: true,
			},
		},
	},
});

const states = defineStates({
	meta: {
		title: "Icons",
		description: [
			"Simply add an <code>&lt;svg&gt;</code> element inside the badge to show an icon.",
		],
	},
	options: {},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [
			"margin: 0;",
			"padding: calc(var(--spacing) * 1) calc(var(--spacing) * 2);",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"display: inline-flex;",
			"gap: calc(var(--spacing) * 1);",
			"align-items: center;",
			"justify-content: center;",
			"white-space: nowrap;",
			"min-width: 0;",
			"border-radius: var(--radius-4xl);",
			"font-size: 0.75rem;",
			"font-weight: 500;",
			"line-height: 1;",
			"background-color: var(--primary);",
			"color: var(--primary-foreground);",
			"border: 0;",
			"transition: opacity var(--transition-speed) ease-in-out;",
		],
		states: {},
	},
	svg: {
		base: [
			"width: calc(var(--spacing) * 3);",
			"height: calc(var(--spacing) * 3);",
		],
		states: {},
	},
	a: {
		base: ["text-decoration: none;", "color: inherit;"],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {
	variant: {
		meta: {
			title: "Styles",
			description: [
				"Several badge styles are available to choose from. These only change the colors, background and border of the badge.",
				"The <code>primary</code>, <code>secondary</code>, <code>destructive</code>, <code>ghost</code>, and <code>outline</code> classes can be used to apply these styles.",
			],
		},
		options: {
			default: {},
			outline: {
				root: {
					base: [
						"border: solid 1px var(--border);",
						"transition: background-color var(--transition-speed) ease-in-out;",
						"color: var(--foreground);",
						"background-color: var(--background);",
					],
				},
			},
			ghost: {
				root: {
					base: [
						"border: 0;",
						"transition: background-color var(--transition-speed) ease-in-out;",
						"color: var(--foreground);",
						"background-color: transparent;",
					],
				},
			},
			destructive: {
				root: {
					base: [
						"border: 0;",
						"background-color: var(--destructive);",
						"color: var(--destructive-foreground);",
					],
				},
			},
			secondary: {
				root: {
					base: [
						"border: 0;",
						"background-color: var(--secondary);",
						"color: var(--secondary-foreground);",
					],
				},
			},
		},
	},
	size: {
		meta: {
			title: "Sizing",
			description: [
				"Badges can be sized to fit the content inside them.",
				"Simply add the <code>fit</code> class to the badge.",
			],
		},
		options: {
			default: {},
			fit: {
				root: {
					base: ["padding: calc(var(--spacing) * 1);"],
				},
			},
		},
	},
});

const examples = defineExamples(dimensions, states, ({ variant, size }) => [
	variant.map((v) => {
		const cls = v === "default" ? "" : ` class="${v}"`;
		return `<div role="status"${cls}>${capitalize(v)}</div>`;
	}),
	size
		.filter((s) => s !== "default")
		.map((s) => {
			return `<div role="status" class="${s} destructive">${icons.trash}</div>`;
		}),
	[
		`<div role="status">${icons.mark} Marked</div>`,
		`<div role="status" class="destructive">${icons.trash} Archived</div>`,
	],
]);

export const schema = {
	meta,
	anatomy,
	states,
	styles,
	dimensions,
	examples,
} as const;
