import { createCss } from '../src/index.js'

describe('Tokens', () => {
	test('Authors can define and use a relative token', () => {
		{
			const { global, toString } = createCss({
				theme: {
					colors: {
						red: 'tomato',
					},
				},
			})

			global({
				article: {
					color: '$red',
				},
			})()

			expect(toString()).toBe(
				`:root{--colors-red:tomato;}` +
				`article{color:var(--colors-red);}`
			)
		}

		{
			const { global, toString } = createCss({
				theme: {
					shadows: {
						red: 'tomato',
					},
				},
			})

			global({
				article: {
					boxShadow: '0 0 0 1px $red',
				},
			})()

			expect(toString()).toBe(
				`:root{--shadows-red:tomato;}` +
				`article{box-shadow:0 0 0 1px var(--shadows-red);}`
			)
		}
	})

	test('Authors can use an absolute token', () => {
		{
			const { global, toString } = createCss({
				theme: {
					colors: {
						red: 'tomato',
					},
				},
			})

			global({
				article: {
					boxShadow: '0 0 0 1px $colors$red',
				},
			})()

			expect(toString()).toBe(
				`:root{--colors-red:tomato;}` +
				`article{box-shadow:0 0 0 1px var(--colors-red);}`
			)
		}

		{
			const { global, toString } = createCss({
				theme: {
					colors: {
						red: 'tomato',
					},
				},
			})

			global({
				article: {
					boxShadow: '0 0 0 1px $colors$red',
				},
			})()

			expect(toString()).toBe(
				`:root{--colors-red:tomato;}` +
				`article{box-shadow:0 0 0 1px var(--colors-red);}`
			)
		}
	})

	test('Authors can use a negative token', () => {
		{
			const { global, toString } = createCss({
				theme: {
					space: {
						sp1: '100px',
						sp2: '200px',
					},
				},
			})

			global({
				article: {
					marginLeft: '-$sp1',
					marginTop: '-$sp2',
				},
			})()

			expect(toString()).toBe(
				`:root{--space-sp1:100px;--space-sp2:200px;}` +
				`article{margin-left:calc(var(--space-sp1)*-1);margin-top:calc(var(--space-sp2)*-1);}`
			)
		}

		{
			const { global, toString } = createCss({
				theme: {
					sizes: {
						sp1: '10px',
						sp2: '20px',
						sp3: '30px',
					},
				},
			})

			global({
				article: {
					marginLeft: '-$sizes$sp1',
					width: '$sp1',
				},
			})()

			expect(toString()).toBe(
				`:root{--sizes-sp1:10px;--sizes-sp2:20px;--sizes-sp3:30px;}` +
				`article{margin-left:calc(var(--sizes-sp1)*-1);width:var(--sizes-sp1);}`
			)
		}
	})

	test('Authors can use tokens from the global theme object', () => {
		const { global, theme, toString } = createCss({
			theme: {
				space: {
					sp1: '100px',
					sp2: '200px',
				},
			},
		})

		global({
			article: {
				marginLeft: theme.space.sp1,
				marginTop: theme.space.sp2,
			},
		})()

		expect(toString()).toBe(
			`:root{--space-sp1:100px;--space-sp2:200px;}` +
			`article{margin-left:var(--space-sp1);margin-top:var(--space-sp2);}`,
		)
	})

	test('Authors can use tokens from a new theme object', () => {
		const { global, theme, toString } = createCss()

		const mytheme = theme('my-theme', {
			space: {
				sp1: '100px',
				sp2: '200px',
			},
		})

		global({
			article: {
				marginLeft: mytheme.space.sp1,
				marginTop: mytheme.space.sp2,
			},
		})()

		expect(toString()).toBe(
			`article{margin-left:var(--space-sp1);margin-top:var(--space-sp2);}`,
		)

		mytheme.className

		expect(toString()).toBe(
			`.my-theme{--space-sp1:100px;--space-sp2:200px;}` +
			`article{margin-left:var(--space-sp1);margin-top:var(--space-sp2);}`,
		)
	})
}) // prettier-ignore
