import unitedProps from '../src/stringify/unitProps.js'
import { cssProps } from './internal-unitProps.cssProps.js'
import { cssUnitOnlyProps } from './internal-unitProps.cssUnitOnlyProps.js'
import { cssNonUnitOnlyProps } from './internal-unitProps.cssNonUnitOnlyProps.js'

describe('unitProps()', () => {
	for (const prop of cssProps) {
		test(prop, () => {
			const camelProp = prop.replace(/-[a-z]/g, ([, $1]) => $1.toUpperCase())

			if (cssUnitOnlyProps.has(prop)) {
				expect(unitedProps[camelProp]).toBe(1)
			}

			if (cssNonUnitOnlyProps.has(prop)) {
				expect(unitedProps[camelProp]).toBe(undefined)
			}
		})
	}
})
