import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";

const meta = defineMeta({
	title: "Typography",
	subtitle: "Text styling and formatting elements.",
	tags: [
		{
			title: "MDN: HTML Text fundamentals",
			url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/HTML_text_fundamentals",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: ["p", "small", "hgroup", "code", "pre"] as const,
		description: [
			"Typography elements include paragraphs, small text, heading groups, code blocks, and preformatted text.",
		],
	},
});

const states = defineStates({
	meta: {
		title: "Elements",
		description: ["Various text elements available for formatting content."],
	},
	options: {},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {});

const examples = defineExamples(dimensions, states, () => [
	[
		`<p>A paragraph of text.</p>`,
		`<small>Small helper text.</small>`,
		`<hgroup><h3>Heading</h3><p>With a description below it.</p></hgroup>`,
		`<code>inline code</code>`,
		`<pre><code>preformatted code block</code></pre>`,
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
