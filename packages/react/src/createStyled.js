import * as React from 'react'
import { createComponentFunction } from '../../core/src/createComponent.js'

/** @typedef {import('../../core/src').Config} Config */
/** @typedef {import('../../core/src').GroupSheet} GroupSheet */

const $$composers = Symbol.for('sxs.composers')

/** Returns a function that applies global styles. */
export const createStyledFunction = ({ /** @type {Config} */ config, /** @type {GroupSheet} */ sheet }) => {
	const css = createComponentFunction(config, sheet)

	const styled = (...args) => {
		const baseComponent = css(...args)
		const baseClassName = baseComponent.className
		const baseSelector = baseComponent.selector
		const baseType = Object(args[0]).$$typeof && !($$composers in args[0]) ? args[0] : baseComponent.type
		const baseToString = () => `.${baseComponent.toString()}`

		const styledComponent = React.forwardRef((props, ref) => {
			props = (typeof props === 'object' && props) || {}

			const Type = props.as || baseType

			const forwardProps = baseComponent(props).props
			delete forwardProps.as
			forwardProps.ref = ref

			return React.createElement(Type, forwardProps)
		})

		styledComponent.className = baseClassName
		styledComponent.selector = baseSelector
		styledComponent.type = baseType
		styledComponent[$$composers] = baseComponent[$$composers]
		styledComponent.toString = baseToString
		styledComponent[Symbol.toPrimitive] = baseToString

		return styledComponent
	}

	return styled
}
