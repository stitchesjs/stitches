import createCss from '../src/index.js'

describe('Component Conditions', () => {
	test('Authors can define conditions applied to components', () => {
		const mediumUpQuery = '@media (min-width: 768px)'

		const { css, toString } = createCss({
			conditions: {
				mediumUpQuery,
			},
		})

		css({
			fontSize: '16px',
			when: {
				mediumUpQuery: {
					fontSize: '24px',
				},
			},
		})()

		expect(toString()).toBe(`.sxfk9h5{font-size:16px;}${mediumUpQuery}{.sxfk9h5{font-size:24px;}}`)
	})
})
