import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";

const meta = defineMeta({
	title: "Card",
	subtitle:
		"Displays a card, separating a piece of content into distinct sections.",
	tags: [
		{
			title: "MDN: <article>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: "article" as const,
		description: [
			"The card is made out of semantic HTML, using the <code>&lt;article&gt;</code> element to represent a self-contained piece of content that can be distributed and reused independently. While not required, it also uses the <code>&lt;header&gt;</code> and <code>&lt;footer&gt;</code> elements, where now in the <code>&lt;article&gt;</code> they represent the header and footer of the card rather than the page.",
		],
		children: {
			header: {
				selector: "header, hgroup, footer, h1, h2, h3, h4, h5, h6",
				description: ["Header, footer, and heading elements"],
				type: "element",
				optional: true,
			},
		},
		example:
			"<article>\n  <header>\n    <!-- header content -->\n  </header>\n\n  <!-- body content -->\n\n  <footer>\n    <!-- footer content -->\n  </footer>\n</article>",
	},
});

const states = defineStates({
	options: {},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [
			"padding: calc(var(--spacing) * 5) calc(var(--spacing) * 6);",
			"display: flex;",
			"flex-direction: column;",
			"gap: calc(var(--spacing) * 6);",
			"border: solid 1px var(--border);",
			"box-sizing: border-box;",
			"border-radius: var(--radius-xl);",
			"box-shadow: var(--shadow-sm);",
			"background-color: var(--card);",
			"color: var(--card-foreground);",
		],
		states: {},
	},
	header: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"position: static;",
		],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {});

const examples = defineExamples(dimensions, states, () => [
	[
		`<article style="max-width: 400px;"><hgroup><h3>Card Title</h3><p>Card description text goes here.</p></hgroup><p>Card body content.</p><footer style="display: flex; justify-content: flex-end;"><button type="button">Action</button></footer></article>`,
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
