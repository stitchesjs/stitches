import type * as CSSUtil from './css-util'
import type * as Default from './default'
import type * as StyledComponent from './styled-component'
import type * as Util from './util'

/** Stitches interface. */
export interface Stitches<
	Prefix = Default.Prefix,
	Media = Default.Media,
	Theme = {},
	ThemeMap = Default.ThemeMap,
	Utils = {}
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
			[prelude: string]: CSSUtil.Style<Media, Theme, ThemeMap, Utils>
		}): {
			(): string
		}
	},
	keyframes: {
		(style: {
			[offset: string]: CSSUtil.Style<Media, Theme, ThemeMap, Utils>
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
						[K2 in keyof Composers[K]]: Composers[K][K2]
					}
						? (
							& {
								[K2 in keyof Composers[K]]:
									K2 extends 'variants'
										? {
											[name: string]: {
												[pair in number | string]: CSSUtil.Style<Media, Theme, ThemeMap, Utils>
											}
										}
									: unknown
							}
							& CSSUtil.Style<Media, Theme, ThemeMap, Utils>
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
							& {
								[K2 in keyof Composers[K]]: (
									| (
										K2 extends 'variants'
											? {
												[name: string]: {
													[pair in number | string]: CSSUtil.Style<Media, Theme, ThemeMap, Utils>
												}
											}
										: unknown
									)
								)
							}
							& {
								variants?: unknown
								compoundVariants?: (
									& (
										'variants' extends keyof Composers[K]
											? {
												[Name in keyof Composers[K]['variants']]?: Util.Widen<keyof Composers[K]['variants'][Name]>
											}
										: {
											[name: string]: boolean | number | string | undefined
										}
									)
									& {
										css: CSSUtil.Style<Media, Theme, ThemeMap, Utils>
									}
								)[]
								defaultVariants?: (
									'variants' extends keyof Composers[K]
										? {
											[Name in keyof Composers[K]['variants']]?: Util.Widen<keyof Composers[K]['variants'][Name]>
										}
									: {
										[name: string]: boolean | number | string | undefined
									}
								)
							}
							& CSSUtil.Style<Media, Theme, ThemeMap, Utils>
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

/* ========================================================================== */

export interface GlobalComponent {
	(): string
}

export interface GlobalExpressor {
	toString(): ''
}

export interface ThemedExpressor {}
