/* eslint-disable */

import define from './lib/define'
import getResolvedStyles from './lib/getResolvedStyles'
import getHashString from './lib/getHashString'
import createThemeRule from './lib/createThemeRule'

/** Factory that returns a StyledSheet. */
const createCss: StyledSheetFactory = function createCss(init?: StyledSheetFactoryInit) {
	const opts = Object(init as StyledSheetFactoryOpts)

	const sheetConditions = Object(opts.conditions)
	const sheetGlobalRules = new Set() as Set<GlobalRule | ThemeRule>
	const sheetPrefix = opts.prefix == null ? '' : String(opts.prefix)
	const sheetProperties = Object(opts.properties)
	const sheetRules = new Set() as Set<StyledRule>
	const sheetTheme = createThemeRule(opts.theme)

	/** StyledSheet that returns a StyledRule. */
	const sheet: StyledSheet = define(function css(...inits: StyledSheetInit[]) {
		let opts = {} as StyledSheetOpts
		const superClassNames = inits.reduce((classNames, init) => {
			if (init.className) {
				classNames.push(init.className as string)
			} else {
				Object.assign(opts, init)
			}
			return classNames
		}, [] as string[])
		const { variants: v, ...s } = Object(opts as StyledSheetOpts)

		const ruleStyles = Object(s as RuleStyles)
		const ruleClassName = sheet.prefix + getHashString(JSON.stringify(ruleStyles))
		const ruleClassNames = [...superClassNames, ruleClassName]
		const ruleSelector = `.${ruleClassName}`
		const ruleVariants = Object(v)
		const ruleCssText = getResolvedStyles(ruleStyles, [ruleSelector], [], sheet)
		const variantCssTextMap = Object.create(null)
		const variantCssTextRenderedMap = Object.create(null)
		let ruleCssTextRendered = ''

		for (const variantName in ruleVariants) {
			const variantOptions = ruleVariants[variantName]

			for (const variantPair in variantOptions) {
				const variantClassName = `${ruleClassName}-${variantName}-${variantPair}`
				const variantSelector = `.${variantClassName}`
				const variantStyles = getResolvedStyles(variantOptions[variantPair], [variantSelector], [], sheet)
				variantCssTextMap[variantClassName] = variantStyles
			}
		}

		/** StyledRule that returns a StyledExpression. */
		const rule: StyledRule = define(function Rule(init?: StyledRuleInit) {
			// variants to express
			const opts = Object(init as StyledRuleOpts)
			const expressionClassNames = [...ruleClassNames]

			if (!ruleCssTextRendered) {
				ruleCssTextRendered = ruleCssText
			}

			for (const variantName in opts) {
				const variantClassName = `${ruleClassName}-${variantName}-${opts[variantName]}`
				const variantCssText = variantCssTextMap[variantClassName]
				if (variantCssText) {
					expressionClassNames.push(variantClassName)
					if (!variantCssTextRenderedMap[variantClassName]) {
						ruleCssTextRendered += variantCssTextRenderedMap[variantClassName] = variantCssText
					}
				}
			}

			const expressionClassName = expressionClassNames.length ? expressionClassNames.join(' ') : ruleClassName
			const expressionSelector = expressionClassNames.length ? `.${expressionClassNames.join('.')}` : ruleSelector

			/** StyledRule. */
			const expression: StyledExpression = {
				get className() {
					return expressionClassName
				},
				get classNames() {
					return expressionClassNames
				},
				get rule() {
					return rule
				},
				get selector() {
					return expressionSelector
				},
				toString() {
					return expressionClassName
				},
			}

			sheetRules.add(rule)

			return expression
		}, {
			toString() {
				sheetRules.add(rule)
				return ruleClassName
			},
			get className() {
				sheetRules.add(rule)
				return ruleClassName
			},
			get classNames() {
				sheetRules.add(rule)
				return ruleClassNames
			},
			get cssText() {
				return ruleCssTextRendered
			},
			get selector() {
				return ruleSelector
			},
			get sheet() {
				return sheet
			},
			get styles() {
				return ruleStyles
			},
			get variants() {
				return ruleVariants
			},
		})

		return rule
	}, {
		toString() {
			return sheet.cssText
		},
		get conditions() {
			return sheetConditions
		},
		get css() {
			return sheet
		},
		get cssText() {
			sheetTheme.sheet = sheet
			sheet.globalRules.add(sheetTheme)

			let cssText = ''

			for (const rule of sheetGlobalRules) {
				cssText += rule.cssText
			}

			for (const rule of sheetRules) {
				cssText += rule.cssText
			}

			return cssText
		},
		get globalRules() {
			return sheetGlobalRules
		},
		get prefix() {
			return sheetPrefix
		},
		get properties() {
			return sheetProperties
		},
		get rules() {
			return sheetRules
		},
		flush() {
			sheetGlobalRules.clear()
			sheetRules.clear()
		},
		global(styles: any) {
			const cssText = getResolvedStyles(styles, [], [], sheet)

			const rule: any = define(function () {
				sheetGlobalRules.add(rule)
			}, {
				cssText,
				get sheet() {
					return sheet
				},
				toString() {
					return cssText
				},
			})

			return rule
		},
		theme(init: object) {
			const themeClass = getHashString(JSON.stringify(init))
			const theme = createThemeRule(init)
			theme.root = '.' + themeClass
			theme.sheet = sheet
			return theme
		},
	})

	return sheet
}

export default createCss
