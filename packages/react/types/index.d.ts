import * as React from 'react'
import { InternalCSS, TConditions, TTheme, TStyledSheet, VariantsCall, IConfig, TThemeMap, CSSPropertiesToTokenScale } from '@stitches/core'

/* Utils:
 * -----------------------------------------------------------------------------------------------*/
// abuse Pick to strip the call signature from ForwardRefExoticComponent
type IntrinsicElementsKeys = keyof JSX.IntrinsicElements
type ComponentInfer<T> = T extends IntrinsicElementsKeys | React.ComponentType<any> ? T : never
export type ExtractVariantsFromComponent<T> = T extends StitchesComponent<any, infer V> ? V : {}

/* StitchesComponent:
 * -----------------------------------------------------------------------------------------------*/
// abuse Pick to strip the call signature from ForwardRefExoticComponent
type ForwardRefExoticBase<P> = Pick<React.ForwardRefExoticComponent<P>, keyof React.ForwardRefExoticComponent<any>>

export interface StitchesComponent<DefaultElement extends React.ElementType, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}>
	extends ForwardRefExoticBase<
		Omit<React.ComponentPropsWithRef<DefaultElement>, keyof Variants | 'css' | 'as'> & {
			css?: InternalCSS<Conditions, Theme, Utils, true, ThemeMap>
		} & VariantsCall<Variants, Conditions>
	> {
	/** TODO: Decide which and how many elements we want to give their own overload */
	(props: StitchesPropsWithAs<'div', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'code', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'pre', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'span', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'a', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'p', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'li', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'ul', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'image', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'table', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'td', Variants, Conditions, Theme, Utils>): JSX.Element
	(props: StitchesPropsWithAs<'tr', Variants, Conditions, Theme, Utils>): JSX.Element
	<As extends React.ComponentType>(props: StitchesPropsWithAs<As, Variants, Conditions, Theme, Utils>): JSX.Element
	(
		props: VariantsCall<Variants, Conditions> & { as?: DefaultElement } & React.ComponentPropsWithRef<DefaultElement> & {
				css?: InternalCSS<Conditions, Theme, Utils, true, ThemeMap>
			},
	): JSX.Element
}

export type StitchesProps<Elm extends React.ElementType, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}> = VariantsCall<Variants, Conditions> &
	Omit<React.ComponentPropsWithRef<Elm>, keyof Variants | 'css'> & {
		css?: InternalCSS<Conditions, Theme, Utils, true, ThemeMap>
	}

type StitchesPropsWithAs<Elm extends React.ElementType, Variants = {}, Conditions = {}, Theme = {}, Utils = {}, ThemeMap = {}> = VariantsCall<Variants, Conditions> & { as: Elm } & Omit<
		React.ComponentPropsWithRef<Elm>,
		keyof Variants | 'css'
	> & {
		css?: InternalCSS<Conditions, Theme, Utils, true, ThemeMap>
	}

export type IntrinsicElement<T extends React.ElementType, B = React.ElementRef<T>> = { [k in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[k] extends B ? k : never }[keyof HTMLElementTagNameMap]

// export type NonIntrinsicElementProps<T extends React.ElementType> = IntrinsicElement<T> extends never ? React.ComponentProps<T> : Omit<React.ComponentProps<T>, keyof React.ComponentPropsWithoutRef<IntrinsicElement<T>>>

/* Styled instance:
 * -----------------------------------------------------------------------------------------------*/
export type StyledInstance<Conditions = {}, Theme extends TTheme = {}, Utils = {}, ThemeMap = {}> = {
	<E extends React.ElementType, Variants>(
		elm: ComponentInfer<E>,
		styles: InternalCSS<Conditions, Theme, Utils, true, ThemeMap> & {
			variants?: { [k in keyof Variants]: { [b in keyof Variants[k]]: InternalCSS<Conditions, Theme, Utils, true, ThemeMap> } }
		},
	): StitchesComponent<E, Variants & ExtractVariantsFromComponent<E>, Conditions, Theme, Utils>
}

type ReactFactory = <Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = '', ThemeMap extends TThemeMap = CSSPropertiesToTokenScale>(
	_config?: IConfig<Conditions, Theme, Utils, Prefix, ThemeMap>,
) => TStyledSheet<Conditions, Theme, Utils> & { styled: StyledInstance<Conditions & { initial: '' }, Theme, Utils, ThemeMap> } 

declare const styled: ReactFactory
export default styled
