import { createCss } from '../src/index.js'

describe('Component: Utilities & Tokens', () => {
	test('Utilities & Tokens of the same type', () => {
		const { css, toString } = createCss({
			utils: {
				px: (value) => ({
					paddingLeft: value,
					paddingRight: value,
				}),
			},
		})

		css({
			px: 15,
		})()

		expect(toString()).toBe(`--stitches{--:2 c-ccgTVz}@media{.c-ccgTVz{padding-left:15px;padding-right:15px}}`)
	})

	test('Utilities & Tokens of different types', () => {
		const { css, toString } = createCss({
			utils: {
				ftw: (value) => ({
					color: value,
					paddingLeft: value,
					paddingRight: value,
				}),
			},
		})

		css({
			ftw: '$sp',
		})()

		expect(toString()).toBe(`--stitches{--:2 c-ilqzId}@media{.c-ilqzId{color:var(--colors-sp);padding-left:var(--space-sp);padding-right:var(--space-sp)}}`)
	})
})
