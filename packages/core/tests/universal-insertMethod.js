import createCss from '../src/index.js'

describe('Insert Method', () => {
	test('default', () => {
		const { global, toString } = createCss()

		global({
			body: {
				margin: 0,
			},
		})()

		expect(toString()).toBe('body{margin:0;}')
	})

	test('insertMethod: "prepend", explicit', () => {
		const { global, toString } = createCss({
			insertMethod: 'prepend',
		})

		global({
			body: {
				margin: 0,
			},
		})()

		expect(toString()).toBe('body{margin:0;}')
	})

	test('insertMethod: "append", explicit', () => {
		const { global, toString } = createCss({
			insertMethod: 'append',
		})

		global({
			body: {
				margin: 0,
			},
		})()

		expect(toString()).toBe('body{margin:0;}')
	})

	test('insertMethod: function, explicit', () => {
		let didInitialize = false
		let didInsertNode = false
		let resultCss = ''
		let expectCss = 'body{margin:0;}'

		const { global, toString } = createCss({
			insertMethod() {
				didInitialize = true

				return (updatedCssText) => {
					didInsertNode = true

					resultCss = updatedCssText
				}
			},
		})

		expect(didInitialize).toBe(true)
		expect(didInsertNode).toBe(false)
		expect(resultCss).toBe('')

		global({
			body: {
				margin: 0,
			},
		})()

		expect(didInsertNode).toBe(true)
		expect(toString()).toBe(expectCss)
		expect(resultCss).toBe(expectCss)
	})
})
