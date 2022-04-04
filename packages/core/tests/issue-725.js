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
		Flex({
			justify: {
				'@tablet': 'end',
				'@wide': 'end',
			},
		})
		expect(getCssText()).toBe(
			`--sxs{--sxs:4 c-PJLV-jobbEJ-justify-end}@media{@media (min-width: 720px), (min-width: 1536px){.c-PJLV-jobbEJ-justify-end{justify-content:flex-end}}}`,
		)
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
		Flex({
			justify: {
				'@tablet': 'end',
				'@wide': 'end',
				'@mobile': 'start',
			},
		})
		expect(getCssText()).toBe(
			`--sxs{--sxs:3 c-PJLV-gmqXFB-color-red}@media{.c-PJLV-gmqXFB-color-red{color:red}}--sxs{--sxs:4 c-PJLV-jobbEJ-justify-end c-PJLV-kxjDkG-justify-start}@media{@media (min-width: 720px), (min-width: 1536px){.c-PJLV-jobbEJ-justify-end{justify-content:flex-end}}@media (min-width: 420px){.c-PJLV-kxjDkG-justify-start{justify-content:flex-start}}}`,
		)
	})
	test('Test compound variants', () => {
		const { css, getCssText } = createStitches({
			media: {
				bp1: `(min-width: 720px)`,
				bp2: `(min-width: 1536px)`,
			},
		})

		const Button = css({
			variants: {
				variant: {
					red: { backgroundColor: 'tomato' },
					blue: { backgroundColor: 'SkyBlue' },
				},
				disabled: {
					true: { backgroundColor: 'gray' },
				},
			},
			compoundVariants: [
				{
					variant: 'red',
					disabled: true,
					css: {
						padding: 50,
					},
				},
			],
		})

		Button({
			variant: { '@bp1': 'red', '@bp2': 'red' },
			disabled: { '@bp2': true, '@bp1': false },
		})
		expect(getCssText()).toBe(
			`--sxs{--sxs:4 c-PJLV-dJnmKC-disabled-true c-PJLV-gSmlSg-variant-red}@media{@media (min-width: 1536px){.c-PJLV-dJnmKC-disabled-true{background-color:gray}}@media (min-width: 720px), (min-width: 1536px){.c-PJLV-gSmlSg-variant-red{background-color:tomato}}}--sxs{--sxs:5 c-PJLV-elpmbs-cv}@media{@media (min-width: 1536px){@media (min-width: 720px), (min-width: 1536px){.c-PJLV-elpmbs-cv{padding:50px}}}}`,
		)
	})
})
