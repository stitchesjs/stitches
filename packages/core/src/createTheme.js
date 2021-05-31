import { createObject } from './createObject.js'
import { createComponentId } from './createComponentId.js'
import { createMemoMap } from './createMemoMap.js'

import { transformDeclarationValueTokens } from './stringify/transformDeclarationValueTokens.js'
import { toTailDashed } from './convert/toDashed.js'

import { ThemeToken } from './ThemeToken.js'

/** @typedef {import('./createCss.js').Config} Config */
/** @typedef {import('./createCss.js').Style} Style */
/** @typedef {import('./createSheet.js').GroupSheet} GroupSheet */

const createThemeFunctionMap = createMemoMap()

/** Returns a function that applies a theme and returns tokens of that theme. */
export const createThemeFunction = (/** @type {Config} */ config, /** @type {GroupSheet} */ sheet) => (
	createThemeFunctionMap(config, () => (className, style) => {
		// theme is the first argument if it is an object, otherwise the second argument as an object
		style = typeof className === 'object' && className || Object(style)

		// class name is the first argument if it is a string, otherwise an empty string
		className = typeof className === 'string' ? className : ''

		/** @type {string} Theme name. @see `{CONFIG_PREFIX}t-{THEME_UUID}` */
		className = className || `${toTailDashed(config.prefix)}t-${createComponentId(style)}`

		const selector = `.${className}`

		const themeObject = {}
		const cssProps = []

		for (const scale in style) {
			themeObject[scale] = {}

			for (const token in style[scale]) {
				const propertyName = `--${toTailDashed(config.prefix)}${scale}-${token}`
				const propertyValue = transformDeclarationValueTokens(style[scale][token], config.prefix, scale)

				themeObject[scale][token] = new ThemeToken(propertyValue, token, scale, config.prefix)

				cssProps.push(`${propertyName}:${propertyValue}`)
			}
		}

		const render = () => {
			if (cssProps.length && !sheet.rules.themed.cache.has(className)) {
				sheet.rules.themed.cache.add(className)

				let index = sheet.rules.themed.group.cssRules.length

				const rootPrelude = style === config.theme ? ':root,' : ''
				const cssText = `${rootPrelude}.${className}{${cssProps.join(';')}}`

				sheet.rules.themed.group.insertRule(cssText, index++)
			}

			return className
		}

		return {
			...themeObject,
			className,
			selector,
			toString: render,
			[Symbol.toPrimitive]: render,
		}
	})
) // prettier-ignore
