import createCss from '../src/index.js'

describe('Utils', () => {
	let stitches, component

	test('Authors can define utilties applied to components', () => {
		stitches = createCss({
			utils: {
				bg: () => (value) => ({ backgroundColor: value }),
			},
		})

		component = stitches.css({
			bg: 'red',
		})

		expect(stitches.toString()).toBe('')

		component.toString()

		expect(stitches.toString()).toBe('.sxxl9ux{background-color:red;}')
	})
})
