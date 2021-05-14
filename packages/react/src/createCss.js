import { createCss as createCoreCss } from '../../core/src/createCss.js'
import { createStyledFunction } from './createStyled.js'

export const createCss = (init) => {
	const instance = createCoreCss(init)

	instance.styled = createStyledFunction(instance)

	return instance
}
