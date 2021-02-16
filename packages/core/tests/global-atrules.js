import createCss from '../src/index.js'

describe('Support @import', () => {
	test('Authors can define an @import rule', () => {
		const { global, toString } = createCss({})

		const importURL = `https://unpkg.com/sanitize.css@12.0.1/sanitize.css`

		global({
			'@import': `"${importURL}"`
		})()

		expect(toString()).toBe(`@import "${importURL}";`)
	})

	test('Authors can define multiple @import rules', () => {
		const { global, toString } = createCss({})

		const importURL1 = `https://unpkg.com/sanitize.css@12.0.1/sanitize.css`
		const importURL2 = `https://unpkg.com/sanitize.css@12.0.1/typography.css`

		global({
			'@import': [`"${importURL1}"`, `"${importURL2}"`]
		})()

		expect(toString()).toBe(`@import "${importURL1}";@import "${importURL2}";`)
	})
})

describe('Support @font-face', () => {
	test('Authors can define a @font-face rule', () => {
		const { global, toString } = createCss({})

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
					`local("Tahoma")`
				]
			}
		})()

		expect(toString()).toBe(`@font-face{font-family:system-ui;font-style:normal;font-weight:400;src:local(".SFNS-Regular"),local(".SFNSText-Regular"),local(".HelveticaNeueDeskInterface-Regular"),local(".LucidaGrandeUI"),local("Segoe UI"),local("Ubuntu"),local("Roboto-Regular"),local("DroidSans"),local("Tahoma");}`)
	})
	test('Authors can define multiple @font-face rules', () => {
		const { global, toString } = createCss({})

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
						`local("Tahoma")`
					]
				},
				{
					fontFamily: 'system-ui',
					fontStyle: 'normal',
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
						`local("Tahoma")`
					]
				}
			]
		})()

		const cssFontFaceRule1 = `@font-face{font-family:system-ui;font-style:normal;font-weight:400;src:local(".SFNS-Regular"),local(".SFNSText-Regular"),local(".HelveticaNeueDeskInterface-Regular"),local(".LucidaGrandeUI"),local("Segoe UI"),local("Ubuntu"),local("Roboto-Regular"),local("DroidSans"),local("Tahoma");}`
		const cssFontFaceRule2 = `@font-face{font-family:system-ui;font-style:normal;font-weight:400;src:local(".SFNS-Italic"),local(".SFNSText-Italic"),local(".HelveticaNeueDeskInterface-Italic"),local(".LucidaGrandeUI"),local("Segoe UI Italic"),local("Ubuntu Italic"),local("Roboto-Italic"),local("DroidSans"),local("Tahoma");}`

		expect(toString()).toBe(cssFontFaceRule1 + cssFontFaceRule2)
	})
})
