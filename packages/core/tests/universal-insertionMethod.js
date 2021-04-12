import { createCss } from '../src/index.js'

describe('Insertion Method', () => {
	test('default', () => {
		const { global, toString } = createCss()

		global({
			body: {
				margin: 0,
			},
		})()

		expect(toString()).toBe('body{margin:0;}')
	})

	test('insertionMethod: "prepend", explicit', () => {
		const { config, global, toString } = createCss({
			insertionMethod: 'prepend',
		})

		global({
			body: {
				margin: 0,
			},
		})()

		expect(toString()).toBe('body{margin:0;}')

		expect(config.insertionMethod).toBe('prepend')
	})

	test('insertionMethod: "append", explicit', () => {
		const { config, global, toString } = createCss({
			insertionMethod: 'append',
		})

		global({
			body: {
				margin: 0,
			},
		})()

		expect(toString()).toBe('body{margin:0;}')

		expect(config.insertionMethod).toBe('append')
	})

	test('insertionMethod: function, explicit', () => {
		let didInitialize = false
		let didInsertNode = false
		let resultCss = ''
		let expectCss = 'body{margin:0;}'

		const insertionMethod = () => {
			didInitialize = true

			return (updatedCssText) => {
				didInsertNode = true

				resultCss = updatedCssText
			}
		}

		const { config, global, toString } = createCss({ insertionMethod })

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

		expect(config.insertionMethod).toBe(insertionMethod)
	})
})
