import { from } from './Array.js'
import Object, { assign, create } from './Object.js'
import CssSet from './CssSet.js'
import ThemeToken from './ThemeToken.js'
import createGetComputedCss from './createGetComputedCss.js'
import defaultThemeMap from './defaultThemeMap.js'
import getCustomProperties from './getCustomProperties.js'
import getHashString from './getHashString.js'

/** Returns a new styled sheet and accompanying API. */
export default (init) => {
	init = Object(init)

	/** Named conditions (media and support queries). */
	const conditions = assign({ initial: '@media all' }, init.conditions)

	/** Prefix added before all generated class names. */
	const prefix = init.prefix || 'sx'

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
		/** Class name */
		className,
		/** Object of theme scales with inner token values. */
		theme,
	) => {
		// class name is the first argument if it is a string, otherwise an empty string
		className = typeof className === 'string' ? className : ''

		// theme is the first argument if it is an object, otherwise the second argument as an object
		theme = className === Object(className) ? className : Object(theme)

		/** Custom property styles representing themed token values. */
		const customPropertyStyles = getCustomProperties(theme)

		// class name is either itself or the unique hash representing its styles
		className = className || getHashString(prefix, customPropertyStyles)

		/** CSS Selector */
		const selector = className.replace(/^\w/, '.$&')

		/** Computed CSS */
		const cssText = getComputedCss({ [selector]: customPropertyStyles })

		/** Themed Rule that activates styles on the styled sheet. */
		const expressThemedRule = assign(
			() => {
				themedRules.addCss(cssText)

				return expressThemedRule
			},
			{
				toString() {
					return expressThemedRule().className
				},
				className,
				selector,
			},
		)

		for (const scale in theme) {
			expressThemedRule[scale] = create(null)

			for (const token in theme[scale]) {
				expressThemedRule[scale][token] = new ThemeToken(theme[scale][token], token, scale)
			}
		}

		return expressThemedRule
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

		return assign(
			() => {
				localImportRules.forEach(importRules.addCss, importRules)
				localGlobalRules.forEach(globalRules.addCss, globalRules)

				return displayName
			},
			{
				displayName,
				toString() {
					return String(this())
				},
			},
		)
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
		const { variants: variantsStyle, compoundVariants, defaultVariants, ...style } = Object(extendedStyle || initStyle)

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
		const combineRules = new CssSet(onChange)
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

				variants[name][value] = (condition) => {
					const classNames = (compose ? compose(condition) : []).concat(variantClassName)

					if (condition != null) {
						if (!conditionVariants[condition]) {
							const conditionalVariantClassName = (conditionVariants[condition] = variantClassName + '--' + getHashString('', condition))
							const conditionalVariantCssText = getComputedCss({ [condition]: { ['.' + conditionalVariantClassName]: variantStyle } })

							variantRules.addCss(conditionalVariantCssText)
							classNames.push(conditionalVariantClassName)
						}
					} else {
						variantRules.addCss(variantCssText)
					}

					return classNames
				}
			}
		}

		styledRules.addCss(primaryRules).addCss(variantRules).addCss(combineRules).addCss(inlinedRules)

		function classNames() {
			const classNames = (composer.classNames ? composer.classNames() : []).concat(className)

			primaryRules.addCss(cssText)

			return classNames
		}

		/** Returns an expression of the current styled rule. */
		return assign(
			function (
				/** Props used to determine the expression of the current styled rule. */
				initProps,
			) {
				const { css: inlineStyle, ...props } = Object(initProps)

				let expressClassNames = new Set(classNames())

				for (const propName in defaultVariants)
					if (!(propName in props) && propName in variants) {
						props[propName] = defaultVariants[propName]
					}

				if (classProp in props) {
					String(props[classProp]).split(/\s+/).forEach(expressClassNames.add, expressClassNames)

					delete props[classProp]
				}

				for (const compound of [].concat(compoundVariants || [])) {
					const { css: compoundStyle, ...compounders } = Object(compound)

					let appliedCompoundStyle = compoundStyle
					let appliedConditions = new Set()

					if (
						Object.keys(compounders).every((name) => {
							if (name in props) {
								const propValue = props[name]
								const compounderValue = compounders[name]
								if (propValue == compounderValue) return true
								if (propValue === Object(propValue)) {
									for (const innerName in propValue) {
										const innerValue = propValue[innerName]
										const condition = conditions[innerName] || innerName
										if (compounderValue == innerValue) {
											appliedCompoundStyle = { [condition]: appliedCompoundStyle }
										}
									}
									return true
								}
							}
						})
					) {
						const compoundClassName = className + getHashString('', appliedCompoundStyle) + '--comp'
						const compoundCssText = getComputedCss({ ['.' + compoundClassName]: appliedCompoundStyle })

						combineRules.addCss(compoundCssText)
						expressClassNames.add(compoundClassName)
					}
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
					className: (props[classProp] = expressClassNames.join(' ')),
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
				variants,
			},
		)
	}

	assign(theme, theme(':root', init.theme)())

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

			theme.toString()

			return this
		},
		toString: () => importRules + themedRules + globalRules + styledRules,
	}
}

export { defaultThemeMap }
