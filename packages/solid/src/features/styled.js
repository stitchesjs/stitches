import { spread, ssr, ssrSpread, isServer } from 'solid-js/web'
import { splitProps } from 'solid-js'

import { internal } from '../../../core/src/utility/internal.js'
import { createMemo } from '../../../core/src/utility/createMemo.js'

import { createCssFunction } from '../../../core/src/features/css.js'

/** @typedef {import('../../../core/src').Config} Config */
/** @typedef {import('../../../core/src').GroupSheet} GroupSheet */

const createCssFunctionMap = createMemo()

/** Returns a function that applies component styles. */
export const createStyledFunction = ({ /** @type {Config} */ config, /** @type {GroupSheet} */ sheet }) =>
	createCssFunctionMap(config, () => {
		const css = createCssFunction(config, sheet)

		const styled = (...args) => {
			const cssComponent = css(...args)
			const DefaultType = cssComponent[internal].type

			const styledComponent = (props) => {
				const Type = (props && props.as) || DefaultType

				const forwardProps = cssComponent(props).props

				delete forwardProps.as
				if (typeof Type === 'function') {
					return Type(forwardProps)
				}

				if (isServer) {
					const [local, others] = splitProps(forwardProps, ['children'])
					const args = [[`<${Type} `, '>', `</${Type}>`], ssrSpread(others), local.children || '']
					const result = ssr(...args)
					return result
				}

				const el = document.createElement(Type)
				spread(el, forwardProps)
				return el
			}

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
