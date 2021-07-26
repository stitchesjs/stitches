import { createCss } from '../src/index.js'

describe('Composition', () => {
	test('Renders an empty component', () => {
		const { styled, getCssString } = createCss()
		const generic = styled()
		expect(generic.render().props).toEqual({ className: 'PJLV' })
		expect(getCssString()).toBe('')
	})

	test('Does not render a component without an explicit rendering', () => {
		const { styled, getCssString } = createCss()
		const red = styled({ color: 'red' })
		const size14 = styled({ fontSize: '14px' })
		const bold = styled({ fontWeight: 'bold' })
		const title = styled(red, size14, bold, { fontFamily: 'monospace' })
		expect(`${title}`).toBe('.c-kngyIZ')
		expect(getCssString()).toBe('')
	})

	test('Renders a component with all compositions', () => {
		const { styled, getCssString } = createCss()
		const red = styled({ color: 'red' })
		const size14 = styled({ fontSize: '14px' })
		const bold = styled({ fontWeight: 'bold' })
		const title = styled(red, size14, bold, { fontFamily: 'monospace' })
		expect(title.render().props.className).toBe('c-gmqXFB c-hzkWus c-cQFdVt c-kngyIZ')
		expect(getCssString()).toBe('--stitches{--:2 c-gmqXFB c-hzkWus c-cQFdVt c-kngyIZ}@media{.c-gmqXFB{color:red}.c-hzkWus{font-size:14px}.c-cQFdVt{font-weight:bold}.c-kngyIZ{font-family:monospace}}')
	})
})
