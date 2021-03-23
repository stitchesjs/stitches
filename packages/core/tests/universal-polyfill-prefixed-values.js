import { createCss } from '../src/index.js'

describe('Polyfill prefixed values', () => {
	test('width:stretch', () => {
		const { global, toString } = createCss()

		global({
			'.gro': {
				width: 'stretch',
			},
		})()

		// prettier-ignore
		expect(toString()).toBe(
			'.gro{width:-moz-available;width:-webkit-fill-available;}'
		)
	})

	test('width:fit-content', () => {
		const { global, toString } = createCss()

		global({
			'.fit': {
				width: 'fit-content',
			},
		})()

		// prettier-ignore
		expect(toString()).toBe(
			'.fit{width:-moz-fit-content;width:fit-content;}'
		)
	})
})
