import { createCss as createCoreCss, defaultThemeMap, assign, create, Object } from '@stitches/core'
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

	/** @type {{ [key: string]: true }} */
	let sheetSet

	/** @type {HTMLHeadElement | HTMLHtmlElement} */
	let sheetParent

	/** @type {HTMLStyleElement} */
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
		// sheetSet[themedCssText] = true

		sheetTarget.textContent = ''
		// sheetTarget.append(importTextNode, new Text(themedCssText), globalTextNode, themedTextNode, styledTextNode)
		sheetTarget.append(importTextNode, globalTextNode, themedTextNode, styledTextNode)

		return ''
	}

	clear.toString = clear

	clear()

	const global = (styles) => {
		const [importRuleCssTexts, globalRuleCssTexts] = createGlobalRule(styles)

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
			get() {
				return 'var(' + this.variable + ')'
			},
		},
		variable: {
			get() {
				return '--' + this.scale + '-' + this.token
			},
		},
		toString: {
			value() {
				return this.computedValue
			},
		},
	})

	const theme = (className, themeStyles) => {
		/** ... */
		const selector = className.replace(/^[A-Za-z-]/, '.$&')

		/** ... */
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
		(type = 'span', styles) => {
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

			return styledComponent
		},
		{
			get: (target, type) => (type in target ? (typeof target[type] === 'function' ? target[type].bind(target) : target[type]) : target.bind(null, type)),
		},
	)

	return { clear, global, styled, theme }
}

export default createCss
