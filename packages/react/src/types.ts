import * as React from 'react'
import {
	StitchesCSS,
	TConditions,
	TTheme,
	_StyledSheet,
	VariantsCall,
	_StyledSheetFactory,
	IConfig,
} from '@stitches/core'

/* Utils:
 * -----------------------------------------------------------------------------------------------*/
// abuse Pick to strip the call signature from ForwardRefExoticComponent
type IntrinsicElementsKeys = keyof JSX.IntrinsicElements
type ComponentInfer<T> = T extends IntrinsicElementsKeys | React.ComponentType<any> ? T : never
export type ExtractVariantsFromComponent<T> = T extends StitchesComponent<any, infer V> ? V : {}

/* Base props:
 * -----------------------------------------------------------------------------------------------*/

type StitchesBaseProps<Elm, AS = Elm, Variants = {}, Conditions = {}, Theme = {}, Utils = {}> = Omit<
	React.ComponentPropsWithRef<ComponentInfer<AS>>,
	keyof Variants | 'css' | 'as'
> & {
	css?: StitchesCSS<Conditions, Theme, Utils>
} & VariantsCall<Variants, Conditions> & { as?: ComponentInfer<AS> }
/* StitchesComponent:
 * -----------------------------------------------------------------------------------------------*/

export interface StitchesComponent<DefaultElement, Variants = {}, Conditions = {}, Theme = {}, Utils = {}>
	extends React.ForwardRefExoticComponent<
		StitchesBaseProps<DefaultElement, DefaultElement, Variants, Conditions, Theme, Utils>
	> {
	<As>(props: StitchesBaseProps<DefaultElement, As, Variants, Conditions, Theme, Utils>): any
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

export declare type ReactFactory = <
	Conditions extends TConditions = {},
	Theme extends TTheme = {},
	Utils = {},
	Prefix = ''
>(
	_config?: IConfig<Conditions, Theme, Utils, Prefix>,
) => _StyledSheet<Conditions, Theme, Utils> & { styled: StyledInstance<Conditions, Theme, Utils> }
