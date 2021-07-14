import { createCss } from '../src/index.js'

describe('Utils', () => {
	test('Authors can define utilties applied to components', () => {
		const stitches = createCss({
			utils: {
				bg: (value) => ({ backgroundColor: value }),
			},
		})

		const component = stitches.css({
			bg: 'red',
		})

		expect(stitches.toString()).toBe('')

		component.toString()

		expect(stitches.toString()).toBe(`--stitches{--:2 c-bzwKCF}@media{.c-bzwKCF{background-color:red}}`)
	})
})
