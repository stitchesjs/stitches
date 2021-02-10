import createCss from '../src/index.js'

describe('Prefix', () => {
	let stitches, component, theme

	const PREFIX = 'fusion-'

	test('Authors can define a prefix applied to themes', () => {
		stitches = createCss({
			prefix: PREFIX,
		})

		expect(stitches.toString()).toBe('')

		theme = stitches.theme({ colors: { red: 'tomato' } })

		expect(theme.toString()).toBe(`${PREFIX}zhu70`)

		expect(stitches.toString()).toBe(`.${PREFIX}zhu70{--colors-red:tomato;}`)
	})

	test('Authors can define a prefix not applied to named themes', () => {
		const THEME_NAME = 'my-theme-name'

		stitches = createCss({
			prefix: PREFIX,
		})

		expect(stitches.toString()).toBe('')

		theme = stitches.theme(THEME_NAME, { colors: { red: 'tomato' } })

		expect(theme.toString()).toBe(`${THEME_NAME}`)

		expect(stitches.toString()).toBe(`.${THEME_NAME}{--colors-red:tomato;}`)
	})

	test('Authors can define a prefix applied to components', () => {
		stitches = createCss({
			prefix: PREFIX,
		})

		expect(stitches.toString()).toBe('')

		component = stitches.css({ color: 'red' })

		expect(stitches.toString()).toBe('')

		component.toString()

		expect(stitches.toString()).toBe('.fusion-3ye05{color:red;}')
	})
})
