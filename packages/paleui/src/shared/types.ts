export type Selector = string | readonly string[];

export type TMeta = {
	title?: string;
	subtitle?: string;
	description?: readonly string[];
	tags?: readonly { title: string; url: string }[];
};

export type TCSS = readonly string[];

export type TAnatomyChild = {
	selector?: string;
	description: readonly string[];
	type: "pseudo" | "element" | "text";
	direct?: boolean;
	optional?: boolean;
	visibleWhen?: string;
};

export type TAnatomyRoot<C extends string = string> = {
	selector: Selector;
	description: readonly string[];
	children?: Record<C, TAnatomyChild>;
	childrenCombinations?: readonly (readonly C[])[];
	example?: string;
};

export type TAnatomy = { root: TAnatomyRoot };

export type TStateOption = {
	selector: string;
	htmlAttrs?: Record<string, string | boolean>;
};

export type TStates<K extends string = string> = {
	meta?: TMeta;
	options: Record<K, TStateOption>;
	optionsCombinations?: readonly (readonly K[])[];
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
		Partial<Record<TParts, TStyleBlock<TStates>>> | Record<string, never>
	>;
};

export type TDimensions<
	TParts extends string = string,
	TStates extends string = string,
> = Record<string, TDimension<TParts, TStates>>;

type HasChildren = { children?: Record<string, unknown> };

type StateKeys<T extends TStates> = keyof T["options"] & string;

type AnatomyParts<T extends TAnatomy> =
	| "root"
	| (T["root"] extends HasChildren
			? keyof T["root"]["children"] & string
			: never);

type ActivatableStateKeys<T extends { options: Record<string, unknown> }> = {
	[K in keyof T["options"]]: T["options"][K] extends {
		htmlAttrs: Record<string, unknown>;
	}
		? K
		: never;
}[keyof T["options"]] &
	string;

export function stateAttrsToString(state: {
	htmlAttrs?: Record<string, string | boolean>;
}): string {
	if (!state.htmlAttrs) return "";
	return Object.entries(state.htmlAttrs)
		.map(([k, v]) => (v === true ? k : `${k}="${v}"`))
		.join(" ");
}

export function defineMeta<T extends TMeta>(meta: T): T {
	return meta;
}

export function defineAnatomy<T extends TAnatomy>(anatomy: T): T {
	return anatomy;
}

export function defineStates<K extends string, T extends TStates<K>>(
	states: T,
): T {
	return states;
}

export function defineStyles<TAnat extends TAnatomy, TSt extends TStates>(
	_anatomy: TAnat,
	_states: TSt,
	styles: Record<AnatomyParts<TAnat>, TStyleBlock<StateKeys<TSt>>>,
): typeof styles {
	return styles;
}

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
				| Record<string, never>
			>;
		}
	>,
): typeof dimensions {
	return dimensions;
}

type DimensionKeysMap<
	TDims extends Record<string, { options: Record<string, unknown> }>,
> = {
	[K in keyof TDims]: (keyof TDims[K]["options"] & string)[];
};

type ExampleKeys<
	TDims extends Record<string, { options: Record<string, unknown> }>,
	TSt extends TStates,
> = DimensionKeysMap<TDims> & {
	activatableStates: ActivatableStateKeys<TSt>[];
};

export function defineExamples<
	TDims extends Record<string, { options: Record<string, unknown> }>,
	TSt extends TStates,
>(
	dimensions: TDims,
	states: TSt,
	builder: (keys: ExampleKeys<TDims, TSt>, states: TSt) => string[][],
): string[][] {
	const keys = {} as ExampleKeys<TDims, TSt>;

	for (const [dimName, dim] of Object.entries(dimensions)) {
		(keys as Record<string, string[]>)[dimName] = Object.keys(dim.options);
	}

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

export type TSchema<
	TParts extends string = string,
	TStateKeys extends string = string,
> = {
	meta: TMeta;
	anatomy: TAnatomy;
	states: TStates<TStateKeys>;
	styles: Record<TParts, TStyleBlock<TStateKeys>>;
	dimensions: TDimensions<TParts, TStateKeys>;
	examples: string[][];
};

export type TPartialSchema = {
	partial: true;
	raw: string;
} & Partial<TSchema>;
