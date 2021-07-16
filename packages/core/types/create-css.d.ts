import type * as CSSUtil from './css-util'
import type * as Default from './default'
import type Sheet from './sheet'

/* Interfaces */
/* ========================================================================== */

/** Returns a shaped theme object from the given media object. */
type InterfaceOfMedia<
	Media extends {}
> = {
	[K in keyof Media]: string
}

/** Returns a shaped theme object from the given theme object. */
type InterfaceOfTheme<
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
type InterfaceOfThemeMap<
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

type InterfaceOfUtils<
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
type CreateCss = {
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
	): Sheet<
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

export default CreateCss
