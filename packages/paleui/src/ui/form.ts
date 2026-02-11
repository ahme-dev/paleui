import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";

const meta = defineMeta({
	title: "Form",
	subtitle: "Form labels and elements.",
	tags: [
		{
			title: "MDN: <label>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: "label" as const,
		description: [
			"Form label element, used to describe and associate with form inputs.",
		],
		children: {
			small: {
				selector: "small",
				description: ["Optional description text"],
				type: "element",
				optional: true,
			},
		},
	},
});

const states = defineStates({
	meta: {
		title: "Usage",
		description: [
			"Use the <code>&lt;label&gt;</code> element with a matching <code>for</code> attribute to associate with form inputs.",
		],
	},
	options: {},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [
			"display: flex;",
			"align-items: center;",
			"font-weight: 500;",
			"font-size: 0.875rem;",
			"cursor: var(--cursor-interactive);",
			"line-height: 1;",
		],
		states: {},
	},
	small: {
		base: [
			"color: var(--muted-foreground);",
			"font-size: 0.875rem;",
			"line-height: 1;",
		],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {});

const examples = defineExamples(dimensions, states, () => [
	[
		`<label for="example">Label text</label>`,
		`<label for="example">Label text <small>Optional description</small></label>`,
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
