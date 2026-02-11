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
	title: "Input",
	subtitle: "Semantic HTML input element for text entry.",
	tags: [
		{
			title: "MDN: <input>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: ["input", "textarea"] as const,
		description: [
			'The input component uses standard <code>&lt;input&gt;</code> and <code>&lt;textarea&gt;</code> elements for text entry. For inputs with prefixes or suffixes, wrap them in a <code>&lt;label role="textbox"&gt;</code> element. The <code>role="textbox"</code> attribute on the label is required for proper styling. The label acts as the visual input container while the inner input remains invisible and fills the available space. Prefix and suffix elements can be any HTML (text, icons, etc.).',
		],
		children: {
			svg: {
				selector: "svg",
				description: ["Optional prefix/suffix icon element"],
				type: "element",
				optional: true,
			},
		},
		example:
			'<!-- basic input -->\n<input type="text" placeholder="placeholder" />\n\n<!-- input with prefix/suffix -->\n<label role="textbox">\n  <!-- prefix (optional) -->\n  <input type="text" placeholder="placeholder" />\n  <!-- suffix (optional) -->\n</label>',
	},
});

const states = defineStates({
	meta: {
		title: "States",
		description: [
			"The <code>disabled</code> and <code>readonly</code> attributes can be used to control input interactivity.",
		],
	},
	options: {
		hover: { selector: ":hover" },
		focus: { selector: ":focus-visible" },
		disabled: {
			selector: ":disabled",
			htmlAttrs: { disabled: true },
		},
	},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [
			...transitionOutlineWith(
				"background-color var(--transition-speed) ease-in-out",
			),
			"display: inline-flex;",
			"padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);",
			"height: calc(var(--spacing) * 9);",
			"box-sizing: border-box;",
			"border-radius: var(--radius-md);",
			"background-color: var(--background);",
			"color: var(--foreground);",
			"border: solid 1px var(--border);",
			"font-size: 0.875rem;",
			"line-height: 1;",
			"box-shadow: var(--shadow);",
		],
		states: {
			focus: transitionOutlineVisible(),
			disabled: disable(),
		},
	},
	svg: {
		base: [
			"flex-shrink: 0;",
			"color: var(--muted-foreground);",
			"width: 1rem;",
			"height: 1rem;",
		],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {
	type: {
		meta: {
			title: "Input Types",
			description: [
				"Use the <code>type</code> attribute to specify the input type. Common types include <code>text</code>, <code>email</code>, <code>password</code>, <code>number</code>, and <code>search</code>.",
			],
		},
		options: {
			default: {},
		},
	},
	prefix: {
		meta: {
			title: "Prefix and Suffix",
			description: [
				'Use a <code>&lt;label role="textbox"&gt;</code> wrapper to add prefix or suffix elements. The label styles itself like an input while the inner input becomes invisible and fills the available space.',
			],
		},
		options: {
			default: {},
		},
	},
	textarea: {
		meta: {
			title: "Textarea",
			description: [
				"The <code>&lt;textarea&gt;</code> element accepts the same styling as regular inputs but allows for multiple lines of text.",
			],
		},
		options: {
			default: {},
		},
	},
});

const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1M12 6.5a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0"></path></svg>`;

const examples = defineExamples(dimensions, states, () => [
	[
		`<input type="text" placeholder="Text" />`,
		`<input type="email" placeholder="Email" />`,
		`<input type="password" placeholder="Password" />`,
		`<input type="number" placeholder="Number" />`,
		`<input type="search" placeholder="Search" />`,
	],
	[
		`<label role="textbox"><span>$</span><input type="number" placeholder="0.00" /></label>`,
		`<label role="textbox"><input type="text" placeholder="Enter amount" /><span>USD</span></label>`,
		`<label role="textbox">${searchIcon}<input type="search" placeholder="Search..." /></label>`,
		`<label role="textbox"><span>https://</span><input type="text" placeholder="example.com" /></label>`,
	],
	[`<textarea placeholder="Enter your message..." rows="4"></textarea>`],
	[
		`<input type="text" placeholder="Normal input" />`,
		`<input type="text" placeholder="Disabled input" disabled />`,
		`<input type="text" value="Read-only input" readonly />`,
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
