import { icons } from "./_icons";
import { capitalize } from "./_utils";

const variants = [
	"default",
	"outline",
	"ghost",
	"link",
	"secondary",
	"destructive",
] as const;
const sizes = ["default", "icon"] as const;
const states = ["default", "disabled", "busy"] as const;

export type Component = {
	button: {
		variant: (typeof variants)[number];
		size: (typeof sizes)[number];
		state: (typeof states)[number];
		children: {
			svg?: "";
		};
	};
};

export const buttonDocs = {
	header: {
		title: "Button",
		subtitle: "Semantic HTML button element.",
		mdn: [
			{
				title: "MDN: <button>",
				url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button",
			},
		],
		example: "",
	},
	examples: [
		{
			type: "custom",
			title: "Variants",
			subtitle:
				"Several button styles are available to choose from. These only change the colors, background and border of the button.",
			notes: [
				`The ${variants
					.filter((el) => !["link", "default"].includes(el))
					.map((el) => `<code>${el}</code>`)
					.join(", ")} classes can be used to apply these styles.`,
				'It\'s recommended to use the link style (and its <code>link</code> class) only for <code>&lt;a&gt;</code> elements with a <code>role="button"</code>.',
			],
			examples: variants.map((variant) => {
				const className = variant === "default" ? "" : ` class="${variant}"`;
				const element = variant === "link" ? "a" : "button";
				const hrefAttr = variant === "link" ? ' href="#" role="button"' : "";
				const typeAttr = element === "button" ? ' type="button"' : "";
				return `<${element}${typeAttr}${hrefAttr}${className}>${capitalize(variant)}</${element}>`;
			}),
		},
		{
			type: "custom",
			title: "Icons",
			subtitle:
				"Icons can be added to buttons to enhance their visual appeal and usability. They can also be the only content of a button.",
			notes:
				"Simply add an <code>&lt;svg&gt;</code> element inside the button. The <code>icon</code> class can be used to size buttons to fit the icon.",
			examples: [
				{ label: "Mark", variant: undefined, size: undefined, svg: icons.mark },
				{
					label: undefined,
					variant: "secondary",
					size: "icon",
					svg: icons.idk,
				},
				{
					label: "Delete",
					variant: "destructive",
					size: undefined,
					svg: icons.trash,
				},
			].map(({ label, variant, size, svg }) => {
				const classes = [variant, size].filter(Boolean).join(" ");
				const className = classes ? ` class="${classes}"` : "";
				return `<button${className} type="button">${svg}${label || ""}</button>`;
			}),
		},
		{
			type: "custom",
			title: "States",
			subtitle:
				"Buttons can be put in different states, such as disabled or loading, to indicate their current status.",
			notes: [
				"The <code>disabled</code> and <code>aria-busy</code> attributes can be used for this purpose.",
			],
			examples: states
				.filter((s) => s !== "default")
				.map((state) => {
					const attrs =
						state === "disabled"
							? 'disabled type="button"'
							: 'aria-busy="true" type="button"';
					const icon =
						state === "busy"
							? `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M12 12h2v12h-2zm6 0h2v12h-2z"></path><path fill="currentColor" d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20zm4-26h8v2h-8z"></path></svg>`
							: "";
					return `<button ${attrs}>${icon}${capitalize(state)} Button</button>`;
				}),
		},
	],
};
