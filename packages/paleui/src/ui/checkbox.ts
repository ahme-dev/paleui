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
	stateAttrsToString,
} from "../shared/types";
import { capitalize } from "../shared/utils";

const meta = defineMeta({
	title: "Checkbox",
	subtitle: "Semantic HTML checkbox element.",
	tags: [
		{
			title: 'MDN: <input type="checkbox">',
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/checkbox",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: 'input[type="checkbox"]' as const,
		description: ["Standard HTML checkbox input element."],
		children: {
			checkmark: {
				selector: "::before",
				description: ["Checkmark indicator, visible when checked"],
				type: "pseudo",
				direct: true,
				optional: false,
				visibleWhen: "checked",
			},
		},
	},
});

const states = defineStates({
	meta: {
		title: "Details",
		description: [
			"You can additionally provide more details for the checkbox.",
			"The <code>&lt;small&gt;</code> can be added to display more info.",
		],
	},
	options: {
		hover: { selector: ":hover" },
		focus: { selector: ":focus-visible" },
		checked: {
			selector: ":checked",
			htmlAttrs: { checked: true },
		},
		disabled: {
			selector: ":disabled",
			htmlAttrs: { disabled: true },
		},
	},
});

const styles = defineStyles(anatomy, states, {
	root: {
		base: [
			"margin: 0;",
			"padding: 0;",
			"box-sizing: border-box;",
			"font-family: inherit;",
			"vertical-align: baseline;",
			...transitionOutlineWith(),
			"appearance: none;",
			"width: calc(var(--spacing) * 4);",
			"height: calc(var(--spacing) * 4);",
			"border: 1px solid var(--border);",
			"border-radius: var(--radius-sm);",
			"background-color: var(--background);",
			"flex-shrink: 0;",
			"box-shadow: var(--shadow-xs);",
			"cursor: var(--cursor-interactive);",
		],
		states: {
			focus: transitionOutlineVisible(),
			checked: [
				"background-color: var(--primary);",
				"border-color: var(--primary);",
			],
			disabled: disable(),
		},
	},
	checkmark: {
		base: [
			"display: flex;",
			"justify-content: center;",
			"align-items: center;",
			"width: 100%;",
			"height: 100%;",
			"font-size: 0.875rem;",
			"line-height: 1;",
			'content: "✓";',
			"color: var(--primary-foreground);",
		],
		states: {},
	},
});

const dimensions = defineDimensions(anatomy, states, {});

const examples = defineExamples(
	dimensions,
	states,
	({ activatableStates }, st) => [
		[
			`<label><input type="checkbox" /> Accept terms and conditions</label>`,
			`<label style="align-items: start; gap: 0.8rem;"><input type="checkbox" /><div style="display: flex; flex-direction: column; gap: 0.5rem;">Accept terms and conditions<small>By clicking this checkbox, you agree to the terms and conditions.</small></div></label>`,
			...activatableStates
				.filter((s) => s !== "checked")
				.map((state) => {
					const attrStr = stateAttrsToString(st.options[state]);
					return `<label><input type="checkbox" ${attrStr} /> ${capitalize(state)}</label>`;
				}),
		],
	],
);

export const schema = {
	meta,
	anatomy,
	states,
	styles,
	dimensions,
	examples,
} as const;
