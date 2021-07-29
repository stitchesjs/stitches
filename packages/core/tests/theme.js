import { createStitches } from '../src/index.js'

describe('Theme', () => {
	test('Expected behavior for the theme() method', () => {
		const { theme, getCssString } = createStitches()

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

	test('theme() support for non-strings', () => {
		{
			const { getCssString } = createStitches({
				theme: {
					sizes: {
						sm: 100,
						md: 200,
						lg: 500,
					},
				}
			})

			expect(getCssString()).toBe(
				`--stitches{--:0 t-egkarf}@media{` +
					`:root,.t-egkarf{--sizes-sm:100;--sizes-md:200;--sizes-lg:500}` +
				`}`
			)
		}

		{
			const { getCssString } = createStitches({
				theme: {
					sizes: {
						sm: 100,
						md: 'calc($sm * 3)',
						lg: 'calc($md * 3)',
					},
				}
			})

			expect(getCssString()).toBe(
				`--stitches{--:0 t-eJkcVD}@media{` +
					`:root,.t-eJkcVD{` +
						`--sizes-sm:100;` +
						`--sizes-md:calc(var(--sizes-sm) * 3);` +
						`--sizes-lg:calc(var(--sizes-md) * 3)` +
					`}` +
				`}`
			)
		}
	}) // prettier-ignore
})
