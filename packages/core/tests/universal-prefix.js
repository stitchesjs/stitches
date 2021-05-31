import { createCss } from '../src/index.js'

describe('Prefix', () => {
	const prefix = 'fusion'

	test('Authors can define a prefix applied to themes', () => {
		const { theme, toString } = createCss({ prefix })

		expect(toString()).toBe('')

		const hash = 'iknykm'

		expect(theme({ colors: { red: 'tomato' } }).toString()).toBe(`${prefix}-t-${hash}`)

		expect(toString()).toBe(`--stitches{--:0 fusion-t-iknykm}@media{.${prefix}-t-${hash}{--fusion-colors-red:tomato}}`)
	})

	test('Authors can define a prefix not applied to named themes', () => {
		const { theme, toString } = createCss({ prefix })

		expect(toString()).toBe('')

		const themeName = 'my-theme-name'

		const myTheme = theme(themeName, { colors: { red: 'tomato' } })

		expect(myTheme.toString()).toBe(`${themeName}`)

		expect(toString()).toBe(`--stitches{--:0 my-theme-name}@media{.${themeName}{--fusion-colors-red:tomato}}`)
	})

	test('Authors can define a prefix applied to components', () => {
		const { css, toString } = createCss({ prefix })

		expect(toString()).toBe('')

		const component = css({ color: 'red' })

		expect(toString()).toBe('')

		component.toString()

		expect(toString()).toBe(`--stitches{--:2 fusion-c-gmqXFB}@media{.fusion-c-gmqXFB{color:red}}`)
	})
})
