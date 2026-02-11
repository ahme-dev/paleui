import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";

const meta = defineMeta({
	title: "Tooltip",
	subtitle: "Display additional information on hover.",
	tags: [
		{
			title: "MDN: data-* attributes",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: "[data-tooltip]" as const,
		description: [
			"Add the <code>data-tooltip</code> attribute to any element to show a tooltip on hover.",
		],
	},
});

const states = defineStates({
	meta: {
		title: "Usage",
		description: [
			"Add the <code>data-tooltip</code> attribute with the tooltip text to any element.",
		],
	},
	options: {
		hover: { selector: ":hover" },
	},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: ["position: relative;"],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {});

const examples = defineExamples(dimensions, states, () => [
	[`<button type="button" data-tooltip="This is a tooltip">Hover me</button>`],
]);

export const schema = {
	meta,
	anatomy,
	states,
	styles,
	dimensions,
	examples,
} as const;
