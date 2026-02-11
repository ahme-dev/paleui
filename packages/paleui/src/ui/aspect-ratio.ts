import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";

const meta = defineMeta({
	title: "Aspect Ratio",
	subtitle: "Defines a ratio between the width and height of an element.",
	tags: [
		{
			title: "MDN: aspect-ratio",
			url: "https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: ".aspect" as const,
		description: [
			"As it is not possible to set a dynamic value with wide browser support, the aspect ratio is set with a custom CSS property (<code>--ratio</code>), working on components with the <code>aspect</code> class. Note that the aspect ratio property is not as well supported in older browsers.",
		],
		example:
			'<div class="aspect" style="--ratio: 3/1;">\n  <!-- content -->\n</div>',
	},
});

const states = defineStates({
	meta: {
		title: "Sizing",
		description: [
			"The value can be assigned to the <code>--ratio</code> custom property.",
		],
	},
	options: {},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: ["aspect-ratio: var(--ratio, 1);"],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {});

const examples = defineExamples(dimensions, states, () => [
	[
		`<div class="aspect" style="--ratio: 16/9; border-radius: var(--radius); height:80px; align-self:flex-start; background-color: var(--muted); display: inline-flex; align-items: center; justify-content: center;">16:9</div>`,
		`<div class="aspect" style="--ratio: 4/3; border-radius: var(--radius); height:80px; align-self:flex-start; background-color: var(--muted); display: inline-flex; align-items: center; justify-content: center;">4:3</div>`,
		`<div class="aspect" style="--ratio: 1; border-radius: var(--radius); height:80px; align-self:flex-start; background-color: var(--muted); display: inline-flex; align-items: center; justify-content: center;">1:1</div>`,
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
