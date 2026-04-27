import { icons } from "../shared/icons";
import { pad, reset } from "../shared/mixins";
import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineSchema,
	defineStyles,
} from "../shared/types";
import { dedent } from "../shared/utils";

const meta = defineMeta({
	title: "Badge",
	subtitle: "Compact status label, tag, or metadata chip.",
	description: [
		'Use <code>role="status"</code> for passive status text.',
		"Badges can contain plain text, an icon, or a link.",
	],
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
		name: "Badge",
		description: ['A compact container using <code>role="status"</code>.'],
		childrenCombinations: [["svg", "text"], ["text"], ["a"], ["svg"]] as const,
		children: {
			svg: {
				selector: "svg",
				name: "Icon",
				description: ["Optional icon element."],
				type: "element",
				direct: true,
				optional: true,
			},
			a: {
				selector: "a",
				name: "Link",
				description: ["Optional link element."],
				type: "element",
				direct: true,
				optional: true,
				children: {
					after: {
						selector: "::after",
						name: "External Mark",
						description: ["External-link mark shown on linked badges."],
						type: "pseudo",
						optional: true,
					},
				},
			},
			text: {
				name: "Label",
				description: ["Badge text."],
				type: "text",
				optional: true,
			},
		},
		example: dedent(`
			<div role="status">
				${icons.mark}
				Verified
			</div>
		`),
	},
});

const styles = defineStyles(anatomy, {
	root: {
		base: [
			...reset(),
			...pad(1, 2),
			"display: inline-flex",
			"align-items: center",
			"justify-content: center",
			"gap: calc(var(--spacing) * 1)",
			"width: fit-content",
			"min-width: 0",
			"white-space: nowrap",
			"border-radius: var(--radius-md)",
			"border: 1px solid transparent",
			"background-color: var(--primary)",
			"color: var(--primary-foreground)",
			"font-size: 0.75rem",
			"font-weight: 500",
			"line-height: 1",
			"text-decoration: none",
			"transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease, border-color var(--transition-speed) ease",
		],
	},
	svg: {
		base: [
			"width: 0.75rem",
			"height: 0.75rem",
			"flex-shrink: 0",
			"pointer-events: none",
		],
	},
	a: {
		base: [
			...reset(),
			"display: inline-flex",
			"align-items: center",
			"gap: calc(var(--spacing) * 0.5)",
			"color: inherit",
			"text-decoration: none",
		],
	},
	after: {
		base: ['content: "↗"', "font-size: 0.75rem", "line-height: 1"],
	},
	text: {},
});

const dimensions = defineDimensions(anatomy, {
	variant: {
		meta: {
			title: "Variant",
			description: [
				"Use secondary for softer tags, destructive for negative state, outline for neutral chips, and ghost for minimal labels.",
			],
		},
		options: {
			default: { name: "Default" },
			secondary: {
				name: "Secondary",
				root: {
					base: [
						"background-color: var(--secondary)",
						"color: var(--secondary-foreground)",
					],
				},
			},
			destructive: {
				name: "Destructive",
				root: {
					base: [
						"background-color: var(--destructive)",
						"color: var(--destructive-foreground)",
					],
				},
			},
			outline: {
				name: "Outline",
				root: {
					base: [
						"background-color: transparent",
						"border-color: var(--border)",
						"color: var(--foreground)",
					],
				},
			},
			ghost: {
				name: "Ghost",
				root: {
					base: ["background-color: transparent", "color: var(--foreground)"],
				},
			},
		},
	},
	content: {
		meta: {
			title: "Content",
			description: ["Badges can show text, an icon, or a link."],
		},
		options: {
			text: { name: "Text" },
			iconText: { name: "Icon Text" },
			link: { name: "Link" },
		},
	},
	fit: {
		meta: {
			title: "Fit",
			description: [
				"Use the fit variant for compact counters and tight badges.",
			],
		},
		options: {
			fit: {
				name: "Fit",
				root: {
					base: [pad(1)[0]],
				},
			},
		},
	},
});

const examples = defineExamples(dimensions, anatomy, (_keys) => {
	const variant: Record<(typeof _keys.variant)[number], string> = {
		default: dedent(`
			<div role="status">Default</div>
		`),
		secondary: dedent(`
			<div role="status" class="secondary">Secondary</div>
		`),
		destructive: dedent(`
			<div role="status" class="destructive">Destructive</div>
		`),
		outline: dedent(`
			<div role="status" class="outline">Outline</div>
		`),
		ghost: dedent(`
			<div role="status" class="ghost">Ghost</div>
		`),
	};

	const content: Record<(typeof _keys.content)[number], string> = {
		text: dedent(`
			<div role="status">Stable</div>
		`),
		iconText: dedent(`
			<div role="status">
				${icons.mark}
				Marked
			</div>
		`),
		link: dedent(`
			<div role="status" class="secondary">
				<a target="_blank" rel="noopener noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role">
					MDN: role="status"
				</a>
			</div>
		`),
	};

	const fit: Record<(typeof _keys.fit)[number], string> = {
		fit: dedent(`
			<div role="status" class="fit outline">99+</div>
		`),
	};

	return {
		variant,
		content,
		fit,
	};
});

const badge = {
	anatomy,
	styles,
	dimensions,
	examples,
} as const;

export const schema = defineSchema({
	meta,
	components: {
		badge,
	},
});
