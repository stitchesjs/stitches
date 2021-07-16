import type CreateCss from './create-css'
import type Sheet from './sheet'

import type * as CSSUtil from './css-util'
import type * as Default from './default'

export type { CreateCss, Sheet }

export type DefaultThemeMap = Default.ThemeMap

/** Returns a Style interface from a configuration, leveraging the given media and style map. */
export type CSS<
	Config extends {
		media?: {}
		theme?: {}
		themeMap?: {}
		utils?: {}
	}
> = CSSUtil.CSS<
	Config['media'],
	Config['theme'],
	Config['themeMap'],
	Config['utils']
>

/** Returns a type that expects a value to be a kind of CSS property value. */
export type PropertyValue<K extends keyof CSSUtil.CSSProperties> = { readonly [CSSUtil.$$PropertyValue]: K }

/** Returns a type that expects a value to be a kind of theme scale value. */
export type ScaleValue<K> = { readonly [CSSUtil.$$ScaleValue]: K }

/** Returns a library used to create styles. */
export declare const createCss: CreateCss

/** Map of CSS properties to token scales. */
export declare const defaultThemeMap: DefaultThemeMap

/** Returns a function that applies global styles. */
export declare const global: Sheet['global']

/** Returns an object that applies `@keyframes` styles. */
export declare const keyframes: Sheet['keyframes']

/** Returns a function that applies styles and variants for a specific class. */
export declare const css: Sheet['css']
