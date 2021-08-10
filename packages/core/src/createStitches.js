import { defaultThemeMap } from './default/defaultThemeMap.js'

import { createMemo } from './utility/createMemo.js'

import { createComponentFunction } from './features/css.js'
import { createGlobalFunction } from './features/global.js'
import { createKeyframesFunction } from './features/keyframes.js'
import { createThemeFunction } from './features/theme.js'

import { createSheet } from './sheet.js'

const createCssMap = createMemo()

export const createStitches = (config) => {
	let didRun = false

	const instance = createCssMap(config, (initConfig) => {
		didRun = true

		initConfig = typeof initConfig === 'object' && initConfig || {}

		// internal configuration
		const prefix = 'prefix' in initConfig ? String(initConfig.prefix) : ''
		const media = typeof initConfig.media === 'object' && initConfig.media || {}
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
			globalCss: createGlobalFunction(config, sheet),
			keyframes: createKeyframesFunction(config, sheet),
			createTheme: createThemeFunction(config, sheet),
			reset() {
				sheet.reset()
				returnValue.theme.toString()
			},
			theme: {},
			sheet,
			config,
			prefix,
			getCssText: sheet.toString,
			toString: sheet.toString,
		}

		// initialize default theme
		String(
			returnValue.theme = returnValue.createTheme(theme)
		)

		return returnValue
	})

	if (!didRun) instance.reset()

	return instance
} // prettier-ignore
