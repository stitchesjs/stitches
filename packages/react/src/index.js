import { assign } from '../../core/src/Object.js'
import createCoreCss from '../../core/src/index.js'
import defaultThemeMap from '../../core/src/defaultThemeMap.js'
import { $$composers } from '../../core/src/Symbol.js'

const $$typeofElement = Symbol.for('react.element')
const $$typeofForward = Symbol.for('react.forward_ref')

const createCss = (init) => {
	const sheet = createCoreCss(init)

	return assign(sheet, {
		styled: new Proxy(
			/** Returns a React component. */
			(
				/** Type of component. */
				...args
			) => {
				const composition = sheet.css(...args)
				const lastComposer = args.length > 1 ? args[args.length - 2] : args[args.length - 1]
				const defaultType = Object(lastComposer).type || lastComposer || 'span'

				/** Returns a React element. */
				return Object.setPrototypeOf(
					{
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

							/** React element. */
							return { constructor: undefined, $$typeof: $$typeofElement, props, ref, type, __v: 0 }
						},
						$$typeof: $$typeofForward,
						[$$composers]: composition[$$composers],
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
						type: defaultType,
					},
					Object(defaultType),
				)
			},
			{
				get: (target, type) => (type in target ? (typeof target[type] === 'function' ? target[type].bind(target) : target[type]) : target.bind(null, type)),
			},
		),
	}).reset()
}

const getReusableSheet = () => getReusableSheet.config || (getReusableSheet.config = createCss())

const css = (...args) => getReusableSheet().css(...args)
const global = (...args) => getReusableSheet().global(...args)
const keyframes = (...args) => getReusableSheet().keyframes(...args)
const styled = (...args) => getReusableSheet().styled(...args)

export { createCss as default, createCss, defaultThemeMap, css, global, keyframes, styled }
