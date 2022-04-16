import { createStitches } from '../src/index.js'

describe('Named Components', () => {
	test('Renders an empty component', () => {
		const { styled, getCssText } = createStitches()
		const Generic = styled.withName("Generic")()
		expect(Generic.render().props).toEqual({ className: 'c-Generic-PJLV' })
		expect(getCssText()).toBe('')
	})

	test('Renders a component with all compositions', () => {
		const { styled, getCssText } = createStitches()
		const Red = styled.withName("Red")({ color: 'red' })
		const Size14 = styled.withName("Size14")({ fontSize: '14px' })
		const Bold = styled.withName("Bold")({ fontWeight: 'bold' })
		const Title = styled.withName("Title")(Red, Size14, Bold, { fontFamily: 'monospace' })
		expect(Title.render().props.className).toBe('c-Red-gmqXFB c-Size14-hzkWus c-Bold-cQFdVt c-Title-kngyIZ')
		expect(getCssText()).toBe('--sxs{--sxs:2 c-Red-gmqXFB c-Size14-hzkWus c-Bold-cQFdVt c-Title-kngyIZ}@media{.c-Red-gmqXFB{color:red}.c-Size14-hzkWus{font-size:14px}.c-Bold-cQFdVt{font-weight:bold}.c-Title-kngyIZ{font-family:monospace}}')
	})
})
