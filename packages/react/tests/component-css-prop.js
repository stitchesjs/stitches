import { createCss } from '../src/index.js'

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

		expect(toString()).toBe(`--stitches{--:2 c-hhyRYU}@media{.c-hhyRYU{order:1}}--stitches{--:4 c-hhyRYU-ilhKMMn-css}@media{.c-hhyRYU-ilhKMMn-css{order:2}}`)
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
				'fontWeight': 500,
				'fontVariantNumeric': 'proportional-nums',
				'lineHeight': '35px',
				'@bp2': {
					lineHeight: '55px',
					color: 'red',
				},
			},
		})

		expect(expression.props).toEqual({
			className: 'c-bHwuwj c-bHwuwj-ibwrayD-css',
		})

		expect(toString()).toBe(
			`--stitches{--:2 c-bHwuwj}@media{.c-bHwuwj{color:inherit}}--stitches{--:4 c-bHwuwj-ibwrayD-css}@media{.c-bHwuwj-ibwrayD-css{font-weight:500;font-variant-numeric:proportional-nums;line-height:35px}@media (min-width: 900px){.c-bHwuwj-ibwrayD-css{line-height:55px;color:red}}}`,
		)
	})
})
