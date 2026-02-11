import {
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
	title: "Dialog",
	subtitle: "Modal that overlays and renders separate content.",
	description: [
		'The modern semantic approach used here has <a target="_blank" rel="noopener noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#browser_compatibility">wide support</a> in browsers. However, Javascript is required to toggle the modal (less than one-line), and because of this a different approach will be provided in future releases.',
	],
	tags: [
		{
			title: "MDN: <dialog>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: "dialog" as const,
		description: [
			"The dialog is built using the native <code>&lt;dialog&gt;</code> element, which is natively supported by browsers to trigger a modal without special styling. Open it by using an id and <code>showModal()</code>.",
		],
		children: {
			backdrop: {
				selector: "::backdrop",
				description: ["Semi-transparent overlay behind the dialog"],
				type: "pseudo",
				direct: true,
				optional: false,
			},
			close: {
				selector: ".close",
				description: ["Close button positioned at the top right"],
				type: "element",
				direct: true,
				optional: true,
			},
			hgroup: {
				selector: "hgroup",
				description: ["Header group containing title and description"],
				type: "element",
				direct: true,
				optional: true,
			},
			description: {
				selector: "p",
				description: ["Description text within the header group"],
				type: "element",
				optional: true,
			},
			heading: {
				selector: "h1, h2, h3, h4, h5, h6",
				description: ["Dialog heading"],
				type: "element",
				optional: true,
			},
			footer: {
				selector: "div:last-child, form:last-child",
				description: ["Footer area with action buttons"],
				type: "element",
				direct: true,
				optional: true,
			},
		},
		childrenCombinations: [
			["close", "hgroup", "footer"],
			["hgroup", "footer"],
		],
		example:
			'<button onclick="mdl.showModal()">\n  <!-- trigger text -->\n</button>\n\n<dialog id="mdl">\n  <hgroup>\n    <!-- title and description -->\n  </hgroup>\n\n  <!-- dialog content -->\n\n  <div>\n    <!-- buttons or footer (auto aligned to the right) -->\n  </div>\n</dialog>',
	},
});

const states = defineStates({
	meta: {
		title: "Usage",
		description: [
			'Open the dialog using <code>showModal()</code> on the element. Close it with a <code>&lt;form method="dialog"&gt;</code> containing a submit button.',
		],
	},
	options: {
		hover: { selector: ":hover" },
		focus: { selector: ":focus-visible" },
	},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [
			...transitionOutlineWith(),
			"border: none;",
			"border-radius: var(--radius-lg);",
			"max-width: 500px;",
			"padding: calc(var(--spacing) * 6);",
			"position: relative;",
			"background-color: var(--background);",
			"color: var(--foreground);",
		],
		states: {
			focus: transitionOutlineVisible(),
		},
	},
	backdrop: {
		base: ["background-color: black;", "opacity: 50%;"],
		states: {},
	},
	close: {
		base: [
			"position: absolute;",
			"top: calc(var(--spacing) * 2);",
			"right: calc(var(--spacing) * 2);",
			"color: var(--muted-foreground);",
			"cursor: var(--cursor-interactive);",
			"background-color: transparent;",
			"box-shadow: none;",
		],
		states: {
			hover: ["box-shadow: none;", "background-color: transparent;"],
		},
	},
	hgroup: {
		base: ["padding-bottom: calc(var(--spacing) * 2);"],
		states: {},
	},
	description: {
		base: ["font-size: 0.875rem;"],
		states: {},
	},
	heading: {
		base: ["margin-top: 0;"],
		states: {},
	},
	footer: {
		base: [
			"margin-top: calc(var(--spacing) * 4);",
			"display: flex;",
			"flex-direction: row;",
			"justify-content: flex-end;",
			"gap: var(--spacing);",
		],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {});

const examples = defineExamples(dimensions, states, () => [
	[
		`<button onclick="share_modal.showModal()">Share</button>\n<dialog id="share_modal">\n  <hgroup>\n    <h3>Share link</h3>\n    <p>Anyone who has this link will be able to view this.</p>\n  </hgroup>\n  <input type="text" value="https://paleui.ahme.dev" style="width: 100%;" />\n  <div style="margin: 0.5rem 0;"></div>\n  <div role="group">\n    <button style="background-color: indianred;">X</button>\n    <button style="background-color: indianred;">LinkedIn</button>\n  </div>\n  <form method="dialog">\n    <button class="secondary">Close</button>\n  </form>\n</dialog>`,
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
