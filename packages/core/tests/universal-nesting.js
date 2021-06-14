import { createCss } from '../src/index.js'

describe('Nesting', () => {
	test('Authors can define global nesting rules', () => {
		const { global, getCssString } = createCss()

		global({
			'body > a': {
				'&:not(:hover)': {
					textDecoration: 'none',
				},
			},
		})()

		expect(getCssString()).toBe(`--stitches{--:1 hXsVBR}@media{body > a:not(:hover){text-decoration:none}}`)
	})

	test('Authors can define component nesting rules', () => {
		const { css, getCssString } = createCss()

		css({
			'&:not(:hover)': {
				textDecoration: 'none',
			},
		})()

		expect(getCssString()).toBe(`--stitches{--:2 c-dweUti}@media{.c-dweUti:not(:hover){text-decoration:none}}`)
	})

	test('Authors can define recursive global nesting rules', () => {
		const { global, getCssString } = createCss()

		global({
			p: {
				'margin': 0,
				'& ~ &': {
					marginTop: 0,
				},
			},
		})()

		expect(getCssString()).toBe(`--stitches{--:1 gkqgGk}@media{p{margin:0}p ~ p{margin-top:0}}`)
	})

	test('Authors can define recursive component nesting rules', () => {
		const { css, getCssString } = createCss()

		css({
			'margin': 0,
			'& ~ &': {
				marginTop: 0,
			},
		})()

		expect(getCssString()).toBe(`--stitches{--:2 c-fuGzNQ}@media{.c-fuGzNQ{margin:0}.c-fuGzNQ ~ .c-fuGzNQ{margin-top:0}}`)
	})

	test('Authors can define complex recursive global nesting rules', () => {
		const { global, getCssString } = createCss()

		global({
			'body > p, body > ul': {
				'margin': 0,
				'& ~ &': {
					marginTop: 0,
				},
			},
		})()

		const parentCssRule = `body > p,body > ul{margin:0}`
		const nestingCssRule = `:is(body > p) ~ :is(body > p),:is(body > ul) ~ :is(body > ul){margin-top:0}`

		expect(getCssString()).toBe(`--stitches{--:1 cugdJ}@media{${parentCssRule + nestingCssRule}}`)
	})

	test('Authors can define complex recursive component nesting rules', () => {
		const { css, getCssString } = createCss()

		css({
			'& > p, & > ul': {
				'margin': 0,
				'& ~ &': {
					marginTop: 0,
				},
			},
		})()

		const parentCssRule = `.c-iJLHRt > p,.c-iJLHRt > ul{margin:0}`
		const nestingCssRule = `:is(.c-iJLHRt > p) ~ :is(.c-iJLHRt > p),:is(.c-iJLHRt > ul) ~ :is(.c-iJLHRt > ul){margin-top:0}`

		expect(getCssString()).toBe(`--stitches{--:2 c-iJLHRt}@media{${parentCssRule + nestingCssRule}}`)
	})
})
