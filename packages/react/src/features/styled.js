import React from 'react'

import { internal } from '../../../core/src/utility/internal.js'
import { createMemo } from '../../../core/src/utility/createMemo.js'

import { createCssFunction } from '../../../core/src/features/css.js'

/** @typedef {import('../../../core/src').Config} Config */
/** @typedef {import('../../../core/src').GroupSheet} GroupSheet */

const createCssFunctionMap = createMemo()

/** Returns a function that applies component styles. */
export const createStyledFunction = ({ /** @type {Config} */ config, /** @type {GroupSheet} */ sheet }) => (
	createCssFunctionMap(config, () => {
		const css = createCssFunction(config, sheet)

		const styled = (...args) => {
			const cssComponent = css(...args)
			const DefaultType = cssComponent[internal].type

			const styledComponent = React.forwardRef((props, ref) => {
				const Type = props && props.as || DefaultType

				const forwardProps = cssComponent(props).props

				delete forwardProps.as

				forwardProps.ref = ref

				return React.createElement(Type, forwardProps)
			})

			const toString = () => cssComponent.selector

			styledComponent.className = cssComponent.className
			styledComponent.displayName = `Styled.${DefaultType.displayName || DefaultType.name || DefaultType}`
			styledComponent.selector = cssComponent.selector
			styledComponent.toString = toString
			styledComponent[internal] = cssComponent[internal]

			return styledComponent
		}

		return styled
	})
)
