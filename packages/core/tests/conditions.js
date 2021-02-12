import createCss from '../src/index.js'

describe('Conditions', () => {
	let stitches, component

	const MEDIUM_UP = '@media (min-width: 768px)'

	test('Authors can define conditions applied to components', () => {
		stitches = createCss({
			conditions: {
				MEDIUM_UP,
			},
		})

		component = stitches.css({
			fontSize: '16px',
			when: {
				MEDIUM_UP: {
					fontSize: '24px',
				},
			},
		})

		expect(stitches.toString()).toBe('')

		component.toString()

		expect(stitches.toString()).toBe(`.sxqh7cb{font-size:16px;}${MEDIUM_UP}{.sxqh7cb{font-size:24px;}}`)
	})
})
