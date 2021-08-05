import { createStitches } from '../src/index.js'

describe('Prefix', () => {
	const prefix = 'fusion'

	test('Authors can define a prefix applied to themes', () => {
		const { createTheme, toString } = createStitches({ prefix })

		expect(toString()).toBe('')

		const hash = 'iknykm'

		expect(createTheme({ colors: { red: 'tomato' } }).toString()).toBe(`${prefix}-t-${hash}`)

		expect(toString()).toBe(`--sxs{--sxs:0 fusion-t-iknykm}@media{.${prefix}-t-${hash}{--fusion-colors-red:tomato}}`)
	})

	test('Authors can define a prefix not applied to named themes', () => {
		const { createTheme, toString } = createStitches({ prefix })

		expect(toString()).toBe('')

		const themeName = 'my-theme-name'

		const myTheme = createTheme(themeName, { colors: { red: 'tomato' } })

		expect(myTheme.toString()).toBe(`${themeName}`)

		expect(toString()).toBe(`--sxs{--sxs:0 my-theme-name}@media{.${themeName}{--fusion-colors-red:tomato}}`)
	})

	test('Authors can define a prefix applied to components', () => {
		const { css, toString } = createStitches({ prefix })

		expect(toString()).toBe('')

		const component = css({ color: 'red' })

		expect(toString()).toBe('')

		component.toString()

		expect(toString()).toBe(`--sxs{--sxs:2 fusion-c-gmqXFB}@media{.fusion-c-gmqXFB{color:red}}`)
	})
})
