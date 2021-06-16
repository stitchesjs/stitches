import { DefaultThemeScaleValue, DefaultThemeValue } from './default/DefaultTheme'
import { CreateComponent } from './createCss/CreateComponent'
import { CreateGlobal } from './createCss/CreateGlobal'
import { CreateTheme, ThemeExpressed } from './createCss/CreateTheme'
import { CSSProperties } from './css/CSSProperties'
import { DefaultThemeMap } from './default/DefaultThemeMap'
import { Narrow, NarrowFunction, PlainObject, Primitive, Try } from './utility'

/* ========================================================================== */

export type ConfigInit<T extends PlainObject = {}> = {
	media: MediaInit<T['media']>
	prefix: string
	theme: ThemeInit<T['theme']>
	themeMap: ThemeMapInit<T['themeMap'], T>
	utils: UtilsInit
}

export type MediaInit<T extends PlainObject = {}> = {
	[K in keyof T]: K extends `@${string}` ? never : string
}

export type ThemeInit<T extends PlainObject = {}> = (
	| {
		[K in keyof DefaultThemeValue]: DefaultThemeValue[K]
	}
	| {
		[K in keyof T]: DefaultThemeScaleValue
	}
) // prettier-ignore

export type ThemeMapInit<T extends PlainObject = {}, TT extends PlainObject = {}> = (
	| {
		[K in keyof CSSProperties]: keyof TT['theme']
	}
	| (
		TT['theme'] extends PlainObject
			? {
				[K in keyof T]: keyof TT['theme']
			}
		: {
			[K in keyof T]: keyof DefaultThemeValue
		}
	)
) // prettier-ignore

export type UtilsInit = {
	[property: string]: (config: Config) => (value: unknown) => Style
} // prettier-ignore

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
	/** Configured breakpoints. */
	media: {
		all: 'all'
	} & T['media']
	/** Configured prefix added before tokens and classes to avoid conflicts. */
	prefix: Try<T['prefix'], string, ''>
	/** Configured design theme tokens. */
	theme: Try<T['theme'], PlainObject, {}>
	/** Configured mapping between CSS properties and theme tokens. */
	themeMap: Try<T['themeMap'], PlainObject, Narrow<DefaultThemeMap>>
	/** Configured utilities. */
	utils: T['utils']
}

/* ========================================================================== */

/** Current instance of Stitches. */
export type Stitches<T extends ConfigInit = ConfigInit> = {
	/** Creates new component styles with the specified styles and variants, and returns a function to activate them. */
	css: CreateComponent<Config<T>>
	/** Configuration used by the `createCss` function. */
	config: Config<T>
	/** Returns the currently applied CSS text. */
	getCssString(): string
	/** Creates new global styles from the specified styles, and returns a function to activate them. */
	global: CreateGlobal<Config<T>>
	/** Current prefix. */
	prefix: Config<T>['prefix']
	/** Creates a new theme, and contains the current theming. */
	theme: ThemeExpressed<T['theme'], Config<T>> & CreateTheme<Config<T>>
}

/* ========================================================================== */

/** Returns a new instance of Stitches using the provided configuration. */
export type CreateCss = <T extends Partial<ConfigInit<T>> = ConfigInit>(init?: Narrow<T>) => Stitches<T>

/* ========================================================================== */

/** Returns a new instance of Stitches using the provided configuration. */
export function createCss(): Stitches<{ prefix: '' }>

/** Returns a new instance of Stitches using the provided configuration. */
export function createCss<T extends Partial<ConfigInit<T>> = ConfigInit>(init: Narrow<T>): Stitches<T>
