import { createStitches as createStitchesCore } from '../../core/src/createStitches.js'
import { createStyledFunction } from './features/styled.js'

export const createStitches = (init, isShadowDom = true) => {
	const instance = createStitchesCore(init, isShadowDom)

	instance.styled = createStyledFunction(instance)

	return instance
}
