import type * as CSSUtil from './css-util'
import type * as Default from './default'
import type * as StyledComponent from './styled-component'
import type * as Util from './util'

/** Sheet interface. */
export default interface Sheet<
	Prefix = Default.Prefix,
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
				| React.ExoticComponent<any>
				| React.JSXElementConstructor<any>
				| Util.Function
				| { [name: string]: unknown }
			)[]
		>(
			...composers: {
				[K in keyof Composers]: (
					Composers[K] extends string
						? Composers[K]
					: Composers[K] extends React.ExoticComponent<any>
						? Composers[K]
					: Composers[K] extends React.JSXElementConstructor<any>
						? Composers[K]
					: Composers[K] extends Function
						? Composers[K]
					: Composers[K] extends {
						[Prelude in keyof Composers[K]]: Composers[K][Prelude]
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
	styled: {
		<
			Composers extends (
				| string
				| React.ExoticComponent<any>
				| React.JSXElementConstructor<any>
				| Util.Function
				| { [name: string]: unknown }
			)[]
		>(
			...composers: {
				[K in keyof Composers]: (
					Composers[K] extends string
						? Composers[K]
					: Composers[K] extends React.ExoticComponent<any>
						? Composers[K]
					: Composers[K] extends React.JSXElementConstructor<any>
						? Composers[K]
					: Composers[K] extends Function
						? Composers[K]
					: Composers[K] extends {
						[K2 in keyof Composers[K]]: Composers[K][K2]
					}
						? (
							& KnownCSS
							& {
								variants?: {
									[name: string]: {
										[pair in number | string]: CSS
									}
								}
								compoundVariants?: (
									& (
										'variants' extends keyof Composers[K]
											? {
												[Name in keyof Composers[K]['variants']]?: Util.Widen<keyof Composers[K]['variants'][Name]> | Util.String
											} & Util.WideObject
										: Util.WideObject
									)
									& {
										css: CSS
									}
								)[]
								defaultVariants?: (
									'variants' extends keyof Composers[K]
										? {
											[Name in keyof Composers[K]['variants']]?: Util.Widen<keyof Composers[K]['variants'][Name]> | Util.String
										}
									: Util.WideObject
								)
							}
							& {
								[Prelude in keyof Composers[K]]:
									Prelude extends keyof KnownCSS | 'compoundVariants' | 'defaultVariants' | 'variants'
										? unknown
									: Composers[K][Prelude] extends {}
										? CSS
									: boolean | number | string
							}
						)
					: never
				)
			}
		): StyledComponent.StyledComponent<
			StyledComponent.StyledComponentType<Composers>,
			StyledComponent.StyledComponentProps<Composers>,
			Media,
			Theme,
			ThemeMap,
			Utils
		>
	}
}
