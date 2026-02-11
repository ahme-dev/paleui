export type Selector = string | readonly string[];

export type TMeta = {
	title?: string;
	subtitle?: string;
	description?: readonly string[];
	tags?: readonly { title: string; url: string }[];
};

export type TCSS = readonly string[];

// =============================================================================
// New component definition types (used by button.ts and future components)
// =============================================================================

export type TAnatomyChild = {
	selector?: string;
	description: string[];
	type: "pseudo" | "element" | "text";
	direct?: boolean;
	optional?: boolean;
	visibleWhen?: string;
};

export type TAnatomyRoot = {
	selector: Selector;
	description: string[];
	children?: Record<string, TAnatomyChild>;
	childrenCombinations?: readonly (readonly string[])[];
	example?: string;
};

export type TAnatomy = Record<string, TAnatomyRoot>;

export type TStateOption = {
	selector: string;
	htmlAttrs?: Record<string, string | boolean>;
};

export type TStates = {
	meta?: TMeta;
	options: Record<string, TStateOption>;
	optionsCombinations?: readonly (readonly string[])[];
};

export type TStyleBlock<TStates extends string = string> = {
	base: TCSS;
	states?: Partial<Record<TStates, TCSS>>;
};

export type TDimension<
	TParts extends string = string,
	TStates extends string = string,
> = {
	meta?: TMeta;
	options: Record<
		string,
		Partial<Record<TParts, TStyleBlock<TStates>>> | object
	>;
};

export type TDimensions<
	TParts extends string = string,
	TStates extends string = string,
> = Record<string, TDimension<TParts, TStates>>;

// =============================================================================
// Builder helper types
// =============================================================================

/** Any object with an options record (for dimension/states) */
type HasOptions<T> = { options: T };

/** Any object with a children record (for anatomy) */
type HasChildren = { children?: Record<string, unknown> };

/** Extract state keys from a states definition */
type StateKeys<T extends TStates> = keyof T["options"] & string;

/** Extract all anatomy part names (root keys + nested children keys) */
type AnatomyParts<T extends TAnatomy> = {
	[K in keyof T]:
		| K
		| (T[K] extends HasChildren ? keyof T[K]["children"] & string : never);
}[keyof T] &
	string;

/** Extract state keys that have htmlAttrs (can be activated via markup) */
type ActivatableStateKeys<T extends HasOptions<object>> = {
	[K in keyof T["options"]]: T["options"][K] extends {
		htmlAttrs: Record<string, unknown>;
	}
		? K
		: never;
}[keyof T["options"]] &
	string;

// =============================================================================
// Builder helper functions
// =============================================================================

/**
 * Convert a state's htmlAttrs to an HTML attribute string
 */
export function stateAttrsToString(state: {
	htmlAttrs?: Record<string, string | boolean>;
}): string {
	if (!state.htmlAttrs) return "";
	return Object.entries(state.htmlAttrs)
		.map(([k, v]) => (v === true ? k : `${k}="${v}"`))
		.join(" ");
}

// =============================================================================
// Component Builders
// =============================================================================

/** Define and validate meta structure */
export function defineMeta<T extends TMeta>(meta: T): T {
	return meta;
}

/** Define and validate anatomy structure */
export function defineAnatomy<T extends TAnatomy>(anatomy: T): T {
	return anatomy;
}

/** Define and validate states structure */
export function defineStates<T extends TStates>(states: T): T {
	return states;
}

/** Define styles with type inference from anatomy and states */
export function defineStyles<TAnat extends TAnatomy, TSt extends TStates>(
	_anatomy: TAnat,
	_states: TSt,
	styles: Record<AnatomyParts<TAnat>, TStyleBlock<StateKeys<TSt>>>,
): typeof styles {
	return styles;
}

/** Define dimensions with type inference from anatomy and states */
export function defineDimensions<TAnat extends TAnatomy, TSt extends TStates>(
	_anatomy: TAnat,
	_states: TSt,
	dimensions: Record<
		string,
		{
			meta?: TMeta;
			options: Record<
				string,
				| Partial<Record<AnatomyParts<TAnat>, TStyleBlock<StateKeys<TSt>>>>
				| object
			>;
		}
	>,
): typeof dimensions {
	return dimensions;
}

/** Helper type: extracts option keys for each dimension */
type DimensionKeysMap<
	TDims extends Record<string, { options: Record<string, unknown> }>,
> = {
	[K in keyof TDims]: (keyof TDims[K]["options"] & string)[];
};

/** Helper type: the keys object passed to defineExamples callback */
type ExampleKeys<
	TDims extends Record<string, { options: Record<string, unknown> }>,
	TSt extends TStates,
> = DimensionKeysMap<TDims> & {
	activatableStates: ActivatableStateKeys<TSt>[];
};

/** Define examples with automatic access to dimension and state keys */
export function defineExamples<
	TDims extends Record<string, { options: Record<string, unknown> }>,
	TSt extends TStates,
>(
	dimensions: TDims,
	states: TSt,
	builder: (keys: ExampleKeys<TDims, TSt>, states: TSt) => string[][],
): string[][] {
	const keys = {} as ExampleKeys<TDims, TSt>;

	// Extract keys for each dimension
	for (const [dimName, dim] of Object.entries(dimensions)) {
		(keys as Record<string, string[]>)[dimName] = Object.keys(dim.options);
	}

	// Extract activatable state keys
	keys.activatableStates = Object.keys(states.options).filter(
		(k) =>
			"htmlAttrs" in
			(states.options as Record<string, { htmlAttrs?: unknown }>)[k],
	) as ActivatableStateKeys<TSt>[];

	return builder(keys, states);
}

// =============================================================================
// Schema type (the shape of each component's `schema` export)
// =============================================================================

export type TSchema = {
	meta: TMeta;
	anatomy: TAnatomy;
	states: TStates;
	styles: Record<string, TStyleBlock>;
	dimensions: TDimensions;
	examples: string[][];
};

export type TPartialSchema = {
	partial: true;
	raw: string;
} & Partial<TSchema>;

// =============================================================================
// Legacy types (used by older components, will be migrated)
// =============================================================================

type StyleBlock = {
	base?: string;
	pseudo?: Partial<
		Record<
			| ":hover"
			| ":focus-visible"
			| ":focus-within"
			| ":active"
			| ":disabled"
			| "::before"
			| "::after"
			| "::backdrop"
			| "::placeholder",
			string
		>
	>;
	states?: { _meta?: TMeta } & Record<string, string>;
	raw?: string;
};

type ContentModel = {
	type: "or" | "and" | "andOr" | "xor";
	children: string[];
};

export type ComponentNode = {
	selector: Selector;
	styles: StyleBlock;
	variants?: { _meta?: TMeta } & Record<string, StyleBlock>;
	sizes?: { _meta?: TMeta } & Record<string, StyleBlock>;
	directChildren?: Record<string, ComponentNode>;
	children?: Record<string, ComponentNode>;
	childrenModel?: ContentModel;
	_meta?: TMeta;
};

export type ComponentSchema = Record<string, ComponentNode>;
