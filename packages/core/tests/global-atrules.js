import { createCss } from '../src/index.js'

describe('Support @import', () => {
	test('Authors can define an @import rule', () => {
		const { global, getCssString } = createCss()

		const importURL = `https://unpkg.com/sanitize.css@12.0.1/sanitize.css`

		global({
			'@import': `"${importURL}"`,
		})()

		expect(getCssString()).toBe(`@import "${importURL}";`)
	})

	test('Authors can define multiple @import rules', () => {
		const { global, getCssString } = createCss()

		const importURL1 = `https://unpkg.com/sanitize.css@12.0.1/sanitize.css`
		const importURL2 = `https://unpkg.com/sanitize.css@12.0.1/typography.css`

		global({
			'@import': [`"${importURL1}"`, `"${importURL2}"`],
		})()

		expect(getCssString()).toBe(`@import "${importURL1}";@import "${importURL2}";`)
	})

	test('Authors can an @import rule without quotes', () => {
		const { global, getCssString } = createCss()

		const importURL = `https://unpkg.com/sanitize.css@12.0.1/sanitize.css`

		global({
			'@import': importURL,
		})()

		expect(getCssString()).toBe(`@import "${importURL}";`)
	})
}) // prettier-ignore

describe('Support @font-face', () => {
	test('Authors can define a @font-face rule', () => {
		const { global, getCssString } = createCss()

		global({
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

		expect(getCssString()).toBe(
			`--stitches{--:1 PCbjJ}` +
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
		const { global, getCssString } = createCss()

		global({
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

		expect(getCssString()).toBe(
			`--stitches{--:1 JJHhj}` +
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
