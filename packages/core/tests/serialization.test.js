import createCss from '../src/index.js'

describe('Serialization', () => {
	const STITCHES = createCss()

	const COMPONENT = STITCHES.css({
		all: 'unset',
		font: 'inherit',
		margin: 0,
		padding: '0.5em 1em',
	})
	const COMPONENT_CLASS_NAME = 'sxyvi1f'
	const COMPONENT_QUERY_SELECTOR = `.${COMPONENT_CLASS_NAME}`

	const THEME = STITCHES.theme({
		colors: {
			blue: 'dodgerblue',
		},
	})
	const THEME_CLASS_NAME = 'sx7guyg'
	const THEME_QUERY_SELECTOR = `.${THEME_CLASS_NAME}`

	test('Component serializes as its css class name', () => {
		expect(COMPONENT.toString()).toBe(COMPONENT_CLASS_NAME)
		expect(String(COMPONENT)).toBe(COMPONENT_CLASS_NAME)
		expect('' + COMPONENT).toBe(COMPONENT_CLASS_NAME)
		expect(`${COMPONENT}`).toBe(COMPONENT_CLASS_NAME)
	})

	test('Theme serializes as its css class name', () => {
		expect(THEME.toString()).toBe(THEME_CLASS_NAME)
		expect(String(THEME)).toBe(THEME_CLASS_NAME)
		expect('' + THEME).toBe(THEME_CLASS_NAME)
		expect(`${THEME}`).toBe(THEME_CLASS_NAME)
		expect(THEME.toString()).toBe(THEME_CLASS_NAME)
	})

	test('Component or theme can also return their query selector', () => {
		expect(COMPONENT.query).toBe(COMPONENT_QUERY_SELECTOR)
		expect(THEME.query).toBe(THEME_QUERY_SELECTOR)
	})
})
