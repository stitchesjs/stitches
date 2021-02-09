import createCss from '../src/index.js'

describe('Configuration', () => {
	let stitches

	test('Authors can supply or omit a configuration', () => {
		stitches = createCss({})

		expect(stitches.css).toBeInstanceOf(Function)

		stitches = createCss()

		expect(stitches.css).toBeInstanceOf(Function)
	})
})

describe('Prefix', () => {
	let stitches, component, theme

	const PREFIX = 'fusion-'

	test('Authors can define a prefix applied to themes', () => {
		stitches = createCss({
			prefix: PREFIX,
		})

		expect(stitches.toString()).toBe('')

		theme = stitches.theme('mytheme', { colors: { red: 'tomato' } })

		expect(theme.toString()).toBe(`${PREFIX}mytheme`)

		expect(stitches.toString()).toBe(`.${PREFIX}mytheme{--colors-red:tomato;}`)
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

describe('Conditions', () => {
	let stitches, component

	const MEDIUM_UP = '@media (min-width: 768px)'

	test('Authors can define conditions applied to components', () => {
		stitches = createCss({
			conditions: {
				MEDIUM_UP,
			},
		})

		component = stitches.css({
			fontSize: '16px',
			when: {
				MEDIUM_UP: {
					fontSize: '24px',
				},
			},
		})

		expect(stitches.toString()).toBe('')

		component.toString()

		expect(stitches.toString()).toBe(`.sxqh7cb{font-size:16px;}${MEDIUM_UP}{.sxqh7cb{font-size:24px;}}`)
	})
})

describe('Properties', () => {
	let stitches, component

	test('Authors can define utilties applied to components', () => {
		stitches = createCss({
			utils: {
				bg: (value) => ({ backgroundColor: value }),
			},
		})

		component = stitches.css({
			bg: 'red',
		})

		expect(stitches.toString()).toBe('')

		component.toString()

		expect(stitches.toString()).toBe('.sxxl9ux{background-color:red;}')
	})
})
