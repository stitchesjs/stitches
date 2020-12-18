import { Properties } from './css-types'
import { cssPropToTokenMap } from './cssPropToTokenMap'

// prettier-ignore
export type EmptyTheme = {
	colors?: {}
	space?: {}
	fontSizes?: {}
	fonts?: {}
	fontWeights?: {}
	lineHeights?: {}
	letterSpacings?: {}
	sizes?: {}
	borderWidths?: {}
	borderStyles?: {}
	radii?: {}
	shadows?: {}
	zIndices?: {}
	transitions?: {}
}

export type CSSPropertiesToTokenScale = typeof cssPropToTokenMap
type Expand<B, T = B> = { [k in keyof T]: T[k] }
// prettier-ignore
export type StitchesCSS<
  Conditions = {},
  Theme = {},
  Utils = {},
  AllowNesting = true
> = { [k in keyof Properties]?: CSSPropertiesToTokenScale[k] extends keyof Theme ?  keyof Theme[CSSPropertiesToTokenScale[k]] | Properties[k] : Properties[k]}
  & { [k in `when$${keyof Conditions}`]?: StitchesCSS<Conditions, Theme, Utils, AllowNesting>; }
  & { [k in keyof Utils]?: Utils[k] }
  & { [k in string]?: AllowNesting extends true ? StitchesCSS<Conditions, Theme, Utils, AllowNesting> | string | number : {} }

type ArgCss<T, A = {}, B = {}, C = {}> = {
	variants?: { [k in keyof T]: { [v in keyof T[k]]: StitchesCSS<A, B, C> } }
} & StitchesCSS<A, B, C>

type MergeVariants<A, B> = {
	[k in keyof (A & B)]: {
		[b in keyof (A[k] & B[k])]: any
	}
}

type HasTail<T extends any[]> = T extends [] | [any] ? false : true
type Tail<T extends any[]> = ((...t: T) => any) extends (_: any, ...tail: infer _Tail) => any ? _Tail : []
type GetVariants<Variants, A, B, C> = ArgCss<Variants, A, B, C> | StyledRule<Variants, A>
type MergePotato<T extends any[]> = MergeVariants<Head<T>>

type InferVariantsFromUnknownRule<Rule, A, B, C> = Rule extends ArgCss<infer Vars, A, B, C>
	? Vars
	: Rule extends StyledRule<infer Vars, A>
	? Vars
	: never

type InferRestVariants<Args extends any[], A, B, C> = MergeVariants<
	InferVariantsFromUnknownRule<Args[0], A, B, C>,
	HasTail<Args> extends true ? InferRestVariants<Tail<Args>, A, B, C> : {}
>
export interface TCss<A = {}, B = {}, C = {}> {
	<FirstArgVariants, SecondArgVariants>(
		firstRule: ArgCss<FirstArgVariants, A, B, C> | StyledRule<FirstArgVariants, A>,
	): StyledRule<FirstArgVariants, A>
	<FirstArgVariants, SecondArgVariants>(
		firstRule: ArgCss<FirstArgVariants, A, B, C> | StyledRule<FirstArgVariants, A>,
		secondRule: ArgCss<SecondArgVariants, A, B, C> | StyledRule<SecondArgVariants, A>,
	): StyledRule<MergeVariants<FirstArgVariants, SecondArgVariants>, A>
	// <
	// 	All extends (
	// 		| ArgCss<{ [k: string]: { [b: string]: {} } }, A, B, C>
	// 		| StyledRule<{ [k: string]: { [b: string]: {} } }, A>
	// 	)[]
	// >(
	// 	...styles: All
	// ): StyledRule<InferRestVariants<All, A, B, C>, A>

	global: (definition: Record<string, StitchesCSS<A, B, C, D>>) => GlobalRule
	theme: (
		theme: Partial<
			{
				[TO in keyof B]: Partial<B[TO]>
			}
		>,
	) => ThemeRule
}
interface IConfig<Conditions, Theme, Utils, Prefix> {
	conditions?: { [k in keyof Conditions]?: Conditions[k] }
	theme?: { [k in keyof Theme]: k extends keyof EmptyTheme ? Theme[k] : never } & { [k in keyof EmptyTheme]?: Theme[k] }
	properties?: {
		[k in keyof Utils]: (a: Utils[k]) => StitchesCSS<Conditions, Theme, Utils>
	}
	prefix?: Prefix
}

type CssFactory = <Conditions = {}, Theme = {}, Utils = {}, Prefix extends string = ''>(
	_config: IConfig<Conditions, Theme, Utils, Prefix>,
) => TCss<Conditions, Theme, Utils>

declare const createCss: CssFactory

export default createCss
