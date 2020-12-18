import { Properties } from './css-types'
import { cssPropToTokenMap } from './cssPropToTokenMap'

// just using it as a unique identifier for rule types
const ruleSymbol = Symbol('')
export type CSSPropertiesToTokenScale = typeof cssPropToTokenMap

/* Config:
/* ========================================================================== */

// Just used as a keyof target for the config
// for some weird reason, autocomplete stops working
// if we try to pre compute the keys or use a union
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

interface IConfig<Conditions, Theme, Utils, Prefix> {
	conditions?: { [k in keyof Conditions]?: Conditions[k] }
	theme?: { [k in keyof Theme]: k extends keyof EmptyTheme ? Theme[k] : never } & { [k in keyof EmptyTheme]?: Theme[k] }
	properties?: {
		[k in keyof Utils]: (a: Utils[k]) => StitchesCSS<Conditions, Theme, Utils>
	}
	prefix?: Prefix
}

/* Css typed structure:
/* ========================================================================== */

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

/* Utils to type and extract variants from args args:
/* ========================================================================== */

type ArgCss<T, A = {}, B = {}, C = {}> = {
	variants?: { [k in keyof T]: { [v in keyof T[k]]: StitchesCSS<A, B, C> } }
} & StitchesCSS<A, B, C>
type InferRestVariants<Args extends any[]> = MergeVariants<
	Args[0],
	HasTail<Args> extends true ? InferRestVariants<Tail<Args>> : {}
>
type HasTail<T extends any[]> = T extends [] | [any] ? false : true
type Tail<T extends any[]> = ((...t: T) => any) extends (_: any, ...tail: infer _Tail) => any ? _Tail : []
type GetVariants<Variants, A, B, C> = ArgCss<Variants, A, B, C> | StyledRule<Variants, A>
type MergePotato<T extends any[]> = MergeVariants<Head<T>>
type MergeVariants<A, B> = {
	[k in keyof (A & B)]: {
		[b in keyof (A[k] & B[k])]: any
	}
}

/* Css Instance Type:
/* ========================================================================== */
export interface TCss<A = {}, B = {}, C = {}> {
	<Vars extends any[]>(
		...styles: {
			[k in keyof Vars]:
				| ({
						variants?: Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: StitchesCSS<A, B, C> } }
				  } & StitchesCSS<A, B, C>)
				| _SimpleStyledRule<Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: StitchesCSS<A, B, C> } }>
		}
	): _StyledRule<InferRestVariants<Vars>, A>

	global: (definition: Record<string, StitchesCSS<A, B, C, D>>) => GlobalRule
	theme: (
		theme: Partial<
			{
				[TO in keyof B]: Partial<B[TO]>
			}
		>,
	) => ThemeRule
}

/* Output Styled Rule:
/* ========================================================================== */
interface _StyledRule<Variants, Conditions> {
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

// used an an alternative to _StyledRule
// acts as a simpler version of _StyledRule
type _SimpleStyledRule<A> = {
	[ruleSymbol]: true
	variants: A
}

/* Create Css function type:
/* ========================================================================== */

type CssFactory = <Conditions = {}, Theme = {}, Utils = {}, Prefix = ''>(
	_config: IConfig<Conditions, Theme, Utils, Prefix>,
) => TCss<Conditions, Theme, Utils>

declare const createCss: CssFactory
export default createCss
