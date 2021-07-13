import type * as CSSUtil from './css-util'
import type * as Default from './default'
import type * as Stitches from './stitches'

export type PropertyValue<K extends keyof CSSUtil.CSSProperties> = { readonly [CSSUtil.$$PropertyValue]: K }

export type ScaleValue<K> = { readonly [CSSUtil.$$ScaleValue]: K }

/* Interfaces */
/* ========================================================================== */

/** Returns a shaped theme object from the given media object. */
export type InterfaceOfMedia<
	Media extends {}
> = {
	[K in keyof Media]: string
}

/** Returns a shaped theme object from the given theme object. */
export type InterfaceOfTheme<
	Theme extends {}
> = (
	// shape of left-hand scale names
	& {
		[K in keyof Required<Default.Theme>]?: (
			K extends keyof Theme
				? unknown
			: {
				[token in number | string]: boolean | number | string
			}
		)
	}
	// shape of right-hand scale names
	& {
		[K in keyof Theme]: {
			[token in number | string]: boolean | number | string
		}
	}
)

/** Returns a shaped themeMap object from the given themeMap object and theme object. */
export type InterfaceOfThemeMap<
	ThemeMap extends {} = {},
	Theme extends {} = {}
> = (
	// shape of left-hand style declaration names
	& {
		[K in keyof Required<CSSUtil.CSSProperties>]?:
			keyof Theme | keyof Default.Theme | string
	}
	// shape of left-hand non style declaration properties
	& {
		[K in Exclude<string, keyof Required<CSSUtil.CSSProperties>>]?:
			keyof Theme | keyof Default.Theme | string
	}
	// shape of right-hand values
	& {
		[K in keyof ThemeMap]: ThemeMap[K] extends ''
			? keyof Theme | keyof Default.Theme
		: string
	}
)

export type InterfaceOfUtils<
	Utils extends {} = {}
> = (
	// shape of right-hand values
	{
		[K in keyof Utils]: (value: any) => ({
			[property in keyof Required<CSSUtil.CSSProperties>]?: unknown
		} & {
			[property in string]: unknown
		})
	}
)

/** Returns a function used to create a new Stitches interface. */
export type CreateCss = {
	<
		Prefix extends string,
		Media extends InterfaceOfMedia<Media>,
		Theme extends InterfaceOfTheme<Theme>,
		ThemeMap extends InterfaceOfThemeMap<ThemeMap, Theme>,
		Utils extends InterfaceOfUtils<Utils>
	>(
		config: {
			prefix?: Prefix
			media?: Media
			theme?: Theme
			themeMap?: ThemeMap
			utils?: Utils
		}
	): Stitches.Stitches<
		// post-process prefix
		string extends Prefix ? Default.Prefix : Prefix,
		// post-process media
		{ [name in number | string]: string } extends Media ? { [K in keyof Default.Media]: string } : { [K in keyof Default.Media | keyof Media]: string },
		// post-process theme
		{} extends Theme ? {} : Theme,
		// post-process themeMap
		object extends ThemeMap ? { [K in keyof Default.ThemeMap]: Default.ThemeMap[K] } : ThemeMap,
		// post-process utils
		object extends Utils ? {} : Utils
	>
}

export declare var createCss: CreateCss
