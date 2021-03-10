import { isArray } from './Array.js'
import getResolvedSelectors from './getResolvedSelectors.js'
import isDeclaration from './isDeclaration.js'

/** Token matcher. */
const captureTokens = /([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g

/** Unit-ed property name matcher. */
const captureUnited = /(art|ding|dth|End|[Gg]ap|eft|[^e]Height|^height|op|[Rr]ight|rgin|[^b]Size|^size|tom|us)$/

/** Nested selector name matcher */
const captureSelector = /[@&#\.]/

/** Returns the name of a property with tokens & camel-casing transformed. */
const transformPropertyName = (name) => (/^\$/.test(name) ? '-' + name.replace(/\$/g, '-') : name.replace(/[A-Z]/g, (capital) => '-' + capital.toLowerCase()))

/** Returns the data of a property with tokens & numerics transformed. */
const transformPropertyData = (name, data, themeMap) =>
	// prettier-ignore
	captureUnited.test(name) && Number(data)
		? String(data) + 'px'
	: String(data).replace(
		captureTokens,
		($0, direction, multiplier, separator, token) => (
			separator == "$" == !!multiplier
				? $0
			: (
				direction || separator == '--'
					? 'calc('
				: ''
			) + (
				'var(' + (
					separator === '$'
						? '--' + (
							!/\$/.test(token) && name in themeMap
								? themeMap[name] + '-'
							: ''
						) + token.replace(/\$/g, '-')
					: separator + token
				) + ')' + (
					direction || separator == '--'
						? '*' + (
							direction || ''
						) + (
							multiplier || '1'
						) + ')'
					: ''
				)
			)
		),
	)

const createGetComputedCss = (config) => {
	const { conditions, themeMap, utils } = config

	/** Symbol for an open can. */
	const isOpen = Symbol.for('sxs.isOpen')

	/** Comma matcher outside rounded brackets. */
	const splitByComma = /\s*,\s*(?![^()]*\))/

	/** Returns a string of CSS from an object of CSS. */
	const getComputedCss = (
		/** Object representing the current CSS. */
		initStyle,
	) => {
		/** String of CSS being generated. */
		let cssText = ''

		/** Array of nesting conditions. */
		const conditionz = []

		let visitedStyle
		let visitedName

		/** Process CSS from an object of styles. */
		const processStyle = (
			/** Object representing the current CSS. */
			rawStyle,

			/** Styled rule selectors representing the current CSS. */
			selectors,
		) => {
			// @todo: this pushes "when" to the end of props, which is good, but this implementation feels messy
			const { when, ...style } = rawStyle

			if (when) style.when = when

			for (let name of Reflect.ownKeys(style)) {
				/** Data representing the current style declaration or condition. */
				let dataList = style[name]

				/** Whether the current style is a condition (i.e. media or supports query). */
				const isCondition = name.charCodeAt(0) == 64

				/** Whether the current style is a CSS selector */
				const isSelector = !selectors.length || captureSelector.test(name)

				dataList = isCondition && isArray(dataList) ? dataList : [dataList]

				loop: for (let data of dataList) {
					/** Whether the data is a declaration, or a styles object */
					const isStyleDeclaration = name !== 'when' && (!isSelector || isDeclaration(data))

					// process either a declaration or a nested object of styles
					if (isStyleDeclaration) {
						// conditionally open any unopened condition rules
						for (const conditionRule of conditionz) {
							if (!conditionRule[isOpen]) {
								cssText += conditionRule
								cssText += '{'

								conditionRule[isOpen] = true
							}
						}

						// conditionally open an unopened styled rule
						if (selectors.length && !selectors[isOpen]) {
							cssText += selectors.join(', ')
							cssText += '{'

							selectors[isOpen] = true
						}

						if (name in utils && !(name == visitedName && rawStyle == visitedStyle)) {
							const transformedStyle = utils[name](config)(data)

							if (transformedStyle !== undefined) {
								if (transformedStyle === Object(transformedStyle)) {
									visitedName = name
									processStyle((visitedStyle = transformedStyle), selectors)
								}

								continue loop
							}
						}

						// write the current declaration
						const declarationName = isCondition ? name : transformPropertyName(name)
						const declarationData = isCondition ? data : transformPropertyData(name, data, themeMap)

						cssText += declarationName + (isCondition ? ' ' : ':') + declarationData + ';'
					} else {
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
							const conditionIndex = isCondition ? conditionz.push(Object(prelude)) : conditionz.length

							// conditionally close a styled rule
							if (selectors.length && selectors[isOpen]) {
								cssText += '}'

								selectors[isOpen] = false
							}

							processStyle(innerStyles, isCondition ? selectors : selectors.length ? getResolvedSelectors(selectors, prelude.split(splitByComma)) : prelude.split(splitByComma))

							// close any deeper conditions
							if (isCondition && conditionIndex) {
								for (const deeperConditionRules of conditionz.splice(conditionIndex - 1)) {
									if (deeperConditionRules[isOpen]) {
										cssText += '}'

										deeperConditionRules[isOpen] = false
									}
								}
							}
						}

						// process either conditional styles or nested rules
						if (name === 'when') {
							for (const conditionName in data) {
								// process either named conditions or inlined conditions
								if (conditionName in conditions) {
									processNestedCondition(true, conditions[conditionName], data[conditionName])
								} else {
									processNestedCondition(true, conditionName, data[conditionName])
								}
							}
						} else {
							processNestedCondition(isCondition, name, data)
						}
					}
				}
			}

			// close an open styled rule
			if (selectors.length && selectors[isOpen]) {
				cssText += '}'

				selectors[isOpen] = false
			}
		}

		// process the initial styles
		processStyle(Object(initStyle), [])

		return cssText
	}

	return getComputedCss
}

export default createGetComputedCss
