import { createStitches } from '../src/index.js'

describe('Issue #655', () => {
	test('Applying both variants from the one default variant', () => {
		const { css, getCssText } = createStitches()

		css({
			maxWidth: 'fit-content',
			minWidth: 'fit-content',
		})()

		expect(getCssText()).toBe(
			`--sxs{--sxs:2 c-dAAqmb}` +
			`@media{.c-dAAqmb{` +
				`max-width:-moz-fit-content;max-width:fit-content;` +
				`min-width:-moz-fit-content;min-width:fit-content` +
			`}}`
		)
	})
})
