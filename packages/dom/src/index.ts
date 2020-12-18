import createCss from '@stitches/internal-core'
import define from './lib/define'

/** Factory that returns a StyledSheet. */
const createStyled = function createStyled(init?: StyledSheetFactoryInit) {
	const sheet = createCss(init)

	return define(sheet, {
		styled(name: string | any, init: object) {
			const tagName = typeof name === 'string' ? name : name instanceof HTMLElement ? name.tagName : 'div'
			const createExpression = sheet.css(init)

			const component = define(function Component(init?: any & object) {
				const { className: classNameOverride, ...opts } = Object(init)
				const classNameOverrides = String(classNameOverride || '')
					.split(/\s+/)
					.filter(Boolean)

				const expression = createExpression(opts)
				const element = document.createElement(tagName)
				const classNames = [...expression.classNames, ...classNameOverrides]

				element.classList.add(...classNames)

				for (const prop in opts) {
					if (prop in createExpression.variants) {
					} else if (prop in element) {
						// @ts-ignore
						element[prop] = opts[prop]
					} else element.setAttribute(prop, opts[prop])
				}

				return element
			}, createExpression)

			return component
		},
	}) as typeof sheet & {
		styled(name: string | any, init: object): (init?: any & object) => HTMLElement
	}
}

export default createStyled
