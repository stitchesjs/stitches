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

	/** Prefix added before all generated class names. */
	const prefix = init.prefix || 's'

	/** Attribute class names are set to on props. */
	const classProp = init.classProp || 'class'

	/** Property used for stringification. */
	const stringProp = init.stringProp || 'className'

	/** Returns a string of unnested CSS from an object of nestable CSS. */
	const getComputedCss = createGetComputedCss(Object(init.utils), Object(init.themeMap || defaultThemeMap), conditions)

	const importRules = new CssSet(init.onImport)
	const globalRules = new CssSet(init.onGlobal)
	const themedRules = new CssSet(init.onThemed)
	const styledRules = new CssSet(init.onStyled)

	function toString() {
		return this[stringProp]
	}

	function toCallString() {
		return String(this())
	}

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
			themedRules.css(cssText)

			return expressThemedRule
		}

		for (const scale in theme) {
			expressThemedRule[scale] = create(null)

			for (const token in theme[scale]) {
				expressThemedRule[scale][token] = new ThemeToken(theme[scale][token], token, scale)
			}
		}

		return assign(expressThemedRule, { className, query, toString })()
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
			localImportRules.forEach(importRules.css, importRules)
			localGlobalRules.forEach(globalRules.css, globalRules)

			return id
		}, { toString: toCallString })
	}

	/** Returns a function that enables the keyframe styles on the styled sheet. */
	const keyframes = (
		/** Styles representing global CSS. */
		initStyles,
	) => {
		/** Unique name representing the current keyframes rule. */
		const keyframeRuleName = getHashString(prefix, initStyles)

		return global({ ['@keyframes ' + keyframeRuleName]: initStyles }, keyframeRuleName)
	}

	/** Prepares a component of css and returns a function that activates the css on the current styled sheet. */
	const css = (
		/** Styles for the current component, or the component to be extended. */
		initStyle,
		/** Styles for the current component, when extending another component. */
		extendedStyle,
	) => {
		const { variants: variantsStyle, ...style } = Object(extendedStyle || initStyle)

		/** Extended rule or an empty object. */
		const extendRule = Object(extendedStyle && initStyle)

		/** Unique class name for the current component. */
		const className = getHashString(prefix, style)

		/** List of unique class names for the current component. */
		const classNames = (extendRule.classNames || []).concat(className)

		/** Unique css selector for the current component. */
		const selector = '.' + className

		/** CSS styles representing the current component. */
		const cssText = getComputedCss({ [selector]: style })

		/** Change event registered with updates to the primary, variant, or inlined rules of the component. */
		const onChange = styledRules.onChange && (() => styledRules.onChange(styledRules))

		const primaryRules = new CssSet(onChange)
		const variantRules = new CssSet(onChange)
		const inlinedRules = new CssSet(onChange)

		/** Map of variant groups containing variant class names and styled rules. */
		const variants = assign(create(null), extendRule.variants)

		for (const name in variantsStyle) {
			variants[name] = assign(create(null), variants[name])

			for (const value in variantsStyle[name]) {
				const variantStyle = variantsStyle[name][value]
				const variantClassName = className + getHashString('', variantStyle) + '--' + name + '-' + value
				const variantSelector = '.' + variantClassName
				const variantCssText = getComputedCss({ [variantSelector]: variantStyle })

				const conditionVariants = create(null)

				variants[name][value] = (condition) => {
					if (condition !== undefined) {
						if (!conditionVariants[condition]) {
							const conditionalVariantClassName = (conditionVariants[condition] = variantClassName + '--' + getHashString('', condition))
							const conditionalVariantSelector = '.' + conditionalVariantClassName
							const conditionalVariantCssText = getComputedCss({ [condition]: { [conditionalVariantSelector]: variantStyle } })

							variantRules.css(conditionalVariantCssText)
						}

						return conditionVariants[condition]
					} else {
						variantRules.css(variantCssText)
					}

					return variantClassName
				}
			}
		}

		styledRules.css(primaryRules)
		styledRules.css(variantRules)
		styledRules.css(inlinedRules)

		/** Returns an expression of the current styled rule. */
		return assign(
			(
				/** Props used to determine the expression of the current styled rule. */
				initProps
			) => {
				primaryRules.css(cssText)

				const { css: inlineStyle, ...props } = Object(initProps)

				let expressClassNames = new Set(classNames)

				if (classProp in props) {
					String(props[classProp]).split(/\s+/).forEach(expressClassNames.css, expressClassNames)

					delete props[classProp]
				}

				for (const propName in props) {
					if (propName in variants) {
						const propValue = props[propName]
						const variant = variants[propName]

						delete props[propName]

						// apply any matching variant
						if (propValue in variant) {
							expressClassNames.add(variant[propValue]())
						} else {
							// conditionally apply any matched conditional variants
							for (const innerName in propValue) {
								const innerValue = propValue[innerName]
								const condition = conditions[innerName] || innerName

								if (innerValue in variant) {
									expressClassNames.add(variant[innerValue](condition))
								}
							}
						}
					}
				}

				if (inlineStyle) {
					const inlineRuleClassName = className + getHashString('', inlineStyle) + '--css'
					const inlineRuleSelector = '.' + inlineRuleClassName
					const inlineRuleCssText = getComputedCss({ [inlineRuleSelector]: inlineStyle })

					inlinedRules.css(inlineRuleCssText)

					expressClassNames.add(inlineRuleClassName)
				}

				expressClassNames = from(expressClassNames)

				return {
					toString,
					props,
					className: props[classProp] = expressClassNames.join(' '),
					classNames: expressClassNames,
					selector: '.' + expressClassNames.join('.'),
				}
			},
			{
				toString: toCallString,
				className,
				classNames,
				cssText,
				selector,
				style,
				variants,
			}
		)
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

export default assign(createCss, { defaultThemeMap })
