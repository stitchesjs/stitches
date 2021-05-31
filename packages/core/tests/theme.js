import { createCss } from '../src/index.js'

describe('Theme', () => {
	test('Expected behavior for the theme() method', () => {
		const { theme, getCssString } = createCss()

		const myTheme = theme('my', {
			colors: {
				blue: 'dodgerblue',
			},
		})

		expect(getCssString()).toBe('')
		expect(`<div class="${myTheme}">`).toBe('<div class="my">')
		expect(getCssString()).toBe(`--stitches{--:0 my}@media{.my{--colors-blue:dodgerblue}}`)
		expect(myTheme.className).toBe('my')
		expect(myTheme.selector).toBe('.my')
	})
})
