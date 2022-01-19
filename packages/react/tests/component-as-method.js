import { createStitches } from '../src/index.js'

describe('As method', () => {
	test('The "as" method can be used or overridden', () => {
		const { styled } = createStitches()
		const component1 = styled()

		const expression1 = component1.render()

		expect(expression1.type).toBe('span')

		const component2 = styled('div')
		const expression2 = component2.render()

		expect(expression2.type).toBe('div')

		const expression2a = component2.as('span').render()

		expect(expression2a.type).toBe('span')
	})

	test('The "as" method is followed during extension', () => {
		const { styled } = createStitches()
		const component1 = styled('div')
		const component2 = styled(component1)
		const expression = component2.render()

		expect(expression.type).toBe('div')

		const expression2a = component2.as('span').render()

		expect(expression2a.type).toBe('span')
	})
})
