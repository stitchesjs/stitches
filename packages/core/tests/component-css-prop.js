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
			'.sxjq6z2{order:1;}.sxjq6z2-yg8rb{order:2;}',
		) // prettier-ignore
	})
})
