import { createStitches } from '../src/index.js'

describe('Composition', () => {
	test('Renders an empty component', () => {
		const { css, toString } = createStitches()
		const generic = css()

		expect(generic().props).toEqual({ className: 'PJLV' })
		expect(toString()).toBe('')
	})

	test('Renders a component as the final composition by default', () => {
		const { css, toString } = createStitches()
		const red = css({ color: 'red' })
		const size14 = css({ fontSize: '14px' })
		const bold = css({ fontWeight: 'bold' })
		const title = css(red, size14, bold, { fontFamily: 'monospace' })

		expect(title.className).toBe('c-gmqXFB')
		expect(toString()).toBe('')
		expect(String(title)).toBe('c-gmqXFB')
		expect(toString()).toBe(
			`--sxs{--sxs:2 c-gmqXFB c-hzkWus c-cQFdVt c-kngyIZ}@media{` +
				`.c-gmqXFB{color:red}` +
				`.c-hzkWus{font-size:14px}` +
				`.c-cQFdVt{font-weight:bold}` +
				`.c-kngyIZ{font-family:monospace}` +
			`}`
		)
	})

	test('Renders a component with all compositions', () => {
		const { css, toString } = createStitches()
		const red = css({ color: 'red' })
		const size14 = css({ fontSize: '14px' })
		const bold = css({ fontWeight: 'bold' })
		const title = css(red, size14, bold, { fontFamily: 'monospace' })

		expect(title().className).toBe('c-gmqXFB c-hzkWus c-cQFdVt c-kngyIZ')
		expect(toString()).toBe(
			`--sxs{--sxs:2 c-gmqXFB c-hzkWus c-cQFdVt c-kngyIZ}@media{` +
				`.c-gmqXFB{color:red}` +
				`.c-hzkWus{font-size:14px}` +
				`.c-cQFdVt{font-weight:bold}` +
				`.c-kngyIZ{font-family:monospace}` +
			`}`
		)
	})
}) // prettier-ignore
