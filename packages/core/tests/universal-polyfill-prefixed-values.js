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
			'.gro{width:-moz-available;width:-webkit-fill-available;}'
		) // prettier-ignore
	})

	test('width:fit-content', () => {
		const { global, toString } = createCss()

		global({
			'.fit': {
				width: 'fit-content',
			},
		})()

		expect(toString()).toBe(
			'.fit{width:-moz-fit-content;width:fit-content;}'
		) // prettier-ignore
	})
})
