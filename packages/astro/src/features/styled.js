import { h } from './h.js'
import { internal } from '../../../core/src/utility/internal.js'
import { createMemo } from '../../../core/src/utility/createMemo.js'

import { createComponentFunction } from '../../../core/src/features/css.js'

/** @typedef {import('../../../core/src').Config} Config */
/** @typedef {import('../../../core/src').GroupSheet} GroupSheet */

const createComponentFunctionMap = createMemo()

/** Returns a function that applies component styles. */
export const createStyledFunction = ({ /** @type {Config} */ config, /** @type {GroupSheet} */ sheet }) => (
	createComponentFunctionMap(config, () => {
		const css = createComponentFunction(config, sheet)

		const styled = (...args) => {
			const cssComponent = css(...args)
			const DefaultType = cssComponent[internal].type

			const styledComponent = {
				isAstroComponent: true,
				async __render(props, children) {
					const Type = props && props.as || DefaultType

					const forwardProps = cssComponent(props).props

					delete forwardProps.as

					forwardProps.class = forwardProps.className

					delete forwardProps.className

					console.log({ children: children.$slots.default })

					return h(Type, forwardProps, children.$slots.default)
				}
			}

			const toString = () => cssComponent.selector

			styledComponent.class = cssComponent.className
			styledComponent.displayName = `Styled.${DefaultType.displayName || DefaultType.name || DefaultType}`
			styledComponent.selector = cssComponent.selector
			styledComponent.toString = toString
			styledComponent[internal] = cssComponent[internal]

			return styledComponent
		}

		return styled
	})
)
