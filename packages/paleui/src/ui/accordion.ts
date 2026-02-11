import { reset } from "../shared/mixins";
import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";

const meta = defineMeta({
	title: "Accordion",
	subtitle:
		"Group of collapse elements, with single or multiple expanded at once.",
	description: [
		'Note that support for having one <code>&lt;details&gt;</code> element open at a time (done with the <code>name</code> attribute) is newer than the <code>&lt;details&gt;</code> element itself, and not as <a target="_blank" rel="noopener noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#browser_compatibility">widely supported</a>.',
		'Accordion items use <code>role="region"</code> for proper semantics and to distinguish them from dropdown menus (which also use <code>&lt;details&gt;</code> elements). This ensures accordions take full width while dropdown menus remain compact.',
	],
	tags: [
		{
			title: "MDN: <details>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details",
		},
		{
			title: "MDN: <summary>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: 'details[role="region"]' as const,
		description: [
			`The accordion is made of multiple <code>&lt;details role="region"&gt;</code> elements (collapses) with a <code>&lt;summary&gt;</code> element (trigger) inside each, and a <code>&lt;div&gt;</code> element (content) that is displayed when the <code>&lt;details&gt;</code> is open.`,
			`The <code>role="region"</code> attribute is required for proper accordion styling and semantics. A shared <code>name</code> attribute can be added to the <code>&lt;details&gt;</code> elements to make sure that only one of them is open at a time. Wrap multiple accordion items in a container with the <code>data-accordion</code> attribute to group them.`,
		],
		children: {
			summary: {
				selector: "summary",
				description: ["Clickable trigger element"],
				type: "element",
				direct: true,
			},
			div: {
				selector: "div",
				description: ["Collapsible content area"],
				type: "element",
				direct: true,
			},
		},
		example:
			'<div data-accordion>\n  <details role="region" name="group">\n    <summary>\n      <!-- title -->\n    </summary>\n    <div>\n      <!-- content -->\n    </div>\n  </details>\n  <details role="region" name="group">\n    <summary>\n      <!-- title -->\n    </summary>\n    <div>\n      <!-- content -->\n    </div>\n  </details>\n</div>',
	},
});

const states = defineStates({
	meta: {
		title: "Variants",
		description: [
			"By default, all items can be opened at once. To make sure that only one item is open at a time, add a shared <code>name</code> attribute to the <code>&lt;details&gt;</code> elements.",
		],
	},
	options: {
		hover: { selector: ":hover" },
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
			"display: flex;",
			"overflow: hidden;",
			"flex-direction: column;",
			"width: 100%;",
			"border-bottom: 1px solid var(--border);",
		],
		states: {},
	},
	summary: {
		base: [
			"margin: 0;",
			"padding: calc(var(--spacing) * 4) 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"display: flex;",
			"gap: calc(var(--spacing) * 4);",
			"justify-content: space-between;",
			"width: 100%;",
			"flex-grow: 1;",
			"border-radius: var(--radius-sm);",
			"cursor: var(--cursor-interactive);",
			"font-weight: 500;",
			"font-size: 0.875rem;",
			"color: var(--foreground);",
			"line-height: 1;",
		],
		states: {
			hover: ["text-decoration: underline;"],
		},
	},
	div: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"display: flex;",
			"width: 100%;",
			"flex-direction: column;",
			"font-size: 0.875rem;",
			"line-height: 1;",
			"transition: height 0.3s ease-out;",
			"padding-bottom: calc(var(--spacing) * 4);",
		],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {});

const examples = defineExamples(dimensions, states, () => [
	[
		`<div data-accordion><details role="region"><summary>All can be opened</summary><div>Yes, you can.</div></details><details role="region"><summary>All can be opened</summary><div>Yes, you can.</div></details></div>`,
		`<div data-accordion><details role="region" name="only"><summary>A: Only this</summary><div>Only one can be opened at a time.</div></details><details role="region" name="only"><summary>B: Only this</summary><div>Only one can be opened at a time.</div></details></div>`,
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
