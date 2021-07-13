import type * as Default from './default'
import type * as React from 'react'
import type * as Util from './util'
import type * as CSSUtil from './css-util'

/** Returns a new Styled Component. */
export interface StyledComponent<
	TagName = 'span',
	Props = {},
	Media = Default.Media,
	Theme = {},
	ThemeMap = Default.ThemeMap,
	Utils = {}
> extends ForwardRefExoticComponent<TagName, Props> {
	<
		As extends
			| keyof JSX.IntrinsicElements
			| React.ComponentType<any> = IntrinsicElement<TagName>
	>(
		props: (
			As extends keyof JSX.IntrinsicElements
				? Util.Assign<JSX.IntrinsicElements[As], Partial<Props> & { as?: As, css?: CSSUtil.Style<Media, Theme, ThemeMap, Utils> }>
			: As extends React.ComponentType<infer P>
				? Util.Assign<P, Partial<Props> & { as?: As, css?: CSSUtil.Style<Media, Theme, ThemeMap, Utils> }>
			: never
		)
	): (
		React.ReactElement | null
	)

	[$$StyledComponentType]: TagName
	[$$StyledComponentProps]: Props
}

/** Returns a new Css Component. */
export interface CssComponent<
	TagName = 'span',
	Props = {},
	Media = Default.Media,
	Theme = {},
	ThemeMap = Default.ThemeMap,
	Utils = {}
> {
	(
		props: (
			& Partial<Props>
			& {
				css?: CSSUtil.Style<Media, Theme, ThemeMap, Utils>
			}
			& {
				[name in number | string]: any
			}
		)
	): {
		className: string
		selector: string
		props: object
	}

	className: string
	selector: string

	[$$StyledComponentType]: TagName
	[$$StyledComponentProps]: Props
}

/** Unique symbol used to reference the type of a Styled Component. */
export declare const $$StyledComponentType: unique symbol

/** Unique symbol used to reference the type of a Styled Component. */
export type $$StyledComponentType = typeof $$StyledComponentType

/** Unique symbol used to reference the props of a Styled Component. */
export declare const $$StyledComponentProps: unique symbol

/** Unique symbol used to reference the props of a Styled Component. */
export type $$StyledComponentProps = typeof $$StyledComponentProps

/** Returns a narrowed JSX element from the given tag name. */
type IntrinsicElement<TagName> = TagName extends keyof JSX.IntrinsicElements ? TagName : never

/** Returns a ForwardRef component. */
type ForwardRefExoticComponent<ElementType, Props> = React.ForwardRefExoticComponent<
	Util.Assign<ElementType extends React.ElementType ? React.ComponentPropsWithRef<ElementType> : never, Props & { as?: ElementType, css?: {} }>
>

/** Returns the first Styled Component type from the given array of compositions. */
type StyledComponentType<T extends any[]> = (
	T[0] extends never
		? 'span'
	: T[0] extends string
		? T[0]
	: T[0] extends { [$$StyledComponentType]: unknown }
		? T[0][$$StyledComponentType]
	: T extends [lead: any, ...tail: infer V]
		? StyledComponentType<V>
	: never
)

/** Returns the cumulative variants from the given array of compositions. */
type StyledComponentProps<T extends any[]> = (
	& (
		$$StyledComponentProps extends keyof T[0]
			? T[0][$$StyledComponentProps]
		: T[0] extends { variants: { [name: string]: unknown } }
			? {
				[K in keyof T[0]['variants']]?: Util.Widen<keyof T[0]['variants'][K]>
			}
		: {}
	)
	& (
		T extends [lead: any, ...tail: infer V]
			? StyledComponentProps<V>
		: {}
	)
)
