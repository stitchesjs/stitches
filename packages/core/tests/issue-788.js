import { createStitches } from '../src/index.js'

describe('Issue #788', () => {
	test('Test that a util with the name of a selector works in globalCss', () => {
		const { globalCss, getCssText } = createStitches({
			utils: {
				p: (value) => ({
					paddingTop: value,
					paddingBottom: value,
					paddingLeft: value,
					paddingRight: value,
				}),
			},
		})

		globalCss({
			p: {
				color: 'red',
			},
		})()

		expect(getCssText()).toBe(`--sxs{--sxs:1 gllaiB}` + `@media{p{` + `color:red` + `}}`)
	})

	test('Test that a util with the name of a selector works in a component', () => {
		const { css, getCssText } = createStitches({
			utils: {
				p: (value) => ({
					paddingTop: value,
					paddingBottom: value,
					paddingLeft: value,
					paddingRight: value,
				}),
			},
		})

		css({
			p: 10,
		})()

		expect(getCssText()).toBe(`--sxs{--sxs:2 c-csWWxC}` + `@media{.c-csWWxC{` + `padding-top:10px;` + `padding-bottom:10px;` + `padding-left:10px;` + `padding-right:10px` + `}}`)
	})
})
