import { icons } from "../shared/icons";
import {
	reset,
	transitionOutlineVisible,
	transitionOutlineWith,
} from "../shared/mixins";
import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStyles,
} from "../shared/types";
import { dedent } from "../shared/utils";

const meta = defineMeta({
	title: "Button",
	subtitle: "Clickable element for triggering actions.",
	description: [
		'Use the link variant only for <code>&lt;a&gt;</code> elements with <code>role="button"</code>.',
	],
	tags: [
		{
			title: "MDN: <button>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: ["button", '[role="button"]'] as const,
		name: "Button",
		description: [
			'A <code>&lt;button&gt;</code> element. For link-styled actions use <code>&lt;a role="button"&gt;</code>.',
		],
		states: {
			hover: {
				name: "Hover",
				selector: ":hover",
			},
			focus: {
				name: "Focus",
				selector: ":focus-visible",
			},
			disabled: {
				name: "Disabled",
				selector: ":disabled, [aria-disabled='true']",
				htmlAttrs: { disabled: true },
			},
			busy: {
				name: "Loading",
				selector: '[aria-busy="true"]',
				htmlAttrs: { "aria-busy": "true" },
			},
		},
		optionsCombinations: [["hover"], ["focus"], ["disabled"], ["busy"]],
		childrenCombinations: [["svg", "text"], ["text"], ["svg"]] as const,
		children: {
			svg: {
				selector: "svg",
				name: "Icon",
				description: ["Optional SVG icon element"],
				type: "element",
				direct: false,
				optional: true,
			},
			spinner: {
				selector: "::before",
				name: "Spinner",
				description: ["Loading spinner shown during busy state"],
				type: "pseudo",
				optional: true,
			},
			text: {
				name: "Label",
				description: ["Button label text"],
				type: "text",
				optional: true,
			},
		},
		example: dedent(`
			<button>
				Button
			</button>
		`),
	},
});

const styles = defineStyles(anatomy, {
	root: {
		base: [
			...reset(),
			"display: inline-flex",
			"align-items: center",
			"justify-content: center",
			"white-space: nowrap",
			"min-width: 0",
			"border-radius: var(--radius-md)",
			"border: 1px solid transparent",
			"font-size: 0.875rem",
			"font-weight: 500",
			"line-height: 1",
			"cursor: var(--cursor-interactive)",
			"text-decoration: none",
			...transitionOutlineWith(
				"background-color var(--transition-speed) ease, box-shadow var(--transition-speed) ease",
			),
			// default size
			"height: calc(var(--spacing) * 9)",
			"padding: 0 calc(var(--spacing) * 2.5)",
			"gap: calc(var(--spacing) * 1.5)",
			// default variant
			"background-color: var(--primary)",
			"color: var(--primary-foreground)",
		],
		states: {
			hover: ["box-shadow: inset 0 0 0 9999px rgba(0, 0, 0, 0.03)"],
			focus: [...transitionOutlineVisible()],
			disabled: ["opacity: 0.5", "pointer-events: none"],
			busy: ["opacity: 0.5", "pointer-events: none", "cursor: wait"],
		},
	},
	svg: {
		base: [
			"width: 1rem",
			"height: 1rem",
			"flex-shrink: 0",
			"pointer-events: none",
		],
		states: {
			busy: ["display: none"],
		},
	},
	text: {},
	spinner: {
		states: {
			busy: [
				'content: ""',
				"display: inline-block",
				"width: 1rem",
				"height: 1rem",
				"border: 2px solid currentColor",
				"border-top-color: transparent",
				"border-radius: var(--radius-full)",
				"animation: spin 0.7s linear infinite",
				"flex-shrink: 0",
			],
		},
	},
});

const dimensions = defineDimensions(anatomy, {
	variant: {
		meta: {
			title: "Variant",
			description: [
				"Controls the visual style of the button. The default variant uses the primary color.",
			],
		},
		options: {
			default: { name: "Default" },
			outline: {
				name: "Outline",
				root: {
					base: [
						"background-color: var(--background)",
						"color: var(--foreground)",
						"border-color: var(--border)",
					],
					states: {
						hover: [
							"background-color: var(--muted)",
							"color: var(--foreground)",
						],
					},
				},
			},
			secondary: {
				name: "Secondary",
				root: {
					base: [
						"background-color: var(--secondary)",
						"color: var(--secondary-foreground)",
					],
					states: {
						hover: ["box-shadow: inset 0 0 0 9999px rgba(0, 0, 0, 0.05)"],
					},
				},
			},
			ghost: {
				name: "Ghost",
				root: {
					base: ["background-color: transparent", "color: var(--foreground)"],
					states: {
						hover: [
							"background-color: var(--muted)",
							"color: var(--foreground)",
						],
					},
				},
			},
			destructive: {
				name: "Destructive",
				root: {
					base: [
						"background-color: oklch(from var(--destructive) l c h / 10%)",
						"color: var(--destructive)",
						"outline-color: var(--destructive)",
					],
					states: {
						hover: [
							"background-color: oklch(from var(--destructive) l c h / 10%)",
						],
					},
				},
			},
			link: {
				name: "Link",
				root: {
					base: [
						"background-color: transparent",
						"color: var(--primary)",
						"text-underline-offset: 4px",
					],
					states: {
						hover: ["text-decoration: underline", "box-shadow: none"],
						focus: [
							...transitionOutlineVisible(),
							"text-decoration: underline",
						],
					},
				},
			},
		},
	},
	size: {
		meta: {
			title: "Size",
			description: [
				"Controls the height, padding, and font size of the button.",
			],
		},
		options: {
			default: { name: "Default" },
			xs: {
				name: "XS",
				root: {
					base: [
						"height: calc(var(--spacing) * 6)",
						"padding: 0 calc(var(--spacing) * 2)",
						"gap: calc(var(--spacing) * 1)",
						"font-size: 0.75rem",
						"border-radius: min(var(--radius-md), 8px)",
					],
				},
				svg: {
					base: ["width: 0.75rem", "height: 0.75rem"],
				},
			},
			sm: {
				name: "SM",
				root: {
					base: [
						"height: calc(var(--spacing) * 8)",
						"padding: 0 calc(var(--spacing) * 2.5)",
						"gap: calc(var(--spacing) * 1)",
						"border-radius: min(var(--radius-md), 10px)",
					],
				},
			},
			lg: {
				name: "LG",
				root: {
					base: [
						"height: calc(var(--spacing) * 10)",
						"padding: 0 calc(var(--spacing) * 2.5)",
						"gap: calc(var(--spacing) * 1.5)",
					],
				},
			},
		},
	},
	icon: {
		meta: {
			title: "Icon",
			description: [
				"Removes padding and sets <code>aspect-ratio: 1</code> for a square button. Combine with a size class: <code>xs icon</code>, <code>sm icon</code>, <code>lg icon</code>.",
			],
		},
		options: {
			default: { name: "Default" },
			icon: {
				name: "Icon",
				root: {
					base: ["aspect-ratio: 1", "padding: 0"],
				},
			},
		},
	},
	round: {
		meta: {
			title: "Round",
			description: [
				"Applies fully rounded corners. Use with icon buttons for a circle.",
			],
		},
		options: {
			default: { name: "Default" },
			round: {
				name: "Round",
				root: {
					base: ["border-radius: var(--radius-full)"],
				},
			},
		},
	},
});

const examples = defineExamples(dimensions, anatomy, (_keys) => {
	const variant: Record<(typeof _keys.variant)[number], string> = {
		default: dedent(`
			<button>
				${icons.star}
				Button
			</button>
		`),
		outline: dedent(`
			<button class="outline">Outline</button>
		`),
		secondary: dedent(`
			<button class="secondary">
				${icons.star}
				Secondary
			</button>
		`),
		ghost: dedent(`
			<button class="ghost">Ghost</button>
		`),
		destructive: dedent(`
			<button class="destructive">
				${icons.trash}
				Delete
			</button>
		`),
		link: dedent(`
			<a role="button" href="#" class="link">Link</a>
		`),
	};

	const size: Record<(typeof _keys.size)[number], string> = {
		xs: dedent(`
			<button class="xs">Extra Small</button>
		`),
		sm: dedent(`
			<button class="sm">
				${icons.star}
				Small
			</button>
		`),
		default: dedent(`
			<button>Button</button>
		`),
		lg: dedent(`
			<button class="lg">
				${icons.star}
				Large
			</button>
		`),
	};

	const icon: Record<(typeof _keys.icon)[number], string> = {
		icon: dedent(`
			<button class="outline icon" aria-label="Icon button">${icons.star}</button>
		`),
	};

	const round: Record<(typeof _keys.round)[number], string> = {
		round: dedent(`
			<button class="icon round" aria-label="Round icon button">
				${icons.mark}
			</button>
		`),
	};

	return {
		variant,
		size,
		icon,
		round,
		states: {
			disabled: dedent(`
				<button disabled class="outline">Disabled</button>
			`),
			busy: dedent(`
				<button aria-busy="true" class="secondary">Loading</button>
			`),
		},
	};
});

export const schema = {
	meta,
	anatomy,
	styles,
	dimensions,
	examples,
} as const;
