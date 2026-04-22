import { pad, reset } from "../shared/mixins";
import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineStyles,
} from "../shared/types";
import { dedent } from "../shared/utils";

const meta = defineMeta({
	title: "Accordion",
	subtitle:
		"Group of collapse elements, with single or multiple expanded at once.",
	description: [
		'Note that support for having one <code>&lt;details&gt;</code> element open at a time (done with the <code>name</code> attribute) is newer than the <code>&lt;details&gt;</code> element itself, and not as <a target="_blank" rel="noopener noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#browser_compatibility">widely supported</a>.',
		'Accordion items use <code>role="region"</code> for proper semantics and to distinguish them from dropdown menus (which also use <code>&lt;details&gt;</code> elements). This ensures accordions take full width while dropdown menus remain compact.',
	],
	tags: [
		{
			title: "MDN: <details>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details",
		},
		{
			title: "MDN: <summary>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: "[data-accordion]" as const,
		name: "Wrapper",
		description: [
			`Wrapper element grouping one or more accordion items. Add <code>data-accordion</code> to a <code>&lt;div&gt;</code> to create the container.`,
		],
		children: {
			item: {
				selector: 'details[role="region"]' as const,
				name: "Item",
				description: [
					`Each accordion item is a <code>&lt;details role="region"&gt;</code> element. The <code>role="region"</code> attribute is required for proper accordion styling and semantics.`,
					`Add a shared <code>name</code> attribute across items to limit one open at a time.`,
				],
				type: "element",
				direct: true,
				multitude: "multiple",
				states: {
					hover: {
						name: "Hover",
						selector: ":hover",
					},
					open: {
						name: "Open",
						selector: "[open]",
						htmlAttrs: { open: true },
					},
					disabled: {
						name: "Disabled",
						selector: '[aria-disabled="true"]',
						htmlAttrs: { "aria-disabled": "true" },
					},
				},
				optionsCombinations: [["open"], ["hover"], ["disabled"]],
				children: {
					summary: {
						selector: "summary",
						name: "Trigger",
						description: ["Clickable trigger element"],
						type: "element",
						direct: true,
						states: {
							hover: {
								name: "Hover",
								selector: ":hover",
							},
							focus: {
								name: "Focus",
								selector: ":focus-visible",
							},
						},
					},
					div: {
						selector: "div",
						name: "Content",
						description: ["Collapsible content area"],
						type: "element",
						direct: true,
					},
					summaryChevron: {
						selector: "summary::after",
						name: "Chevron",
						description: ["Chevron indicator showing open/closed state"],
						type: "pseudo",
						direct: true,
					},
				},
			},
		},
		example:
			'<div data-accordion>\n  <details role="region" name="group">\n    <summary>\n      <!-- title -->\n    </summary>\n    <div>\n      <!-- content -->\n    </div>\n  </details>\n  <details role="region" name="group">\n    <summary>\n      <!-- title -->\n    </summary>\n    <div>\n      <!-- content -->\n    </div>\n  </details>\n</div>',
	},
});

const styles = defineStyles(anatomy, {
	root: {
		base: [
			...reset(),
			"display: flex",
			"flex-direction: column",
			"width: 100%",
		],
	},
	item: {
		base: [
			...reset(),
			"overflow: hidden",
			"width: 100%",
			"border-bottom: 1px solid var(--border)",
		],
		states: {
			disabled: ["opacity: 0.5", "pointer-events: none", "cursor: not-allowed"],
		},
		selectors: {
			lastChild: ["border-bottom: 0"],
		},
	},
	summary: {
		base: [
			...reset(),
			...pad(4, 0),
			"display: flex",
			"gap: calc(var(--spacing) * 4)",
			"justify-content: space-between",
			"width: 100%",
			"flex-grow: 1",
			"border-radius: var(--radius-sm)",
			"cursor: var(--cursor-interactive)",
			"font-weight: 500",
			"font-size: 0.875rem",
			"color: var(--foreground)",
			"line-height: 1",
			"list-style: none",
		],
		states: {
			hover: ["text-decoration: underline"],
			focus: ["outline: 2px solid var(--ring)", "outline-offset: 2px"],
		},
	},
	div: {
		base: [
			...reset(),
			"display: flex",
			"width: 100%",
			"flex-direction: column",
			"font-size: 0.875rem",
			"line-height: 1",
			"transition: height 0.3s ease-out",
			"padding-bottom: calc(var(--spacing) * 4)",
		],
	},
	summaryChevron: {
		base: [
			'content: "⮟"',
			"font-size: 0.875rem",
			"flex-shrink: 0",
			"line-height: 1",
			"color: var(--muted-foreground)",
		],
		states: {
			open: ['content: "⮝"'],
		},
	},
});

const dimensions = defineDimensions(anatomy, {
	mode: {
		meta: {
			title: "Mode",
			description: [
				"By default, all items can be opened at once. The <code>single</code> mode adds a shared <code>name</code> attribute so only one item can be open at a time — replace <code>group</code> with a unique value per accordion instance.",
			],
		},
		options: {
			multi: { name: "Multi" },
			single: {
				name: "Single",
				item: {
					htmlAttrs: { name: "group" },
				},
			},
		},
	},
});

const examples = defineExamples(dimensions, anatomy, (_keys) => {
	const mode: Record<typeof _keys.mode[number], string> = {
		multi: dedent(`
			<div data-accordion>
				<details role="region" open>
					<summary>What is PaleUI?</summary>
					<div>A minimal, unstyled component library built on semantic HTML with CSS custom properties.</div>
				</details>
				<details role="region">
					<summary>Do I need a framework?</summary>
					<div>No. PaleUI is framework-agnostic and works with plain HTML or any framework that renders it.</div>
				</details>
				<details role="region">
					<summary>How do I customize styles?</summary>
					<div>Override CSS custom properties such as <code>--border</code> or <code>--radius-sm</code>, or target the data attributes directly.</div>
				</details>
			</div>
		`),
		single: dedent(`
			<div data-accordion>
				<details role="region" name="faq" open>
					<summary>What is PaleUI?</summary>
					<div>A minimal, unstyled component library built on semantic HTML with CSS custom properties.</div>
				</details>
				<details role="region" name="faq">
					<summary>Do I need a framework?</summary>
					<div>No. PaleUI is framework-agnostic and works with plain HTML or any framework that renders it.</div>
				</details>
				<details role="region" name="faq">
					<summary>How do I customize styles?</summary>
					<div>Override CSS custom properties such as <code>--border</code> or <code>--radius-sm</code>, or target the data attributes directly.</div>
				</details>
			</div>
		`),
	};

	return {
		mode,
		states: {
			open: dedent(`
				<div data-accordion>
					<details role="region" open>
						<summary>Open</summary>
						<div>This item is currently expanded and showing its content.</div>
					</details>
					<details role="region">
						<summary>Default</summary>
						<div>This item is collapsed.</div>
					</details>
				</div>
			`),
			disabled: dedent(`
				<div data-accordion>
					<details role="region" aria-disabled="true">
						<summary>Disabled</summary>
						<div>This item cannot be toggled.</div>
					</details>
					<details role="region">
						<summary>Default</summary>
						<div>This item is collapsed.</div>
					</details>
				</div>
			`),
		},
	};
});

export const schema = {
	meta,
	anatomy,
	styles,
	dimensions,
	examples,
} as const;
