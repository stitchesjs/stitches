import createCss from '../src/index.js'

describe('Variants', () => {
	test('Variant given undefined will revert to the default', () => {
		const { styled } = createCss()
		const component = styled('div', {
			variants: {
				color: {
					blue: {
						color: 'blue',
					},
					red: {
						color: 'red',
					},
				},
			},
			defaultVariants: {
				color: 'blue',
			},
		})

		const expression1 = component.render()
		expect(expression1.props.className).toBe('sx03kze sx03kze11nwi--color-blue')

		const expression2 = component.render({ color: 'red' })
		expect(expression2.props.className).toBe('sx03kze sx03kze3ye05--color-red')

		const expression3 = component.render({ color: undefined })
		expect(expression3.props.className).toBe('sx03kze sx03kze11nwi--color-blue')
	})

	test('Variant with an explicit undefined will work', () => {
		const { styled } = createCss()
		const component = styled('div', {
			variants: {
				color: {
					blue: {
						color: 'blue',
					},
					red: {
						color: 'red',
					},
					undefined: {
						color: 'transparent',
					},
				},
			},
			defaultVariants: {
				color: 'blue',
			},
		})

		const expression1 = component.render()
		expect(expression1.props.className).toBe('sx03kze sx03kze11nwi--color-blue')

		const expression2 = component.render({ color: 'red' })
		expect(expression2.props.className).toBe('sx03kze sx03kze3ye05--color-red')

		const expression3 = component.render({ color: undefined })
		expect(expression3.props.className).toBe('sx03kze sx03kzer02wp--color-undefined')
	})
})
