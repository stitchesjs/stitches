import createCss from '../src/index.js'

describe('Configuration', () => {
	let stitches

	test('createCss()', () => {
		const { css, global } = createCss()

		expect(css).toBeInstanceOf(Function)
		expect(global).toBeInstanceOf(Function)
	})

	test('createCss({})', () => {
		const { css, global } = createCss({})

		expect(css).toBeInstanceOf(Function)
		expect(global).toBeInstanceOf(Function)
	})

	test('createCss({ prefix: "fusion-" })', () => {
		const { config } = createCss({ prefix: 'fusion-' })

		expect(config.prefix).toBe('fusion-')
	})

	test('createCss({ theme })', () => {
		const themeConfig = { colors: { blue: 'dodgerblue' } }

		const { config } = createCss({ theme: themeConfig })

		expect(config.theme).toBe(themeConfig)
	})
})
