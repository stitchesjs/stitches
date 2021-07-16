import type * as CSSUtil from './css-util'
import type * as Default from './default'
import type * as StyledComponent from './styled-component'
import type * as ThemeUtil from './theme'
import type * as Util from './util'

/** Sheet interface. */
export default interface Sheet<
	Prefix extends string = Default.Prefix,
	Media = Default.Media,
	Theme = {},
	ThemeMap = Default.ThemeMap,
	Utils = {},
	CSS extends { [prelude: string]: unknown } = CSSUtil.CSS<Media, Theme, ThemeMap, Utils>,
	KnownCSS extends { [prelude: string]: unknown } = CSSUtil.KnownCSS<Media, Theme, ThemeMap, Utils>
> {
	config: {
		prefix: Prefix
		media: Media
		theme: Theme
		themeMap: ThemeMap
		utils: Utils
	},
	prefix: Prefix
	global: {
		(style: {
			[prelude: string]: CSS
		}): {
			(): string
		}
	},
	keyframes: {
		(style: {
			[offset: string]: CSS
		}): {
			(): string
			name: string
		}
	},
	theme: {
		(
			nameOrScalesArg0: (
				| string
				| (
					& {
						[scale in keyof Theme]?: {
							[token in keyof number | string]: boolean | number | string
						}
					}
					& {
						[scale in string]: {
							[token in keyof number | string]: boolean | number | string
						}
					}
				)
			),
			nameOrScalesArg1?: (
				| string
				| (
					& {
						[scale in keyof Theme]?: {
							[token in keyof number | string]: boolean | number | string
						}
					}
					& {
						[scale in string]: {
							[token in keyof number | string]: boolean | number | string
						}
					}
				)
			)
		): {
			className: string
			selector: string
		}
	} & {
		[Scale in keyof Theme]: {
			[Token in keyof Theme[Scale]]: ThemeUtil.Token<Extract<Token, string | number>, string, Extract<Scale, string>, Prefix>
		}
	}
	reset: {
		(): void
	}
	getCssString: {
		(): string
	},
	css: {
		<
			Composers extends (
				| string
				| Util.Function
				| { [name: string]: unknown }
			)[]
		>(
			...composers: {
				[K in keyof Composers]: (
					Composers[K] extends string
						? Composers[K]
					: Composers[K] extends Util.Function
						? Composers[K]
					: Composers[K] extends {
						[K2 in keyof Composers[K]]: Composers[K][K2]
					}
						? (
							& {
								[K2 in keyof Composers[K]]:
									K2 extends 'variants'
										? {
											[name: string]: {
												[pair in number | string]: CSS
											}
										}
									: unknown
							}
							& KnownCSS
						)
					: never
				)
			}
		): StyledComponent.CssComponent<
			StyledComponent.StyledComponentType<Composers>,
			StyledComponent.StyledComponentProps<Composers>,
			Media,
			Theme,
			ThemeMap,
			Utils
		>
	},
}
