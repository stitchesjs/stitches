import createCss from '../src/index.js'

describe('React Component with CSS prop', () => {
	test('Authors can create a component and pass it a css prop of overrides', () => {
		const { styled, toString } = createCss()

		styled('button', {
			order: 1,
		}).render({
			css: {
				order: 2,
			},
		})

		expect(toString()).toBe(
			// prettier-ignore
			'.sxjq6z2{order:1;}' +
			'.sxjq6z2-yg8rb{order:2;}',
		)
	})

	test('React example from Radix', () => {
		const { styled, toString } = createCss({
			media: {
				bp2: '(min-width: 900px)',
			},
		})

		const expression = styled('button', {
			color: 'inherit',
		}).render({
			css: {
				fontWeight: 500,
				fontVariantNumeric: 'proportional-nums',
				lineHeight: '35px',
				'@bp2': {
					lineHeight: '55px',
					color: 'red',
				},
			},
		})

		expect(expression.props).toEqual({
			className: 'sx2obmh sx2obmh-nl6rn',
		})

		// prettier-ignore
		expect(toString()).toBe(
			'.sx2obmh{color:inherit;}' +
			'.sx2obmh-nl6rn{font-weight:500;font-variant-numeric:proportional-nums;line-height:35px;}' +
			'@media (min-width: 900px){' +
				'.sx2obmh-nl6rn{line-height:55px;color:red;}' +
			'}',
		)
	})

	test('Authors can create a component witout CSS prop', () => {
		const { styled, toString } = createCss()

		const expression = styled('button').render()

		expect(expression.props).toEqual({
			className: 'sx03kze'
		})
	
		expect(toString()).toBe('')
	})
})
