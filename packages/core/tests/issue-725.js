import { createStitches } from '../src/index.js'

describe('Issue #725', () => {
	test('Minimum reproduction of bug', () => {
		const { css, getCssText } = createStitches({
			media: {
				tablet: `(min-width: 720px)`,
				wide: `(min-width: 1536px)`,
			},
		})

		const Flex = css({
			variants: {
				justify: {
					end: { justifyContent: 'flex-end' },
				},
			},
		})
		const render = Flex({
			justify: {
				'@tablet': 'end',
				'@wide': 'end',
			},
		})
		expect(getCssText()).toBe(`--sxs{--sxs:3 c-PJLV-jobbEJ-justify-end}@media{@media (min-width: 720px), (min-width: 1536px){.c-PJLV-jobbEJ-justify-end{justify-content:flex-end}}}`)
	})

	test('Combination with other variants', () => {
		const { css, getCssText } = createStitches({
			media: {
				mobile: `(min-width: 420px)`,
				tablet: `(min-width: 720px)`,
				wide: `(min-width: 1536px)`,
			},
		})

		const Flex = css({
			variants: {
				justify: {
					end: { justifyContent: 'flex-end' },
					start: { justifyContent: 'flex-start' },
				},
				color: {
					red: { color: 'red' },
				},
			},
			defaultVariants: {
				color: 'red',
			},
		})
		const render = Flex({
			justify: {
				'@tablet': 'end',
				'@wide': 'end',
				'@mobile': 'start'
			},
		})
		expect(getCssText()).toBe(`--sxs{--sxs:3 c-PJLV-gmqXFB-color-red c-PJLV-jobbEJ-justify-end c-PJLV-kxjDkG-justify-start}@media{.c-PJLV-gmqXFB-color-red{color:red}@media (min-width: 720px), (min-width: 1536px){.c-PJLV-jobbEJ-justify-end{justify-content:flex-end}}@media (min-width: 420px){.c-PJLV-kxjDkG-justify-start{justify-content:flex-start}}}`)
	})
})
