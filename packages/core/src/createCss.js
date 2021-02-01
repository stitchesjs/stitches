import Object, { create } from './Object'
import createGetComputedCss from './createGetComputedCss'
import getCustomProperties from './getCustomProperties'
import getHashString from './getHashString'

/** Returns a new styled sheet and accompanying API. */
const createCss = (init) => {
	init = Object(init)

	/** Named conditions (media and support queries). */
	const conditions = Object(init.conditions)

	/** Prefix added before all generated classes. */
	const prefix = init.prefix == null ? '' : String(init.prefix)

	/** Returns a string of unnested CSS from an object of nestable CSS. */
	const getComputedCss = createGetComputedCss(Object(init.utils), Object(init.themeMap), conditions)

	/** Prepares global CSS and returns a function that enables the styles on the styled sheet. */
	const createThemedRule = (
		/** CSS Selector */
		selector,
		/** Object of theme scales with inner token values. */
		theme
	) => getComputedCss(getCustomProperties(theme), [selector], [])

	/** Returns a function that enables the styles on the styled sheet. */
	const createGlobalRule = (
		/** Styles representing global CSS. */
		initStyles
	) => {
		/** List of global import styles. */
		let importRuleCssTexts = []

		/** List of global styles. */
		let globalRuleCssTexts = []

		for (const name in initStyles) {
			/** @type {number | string | Styles} */
			const style = initStyles[name]

			if (name === '@import') {
				importRuleCssTexts.push(getComputedCss({ [name]: style }, [], []))
			} else if (name.charCodeAt(0) === 64) {
				globalRuleCssTexts.push(getComputedCss({ [name]: style }, [], []))
			} else {
				globalRuleCssTexts.push(getComputedCss(style, [name], []))
			}
		}

		return [importRuleCssTexts, globalRuleCssTexts]
	}

	/** Prepares component CSS and returns a function that enables the styles on the styled sheet. */
	const createStyledRule = (
		/** Styles representing component CSS. */
		initStyles
	) => {
		// @todo implement extensions
		let { variants: variantsStyles, ...styles } = initStyles

		/** @type {string} Unique classname representing the current styled rule. */
		const styledRuleClassName = prefix + getHashString(styles)

		/** @type {string} CSS styles representing the current styled rule. */
		const styledRuleCssText = getComputedCss(styles, ['.' + styledRuleClassName], [])

		/** @type {{ [name: string]: { [value: string]: { className: string, cssText: string, when: { [key: string]: { className: string, cssText: string } } } } }} */
		const styledRuleVariants = create(null)

		/** @type {{ [key: string]: string }} */
		const inlineCssTextByClassName = create(null)

		for (const name in variantsStyles) {
			styledRuleVariants[name] = create(null)

			for (const value in variantsStyles[name]) {
				const variantStyles = variantsStyles[name][value]
				const variantClassName = styledRuleClassName + '-' + getHashString(variantStyles)

				styledRuleVariants[name][value] = [variantClassName, getComputedCss(variantStyles, ['.' + variantClassName], []), create(null)]
			}
		}

		/** Returns an expression of the current styled rule. */
		const styledRule = (
			/** Props used to determine the expression of the current styled rule. */
			initProps
		) => {
			const { css: inlineStyles, ...props } = Object(initProps)

			const classNames = props.className == null ? [styledRuleClassName] : String(props.className).trim().split(/\s+/).concat(styledRuleClassName)
			const variantCssTexts = []

			for (const propName in props) {
				if (propName in styledRuleVariants) {
					const styledRuleVariant = styledRuleVariants[propName]
					const propValue = props[propName]

					delete props[propName]

					if (propValue in styledRuleVariant) {
						const [className, cssText] = styledRuleVariant[propValue]

						classNames.push(className)
						variantCssTexts.push(cssText)
					} else {
						for (const innerPropName in propValue) {
							const condition = conditions[innerPropName] || innerPropName
							const innerPropValue = propValue[innerPropName]

							if (innerPropValue in styledRuleVariant) {
								const [, , conditionalVariantRules] = styledRuleVariant[innerPropValue]

								if (!(condition in conditionalVariantRules)) {
									/** ... */
									const conditionalVariantStyles = {
										[condition]: variantsStyles[propName][innerPropValue],
									}

									/** ... */
									const className = styledRuleClassName + '-' + getHashString(conditionalVariantStyles)

									conditionalVariantRules[condition] = [className, getComputedCss(conditionalVariantStyles, ['.' + className], [])]
								}

								const [className, cssText] = conditionalVariantRules[condition]

								classNames.push(className)
								variantCssTexts.push(cssText)
							}
						}
					}
				}
			}

			let inlineCssText = ''

			if (inlineStyles) {
				const inlineRuleClassName = getHashString(inlineStyles)

				classNames.push(inlineRuleClassName)

				if (!(inlineRuleClassName in inlineCssTextByClassName)) {
					inlineCssTextByClassName[inlineRuleClassName] = getComputedCss(inlineStyles, ['.' + inlineRuleClassName], [])
				}

				inlineCssText = inlineCssTextByClassName[inlineRuleClassName]
			}

			props.className = classNames.join(' ')

			return [props, styledRuleCssText, variantCssTexts, inlineCssText]
		}

		styledRule.className = styledRuleClassName

		return styledRule
	}

	return [createThemedRule, createGlobalRule, createStyledRule]
}

export default createCss
