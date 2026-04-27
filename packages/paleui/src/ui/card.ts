import { pad, reset } from "../shared/mixins";
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
	title: "Card",
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
		selector: "article" as const,
		name: "Card",
		description: ["A card built on <code>&lt;article&gt;</code>."],
		children: {
			header: {
				selector: "header",
				name: "Header",
				description: ["Optional header element."],
				type: "element",
				direct: true,
				optional: true,
			},
			footer: {
				selector: "footer",
				name: "Footer",
				description: ["Optional footer element."],
				type: "element",
				direct: true,
				optional: true,
			},
			hgroup: {
				selector: "hgroup",
				name: "Heading Group",
				description: ["Optional heading group."],
				type: "element",
				direct: false,
				optional: true,
				children: {
					heading: {
						selector: "h1, h2, h3, h4, h5, h6",
						name: "Heading",
						description: ["Card heading text."],
						type: "element",
						direct: true,
						optional: true,
					},
					subtext: {
						selector: "p, small",
						name: "Supporting Text",
						description: ["Supporting text inside the heading group."],
						type: "element",
						direct: true,
						optional: true,
					},
				},
			},
			img: {
				selector: "img",
				name: "Media",
				description: ["Optional image element."],
				type: "element",
				direct: false,
				optional: true,
			},
		},
		example: dedent(`
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
	},
});

const styles = defineStyles(anatomy, {
	root: {
		base: [
			...reset(),
			...pad(5, 6),
			"display: flex",
			"flex-direction: column",
			"gap: calc(var(--spacing) * 6)",
			"width: 100%",
			"border: 1px solid var(--border)",
			"border-radius: var(--radius-xl)",
			"background-color: var(--card)",
			"color: var(--card-foreground)",
			"box-shadow: var(--shadow-sm)",
		],
	},
	header: {
		base: [
			...reset(),
			"display: flex",
			"flex-direction: column",
			"gap: calc(var(--spacing) * 2)",
		],
	},
	footer: {
		base: [
			...reset(),
			"display: flex",
			"align-items: center",
			"gap: calc(var(--spacing) * 2)",
			"flex-wrap: wrap",
		],
	},
	hgroup: {
		base: [
			...reset(),
			"display: flex",
			"flex-direction: column",
			"gap: calc(var(--spacing) * 1)",
		],
	},
	heading: {
		base: [
			...reset(),
			"line-height: 1.2",
			"font-size: 1.125rem",
			"font-weight: 600",
			"color: inherit",
		],
	},
	subtext: {
		base: [
			...reset(),
			"line-height: 1.5",
			"font-size: 0.875rem",
			"color: var(--muted-foreground)",
		],
	},
	img: {
		base: [
			...reset(),
			"display: block",
			"width: 100%",
			"height: auto",
			"border-radius: var(--radius-lg)",
			"object-fit: cover",
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
