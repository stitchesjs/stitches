import { createCss } from '../src/index.js'

describe('Theme', () => {
	test('Expected behavior for the theme() method', () => {
		const { theme, toString } = createCss()

		const myTheme = theme('my', {
			colors: {
				blue: 'dodgerblue',
			},
		})

		expect(toString()).toBe('')
		expect(`<div class="${myTheme}">`).toBe('<div class="my">')
		expect(toString()).toBe('.my{--colors-blue:dodgerblue;}')
		expect(myTheme.className).toBe('my')
		expect(myTheme.selector).toBe('.my')
	})
})
