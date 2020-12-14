import createCss from '@stitches/core'
import define from './lib/define'

/** Factory that returns a StyledSheet. */
const createStyled: StyledSheetFactory = function createStyled(init?: StyledSheetFactoryInit) {
	const sheet = createCss(init)

	return define(sheet, {
		styled(name: string | any, init: object) {
			const tagName = typeof name === 'string' ? name : name instanceof HTMLElement ? name.tagName : 'div'
			const element = document.createElement(tagName)
			const rule = sheet.css(init)
			const component = define(function Component(init?: any & object) {
				const { className: classNameOverride, ...opts } = Object(init)
				const expression = rule(opts)
				const expressionElement = element.cloneNode() as typeof element
				expressionElement.classList.add(...expression.classNames)
				if (classNameOverride) expressionElement.classList.add(classNameOverride as string)
				for (const prop in opts) {
					if (prop in rule.variants) {
					} else if (prop in expressionElement) {
						expressionElement[prop] = opts[prop]
					} else element.setAttribute(prop, opts[prop])
				}
				return expressionElement
			}, rule)
			return component
		},
	})
}

export default createStyled
