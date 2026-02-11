import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";

const meta = defineMeta({
	title: "Separator",
	subtitle: "Line separating content.",
	description: [
		"The current implementation of vertical separators requires the containing element to have <code>display: flex</code> to display correctly.",
	],
	tags: [
		{
			title: 'MDN: role="separator"',
			url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/separator_role",
		},
		{
			title: "MDN: <hr>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: ['[role="separator"]', "hr"] as const,
		description: [
			'The separator is implemented using two approaches, each for one axis. It uses a styled <code>&lt;hr&gt;</code> for horizontal separators, per semantic HTML. For vertical separators, it uses elements with <code>role="separator"</code>.',
		],
		example:
			'<div>\n  <!-- element 1 -->\n  <hr />\n  <!-- element 2 -->\n</div>\n\n<div style="display: flex; flex-direction: row;">\n  <!-- element 1 -->\n  <span role="separator"></span>\n  <!-- element 2 -->\n</div>',
	},
});

const states = defineStates({
	meta: {
		title: "Usage",
		description: [
			'Use <code>&lt;hr&gt;</code> for horizontal dividers and any element with <code>role="separator"</code> for vertical dividers.',
		],
	},
	options: {},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: ["border: none;", "background-color: var(--border);"],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {});

const examples = defineExamples(dimensions, states, () => [
	[
		`<hr />`,
		`<div style="display: flex; align-items: stretch; gap: 1rem; height: 40px;"><span>Left</span><span role="separator"></span><span>Right</span></div>`,
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
