import {
	defineAnatomy,
	defineDimensions,
	defineExamples,
	defineMeta,
	defineSchema,
	defineStyles,
} from "../shared/types";
import { dedent } from "../shared/utils";

const raw = `
[data-paleui] h1,
[data-paleui] h2,
[data-paleui] h3,
[data-paleui] h4,
[data-paleui] h5,
[data-paleui] h6 {
margin: 0;
font-family: var(--font-heading);
font-style: normal;
color: var(--foreground);
text-wrap: pretty;
}

[data-paleui] h1 {
scroll-margin-top: calc(var(--spacing) * 20);
font-size: clamp(2.25rem, 4vw, 3rem);
font-weight: 700;
line-height: 1.1;
text-wrap: balance;
}

[data-paleui] h2 {
scroll-margin-top: calc(var(--spacing) * 20);
padding-bottom: 0.5rem;
border-bottom: 1px solid var(--border);
font-size: clamp(1.75rem, 3vw, 2rem);
font-weight: 600;
line-height: 1.2;
text-wrap: balance;
}

[data-paleui] h3 {
scroll-margin-top: calc(var(--spacing) * 20);
font-size: 1.5rem;
font-weight: 600;
line-height: 1.3;
}

[data-paleui] h4 {
scroll-margin-top: calc(var(--spacing) * 20);
font-size: 1.125rem;
font-weight: 600;
line-height: 1.5;
}

[data-paleui] h2:not(:first-child) {
margin-top: 3rem;
}

[data-paleui] h3:not(:first-child),
[data-paleui] h4:not(:first-child) {
margin-top: 2rem;
}

[data-paleui] p,
[data-paleui] li {
line-height: 1.75;
color: var(--foreground);
}

[data-paleui] p,
[data-paleui] blockquote,
[data-paleui] ul,
[data-paleui] ol,
[data-paleui] pre,
[data-paleui] .lead,
[data-paleui] .large,
[data-paleui] .small,
[data-paleui] .muted,
[data-paleui] small {
margin: 0;
}

[data-paleui] :where(h1, h2, h3, h4) + :where(p, blockquote, ul, ol, pre, .lead, .large, .small, .muted, small),
[data-paleui] :where(p, blockquote, ul, ol, pre, .lead, .large, .small, .muted, small) + :where(p, blockquote, ul, ol, pre, .lead, .large, .small, .muted, small) {
margin-top: 1.5rem;
}

[data-paleui] small,
[data-paleui] .small,
[data-paleui] .muted {
font-size: 0.875rem;
}

[data-paleui] small {
line-height: 1.5;
color: var(--muted-foreground);
}

[data-paleui] .lead {
font-size: 1.25rem;
line-height: 1.75;
color: var(--muted-foreground);
}

[data-paleui] .large {
font-size: 1.125rem;
font-weight: 600;
line-height: 1.6;
}

[data-paleui] .small {
font-weight: 500;
line-height: 1.4;
}

[data-paleui] .muted {
line-height: 1.6;
color: var(--muted-foreground);
}

[data-paleui] hgroup {
display: flex;
flex-direction: column;
gap: 0.5rem;
margin: 0;
}

[data-paleui] hgroup > p,
[data-paleui] hgroup > small,
[data-paleui] hgroup > .lead,
[data-paleui] hgroup > .muted {
margin: 0;
}

[data-paleui] code {
margin: 0;
padding: 0.125rem 0.375rem;
box-sizing: border-box;
font-family: var(--font-mono);
font-size: 0.875em;
font-weight: 600;
line-height: 1;
border-radius: var(--radius-sm);
background-color: var(--muted);
color: var(--foreground);
}

[data-paleui] pre {
width: 100%;
overflow-x: auto;
border: 1px solid var(--border);
border-radius: var(--radius-lg);
background-color: var(--muted);
}

[data-paleui] pre > code {
display: block;
min-width: 100%;
padding: calc(var(--spacing) * 4);
border-radius: 0;
background-color: transparent;
color: inherit;
font-size: 0.875rem;
font-weight: 400;
line-height: 1.7;
white-space: pre;
}

[data-paleui] blockquote {
padding-left: 1rem;
border-left: 2px solid var(--border);
font-style: italic;
color: var(--muted-foreground);
}

[data-paleui] ul,
[data-paleui] ol {
padding-left: 1.5rem;
}

[data-paleui] li + li,
[data-paleui] li > ul,
[data-paleui] li > ol {
margin-top: 0.5rem;
}

`;

const meta = defineMeta({
	title: "Typography",
	subtitle: "Default document rhythm for content written with plain HTML.",
	description: [
		"Typography styles headings, paragraphs, lists, code, and quotes inside the <code>[data-paleui]</code> scope.",
		"Helper classes like <code>.lead</code>, <code>.large</code>, <code>.small</code>, and <code>.muted</code> are included for common text treatments.",
	],
	tags: [
		{
			title: "MDN: Heading elements",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements",
		},
		{
			title: "MDN: <blockquote>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blockquote",
		},
		{
			title: "MDN: <code>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/code",
		},
		{
			title: "MDN: <pre>",
			url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/pre",
		},
	],
});

const headerExample = dedent(`
	<section style="max-width: 28rem; width: 100%;">
		<h1>Typography</h1>
		<p class="lead">Content should read well before you start tuning utilities.</p>
		<h2>Getting started</h2>
		<p>Import <code>typography.css</code> alongside the base tokens and write normal HTML content inside the PaleUI scope.</p>
		<blockquote>Good defaults matter most on the pages you write the least custom CSS for.</blockquote>
	</section>
`);

const headingAnatomy = defineAnatomy({
	root: {
		selector: "h1, h2, h3, h4" as const,
		name: "Heading",
		description: ["Heading elements inside the typography scope."],
		example: dedent(`
			<h1>Typography</h1>
		`),
	},
});

const headingStyles = defineStyles(headingAnatomy, {
	root: {},
});

const headingDimensions = defineDimensions(headingAnatomy, {
	level: {
		meta: {
			title: "Level",
			description: ["Heading levels use a fixed scale and spacing."],
		},
		options: {
			h1: { name: "H1" },
			h2: { name: "H2" },
			h3: { name: "H3" },
			h4: { name: "H4" },
		},
	},
});

const headingExamples = defineExamples(
	headingDimensions,
	headingAnatomy,
	(_keys) => ({
		level: {
			h1: dedent(`
				<h1>Typography</h1>
			`),
			h2: dedent(`
				<h2>Getting started</h2>
			`),
			h3: dedent(`
				<h3>Default content</h3>
			`),
			h4: dedent(`
				<h4>Consistent spacing</h4>
			`),
		},
	}),
);

const textAnatomy = defineAnatomy({
	root: {
		selector: "p, blockquote, ul, ol" as const,
		name: "Text",
		description: [
			"Paragraphs, blockquotes, and lists use the same document rhythm.",
		],
		example: dedent(`
			<p>Typography sets readable defaults for long-form content.</p>
		`),
	},
});

const textStyles = defineStyles(textAnatomy, {
	root: {},
});

const textDimensions = defineDimensions(textAnatomy, {
	kind: {
		meta: {
			title: "Kind",
			description: ["Paragraphs, quotes, and lists share the same spacing."],
		},
		options: {
			paragraph: { name: "Paragraph" },
			blockquote: { name: "Blockquote" },
			list: { name: "List" },
		},
	},
});

const textExamples = defineExamples(textDimensions, textAnatomy, (_keys) => ({
	kind: {
		paragraph: dedent(`
			<p style="max-width: 28rem;">Typography sets readable defaults for long-form content.</p>
		`),
		blockquote: dedent(`
			<blockquote style="max-width: 28rem;">Good defaults matter most on the pages you write the least custom CSS for.</blockquote>
		`),
		list: dedent(`
			<ul style="max-width: 28rem;">
				<li>Import the base token file.</li>
				<li>Add the typography stylesheet.</li>
				<li>Write normal HTML content.</li>
			</ul>
		`),
	},
}));

const codeAnatomy = defineAnatomy({
	root: {
		selector: "p, pre" as const,
		name: "Code",
		description: ["Inline code and code blocks use the monospace palette."],
		example: dedent(`
			<p>Install <code>paleui</code> and import <code>main.css</code> before any component or typography stylesheet.</p>
		`),
	},
});

const codeStyles = defineStyles(codeAnatomy, {
	root: {},
});

const codeDimensions = defineDimensions(codeAnatomy, {
	kind: {
		meta: {
			title: "Kind",
			description: [
				"Use inline code for references and preformatted blocks for longer snippets.",
			],
		},
		options: {
			inlineCode: { name: "Inline Code" },
			codeBlock: { name: "Code Block" },
		},
	},
});

const codeExamples = defineExamples(codeDimensions, codeAnatomy, (_keys) => ({
	kind: {
		inlineCode: dedent(`
			<p style="max-width: 28rem;">Install <code>paleui</code> and import <code>main.css</code> before any component or typography stylesheet.</p>
		`),
		codeBlock: dedent(`
			<pre style="max-width: 28rem;"><code>@import "paleui/lib/main.css";
@import "paleui/lib/typography.css";</code></pre>
		`),
	},
}));

const utilityAnatomy = defineAnatomy({
	root: {
		selector: ".lead, .large, .small, .muted" as const,
		name: "Utility",
		description: ["Helper classes cover lead, large, small, and muted text."],
		example: dedent(`
			<p class="lead">Lead text is useful below a page title or section heading.</p>
		`),
	},
});

const utilityStyles = defineStyles(utilityAnatomy, {
	root: {},
});

const utilityDimensions = defineDimensions(utilityAnatomy, {
	style: {
		meta: {
			title: "Style",
			description: ["Use the helper classes for common text treatments."],
		},
		options: {
			lead: { name: "Lead" },
			large: { name: "Large" },
			small: { name: "Small" },
			muted: { name: "Muted" },
		},
	},
});

const utilityExamples = defineExamples(
	utilityDimensions,
	utilityAnatomy,
	(_keys) => ({
		style: {
			lead: dedent(`
				<p class="lead" style="max-width: 28rem;">Lead text is useful below a page title or section heading.</p>
			`),
			large: dedent(`
				<div class="large" style="max-width: 28rem;">Large text adds emphasis without becoming a heading.</div>
			`),
			small: dedent(`
				<div class="small" style="max-width: 28rem;">Small text works for labels and metadata.</div>
			`),
			muted: dedent(`
				<p class="muted" style="max-width: 28rem;">Muted text works well for secondary explanations and notes.</p>
			`),
		},
	}),
);

const heading = {
	anatomy: headingAnatomy,
	styles: headingStyles,
	dimensions: headingDimensions,
	examples: headingExamples,
} as const;

const text = {
	anatomy: textAnatomy,
	styles: textStyles,
	dimensions: textDimensions,
	examples: textExamples,
} as const;

const code = {
	anatomy: codeAnatomy,
	styles: codeStyles,
	dimensions: codeDimensions,
	examples: codeExamples,
} as const;

const utility = {
	anatomy: utilityAnatomy,
	styles: utilityStyles,
	dimensions: utilityDimensions,
	examples: utilityExamples,
} as const;

export const pageSchema = defineSchema({
	meta,
	headerExample,
	components: {
		heading,
		text,
		code,
		utility,
	},
});

export const schema = [{ partial: true, raw }, pageSchema] as const;
