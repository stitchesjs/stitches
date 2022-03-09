import { createStitches } from '../src/index.js'

describe('Issue #943', () => {
	test('@font-face descriptors', () => {
		const { globalCss, getCssText } = createStitches()

		globalCss({
			'@font-face': [
				{
					fontFamily: 'fallback-font',
					ascentOverride: '83.6%',
					descentOverride: '20.5%',
					lineGapOverride: '0%',
					advanceOverride: '10',
					src: 'local(Arial)',
				}
			]
		})()

		expect(getCssText()).toBe('--sxs{--sxs:1 jGZRm}@media{@font-face{font-family:fallback-font;ascent-override:83.6%;descent-override:20.5%;line-gap-override:0%;advance-override:10;src:local(Arial)}}')
	})
})
