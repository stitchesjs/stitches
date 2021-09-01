import { createStitches as createStitchesCore } from '../../core/src/createStitches.js'
import { createStyledFunction } from './features/styled.js'
import { h } from './features/h.js'

export const createStitches = (init) => {
	const instance = createStitchesCore(init)

	instance.styled = createStyledFunction(instance)

	const Sheet = {
		isAstroComponent: true,
		async __render(props) {
			return h('style', props, instance.getCssText())
		}
	}

	instance.Sheet = Sheet

	return instance
}
