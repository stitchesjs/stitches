import { createCss } from '../src/index.js'

describe('Components', () => {
	// test('The `styled` function returns an implicit span component', () => {
	// 	const { styled } = createCss()
	// 	const component = styled()

	// 	expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
	// 	expect(component.type).toBe('span')
	// })

	// test('The `styled` function can return an explicit div component', () => {
	// 	const { styled } = createCss()
	// 	const component = styled('div')

	// 	expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
	// 	expect(component.type).toBe('div')
	// })

	// test('The `styled` function can return an explicit React component', () => {
	// 	function TextComponent() {
	// 		return 'text'
	// 	}

	// 	const { styled } = createCss()
	// 	const component = styled(TextComponent)

	// 	expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
	// 	expect(component.type).toBe(TextComponent)
	// })

	test('The `styled` function can return an explicit forwarded React component', () => {
		const ForwardedComponent = {
			$$typeof: Symbol.for('react.forward_ref'),
			render: () => 'text',
		}

		const { styled } = createCss()
		const component = styled(ForwardedComponent)

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component.type).toBe(ForwardedComponent)
	})
})
