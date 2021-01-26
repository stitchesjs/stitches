import { Properties } from './css-types'
import { cssPropToTokenMap } from './cssPropToTokenMap'

// just using it as a unique identifier for rule types
const ruleSymbol = Symbol('')

type CSSPropertiesToTokenScale = typeof cssPropToTokenMap

/* Config:
/* ========================================================================== */

// Just used as a keyof target for the config
// for some weird reason, autocomplete stops working
// if we try to pre compute the keys or use a union
type EmptyTheme = {
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

export type TConditions = { [k: string]: string }
export type TTheme = { [k in keyof EmptyTheme]?: { [b: string]: string } }

/** Configuration of Stitches, including a default theme, prefix, custom conditions, and functional properties. */
export interface IConfig<Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = ''> {
	conditions?: {
		[k in keyof Conditions]?: Conditions[k]
	}
	theme?: {
		[k in keyof Theme]: k extends keyof EmptyTheme ? Theme[k] : never
	} &
		{
			[k in keyof EmptyTheme]?: k extends keyof Theme ? Theme[k] : never
		}
	properties?: {
		[k in keyof Utils]: (a: Utils[k]) => StitchesCSS<Conditions, Theme, Utils>
	}
	prefix?: Prefix
	onGlobal?: StyledSheetCallback
	onStyled?: StyledSheetCallback
	onThemed?: StyledSheetCallback
}

/* Css typed structure:
/* ========================================================================== */

// prettier-ignore
export type StitchesCSS<
  Conditions = {},
  Theme extends TTheme = {},
  Utils = {},
  AllowNesting = true
> = { [k in keyof Properties]?: k extends keyof CSSPropertiesToTokenScale ? CSSPropertiesToTokenScale[k] extends keyof Theme ?  `$${Extract<keyof Theme[CSSPropertiesToTokenScale[k]], string>}` | Properties[k]: Properties[k] : Properties[k]}
  & { [k in keyof Conditions as `when$${Extract<keyof Conditions, string>}`]?: StitchesCSS<Conditions, Theme, Utils, AllowNesting>; }
  & { [k in keyof Utils]?: Utils[k] }
  & { [k in string]?: AllowNesting extends true ? StitchesCSS<Conditions, Theme, Utils, AllowNesting> | string | number : {} }

/* Utils to type and extract variants from args args:
/* ========================================================================== */

/** Combines rest parameter variants into one: */
type InferRestVariants<Args extends any[]> = Args[0] & (HasTail<Args> extends true ? InferRestVariants<Tail<Args>> : {})

/* Check if current array has a tail: */
type HasTail<T extends any[]> = T extends [] | [any] ? false : true

/* Return the tail of an array: */
type Tail<T extends any[]> = ((...t: T) => any) extends (_: any, ...tail: infer _Tail) => any ? _Tail : []

/* Css Instance Type:
/* ========================================================================== */
export interface _StyledSheet<A extends TConditions = {}, B extends TTheme = {}, C = {}> {
	/** Returns a new styled rule. */
	<Vars extends any[]>(
		...styles: {
			[k in keyof Vars]:
				| ({
						variants?: Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: StitchesCSS<A, B, C> } }
				  } & StitchesCSS<A, B, C>)
				| _SimpleStyledRule<Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: StitchesCSS<A, B, C> } }>
		}
	): _StyledRule<InferRestVariants<Vars>, A>

	/** Generates CSS from global rules and returns a function which applies them to the sheet.  */
	global: (definition: Record<string, StitchesCSS<A, B, C>>) => GlobalRule

	/** Generates CSS from theme scales and returns a function which applies them to the sheet.  */
	theme: {
		(
			theme: Partial<
				{
					[TO in keyof B]: Partial<B[TO]>
				}
			>,
		): ThemeRule
	} & B

	css: {
		<Vars extends any[]>(
			...styles: {
				[k in keyof Vars]:
					| ({
							variants?: Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: StitchesCSS<A, B, C> } }
					  } & StitchesCSS<A, B, C>)
					| _SimpleStyledRule<Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: StitchesCSS<A, B, C> } }>
			}
		): _StyledRule<InferRestVariants<Vars>, A>
	}

	/** Clears all CSS rules from the sheet.  */
	clear(): void

	/** Returns all of the CSS applied to the sheet.  */
	toString(): string

	/** Conditions in which CSS would be applied. */
	conditions: A

	/** Functional properties whose values can be expanded into other properties. */
	properties: C

	/** Prefix applied to all styled and themed rules. */
	prefix: string
}

export type VariantsCall<Variants, Conditions> = {
	[k in keyof Variants]?:
		| keyof Variants[k]
		| { [I in keyof Conditions as `when$${Extract<keyof Conditions, string>}`]?: keyof Variants[k] }
}

/* Output Styled Rule:
/* ========================================================================== */
interface _StyledRule<Variants, Conditions> {
	(init?: VariantsCall<Variants, Conditions>): StyledExpression
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

export type _StyledSheetFactory = <
	Conditions extends TConditions = {},
	Theme extends TTheme = {},
	Utils = {},
	Prefix = ''
>(
	_config?: IConfig<Conditions, Theme, Utils, Prefix>,
) => _StyledSheet<Conditions, Theme, Utils>
