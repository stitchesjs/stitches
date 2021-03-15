import { toKebabCase } from './toKebabCase.js'
import { getResolvedSelectors } from './getResolvedSelectors.js'

/** Set used to manage the opened and closed state of rules. */
const state = new WeakSet()

/** Comma matcher outside rounded brackets. */
const comma = /\s*,\s*(?![^()]*\))/

/** Returns a string of CSS from an object of CSS. */
export const stringify = (
	/** Object representing the current CSS. */
	value,
	/** ... */
	replacer = undefined,
) => {
	/** String of CSS being generated. */
	let cssText = ''

	/** Array of nesting conditions. */
	const conditions = []

	let lastName, lastData

	/** Process CSS from an object of styles. */
	const processStyle = (
		/** Object representing the current CSS. */
		style,

		/** Styled rule selectors representing the current CSS. */
		selectors,
	) => {
		for (let name in style) {
			/** Whether the current style is a condition (i.e. media or supports query). */
			const isCondition = name.charCodeAt(0) == 64
			const isRule = isCondition ? !(name.startsWith('@charset') || name.startsWith('@import') || name.startsWith('@namespace')) : name.includes('&') || !selectors.length

			process: for (let data of [].concat(style[name])) {
				// process either a declaration or a nested object of styles
				if (isRule) {
					/** Process CSS from a nested object of styles. */
					const processNestedCondition = (
						/** Whether the rule is a condition (e.g `@media` or `@supports` query). */
						isCondition,
						/** Nested rule prelude. */
						prelude,
						/** Nested rule styles. */
						innerStyles,
					) => {
						/** Nesting index of the current condition. */
						const conditionIndex = isCondition ? conditions.push(Object(prelude)) : conditions.length

						// conditionally close a styled rule
						if (selectors.length && state.has(selectors)) {
							cssText += '}'

							state.delete(selectors)
						}

						processStyle(innerStyles, isCondition ? selectors : selectors.length ? getResolvedSelectors(selectors, prelude.split(comma)) : prelude.split(comma))

						// close any deeper conditions
						if (isCondition && conditionIndex) {
							for (const deeperConditionRules of conditions.splice(conditionIndex - 1)) {
								if (state.has(deeperConditionRules)) {
									cssText += '}'

									state.delete(deeperConditionRules)
								}
							}
						}
					}

					processNestedCondition(isCondition, name, data)
				} else {
					// conditionally open any unopened condition rules
					for (const conditionRule of conditions) {
						if (!state.has(conditionRule)) {
							cssText += conditionRule
							cssText += '{'

							state.add(conditionRule)
						}
					}

					// conditionally open an unopened styled rule
					if (selectors.length && !state.has(selectors)) {
						cssText += selectors.join(',')
						cssText += '{'

						state.add(selectors)
					}

					if (isCondition) {
						cssText += name + ' ' + data + ';'
					} else {
						name = toKebabCase(name)
						data = name === 'content' && !/^([^]*["'][^]*|[A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(data) ? '"' + data + '"' : data

						const replaced = typeof replacer === 'function' && name !== lastName && data !== lastData && replacer(name, data)

						if (replaced && typeof replaced === 'object') {
							lastName = name
							lastData = data

							processStyle(replaced, selectors)

							continue process
						}

						if (name != null && data != null) {
							cssText += name + ':' + data + ';'
						}
					}
				}
			}
		}

		// close an open styled rule
		if (selectors.length && state.has(selectors)) {
			cssText += '}'

			state.delete(selectors)
		}

		lastName = undefined
		lastData = undefined
	}

	// process the initial styles
	processStyle(Object(value), [])

	return cssText
}
