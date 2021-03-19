import { toKebabCase } from './toCase.js'
import { getResolvedSelectors } from './getResolvedSelectors.js'

/** Comma matcher outside rounded brackets. */
const comma = /\s*,\s*(?![^()]*\))/

/** Returns a string of CSS from an object of CSS. */
export const stringify = (
	/** Object representing the current CSS. */
	value,
	/** ... */
	replacer = undefined,
) => {
	/** Set used to manage the opened and closed state of rules. */
	const used = new WeakSet()

	let prevName, prevData

	const parse = (style, selectors, conditions) => {
		let cssText = ''

		each: for (let name in style) {
			const isAtRuleLike = name.charCodeAt(0) === 64

			for (const data of isAtRuleLike ? [].concat(style[name]) : [style[name]]) {
				if (typeof replacer === 'function' && (name !== prevName || data !== prevData)) {
					const next = replacer(name, data, style)

					if (next !== null) {
						prevName = name
						prevData = data

						cssText += next === Object(next) ? parse(next, selectors, conditions) : next == null ? '' : next

						continue each
					}
				}

				const isAtRuleLike = name.charCodeAt(0) === 64
				const isObjectLike = data === Object(data) && !('length' in data)

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

					for (const each of /^@import/i.test(name) ? [].concat(data) : [data]) {
						cssText += (isAtRuleLike ? name + ' ' : toKebabCase(name) + ':') + String(each) + ';'
					}
				}
			}
		}

		return cssText
	}

	return parse(value, [], [])
}
