import { toCamelCase } from './toCamelCase.js'
import { toHyphenCase } from './toHyphenCase.js'
import { toResolvedSelectors } from './toResolvedSelectors.js'
import { unitProps } from '../stringify/unitProps.js'
import { transformDeclarationValueTokens } from '../stringify/transformDeclarationValueTokens.js'
import { transformDeclarationSizingValue } from '../stringify/transformDeclarationSizingValue.js'
import { transformMediaQueryRanges } from '../stringify/transformMediaQueryRanges.js'
import { polyfillableProps } from '../stringify/polyfillableProps.js'
import { toLeadDashed } from './toDashed.js'

/** @typedef {import('../createCss.js').Config} Config */
/** @typedef {import('../createCss.js').Style} Style */

/** Comma matcher outside rounded brackets. */
const comma = /\s*,\s*(?![^()]*\))/

/** Default toString method of Objects. */
const toStringOfObject = Object.prototype.toString

export const toCssRules = (/** @type {Style} */ style, /** @type {string[]} */ selectors, /** @type {string[]} */ conditions, /** @type {Config} */ config) => {
	/** @type {string[]} CSSOM-compatible rules. */
	const cssRules = []

	/** @type {[string[], string[], string[]]} CSSOM-compatible rule being created. */
	let currentRule = undefined

	/** Last utility that was used, cached to prevent recursion. */
	let lastUtil

	/** Last polyfill that was used, cached to prevent recursion. */
	let lastPoly

	/** Walks CSS styles and converts them into CSSOM-compatible rules. */
	const walk = (
		/** @type {Style} Set of CSS styles */ style,
		/** @type {string[]} Selectors that define the elements to which a set of CSS styles apply. */ selectors,
		/** @type {string[]} Conditions that define the queries to which a set of CSS styles apply. */ conditions,
	) => {
		/** @type {keyof style} Represents the left-side "name" for the property (the at-rule prelude, style-rule selector, or declaration name). */
		let name

		/** @type {style[keyof style]} Represents the right-side "data" for the property (the rule block, or declaration value). */
		let data

		const each = (style) => {
			for (name in style) {
				/** Whether the current name represents an at-rule. */
				const isAtRuleLike = name.charCodeAt(0) === 64

				const datas = isAtRuleLike && Array.isArray(style[name]) ? style[name] : [style[name]]

				for (data of datas) {
					/** Whether the current data represents a nesting rule. */
					const isRuleLike = typeof data === 'object' && data && data.toString === toStringOfObject

					const camelName = toCamelCase(name)

					// if the left-hand "name" matches a configured utility
					// conditionally transform the current data using the configured utility
					if (camelName in config.utils) {
						const util = config.utils[camelName]

						if (util !== lastUtil) {
							lastUtil = util

							each(util(config)(data))

							lastUtil = null

							continue
						}
					}
					// otherwise, if the left-hand "name" matches a configured polyfill
					// conditionally transform the current data using the polyfill
					else if (camelName in polyfillableProps) {
						const poly = polyfillableProps[camelName]

						if (poly !== lastPoly) {
							lastPoly = poly

							each(poly(data))

							lastPoly = null

							continue
						}
					}

					// if the left-hand "name" matches a configured at-rule
					if (isAtRuleLike) {
						// transform the current name with the configured media at-rule prelude
						name = transformMediaQueryRanges(name.slice(1) in config.media ? '@media ' + config.media[name.slice(1)] : name)
					}

					if (isRuleLike) {
						/** Next conditions, which may include one new condition (if this is an at-rule). */
						const nextConditions = isAtRuleLike ? conditions.concat(name) : [...conditions]

						/** Next selectors, which may include one new selector (if this is not an at-rule). */
						const nextSelections = isAtRuleLike ? [...selectors] : toResolvedSelectors(selectors, name.split(comma))

						if (currentRule !== undefined) cssRules.push(toCssString(...currentRule))

						currentRule = undefined

						walk(data, nextSelections, nextConditions)
					} else {
						if (currentRule === undefined) currentRule = [[], selectors, conditions]

						/** CSS left-hand side value, which may be a specially-formatted custom property. */
						name = !isAtRuleLike && name.charCodeAt(0) === 36 ? `-${toLeadDashed(config.prefix)}-${name.slice(1).replace(/\$/g, '-')}` : name

						/** CSS right-hand side value, which may be a specially-formatted custom property. */
						data = (
							// preserve object-like data
							isRuleLike ? data
							// replace specially-marked numeric property values with pixel versions
							: typeof data === 'number' && data && camelName in unitProps ? String(data) + 'px'
							// replace tokens with stringified primitive values
							: transformDeclarationValueTokens(transformDeclarationSizingValue(camelName, String(data)), config.prefix, config.themeMap[camelName])
						) // prettier-ignore

						currentRule[0].push(`${isAtRuleLike ? `${name} ` : `${toHyphenCase(name)}:`}${data}`)
					}
				}
			}
		}

		each(style)

		if (currentRule !== undefined) cssRules.push(toCssString(...currentRule))
		currentRule = undefined
	}

	walk(style, selectors, conditions)

	return cssRules
}

const toCssString = (/** @type {string[]} */ declarations, /** @type {string[]} */ selectors, /** @type {string[]} */ conditions) =>
	`${conditions.map((condition) => `${condition}{`).join('')}${selectors.length ? `${selectors.join(',')}{` : ''}${declarations.join(';')}${selectors.length ? `}` : ''}${Array(conditions.length ? conditions.length + 1 : 0).join('}')}`
