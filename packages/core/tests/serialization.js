import createCss from '../src/index.js'

describe('Serialization', () => {
	const { css, theme } = createCss()

	const myComponent = css({
		all: 'unset',
		font: 'inherit',
		margin: 0,
		padding: '0.5em 1em',
	})
	const myComponentClassName = 'sxyvi1f'

	const myTheme = theme({
		colors: {
			blue: 'dodgerblue',
		},
	})
	const myThemeClassName = 'sx7guyg'

	test('Components will stringify as their class name', () => {
		expect(myComponent.toString()).toBe(myComponentClassName)
		expect(String(myComponent)).toBe(myComponentClassName)
		expect('' + myComponent).toBe(myComponentClassName)
		expect(`${myComponent}`).toBe(myComponentClassName)
	})

	test('Themes will stringify as their class name', () => {
		expect(myTheme.toString()).toBe(myThemeClassName)
		expect(String(myTheme)).toBe(myThemeClassName)
		expect('' + myTheme).toBe(myThemeClassName)
		expect(`${myTheme}`).toBe(myThemeClassName)
	})

	test('Components and themes can explicitly return their class name', () => {
		expect(myComponent.className).toBe(myComponentClassName)
		expect(myTheme.className).toBe(myThemeClassName)
	})

	test('Components and themes can explicitly return their query selector', () => {
		expect(myComponent.query).toBe(`.${myComponentClassName}`)
		expect(myTheme.query).toBe(`.${myThemeClassName}`)
	})
})
