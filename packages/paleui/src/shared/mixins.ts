export const disable = () => ["opacity: 50%", "pointer-events: none"];

export const pad = (y: number, x: number = y) => [
	`padding: calc(var(--spacing) * ${y}) calc(var(--spacing) * ${x})`,
];

export const reset = () => [
	"margin: 0",
	"padding: 0",
	"box-sizing: border-box",
	"font-family: inherit",
	"vertical-align: baseline",
];

export const transitionOutlineWith = (extraTransition?: string) => [
	"outline-offset: 0",
	"outline: 0px solid var(--ring)",
	`transition: outline-width calc(var(--transition-speed) * 0.5) ease-in-out${extraTransition ? `, ${extraTransition}` : ""}`,
];

export const transitionOutlineVisible = () => ["outline-width: 3px"];
