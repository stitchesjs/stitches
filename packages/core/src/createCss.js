// default configuration
import { defaultMedia } from './default/defaultMedia.js'
import { defaultThemeMap } from './default/defaultThemeMap.js'

// creation utilities
import { createComponentFunction } from './createComponent.js'
import { createGlobalFunction } from './createGlobal.js'
import { createKeyframesFunction } from './createKeyframes.js'
import { createThemeFunction } from './createTheme.js'
import { createSheet } from './createSheet.js'
import { createMemoMap } from './createMemoMap.js'

/** @typedef {import('.').Config} Config */

const createCssMap = createMemoMap()

export const createCss = (/** @type {Partial<Config>} */ config) => {
	let didRun = false

	const instance = createCssMap(config, (/** @type {Partial<Config>} */ initConfig) => {
		didRun = true

		initConfig = typeof initConfig === 'object' && initConfig || {}

		// internal configuration
		const prefix = 'prefix' in initConfig ? String(initConfig.prefix) : ''
		const media = { ...defaultMedia, ...(typeof initConfig.media === 'object' && initConfig.media || {}) }
		const root = typeof initConfig.root === 'object' ? initConfig.root || null : globalThis.document || null
		const theme = typeof initConfig.theme === 'object' && initConfig.theme || {}
		const themeMap = typeof initConfig.themeMap === 'object' && initConfig.themeMap || { ...defaultThemeMap }
		const utils = typeof initConfig.utils === 'object' && initConfig.utils || {}

		/** @type {Config} External configuration. */
		const config = {
			prefix,
			media,
			root,
			theme,
			themeMap,
			utils,
		}

		/** Internal stylesheet. */
		const sheet = createSheet(root)

		const returnValue = {
			css: createComponentFunction(config, sheet),
			global: createGlobalFunction(config, sheet),
			keyframes: createKeyframesFunction(config, sheet),
			theme: createThemeFunction(config, sheet),
			reset() {
				sheet.reset()
				defaultTheme.toString()
			},
			sheet,
			config,
			prefix,
			getCssString: sheet.toString,
			toString: sheet.toString,
			[Symbol.toPrimitive]: sheet.toString,
		}

		const defaultTheme = returnValue.theme(theme)
		Object.assign(returnValue.theme, defaultTheme)
		defaultTheme.toString()

		return returnValue
	})

	if (!didRun) instance.reset()

	return instance
} // prettier-ignore
