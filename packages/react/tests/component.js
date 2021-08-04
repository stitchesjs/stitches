import { createStitches } from '../src/index.js'

const internals = Symbol.for('stitches.internal')

describe('Components', () => {
	test('The `styled` function returns an implicit span component', () => {
		const { styled } = createStitches()
		const component = styled()

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component[internals].type).toBe('span')
	})

	test('The `styled` function can return an explicit div component', () => {
		const { styled } = createStitches()
		const component = styled('div')

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component[internals].type).toBe('div')
	})

	test('The `styled` function can return an explicit React component', () => {
		function TextComponent() {
			return 'text'
		}

		const { styled } = createStitches()
		const component = styled(TextComponent)

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component[internals].type).toBe(TextComponent)
	})

	test('The `styled` function can return an explicit forwarded React component', () => {
		const ForwardedComponent = {
			$$typeof: Symbol.for('react.forward_ref'),
			render: () => 'text',
		}

		const { styled } = createStitches()
		const component = styled(ForwardedComponent)

		expect(component.$$typeof).toBe(Symbol.for('react.forward_ref'))
		expect(component[internals].type).toBe(ForwardedComponent)
	})
})
