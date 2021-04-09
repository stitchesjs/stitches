import { createCss } from '../src/index.js'

describe('Component: Utilities & Tokens', () => {
	test('Utilities & Tokens of the same type', () => {
		const { css, toString } = createCss({
			utils: {
				px: () => (value) => ({
					paddingLeft: value,
					paddingRight: value,
				}),
			},
		})

		css({
			px: 15,
		})()

		expect(toString()).toBe('.sx54kee{padding-left:15px;padding-right:15px;}')
	})

	test('Utilities & Tokens of different types', () => {
		const { css, toString } = createCss({
			utils: {
				ftw: () => (value) => ({
					color: value,
					paddingLeft: value,
					paddingRight: value,
				}),
			},
		})

		css({
			ftw: '$sp',
		})()

		expect(toString()).toBe('.sxmbz2y{color:var(--sx-colors-sp);padding-left:var(--sx-space-sp);padding-right:var(--sx-space-sp);}')
	})
})
