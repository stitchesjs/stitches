import Object, { assign } from '../../core/src/Object.js'
import createCoreCss from '../../core/src/index.js'
import defaultThemeMap from '../../core/src/defaultThemeMap.js'

const $$typeof = Symbol.for('react.element')
const $$typeofForward = Symbol.for('react.forward_ref')

const createCss = (init) => {
	const hasDocument = typeof document === 'object'

	const importText = hasDocument && new Text('')
	const globalText = hasDocument && new Text('')
	const themedText = hasDocument && new Text('')
	const styledText = hasDocument && new Text('')

	const createOnChange = hasDocument ? (textNode) => (data) => (textNode.data = data) : () => undefined

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
			},
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
				/** Type of component. */
				asType,
				/** Component styles. */
				initStyles,
			) => {
				const isComposition = 'composes' in Object(asType)

				/** Expression used to activate the component CSS on the current styled sheet. */
				const composition = isComposition ? sheet.css(asType.composes, initStyles) : sheet.css(initStyles)

				const defaultType = (isComposition ? asType.type : asType) || 'span'

				/** Returns a React element. */
				return Object.setPrototypeOf(
					{
						$$typeof: $$typeofForward,
						render(
							/** Props used to determine the expression of the current component. */
							initProps,
							ref,
						) {
							// express the component, extracting `props`, `as` & `ref`
							const {
								props: { as: type = defaultType, ...props },
								...expressedProps
							} = composition(initProps)

							// sync the dynamic stylesheet
							sheet.sync()

							/** React element. */
							return { constructor: undefined, $$typeof, props, ref, type, __v: 0 }
						},
						[Symbol.toPrimitive]() {
							return composition.selector
						},
						toString() {
							return composition.selector
						},
						get className() {
							return composition.className
						},
						get selector() {
							return composition.selector
						},
						composes: composition,
						classNames: composition.classNames,
						variants: composition.variants,
						type: defaultType,
					},
					Object(asType),
				)
			},
			{
				get: (target, type) => (type in target ? (typeof target[type] === 'function' ? target[type].bind(target) : target[type]) : target.bind(null, type)),
			},
		),
	}).reset()
}

export { createCss as default, createCss, defaultThemeMap }
