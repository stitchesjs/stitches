import { Globals, OnlyObject, OnlyNumber, OnlyString, OnlyStringNumeric, Properties } from './css'
import * as Default from './default'
import * as Theme from './theme'

/* ========================================================================== */

export * from './css'

/* ========================================================================== */

/** Returns the given value narrowed to its nearest type. */
export type NarrowValue<T> = (
	T extends [] ? [] : never
) | (
	T extends bigint | boolean | number | string | symbol ? T : never
) | NarrowObject<T>

/** Returns the given object with its values narrowed to their nearest type. */
export type NarrowObject<T> = {
	[K in keyof T]: (
		T[K] extends Function
			? T[K]
		: NarrowValue<T[K]>
	)
}

/** Returns the given value widened to include looser versions of its value. */
type Widen<T> = T extends number ? `${T}` | T : T extends 'true' ? boolean | T : T extends 'false' ? boolean | T : T extends `${number}` ? number | T : T

/** Returns the given value with the given keys omitted from typing. */
type OmitKey<T, U extends keyof any> = T & { [P in U]?: unknown }

/** Returns the first parameter of the given function. */
type Parameter0<T> = T extends (arg: infer P) => any ? P : never

/** Returns a string with the given prefix followed by the given values. */
type Prefixed<K extends string, T> = `${K}${Extract<T, index>}`

/** Returns a value of the given object using the given key. */
type Value<T, K> = T[Extract<K, keyof T>]

/** Object index (number or string). */
type index = number | string

/* ========================================================================== */

interface ConfigShape {
	prefix?: string
	media?: {
		[name in index]: string
	}
	theme?: {
		[scale in string]: {
			[token in index]: number | string
		}
	}
	themeMap?: {
		[property in string]: string
	}
	utils?: {
		[property in index]: (value: any) => ({
			[property in keyof Properties]: unknown
		} & {
			[property in string]: unknown
		})
	}
}

export interface Config<ConfigType extends ConfigShape> {
	prefix: ConfigType['prefix'] extends string ? ConfigType['prefix'] : ''
	media: ConfigType['media'] extends object ? { all: 'all' } & ConfigType['media'] : { all: 'all' }
	theme: ConfigType['theme'] extends object ? ConfigType['theme'] : {}
	themeMap: ConfigType['themeMap'] extends object ? ConfigType['themeMap'] : Default.ThemeMap
	utils: ConfigType['utils'] extends object ? ConfigType['utils'] : {}
}

/* ========================================================================== */

export namespace Stitches {
	type PropertyValue<K extends keyof Properties> = { readonly [PrivatePropertyValue]: K }

	type TokenValue<K> = { readonly [PrivateTokenValue]: K }
}

declare const PrivatePropertyValue: unique symbol

type PrivatePropertyValue = typeof PrivatePropertyValue

declare const PrivateTokenValue: unique symbol

type PrivateTokenValue = typeof PrivateTokenValue

/* ========================================================================== */

type Style<C extends Config<ConfigShape>> = (
	& {
		[K in keyof Properties]?: (
			| Globals
			| Properties[K]
			| Prefixed<
				'$',
				keyof Value<
					C['theme'],
					Value<
						C['themeMap'],
						K
					>
				>
			>
		)
	}
	& {
		[K in keyof C['utils']]?: (
			| (
				PrivateTokenValue extends keyof Parameter0<C['utils'][K]>
					? Prefixed<
						'$',
						keyof Value<
							C['theme'],
							Parameter0<C['utils'][K]>[PrivateTokenValue]
						>
					>
				: never
			)
			| (
				PrivatePropertyValue extends keyof Parameter0<C['utils'][K]>
					?
					| Globals
					| Value<
						Properties,
						Parameter0<C['utils'][K]>[PrivatePropertyValue]
					>
					| Prefixed<
						'$',
						keyof Value<
							C['theme'],
							Value<
								C['themeMap'],
								Parameter0<C['utils'][K]>[PrivatePropertyValue]
							>
						>
					>
				: never
			)
			| Omit<OnlyStringNumeric, ''>
		)
	}
	& {
		[K in Prefixed<'@', keyof C['media']>]?: Style<C>
	}
	& {
		[K in index]: index | Style<C> | unknown[]
	}
)

/* ========================================================================== */

export interface CreatedCss<
	C extends Config<ConfigShape>
> {
	/** Normalized configuration of the current library. */
	config: C

	/** Returns a function that applies global styles. */
	global: {
		(
			rules: {
				[selectors: string]: Style<C>
			}
		): () => {}
	}

	/** Returns an object that applies `@keyframes` styles. */
	keyframes: {
		(
			rules: {
				[offsets: string]: Style<C>
			}
		): () => {}
	}

	/** Returns an object of theme tokens that apply a specific theme. */
	theme: {
		<ThemeArg extends {
			[Scale in keyof C['theme']]?: {
				[Token in keyof C['theme'][Scale]]: OnlyStringNumeric
			}
		}>(
			theme: NarrowObject<ThemeArg>
		): {
			className: string
			selector: string
		} & Theme.Tokens<ThemeArg, C['prefix']>
	} & Theme.Tokens<C['theme'], C['prefix']>

	/** Returns a function that applies styles and variants for a specific class. */
	css: {
		<
			Variants extends {
				[name in string]: {
					[pair in index]: Style<C>
				}
			},
			Args extends Variants[]
		>(
			...composers: {
				[K in keyof Args]:
				| {
					[$$VARIANTS]: Args[K][]
				}
				| (
					& OmitKey<Style<C>, 'variants'>
					& {
						/**
						 * Variants configure conditional styles of the component.
						 *
						 * @see https://stitches.dev/docs/variants
						 */
						variants?: Args[K] | Variants,
						compoundVariants?: (
							& {
								[Name in Exclude<keyof Args[K], 'css'>]?: Widen<keyof Args[K][Name]>
							}
							& {
								[name in Exclude<index, keyof Args[K] | 'css'>]: any
							}
							& {
								css: Style<C>
							}
						)[],
						defaultVariants?: {
							[Name in keyof Args[K]]?: Widen<keyof Args[K][Name]>
						},
					}
				)
			}
		): /** Component */ (
			<T extends OmitKey<
				(
					& {
						[K in keyof Args[0]]?: Widen<keyof Args[0][K]>
					}
					& {
						[K in Exclude<keyof T, keyof Args[0]>]: any
					}
				),
				'css'
			>>(
				props: (
					& T
					& {
						/** Inline CSS. */
						css?: Style<C>
					}
				)
			) => {
				className: string
				selector: string
				props: T
			}
		) & {
			className: string
			selector: string

			[$$VARIANTS]: Args
		}
	}

	getCssString: {
		(): string
	}
}

declare const $$VARIANTS: unique symbol

type $$VARIANTS = typeof PrivatePropertyValue

/* ========================================================================== */

export type CreateCss = <
	T extends ConfigShape
>(
	config?: NarrowObject<T>,
) => CreatedCss<Config<T>>
