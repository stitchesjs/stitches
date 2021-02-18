import * as React from 'react'
import { InternalCSS, LessInternalCSS, TConditions, TTheme, TStyledSheet, VariantsCall, IConfig, TThemeMap, CSSPropertiesToTokenScale, $variants, $conditions, StitchesExtractVariantsStyles, StrictMorphVariant } from '@stitches/core'

export * from '@stitches/core'

/** Private way to store the type without causing a TS panic: */
declare const $elm: unique symbol

/* Utils:
 * -----------------------------------------------------------------------------------------------*/
// abuse Pick to strip the call signature from ForwardRefExoticComponent
type IntrinsicElementsKeys = keyof JSX.IntrinsicElements
type ComponentInfer<T> = T extends IntrinsicElementsKeys | React.ComponentType<any> ? T : never

/* StitchesComponent:
 * -----------------------------------------------------------------------------------------------*/
// abuse Pick to strip the call signature from ForwardRefExoticComponent
type ForwardRefExoticBase<P> = Pick<React.ForwardRefExoticComponent<P>, keyof React.ForwardRefExoticComponent<any>>

export type IntrinsicElement<T extends React.ElementType, B = React.ElementRef<T>> = { [k in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[k] extends B ? k : never }[keyof HTMLElementTagNameMap]

export interface StitchesComponentWithAutoCompleteForJSXElements<DefaultElement extends string, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}>
	extends React.ForwardRefExoticComponent<
		Omit<React.ComponentPropsWithRef<ComponentInfer<DefaultElement>>, keyof Variants | 'css' | 'as'> & {
			css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
		} & VariantsCall<Variants, Conditions>
	> {
	// JSX elements have higher priority here when it comes to autocomplete
	<Elm extends IntrinsicElementsKeys = DefaultElement extends IntrinsicElementsKeys ? DefaultElement : never>(
		props: VariantsCall<Variants, Conditions> & { as: Elm } & Omit<JSX.IntrinsicElements[Elm], keyof Variants | 'css' | 'as'> & {
				css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
			},
	): JSX.Element

	// React component
	<As extends React.ComponentType = DefaultElement extends React.ComponentType ? DefaultElement : never>(
		props: VariantsCall<Variants, Conditions> & { as?: As } & Omit<React.ComponentPropsWithRef<As>, keyof Variants | 'css' | 'as'> & {
				css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
			},
	): JSX.Element

	toString(): string
	/**
	 * CSS Class associated with the current component.
	 *
	 * ```
	 *
	 * const Button = styled("button", { color: "DarkSlateGray" })
	 *
	 * <div className={Button.className} />
	 * ```
	 * <br />
	 */
	className: string
	/**
	 * CSS Selector associated with the current component.
	 *
	 * ```
	 *
	 * const Button = styled("button", { color: "DarkSlateGray" })
	 *
	 * const Card = styled("article", {
	 *   [Button.selector]: { boxShadow: "0 0 0 5px" }
	 * })
	 * ```
	 * <br />
	 */
	selector: string
	variants: Variants
	[$conditions]: Conditions
	[$elm]: DefaultElement
	[$variants]: Variants
}

export interface StitchesComponentWithAutoCompleteForReactComponents<DefaultElement, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}>
	extends React.ForwardRefExoticComponent<
		Omit<React.ComponentPropsWithRef<ComponentInfer<DefaultElement>>, keyof Variants | 'css' | 'as'> & {
			css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
		} & VariantsCall<Variants, Conditions>
	> {
	// React components have higher priority here for autocomplete
	<As extends React.ComponentType = DefaultElement extends React.ComponentType ? DefaultElement : never>(
		props: VariantsCall<Variants, Conditions> & { as?: As } & Omit<React.ComponentPropsWithRef<As>, keyof Variants | 'css' | 'as'> & {
				css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
			},
	): JSX.Element

	// JSX elements
	<Elm extends IntrinsicElementsKeys = DefaultElement extends IntrinsicElementsKeys ? DefaultElement : never>(
		props: VariantsCall<Variants, Conditions> & { as: Elm } & Omit<JSX.IntrinsicElements[Elm], keyof Variants | 'css' | 'as'> & {
				css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
			},
	): JSX.Element

	toString(): string
	/**
	 * CSS Class associated with the current component.
	 *
	 * ```
	 *
	 * const Button = styled("button", { color: "DarkSlateGray" })
	 *
	 * <div className={Button.className} />
	 * ```
	 * <br />
	 */
	className: string
	/**
	 * CSS Selector associated with the current component.
	 *
	 * ```
	 *
	 * const Button = styled("button", { color: "DarkSlateGray" })
	 *
	 * const Card = styled("article", {
	 *   [Button.selector]: { boxShadow: "0 0 0 5px" }
	 * })
	 * ```
	 * <br />
	 */
	selector: string
	variants: Variants
	[$conditions]: Conditions
	[$variants]: Variants
}

// export type NonIntrinsicElementProps<T extends React.ElementType> = IntrinsicElement<T> extends never ? React.ComponentProps<T> : Omit<React.ComponentProps<T>, keyof React.ComponentPropsWithoutRef<IntrinsicElement<T>>>

/* Styled instance:
 * -----------------------------------------------------------------------------------------------*/
export type StyledInstance<Conditions = {}, Theme extends TTheme = {}, Utils = {}, ThemeMap = {}> = {
	<E extends React.ElementType, Variants, CloneVariants extends Variants>(
		elm: E,
		// prettier-ignore
		styles: (
			(
				(
					LessInternalCSS<Conditions, Theme, Utils, ThemeMap>
					& {
						/** Unknown property. */
						[k in string]: unknown
					}
				)
				| Record<string, InternalCSS<Conditions, Theme, Utils, ThemeMap>>
			)
			& {
				variants?: { [k in keyof Variants]: { [b in keyof Variants[k]]: InternalCSS<Conditions, Theme, Utils, ThemeMap> } }
			}
			& {
						defaultVariants?: {
							[k in keyof CloneVariants]?: StrictMorphVariant<keyof CloneVariants[k]>
						}
					}
					& {
						compoundVariants?: (
							{
								[k in keyof CloneVariants]?: StrictMorphVariant<keyof CloneVariants[k]>
							}
							& {
								css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
							}
						)[]
					}
		),
	): E extends string
		? // jsx elements
		  StitchesComponentWithAutoCompleteForJSXElements<E, Variants & StitchesExtractVariantsStyles<E>, Conditions, Theme, Utils, ThemeMap>
		: // if it's a stitches component we reach in and pull its type to provide better types
		E extends { [$elm]: infer DeepStitchesComponentType }
		? StitchesComponentWithAutoCompleteForJSXElements<DeepStitchesComponentType, Variants & StitchesExtractVariantsStyles<E>, Conditions, Theme, Utils, ThemeMap>
		: // normal react component
		  StitchesComponentWithAutoCompleteForReactComponents<E, Variants & StitchesExtractVariantsStyles<E>, Conditions, Theme, Utils, ThemeMap>
} & ProxyStyledElements<Conditions, Theme, Utils, ThemeMap>

export type ProxyStyledElements<Conditions = {}, Theme extends TTheme = {}, Utils = {}, ThemeMap = {}> = {
	[ElKey in keyof JSX.IntrinsicElements]: <E extends React.ElementType = ElKey, Variants, CloneVariants extends Variants>(
		// prettier-ignore
		styled: (
			(
				(
					LessInternalCSS<Conditions, Theme, Utils, ThemeMap>
					& {
						/** Unknown property. */
						[k in string]: unknown
					}
				)
				| Record<string, InternalCSS<Conditions, Theme, Utils, ThemeMap>>
			)
			& {
				variants?: { [k in keyof Variants]: { [b in keyof Variants[k]]: InternalCSS<Conditions, Theme, Utils, ThemeMap> } }
			}
			& {
						defaultVariants?: {
							[k in keyof CloneVariants]?: StrictMorphVariant<keyof CloneVariants[k]>
						}
					}
					& {
						compoundVariants?: (
							{
								[k in keyof CloneVariants]?: StrictMorphVariant<keyof CloneVariants[k]>
							}
							& {
								css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
							}
						)[]
					}
		),
	) => E extends string
		? // jsx elements
		  StitchesComponentWithAutoCompleteForJSXElements<E, Variants & StitchesExtractVariantsStyles<E>, Conditions, Theme, Utils, ThemeMap>
		: // if it's a stitches component we reach in and pull its type to provide better types
		E extends { [$elm]: infer DeepStitchesComponentType }
		? StitchesComponentWithAutoCompleteForJSXElements<DeepStitchesComponentType, Variants & StitchesExtractVariantsStyles<E>, Conditions, Theme, Utils, ThemeMap>
		: // normal react component
		  StitchesComponentWithAutoCompleteForReactComponents<E, Variants & StitchesExtractVariantsStyles<E>, Conditions, Theme, Utils>
}

type ReactFactory = <Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = '', ThemeMap extends TThemeMap = CSSPropertiesToTokenScale>(
	_config?: IConfig<Conditions, Theme, Utils, Prefix, ThemeMap>,
) => TStyledSheet<Conditions, Theme, Utils, Prefix, ThemeMap> & {
	styled: StyledInstance<Conditions & { initial: '' }, Theme, Utils, ThemeMap>

	/**
	 * Returns all CSS applied to the stylesheet.
	 *
	 * ```
	 *
	 * <style>{toString()}</style>
	 * ```
	 * <br />
	 */
	getCssString(): string

	/**
	 * Returns all CSS applied to the stylesheet.
	 *
	 * ```
	 *
	 * <style>{toString()}</style>
	 * ```
	 * <br />
	 */
	toString(): string
}

declare const styled: ReactFactory

export { styled as default, styled as createCss }
