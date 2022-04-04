import { stringify } from '../src/index.js'

describe('at-rule (font-face)', () => {
	test('stringify() generates CSS with multiple `@import` rules', () => {
		expect(
			stringify({
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
			}),
		).toEqual(
			'@font-face{' +
				'font-family:system-ui;' +
				'font-style:normal;' +
				'font-weight:400;' +
				'src:local(".SFNS-Regular"),local(".SFNSText-Regular"),local(".HelveticaNeueDeskInterface-Regular"),local(".LucidaGrandeUI"),local("Segoe UI"),local("Ubuntu"),local("Roboto-Regular"),local("DroidSans"),local("Tahoma");' +
				'}',
		)
	})
})
