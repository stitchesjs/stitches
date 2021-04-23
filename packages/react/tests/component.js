import * as React from 'react'
import createCss from '../src/index.js'

describe('Components', () => {
	test('The `styled` function returns an implicit span component', () => {
		const { styled } = createCss()
		const component = styled()

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component.stitchesType).toBe('span')
	})

	test('The `styled` function can return an explicit div component', () => {
		const { styled } = createCss()
		const component = styled('div')

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component.stitchesType).toBe('div')
	})

	test('The `styled` function can return an explicit React component', () => {
		function TextComponent() {
			return 'text'
		}

		const { styled } = createCss()
		const component = styled(TextComponent)

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component.stitchesType).toBe(TextComponent)
	})

	test('The `styled` function can return an explicit forwarded ref React component', () => {
		const ForwardedComponent = {
			$$typeof: Symbol.for('react.forward_ref'),
			render: () => 'text',
		}

		const { styled } = createCss()
		const component = styled(ForwardedComponent)
		const expression = component.render()

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component.stitchesType).toBe(ForwardedComponent)
		expect(expression.$$typeof).toBe(Symbol.for('react.element'))
		expect(expression.type.$$typeof).toBe(Symbol.for('react.forward_ref'))
	})

	test('The `styled` function can return an explicit React memo component', () => {
		const MyComp = () => null
		const MyCompMemo = React.memo(MyComp)

		const { styled } = createCss()
		const component = styled(MyCompMemo)
		const expression = component.render()

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component.stitchesType).toBe(MyCompMemo)
		expect(expression.$$typeof).toBe(Symbol.for('react.element'))
		expect(expression.type.$$typeof).toBe(Symbol.for('react.memo'))
	})
})
