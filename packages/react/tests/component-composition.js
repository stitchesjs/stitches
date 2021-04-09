import createCss from '../src/index.js'

describe('Composition', () => {
	test('Renders an empty component', () => {
		const { styled, toString } = createCss()
		const generic = styled()

		expect(generic.render().props).toEqual({ className: 'sx03kze' })
		expect(toString()).toBe('')
	})

	test('Renders a component as the final composition by default', () => {
		const { styled, toString } = createCss()
		const red = styled({ color: 'red' })
		const size14 = styled({ fontSize: '14px' })
		const bold = styled({ fontWeight: 'bold' })
		const title = styled(red, size14, bold, { fontFamily: 'monospace' })
		expect(title.className).toBe('sxlktsn')
		expect(toString()).toBe('.sxlktsn{font-family:monospace;}')
	})

	test('Renders a component with all compositions', () => {
		const { styled, toString } = createCss()
		const red = styled({ color: 'red' })
		const size14 = styled({ fontSize: '14px' })
		const bold = styled({ fontWeight: 'bold' })
		const title = styled(red, size14, bold, { fontFamily: 'monospace' })
		expect(title.render().props.className).toBe('sx3ye05 sxgsv3w sxsfl0j sxlktsn')
		expect(toString()).toBe('.sx3ye05{color:red;}.sxgsv3w{font-size:14px;}.sxsfl0j{font-weight:bold;}.sxlktsn{font-family:monospace;}')
	})
})
