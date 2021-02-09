import Object, { assign } from '../../core/src/Object.js'
import createCoreCss from '../../core/src/index.js'
import defaultThemeMap from '../../core/src/defaultThemeMap.js'

const $$typeof = Symbol.for('react.element')

export default (init) => {
	const hasDocument = typeof document === 'object'

	const importText = hasDocument && new Text('')
	const globalText = hasDocument && new Text('')
	const themedText = hasDocument && new Text('')
	const styledText = hasDocument && new Text('')

	const createOnChange = hasDocument ? textNode => data => (textNode.data = data) : () => undefined

	let sheetParent
	let sheetTarget

	init = assign(
		{
			onImport: createOnChange(importText, 'import'),
			onGlobal: createOnChange(globalText, 'global'),
			onThemed: createOnChange(themedText, 'themed'),
			onStyled: createOnChange(styledText, 'styled'),
			onResets() {
				if (hasDocument) {
					this.sync()

					sheetTarget.textContent = importText.data = globalText.data = themedText.data = styledText.data = ''
					sheetTarget.append(importText, globalText, themedText, styledText)
				}
			}
		},
		init,
	)

	const sheet = createCoreCss(init)

	return assign(sheet, {
		sync() {
			if (hasDocument) {
				if (!sheetParent) sheetParent = document.head || document.documentElement
				if (!sheetTarget) sheetTarget = document.getElementById('stitches') || assign(document.createElement('style'), { id: 'stitches' })
				if (!sheetTarget.parentNode) sheetParent.prepend(sheetTarget)
			}
		},
		styled: new Proxy(
			/** Returns a React component. */
			(
				/** Type of component element. */
				asType = 'span',
				/** Styles representing component CSS. */
				initStyles,
			) => {
				const expression = sheet.css(asType, initStyles)

				/** Returns a React element. */
				return Object.setPrototypeOf(
					assign((
						/** Props used to determine the expression of the current styled rule. */
						initProps,
					) => {
						// extract props, individually extracting `as` & `ref` props
						const {
							props: { as: type = asType, ref = null, ...props },
							...expressedProps
						} = expression(initProps)

						// sync the dynamic stylesheet
						sheet.sync()

						// return the react element
						return { ...expressedProps, constructor: undefined, $$typeof, props, ref, type, __v: 0 }
					}, expression),
					// extends the asType, otherwise Object
					Object(asType)
				)
			},
			{
				get: (target, type) => (type in target ? (typeof target[type] === 'function' ? target[type].bind(target) : target[type]) : target.bind(null, type)),
			},
		),
	}).reset()
}

export { defaultThemeMap }
