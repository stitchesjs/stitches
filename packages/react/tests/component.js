import * as React from 'react'
import createCss from '../src/index.js'

describe('Components', () => {
	test('The `styled` function returns a React forwarded ref object', () => {
		const { styled } = createCss()
		const component = styled()
		const expression = component.render()

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component.render).toBeInstanceOf(Function)
		expect(React.isValidElement(expression)).toBe(true)
	})

	test('The `styled` function creates an implicit span component', () => {
		const { styled } = createCss()
		const component = styled()
		const expression = component.render()

		expect(component.stitchesType).toBe('span')
		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.type).toBe('span')
	})

	test('The `styled` function can create an explicit div component', () => {
		const { styled } = createCss()
		const component = styled('div')
		const expression = component.render()

		expect(component.stitchesType).toBe('div')
		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.type).toBe('div')
	})

	test('The `styled` function can create an explicit React component', () => {
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

	test('The `styled` function can create an explicit forwarded ref React component', () => {
		const ForwardedComponent = {
			$$typeof: Symbol.for('react.forward_ref'),
			render: () => 'text',
		}

		const { styled } = createCss()
		const component = styled(ForwardedComponent)
		const expression = component.render()

		expect(component.stitchesType).toBe(ForwardedComponent)
		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.type.$$typeof).toBe(Symbol.for('react.forward_ref'))
	})

	test('The `styled` function can create an explicit React memo component', () => {
		const MyComp = () => null
		const MyCompMemo = React.memo(MyComp)

		const { styled } = createCss()
		const component = styled(MyCompMemo)
		const expression = component.render()

		expect(component.stitchesType).toBe(MyCompMemo)
		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.type.$$typeof).toBe(Symbol.for('react.memo'))
	})

	test('The `styled` function creates a React element with key: null', () => {
		const { styled } = createCss()
		const component = styled()
		const expression = component.render()

		expect(React.isValidElement(expression)).toBe(true)
		expect(expression.key).toBe(null)
	})
})
