import Object, { assign, create } from '../core/Object'
import createCoreCss from '../core/createCss'
import defaultThemeMap from '../core/defaultThemeMap'
import reactElementPrototype from './reactElementPrototype'

const createCss = (init) => {
	const [createThemedRule, createGlobalRule, createStyledRule] = createCoreCss(
		assign(
			{
				themeMap: defaultThemeMap,
			},
			init,
		),
	)

	let sheetSet

	let sheetParent

	let sheetTarget

	let importTextNode = new Text('')
	let globalTextNode = new Text('')
	let themedTextNode = new Text('')
	let styledTextNode = new Text('')

	const sync = () => {
		if (!sheetParent) sheetParent = document.head || document.documentElement
		if (!sheetTarget) sheetTarget = document.getElementById('stitches') || assign(document.createElement('style'), { id: 'stitches' })
		if (!sheetTarget.parentNode) sheetParent.prepend(sheetTarget)
	}

	const clear = () => {
		sync()

		sheetSet = create(null)

		sheetTarget.textContent = ''
		// sheetTarget.append(importTextNode, new Text(themedCssText), globalTextNode, themedTextNode, styledTextNode)
		sheetTarget.append(importTextNode, globalTextNode, themedTextNode, styledTextNode)

		return ''
	}

	clear.toString = clear

	clear()

	/** Returns a function that enables the styles on the styled sheet. */
	const global = (
		/** Styles representing global CSS. */
		initStyles
	) => {
		const [importRuleCssTexts, globalRuleCssTexts] = createGlobalRule(initStyles)

		let importCssText = ''
		let globalCssText = ''

		const globalRule = () => {
			for (const importRuleCssText of importRuleCssTexts) {
				if (!sheetSet[importRuleCssText]) {
					sheetSet[importRuleCssText] = true

					importCssText += importRuleCssText
				}
			}

			for (const globalRuleCssText of globalRuleCssTexts) {
				if (!sheetSet[globalRuleCssText]) {
					sheetSet[globalRuleCssText] = true

					globalCssText += globalRuleCssText
				}
			}

			if (importCssText) importTextNode.before(importCssText)

			if (globalCssText) globalTextNode.before(globalCssText)

			sync()

			return ''
		}

		globalRule.toString = globalRule

		return globalRule
	}

	const tokenPrototype = create(String.prototype, {
		computedValue: {
			get(): string {
				return 'var(' + this.variable + ')'
			},
		},
		variable: {
			get(): string {
				return '--' + this.scale + '-' + this.token
			},
		},
		toString: {
			value(): string {
				return this.computedValue
			},
		},
	})

	const theme = (
		/** CSS Class name. */
		className,
		/** Object of theme scales with inner token values. */
		themeStyles,
	) => {
		/** CSS Selector */
		const selector = className.replace(/^[A-Za-z-]/, '.$&')

		/** CSS styles representing the current theme rule. */
		const themedCssText = createThemedRule(selector, themeStyles)

		const themeRule = () => {
			if (!sheetSet[themedCssText]) {
				sheetSet[themedCssText] = true

				themedTextNode.before(themedCssText)

				sync()
			}

			return themeRule
		}

		themeRule.toString = () => selector

		for (const scale in themeStyles) {
			themeRule[scale] = create(null)

			for (const token in themeStyles[scale]) {
				themeRule[scale][token] = create(tokenPrototype, {
					value: { value: themeStyles[scale][token] },
					scale: { value: scale },
					token: { value: token },
				})
			}
		}

		return themeRule
	}

	assign(theme, theme(':root', init.theme)())

	const styled = new Proxy(
		(
			/** Type of component element. */
			type = 'span',
			/** Styles representing component CSS. */
			styles,
		) => {
			const styledRule = createStyledRule(Object(styles))
			const source = create(reactElementPrototype, { type: { value: type } })
			const selector = '.' + styledRule.className

			let styledRuleNode = new Text('')
			let varianRuleNode = new Text('')
			let inlineRuleNode = new Text('')

			styledTextNode.before(styledRuleNode, varianRuleNode, inlineRuleNode)

			const styledComponent = (init) => {
				const [props, styledRuleCssText, varianCssTexts, inlineCssText] = styledRule(init)

				if (!sheetSet[styledRuleCssText]) {
					sheetSet[styledRuleCssText] = true

					styledRuleNode.before(styledRuleCssText)
				}

				for (const varianCssText of varianCssTexts) {
					if (!sheetSet[varianCssText]) {
						sheetSet[varianCssText] = true

						varianRuleNode.before(varianCssText)
					}
				}

				if (!sheetSet[inlineCssText]) {
					sheetSet[inlineCssText] = true

					inlineRuleNode.before(inlineCssText)
				}

				sync()

				const element = create(source, { props: { value: props } })

				element.toString = () => selector

				return element
			}

			styledComponent.toString = () => String(styledComponent())

			return Object.setPrototypeOf(styledComponent, Object(type))
		},
		{
			get: (target, type) => (type in target ? (typeof target[type] === 'function' ? target[type].bind(target) : target[type]) : target.bind(null, type)),
		},
	)

	return { clear, global, styled, theme }
}

export default createCss
