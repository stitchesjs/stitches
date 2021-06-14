import { createCss as createCoreCss } from '../../core/src/createCss.js'
import { createStyledFunction } from './features/styled.js'

export const createCss = (init) => {
	const instance = createCoreCss(init)

	instance.styled = createStyledFunction(instance)

	return instance
}
