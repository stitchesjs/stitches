import createCss from '../src/index.js'

describe('Nesting', () => {
	test('Authors can define global nesting rules', () => {
		const { global, toString } = createCss({})

		global({
			'body > a': {
				'&:not(:hover)': {
					textDecoration: 'none',
				}
			}
		})()

		expect(toString()).toBe(`body > a:not(:hover){text-decoration:none;}`)
	})

	test('Authors can define component nesting rules', () => {
		const { css, toString } = createCss({})

		css({
			'&:not(:hover)': {
				textDecoration: 'none',
			}
		})()

		expect(toString()).toBe(`.sxnz0bq:not(:hover){text-decoration:none;}`)
	})

	test('Authors can define recursive global nesting rules', () => {
		const { global, toString } = createCss({})

		global({
			'p': {
				margin: 0,
				'& ~ &': {
					marginTop: 0,
				}
			}
		})()

		expect(toString()).toBe(`p{margin:0;}p ~ p{margin-top:0;}`)
	})

	test('Authors can define recursive component nesting rules', () => {
		const { css, toString } = createCss({})

		css({
			margin: 0,
			'& ~ &': {
				marginTop: 0,
			}
		})()

		expect(toString()).toBe(`.sxxgatx{margin:0;}.sxxgatx ~ .sxxgatx{margin-top:0;}`)
	})

	test('Authors can define complex recursive global nesting rules', () => {
		const { global, toString } = createCss({})

		global({
			'body > p, body > ul': {
				margin: 0,
				'& ~ &': {
					marginTop: 0,
				}
			}
		})()

		const parentCssRule = `body > p, body > ul{margin:0;}`
		const nestingCssRule = `:is(body > p) ~ :is(body > p), :is(body > ul) ~ :is(body > ul){margin-top:0;}`

		expect(toString()).toBe(parentCssRule + nestingCssRule)
	})

	test('Authors can define complex recursive component nesting rules', () => {
		const { css, toString } = createCss({})

		css({
			'& > p, & > ul': {
				margin: 0,
				'& ~ &': {
					marginTop: 0,
				}
			}
		})()

		const parentCssRule = `.sxp5b35 > p, .sxp5b35 > ul{margin:0;}`
		const nestingCssRule = `:is(.sxp5b35 > p) ~ :is(.sxp5b35 > p), :is(.sxp5b35 > ul) ~ :is(.sxp5b35 > ul){margin-top:0;}`

		expect(toString()).toBe(parentCssRule + nestingCssRule)
	})
})
