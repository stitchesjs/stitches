import createCss from '../src/index.js'

describe('Empty Variants', () => {
	test('Empty Variants', () => {
		const { css, toString } = createCss()

		css({
			variants: {
				size: {
					xl: {},
				},
				tone: {
					primary: {},
				},
			},
			compoundVariants: [
				{
					tone: 'primary',
					size: 'xl',
				},
			],
		})({
			tone: 'primary',
			size: { '@initial': 'xl' },
		})

		expect(toString()).toBe('')
	})

	test('Empty Variants', () => {
		const { css, toString } = createCss()

		css({
			variants: {
				size: {
					xl: {},
				},
				tone: {
					primary: {},
				},
			},
			compoundVariants: [
				{
					tone: 'primary',
					size: 'xl',
					css: { fontSize: '24px', color: 'black' },
				},
			],
		})({
			tone: 'primary',
			size: { '@initial': 'xl' },
		})

		expect(toString()).toBe('@media all{.sxwklokppy7e--c2{font-size:24px;color:black;}}')
	})
})
