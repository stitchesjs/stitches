import * as React from 'react'
import { InternalCSS, LessInternalCSS, TConditions, TTheme, TStyledSheet, VariantsCall, IConfig, TThemeMap, CSSPropertiesToTokenScale, $variants, $conditions, StitchesExtractVariantsStyles } from '@stitches/core'

export * from '@stitches/core'

export interface PolymorphicForwardRef<DefaultElement, Props> extends ForwardRefExoticBase<IntrinsicElementPolymorphicPropsWithAs<DefaultElement, Props>> {
	<JSXElm extends string>(props: IntrinsicElementPolymorphicPropsWithAs<JSXElm, Props>): JSX.Element
	<Component extends React.ComponentType>(props: ReactComponentPolymorphicPropsWithAs<Component, Props>): JSX.Element
	(props: IntrinsicElementPolymorphicPropsWithAs<DefaultElement, Props>): JSX.Element
}

type IntrinsicElementPolymorphicPropsWithAs<Elm, Props> = { as: Elm } & Omit<JSX.IntrinsicElements[Elm extends keyof JSX.IntrinsicElements ? Elm : never], keyof Props> & Props
type ReactComponentPolymorphicPropsWithAs<Elm, Props> = { as: Elm } & Omit<React.ComponentPropsWithRef<Elm extends React.ComponentType ? Elm : never>, keyof Props> & Props

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

export interface StitchesComponent<DefaultElement, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}>
	extends ForwardRefExoticBase<
		Omit<React.ComponentPropsWithRef<ComponentInfer<DefaultElement>>, keyof Variants | 'css' | 'as'> & {
			css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
		} & VariantsCall<Variants, Conditions>
	> {
	<Elm extends string>(
		props: VariantsCall<Variants, Conditions> & { as: Elm } & Omit<JSX.IntrinsicElements[Elm extends IntrinsicElementsKeys ? Elm : never], keyof Variants | 'css' | 'as'> & {
				css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
			},
	): JSX.Element
	<As extends React.ComponentType>(
		props: VariantsCall<Variants, Conditions> & { as?: As } & Omit<React.ComponentPropsWithRef<ComponentInfer<As>>, keyof Variants | 'css' | 'as'> & {
				css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
			},
	): JSX.Element
	<As>(
		props: VariantsCall<Variants, Conditions> & { as?: As } & Omit<React.ComponentPropsWithRef<ComponentInfer<As>>, keyof Variants | 'css' | 'as'> & {
				css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
			},
	): JSX.Element
	(
		props: VariantsCall<Variants, Conditions> & { as?: DefaultElement } & Omit<React.ComponentPropsWithRef<ComponentInfer<DefaultElement>>, keyof Variants | 'css' | 'as'> & {
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

type NativeStitchesPropsWithAs<Elm extends string, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}> = VariantsCall<Variants, Conditions> & { as: Elm } & Omit<
		JSX.IntrinsicElements[Elm extends IntrinsicElementsKeys ? Elm : never],
		keyof Variants | 'css' | 'as'
	> & {
		css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
	}
type StitchesPropsWithAs<Elm extends React.ElementType, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}> = VariantsCall<Variants, Conditions> & { as: Elm } & Omit<
		React.ComponentPropsWithRef<Elm>,
		keyof Variants | 'css' | 'as'
	> & {
		css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
	}

// export type NonIntrinsicElementProps<T extends React.ElementType> = IntrinsicElement<T> extends never ? React.ComponentProps<T> : Omit<React.ComponentProps<T>, keyof React.ComponentPropsWithoutRef<IntrinsicElement<T>>>

/* Styled instance:
 * -----------------------------------------------------------------------------------------------*/
export type StyledInstance<Conditions = {}, Theme extends TTheme = {}, Utils = {}, ThemeMap = {}> = {
	<E extends React.ElementType, Variants, CloneVariants extends Variants>(
		elm: ComponentInfer<E>,
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
							[k in keyof CloneVariants]?: keyof CloneVariants[k]
						}
					}
					& {
						compoundVariants?: (
							{
								[k in keyof CloneVariants]?: keyof CloneVariants[k]
							}
							& {
								css?: InternalCSS<Conditions, Theme, Utils, ThemeMap>
							}
						)[]
					}
		),
	): StitchesComponent<E, Variants & StitchesExtractVariantsStyles<E>, Conditions, Theme, Utils>
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
