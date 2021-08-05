import { createStitches } from '../src/index.js'

describe('Basic', () => {
	test('Existance of methods', () => {
		const stitches = createStitches()

		expect(stitches).toBeInstanceOf(Object)
		expect(stitches.css).toBeInstanceOf(Function)
		expect(stitches.globalCss).toBeInstanceOf(Function)
		expect(stitches.keyframes).toBeInstanceOf(Function)
		expect(stitches.createTheme).toBeInstanceOf(Function)
	})

	test('Functionality of getCssText()', () => {
		const { getCssText } = createStitches()

		expect(getCssText()).toBe('')
	})

	test('Functionality of css()', () => {
		const { css, getCssText } = createStitches()

		const component1of2 = css()
		const className1of2 = `${component1of2}`
		const cssString1of2 = getCssText()

		expect(component1of2).toBeInstanceOf(Function)
		expect(className1of2).toBe('PJLV')
		expect(cssString1of2).toBe('')

		const component2of2 = css({ color: 'DodgerBlue' })
		const className2of2 = `${component2of2}`
		const cssString2of2 = getCssText()

		expect(component2of2).toBeInstanceOf(Function)
		expect(className2of2).toBe('c-dataoT')
		expect(cssString2of2).toBe(`--sxs{--sxs:2 PJLV c-dataoT}@media{.c-dataoT{color:DodgerBlue}}`)
	})

	test('Functionality of reset()', () => {
		const { reset, getCssText } = createStitches()

		expect(reset).toBeInstanceOf(Function)

		expect(getCssText()).toBe('')

		reset()

		expect(getCssText()).toBe('')
	})

	test('Functionality of globalCss()', () => {
		const { globalCss, getCssText } = createStitches()

		const rendering1of2 = globalCss()
		const className1of2 = `${rendering1of2}`
		const cssString1of2 = getCssText()

		expect(rendering1of2).toBeInstanceOf(Function)
		expect(className1of2).toBe('')
		expect(cssString1of2).toBe('')

		const rendering2of2 = globalCss({ body: { margin: 0 } })
		const className2of2 = `${rendering2of2}`
		const cssString2of2 = getCssText()

		expect(rendering2of2).toBeInstanceOf(Function)
		expect(className2of2).toBe('')
		expect(cssString2of2).toBe(`--sxs{--sxs:1 PJLV cSHHDh}@media{body{margin:0}}`)
	})

	test('Functionality of keyframes()', () => {
		const { keyframes, getCssText } = createStitches()

		const rendering1of1 = keyframes({
			'0%': {
				color: 'Black',
			},
			'100%': {
				color: 'White',
			},
		})
		const className1of1 = `${rendering1of1}`
		const cssString1of1 = getCssText()

		expect(rendering1of1).toBeInstanceOf(Function)
		expect(className1of1).toBe('k-jOrSYg')
		expect(cssString1of1).toBe(`--sxs{--sxs:1 k-jOrSYg}@media{@keyframes k-jOrSYg{0%{color:Black}100%{color:White}}}`)
	})

	test('Functionality of createTheme()', () => {
		const { createTheme, getCssText } = createStitches()

		const rendering1of1 = createTheme({
			colors: {
				red: 'Crimson',
				blue: 'DodgerBlue',
			},
		})

		const className1of1 = `${rendering1of1}`
		const cssString1of1 = getCssText()

		expect(rendering1of1).toBeInstanceOf(Object)
		expect(className1of1).toBe('t-kfidiM')
		expect(cssString1of1).toBe(`--sxs{--sxs:0 t-kfidiM}@media{.t-kfidiM{--colors-red:Crimson;--colors-blue:DodgerBlue}}`)
	})

	test('Functionality of css() — css prop', () => {
		const { css, getCssText } = createStitches()

		const component1of1 = css({ color: 'DodgerBlue' })
		const className1of1 = `${component1of1({ css: { color: 'Crimson' } })}`
		const cssString1of1 = getCssText()

		expect(component1of1).toBeInstanceOf(Function)
		expect(className1of1).toBe('c-dataoT c-dataoT-icaIZdx-css')
		expect(cssString1of1).toBe(
			`--sxs{--sxs:2 c-dataoT}@media{` +
				`.c-dataoT{color:DodgerBlue}` +
			`}` +
			`--sxs{--sxs:5 c-dataoT-icaIZdx-css}@media{` +
				`.c-dataoT-icaIZdx-css{color:Crimson}` +
			`}`
		)
	})

	test('Functionality of css() — variants', () => {
		const { css, getCssText } = createStitches()

		const component1of1 = css({
			fontSize: '100%',
			variants: {
				shade: {
					red: {
						color: 'Crimson',
					},
					blue: {
						color: 'DodgerBlue',
					},
				},
			},
		})
		const className1of1 = `${component1of1({ shade: 'red' })}`
		const cssString1of1 = getCssText()

		expect(component1of1).toBeInstanceOf(Function)
		expect(className1of1).toBe('c-imTdEZ c-imTdEZ-caIZdx-shade-red')
		expect(cssString1of1).toBe(`--sxs{--sxs:2 c-imTdEZ}@media{.c-imTdEZ{font-size:100%}}--sxs{--sxs:3 c-imTdEZ-caIZdx-shade-red}@media{.c-imTdEZ-caIZdx-shade-red{color:Crimson}}`)
	})

	test('Functionality of css() — utils', () => {
		const { css, getCssText } = createStitches({
			utils: {
				userSelect: (value) => ({
					WebkitUserSelector: value,
					userSelect: value,
				}),
			},
		})

		const component1of1 = css({
			userSelect: 'none',
		})
		const className1of1 = `${component1of1()}`
		const cssString1of1 = getCssText()

		expect(className1of1).toBe('c-bStdfw')
		expect(cssString1of1).toBe(`--sxs{--sxs:2 c-bStdfw}@media{.c-bStdfw{-webkit-user-selector:none;user-select:none}}`)
	})

	test('Functionality of stringification — numeric pixel values', () => {
		const { css, getCssText } = createStitches()

		const component1of1 = css({
			width: 100,
		})
		const className1of1 = `${component1of1()}`
		const cssString1of1 = getCssText()

		expect(className1of1).toBe('c-eBcQxc')
		expect(cssString1of1).toBe(`--sxs{--sxs:2 c-eBcQxc}@media{.c-eBcQxc{width:100px}}`)
	})

	test('Functionality of stringification — token values', () => {
		const { css, getCssText } = createStitches()

		const component1of1 = css({
			width: '$brand',
		})

		const className1of1 = `${component1of1()}`
		const cssString1of1 = getCssText()

		expect(className1of1).toBe('c-lpaZZu')
		expect(cssString1of1).toBe(`--sxs{--sxs:2 c-lpaZZu}@media{.c-lpaZZu{width:var(--sizes-brand)}}`)
	})

	test('Functionality of stringification — local tokens', () => {
		const { css, getCssText } = createStitches()

		const component1of1 = css({
			$$brand: '500px',
			width: '$$brand',
		})

		const className1of1 = `${component1of1()}`
		const cssString1of1 = getCssText()

		expect(className1of1).toBe('c-elRGCe')
		expect(cssString1of1).toBe(`--sxs{--sxs:2 c-elRGCe}@media{.c-elRGCe{---brand:500px;width:var(---brand)}}`)
	})

	test('Functionality of stringification — local tokens prefixed', () => {
		const { css, getCssText } = createStitches({
			prefix: 'fusion',
		})

		const component1of1 = css({
			$$brand: '500px',
			width: '$$brand',
		})

		const className1of1 = `${component1of1()}`
		const cssString1of1 = getCssText()

		expect(className1of1).toBe('fusion-c-elRGCe')
		expect(cssString1of1).toBe(`--sxs{--sxs:2 fusion-c-elRGCe}@media{.fusion-c-elRGCe{--fusion--brand:500px;width:var(--fusion--brand)}}`)
	})

	test('Stringification: Utils + Local Tokens', () => {
		const { css, getCssText } = createStitches({
			utils: {
				backdropFilter: (value) => ({
					WebkitBackdropFilter: value,
					backdropFilter: value,
				}),
			},
		})

		const component1of1 = css({
			$$blur: 'test',
			backdropFilter: '$$blur',
		})

		const className1of1 = `${component1of1()}`
		const cssString1of1 = getCssText()

		expect(className1of1).toBe('c-brAtkJ')
		expect(cssString1of1).toBe(`--sxs{--sxs:2 c-brAtkJ}@media{.c-brAtkJ{---blur:test;-webkit-backdrop-filter:var(---blur);backdrop-filter:var(---blur)}}`)
	})

	test('Theme', () => {
		const { getCssText } = createStitches({
			theme: {
				colors: {
					red: 'Crimson',
					blue: 'DodgerBlue',
				},
			},
		})

		expect(getCssText()).toBe(`--sxs{--sxs:0 t-kfidiM}@media{:root,.t-kfidiM{--colors-red:Crimson;--colors-blue:DodgerBlue}}`)
	})
}) // prettier-ignore
