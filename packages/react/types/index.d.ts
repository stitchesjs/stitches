import type CreateStitches from './create-stitches'
import type Stitches from './stitches'

import type * as CSSUtil from './css-util'
import type * as Default from './default'
import type * as StyledComponent from './styled-component'

export type { CreateStitches, Stitches }

export type CSSProperties = CSSUtil.CSSProperties
export type DefaultThemeMap = Default.ThemeMap

/** Returns a Style interface from a configuration, leveraging the given media and style map. */
export type CSS<
	Config extends {
		media?: {}
		theme?: {}
		themeMap?: {}
		utils?: {}
	} = {
		media: {},
		theme: {},
		themeMap: {},
		utils: {}
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

/** Returns a type that suggests variants from a component as possible prop values. */
export type VariantProps<Component> = StyledComponent.TransformProps<Component[StyledComponent.$$StyledComponentProps], Component[StyledComponent.$$StyledComponentMedia]>

/** Map of CSS properties to token scales. */
export declare const defaultThemeMap: DefaultThemeMap

/** Returns a library used to create styles. */
export declare const createStitches: CreateStitches

/** Returns an object representing a theme. */
export declare const createTheme: Stitches['createTheme']

/** Returns a function that applies globalCss styles. */
export declare const globalCss: Stitches['globalCss']

/** Returns an object that applies `@keyframes` styles. */
export declare const keyframes: Stitches['keyframes']

/** Returns a function that applies styles and variants for a specific class. */
export declare const css: Stitches['css']

/** Returns a function that applies styles and variants for a specific class. */
export declare const styled: Stitches['styled']
