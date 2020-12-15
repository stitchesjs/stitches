/* eslint-disable */

import define from './lib/define'
import getHashString from './lib/getHashString'
import getResolvedStyles from './lib/getResolvedStyles'
import getUniqueId from './lib/getUniqueId'

/** Factory that returns a StyledSheet. */
const createCss: StyledSheetFactory = function createCss(init?: StyledSheetFactoryInit) {
	const opts = Object(init as StyledSheetFactoryOpts)

	const sheetConditions = Object(opts.conditions)
	const sheetPrefix = opts.prefix == null ? '' : String(opts.prefix)
	const sheetProperties = Object(opts.properties)
	const sheetThemeCssText = getResolvedStyles({ [':root']: createThemeCustomProperties(Object(opts.theme)) }, [], [], ({
		conditions: {},
		properties: {},
	} as unknown) as StyledSheet)

	const sheetGlobalCssTextSet: Set<string> = new Set([sheetThemeCssText])
	const sheetRulesCssTextSet: Set<string> = new Set()

	let sheetCssText = sheetThemeCssText
	let shouldUpdateSheetCssText = false

	/** StyledSheet that returns a StyledRule. */
	const sheet: StyledSheet = define(function createRule(...inits: StyledSheetInit[]) {
		const opts = {} as StyledSheetOpts

		const ruleClassNameSet: Set<string> = new Set()
		const ruleCssTextSet: Set<string> = new Set()
		const ruleVariants = Object.create(null)

		const cssTextByVariantClassName = Object.create(null)

		for (const init of inits) {
			if (init?.className) {
				ruleClassNameSet.add(init.className as string)
			} else {
				Object.assign(opts, init)
			}
		}

		const uniqueId = getUniqueId()
		const uniqueRe = RegExp(uniqueId, 'g')
		const { variants: variantsStylesMap, ...ruleStyles } = opts

		let className = uniqueId
		let cssText = getResolvedStyles(ruleStyles, [`.${className}`], [], sheet)

		className = `${sheet.prefix}${getHashString(cssText.replace(uniqueRe, ''))}`
		cssText = cssText.replace(uniqueRe, className)

		ruleClassNameSet.add(className)
		ruleCssTextSet.add(cssText)

		for (const variantName in variantsStylesMap) {
			ruleVariants[variantName] = Object.create(null)

			for (const variantPair in variantsStylesMap[variantName]) {
				const variantClassName = `${className}-${variantName}-${variantPair}`
				const variantCssText = getResolvedStyles(
					variantsStylesMap[variantName][variantPair],
					[`.${variantClassName}`],
					[],
					sheet,
				)

				ruleVariants[variantName][variantPair] = variantClassName
				cssTextByVariantClassName[variantClassName] = variantCssText
			}
		}

		const ruleClassNames = Array.from(ruleClassNameSet)
		const ruleClassName = ruleClassNames.join(' ')
		const ruleSelector = `.${ruleClassNames.join('.')}`

		/** StyledRule that returns a StyledExpression. */
		const rule: StyledRule = define(function createExpression(init?: StyledRuleInit) {
			const expressionClassNameSet = new Set(ruleClassNameSet)
			const expressionCssTextSet = new Set(ruleCssTextSet)

			for (const variantName in init) {
				const variantClassName = `${className}-${variantName}-${init[variantName]}`

				if (variantClassName in cssTextByVariantClassName) {
					expressionClassNameSet.add(variantClassName)
					expressionCssTextSet.add(cssTextByVariantClassName[variantClassName])
				}
			}

			const expressionClassNames = Array.from(expressionClassNameSet)
			const expressionClassName = expressionClassNames.join(' ')
			const expressionSelector = `.${expressionClassNames.join('.')}`

			/** StyledExpression. */
			const expression: StyledExpression = Object.freeze({
				className: expressionClassName,
				classNames: expressionClassNames,
				selector: expressionSelector,
				toString() {
					for (const cssText of expressionCssTextSet) {
						sheetRulesCssTextSet.add(cssText)
					}
					shouldUpdateSheetCssText = true
					return expressionClassName
				},
			})

			expression.toString()

			return expression
		}, {
			toString() {
				for (const cssText of ruleCssTextSet) {
					sheetRulesCssTextSet.add(cssText)
				}
				shouldUpdateSheetCssText = true
				return ruleClassName
			},
			classNames: ruleClassNames,
			className: ruleClassName,
			selector: ruleSelector,
			variants: ruleVariants,
		})

		return rule
	}, {
		clear() {
			sheetGlobalCssTextSet.clear()
			sheetRulesCssTextSet.clear()
		},
		toString() {
			if (shouldUpdateSheetCssText) {
				shouldUpdateSheetCssText = false
				sheetCssText = `${sheetThemeCssText}${Array.from(sheetRulesCssTextSet).join('')}${Array.from(
					sheetGlobalCssTextSet,
				).join('')}`
			}

			return sheetCssText
		},
		get css() {
			return sheet
		},
		global(styles: RuleStyles) {
			const globalCssText = getResolvedStyles(styles, [], [], sheet)

			const rule: GlobalRule = define(function () {
				sheetGlobalCssTextSet.add(globalCssText)
				shouldUpdateSheetCssText = true
				return ''
			}, {
				toString() {
					sheetGlobalCssTextSet.add(globalCssText)
					shouldUpdateSheetCssText = true
					return globalCssText
				},
			})

			return rule
		},
		theme(init: Theme) {
			const styles = { [':root']: createThemeCustomProperties(init) }

			let cssText = getResolvedStyles(styles, [], [], sheet)
			let className = getHashString(cssText)
			let selector = `.${className}`

			cssText = `${selector}${cssText.slice(5)}`

			const rule = define(function () {
				sheetGlobalCssTextSet.add(cssText)
				shouldUpdateSheetCssText = true
				return className
			}, {
				toString() {
					sheetGlobalCssTextSet.add(cssText)
					shouldUpdateSheetCssText = true
					return className
				},
				selector,
			})

			return rule
		},
		conditions: sheetConditions,
		prefix: sheetPrefix,
		properties: sheetProperties,
	})

	return sheet

	function createThemeCustomProperties(init: Theme) {
		const styles = {} as { [K in string]: number | string }

		for (const scaleName in init) {
			for (const tokenName in init[scaleName]) {
				styles[`\$${scaleName}-${tokenName}`] = init[scaleName][tokenName]
			}
		}

		return styles
	}
}

export default createCss
