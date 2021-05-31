import { createCss } from '../src/index.js'

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
		expect(expression1.props.className).toBe('c-PJLV c-PJLV-kydkiA-variant')

		const expression3 = component.render({ color: undefined })
		expect(expression3.props.className).toBe('c-PJLV c-PJLV-kydkiA-variant')
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
		expect(expression1.props.className).toBe('c-PJLV c-PJLV-kydkiA-variant')

		const expression2 = component.render({ color: 'red' })
		expect(expression2.props.className).toBe('c-PJLV c-PJLV-gmqXFB-variant')

		const expression3 = component.render({ color: undefined })
		expect(expression3.props.className).toBe('c-PJLV c-PJLV-hzqlOY-variant')
	})
})
