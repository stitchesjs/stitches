import { createCss } from '../src/index.js'

describe('Polyfill prefixed values', () => {
	test('width:stretch', () => {
		const { global, toString } = createCss()

		global({
			'.gro': {
				width: 'stretch',
			},
		})()

		expect(toString()).toBe(
			`--stitches{--:1 coIeei}@media{.gro{width:-moz-available;width:-webkit-fill-available}}`
		)
	})

	test('width:fit-content', () => {
		const { global, toString } = createCss()

		global({
			'.fit': {
				width: 'fit-content',
			},
		})()

		expect(toString()).toBe(
			`--stitches{--:1 gZsLvv}@media{.fit{width:-moz-fit-content;width:fit-content}}`
		)
	})
}) // prettier-ignore
