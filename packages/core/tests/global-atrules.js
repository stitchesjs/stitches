import { createStitches } from '../src/index.js'

describe('Support @import', () => {
	test('Authors can define an @import rule', () => {
		const { globalCss, getCssText } = createStitches()

		const importURL = `https://unpkg.com/sanitize.css@12.0.1/sanitize.css`

		globalCss({
			'@import': `"${importURL}"`,
		})()

		expect(getCssText()).toBe(`@import "${importURL}";`)
	})

	test('Authors can define multiple @import rules', () => {
		const { globalCss, getCssText } = createStitches()

		const importURL1 = `https://unpkg.com/sanitize.css@12.0.1/sanitize.css`
		const importURL2 = `https://unpkg.com/sanitize.css@12.0.1/typography.css`

		globalCss({
			'@import': [`"${importURL1}"`, `"${importURL2}"`],
		})()

		expect(getCssText()).toBe(`@import "${importURL1}";@import "${importURL2}";`)
	})

	test('Authors can an @import rule without quotes', () => {
		const { globalCss, getCssText } = createStitches()

		const importURL = `https://unpkg.com/sanitize.css@12.0.1/sanitize.css`

		globalCss({
			'@import': importURL,
		})()

		expect(getCssText()).toBe(`@import "${importURL}";`)
	})
}) // prettier-ignore

describe('Support @font-face', () => {
	test('Authors can define a @font-face rule', () => {
		const { globalCss, getCssText } = createStitches()

		globalCss({
			'@font-face': {
				fontFamily: 'system-ui',
				fontStyle: 'normal',
				fontWeight: 400,
				src: [
					`local(".SFNS-Regular")`,
					`local(".SFNSText-Regular")`,
					`local(".HelveticaNeueDeskInterface-Regular")`,
					`local(".LucidaGrandeUI")`,
					`local("Segoe UI")`,
					`local("Ubuntu")`,
					`local("Roboto-Regular")`,
					`local("DroidSans")`,
					`local("Tahoma")`,
				],
			},
		})()

		expect(getCssText()).toBe(
			`--sxs{--sxs:1 PCbjJ}` +
			`@media{` +
				`@font-face{` +
					`font-family:system-ui;` +
					`font-style:normal;` +
					`font-weight:400;` +
					`src:local(".SFNS-Regular"),local(".SFNSText-Regular"),local(".HelveticaNeueDeskInterface-Regular"),local(".LucidaGrandeUI"),local("Segoe UI"),local("Ubuntu"),local("Roboto-Regular"),local("DroidSans"),local("Tahoma")` +
				`}` +
			`}`,
		)
	})

	test('Authors can define multiple @font-face rules', () => {
		const { globalCss, getCssText } = createStitches()

		globalCss({
			'@font-face': [
				{
					fontFamily: 'system-ui',
					fontStyle: 'normal',
					fontWeight: 400,
					src: [
						`local(".SFNS-Regular")`,
						`local(".SFNSText-Regular")`,
						`local(".HelveticaNeueDeskInterface-Regular")`,
						`local(".LucidaGrandeUI")`,
						`local("Segoe UI")`,
						`local("Ubuntu")`,
						`local("Roboto-Regular")`,
						`local("DroidSans")`,
						`local("Tahoma")`,
					],
				},
				{
					fontFamily: 'system-ui',
					fontStyle: 'italic',
					fontWeight: 400,
					src: [
						`local(".SFNS-Italic")`,
						`local(".SFNSText-Italic")`,
						`local(".HelveticaNeueDeskInterface-Italic")`,
						`local(".LucidaGrandeUI")`,
						`local("Segoe UI Italic")`,
						`local("Ubuntu Italic")`,
						`local("Roboto-Italic")`,
						`local("DroidSans")`,
						`local("Tahoma")`,
					],
				},
			],
		})()

		expect(getCssText()).toBe(
			`--sxs{--sxs:1 JJHhj}` +
			`@media{` +
				`@font-face{` +
					`font-family:system-ui;` +
					`font-style:normal;` +
					`font-weight:400;` +
					`src:local(".SFNS-Regular"),local(".SFNSText-Regular"),local(".HelveticaNeueDeskInterface-Regular"),local(".LucidaGrandeUI"),local("Segoe UI"),local("Ubuntu"),local("Roboto-Regular"),local("DroidSans"),local("Tahoma")` +
				`}` +

				`@font-face{` +
					`font-family:system-ui;` +
					`font-style:italic;` +
					`font-weight:400;` +
					`src:local(".SFNS-Italic"),local(".SFNSText-Italic"),local(".HelveticaNeueDeskInterface-Italic"),local(".LucidaGrandeUI"),local("Segoe UI Italic"),local("Ubuntu Italic"),local("Roboto-Italic"),local("DroidSans"),local("Tahoma")` +
				`}` +
			`}`
		)
	})
}) // prettier-ignore
