import * as React from 'react'
import createCss from '../src/index.js'

describe('Components', () => {
	test('The `styled` function returns a React component in the form of a forwarded ref object', () => {
		const { styled } = createCss()
		const component = styled()
		const expression = component.render()

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component.render).toBeInstanceOf(Function)
		expect(React.isValidElement(expression)).toBe(true)
	})

	test('The `styled` function creates an implicit span element', () => {
		const { styled } = createCss()
		const component = styled()
		const expression = component.render()

		expect(component.stitchesType).toBe('span')
		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.type).toBe('span')
	})

	test('The `styled` function can create an explicit div element', () => {
		const { styled } = createCss()
		const component = styled('div')
		const expression = component.render()

		expect(component.stitchesType).toBe('div')
		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.type).toBe('div')
	})

	test('The `styled` function can create an element from an explicit React component', () => {
		function TextComponent() {
			return 'text'
		}

		const { styled } = createCss()
		const component = styled(TextComponent)
		const expression = component.render()

		expect(component.stitchesType).toBe(TextComponent)
		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.type).toBe(TextComponent)
	})

	test('The `styled` function can create an element from an explicit forwarded ref React component', () => {
		const ForwardedRefComponent = React.forwardRef((_, ref) => React.createElement('div', { ref }))

		const { styled } = createCss()
		const component = styled(ForwardedRefComponent)
		const expression = component.render()

		expect(component.stitchesType).toBe(ForwardedRefComponent)
		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.type.$$typeof).toBe(Symbol.for('react.forward_ref'))
	})

	test('The `styled` function can create an element from an explicit React memo component', () => {
		const MyComp = () => 'text'
		const MyCompMemo = React.memo(MyComp)

		const { styled } = createCss()
		const component = styled(MyCompMemo)
		const expression = component.render()

		expect(component.stitchesType).toBe(MyCompMemo)
		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.type.$$typeof).toBe(Symbol.for('react.memo'))
	})

	test('The `styled` function creates an element with key: null', () => {
		const { styled } = createCss()
		const component = styled()
		const expression = component.render()

		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.key).toBe(null)
	})
})
