import { createCss } from '../src/index.js'

describe('Composition', () => {
	test('Renders a component as the final composition by default', () => {
		const { css, toString } = createCss()
		const red = css({ color: 'red' })
		const size14 = css({ fontSize: '14px' })
		const bold = css({ fontWeight: 'bold' })
		const title = css(red, size14, bold, { fontFamily: 'monospace' })

		expect(title.className).toBe('sxlktsn')
		expect(toString()).toBe('.sxlktsn{font-family:monospace;}')
	})

	test('Renders a component with all compositions', () => {
		const { css, toString } = createCss()
		const red = css({ color: 'red' })
		const size14 = css({ fontSize: '14px' })
		const bold = css({ fontWeight: 'bold' })
		const title = css(red, size14, bold, { fontFamily: 'monospace' })

		expect(title().className).toBe('sx3ye05 sxgsv3w sxsfl0j sxlktsn')
		expect(toString()).toBe('.sx3ye05{color:red;}.sxgsv3w{font-size:14px;}.sxsfl0j{font-weight:bold;}.sxlktsn{font-family:monospace;}')
	})
})
