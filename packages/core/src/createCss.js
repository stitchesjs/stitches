import { defaultMedia } from './default/defaultMedia.js'
import { defaultThemeMap } from './default/defaultThemeMap.js'

import { createMemo } from './utility/createMemo.js'

import { createComponentFunction } from './features/css.js'
import { createGlobalFunction } from './features/global.js'
import { createKeyframesFunction } from './features/keyframes.js'
import { createThemeFunction } from './features/theme.js'

import { createSheet } from './createSheet.js'

const createCssMap = createMemo()

/** @type {import('../types/core').CreateCss} */
export const createCss = (config) => {
	let didRun = false

	const instance = createCssMap(config, (initConfig) => {
		didRun = true

		initConfig = typeof initConfig === 'object' && initConfig || {}

		// internal configuration
		const prefix = 'prefix' in initConfig ? String(initConfig.prefix) : ''
		const media = { ...defaultMedia, ...(typeof initConfig.media === 'object' && initConfig.media || {}) }
		const root = typeof initConfig.root === 'object' ? initConfig.root || null : globalThis.document || null
		const theme = typeof initConfig.theme === 'object' && initConfig.theme || {}
		const themeMap = typeof initConfig.themeMap === 'object' && initConfig.themeMap || { ...defaultThemeMap }
		const utils = typeof initConfig.utils === 'object' && initConfig.utils || {}

		/** External configuration. */
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
		}

		const defaultTheme = returnValue.theme(theme)
		Object.assign(returnValue.theme, defaultTheme)
		defaultTheme.toString()

		return returnValue
	})

	if (!didRun) instance.reset()

	return instance
} // prettier-ignore
