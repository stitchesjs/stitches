import { createCss } from '../src/index.js'

describe('Issue #519', () => {
	test('locally scoped token works 1 time', () => {
		const { css, toString } = createCss({})

		css({
			$$syntax: 'red',

			h1: {
				color: '$$syntax',
			},
		})()

		// prettier-ignore
		expect(toString()).toBe(
			'.sxuuu2e{---syntax:red;}' +
			'.sxuuu2e h1{color:var(---syntax);}'
		)
	})

	test('locally scoped token works 2 times', () => {
		const { css, toString } = createCss({})

		css({
			$$syntax: 'red',

			h1: {
				color: '$$syntax',
			},

			h2: {
				color: '$$syntax',
			},
		})()

		// prettier-ignore
		expect(toString()).toBe(
			'.sxyrd68{---syntax:red;}' +
			'.sxyrd68 h1{color:var(---syntax);}' +
			'.sxyrd68 h2{color:var(---syntax);}'
		)
	})

	test('locally scoped token works 3 times', () => {
		const { css, toString } = createCss({})

		css({
			$$syntax: 'red',

			h1: {
				color: '$$syntax',
			},

			h2: {
				color: '$$syntax',
			},

			h3: {
				color: '$$syntax',
			},
		})()

		// prettier-ignore
		expect(toString()).toBe(
			'.sx4gdx9{---syntax:red;}' +
			'.sx4gdx9 h1{color:var(---syntax);}' +
			'.sx4gdx9 h2{color:var(---syntax);}' +
			'.sx4gdx9 h3{color:var(---syntax);}'
		)
	})
})
