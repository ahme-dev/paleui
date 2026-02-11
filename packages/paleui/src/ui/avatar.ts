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
	title: "Avatar",
	subtitle: "Image with a fallback, representing a user or entity.",
	description: [
		"Unfortunately without Javascript, it isn't possible to remove the broken image icon on Chromium, and on Firefox an <code>alt</code> value is required to remove it. To get rid of default borders, again an <code>alt</code> value is required, on both browsers. This shouldn't be a problem, as the <code>alt</code> value should always be set for images.",
	],
	tags: [],
});

const anatomy = defineAnatomy({
	root: {
		selector: "picture" as const,
		description: [
			"The avatar is made of a <code>&lt;picture&gt;</code>, <i>directly</i> containing an <code>&lt;img&gt;</code> and a <code>&lt;small&gt;</code> element for the name or initials of the user, which is used as a fallback when the image is not available.",
		],
		children: {
			img: {
				selector: "img",
				description: ["Avatar image"],
				type: "element",
				direct: true,
				optional: true,
			},
			small: {
				selector: "small",
				description: ["Fallback text (initials)"],
				type: "element",
				direct: true,
				optional: true,
			},
		},
		example:
			'<picture>\n  <img src="/images/logo-bg.png" alt="PaleUI Logo" />\n  <small>\n    <!-- fallback text -->\n  </small>\n</picture>',
	},
});

const states = defineStates({
	meta: {
		title: "Grouping",
		description: [
			'Grouping can be done by wrapping multiple <code>&lt;picture&gt;</code> elements in any element with <code>role="group"</code> on it. But note that due to the implementation limitation, only up to 10 avatars can be grouped together.',
		],
	},
	options: {},
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
			"overflow: hidden;",
			"display: flex;",
			"align-items: center;",
			"justify-content: center;",
			"background-color: var(--muted);",
			"height: calc(var(--spacing) * 8);",
			"width: calc(var(--spacing) * 8);",
			"border-radius: 100%;",
			"flex-shrink: 0;",
		],
		states: {},
	},
	img: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"position: relative;",
			"object-fit: cover;",
			"border: 0;",
			"z-index: 2;",
			"font-size: 0;",
			"color: transparent;",
			"overflow: hidden;",
			"line-height: 0;",
			"border-radius: inherit;",
			"width: 100%;",
			"height: 100%;",
		],
		states: {},
	},
	small: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"position: absolute;",
			"border-radius: inherit;",
			"z-index: 1;",
		],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {
	variant: {
		meta: {
			title: "Sizing",
			description: [
				"The avatar can be made square and the size can be adjusted.",
				"The <code>square</code> class can be added to the <code>&lt;picture&gt;</code> to make it square (with minimal rounding), and to adjust the size, any <code>width</code> and <code>height</code> can be set on the <code>&lt;picture&gt;</code> element as well, rather than the <code>&lt;img&gt;</code> element.",
			],
		},
		options: {
			default: {},
			square: {
				root: {
					base: ["border-radius: var(--radius-md);"],
				},
			},
		},
	},
});

const examples = defineExamples(dimensions, states, ({ variant }) => [
	variant.map((v) => {
		const cls = v === "default" ? "" : ` class="${v}"`;
		return `<picture${cls}><img src="https://placehold.co/64x64" alt="avatar" /><small>AB</small></picture>`;
	}),
	[
		`<div role="group"><picture><img src="https://placehold.co/64x64" alt="avatar" /><small>A</small></picture><picture><img src="https://placehold.co/64x64" alt="avatar" /><small>B</small></picture><picture><img src="https://placehold.co/64x64" alt="avatar" /><small>C</small></picture></div>`,
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
