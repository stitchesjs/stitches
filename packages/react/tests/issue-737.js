import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { createStitches } from '../src/index.js'

describe('Issue #737', () => {
	{
		const { styled, getCssText } = createStitches({
			media: {
				bp1: '(min-width: 768px)',
			},
		})

		const TestComponent = styled('div', {
			variants: {
				variant: {
					red: {
						color: 'red',
					},
				},
			},
		})

		// now test that the initial variant in rendered fist
		test('initial variants are rendered before responsive variants', () => {
			// render responsive variants
			renderer.act(() => {
				renderer.create(
					React.createElement(React.Fragment, null, [
						// render responsive variant first without initial
						React.createElement(TestComponent, { key: 0, variant: { '@bp1': 'red' } }),
						// render initial variant
						React.createElement(TestComponent, { key: 1, variant: {'@initial': 'red'} }),
					]),
				)
			})
			expect(getCssText()).toBe(`--sxs{--sxs:3 c-PJLV-gmqXFB-variant-red}@media{.c-PJLV-gmqXFB-variant-red{color:red}}--sxs{--sxs:4 c-PJLV-iOPXJy-variant-red}@media{@media (min-width: 768px){.c-PJLV-iOPXJy-variant-red{color:red}}}`)

		})
	}
})
