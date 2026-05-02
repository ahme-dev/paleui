import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineSchema,
	defineStyles,
} from "../shared/types";
import { dedent } from "../shared/utils";

const meta = defineMeta({
	title: "Tabs",
	subtitle: "Contained surface for related content and actions.",
	description: [
		"Cards use the semantic <code>&lt;article&gt;</code> element.",
		"Header, footer, media, and grouped headings are optional.",
	],
	tags: [
		{
			title: "MDN: <article>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article",
		},
	],
});

const anatomy = defineAnatomy({
	root: {
		selector: "[data-tabs]" as const,
		name: "Tabs",
		description: ["A card built on <code>&lt;article&gt;</code>."],
		children: {
			label: {
				selector: "label",
				name: "Header",
				description: ["Label element."],
				type: "element",
				direct: true,
				optional: false,
				children: {
					input: {
						selector: "input",
						name: "Input",
						description: ["Input element"],
						type: "element",
						direct: true,
						optional: false,
						states: {
							checked: {
								name: "Checked",
								selector: ":checked + span + article",
							},
						},
					},
					span: {
						selector: "span[tab-title]",
						name: "Tab Title",
						description: ["Tab title element"],
						type: "element",
						direct: true,
						optional: false,
					},
					article: {
						selector: "article",
						name: "Tab Content",
						description: ["Tab content element"],
						type: "element",
						direct: true,
						optional: false,
					},
				},
			},
		},
		example: dedent(`
			<div data-tabs>
				<label>
					<input type="radio" name="tabs" />
					<span data-tab-title>Tab 1</span>
					<article>Tab content 1</article>
				</label>
				<label>
					<input type="radio" name="tabs" />
					<span data-tab-title>Tab 2</span>
					<article>Tab content 2</article>
				</label>
				<label>
					<input type="radio" name="tabs" />
					<span data-tab-title>Tab 3</span>
					<article>Tab content 3</article>
				</label>
			</article>
		`),
	},
});

const styles = defineStyles(anatomy, {
	root: {
		base: ["display: flex", "flex-wrap: wrap", "gap: 0.25rem;"],
	},
	label: {
		base: ["display: contents"],
	},
	input: {
		base: ["display: none"],
		states: {
			checked: ["display: block"],
		},
	},
	span: {
		base: [
			"padding: 0.75rem 1rem",
			"background: #ddd",
			"cursor: pointer",
			"border-radius: 0.5rem 0.5rem 0 0",
			"order: 0",
		],
	},
	article: {
		base: [
			"display: none",
			"width: 100%",
			"padding: 1rem",
			"border: 1px solid #ddd",
			"background: #fff",
			"order: 1",
		],
	},
});

const dimensions = defineDimensions(anatomy, {
	content: {
		meta: {
			title: "Content",
			description: [
				"Cards can be used as a default card, a media card, or a compact card.",
			],
		},
		options: {
			default: { name: "Default" },
			media: { name: "Media" },
			compact: { name: "Compact" },
		},
	},
});

const examples = defineExamples(dimensions, anatomy, (_keys) => {
	const content: Record<(typeof _keys.content)[number], string> = {
		default: dedent(`
			<article style="max-width: 24rem;">
				<header>
					<hgroup>
						<h3>Pro plan</h3>
						<p>For growing teams shipping frequently.</p>
					</hgroup>
				</header>
				<p>Includes deploy previews, team roles, and production analytics.</p>
				<footer>
					<button class="secondary">Manage billing</button>
					<button>Upgrade</button>
				</footer>
			</article>
		`),
		media: dedent(`
			<article style="max-width: 24rem;">
				<img
					src="https://placehold.co/640x360"
					alt="Dashboard preview"
				/>
				<header>
					<hgroup>
						<h3>Analytics overview</h3>
						<p>Daily active users, deploy health, and error rates in one place.</p>
					</hgroup>
				</header>
				<p>Use cards with media when you need a visual preview above the supporting copy.</p>
			</article>
		`),
		compact: dedent(`
			<article style="max-width: 20rem;">
				<hgroup>
					<h3>Seats remaining</h3>
					<small>12 of 20 assigned</small>
				</hgroup>
				<p>Add more seats before your next billing cycle closes.</p>
			</article>
		`),
	};

	return {
		content,
	};
});

const card = {
	anatomy,
	styles,
	dimensions,
	examples,
} as const;

export const schema = defineSchema({
	meta,
	components: {
		card,
	},
});
