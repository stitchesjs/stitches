import { createCss } from '../src/index.js'

describe('Prefix', () => {
	const prefix = 'fusion-'

	test('Authors can define a prefix applied to themes', () => {
		const { theme, toString } = createCss({ prefix })

		expect(toString()).toBe('')

		expect(theme({ colors: { red: 'tomato' } }).toString()).toBe(`${prefix}8wd2c`)

		expect(toString()).toBe(`.${prefix}8wd2c{--colors-red:tomato;}`)
	})

	test('Authors can define a prefix not applied to named themes', () => {
		const { theme, toString } = createCss({ prefix })

		expect(toString()).toBe('')

		const themeName = 'my-theme-name'

		const myTheme = theme(themeName, { colors: { red: 'tomato' } })

		expect(myTheme.toString()).toBe(`${themeName}`)

		expect(toString()).toBe(`.${themeName}{--colors-red:tomato;}`)
	})

	test('Authors can define a prefix applied to components', () => {
		const { css, toString } = createCss({ prefix })

		expect(toString()).toBe('')

		const component = css({ color: 'red' })

		expect(toString()).toBe('')

		component.toString()

		expect(toString()).toBe('.fusion-3ye05{color:red;}')
	})
})
