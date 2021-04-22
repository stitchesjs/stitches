import { createCss } from '../src/index.js'

describe('Issue #519', () => {
	test('locally scoped token works 1 time', () => {
		const { css, toString } = createCss({ prefix: 'fusion' })

		css({
			$$syntax: 'red',

			h1: {
				color: '$$syntax',
			},
		})()

		expect(toString()).toBe(
			'.fusionuuu2e{--fusion--syntax:red;}' +
			'.fusionuuu2e h1{color:var(--fusion--syntax);}'
		) // prettier-ignore
	})

	test('locally scoped token works 2 times', () => {
		const { css, toString } = createCss({ prefix: 'fusion' })

		css({
			$$syntax: 'red',

			h1: {
				color: '$$syntax',
			},

			h2: {
				color: '$$syntax',
			},
		})()

		expect(toString()).toBe(
			'.fusionyrd68{--fusion--syntax:red;}' +
			'.fusionyrd68 h1{color:var(--fusion--syntax);}' +
			'.fusionyrd68 h2{color:var(--fusion--syntax);}'
		) // prettier-ignore
	})

	test('locally scoped token works 3 times', () => {
		const { css, toString } = createCss({ prefix: 'fusion' })

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

		expect(toString()).toBe(
			'.fusion4gdx9{--fusion--syntax:red;}' +
			'.fusion4gdx9 h1{color:var(--fusion--syntax);}' +
			'.fusion4gdx9 h2{color:var(--fusion--syntax);}' +
			'.fusion4gdx9 h3{color:var(--fusion--syntax);}'
		) // prettier-ignore
	})
})
