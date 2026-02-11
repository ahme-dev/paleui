import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStates,
	defineStyles,
} from "../shared/types";

const meta = defineMeta({
	title: "Dropdown Menu",
	subtitle: "Popup list triggered by a button.",
	tags: [],
});

const anatomy = defineAnatomy({
	root: {
		selector: "details" as const,
		description: [
			'The dropdown menu uses the <code>details</code> and <code>summary</code> elements to create a button that reveals a list of options. The <code>summary</code> element has a <code>button</code> role to look like a button, while the other element that\'s displayed when the <code>details</code> is open, has a <code>dialog</code> role on it to indicate that it is a popup. The list is <code>role="menu"</code> and each item has a <code>role="menuitem"</code> to have proper accessibility semantics and consistent styling. The items also support a <code>&lt;small&gt;</code> element for shortcuts. As mentioned in other pages, <code>details</code> and <code>summary</code> elements provide a way to make a hidden element that can be toggled using a trigger element. Using styling we can make the hidden element appear similar to a popup.',
		],
		children: {
			button: {
				selector: '[role="button"]',
				description: ["Trigger button element"],
				type: "element",
				direct: true,
			},
			dialog: {
				selector: '[role="dialog"]',
				description: ["Dropdown content panel"],
				type: "element",
				direct: true,
			},
			menuitem: {
				selector: '[role="menuitem"]',
				description: ["Individual menu item"],
				type: "element",
				optional: true,
			},
		},
		example:
			'<details>\n  <summary role="button">\n    <!-- trigger text -->\n  </summary>\n  <div role="dialog">\n    <ul role="menu">\n      <li role="menuitem">Item 1</li>\n      <li role="menuitem">Item 2</li>\n    </ul>\n  </div>\n</details>',
	},
});

const states = defineStates({
	meta: {
		title: "Usage",
		description: [
			"Click the trigger to toggle the dropdown. The menu closes when clicking outside.",
		],
	},
	options: {
		hover: { selector: ":hover" },
	},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [],
		states: {},
	},
	button: {
		base: ["width: fit-content;", "position: relative;"],
		states: {},
	},
	dialog: {
		base: [
			"position: absolute;",
			"z-index: 10;",
			"background-color: var(--popover);",
			"color: var(--popover-foreground);",
			"width: max-content;",
			"border: 1px solid var(--border);",
			"border-radius: var(--radius-md);",
			"box-sizing: border-box;",
			"padding: calc(var(--spacing) * 1);",
			"display: flex;",
			"flex-direction: column;",
			"margin: 0;",
			"font-size: 0.875rem;",
			"line-height: 1;",
			"box-shadow: var(--shadow-md);",
		],
		states: {},
	},
	menuitem: {
		base: [
			"display: flex;",
			"align-items: center;",
			"justify-content: space-between;",
			"width: 100%;",
			"box-sizing: border-box;",
			"font-size: 0.875rem;",
			"padding: calc(var(--spacing) * 2);",
			"border-radius: var(--radius-sm);",
			"color: var(--card-foreground);",
			"transition: background-color var(--transition-speed) ease-in-out;",
			"line-height: 1;",
			"cursor: var(--cursor-interactive);",
		],
		states: {
			hover: ["background-color: var(--secondary);"],
		},
	},
});

const dimensions = defineDimensions(anatomy, states, {
	variant: {
		meta: {
			title: "Variants",
			description: [
				"Several button variants are available to choose from for the dropdown menu.",
			],
		},
		options: {
			default: {},
		},
	},
});

const examples = defineExamples(dimensions, states, () => [
	[
		`<details><summary role="button" class="secondary">Secondary</summary><div role="dialog"><ul role="menu" style="min-width: 180px;"><li role="menuitem">New File<small>%N</small></li><li role="menuitem">Open<small>%O</small></li><li role="menuitem">Save<small>%S</small></li><hr /><li role="menuitem">Close</li></ul></div></details>`,
		`<details><summary role="button" class="destructive">Destructive</summary><div role="dialog"><ul role="menu" style="min-width: 180px;"><p>Danger Zone</p><li role="menuitem">Delete Account</li><li role="menuitem">Reset Data</li><hr /><li role="menuitem">Sign Out</li></ul></div></details>`,
		`<details><summary role="button" class="outline">Outline</summary><div role="dialog"><ul role="menu" style="min-width: 180px;"><li role="menuitem">Edit<small>%E</small></li><li role="menuitem">Copy<small>%C</small></li><li role="menuitem">Paste<small>%V</small></li><hr /><li role="menuitem">Preferences</li></ul></div></details>`,
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
