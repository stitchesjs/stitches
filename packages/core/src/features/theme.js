import { ThemeToken } from '../ThemeToken.js'
import { createMemo } from '../utility/createMemo.js'

import { toHash } from '../convert/toHash.js'
import { toTailDashed } from '../convert/toTailDashed.js'
import { toTokenizedValue } from '../convert/toTokenizedValue.js'

const createThemeFunctionMap = createMemo()

/** Returns a function that applies a theme and returns tokens of that theme. */
export const createThemeFunction = (
	config,
	sheet
) => (
	createThemeFunctionMap(config, () => (className, style) => {
		// theme is the first argument if it is an object, otherwise the second argument as an object
		style = typeof className === 'object' && className || Object(style)

		// class name is the first argument if it is a string, otherwise an empty string
		className = typeof className === 'string' ? className : ''

		/** @type {string} Theme name. @see `{CONFIG_PREFIX}t-{THEME_UUID}` */
		className = className || `${toTailDashed(config.prefix)}t-${toHash(style)}`

		const selector = `.${className}`

		const themeObject = {}
		const cssProps = []

		for (const scale in style) {
			themeObject[scale] = {}

			for (const token in style[scale]) {
				const propertyName = `--${toTailDashed(config.prefix)}${scale}-${token}`
				const propertyValue = toTokenizedValue(String(style[scale][token]), config.prefix, scale)

				themeObject[scale][token] = new ThemeToken(token, propertyValue, scale, config.prefix)

				cssProps.push(`${propertyName}:${propertyValue}`)
			}
		}

		const render = () => {
			if (cssProps.length && !sheet.rules.themed.cache.has(className)) {
				sheet.rules.themed.cache.add(className)

				const rootPrelude = style === config.theme ? ':root,' : ''
				const cssText = `${rootPrelude}.${className}{${cssProps.join(';')}}`

				sheet.rules.themed.apply(cssText)
			}

			return className
		}

		return {
			...themeObject,
			className,
			selector,
			toString: render,
		}
	})
) // prettier-ignore
