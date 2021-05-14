import { createCss } from '../src/index.js'

describe('Autoprefixer', () => {
	test('appearance', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				appearance: 'none',
			},
		})()

		expect(toString()).toBe('--stitches{--:1 kozGVo}@media{x-element{-webkit-appearance:none;appearance:none}}')
	})

	test('backfaceVisibility', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				backfaceVisibility: 'visible',
			},
		})()

		expect(toString()).toBe('--stitches{--:1 gaCVoe}@media{x-element{-webkit-backface-visibility:visible;backface-visibility:visible}}')
	})

	test('backgroundClip', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				backgroundClip: 'border-box',
			},
		})()

		expect(toString()).toBe('--stitches{--:1 gIcRdw}@media{x-element{-webkit-background-clip:border-box;background-clip:border-box}}')
	})

	test('clipPath', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				clipPath: 'circle(40%)',
			},
		})()

		expect(toString()).toBe('--stitches{--:1 ccZNl}@media{x-element{-webkit-clip-path:circle(40%);clip-path:circle(40%)}}')
	})

	test('hyphens', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				hyphens: 'none',
			},
		})()

		expect(toString()).toBe('--stitches{--:1 cRggdz}@media{x-element{-webkit-hyphens:none;hyphens:none}}')
	})

	test('maskImage', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				maskImage: 'none',
			},
		})()

		expect(toString()).toBe('--stitches{--:1 eNBesV}@media{x-element{-webkit-mask-image:none;mask-image:none}}')
	})

	test('tabSize', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				tabSize: 'none',
			},
		})()

		expect(toString()).toBe('--stitches{--:1 kPCdtQ}@media{x-element{-moz-tab-size:none;tab-size:none}}')
	})

	test('userSelect', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				userSelect: 'none',
			},
		})()

		expect(toString()).toBe('--stitches{--:1 kEUokv}@media{x-element{-webkit-user-select:none;user-select:none}}')
	})
})
