import React from 'react'

import { internal } from '../../../core/src/utility/internal.js'
import { createMemo } from '../../../core/src/utility/createMemo.js'

import { createCssFunction } from '../../../core/src/features/css.js'

const createCssFunctionMap = createMemo()

/** Returns a function that applies component styles. */
export const createStyledFunction = ({ config, sheet }) =>
	createCssFunctionMap(config, () => {
		const cssFunction = createCssFunction(config, sheet)

		const _styled = (args, css = cssFunction, { displayName, shouldForwardStitchesProp } = {}) => {
			const cssComponent = css(...args)
			const DefaultType = cssComponent[internal].type
			const shouldForwardAs = shouldForwardStitchesProp?.('as')

			const styledComponent = React.forwardRef((props, ref) => {
				const Type = props?.as && !shouldForwardAs ? props?.as : DefaultType

				const { props: forwardProps, deferredInjector } = cssComponent(props)

				if (!shouldForwardAs) {
					delete forwardProps.as
				}

				forwardProps.ref = ref

				if (deferredInjector) {
					return React.createElement(React.Fragment, null, React.createElement(Type, forwardProps), React.createElement(deferredInjector, null))
				}

				return React.createElement(Type, forwardProps)
			})

			const toString = () => cssComponent.selector

			styledComponent.className = cssComponent.className
			styledComponent.displayName = displayName || `Styled.${DefaultType.displayName || DefaultType.name || DefaultType}`
			styledComponent.selector = cssComponent.selector
			styledComponent.toString = toString
			styledComponent[internal] = cssComponent[internal]

			return styledComponent
		}

		const styled = (...args) => _styled(args)
	
		styled.withConfig = (componentConfig) => (...args) => {
			const cssWithConfig = cssFunction.withConfig(componentConfig)
			return _styled(args, cssWithConfig, componentConfig)
		}

		return styled
	})
