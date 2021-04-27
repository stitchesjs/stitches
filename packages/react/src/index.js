import { assign } from '../../core/src/Object.js'
import { createCss as createCoreCss } from '../../core/src/index.js'
import defaultThemeMap from '../../core/src/defaultThemeMap.js'
import { $$composers } from '../../core/src/Symbol.js'

const $$typeofElement = Symbol.for('react.element')
const $$typeofForward = Symbol.for('react.forward_ref')

const createCss = (init) => {
	const sheet = createCoreCss(init)

	return assign(sheet, {
		/** Returns a React component in the form of a forwarded ref object. */
		styled: (
			/** Type of component. */
			...inits
		) => {
			const defaultType = inits.map((init) => (Object(init).stitchesType ? init.stitchesType : init)).find((init) => init) || 'span'
			const composition = sheet.css(...inits.filter((init) => $$composers in Object(init) || (init && typeof init === 'object' && !init.$$typeof)))

			/** This is a React component in the form of a forwarded ref object, with a few extra Stitches properties. */
			return {
				/** The render function on the forwarded ref object returns a React element. */
				render(
					/** Props used to determine the expression of the current component. */
					initProps,
					ref,
				) {
					/** Express the composition, extracting `props` & `as`. */
					const {
						props: { as: type = defaultType, ...props },
					} = composition(initProps)

					/** React element. */
					return { $$typeof: $$typeofElement, key: null, props, ref, type }
				},
				$$typeof: $$typeofForward,
				displayName: 'Stitches',

				/** Below are all Stitches properties. */
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
				stitchesType: defaultType,
			}
		},
	})
}

const getReusableSheet = () => getReusableSheet.config || (getReusableSheet.config = createCss())

const css = (...args) => getReusableSheet().css(...args)
const global = (...args) => getReusableSheet().global(...args)
const keyframes = (...args) => getReusableSheet().keyframes(...args)
const styled = (...args) => getReusableSheet().styled(...args)

export { createCss as default, createCss, defaultThemeMap, css, global, keyframes, styled }
