import createCss from '../src/index.js'

describe('Numeric Values', () => {
	test('Authors can use numeric values to assign px values', () => {
		const { global, toString } = createCss()

		expect(toString()).toBe('')

		global({
			body: {
				margin: 0,
			},
		})()

		expect(toString()).toBe('body{margin:0;}')

		global({
			body: {
				margin: 10,
			},
		})()

		expect(toString()).toBe('body{margin:0;}body{margin:10px;}')
	})

	test('Authors can use numeric values to assign numeric values', () => {
		const { global, toString } = createCss()

		expect(toString()).toBe('')

		global({
			body: {
				lineHeight: 0,
				width: 0,
			},
		})()

		expect(toString()).toBe('body{line-height:0;width:0;}')

		global({
			body: {
				lineHeight: 10,
				width: 10,
			},
		})()

		expect(toString()).toBe('body{line-height:0;width:0;}body{line-height:10;width:10px;}')
	})
})
