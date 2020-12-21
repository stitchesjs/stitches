import cssHash from './lib/CssHash'
import getHashString from './lib/getHashString'
import getResolvedStyles from './lib/getResolvedStyles'
import getThemeAsCustomProperties from './lib/getThemeAsCustomProperties'
import { _StyledSheetFactory, TConditions, TTheme, IConfig, _StyledSheet } from './types'
export * from './types'

const factory = <Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = ''>(
	init?: IConfig<Conditions, Theme, Utils, Prefix>,
): _StyledSheet<Conditions, Theme, Utils> => create(Object(init) as any) as any

const noop = () => {}

const { create: createObject } = Object

/** Returns a new StyledSheet. */
const create = (init: StyledSheetFactoryInit) => {
	const sheet: StyledSheet = createObject(null)

	sheet.conditions = Object(init?.conditions)
	sheet.prefix = init?.prefix == null ? '' : String(init.prefix)
	sheet.properties = Object(init?.properties)

	const onGlobalUpdate = init?.onGlobal || noop
	const onStyledUpdate = init?.onStyled || noop
	const onThemedUpdate = init?.onThemed || noop

	/** Hash of import rules, whose values represent css imports.  */
	let cssOfImportRules = createObject(cssHash)

	/** Hash map of global rules whose values represent globally applied CSS.  */
	let cssOfGlobalRules = createObject(cssHash)

	/** Hash map of styled rules whose values represent the styles of style components.  */
	let cssOfStyledRules = createObject(cssHash)

	/** Hash map of themed rules whose values represent the custom properties of a theme.  */
	let cssOfThemedRules = createObject(cssHash)

	/** Returns a new styled rule. */
	sheet.css = (...inits: anyobject[]) => {
		const rule = (...inits: anyobject[]) => render(...inits)

		rule.toString = () => {
			if (!cssOfStyledRules[rule.className]) {
				cssOfStyledRules[rule.className] = cssTextRule
				onStyledUpdate(cssOfStyledRules)
			}

			return rule.classNames.join(' ')
		}

		rule.classNames = ['']
		rule.variants = createObject(null)

		const styles = createObject(null)

		for (const each of inits) {
			const { classNames, variants, ...variantStyles } = Object(each)

			if (classNames) {
				rule.classNames.push(...classNames)

				Object.assign(styles, variantStyles)
				Object.assign(rule.variants, variants)
			} else {
				if (variants) {
					for (const name in variants) {
						rule.variants[name] = createObject(null)

						for (const pair in variants[name]) {
							const variant = () => {
								cssOfStyledRules[variant.className] = variant.cssText
								onStyledUpdate(cssOfStyledRules)
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

		const cssTextRule = createObject(cssHash)

		cssTextRule[rule.className] = getResolvedStyles(styles, [rule.selector], [], sheet)

		/** Returns a StyledExpression */
		const render = (init?: anyobject) => {
			/** Returns the space-separated class names for the expression */
			const expression = ((() => expression.className) as unknown) as StyledExpression

			Object.assign(expression, {
				classNames: [rule.toString()],
				props: {},
				toString: expression,
				get className() {
					return expression.classNames.join(' ')
				},
				get selector() {
					return expression.classNames.map(className => '.' + className)
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
	sheet.theme = (
		/** Classname for the theme or theming tokens. */
		name: string | Theme,

		/** Theming tokens. */
		init?: Theme,
	) => {
		const themeInit: Theme = name == Object(name) ? (name as Theme) : Object(init)
		const className = init === themeInit ? String(name) : getHashString(init)

		const theme = () => {
			cssOfThemedRules[className] = theme.cssText
			onThemedUpdate(cssOfTheme, cssOfThemedRules)
			return className
		}

		theme.className = className
		theme.selector = '.' + className
		theme.cssText = getResolvedStyles(getThemeAsCustomProperties(themeInit), [theme.selector], [], sheet)
		theme.toString = theme

		return theme
	}

	/** Stubbed in Production */
	sheet.clear = () => {
		cssOfImportRules = createObject(cssHash)
		cssOfThemedRules = createObject(cssHash)
		cssOfGlobalRules = createObject(cssHash)
		cssOfStyledRules = createObject(cssHash)
	}

	sheet.global = (init: RuleStyles) => {
		const importStyles = createObject(null)
		const globalStyles = createObject(null)

		for (const type in init) {
			const data = init[type]
			const hash = getHashString(data)

			if (type[0] === '@') {
				if (type === '@import') {
					importStyles[hash] = getResolvedStyles({ [type]: data }, [], [], sheet)
				} else {
					globalStyles[hash] = getResolvedStyles({ [type]: data }, [], [type], sheet)
				}
			} else {
				globalStyles[hash] = getResolvedStyles(data as RuleStyles, [type], [], sheet)
			}
		}

		return () => {
			Object.assign(cssOfImportRules, importStyles)
			Object.assign(cssOfGlobalRules, globalStyles)
			onGlobalUpdate(cssOfImportRules, cssOfGlobalRules)
		}
	}

	let cssOfTheme = ''

	if (init?.theme) {
		cssOfTheme = getResolvedStyles(getThemeAsCustomProperties(Object(init.theme)), [':root'], [], sheet)
		onThemedUpdate(cssOfTheme, cssOfThemedRules)
	}

	sheet.toString = () => '' + cssOfImportRules + cssOfGlobalRules + cssOfTheme + cssOfThemedRules + cssOfStyledRules

	return sheet
}

export default factory
