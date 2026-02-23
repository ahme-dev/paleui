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
	title: "Alert",
	subtitle: "Box that requires user attention.",
	description: [
		"Per documentation, the <code>alert</code> role should not be displayed on page load, rather it should be used as a way to communicate important information to the user after an action, such as form submission.",
		"This helps assistive technologies understand when to notify users of changes.",
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
		description: [
			"The alert uses most elements (ideally just a <code>div</code>) with an <code>alert</code> role to work as an in-page alert.",
			`Preconfigured and layouted are several elements: <code>&lt;svg&gt;</code> for icons, <code>&lt;p&gt;</code> for the title and <code>&lt;small&gt;</code> for the description. Each can be removed and the layout will adapt to show correctly.`,
		],
		children: {
			svg: {
				selector: "svg",
				description: ["Optional icon element"],
				type: "element",
				optional: true,
			},
			p: {
				selector: "p",
				description: ["Alert title text"],
				type: "element",
				optional: true,
			},
			small: {
				selector: "small",
				description: ["Alert description text"],
				type: "element",
				optional: true,
			},
		},
		example:
			'<div role="alert">\n  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">\n    <!-- svg -->\n  </svg>\n\n  <p>\n    <!-- title -->\n  </p>\n  <small>\n    <!-- description -->\n  </small>\n</div>',
	},
});

const states = defineStates({
	meta: {
		title: "Icons",
		description: [
			"Alerts can have an icon to represent the purpose of the alert more clearly.",
			"Simply add an <code>&lt;svg&gt;</code> element inside the alert to show an icon.",
		],
	},
	options: {},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [
			"margin: 0;",
			"padding: calc(var(--spacing) * 3) calc(var(--spacing) * 4);",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"display: grid;",
			"grid-template-columns: min-content 1fr;",
			"grid-template-rows: auto auto;",
			"border-radius: var(--radius-lg);",
			"height: auto;",
			"width: 100%;",
			"background-color: var(--card);",
			"border: solid 1px var(--border);",
			"color: var(--card-foreground);",
		],
		states: {},
	},
	svg: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"width: calc(var(--spacing) * 4);",
			"height: calc(var(--spacing) * 4);",
			"grid-column: 1;",
			"grid-row: 1 / 3;",
			"flex-shrink: 0;",
			"margin-right: calc(var(--spacing) * 3);",
		],
		states: {},
	},
	p: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"line-height: 1.15;",
			"font-size: 0.875rem;",
			"font-weight: 500;",
			"grid-column: 2;",
			"grid-row: 1;",
			"color: inherit;",
		],
		states: {},
	},
	small: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"line-height: 1;",
			"font-size: 0.875rem;",
			"grid-column: 2;",
			"grid-row: 2;",
			"margin-top: calc(var(--spacing) * 1);",
			"color: inherit;",
		],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {
	variant: {
		meta: {
			title: "Styles",
			description: [
				"Alert can convey a different meaning based on its style. Beside the default style, there's only one other style available.",
				"Use <code>destructive</code> to indicate a negative action.",
			],
		},
		options: {
			default: {},
			destructive: {
				root: {
					base: ["color: var(--destructive);"],
				},
			},
		},
	},
});

const alertIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14s14-6.3 14-14S23.7 2 16 2m-1.1 6h2.2v11h-2.2zM16 25c-.8 0-1.5-.7-1.5-1.5S15.2 22 16 22s1.5.7 1.5 1.5S16.8 25 16 25"></path></svg>`;
const boxIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="m28.504 8.136l-12-7a1 1 0 0 0-1.008 0l-12 7A1 1 0 0 0 3 9v14a1 1 0 0 0 .496.864l12 7a1 1 0 0 0 1.008 0l12-7A1 1 0 0 0 29 23V9a1 1 0 0 0-.496-.864M16 3.158L26.016 9L16 14.842L5.984 9ZM5 10.74l10 5.833V28.26L5 22.426Zm12 17.52V16.574l10-5.833v11.685Z"></path></svg>`;

const examples = defineExamples(dimensions, states, ({ variant }) => [
	variant.map((v) => {
		const cls = v === "default" ? "" : ` class="${v}"`;
		return `<div role="alert"${cls}><p>${capitalize(v)}</p><small>A ${v} alert</small></div>`;
	}),
	[
		`<div role="alert">${boxIcon}<p>An alert with an icon</p></div>`,
		`<div role="alert">${alertIcon}<p>Unable to remove item</p><small>This action cannot be undone</small></div>`,
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
