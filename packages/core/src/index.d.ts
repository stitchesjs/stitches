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
  & { [k in keyof Conditions as `when$${keyof Conditions}`]?: StitchesCSS<Conditions, Theme, Utils, AllowNesting>; }
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

type InferRestVariants<Args extends any[]> = MergeVariants<
	Args[0],
	HasTail<Args> extends true ? InferRestVariants<Tail<Args>> : {}
>
export interface TCss<A = {}, B = {}, C = {}> {
	<Vars extends any[]>(
		...styles: {
			[k in keyof Vars]:
				|  ({
						variants?: Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: StitchesCSS<A, B, C> } }
				  } & (StitchesCSS<A, B, C>)
				| SimpleStyledRule<Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: StitchesCSS<A, B, C> } }>
		}
	): PStyledRule<InferRestVariants<Vars>, A>

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

type CssFactory = <Conditions = {}, Theme = {}, Utils = {}, Prefix =''>(
	_config: IConfig<Conditions, Theme, Utils, Prefix>,
) => TCss<Conditions, Theme, Utils>

declare const createCss: CssFactory

const ruleSymbol = Symbol('')
interface PStyledRule<Variants, Conditions> {
	(
		init?: { [k in keyof Variants]?: keyof Variants[k] | { [I in `when$${keyof Conditions}`]?: keyof Variants[k] } },
	): StyledExpression
	[ruleSymbol]: true
	toString(): string
	className: string
	classNames: string[]
	selector: string
	variants: Variants
}

type SimpleStyledRule<A> = {
	[ruleSymbol]: true
	variants: A
}

interface TCss2<A = {}, B = {}, C = {}> {}

export declare const css: TCss2<>

export default createCss
