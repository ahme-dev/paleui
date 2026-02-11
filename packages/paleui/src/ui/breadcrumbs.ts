import { icons } from "../shared/icons";
import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";

const meta = defineMeta({
	title: "Breadcrumbs",
	subtitle:
		"Displays the path to the current resource using a hierarchy of links.",
	tags: [],
});

const anatomy = defineAnatomy({
	root: {
		selector: 'nav[aria-label="breadcrumb"]' as const,
		description: [
			'Breadcrumbs are made using a <code>&lt;nav&gt;</code> element with <code>aria-label="breadcrumb"</code> containing an ordered list (<code>&lt;ol&gt;</code>) of links. The current page is indicated with <code>aria-current="page"</code> and should not be a link.',
		],
		children: {
			ol: {
				selector: "ol",
				description: ["Ordered list of breadcrumb items"],
				type: "element",
				direct: true,
			},
			li: {
				selector: "li",
				description: ["Breadcrumb item"],
				type: "element",
			},
			a: {
				selector: "a",
				description: ["Breadcrumb link"],
				type: "element",
				optional: true,
			},
		},
		example:
			'<nav aria-label="breadcrumb">\n  <ol>\n    <li>\n      <a href="/">\n        <!-- breadcrumb 1 -->\n      </a>\n    </li>\n    <!-- other breadcrumbs -->\n  </ol>\n</nav>',
	},
});

const states = defineStates({
	meta: {
		title: "Collapsed",
		description: [
			"For very long breadcrumb trails, you can show an ellipsis to indicate collapsed items.",
			'Instead of a link, the collapsed item can be represented by a span with <code>aria-hidden="true"</code>. The attribute is there to indicate that the item is not part of the navigation and should not be announced by screen readers.',
		],
	},
	options: {
		hover: { selector: ":hover" },
	},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: ["display: flex;", "align-items: center;"],
		states: {},
	},
	ol: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			"display: flex;",
			"flex-wrap: wrap;",
			"align-items: center;",
			"gap: calc(var(--spacing) * 2);",
			"list-style: none;",
		],
		states: {},
	},
	li: {
		base: [
			"display: flex;",
			"align-items: center;",
			"gap: calc(var(--spacing) * 1.5);",
			"font-size: 0.875rem;",
			"color: var(--muted-foreground);",
			"line-height: 1;",
		],
		states: {},
	},
	a: {
		base: [
			"display: flex;",
			"align-items: center;",
			"gap: calc(var(--spacing) * 1.5);",
			"color: var(--muted-foreground);",
			"text-decoration: none;",
			"transition: color var(--transition-speed) ease-in-out;",
			"line-height: 1;",
		],
		states: {
			hover: ["color: var(--foreground);"],
		},
	},
});

const dimensions = defineDimensions(anatomy, states, {
	separator: {
		meta: {
			title: "Separators",
			description: [
				'By default, ">" is used as the separator. But this can be changed by overriding the <code>--separator</code> CSS variable.',
			],
		},
		options: {
			default: {},
		},
	},
	icons: {
		meta: {
			title: "Icons",
			description: [
				"A <code>&lt;svg&gt;</code> element can be added inside the breadcrumb item link.",
			],
		},
		options: {
			default: {},
		},
	},
});

const examples = defineExamples(dimensions, states, () => [
	[
		`<nav aria-label="breadcrumb"><ol style="--separator: '/'"><li><a href="#">Home</a></li><li><a href="#">Products</a></li><li><a href="#">Laptops</a></li><li aria-current="page">Gaming Laptop</li></ol></nav>`,
	],
	[
		`<nav aria-label="breadcrumb"><ol><li><a href="#">Home</a></li><li><a href="#">Projects</a></li><li><a href="#">${icons.star} Favourites</a></li><li aria-current="page">Settings</li></ol></nav>`,
	],
	[
		`<nav aria-label="breadcrumb"><ol><li><a href="#">Home</a></li><li><span aria-hidden="true">...</span></li><li><a href="#">Components</a></li><li><a href="#">Navigation</a></li><li aria-current="page">Breadcrumbs</li></ol></nav>`,
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
