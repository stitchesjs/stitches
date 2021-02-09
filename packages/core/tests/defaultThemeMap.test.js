import defaultThemeMap from '../src/defaultThemeMap.js'

describe('defaultThemeMap()', () => {
	test('defaultThemeMap properties are as expected', () => {
		expect(defaultThemeMap.backgroundColor).toEqual('colors')
		expect(defaultThemeMap.borderRadius).toEqual('radii')
		expect(defaultThemeMap.fontFamily).toEqual('fonts')
		expect(defaultThemeMap.fontWeight).toEqual('fontWeights')
		expect(defaultThemeMap.letterSpacing).toEqual('letterSpacings')
		expect(defaultThemeMap.lineHeight).toEqual('lineHeights')
		expect(defaultThemeMap.gap).toEqual('space')
		expect(defaultThemeMap.fontSize).toEqual('fontSizes')
	})
})
