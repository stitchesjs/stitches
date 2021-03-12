import unitedProps from '../src/unitOnlyProps.js'
import { cssProps } from './internal-unitOnlyProps.cssProps.js'
import { cssUnitOnlyProps } from './internal-unitOnlyProps.cssUnitOnlyProps.js'
import { cssNonUnitOnlyProps } from './internal-unitOnlyProps.cssNonUnitOnlyProps.js'

describe('createGetComputedCss()', () => {
	for (const prop of cssProps) {
		test(prop, () => {
			if (cssUnitOnlyProps.has(prop)) {
				expect(unitedProps.test(prop)).toBe(true)
			}

			if (cssNonUnitOnlyProps.has(prop)) {
				expect(unitedProps.test(prop)).toBe(false)
			}
		})
	}
})
