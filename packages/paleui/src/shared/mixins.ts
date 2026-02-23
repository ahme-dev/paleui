export const disable = (): string[] => [
	"opacity: 50%;",
	"pointer-events: none;",
];

export const pad = (y: number, x: number = y): string[] => [
	`padding: calc(var(--spacing) * ${y}) calc(var(--spacing) * ${x});`,
];

export const reset = (): string[] => [
	"margin: 0;",
	"padding: 0;",
	"box-sizing: border-box;",
	"font-family: inherit;",
	"vertical-align: baseline;",
];

export const transitionOutlineWith = (extraTransition?: string): string[] => [
	"outline-offset: 0;",
	"outline: 0px solid var(--ring);",
	`transition: outline-width calc(var(--transition-speed) * 0.5) ease-in-out${extraTransition ? `, ${extraTransition}` : ""};`,
];

export const transitionOutlineVisible = (): string[] => ["outline-width: 3px;"];
