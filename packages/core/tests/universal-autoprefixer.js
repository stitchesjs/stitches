import { createStitches } from '../src/index.js'

describe('Autoprefixer', () => {
	test('appearance', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				appearance: 'none',
			},
		})()

		expect(toString()).toBe('--sxs{--sxs:1 kozGVo}@media{x-element{-webkit-appearance:none;appearance:none}}')
	})

	test('backfaceVisibility', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				backfaceVisibility: 'visible',
			},
		})()

		expect(toString()).toBe('--sxs{--sxs:1 gaCVoe}@media{x-element{-webkit-backface-visibility:visible;backface-visibility:visible}}')
	})

	test('backgroundClip', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				backgroundClip: 'border-box',
			},
		})()

		expect(toString()).toBe('--sxs{--sxs:1 gIcRdw}@media{x-element{-webkit-background-clip:border-box;background-clip:border-box}}')
	})

	test('clipPath', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				clipPath: 'circle(40%)',
			},
		})()

		expect(toString()).toBe('--sxs{--sxs:1 ccZNl}@media{x-element{-webkit-clip-path:circle(40%);clip-path:circle(40%)}}')
	})

	test('hyphens', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				hyphens: 'none',
			},
		})()

		expect(toString()).toBe('--sxs{--sxs:1 cRggdz}@media{x-element{-webkit-hyphens:none;hyphens:none}}')
	})

	test('maskImage', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				maskImage: 'none',
			},
		})()

		expect(toString()).toBe('--sxs{--sxs:1 eNBesV}@media{x-element{-webkit-mask-image:none;mask-image:none}}')
	})

	test('tabSize', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				tabSize: 'none',
			},
		})()

		expect(toString()).toBe('--sxs{--sxs:1 kPCdtQ}@media{x-element{-moz-tab-size:none;tab-size:none}}')
	})

	test('textSizeAdjust', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				textSizeAdjust: '100%',
			},
		})()

		expect(toString()).toBe('--sxs{--sxs:1 gVFtip}@media{x-element{-webkit-text-size-adjust:100%;text-size-adjust:100%}}')
	})

	test('userSelect', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				userSelect: 'none',
			},
		})()

		expect(toString()).toBe('--sxs{--sxs:1 kEUokv}@media{x-element{-webkit-user-select:none;user-select:none}}')
	})
})
