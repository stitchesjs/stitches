import { createStitches as createStitchesCore } from '../../core/src/createStitches.js'
import { createStyledFunction } from './features/styled.js'

export const createStitches = (init) => {
	const instance = createStitchesCore(init)

	instance.styled = createStyledFunction(instance)

	return instance
}
