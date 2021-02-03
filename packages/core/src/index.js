import { from } from './Array.js'
import CssSet from './CssSet.js'
import Object, { assign, create } from './Object.js'
import ThemeToken from './ThemeToken.js'
import createGetComputedCss from './createGetComputedCss.js'
import defaultThemeMap from './defaultThemeMap.js'
import getCustomProperties from './getCustomProperties.js'
import getHashString from './getHashString.js'

/** Returns a new styled sheet and accompanying API. */
const createCss = (init) => {
	init = Object(init)

	/** Named conditions (media and support queries). */
	const conditions = Object(init.conditions)

	/** Prefix added before all generated classes. */
	const prefix = init.prefix || ''

	/** Class attribute to apply styled rules to. */
	const classProp = init.classProp || 'className'

	/** Returns a string of unnested CSS from an object of nestable CSS. */
	const getComputedCss = createGetComputedCss(Object(init.utils), Object(init.themeMap || defaultThemeMap), conditions)

	const importRules = new CssSet(init.onImport)
	const globalRules = new CssSet(init.onGlobal)
	const themedRules = new CssSet(init.onThemed)
	const styledRules = new CssSet(init.onStyled)

	/** Prepares global CSS and returns a function that enables the styles on the styled sheet. */
	const theme = (
		/** CSS Selector */
		className,
		/** Object of theme scales with inner token values. */
		theme,
	) => {
		/** CSS Selector */
		const query = (className || ':root').replace(/^[A-Za-z-]/, '.$&')

		/** Computed CSS */
		const cssText = getComputedCss({ [query]: getCustomProperties(theme) })

		const expressThemedRule = () => {
			themedRules.add(cssText)

			return expressThemedRule
		}

		for (const scale in theme) {
			expressThemedRule[scale] = create(null)

			for (const token in theme[scale]) {
				expressThemedRule[scale][token] = new ThemeToken(theme[scale][token], token, scale)
			}
		}

		return assign(expressThemedRule, { className, query, toString: () => className })()
	}

	/** Returns a function that enables the styles on the styled sheet. */
	const global = (
		/** Styles representing global CSS. */
		initStyles,
		/** Value returned by toString */
		id = '',
	) => {
		/** List of global import styles. */
		const localImportRules = []

		/** List of global styles. */
		const localGlobalRules = []

		for (const name in initStyles) {
			const cssText = getComputedCss({ [name]: initStyles[name] })

			;(name === '@import' ? localImportRules : localGlobalRules).push(cssText)
		}

		return assign(() => {
			localImportRules.forEach(importRules.add, importRules)
			localGlobalRules.forEach(globalRules.add, globalRules)

			return id
		}, { toString() { return this() } })
	}

	/** Returns a function that enables the keyframe styles on the styled sheet. */
	const keyframes = (
		/** Styles representing global CSS. */
		initStyles,
	) => {
		/** Unique name representing the current keyframes rule. */
		const keyframeRuleName = prefix + getHashString(initStyles)

		return global({ ['@keyframes ' + keyframeRuleName]: initStyles }, keyframeRuleName)
	}

	/** Prepares component CSS and returns a function that enables the styles on the styled sheet. */
	const css = (
		/** Styles representing component CSS, or a component to be extended. */
		initStyles,
		/** Styles representing component CSS, if extending a component. */
		moreStyles,
	) => {
		const { variants: variantsStyles, ...styles } = Object(moreStyles || initStyles)

		/** Extended rule or an empty object. */
		const extendRule = Object(moreStyles && initStyles)

		/** Unique classname representing the current styled rule. */
		const className = prefix + getHashString(styles)

		/** List of unique classnames representing the current styled rule. */
		const classNames = (extendRule.classNames || []).concat(className)

		/** Selector variation of the current unique classname. */
		const query = '.' + className

		/** CSS styles representing the current styled rule. */
		const cssText = getComputedCss({ [query]: styles })

		/** Change event registered with updates to the primary, variant, or inlined rules of the component. */
		const onChange = styledRules.onChange && (() => styledRules.onChange(styledRules))

		const primaryRules = new CssSet(onChange)
		const variantRules = new CssSet(onChange)
		const inlinedRules = new CssSet(onChange)

		/** Map of variant groups containing variant classnames and styled rules. */
		const variants = assign(create(null), extendRule.variants)

		for (const name in variantsStyles) {
			variants[name] = assign(create(null), variants[name])

			for (const value in variantsStyles[name]) {
				const variantStyles = variantsStyles[name][value]
				const variantClassName = className + '-' + name + '-' + value
				const variantSelector = '.' + variantClassName
				const variantCssText = getComputedCss({ [variantSelector]: variantStyles })

				const conditionVariants = create(null)

				variants[name][value] = (condition) => {
					if (condition !== undefined) {
						if (!conditionVariants[condition]) {
							const conditionalVariantClassName = (conditionVariants[condition] = variantClassName + '-' + getHashString(condition))
							const conditionalVariantSelector = '.' + conditionalVariantClassName
							const conditionalVariantCssText = getComputedCss({ [condition]: { [conditionalVariantSelector]: variantStyles } })

							variantRules.add(conditionalVariantCssText)
						}

						return conditionVariants[condition]
					} else {
						variantRules.add(variantCssText)
					}

					return variantClassName
				}
			}
		}

		const toString = () => query

		/** Returns an expression of the current styled rule. */
		return assign((
			/** Props used to determine the expression of the current styled rule. */
			initProps,
		) => {
			styledRules.add(primaryRules)
			styledRules.add(variantRules)
			styledRules.add(inlinedRules)

			primaryRules.add(cssText)

			const { css: inlineStyles, ...props } = Object(initProps)

			const classList = new Set(classNames)

			if (classProp in props) {
				String(props[classProp]).split(/\s+/).forEach(classList.add, classList)

				delete props[classProp]
			}

			for (const propName in props) {
				if (propName in variants) {
					const styledRuleVariant = variants[propName]
					const propValue = props[propName]

					delete props[propName]

					// apply any matching variant
					if (propValue in styledRuleVariant) {
						classList.add(styledRuleVariant[propValue]())
					} else {
						// conditionally apply any matched conditional variants
						for (const innerPropName in propValue) {
							const condition = conditions[innerPropName] || innerPropName
							const innerPropValue = propValue[innerPropName]

							if (innerPropValue in styledRuleVariant) {
								classList.add(styledRuleVariant[innerPropValue](condition))
							}
						}
					}
				}
			}

			if (inlineStyles) {
				const inlineRuleClassName = getHashString(inlineStyles)
				const inlineRuleSelector = '.' + inlineRuleClassName
				const inlineRuleCssText = getComputedCss({ [inlineRuleSelector]: inlineStyles })

				inlinedRules.add(inlineRuleCssText)

				classList.add(inlineRuleClassName)
			}

			props[classProp] = from(classList).join(' ')

			return { props, toString }
		}, { className, classNames, query, variants, toString })
	}

	const defaultThemed = theme('', init.theme)

	assign(theme, defaultThemed)

	return {
		global,
		keyframes,
		css,
		theme,
		reset() {
			importRules.clear()
			themedRules.clear()
			globalRules.clear()
			styledRules.clear()

			init.onResets && init.onResets.call(this)

			defaultThemed()

			return this
		},
		toString: () => importRules + themedRules + globalRules + styledRules
	}
}

export default createCss
