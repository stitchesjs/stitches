import { assign } from '../../core/src/Object.js'
import { createCss as createCoreCss } from '../../core/src/index.js'
import defaultThemeMap from '../../core/src/defaultThemeMap.js'
import { $$composers } from '../../core/src/Symbol.js'

const $$typeofElement = Symbol.for('react.element')
const $$typeofForward = Symbol.for('react.forward_ref')

const createCss = (init) => {
	const sheet = createCoreCss(init)

	return assign(sheet, {
		/** Returns a React component. */
		styled: (
			/** Type of component. */
			...inits
		) => {
			const defaultType = inits.map((init) => (Object(init).type ? init.type : init)).find((init) => init) || 'span'
			const composition = sheet.css(...inits.filter((init) => $$composers in Object(init) || (init && typeof init === 'object' && !init.$$typeof)))

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
							...expressedProps // eslint-disable-line no-unused-vars
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
	})
}

const getReusableSheet = () => getReusableSheet.config || (getReusableSheet.config = createCss())

const css = (...args) => getReusableSheet().css(...args)
const global = (...args) => getReusableSheet().global(...args)
const keyframes = (...args) => getReusableSheet().keyframes(...args)
const styled = (...args) => getReusableSheet().styled(...args)

export { createCss as default, createCss, defaultThemeMap, css, global, keyframes, styled }
