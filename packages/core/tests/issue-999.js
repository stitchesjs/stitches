import { createCss } from '../src/index.js'

describe('Issue #519', () => {
	test('xyz', () => {
		const { css, toString } = createCss({})

		css({
			$$syntax: 'red',

			h1: {
				color: '$$syntax',
			},

			h2: {
				color: '$$syntax',
			},
		})()

		// prettier-ignore
		expect(toString()).toBe(
			'.sxyrd68{---syntax:red;}' +
			'.sxyrd68 h1{color:var(---syntax);}' +
			'.sxyrd68 h2{color:$$syntax;}'
		)
	})
})
