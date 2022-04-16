import { createStitches } from '../src/index.js'

describe('Composition', () => {
	test('Renders an empty component', () => {
		const { css, toString } = createStitches()
		const generic = css.withName("Generic")()

		expect(generic().props).toEqual({ className: 'c-Generic-PJLV' })
		expect(toString()).toBe('')
	})

	test('Renders a component as the final composition by default', () => {
		const { css, toString } = createStitches()
		const Red = css.withName("Red")({ color: 'red' })
		const Size14 = css.withName("Size14")({ fontSize: '14px' })
		const Bold = css.withName("Bold")({ fontWeight: 'bold' })
		const Title = css.withName("Title")(Red, Size14, Bold, { fontFamily: 'monospace' })

		expect(Title.className).toBe('c-Red-gmqXFB')
		expect(toString()).toBe('')
		expect(String(Title)).toBe('c-Red-gmqXFB')
		expect(toString()).toBe(
			`--sxs{--sxs:2 c-Red-gmqXFB c-Size14-hzkWus c-Bold-cQFdVt c-Title-kngyIZ}@media{` +
				`.c-Red-gmqXFB{color:red}` +
				`.c-Size14-hzkWus{font-size:14px}` +
				`.c-Bold-cQFdVt{font-weight:bold}` +
				`.c-Title-kngyIZ{font-family:monospace}` +
			`}`
		)
	})

	test('Renders a component with all compositions', () => {
		const { css, toString } = createStitches()
		const Red = css.withName("Red")({ color: 'red' })
		const Size14 = css.withName("Size14")({ fontSize: '14px' })
		const Bold = css.withName("Bold")({ fontWeight: 'bold' })
		const Title = css.withName("Title")(Red, Size14, Bold, { fontFamily: 'monospace' })

		expect(Title().className).toBe('c-Red-gmqXFB c-Size14-hzkWus c-Bold-cQFdVt c-Title-kngyIZ')
		expect(toString()).toBe(
			`--sxs{--sxs:2 c-Red-gmqXFB c-Size14-hzkWus c-Bold-cQFdVt c-Title-kngyIZ}@media{` +
				`.c-Red-gmqXFB{color:red}` +
				`.c-Size14-hzkWus{font-size:14px}` +
				`.c-Bold-cQFdVt{font-weight:bold}` +
				`.c-Title-kngyIZ{font-family:monospace}` +
			`}`
		)
	})
})

