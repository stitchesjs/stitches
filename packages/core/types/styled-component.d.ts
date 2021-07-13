import type * as Default from './default'
import type * as Util from './util'
import type * as CSSUtil from './css-util'

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
	T[0] extends { [$$StyledComponentProps]: unknown }
		? T[0][$$StyledComponentProps]
	: T[0] extends { variants: { [name: string]: unknown } }
		? {
			[K in keyof T[0]['variants']]: Util.Widen<keyof T[0]['variants'][K]>
		}
	: {}
) | (
	T extends [lead: any, ...tail: infer V]
		? StyledComponentProps<V>
	: never
)
