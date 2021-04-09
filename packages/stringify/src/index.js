import { toKebabCase } from './toCase.js'
import { getResolvedSelectors } from './getResolvedSelectors.js'
import { isArray } from './Array.js'

const { prototype: { toString } } = Object // prettier-ignore

/** Comma matcher outside rounded brackets. */
const comma = /\s*,\s*(?![^()]*\))/

/** Returns a string of CSS from an object of CSS. */
export const stringify = (
	/** Object representing the current CSS. */
	value,
	/** Replacer function. */
	replacer = undefined,
) => {
	/** Set used to manage the opened and closed state of rules. */
	const used = new WeakSet()

	const parse = (style, selectors, conditions, prevName, prevData) => {
		let cssText = ''

		each: for (const name in style) {
			const isAtRuleLike = name.charCodeAt(0) === 64

			for (const data of isAtRuleLike && isArray(style[name]) ? style[name] : [style[name]]) {
				if (replacer && (name !== prevName || data !== prevData)) {
					const next = replacer(name, data, style)

					if (next !== null) {
						cssText += typeof next === 'object' && next ? parse(next, selectors, conditions, name, data) : next == null ? '' : next

						continue each
					}
				}

				const isObjectLike = typeof data === 'object' && data && data.toString === toString

				if (isObjectLike) {
					if (used.has(selectors)) {
						used.delete(selectors)

						cssText += '}'
					}

					const usedName = Object(name)

					const nextSelectors = isAtRuleLike ? selectors : selectors.length ? getResolvedSelectors(selectors, name.split(comma)) : name.split(comma)

					cssText += parse(data, nextSelectors, isAtRuleLike ? conditions.concat(usedName) : conditions)

					if (used.has(usedName)) {
						used.delete(usedName)
						cssText += '}'
					}

					if (used.has(nextSelectors)) {
						used.delete(nextSelectors)
						cssText += '}'
					}
				} else {
					for (let i = 0; i < conditions.length; ++i) {
						if (!used.has(conditions[i])) {
							used.add(conditions[i])

							cssText += conditions[i] + '{'
						}
					}

					if (selectors.length && !used.has(selectors)) {
						used.add(selectors)

						cssText += selectors + '{'
					}

					cssText += (isAtRuleLike ? name + ' ' : toKebabCase(name) + ':') + String(data) + ';'
				}
			}
		}

		return cssText
	}

	return parse(value, [], [])
}
