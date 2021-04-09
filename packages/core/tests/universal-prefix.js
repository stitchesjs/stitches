import { createCss } from '../src/index.js'

describe('Prefix', () => {
	const prefix = 'fusion'

	test('Authors can define a prefix applied to themes', () => {
		const { theme, toString } = createCss({ prefix })

		expect(toString()).toBe('')

		const hash = 'rrtg8'

		expect(theme({ colors: { red: 'tomato' } }).toString()).toBe(`${prefix}${hash}`)

		expect(toString()).toBe(`.${prefix}${hash}{--fusion-colors-red:tomato;}`)
	})

	test('Authors can define a prefix not applied to named themes', () => {
		const { theme, toString } = createCss({ prefix })

		expect(toString()).toBe('')

		const themeName = 'my-theme-name'

		const myTheme = theme(themeName, { colors: { red: 'tomato' } })

		expect(myTheme.toString()).toBe(`${themeName}`)

		expect(toString()).toBe(`.${themeName}{--fusion-colors-red:tomato;}`)
	})

	test('Authors can define a prefix applied to components', () => {
		const { css, toString } = createCss({ prefix })

		expect(toString()).toBe('')

		const component = css({ color: 'red' })

		expect(toString()).toBe('')

		component.toString()

		expect(toString()).toBe('.fusion3ye05{color:red;}')
	})
})
