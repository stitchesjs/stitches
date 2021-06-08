import { createMemoMap } from './createMemoMap.js'

import { toCssRules } from './convert/toCssRules.js'
import { toHash } from './convert/toHash.js'

import { define } from './utility/define.js'

/** @typedef {import('.').Config} Config */
/** @typedef {import('.').Style} Style */
/** @typedef {import('.').GroupSheet} GroupSheet */

const createGlobalFunctionMap = createMemoMap()

/** Returns a function that applies global styles. */
export const createGlobalFunction = (/** @type {Config} */ config, /** @type {GroupSheet} */ sheet) =>
	createGlobalFunctionMap(config, () => (/** @type {Style} */ style) => {
		style = (typeof style === 'object' && style) || {}

		const uuid = toHash(style)

		const render = () => {
			if (!sheet.rules.global.cache.has(uuid)) {
				sheet.rules.global.cache.add(uuid)

				// support @import rules
				if ('@import' in style) {
					let importIndex = [].indexOf.call(sheet.sheet.cssRules, sheet.rules.themed.group) - 1

					// wrap import in quotes as a convenience
					for (let importValue of [].concat(style['@import'])) {
						importValue = importValue.includes('"') || importValue.includes("'") ? importValue : `"${importValue}"`

						sheet.sheet.insertRule(`@import ${importValue};`, importIndex++)
					}

					delete style['@import']
				}

				let globalIndex = sheet.rules.global.group.cssRules.length

				toCssRules(style, [], [], config, (cssText) => {
					sheet.rules.global.group.insertRule(cssText, globalIndex++)
				})
			}

			return ''
		}

		return define(render, {
			toString: render,
			[Symbol.toPrimitive]: render,
		})
	})
