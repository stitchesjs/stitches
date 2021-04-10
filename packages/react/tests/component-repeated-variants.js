import { createCss } from '../src/index.js'

describe('emerson', () => {
	test('lake', () => {
		const { styled, toString } = createCss({
			utils: {
				px: () => (value) => ({
					paddingLeft: value,
					paddingRight: value,
				}),
			},
		})

		const component = styled('span', {
			variants: {
				// prettier-ignore
				size: {
					'1': {
						px: '$1',
					},
					'2': {
						px: '$2',
					},
				},
			},
		})

		const cssText = '.sxqhal7cmht9--size-1{padding-left:var(--sx-space-1);padding-right:var(--sx-space-1);}'

		component.render({ size: '1' })

		expect(toString()).toBe(cssText)

		component.render({ size: '1' })

		expect(toString()).toBe(cssText)

		component.render({ size: '1' })

		expect(toString()).toBe(cssText)
	})
})
