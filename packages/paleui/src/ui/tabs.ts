import { transitionOutlineWith } from "../shared/mixins";
import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";

const meta = defineMeta({
	title: "Tabs",
	subtitle: "List of sections displayed one at a time using controls.",
	description: [
		"The current approach isn't ideal and too verbose. While some other solutions exist, they either don't provide correct navigation or the styling that is required. In the future, we will explore better solutions.",
	],
	tags: [
		{
			title: "MDN: <tablist>",
			url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tablist_role",
		},
		{
			title: "MDN: <tab>",
			url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tab_role",
		},
		{
			title: "MDN: <tabpanel>",
			url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tabpanel_role",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: ".tabs" as const,
		description: [
			'The tabs are made using a <code>&lt;div&gt;</code> element with the <code>tabs</code> class, containing hidden <code>&lt;input type="radio"&gt;</code> elements to handle state changes and <code>&lt;label role="tab"&gt;</code> elements wrapped with a <code>&lt;span&gt;</code> element that has <code>role="tablist"</code> to represent the tab controls for accessibility. Both the <code>&lt;input&gt;</code> and <code>&lt;label&gt;</code> elements should have the same name attribute, so that they work together. Each tab content is wrapped in a <code>role="tabpanel"</code> element, which is displayed when the corresponding tab is selected.',
		],
		children: {
			input: {
				selector: "input",
				description: ["Hidden radio input for state management"],
				type: "element",
				direct: true,
			},
			tablist: {
				selector: '[role="tablist"]',
				description: ["Tab control container"],
				type: "element",
				direct: true,
			},
			tab: {
				selector: '[role="tab"]',
				description: ["Individual tab control"],
				type: "element",
			},
			tabpanel: {
				selector: '[role="tabpanel"]',
				description: ["Tab content panel"],
				type: "element",
				direct: true,
			},
		},
		example:
			'<div class="tabs">\n  <input type="radio" name="tabs" id="tab1" checked />\n  <input type="radio" name="tabs" id="tab2" />\n\n  <span role="tablist">\n    <label for="tab1" role="tab">Tab 1</label>\n    <label for="tab2" role="tab">Tab 2</label>\n  </span>\n\n  <div role="tabpanel"><!-- content 1 --></div>\n  <div role="tabpanel"><!-- content 2 --></div>\n</div>',
	},
});

const states = defineStates({
	meta: {
		title: "Usage",
		description: [
			'Both the <code>&lt;input&gt;</code> and <code>&lt;label&gt;</code> elements should have matching <code>name</code>/<code>for</code> attributes. Each tab content is wrapped in a <code>role="tabpanel"</code> element.',
		],
	},
	options: {
		hover: { selector: ":hover" },
		focus: { selector: ":focus-visible" },
	},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"position: relative;",
		],
		states: {},
	},
	input: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"opacity: 0;",
			"position: absolute;",
			"appearance: none;",
		],
		states: {},
	},
	tablist: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"position: relative;",
			"background-color: var(--muted);",
			"width: fit-content;",
			"display: flex;",
			"padding: calc(var(--spacing) * 0.75);",
			"height: calc(var(--spacing) * 9);",
			"border-radius: var(--radius-lg);",
		],
		states: {},
	},
	tab: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			...transitionOutlineWith(),
			"display: inline-flex;",
			"appearance: none;",
			"height: 100%;",
			"flex-wrap: wrap;",
			"align-items: center;",
			"justify-content: center;",
			"text-align: center;",
			"padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2);",
			"background-color: var(--muted);",
			"border: 1px transparent solid;",
			"cursor: var(--cursor-interactive);",
			"font-size: 0.875rem;",
			"font-weight: 500;",
			"line-height: 1;",
			"border-radius: var(--radius-sm);",
		],
		states: {},
	},
	tabpanel: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"position: relative;",
			"overflow: hidden;",
			"display: none;",
			"width: 100%;",
		],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {});

const examples = defineExamples(dimensions, states, () => [
	[
		`<div class="tabs" style="max-width: 50rem;"><input type="radio" name="demo" id="demo-tab1" checked /><input type="radio" name="demo" id="demo-tab2" /><span role="tablist"><label for="demo-tab1" role="tab">Signup</label><label for="demo-tab2" role="tab">Login</label></span><div role="tabpanel" style="margin-top:1rem;"><article><hgroup><h3>Signup</h3><p>Create a new account by providing your email and a password.</p></hgroup></article></div><div role="tabpanel" style="margin-top:1rem;"><article><hgroup><h3>Login</h3><p>Login to your existing account using your credentials.</p></hgroup></article></div></div>`,
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
