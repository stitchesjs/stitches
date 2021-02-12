import createCss from '../src/index.js'

describe('Configuration', () => {
	let stitches

	test('Authors can supply or omit a configuration', () => {
		stitches = createCss({})

		expect(stitches.css).toBeInstanceOf(Function)

		stitches = createCss()

		expect(stitches.css).toBeInstanceOf(Function)
	})
})
