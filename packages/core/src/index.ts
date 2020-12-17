import CssTextHash from './lib/CssTextHash'
import getHashString from './lib/getHashString'
import getResolvedStyles from './lib/getResolvedStyles'
import getThemeAsCustomProperties from './lib/getThemeAsCustomProperties'

const factory = (init?: StyledSheetFactoryInit) => create(Object(init))

/** Returns a new StyledSheet. */
const create = (init: StyledSheetFactoryInit) => {
	const sheet = Object.create(null)

	sheet.conditions = Object(init?.conditions)
	sheet.prefix = init?.prefix == null ? '' : String(init.prefix)
	sheet.properties = Object(init?.properties)

	let cssTextImport = Object.create(CssTextHash)
	let cssTextTheme = Object.create(CssTextHash)
	let cssTextGlobal = Object.create(CssTextHash)
	let cssTextRules = Object.create(CssTextHash)

	/** Returns a new StyledRule. */
	sheet.css = (...inits: anyobject[]) => {
		const rule = (...inits: anyobject[]) => create(...inits)

		rule.toString = () => {
			if (!cssTextRules[rule.className]) {
				cssTextRules[rule.className] = cssTextRule
			}

			return rule.classNames.join(' ')
		}

		rule.classNames = ['']
		rule.variants = Object.create(null)

		const styles = Object.create(null)

		for (const each of inits) {
			const { classNames, variants, ...variantStyles } = Object(each)

			if (classNames) {
				rule.classNames.push(...classNames)

				Object.assign(styles, variantStyles)
				Object.assign(rule.variants, variants)
			} else {
				if (variants) {
					for (const name in variants) {
						rule.variants[name] = Object.create(null)

						for (const pair in variants[name]) {
							const variant = () => {
								cssTextRules[variant.className] = variant.cssText
								return variant.className
							}

							variant.className = sheet.prefix + getHashString(variants[name][pair])
							variant.selector = '.' + variant.className
							variant.cssText = getResolvedStyles(variants[name][pair], [variant.selector], [], sheet)
							variant.toString = rule.variants[name][pair] = variant
						}
					}
				}

				Object.assign(styles, variantStyles)
			}
		}

		rule.className = rule.classNames[0] = sheet.prefix + getHashString(styles)
		rule.selector = '.' + rule.className

		const cssTextRule = Object.create(CssTextHash)

		cssTextRule[rule.className] = getResolvedStyles(styles, [rule.selector], [], sheet)

		/** Returns a StyledExpression */
		const create = (init?: anyobject) => {
			const expression = (() => expression.className) as StyledExpression
			expression.classNames = [rule.toString()]
			expression.props = {}
			expression.toString = expression
			Object.defineProperties(expression, {
				className: {
					get: () => expression.classNames.join(' '),
				},
				selector: {
					get: () => expression.classNames.map(className => '.' + className),
				},
			})

			for (const name in init) {
				const pair = init[name]

				if (name in rule.variants) {
					if (pair in rule.variants[name]) {
						expression.classNames.push(rule.variants[name][pair]())
					}
				} else {
					expression.props[name] = pair
				}
			}

			return expression
		}

		return rule
	}

	/** Returns a new StyledTheme. */
	sheet.theme = (init: Theme) => {
		const theme = () => {
			cssTextTheme[theme.className] = theme.cssText
			return theme.className
		}
		theme.className = getHashString(init)
		theme.selector = '.' + theme.className
		theme.cssText = getResolvedStyles(getThemeAsCustomProperties(Object(init)), [theme.className], [], sheet)
		theme.toString = theme

		return theme
	}

	/** Stubbed in Production */
	sheet.clear = () => {
		cssTextImport = Object.create(CssTextHash)
		cssTextTheme = Object.create(CssTextHash)
		cssTextGlobal = Object.create(CssTextHash)
		cssTextRules = Object.create(CssTextHash)
	}

	sheet.global = (init: anyobject) => {
		for (const type in init) {
			const data = init[type]
			const hash = getHashString(data)

			if (type === '@import') {
				cssTextImport[hash] = getResolvedStyles(data, [], [type], sheet)
			} else if (type[0] === '@') {
				cssTextGlobal[hash] = getResolvedStyles(data, [], [type], sheet)
			} else {
				cssTextGlobal[hash] = getResolvedStyles(data, [type], [], sheet)
			}
		}
	}

	const themeCSS = getResolvedStyles(getThemeAsCustomProperties(Object(init?.theme)), [':root'], [], sheet)

	sheet.toString = () => '' + cssTextImport + themeCSS + cssTextTheme + cssTextGlobal + cssTextRules

	return sheet
}

export default factory
