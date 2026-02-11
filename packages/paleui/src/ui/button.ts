import { icons } from "../shared/icons";
import {
	disable,
	transitionOutlineVisible,
	transitionOutlineWith,
} from "../shared/mixins";
import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
	stateAttrsToString,
} from "../shared/types";
import { capitalize } from "../shared/utils";

const meta = defineMeta({
	title: "Button",
	subtitle: "Semantic HTML button element.",
	description: [
		'Use the link variant only for <code>&lt;a&gt;</code> elements with <code>role="button"</code>.',
	],
	tags: [
		{
			title: "MDN: <button>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: ["button", '[role="button"]'] as const,
		description: ["The button element itself"],
		children: {
			spinner: {
				selector: "::before",
				description: ["Loading indicator, visible when aria-busy is true"],
				type: "pseudo",
				direct: true,
				optional: false,
				visibleWhen: "busy",
			},
			icon: {
				selector: "svg",
				description: ["Optional icon element"],
				type: "element",
				direct: true,
				optional: true,
			},
			text: {
				description: ["Button label text"],
				type: "text",
				direct: true,
				optional: true,
			},
		},
		childrenCombinations: [["icon", "text"], ["text"], ["icon"]],
	},
});

const states = defineStates({
	meta: {
		title: "States",
		description: ["The button can be in various states"],
	},
	options: {
		hover: { selector: ":hover" },
		focus: { selector: ":focus-visible" },
		active: { selector: ":active" },

		disabled: {
			selector: ':disabled, [aria-disabled="true"]',
			htmlAttrs: { disabled: true },
		},
		busy: {
			selector: '[aria-busy="true"]',
			htmlAttrs: { "aria-busy": "true" },
		},
	},
	optionsCombinations: [
		["active", "focus"],
		["hover", "focus"],
		["busy"],
		["disabled"],
	],
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [
			"margin: 0;",
			"padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			...transitionOutlineWith("opacity var(--transition-speed) ease-in-out"),
			"display: inline-flex;",
			"align-items: center;",
			"gap: calc(var(--spacing) * 2);",
			"justify-content: center;",
			"white-space: nowrap;",
			"min-width: 0;",
			"height: calc(var(--spacing) * 9);",
			"border-radius: var(--radius-md);",
			"cursor: var(--cursor-interactive);",
			"font-weight: 500;",
			"font-size: 0.875rem;",
			"line-height: 1;",
			"flex-shrink: 0;",
			"text-decoration: none;",
			"box-shadow: var(--shadow-xs);",
			"background-color: var(--primary);",
			"color: var(--primary-foreground);",
			"border: 0;",
		],
		states: {
			hover: ["opacity: 80%;"],
			focus: transitionOutlineVisible(),
			active: ["transform: scale(0.98);"],
			disabled: [...disable(), "cursor: not-allowed;"],
			busy: [...disable(), "cursor: wait;"],
		},
	},
	spinner: {
		base: [
			'content: "";',
			"width: 1rem;",
			"height: 1rem;",
			"border: 2px solid currentColor;",
			"border-bottom-color: transparent;",
			"border-radius: 50%;",
			"animation: spin 1s linear infinite;",
		],
		states: {},
	},
	icon: {
		base: ["width: 1rem;", "height: 1rem;", "flex-shrink: 0;"],
		states: {
			busy: ["display: none;"],
		},
	},
	text: {
		base: [],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {
	variant: {
		meta: {
			title: "Variants",
			description: [
				"Button styles that change colors, background, and border.",
				'Use the <code>link</code> variant only for <code>&lt;a&gt;</code> elements with <code>role="button"</code>.',
			],
		},
		options: {
			default: {},
			outline: {
				root: {
					base: [
						"border: solid 1px var(--border);",
						"color: var(--foreground);",
						"background-color: var(--background);",
						"transition: outline-width calc(var(--transition-speed) * 0.5) ease-in-out, background-color var(--transition-speed) ease-in-out;",
					],
					states: {
						hover: [
							"opacity: 100%;",
							"background-color: var(--accent);",
							"color: var(--accent-foreground);",
						],
					},
				},
			},
			ghost: {
				root: {
					base: [
						"border: 0;",
						"color: var(--foreground);",
						"background-color: transparent;",
						"box-shadow: none;",
						"transition: outline-width calc(var(--transition-speed) * 0.5) ease-in-out, background-color var(--transition-speed) ease-in-out;",
					],
					states: {
						hover: [
							"opacity: 100%;",
							"background-color: var(--accent);",
							"color: var(--accent-foreground);",
						],
					},
				},
			},
			link: {
				root: {
					base: [
						"border: 0;",
						"color: var(--foreground);",
						"background-color: transparent;",
						"box-shadow: none;",
					],
					states: {
						hover: [
							"opacity: 100%;",
							"text-decoration: underline;",
							"text-underline-offset: 2px;",
						],
						focus: [
							"outline-width: 3px;",
							"text-decoration: underline;",
							"text-underline-offset: 2px;",
						],
					},
				},
			},
			destructive: {
				root: {
					base: [
						"background-color: var(--destructive);",
						"color: var(--destructive-foreground);",
					],
				},
			},
			secondary: {
				root: {
					base: [
						"background-color: var(--secondary);",
						"color: var(--secondary-foreground);",
					],
				},
			},
		},
	},
	size: {
		meta: {
			title: "Sizes",
			description: [
				"Size variants including an icon-only option.",
				"Add <code>&lt;svg&gt;</code> elements inside buttons for icons.",
			],
		},
		options: {
			default: {},
			sm: {
				root: {
					base: [
						"height: calc(var(--spacing) * 7);",
						"padding: calc(var(--spacing) * 1) calc(var(--spacing) * 3);",
						"font-size: 0.75rem;",
					],
				},
			},
			lg: {
				root: {
					base: [
						"height: calc(var(--spacing) * 11);",
						"padding: calc(var(--spacing) * 3) calc(var(--spacing) * 6);",
						"font-size: 1rem;",
					],
				},
			},
			icon: {
				root: {
					base: ["aspect-ratio: 1;", "padding: calc(var(--spacing) * 2);"],
				},
			},
		},
	},
});

const examples = defineExamples(
	dimensions,
	states,
	({ variant, size, activatableStates }, st) => [
		variant.map((v) => {
			const cls = v === "default" ? "" : ` class="${v}"`;
			const el = v === "link" ? "a" : "button";
			const href = v === "link" ? ' href="#" role="button"' : "";
			const type = el === "button" ? ' type="button"' : "";
			return `<${el}${type}${href}${cls}>${capitalize(v)}</${el}>`;
		}),

		size
			.filter((s) => s !== "default")
			.map((s) => {
				const content = s === "icon" ? icons.mark : capitalize(s);
				return `<button type="button" class="${s}">${content}</button>`;
			}),

		activatableStates.map((state) => {
			const attrStr = stateAttrsToString(st.options[state]);
			return `<button type="button" ${attrStr}>${capitalize(state)}</button>`;
		}),
	],
);

export const schema = {
	meta,
	anatomy,
	states,
	styles,
	dimensions,
	examples,
} as const;
