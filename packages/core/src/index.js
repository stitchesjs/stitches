import { assign, create, createComponent, defineProperties, getOwnPropertyDescriptors } from './Object.js'
import { from, isArray } from './Array.js'
import { ownKeys } from './Reflect.js'
import StringSet from './StringSet.js'
import createGetComputedCss from './createGetComputedCss.js'
import deepMerge from './deepMerge.js'
import defaultThemeMap from './defaultThemeMap.js'
import getCustomProperties from './getCustomProperties.js'
import getHashString from './getHashString.js'
import ThemeToken from './ThemeToken.js'
import { $$composers, toPrimitive } from './Symbol.js'

/** Returns a new styled sheet and accompanying API. */
const createCss = (init) => {
	init = Object(init)

	/** Named conditions (media and support queries). */
	const conditions = assign({ initial: '@media all' }, init.conditions)

	/** Theme tokens enabled by default on the styled sheet. */
	const themeInit = Object(init.theme)

	const themeMap = Object(init.themeMap || defaultThemeMap)

	/** Properties corresponding to functions that take in CSS values and return aliased CSS declarations. */
	const utils = Object(init.utils)

	/** Names of variants passed through to props. */
	const passThru = new Set([].concat(init.passthru || ['as', 'className']))

	/** Prefix added before all generated class names. */
	const prefix = init.prefix || 'sx'

	const emptyClassName = getHashString('', {})

	const config = {
		theme: themeInit,
		conditions,
		prefix,
		themeMap,
		utils,
	}

	/** Returns a string of unnested CSS from an object of nestable CSS. */
	const getComputedCss = createGetComputedCss(config)

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
	let currentCssHead = null
	let currentCssNode = null

	const update = () => {
		const nextUpdate = from(unitedCss).join('')

		if (currentCssText !== nextUpdate) {
			currentCssText = nextUpdate

			if (typeof document === 'object') {
				if (!currentCssHead) currentCssHead = document.head || document.documentElement
				if (!currentCssNode) currentCssNode = document.getElementById('stitches') || assign(document.createElement('style'), { id: 'stitches' })
				if (!currentCssNode.parentNode) currentCssHead.prepend(currentCssNode)

				currentCssNode.textContent = nextUpdate
			}
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
		const cssText = className === prefix + emptyClassName ? '' : getComputedCss({ [selector]: customPropertyStyles })

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

		return createComponent(
			assign(() => {
				if (!themedCss.has(cssText)) {
					themedCss.add(cssText)
					update()
				}
				return expression
			}, expression),
			'className',
			{
				get className() {
					return this().className
				},
				selector,
			},
		)
	}

	/** Returns a function that enables the styles on the styled sheet. */
	const global = (
		/** Styles representing global CSS. */
		style,
	) => {
		/** List of global import styles. */
		const localImportCss = new StringSet()

		/** List of global styles. */
		const localGlobalCss = new StringSet()

		for (const name in style) {
			if (style[name] !== Object(style[name]) || ownKeys(style[name]).length) {
				const cssText = getComputedCss({ [name]: style[name] })

				;(name === '@import' ? localImportCss : localGlobalCss).add(cssText)
			}
		}

		const expression = createComponent(create(null), 'displayName', {
			displayName: '',
		})

		return createComponent(
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
			'displayName',
			expression,
		)
	}

	/** Returns a function that enables the keyframe styles on the styled sheet. */
	const keyframes = (
		/** Styles representing global CSS. */
		style,
	) => {
		/** Unique name representing the current keyframes rule. */
		const displayName = getHashString(prefix, style)

		return assign(global({ ['@keyframes ' + displayName]: style }), { displayName })
	}

	const css = (...inits) => {
		let composers = []
		let initStyle = {}
		let type = 'span'

		for (const init of inits) {
			if (init === Object(init)) {
				if (isArray(init[$$composers])) {
					// copy composers
					composers.push(...init[$$composers])
				} else if (Object === (init.constructor || Object)) {
					// merge styles
					deepMerge(initStyle, init)
				}
				// ignore any other object and continue
			} else {
				// set type
				type = String(init)
			}
		}

		const primalCss = new StringSet()
		const variedCss = defineProperties(
			[],
			getOwnPropertyDescriptors({
				get hasChanged() {
					const cssText = String(this)

					return () => cssText !== String(this)
				},
				[toPrimitive]() {
					return this.join('')
				},
				toString() {
					return this.join('')
				},
			}),
		)
		const inlineCss = new StringSet()
		const unitedCss = new StringSet([primalCss, variedCss, inlineCss])

		const { variants: singularVariants, compoundVariants, defaultVariants, ...style } = initStyle

		const className = getHashString(prefix, style)
		const selector = '.' + className
		const cssText = className === prefix + emptyClassName ? '' : getComputedCss({ [selector]: style })

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

			const applyVariant = (variantInput) => {
				variantInput = { ...variantInput }

				for (const defaultVariantName in Object(defaultVariants)) {
					if (variantInput[defaultVariantName] === undefined && !variantProps[defaultVariantName][variantInput[defaultVariantName]]) {
						variantInput[defaultVariantName] = defaultVariants[defaultVariantName]
					}
				}

				const variantConditions = new Set()
				if (
					variantConfigKeys.length &&
					variantConfigKeys.every((key) => {
						const value = variantInput[key]
						const compareValue = String(variantConfig[key])
						if (compareValue === String(value)) return true
						if (value === Object(value)) {
							for (const condition in value) {
								if (compareValue == String(value[condition])) {
									variantConditions.add(condition)
									return true
								}
							}
						}
					})
				) {
					let conditionedCss = Object(css)

					for (const variantCondition of variantConditions) {
						conditionedCss = { [variantCondition in conditions ? conditions[variantCondition] : variantCondition]: conditionedCss }
					}

					const variantClassName = className + getHashString('', conditionedCss) + '--' + (variantConfigIndex === 1 ? variantConfigKeys[0] + '-' + variantConfig[variantConfigKeys[0]] : 'c' + variantConfigIndex)
					const variantSelector = '.' + variantClassName
					const variantCssText = getComputedCss({ [variantSelector]: conditionedCss })
					const variantCssByIndex = variedCss[variantConfigIndex - 1] || (variedCss[variantConfigIndex - 1] = new StringSet())

					variantCssByIndex.add(variantCssText)

					return variantClassName
				}
			}

			variants.push(applyVariant)
		}

		return createComponent(
			(initProps) => {
				const { css, ...props } = Object(initProps)

				const hasPrimalChanged = primalCss.hasChanged
				const hasVariedChanged = variedCss.hasChanged
				const hasInlineChanged = inlineCss.hasChanged

				const classNames = new Set([className])

				primalCss.add(cssText)

				for (const variant of variants) {
					const variantClassName = variant(props)

					if (variantClassName) {
						classNames.add(variantClassName)
					}
				}

				if (css === Object(css)) {
					const inlineSuffix = getHashString('-', css)
					const inlineSelector = selector + inlineSuffix
					const inlineCssText = className === '-' + inlineSuffix ? '' : getComputedCss({ [inlineSelector]: css })

					classNames.add(className + inlineSuffix)

					if (inlineCssText) {
						inlineCss.add(inlineCssText)
					}
				}

				if (hasPrimalChanged() || hasVariedChanged() || hasInlineChanged()) {
					styledCss.add(unitedCss)

					update()
				}

				for (const variantName in variantProps) {
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
					selector: '.' + classNameSetArray.join('.'),
				})
			},
			'className',
			{
				get [$$composers]() {
					return composers
				},
				/** Applies the primary composer and returns the class name. */
				get className() {
					const hasPrimalChanged = primalCss.hasChanged

					primalCss.add(cssText)

					if (hasPrimalChanged()) {
						styledCss.add(unitedCss)

						update()
					}

					return className
				},
				selector,
				type,
			},
		)
	}

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
				return sheet
			},
			theme: defineProperties(theme, getOwnPropertyDescriptors(theme(':root', themeInit)())),
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
