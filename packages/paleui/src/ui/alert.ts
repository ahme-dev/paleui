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

const infoIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14s14-6.268 14-14S23.732 2 16 2m0 6a2 2 0 1 1 0 4a2 2 0 0 1 0-4m1.5 16h-3v-9h3z"></path></svg>`;
const destructiveIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3L2 27h28Zm1.5 19h-3v-3h3Zm0-5h-3v-6h3Z"></path></svg>`;

const meta = defineMeta({
	title: "Alert",
	subtitle: "In-page message for important status and warnings.",
	description: [
		'Use <code>role="alert"</code> for important messages that should be announced by assistive technology.',
		"Alerts are CSS-only and use semantic HTML for structure.",
	],
	tags: [
		{
			title: 'MDN: role="alert"',
			url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: '[role="alert"]' as const,
		name: "Alert",
		description: ['A container element with <code>role="alert"</code>.'],
		childrenCombinations: [["svg", "p", "small"], ["svg", "p"], ["p"]] as const,
		children: {
			svg: {
				selector: "svg",
				name: "Icon",
				description: ["Optional icon element."],
				type: "element",
				direct: true,
				optional: true,
			},
			p: {
				selector: "p",
				name: "Title",
				description: ["Alert title text."],
				type: "element",
				direct: true,
				optional: true,
			},
			small: {
				selector: "small",
				name: "Description",
				description: ["Alert description text."],
				type: "element",
				direct: true,
				optional: true,
			},
		},
		example: dedent(`
			<div role="alert">
				${infoIcon}
				<p>Heads up</p>
				<small>Your changes were saved successfully.</small>
			</div>
		`),
	},
});

const styles = defineStyles(anatomy, {
	root: {
		base: [
			...reset(),
			...pad(4),
			"display: grid",
			"grid-template-columns: min-content 1fr",
			"column-gap: calc(var(--spacing) * 3)",
			"row-gap: calc(var(--spacing) * 1)",
			"width: 100%",
			"border: 1px solid var(--border)",
			"border-radius: var(--radius-lg)",
			"background-color: var(--card)",
			"color: var(--card-foreground)",
		],
	},
	svg: {
		base: [
			...reset(),
			"width: 1rem",
			"height: 1rem",
			"grid-column: 1",
			"grid-row: 1 / span 2",
			"margin-top: 0.125rem",
			"flex-shrink: 0",
			"color: inherit",
		],
	},
	p: {
		base: [
			...reset(),
			"grid-column: 1 / -1",
			"line-height: 1.35",
			"font-size: 0.875rem",
			"font-weight: 500",
			"color: inherit",
		],
		selectors: {
			notFirstChild: ["grid-column: 2"],
		},
	},
	small: {
		base: [
			...reset(),
			"grid-column: 1 / -1",
			"line-height: 1.45",
			"font-size: 0.875rem",
			"color: var(--muted-foreground)",
		],
		selectors: {
			notFirstChild: ["grid-column: 2"],
		},
	},
});

const dimensions = defineDimensions(anatomy, {
	variant: {
		meta: {
			title: "Variant",
			description: [
				"Use the destructive variant to indicate a negative action or warning.",
			],
		},
		options: {
			default: { name: "Default" },
			destructive: {
				name: "Destructive",
				root: {
					base: [
						"background-color: oklch(from var(--destructive) l c h / 8%)",
						"border-color: oklch(from var(--destructive) l c h / 20%)",
					],
				},
				svg: {
					base: ["color: var(--destructive)"],
				},
				p: {
					base: ["color: var(--destructive)"],
				},
				small: {
					base: ["color: var(--destructive)"],
				},
			},
		},
	},
	content: {
		meta: {
			title: "Content",
			description: ["Icon and description are optional."],
		},
		options: {
			title: { name: "Title" },
			iconTitle: { name: "Icon Title" },
			iconTitleDescription: { name: "Icon Title Description" },
		},
	},
});

const examples = defineExamples(dimensions, anatomy, (_keys) => {
	const variant: Record<(typeof _keys.variant)[number], string> = {
		default: dedent(`
			<div role="alert">
				${infoIcon}
				<p>Heads up</p>
				<small>Your billing address was updated successfully.</small>
			</div>
		`),
		destructive: dedent(`
			<div role="alert" class="destructive">
				${destructiveIcon}
				<p>Unable to delete project</p>
				<small>This action failed because the project still has active deployments.</small>
			</div>
		`),
	};

	const content: Record<(typeof _keys.content)[number], string> = {
		title: dedent(`
			<div role="alert">
				<p>Profile updated</p>
			</div>
		`),
		iconTitle: dedent(`
			<div role="alert">
				${infoIcon}
				<p>New sign-in detected</p>
			</div>
		`),
		iconTitleDescription: dedent(`
			<div role="alert">
				${infoIcon}
				<p>Maintenance scheduled</p>
				<small>Expect a short interruption between 02:00 and 02:15 UTC.</small>
			</div>
		`),
	};

	return {
		variant,
		content,
	};
});

const alert = {
	anatomy,
	styles,
	dimensions,
	examples,
} as const;

export const schema = defineSchema({
	meta,
	components: {
		alert,
	},
});
