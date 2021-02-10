import { Properties } from './css-types'

export type CSSPropertiesToTokenScale = {
	gap: 'space'
	gridGap: 'space'
	columnGap: 'space'
	gridColumnGap: 'space'
	rowGap: 'space'
	gridRowGap: 'space'
	inset: 'space'
	insetBlock: 'space'
	insetBlockEnd: 'space'
	insetBlockStart: 'space'
	insetInline: 'space'
	insetInlineEnd: 'space'
	insetInlineStart: 'space'
	margin: 'space'
	marginTop: 'space'
	marginRight: 'space'
	marginBottom: 'space'
	marginLeft: 'space'
	marginBlock: 'space'
	marginBlockEnd: 'space'
	marginBlockStart: 'space'
	marginInline: 'space'
	marginInlineEnd: 'space'
	marginInlineStart: 'space'
	padding: 'space'
	paddingTop: 'space'
	paddingRight: 'space'
	paddingBottom: 'space'
	paddingLeft: 'space'
	paddingBlock: 'space'
	paddingBlockEnd: 'space'
	paddingBlockStart: 'space'
	paddingInline: 'space'
	paddingInlineEnd: 'space'
	paddingInlineStart: 'space'
	top: 'space'
	right: 'space'
	bottom: 'space'
	left: 'space'
	fontSize: 'fontSizes'
	background: 'colors'
	backgroundColor: 'colors'
	backgroundImage: 'colors'
	border: 'colors'
	borderColor: 'colors'
	borderTopColor: 'colors'
	borderRightColor: 'colors'
	borderBottomColor: 'colors'
	borderLeftColor: 'colors'
	caretColor: 'colors'
	color: 'colors'
	columnRuleColor: 'colors'
	outlineColor: 'colors'
	fill: 'colors'
	stroke: 'colors'
	fontFamily: 'fonts'
	fontWeight: 'fontWeights'
	lineHeight: 'lineHeights'
	letterSpacing: 'letterSpacings'
	blockSize: 'sizes'
	minBlockSize: 'sizes'
	maxBlockSize: 'sizes'
	inlineSize: 'sizes'
	minInlineSize: 'sizes'
	maxInlineSize: 'sizes'
	width: 'sizes'
	minWidth: 'sizes'
	maxWidth: 'sizes'
	height: 'sizes'
	minHeight: 'sizes'
	maxHeight: 'sizes'
	flexBasis: 'sizes'
	borderWidth: 'borderWidths'
	borderTopWidth: 'borderWidths'
	borderLeftWidth: 'borderWidths'
	borderRightWidth: 'borderWidths'
	borderBottomWidth: 'borderWidths'
	borderStyle: 'borderStyles'
	borderTopStyle: 'borderStyles'
	borderLeftStyle: 'borderStyles'
	borderRightStyle: 'borderStyles'
	borderBottomStyle: 'borderStyles'
	borderRadius: 'radii'
	borderTopLeftRadius: 'radii'
	borderTopRightRadius: 'radii'
	borderBottomRightRadius: 'radii'
	borderBottomLeftRadius: 'radii'
	boxShadow: 'shadows'
	textShadow: 'shadows'
	zIndex: 'zIndices'
	transition: 'transitions'
}

export declare const defaultThemeMap: CSSPropertiesToTokenScale

type StyledSheetCallback = (...cssText: string[]) => void

interface GlobalRule {
	(): void
}

interface ThemeRule {
	toString(): string
	className: string
	cssText: string
	root: string
}
interface StyledExpression {
	(): string
	toString(): string
	className: string
	classNames: string[]
	props: any
	selector: string
}

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
export type TThemeMap = { [k in keyof Properties]?: keyof EmptyTheme }
/** Configuration of Stitches, including a default theme, prefix, custom conditions, and functional properties. */
export interface IConfig<Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = '', ThemeMap = {}> {
	conditions?: {
		[k in keyof Conditions]?: Conditions[k]
	}
	theme?: {
		[k in keyof Theme]: k extends keyof EmptyTheme ? Theme[k] : never
	} &
		{
			[k in keyof EmptyTheme]?: k extends keyof Theme ? Theme[k] : never
		}
	utils?: {
		[k in keyof Utils]: (theme: Theme) => (value: Utils[k]) => InternalCSS<Conditions, Theme, Utils, true, ThemeMap>
	}
	themeMap?: { [k in keyof ThemeMap]?: ThemeMap[k] }
	prefix?: Prefix
	onGlobal?: StyledSheetCallback
	onStyled?: StyledSheetCallback
	onThemed?: StyledSheetCallback
}

interface InternalConfig<Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = '', ThemeMap = {}> {
	conditions: Conditions
	theme: Theme
	utils: {
		[k in keyof Utils]: (theme: Theme) => (value: Utils[k]) => InternalCSS<Conditions, Theme, Utils, true, ThemeMap>
	}
	themeMap: ThemeMap
	prefix: Prefix
}

type MapUtils<T> = { [k in keyof T]: T[k] extends (theme: any) => (value: infer V) => any ? V : never }

/* Css typed structure:
/* ========================================================================== */

// prettier-ignore
export type InternalCSS<
  Conditions = {},
  Theme extends TTheme = {},
  Utils = {},
  AllowNesting = true,
	ThemeMap extends { [k in keyof Properties]?: keyof Theme } = CSSPropertiesToTokenScale
> = 
  & {[k in keyof Properties]? : (ThemeMap[k] extends keyof Theme ? `$${Extract<keyof Theme[ThemeMap[k]], string>}` : never)  | Properties[k]  }
	& { 
		/** Responsive variants: */
		when?: { [k in keyof Conditions]?: InternalCSS<Conditions, Theme, Utils, AllowNesting, ThemeMap> } } 
  & { [k in keyof Utils]?: Utils[k] }
  & { [k in string]?: AllowNesting extends true ? InternalCSS<Conditions, Theme, Utils, AllowNesting, ThemeMap> | number | string | {[k: string]: {[b: string]: any}}  : never }

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
export interface TStyledSheet<A extends TConditions = {}, B extends TTheme = {}, C = {}, D = '', ThemeMap = {}> {
	/** Returns a new styled rule. */
	<Vars extends any[]>(
		...styles: {
			[k in keyof Vars]: {
				/** your variants */
				variants?: Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: InternalCSS<A, B, C> } }
			} & { defaultVariants?: { [a in keyof Vars[k]]?: keyof Vars[k][a] } } & { compoundVariants?: { [a in keyof Vars[k]]?: keyof Vars[k][a] } & { css?: InternalCSS<A, B, C, true, ThemeMap> } } & InternalCSS<A, B, C, true, ThemeMap>
		}
	): IStyledRule<InferRestVariants<Vars>, A, B, C, ThemeMap>

	/** Generates CSS from global rules and returns a function which applies them to the sheet.  */
	global: (definition: Record<string, InternalCSS<A, B, C, true, ThemeMap>>) => GlobalRule

	/** Generates CSS from theme scales and returns a function which applies them to the sheet.  */
	theme: {
		(
			theme: Partial<
				{
					[TO in keyof B]: Partial<B[TO]>
				}
			>,
		): ThemeRule

		(
			themeName: string,
			theme: Partial<
				{
					[TO in keyof B]: Partial<B[TO]>
				}
			>,
		): ThemeRule
	} & B
	config: InternalConfig<A, B, C, D, ThemeMap>
	css: {
		<Vars extends any[]>(
			...styles: {
				[k in keyof Vars]: {
					variants?: Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: InternalCSS<A, B, C, true, ThemeMap> } }
				} & { defaultVariants: { [a in keyof Vars[k]]?: keyof Vars[k][a] } } & { compoundVariants?: { [a in keyof Vars[k]]?: keyof Vars[k][a] } & { css?: InternalCSS<A, B, C, true, ThemeMap> } } & InternalCSS<A, B, C, true, ThemeMap>
			}
		): IStyledRule<InferRestVariants<Vars>, A, B, C, ThemeMap>
	}

	keyframes: (definition: Record<string, InternalCSS<A, B, C, false, ThemeMap>>) => GlobalRule

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
type CastNumberToString<T> = T extends number ? `${T}` | T : T

export type VariantsCall<Variants, Conditions> = {
	[k in keyof Variants]?: CastNumberToString<keyof Variants[k]> | { [I in keyof Conditions]?: CastNumberToString<keyof Variants[k]> }
}

/** Extracts the css type from the  */
export type StitchesCss<T> = T extends { config: { conditions: infer Conditions; theme: infer Theme; utils: infer Utils; themeMap: infer ThemeMap } } ? InternalCSS<Conditions, Theme, MapUtils<Utils>, true, ThemeMap> : never

/* Output Styled Rule:
/* ========================================================================== */
interface IStyledRule<Variants, Conditions, Theme, Utils, ThemeMap> {
	//
	(init?: VariantsCall<Variants, Conditions> & { css?: InternalCSS<Conditions, Theme, Utils, true, ThemeMap>; className?: string }): StyledExpression & string
	toString(): string
	className: string
	classNames: string[]
	selector: string
	variants: Variants
}

/* Create Css function type:
/* ========================================================================== */

type TStyledSheetFactory = <Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = '', ThemeMap extends TThemeMap = CSSPropertiesToTokenScale>(
	_config?: IConfig<Conditions, Theme, Utils, Prefix, ThemeMap>,
) => TStyledSheet<Conditions & { initial: '' }, Theme, Utils, Prefix, ThemeMap>

declare const styled: TStyledSheetFactory
export default styled
