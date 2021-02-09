import getCustomProperties from '../src/getCustomProperties.js'

describe('getCustomProperties()', () => {
	test('getCustomProperties() generates a flat list of custom properties', () => {
		expect(
			getCustomProperties({
				colors: {
					blue: 'dodgerblue',
					red: 'tomato',
				},
				sizes: {
					sm: '480px',
					md: '960px',
					lg: '1200px',
				},
			}),
		).toEqual({
			'$colors-blue': 'dodgerblue',
			'$colors-red': 'tomato',
			'$sizes-sm': '480px',
			'$sizes-md': '960px',
			'$sizes-lg': '1200px',
		})
	})
})
