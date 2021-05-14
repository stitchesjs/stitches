import { createObject } from './createObject.js'
import { createMemoMap } from './createMemoMap.js'
import { createComponentId } from './createComponentId.js'

import { toCssRules } from './convert/toCssRules.js'
import { toTailDashed } from './convert/toDashed.js'

/** @typedef {import('.').Config} Config */
/** @typedef {import('.').Style} Style */
/** @typedef {import('.').GroupSheet} GroupSheet */

const createKeyframesFunctionMap = createMemoMap()

/** Returns a function that applies a keyframes rule. */
export const createKeyframesFunction = (/** @type {Config} */ config, /** @type {GroupSheet} */ sheet) =>
	createKeyframesFunctionMap(config, () => (style) => {
		/** @type {string} Keyframes Unique Identifier. @see `{CONFIG_PREFIX}-?k-{KEYFRAME_UUID}` */
		const name = `${toTailDashed(config.prefix)}k-${createComponentId(style)}`

		const render = () => {
			if (!sheet.rules.global.cache.has(name)) {
				sheet.rules.global.cache.add(name)

				let index = sheet.rules.global.group.cssRules.length

				const cssText = `@keyframes ${name}{${toCssRules(style, [], [], config).join('')}}`

				sheet.rules.global.group.insertRule(cssText, index++)
			}

			return name
		}

		return createObject(render, {
			get name() {
				return render()
			},
			toString: render,
			[Symbol.toPrimitive]: render,
		})
	})
