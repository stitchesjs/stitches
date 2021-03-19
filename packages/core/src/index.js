import { assign, create, createComponent } from './Object.js'
import { createStringify } from './createStringify.js'
import { from } from './Array.js'
import { ownKeys } from './Reflect.js'
import StringSet from './StringSet.js'
import defaultThemeMap from './defaultThemeMap.js'
import getCustomProperties from './getCustomProperties.js'
import getHashString from './getHashString.js'
import ThemeToken from './ThemeToken.js'
import { $$composers } from './Symbol.js'
import StringArray from './StringArray.js'
import defaultInsertionMethod from './defaultInsertionMethod.js'

/** Returns a new styled sheet and accompanying API. */
const createCss = (init) => {
	init = Object(init)

	/** Named media queries. */
	const media = assign({ initial: 'all' }, init.media)

	/** Theme tokens enabled by default on the styled sheet. */
	const themeInit = Object(init.theme)

	const themeMap = Object(init.themeMap || defaultThemeMap)

	/** CSS properties corresponding to functions that accept CSS values and return new CSS object fragments. */
	const utils = Object(init.utils)

	/** Names of variants passed through to props. */
	const passThru = new Set([].concat(init.passthru || ['as', 'className']))

	/** Prefix added before all generated class names. */
	const prefix = init.prefix || 'sx'

	const insertionMethod = (typeof init.insertionMethod === 'function' ? init.insertionMethod : defaultInsertionMethod)(init)

	const emptyClassName = '03kze'

	const config = {
		theme: themeInit,
		media,
		prefix,
		themeMap,
		utils,
	}

	/** Returns a string of unnested CSS from an object of nestable CSS. */
	const stringify = createStringify(config)

	/** Collection of `@import` CSS rules. */
	const importCss = new StringSet()

	/** Collection of theming CSS rules. */
	const themedCss = new StringSet()

	/** Collection of global CSS rules. */
	const globalCss = new StringSet()

	/** Collection of component CSS rules. */
	const styledCss = new StringSet()

	const unitedCss = new StringSet([importCss, themedCss, globalCss, styledCss])

	let currentCssText = ''

	const update = () => {
		const nextUpdate = from(unitedCss).join('')

		if (currentCssText !== nextUpdate) {
			insertionMethod((currentCssText = nextUpdate))
		}
	}

	/** Prepares global CSS and returns a function that enables the styles on the styled sheet. */
	const theme = (
		/** Class name */
		className,
		/** Object of theme scales with inner token values. */
		theme,
	) => {
		// theme is the first argument if it is an object, otherwise the second argument as an object
		theme = className === Object(className) ? className : Object(theme)

		// class name is the first argument if it is a string, otherwise an empty string
		className = typeof className === 'string' ? className : ''

		/** Custom property styles representing themed token values. */
		const customPropertyStyles = getCustomProperties(theme)

		// class name is either itself or the unique hash representing its styles
		className = className || getHashString(prefix, customPropertyStyles)

		/** CSS Selector */
		const selector = className.replace(/^\w/, '.$&')

		/** Computed CSS */
		const cssText = className === prefix + emptyClassName ? '' : stringify({ [selector]: customPropertyStyles })

		const expression = createComponent(create(null), 'className', {
			className,
			selector,
		})

		for (const scale in theme) {
			expression[scale] = create(null)

			for (const token in theme[scale]) {
				expression[scale][token] = new ThemeToken(theme[scale][token], token, scale)
			}
		}

		return createComponent(expression, 'className', {
			get className() {
				const { hasChanged } = themedCss

				themedCss.add(cssText)

				if (hasChanged()) {
					update()
				}

				return className
			},
			selector,
		})
	}

	/** Returns a function that enables the styles on the styled sheet. */
	const global = (
		/** Styles representing global CSS. */
		style,
		/** Optional name */
		name = '',
	) => {
		/** List of global import styles. */
		const localImportCss = new StringSet()

		/** List of global styles. */
		const localGlobalCss = new StringSet()

		for (const name in style) {
			if (style[name] !== Object(style[name]) || ownKeys(style[name]).length) {
				const cssText = stringify({ [name]: style[name] })

				;(name === '@import' ? localImportCss : localGlobalCss).add(cssText)
			}
		}

		const expression = createComponent(create(null), 'name', { name })

		const express = createComponent(
			() => {
				let hasImportChanged = importCss.hasChanged
				let hasGlobalChanged = globalCss.hasChanged

				localImportCss.forEach((localImportCss) => {
					importCss.add(localImportCss)
				})

				localGlobalCss.forEach((localGlobalCss) => {
					globalCss.add(localGlobalCss)
				})

				if (hasImportChanged() || hasGlobalChanged()) {
					update()
				}

				return expression
			},
			'name',
			{
				get name() {
					return String(express())
				},
			},
		)

		return express
	}

	/** Returns a function that enables the keyframe styles on the styled sheet. */
	const keyframes = (
		/** Styles representing global CSS. */
		style,
	) => {
		/** Unique name representing the current keyframes rule. */
		const name = getHashString(prefix, style)

		return global({ ['@keyframes ' + name]: style }, name)
	}

	const createComposer = (initStyle) => {
		const primalCss = new StringSet()
		const variedCss = new StringArray()
		const inlineCss = new StringSet()

		const unitedCss = new StringSet([primalCss, variedCss, inlineCss])

		let { variants: singularVariants, compoundVariants, defaultVariants, ...style } = initStyle

		defaultVariants = Object(defaultVariants)

		const className = getHashString(prefix, initStyle)
		const selector = '.' + className
		const cssText = className === prefix + emptyClassName ? '' : stringify({ [selector]: style })

		styledCss.add(unitedCss)

		const variantProps = create(null)
		const variants = []
		const compounds = []

		for (const key in singularVariants) {
			for (const value in singularVariants[key]) {
				const css = singularVariants[key][value]

				compounds.push({
					[key]: value,
					css,
				})
			}
		}

		compounds.push(...(compoundVariants || []))

		for (const index in compounds) {
			const { css, ...variantConfig } = compounds[index]

			const variantConfigKeys = ownKeys(variantConfig)
			const variantConfigIndex = variantConfigKeys.length

			for (const variantKey of variantConfigKeys) {
				variantProps[variantKey] = variantProps[variantKey] || create(null)

				variantProps[variantKey][variantConfig[variantKey]] = true
			}

			const applyVariant = (variantInput, defaultVariants) => {
				variantInput = { ...variantInput }

				for (const defaultVariantName in defaultVariants) {
					if (variantInput[defaultVariantName] === undefined && !Object(variantProps[defaultVariantName])[variantInput[defaultVariantName]]) {
						variantInput[defaultVariantName] = defaultVariants[defaultVariantName]
					}
				}

				const variantMedia = new Set()

				if (
					variantConfigKeys.length &&
					variantConfigKeys.every((key) => {
						const value = variantInput[key]
						const compareValue = String(variantConfig[key])

						if (compareValue === String(value)) return true

						if (value === Object(value)) {
							for (const condition in value) {
								if (compareValue == String(value[condition]) && condition.charCodeAt(0) === 64) {
									variantMedia.add(condition)
									return true
								}
							}
						}
					})
				) {
					let conditionedCss = Object(css)

					for (const variantCondition of variantMedia) {
						conditionedCss = {
							[variantCondition]: conditionedCss,
						}
					}

					const variantClassName = className + getHashString('', conditionedCss) + '--' + (variantConfigIndex === 1 ? variantConfigKeys[0] + '-' + variantConfig[variantConfigKeys[0]] : 'c' + variantConfigIndex)
					const variantSelector = '.' + variantClassName
					const variantCssText = stringify({ [variantSelector]: conditionedCss })
					const variantCssByIndex = variedCss[variantConfigIndex - 1] || (variedCss[variantConfigIndex - 1] = new StringSet())

					variantCssByIndex.add(variantCssText)

					return variantClassName
				}
			}

			variants.push(applyVariant)
		}

		return {
			apply(props, classNames, defaultVariants) {
				const hasPrimalChanged = primalCss.hasChanged
				const hasVariedChanged = variedCss.hasChanged

				primalCss.add(cssText)

				if (props) {
					classNames.add(className)

					for (const applyVariant of variants) {
						const variantClassName = applyVariant(props, defaultVariants)

						if (variantClassName) {
							classNames.add(variantClassName)
						}
					}
				}

				if (hasPrimalChanged() || hasVariedChanged()) {
					styledCss.add(unitedCss)

					return true
				}
			},
			inline(css, classNames) {
				const inlineSuffix = getHashString('-', css)
				const inlineSelector = selector + inlineSuffix
				const inlineCssText = className === '-' + inlineSuffix ? '' : stringify({ [inlineSelector]: css })

				classNames.add(className + inlineSuffix)

				const { hasChanged } = inlineCss

				if (inlineCssText) {
					inlineCss.add(inlineCssText)
				}

				return hasChanged()
			},
			className,
			defaultVariants,
			selector,
			variantProps,
		}
	}

	const css = (...inits) => {
		let composers = []
		let composer
		let defaultVariants = create(null)

		for (const init of inits) {
			if (init === Object(init)) {
				if ($$composers in init) {
					for (const composer of init[$$composers]) {
						composers.push(composer)

						assign(defaultVariants, composer.defaultVariants)
					}
				} else {
					composers.push((composer = createComposer(init)))

					assign(defaultVariants, composer.defaultVariants)
				}
			}
		}

		composer = composer || createComposer({})

		return createComponent(
			(initProps) => {
				const { css, ...props } = Object(initProps)

				const classNames = new Set()

				let hasComposerChanged = false

				for (const composer of composers) {
					hasComposerChanged = composer.apply(props, classNames, defaultVariants) || hasComposerChanged
				}

				let hasInlineChanged

				if (css === Object(css)) {
					hasInlineChanged = composer.inline(css, classNames)
				}

				if (hasComposerChanged || hasInlineChanged) {
					update()
				}

				for (const variantName in composer.variantProps) {
					if (!passThru.has(variantName)) {
						delete props[variantName]
					}
				}

				if ('className' in props) {
					String(props.className).split(/\s+/).forEach(classNames.add, classNames)
				}

				const classNameSetArray = from(classNames)

				props.className = classNameSetArray.join(' ')

				return createComponent(create(null), 'className', {
					get [$$composers]() {
						return composers
					},
					className: props.className,
					props,
					selector: composer.selector,
				})
			},
			'className',
			{
				get [$$composers]() {
					return composers
				},
				/** Applies the primary composer and returns the class name. */
				get className() {
					if (composer.apply()) {
						update()
					}

					return composer.className
				},
				selector: composer.selector,
			},
		)
	}

	const defaultTheme = theme(':root', themeInit)

	const sheet = createComponent(
		{
			css,
			config,
			global,
			keyframes,
			prefix,
			reset() {
				importCss.clear()
				themedCss.clear()
				globalCss.clear()
				styledCss.clear()
				defaultTheme.className
				return sheet
			},
			theme: assign(theme, defaultTheme),
			get cssText() {
				return currentCssText
			},
			getCssString() {
				return currentCssText
			},
		},
		'cssText',
		{},
	)

	return sheet
}

const getReusableSheet = () => getReusableSheet.config || (getReusableSheet.config = createCss())
const css = (...args) => getReusableSheet().css(...args)
const global = (...args) => getReusableSheet().global(...args)
const keyframes = (...args) => getReusableSheet().keyframes(...args)

export { createCss as default, createCss, defaultThemeMap, css, global, keyframes }
