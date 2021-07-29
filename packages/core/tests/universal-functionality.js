import { createStitches } from '../src/index.js'

describe('Configuration', () => {
	let stitches

	test('createStitches()', () => {
		const { css, globalCss } = createStitches()

		expect(css).toBeInstanceOf(Function)
		expect(globalCss).toBeInstanceOf(Function)
	})

	test('createStitches({})', () => {
		const { css, globalCss } = createStitches({})

		expect(css).toBeInstanceOf(Function)
		expect(globalCss).toBeInstanceOf(Function)
	})

	test('createStitches({ prefix: "fusion-" })', () => {
		const { config } = createStitches({ prefix: 'fusion-' })

		expect(config.prefix).toBe('fusion-')
	})

	test('createStitches({ theme })', () => {
		const themeConfig = { colors: { blue: 'dodgerblue' } }

		const { config } = createStitches({ theme: themeConfig })

		expect(config.theme).toBe(themeConfig)
	})
})
