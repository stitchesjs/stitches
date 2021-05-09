import { createCss } from '../src/index.js'

describe('Autoprefixer', () => {
	test('appearance', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				appearance: 'none',
			},
		})()

		expect(toString()).toBe('x-element{-webkit-appearance:none;appearance:none;}')
	})

	test('backfaceVisibility', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				backfaceVisibility: 'visible',
			},
		})()

		expect(toString()).toBe('x-element{-webkit-backface-visibility:visible;backface-visibility:visible;}')
	})

	test('backgroundClip', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				backgroundClip: 'border-box',
			},
		})()

		expect(toString()).toBe('x-element{-webkit-background-clip:border-box;background-clip:border-box;}')
	})

	test('clipPath', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				clipPath: 'circle(40%)',
			},
		})()

		expect(toString()).toBe('x-element{-webkit-clip-path:circle(40%);clip-path:circle(40%);}')
	})

	test('hyphens', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				hyphens: 'none',
			},
		})()

		expect(toString()).toBe('x-element{-webkit-hyphens:none;hyphens:none;}')
	})

	test('maskImage', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				maskImage: 'none',
			},
		})()

		expect(toString()).toBe('x-element{-webkit-mask-image:none;mask-image:none;}')
	})

	test('tabSize', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				tabSize: 'none',
			},
		})()

		expect(toString()).toBe('x-element{-moz-tab-size:none;tab-size:none;}')
	})

	test('textSizeAdjust', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				textSizeAdjust: 'none',
			},
		})()

		expect(toString()).toBe('x-element{-webkit-text-size-adjust:none;-moz-text-size-adjust:none;text-size-adjust:none;}')
	})

	test('userSelect', () => {
		const { global, toString } = createCss()

		global({
			'x-element': {
				userSelect: 'none',
			},
		})()

		expect(toString()).toBe('x-element{-webkit-user-select:none;user-select:none;}')
	})
})
