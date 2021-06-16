import { DefaultThemeScaleValue, DefaultThemeValue } from './default/DefaultTheme'
import { CreateComponent } from './createCss/CreateComponent'
import { CreateGlobal } from './createCss/CreateGlobal'
import { CSSProperties } from './css/CSSProperties'
import { DefaultThemeMap } from './default/DefaultThemeMap'
import { Narrow, Primitive, Try } from './utility'

/* ========================================================================== */

export type ConfigInit<T extends {} = {}> = {
	media: MediaInit<T['media']>
	prefix: string
	theme: ThemeInit<T['theme']>
	themeMap: ThemeMapInit<T['themeMap'], T>
	utils: UtilsInit
}

export type MediaInit<T extends {} = {}> = {
	[K in keyof T]: K extends `@${string}` ? never : string
}

export type ThemeInit<T extends {} = {}> = (
	| {
		[K in keyof DefaultThemeValue]: DefaultThemeValue[K]
	}
	| {
		[K in keyof T]: DefaultThemeScaleValue
	}
) // prettier-ignore

export type ThemeMapInit<T extends {} = {}, ConfigInit extends {} = {}> = (
	| {
		[K in keyof CSSProperties]: keyof ConfigInit['theme']
	}
	| (
		ConfigInit['theme'] extends {}
			? {
				[K in keyof T]: keyof ConfigInit['theme']
			}
		: {
			[K in keyof T]: keyof DefaultThemeValue
		}
	)
) // prettier-ignore

export type UtilsInit = {
	[property: string]: (config: Config) => (value: unknown) => Style
}

/* ========================================================================== */

export type ThemeScale<T extends ThemeInit = ThemeInit, Config extends ConfigInit> = {
	[Scale in keyof T]: {
		[Token in keyof T[Scale]]: ThemeToken<Config['prefix'], Scale, Token, T[Scale][Token]>
	}
}

/* ========================================================================== */

export type ThemeToken<
	Prefix extends string,
	Scale extends string,
	Token extends string,
	Value extends string
> = {
	computedValue: `var(-${Prefix extends '' ? '' : `-${Prefix}`}-${Scale}-${Token})`
	prefix: Prefix
	scale: Scale
	token: Token
	value: Value
	variable: `-${Prefix extends '' ? '' : `-${Prefix}`}-${Scale}-${Token}`
} // prettier-ignore

/* ========================================================================== */

export type Config<T extends ConfigInit = ConfigInit> = {
	media: {
		all: 'all'
	} & T['media']
	prefix: Try<T['prefix'], string, ''>
	theme: Try<T['theme'], {}, {}>
	themeMap: Try<T['themeMap'], {}, DefaultThemeMap>
	utils: T['utils']
}

/* ========================================================================== */

/** Current instance of Stitches. */
export type Stitches<T extends ConfigInit = ConfigInit> = {
	/** Creates new component styles with the specified styles and variants, and returns a new function to activate them. */
	css: CreateComponent<Config<T>>
	/** Configuration read by the `createCss` function. */
	config: Config<T>
	/** Returns the CSS text rendered by this instance of Stitches. */
	getCssString(): string
	/** Creates new global styles with the specified styles, and returns a new function to activate them. */
	global: CreateGlobal<Config<T>>
	/** Current prefix associated with this instance of Stitches. */
	prefix: T['prefix']
	/** Creates new component styles with the specified styles and variants, and returns a new function to activate them. */
	styled: CreateComponent<Config<T>>
	/** Current theming associated with this instance of Stitches. */
	theme: ThemeScale<T['theme'], Config<T>>
}

/* ========================================================================== */

/** Returns a new instance of Stitches using the provided configuration. */
export function createCss<T extends Partial<ConfigInit<T>> = ConfigInit>(init: Narrow<T>): Stitches<T>
