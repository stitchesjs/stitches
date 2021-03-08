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
		expect(expression1.props.className).toBe('sx9hpte sx9hpte11nwi--color-blue')

		const expression2 = component.render({ color: 'red' })
		expect(expression2.props.className).toBe('sx9hpte sx9hpte3ye05--color-red')

		const expression3 = component.render({ color: undefined })
		expect(expression3.props.className).toBe('sx9hpte sx9hpte11nwi--color-blue')
	})

	test('Variant with an explicit undefined will not use default variant', () => {
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
		expect(expression1.props.className).toBe('sx5z3b4 sx5z3b4r02wp--color-undefined')

		const expression2 = component.render({ color: 'red' })
		expect(expression2.props.className).toBe('sx5z3b4 sx5z3b43ye05--color-red')

		const expression3 = component.render({ color: undefined })
		expect(expression3.props.className).toBe('sx5z3b4 sx5z3b4r02wp--color-undefined')
	})
})
