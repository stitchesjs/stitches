import { Config, CreateCss, CreatedCss } from './core'
import * as Default from './default'

export * from './core'

/** Returns a library used to create styles. */
export declare const createCss: CreateCss

/** Map of CSS properties to token scales. */
export declare const defaultThemeMap: Default.ThemeMap

/** Returns a function that applies styles and variants for a specific class. */
export declare const css: CreatedCss<Config<{}>>['css']

/** Returns a function that applies global styles. */
export declare const global: CreatedCss<Config<{}>>['global']

/** Returns an object that applies `@keyframes` styles. */
export declare const keyframes: CreatedCss<Config<{}>>['keyframes']
