import * as React from 'react'
import { StitchesCSS, TConditions, TTheme, TStyledSheet, VariantsCall, TStyledSheetFactory, IConfig } from '@stitches/core'

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

export interface StitchesComponent<DefaultElement, Variants = {}, Conditions = {}, Theme = {}, Utils = {}>
	extends React.ForwardRefExoticComponent<
		Omit<React.ComponentPropsWithRef<DefaultElement>, keyof Variants | 'css' | 'as'> & {
			css?: StitchesCSS<Conditions, Theme, Utils>
		} & VariantsCall<Variants, Conditions>
	> {
	(
		props: { as?:'a' } & Omit<React.ComponentPropsWithRef<'a'>, keyof Variants | 'css' | 'as'> & {
				css?: StitchesCSS<Conditions, Theme, Utils>
			} & VariantsCall<Variants, Conditions>,
	): JSX.Element

	<As extends React.ComponentType>(
		props: { as?: As } & Omit<React.ComponentPropsWithRef<As>, keyof Variants | 'css' | 'as'> & {
				css?: StitchesCSS<Conditions, Theme, Utils>
			} & VariantsCall<Variants, Conditions>,
	): JSX.Element
}

/* Styled instance:
 * -----------------------------------------------------------------------------------------------*/
export type StyledInstance<Conditions = {}, Theme extends TTheme = {}, Utils = {}> = {
	<E extends React.ElementType, Variants>(
		elm: E,
		styles: StitchesCSS<Conditions, Theme, Utils> & {
			variants?: { [k in keyof Variants]: { [b in keyof Variants[k]]: StitchesCSS<Conditions, Theme, Utils> } }
		},
	): StitchesComponent<E, Variants & ExtractVariantsFromComponent<E>, Conditions, Theme, Utils>
}

type ReactFactory = <Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = ''>(
	_config?: IConfig<Conditions, Theme, Utils, Prefix>,
) => TStyledSheet<Conditions, Theme, Utils> & { styled: StyledInstance<Conditions, Theme, Utils> }

export type IntrinsicElement<T, B = React.ElementRef<T>> = { [k in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[k] extends B ? k : never }[keyof HTMLElementTagNameMap]

export type NonIntrinsicElementProps<T> = IntrinsicElement<T> extends never ? React.ComponentProps<T> : Omit<React.ComponentProps<T>, keyof React.ComponentProps<IntrinsicElement<T>>>

declare const styled: ReactFactory
export default styled
