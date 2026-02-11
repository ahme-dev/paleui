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
} from "../shared/types";

const meta = defineMeta({
	title: "Select",
	subtitle: "Semantic HTML select element.",
	tags: [
		{
			title: "MDN: <select>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select",
		},
		{
			title: "MDN: <option>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option",
		},
		{
			title: "MDN: <optgroup>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: "select" as const,
		description: ["Standard HTML select element for dropdown selection."],
	},
});

const states = defineStates({
	meta: {
		title: "Item Grouping",
		description: [
			"Items in the select can be grouped to organize them better.",
			"Use the <code>&lt;optgroup&gt;</code> element to group options together, and the <code>label</code> attribute to provide a label for the group.",
		],
	},
	options: {
		hover: { selector: ":hover" },
		focus: { selector: ":focus-visible" },
		disabled: {
			selector: ":disabled",
			htmlAttrs: { disabled: true },
		},
		busy: {
			selector: '[aria-busy="true"]',
			htmlAttrs: { "aria-busy": "true" },
		},
	},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [
			"display: inline-flex;",
			"align-items: center;",
			"gap: calc(var(--spacing) * 2);",
			"overflow: hidden;",
			"justify-content: center;",
			"padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);",
			"padding-right: calc(var(--spacing) * 12);",
			"height: calc(var(--spacing) * 9);",
			"box-sizing: border-box;",
			"border-radius: var(--radius-md);",
			"background-color: var(--background);",
			"color: var(--foreground);",
			"border: solid 1px var(--border);",
			"line-height: 1;",
			"font-size: 0.875rem;",
			"appearance: none;",
			"box-shadow: var(--shadow-xs);",
			"cursor: var(--cursor-interactive);",
			...transitionOutlineWith(
				"background-color var(--transition-speed) ease-in-out",
			),
		],
		states: {
			focus: transitionOutlineVisible(),
			disabled: disable(),
			busy: disable(),
		},
	},
});

const dimensions = defineDimensions(anatomy, states, {
	variant: {
		meta: {
			title: "States",
			description: [
				"Select elements can be put in different states, such as disabled or loading, to indicate their current status.",
				"The <code>disabled</code> and <code>aria-busy</code> attributes can be used for this purpose.",
			],
		},
		options: {
			default: {},
		},
	},
});

const examples = defineExamples(dimensions, states, () => [
	[
		`<select disabled><option disabled selected>Disabled Select</option><option>Option 1</option><option>Option 2</option></select>`,
		`<select aria-busy="true"><option disabled selected>Loading Select</option><option>Option 1</option><option>Option 2</option></select>`,
	],
	[
		`<select><option disabled selected value="">Grouped select</option><hr /><optgroup label="Group1"><option value="item1">Item 1</option><option value="item2">Item 2</option></optgroup><hr /><optgroup label="Group2"><option value="item3">Item 3</option><option value="item4">Item 4</option></optgroup></select>`,
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
