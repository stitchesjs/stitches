import { createCss } from '../src/index.js'

describe('Component with CSS prop', () => {
	test('Authors can create a component and pass it a css prop of overrides', () => {
		const { css, toString } = createCss({
			media: {
				bp0: '(width < 768px)',
				bp1: '(768px <= width < 1400px)',
				bp2: '(1400px <= width)',
			},
		})

		css({
			order: 1,
		})({
			css: {
				order: 2,
			},
		})

		expect(toString()).toBe(
			`--stitches{--:2 c-hhyRYU}@media{` +
				`.c-hhyRYU{order:1}` +
			`}` +
			`--stitches{--:4 c-hhyRYU-ilhKMMn-css}@media{` +
				`.c-hhyRYU-ilhKMMn-css{order:2}` +
			`}`
		)
	})
}) // prettier-ignore
