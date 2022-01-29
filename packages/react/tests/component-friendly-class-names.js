import { createStitches } from '../src/index.js'

describe('Generate human-legible class names', () => {
	test('Renders a DIV with "Wrapper" in its class name', () => {
		const { styled } = createStitches()

		const Wrapper = styled('div', {}, "Wrapper")
		const expression = Wrapper.render()
		expect(expression.props.className).toBe("c-Wrapper-PJLV")
	})

	test('Renders an H1 with "Heading" in its class name', () => {
		const { styled } = createStitches()

		const Heading = styled('h1', {}, "Heading")
		const expression = Heading.render()
		expect(expression.props.className).toBe("c-Heading-PJLV")
	})
})
