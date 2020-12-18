import * as React from 'react'
import { StitchesCSS, TConditions, TTheme, _StyledSheet, VariantsCall } from '@stitches/core'

/* Utils:
 * -----------------------------------------------------------------------------------------------*/
type IntrinsicElementsKeys = keyof JSX.IntrinsicElements
type ComponentInfer<T> = T extends IntrinsicElementsKeys | React.ComponentType<any> ? T : never
type ExtractVariantsFromComponent<T> = T extends StitchesComponent<any, infer V, any> ? V : {}

/* Base props:
 * -----------------------------------------------------------------------------------------------*/
type StitchesBaseProps<Elm extends any, Props = {}, Variants = {}> = Omit<
	React.ComponentPropsWithRef<ComponentInfer<Elm>>,
	keyof Props
> &
	Props & { as?: Elm } & VariantsCall<Variants, Conditions>

/* StitchesComponent:
 * -----------------------------------------------------------------------------------------------*/

export interface StitchesComponent<DefaultElement extends any, Props = {}, Variants = {}>
	extends React.ForwardRefExoticComponent<StitchesBaseProps<DefaultElement, Props, Variants>> {
	<As = DefaultElement>(
		props: { as: As | React.ElementType | IntrinsicElementsKeys } & StitchesBaseProps<As, Props, Variants>,
	): JSX.Element
}

/* Styled instance:
 * -----------------------------------------------------------------------------------------------*/
export type StyledInstance<Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}> = {
	<E extends React.ElementType, Variants>(
		elm: E,
		styles: StitchesCSS<Conditions, Theme, Utils> & {
			variants?: { [k in keyof Variants]: { [b in keyof Variants[k]]: StitchesCSS<Conditions, Theme, Utils> } }
		},
	): StitchesComponent<E, { css?: StitchesCSS<Conditions, Theme, Utils> }, Variants & ExtractVariantsFromComponent<E>>
}
