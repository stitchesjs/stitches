import { from } from './Array.js'
import CssSet from './CssSet.js'
import Object, { assign, create } from './Object.js'
import ThemeToken from './ThemeToken.js'
import createGetComputedCss from './createGetComputedCss.js'
import defaultThemeMap from './defaultThemeMap.js'
import getCustomProperties from './getCustomProperties.js'
import getHashString from './getHashString.js'

/** Returns a new styled sheet and accompanying API. */
export default (init) => {
	init = Object(init)

	/** Named conditions (media and support queries). */
	const conditions = Object(init.conditions)

	/** Prefix added before all generated class names. */
	const prefix = init.prefix || 's'

	/** Attribute class names are set to on props. */
	const classProp = init.classProp || 'className'

	/** Returns a string of unnested CSS from an object of nestable CSS. */
	const getComputedCss = createGetComputedCss(Object(init.utils), Object(init.themeMap || defaultThemeMap), conditions)

	/** Collection of `@import` CSS rules. */
	const importRules = new CssSet(init.onImport)

	/** Collection of global CSS rules. */
	const globalRules = new CssSet(init.onGlobal)

	/** Collection of theming CSS rules. */
	const themedRules = new CssSet(init.onThemed)

	/** Collection of component CSS rules. */
	const styledRules = new CssSet(init.onStyled)

	/** Prepares global CSS and returns a function that enables the styles on the styled sheet. */
	const theme = (
		/** Identifier */
		className,
		/** Object of theme scales with inner token values. */
		theme,
	) => {
		/** CSS Selector */
		const selector = (className || ':root').replace(/^[A-Za-z-]/, `.${prefix}$&`)

		className = selector.slice(1)

		/** Computed CSS */
		const cssText = getComputedCss({
			[selector]: getCustomProperties(theme)
		})

		const expressThemedRule = () => {
			themedRules.addCss(cssText)

			return expressThemedRule
		}

		for (const scale in theme) {
			expressThemedRule[scale] = create(null)

			for (const token in theme[scale]) {
				expressThemedRule[scale][token] = new ThemeToken(theme[scale][token], token, scale)
			}
		}

		return assign(expressThemedRule, {
			toString() {
				return this.className
			},
			className,
			selector,
		})()
	}

	/** Returns a function that enables the styles on the styled sheet. */
	const global = (
		/** Styles representing global CSS. */
		initStyles,
		/** Value returned by toString */
		displayName = '',
	) => {
		/** List of global import styles. */
		const localImportRules = []

		/** List of global styles. */
		const localGlobalRules = []

		for (const name in initStyles) {
			const cssText = getComputedCss({ [name]: initStyles[name] })

				; (name === '@import' ? localImportRules : localGlobalRules).push(cssText)
		}

		return assign(() => {
			localImportRules.forEach(importRules.addCss, importRules)
			localGlobalRules.forEach(globalRules.addCss, globalRules)

			return displayName
		}, {
			displayName,
			toString() {
				return String(this())
			}
		})
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

		/** Composing rule, if present, otherwise an empty object. */
		const composer = Object(extendedStyle && initStyle)

		/** Unique class name for the current component. */
		const className = getHashString(prefix, style)

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
		const variants = assign(create(null), composer.variants)

		for (const name in variantsStyle) {
			variants[name] = assign(create(null), variants[name])

			for (const value in variantsStyle[name]) {
				const variantStyle = variantsStyle[name][value]
				const variantClassName = className + getHashString('', variantStyle) + '--' + name + '-' + value
				const variantSelector = '.' + variantClassName
				const variantCssText = getComputedCss({ [variantSelector]: variantStyle })

				const conditionVariants = create(null)

				const compose = variants[name][value]

				variants[name][value] = condition => {
					const classNames = (compose ? compose(condition) : []).concat(variantClassName)

					if (condition != null) {
						if (!conditionVariants[condition]) {
							const conditionalVariantClassName = (conditionVariants[condition] = variantClassName + '--' + getHashString('', condition))
							const conditionalVariantSelector = '.' + conditionalVariantClassName
							const conditionalVariantCssText = getComputedCss({ [condition]: { [conditionalVariantSelector]: variantStyle } })

							variantRules.addCss(conditionalVariantCssText)
						}

						return conditionVariants[condition]
					} else {
						variantRules.addCss(variantCssText)
					}

					return classNames
				}
			}
		}

		styledRules.addCss(primaryRules).addCss(variantRules).addCss(inlinedRules)

		function classNames() {
			const classNames = (composer.classNames ? composer.classNames() : []).concat(className)

			primaryRules.addCss(cssText)

			return classNames
		}

		/** Returns an expression of the current styled rule. */
		return assign(
			function (
				/** Props used to determine the expression of the current styled rule. */
				initProps
			) {
				const { css: inlineStyle, ...props } = Object(initProps)

				let expressClassNames = new Set(classNames())

				if (classProp in props) {
					String(props[classProp]).split(/\s+/).forEach(expressClassNames.add, expressClassNames)

					delete props[classProp]
				}

				for (const propName in props) {
					if (propName in variants) {
						const propValue = props[propName]
						const variant = variants[propName]

						delete props[propName]

						// apply any matching variant
						if (propValue in variant) {
							variant[propValue]().forEach(expressClassNames.add, expressClassNames)
						} else {
							// conditionally apply any matched conditional variants
							for (const innerName in propValue) {
								const innerValue = propValue[innerName]
								const condition = conditions[innerName] || innerName

								if (innerValue in variant) {
									variant[innerValue](condition).forEach(expressClassNames.add, expressClassNames)
								}
							}
						}
					}
				}

				if (inlineStyle) {
					const inlineRuleClassName = className + getHashString('', inlineStyle) + '--css'
					const inlineRuleSelector = '.' + inlineRuleClassName
					const inlineRuleCssText = getComputedCss({ [inlineRuleSelector]: inlineStyle })

					inlinedRules.addCss(inlineRuleCssText)

					expressClassNames.add(inlineRuleClassName)
				}

				expressClassNames = from(expressClassNames)

				return {
					toString() {
						return this.className
					},
					className: props[classProp] = expressClassNames.join(' '),
					selector: '.' + expressClassNames.join('.'),
					props,
				}
			},
			{
				toString() {
					return String(this())
				},
				className,
				classNames,
				cssText,
				selector,
				style,
				variants,
			}
		)
	}

	const defaultThemed = theme(':root', init.theme)

	assign(theme, defaultThemed)

	return {
		global,
		keyframes,
		css,
		theme,
		/** Clears all rules, conditionally runs any `onResets` callbacks, and then restores the initial theme. */
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

export { defaultThemeMap }
