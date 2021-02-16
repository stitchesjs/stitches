import { isArray } from './Array.js'
import getResolvedSelectors from './getResolvedSelectors.js'
import isDeclaration from './isDeclaration.js'
import isPossiblyUnitless from './isPossiblyUnitless.js'

/** Symbol representing whether a selector array has been opened during stringification. */
const isOpen = Symbol()

/** Comma matcher outside rounded brackets. */
const splitByComma = /\s*,\s*(?![^()]*\))/

/** Returns a function that returns a string of CSS from an object of CSS. */
const createGetComputedCss = (
	/** Map of properties corresponding to functions that return aliased declarations. */
	utils,

	/** Map representing property names and their corresponding theme scales. */
	themeMap,

	/** Map representing condition variable names and their corresponding condition preludes. */
	conditions,

	/** Config (WIP). */
	config,
) => {
	/** Returns a string of CSS from an object of CSS. */
	const getComputedCss = (
		/** Object representing the current CSS. */
		style,
	) => {
		/** String of CSS being generated. */
		let cssText = ''

		/** Group rules, used to manage the nesting of conditions. */
		const groupRules = []

		/** Data returned by the last utility that run, used to prevent recursion. */
		let lastUtilityDataJson = ''

		/** Process CSS from an object of styles. */
		const processStyle = (
			/** Object representing the current CSS. */
			{ when, ...currentStyle },

			/** Styled rule selectors representing the current CSS. */
			selectors,
		) => {
			// @todo: this pushes "when" to the end of props, which is good, but this implementation feels messy
			currentStyle = when ? { ...currentStyle, when } : currentStyle

			for (let name in currentStyle) {
				/** Data representing the current style declaration or group. */
				let each = currentStyle[name]

				if (name in utils) {
					/** Data returned by the utility. */
					let utilityData = utils[name](config)(each)

					utilityData = isDeclaration(utilityData) ? String(utilityData) : utilityData

					if (isDeclaration(utilityData)) {
						each = utilityData
					} else {
						/** String representing the unique return value of the utility. */
						const utilityDataJson = JSON.stringify(utilityData)

						if (lastUtilityDataJson !== utilityDataJson) {
							lastUtilityDataJson = utilityDataJson

							processStyle(utilityData, selectors)

							lastUtilityDataJson = ''

							each = {}
						}
					}
				}

				/** Whether the current style is a condition (i.e. media or supports query). */
				const isCondition = name.charCodeAt(0) === 64

				each = isCondition && isArray(each) ? each : [each]

				for (const data of each) {
					// process either a declaration or a nested object of styles
					if (isDeclaration(data)) {
						// conditionally open any unopened group rules
						for (const groupRule of groupRules) {
							if (!groupRule[isOpen]) {
								cssText += groupRule
								cssText += '{'

								groupRule[isOpen] = true
							}
						}

						// conditionally open an unopened styled rule
						if (selectors.length && !selectors[isOpen]) {
							cssText += selectors.join(', ')
							cssText += '{'

							selectors[isOpen] = true
						}

						// write the current declaration
						cssText +=
							// write the condition name, or write the property as a custom property from a token, or as a kebab-cased property from a camel-cased property
							(isCondition ? name : /^\$/.test(name) ? '-' + name.replace(/\$/g, '-') : name.replace(/[A-Z]/g, ($0) => '-' + $0.toLowerCase())) +
							(isCondition ? ' ' : ':') +
							// write the value as string, conditionally converted as a number into a px, or as a token resolved into a custom property
							(typeof data === 'number' && !isPossiblyUnitless(name) && data
								? data + 'px'
								: String(data).replace(/\$[$-\w]+/g, (token) => 'var(-' + (!/.\$/.test(token) && name in themeMap ? '-' + themeMap[name] : '') + token.replace(/\$/g, '-') + ')')) +
							';'
					} else {
						/** Process CSS from a nested object of styles. */
						const processNestedGroup = (
							/** Whether the current group is a condition (i.e. media or supports query). */
							isConditionGroup,
							/** Prelude of the current group. */
							groupPrelude,
							/** Styles of the current group. */
							groupStyles,
						) => {
							/** Nesting index of the current group. */
							const groupIndex = isConditionGroup ? groupRules.push(Object(groupPrelude)) : groupRules.length

							// conditionally close a styled rule
							if (selectors.length && selectors[isOpen]) {
								cssText += '}'

								selectors[isOpen] = false
							}

							processStyle(groupStyles, isConditionGroup ? selectors : selectors.length ? getResolvedSelectors(selectors, groupPrelude.split(splitByComma)) : groupPrelude.split(splitByComma))

							// close any deeper groups
							if (isConditionGroup && groupIndex) {
								for (const deeperGroupRules of groupRules.splice(groupIndex - 1)) {
									cssText += '}'

									deeperGroupRules[isOpen] = false
								}
							}
						}

						// process either conditional styles or nested rules
						if (name === 'when') {
							for (const conditionName in data) {
								// process either named conditions or inlined conditions
								if (conditionName in conditions) {
									processNestedGroup(true, conditions[conditionName], data[conditionName])
								} else {
									processNestedGroup(true, conditionName, data[conditionName])
								}
							}
						} else {
							processNestedGroup(isCondition, name, data)
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
		processStyle(style, [])

		return cssText
	}

	return getComputedCss
}

export default createGetComputedCss
