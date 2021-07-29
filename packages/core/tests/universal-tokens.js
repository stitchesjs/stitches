import { createStitches } from '../src/index.js'

describe('Tokens', () => {
	test('Authors can use a regular token #1', () => {
		const { globalCss, getCssString } = createStitches({
			theme: {
				colors: {
					red: 'tomato',
				},
			},
		})

		globalCss({
			article: {
				color: '$red',
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-iknykm}@media{` +
				`:root,.t-iknykm{--colors-red:tomato}` +
			`}--stitches{--:1 fMIGFF}@media{` +
				`article{color:var(--colors-red)}` +
			`}`
		)
	})

	test('Authors can use a regular token #2', () => {
		const { globalCss, getCssString } = createStitches({
			theme: {
				shadows: {
					red: 'tomato',
				},
			},
		})

		globalCss({
			article: {
				boxShadow: '0 0 0 1px $red',
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-daOLKV}@media{` +
				`:root,.t-daOLKV{--shadows-red:tomato}` +
			`}--stitches{--:1 bstpNq}@media{` +
				`article{box-shadow:0 0 0 1px var(--shadows-red)}` +
			`}`
		)
	})

	test('Authors can use a relative token #1', () => {
		const { globalCss, getCssString } = createStitches({
			theme: {
				colors: {
					red: 'tomato',
					red500: '$red',
				},
			},
		})

		globalCss({
			article: {
				color: '$red500',
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-eZaaph}@media{` +
				`:root,.t-eZaaph{--colors-red:tomato;--colors-red500:var(--colors-red)}` +
			`}--stitches{--:1 fdgxsg}@media{` +
				`article{color:var(--colors-red500)}` +
			`}`
		)
	})

	test('Authors can use a relative token #1', () => {
		const { globalCss, getCssString } = createStitches({
			theme: {
				shadows: {
					red: 'tomato',
					red500: '$red',
					redUnique: '$$red'
				},
			},
		})

		globalCss({
			article: {
				boxShadow: '0 0 0 1px $red500',
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-gxqihb}@media{` +
				`:root,.t-gxqihb{--shadows-red:tomato;--shadows-red500:var(--shadows-red);--shadows-redUnique:var(---red)}` +
			`}` +
			`--stitches{--:1 kyFUgb}@media{` +
				`article{box-shadow:0 0 0 1px var(--shadows-red500)}` +
			`}`
		)
	})

	test('Authors can use an absolute token #1', () => {
		const { globalCss, getCssString } = createStitches({
			theme: {
				colors: {
					red: 'tomato',
				},
			},
		})

		globalCss({
			article: {
				boxShadow: '0 0 0 1px $colors$red',
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-iknykm}@media{` +
				`:root,.t-iknykm{--colors-red:tomato}` +
			`}` +
			`--stitches{--:1 hNRkrs}@media{` +
				`article{box-shadow:0 0 0 1px var(--colors-red)}` +
			`}`
		)
	})

	test('Authors can use an absolute token #2', () => {
		const { globalCss, getCssString } = createStitches({
			theme: {
				colors: {
					red: 'tomato',
				},
			},
		})

		globalCss({
			article: {
				boxShadow: '0 0 0 1px $colors$red',
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-iknykm}@media{` +
				`:root,.t-iknykm{--colors-red:tomato}` +
			`}` +
			`--stitches{--:1 hNRkrs}@media{` +
				`article{box-shadow:0 0 0 1px var(--colors-red)}` +
			`}`
		)
	})

	test('Authors can use a negative token #1', () => {
		const { globalCss, getCssString } = createStitches({
			theme: {
				space: {
					sp1: '100px',
					sp2: '200px',
				},
			},
		})

		globalCss({
			article: {
				marginLeft: '-$sp1',
				marginTop: '-$sp2',
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-hxjLZl}@media{` +
				`:root,.t-hxjLZl{--space-sp1:100px;--space-sp2:200px}` +
			`}` +
			`--stitches{--:1 kTSGli}@media{` +
				`article{margin-left:calc(var(--space-sp1)*-1);margin-top:calc(var(--space-sp2)*-1)}` +
			`}`
		)
	})

	test('Authors can use a negative token #2', () => {
		const { globalCss, getCssString } = createStitches({
			theme: {
				sizes: {
					sp1: '10px',
					sp2: '20px',
					sp3: '30px',
				},
			},
		})

		globalCss({
			article: {
				marginLeft: '-$sizes$sp1',
				width: '$sp1',
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-ereMzu}@media{` +
				`:root,.t-ereMzu{--sizes-sp1:10px;--sizes-sp2:20px;--sizes-sp3:30px}` +
			`}` +
			`--stitches{--:1 kuTEdV}@media{` +
				`article{margin-left:calc(var(--sizes-sp1)*-1);width:var(--sizes-sp1)}` +
			`}`
		)
	})

	test('Authors can use tokens from the globalCss theme object', () => {
		const { globalCss, theme, getCssString } = createStitches({
			theme: {
				space: {
					sp1: '100px',
					sp2: '200px',
				},
			},
		})

		globalCss({
			article: {
				marginLeft: theme.space.sp1,
				marginTop: theme.space.sp2,
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-hxjLZl}@media{` +
				`:root,.t-hxjLZl{--space-sp1:100px;--space-sp2:200px}` +
			`}` +
			`--stitches{--:1 lcIUgV}@media{` +
				`article{margin-left:var(--space-sp1);margin-top:var(--space-sp2)}` +
			`}`
		)
	})

	test('Authors can use tokens from a new theme object', () => {
		const { globalCss, theme, getCssString } = createStitches()

		const mytheme = theme('my-theme', {
			space: {
				sp1: '100px',
				sp2: '200px',
			},
		})

		globalCss({
			article: {
				marginLeft: mytheme.space.sp1,
				marginTop: mytheme.space.sp2,
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:1 lcIUgV}@media{article{margin-left:var(--space-sp1);margin-top:var(--space-sp2)}}`,
		)

		void `${mytheme}`

		expect(getCssString()).toBe(
			`--stitches{--:0 my-theme}@media{` +
				`.my-theme{--space-sp1:100px;--space-sp2:200px}` +
			`}--stitches{--:1 lcIUgV}@media{` +
				`article{margin-left:var(--space-sp1);margin-top:var(--space-sp2)}` +
			`}`
		)
	})

	test('Authors can use tokens from the globalCss theme object', () => {
		const { globalCss, theme, getCssString } = createStitches({
			theme: {
				space: {
					sp1: '100px',
					sp2: '200px',
				},
			},
		})

		globalCss({
			article: {
				marginLeft: theme.space.sp1,
				marginTop: theme.space.sp2,
			},
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-hxjLZl}@media{` +
				`:root,.t-hxjLZl{--space-sp1:100px;--space-sp2:200px}` +
			`}` +
			`--stitches{--:1 lcIUgV}@media{` +
				`article{margin-left:var(--space-sp1);margin-top:var(--space-sp2)}` +
			`}`
		)
	})

	test('Authors can use the class from the root theme object', () => {
		const { theme, getCssString } = createStitches({
			prefix: 'pedro',
			theme: {
				colors: {
					blue: 'dodgerblue',
				},
			}
		})

		expect(`<div class="${theme}"></div>`).toBe(`<div class="pedro-t-jPkpUS"></div>`)

		expect(getCssString()).toBe(
			`--stitches{--:0 pedro-t-jPkpUS}@media{` +
				`:root,.pedro-t-jPkpUS{--pedro-colors-blue:dodgerblue}` +
			`}`
		)
	})

	test('Authors can render custom units', () => {
		const { globalCss, getCssString } = createStitches({
			theme: {
				sizes: {
					five: '5px',
				},
			}
		})

		globalCss({
			body: {
				marginLeft: '5--sizes-five'
			}
		})()

		expect(getCssString()).toBe(
			`--stitches{--:0 t-bhZLEQ}@media{` +
				`:root,.t-bhZLEQ{--sizes-five:5px}` +
			`}--stitches{--:1 gvABwA}@media{` +
				`body{margin-left:calc(var(--sizes-five)*5)}` +
			`}`
		)
	})
}) // prettier-ignore
