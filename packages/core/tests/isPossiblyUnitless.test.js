import isPossiblyUnitless from '../src/isPossiblyUnitless.js'

describe('isPossiblyUnitless()', () => {
	test('isPossiblyUnitless() correctly identifies some unitless properties', () => {
		expect(isPossiblyUnitless('order')).toBe(true)
		expect(isPossiblyUnitless('zoom')).toBe(true)
	})

	test('isPossiblyUnitless() correctly identifies some unit-full properties', () => {
		expect(isPossiblyUnitless('height')).toBe(false)
		expect(isPossiblyUnitless('width')).toBe(false)
	})
})
