import { createStitches } from '../src/index.js'

describe('Basic', () => {
	test('Basic css calls without a config', () => {
		const { css, getCssText } = createStitches()

		expect(css.withConfig).toBeInstanceOf(Function)

		const component1of2 = css.withConfig()()
		const className1of2 = `${component1of2}`
		const cssString1of2 = getCssText()

		expect(component1of2).toBeInstanceOf(Function)
		expect(className1of2).toBe('PJLV')
		expect(cssString1of2).toBe('')

		const component2of2 = css.withConfig()({ color: 'DodgerBlue' })
		const className2of2 = `${component2of2}`
		const cssString2of2 = getCssText()

		expect(component2of2).toBeInstanceOf(Function)
		expect(className2of2).toBe('c-dataoT')
		expect(cssString2of2).toBe(`--sxs{--sxs:2 PJLV c-dataoT}@media{.c-dataoT{color:DodgerBlue}}`)
	})
})
