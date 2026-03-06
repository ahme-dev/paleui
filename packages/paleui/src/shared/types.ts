//
// Base
//

export type Selector = string | readonly string[];

export type TMeta = {
	title?: string;
	subtitle?: string;
	description?: readonly string[];
	tags?: readonly { title: string; url: string }[];
};

export type TCSS = readonly string[];

export type TStateOption = {
	selector: string;
	htmlAttrs?: Record<string, string | boolean>;
};

export type TSelectors =
	| "lastChild"
	| "firstChild"
	| "notLastChild"
	| "notFirstChild"
	| "onlyChild"
	| "odd"
	| "even";

export type TStyleBlock<TStates extends string = string> = {
	base?: TCSS;
	states?: Partial<Record<TStates, TCSS>>;
	selectors?: Partial<Record<TSelectors, TCSS>>;
	htmlAttrs?: Record<string, string | boolean>;
};

export type TSchema = {
	meta: TMeta;
	anatomy: TAnatomy;
	styles: Record<string, TStyleBlock>;
	dimensions: TDimensions;
	examples: Partial<Record<string, string[]>>;
};

//
// Anatomy
//

export type TAnatomyGrandchild = {
	selector?: string;
	name: string;
	description: readonly string[];
	type: "pseudo" | "element" | "text";
	direct?: boolean;
	optional?: boolean;
	visibleWhen?: string;
	multitude?: "single" | "multiple";
	states?: Record<string, TStateOption>;
	optionsCombinations?: readonly (readonly string[])[];
};

export type TAnatomyChild<GC extends string = string> = {
	selector?: string;
	name: string;
	description: readonly string[];
	type: "pseudo" | "element" | "text";
	direct?: boolean;
	optional?: boolean;
	visibleWhen?: string;
	multitude?: "single" | "multiple";
	states?: Record<string, TStateOption>;
	optionsCombinations?: readonly (readonly string[])[];
	children?: Record<GC, TAnatomyGrandchild>;
};

export type TAnatomyRoot<C extends string = string> = {
	selector: Selector;
	name: string;
	description: readonly string[];
	multitude?: "single" | "multiple";
	states?: Record<string, TStateOption>;
	optionsCombinations?: readonly (readonly string[])[];
	children?: Record<C, TAnatomyChild>;
	childrenCombinations?: readonly (readonly C[])[];
	example?: string;
};

export type TAnatomy = { root: TAnatomyRoot };

//
// Keys
//

type ChildKeys<T extends TAnatomy> =
	T["root"]["children"] extends Record<string, unknown>
		? keyof T["root"]["children"] & string
		: never;

type GrandchildKeys<T extends TAnatomy> =
	T["root"]["children"] extends Record<string, TAnatomyChild>
		? {
				[CK in keyof T["root"]["children"]]: T["root"]["children"][CK]["children"] extends Record<
					string,
					unknown
				>
					? keyof T["root"]["children"][CK]["children"] & string
					: never;
			}[keyof T["root"]["children"]]
		: never;

export type AnatomyParts<T extends TAnatomy> =
	| "root"
	| ChildKeys<T>
	| GrandchildKeys<T>;

type OwnStateKeys<T extends { states?: Record<string, unknown> }> =
	T["states"] extends Record<string, unknown>
		? keyof T["states"] & string
		: never;

type RootStateKeys<T extends TAnatomy> = OwnStateKeys<T["root"]>;

type ChildStateKeys<
	T extends TAnatomy,
	K extends string,
> = T["root"]["children"] extends Record<K, TAnatomyChild>
	? OwnStateKeys<T["root"]["children"][K]> | OwnStateKeys<T["root"]>
	: never;

type GrandchildStateKeys<
	T extends TAnatomy,
	K extends string,
> = T["root"]["children"] extends Record<string, TAnatomyChild>
	? {
			[CK in keyof T["root"]["children"]]: T["root"]["children"][CK]["children"] extends Record<
				K,
				TAnatomyGrandchild
			>
				?
						| OwnStateKeys<T["root"]["children"][CK]["children"][K]>
						| OwnStateKeys<T["root"]["children"][CK]>
						| OwnStateKeys<T["root"]>
				: never;
		}[keyof T["root"]["children"]]
	: never;

type StateKeysForPart<T extends TAnatomy, P extends string> = P extends "root"
	? RootStateKeys<T>
	: P extends ChildKeys<T>
		? ChildStateKeys<T, P>
		: P extends GrandchildKeys<T>
			? GrandchildStateKeys<T, P>
			: never;

type StylesForAnatomy<T extends TAnatomy> = {
	[P in AnatomyParts<T>]: TStyleBlock<StateKeysForPart<T, P> & string>;
};

//
// Dimensions
//

export type TDimensionMeta = {
	title: string;
	description?: readonly string[];
};

export type TDimension<T extends TAnatomy = TAnatomy> = {
	meta: TDimensionMeta;
	options: Record<
		string,
		{ name?: string } & (Partial<StylesForAnatomy<T>> | Record<string, never>)
	>;
};

export type TDimensions<T extends TAnatomy = TAnatomy> = Record<
	string,
	TDimension<T>
>;

//
// Examples
//

export const STATES_EXAMPLE_KEY = "states" as const;

type AllStateKeys<TAnat extends TAnatomy> =
	| OwnStateKeys<TAnat["root"]>
	| (TAnat["root"]["children"] extends Record<string, TAnatomyChild>
			? {
					[CK in keyof TAnat["root"]["children"] & string]:
						| OwnStateKeys<TAnat["root"]["children"][CK]>
						| (TAnat["root"]["children"][CK]["children"] extends Record<
								string,
								TAnatomyGrandchild
						  >
								? {
										[GK in keyof TAnat["root"]["children"][CK]["children"] &
											string]: OwnStateKeys<
											TAnat["root"]["children"][CK]["children"][GK]
										>;
									}[keyof TAnat["root"]["children"][CK]["children"] & string]
								: never);
				}[keyof TAnat["root"]["children"] & string]
			: never);

type TExamplesRecord<
	TDims extends Record<string, unknown>,
	TAnat extends TAnatomy = TAnatomy,
> = {
	[K in
		| (keyof TDims & string)
		| typeof STATES_EXAMPLE_KEY]?: K extends typeof STATES_EXAMPLE_KEY
		? Partial<Record<AllStateKeys<TAnat>, string>>
		: Record<string, string>;
};

//
// Define
//

export function defineMeta<T extends TMeta>(meta: T): T {
	return meta;
}

export function defineAnatomy<T extends TAnatomy>(anatomy: T): T {
	return anatomy;
}

export function defineStyles<TAnat extends TAnatomy>(
	_anatomy: TAnat,
	styles: StylesForAnatomy<TAnat>,
): typeof styles {
	return styles;
}

export function defineDimensions<TAnat extends TAnatomy>(
	_anatomy: TAnat,
	dimensions: Record<
		string,
		{
			meta: TDimensionMeta;
			options: Record<
				string,
				{ name?: string } & (
					| Partial<StylesForAnatomy<TAnat>>
					| Record<string, never>
				)
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

export function defineExamples<
	TDims extends Record<string, { options: Record<string, unknown> }>,
	TAnat extends TAnatomy,
>(
	dimensions: TDims,
	anatomy: TAnat,
	builder: (
		keys: DimensionKeysMap<TDims>,
		anatomy: TAnat,
	) => TExamplesRecord<TDims, TAnat>,
): TExamplesRecord<TDims, TAnat> {
	const keys = {} as DimensionKeysMap<TDims>;
	for (const [dimName, dim] of Object.entries(dimensions)) {
		(keys as Record<string, string[]>)[dimName] = Object.keys(dim.options);
	}
	return builder(keys, anatomy);
}
