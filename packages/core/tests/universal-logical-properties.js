import { createStitches } from '../src/index.js'

describe('Logical Properties', () => {
	test('marginBlock', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				marginBlock: 0,
			},
			'y-element': {
				marginBlock: 10,
			},
			'z-element': {
				marginBlock: '5px 10px',
			},
		})()

		expect(toString()).toBe(
			`--sxs{--sxs:1 IvBLl}@media{` +
				`x-element{margin-block-start:0;margin-block-end:0}` +
				`y-element{margin-block-start:10px;margin-block-end:10px}` +
				`z-element{margin-block-start:5px;margin-block-end:10px}` +
			`}`
		)
	})

	test('marginInline', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				marginInline: 0,
			},
			'y-element': {
				marginInline: 10,
			},
			'z-element': {
				marginInline: '5px 10px',
			},
		})()

		expect(toString()).toBe(
			`--sxs{--sxs:1 eNPHKF}@media{` +
				`x-element{margin-inline-start:0;margin-inline-end:0}` +
				`y-element{margin-inline-start:10px;margin-inline-end:10px}` +
				`z-element{margin-inline-start:5px;margin-inline-end:10px}` +
			`}`
		)
	})

	test('paddingBlock', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				paddingBlock: 0,
			},
			'y-element': {
				paddingBlock: 10,
			},
			'z-element': {
				paddingBlock: '5px 10px',
			},
		})()

		expect(toString()).toBe(
			`--sxs{--sxs:1 kcHEgy}@media{` +
				`x-element{padding-block-start:0;padding-block-end:0}` +
				`y-element{padding-block-start:10px;padding-block-end:10px}` +
				`z-element{padding-block-start:5px;padding-block-end:10px}` +
			`}`
		)
	})

	test('paddingInline', () => {
		const { globalCss, toString } = createStitches()

		globalCss({
			'x-element': {
				paddingInline: 0,
			},
			'y-element': {
				paddingInline: 10,
			},
			'z-element': {
				paddingInline: '5px 10px',
			},
		})()

		expect(toString()).toBe(
			`--sxs{--sxs:1 cVrbiG}@media{` +
				`x-element{padding-inline-start:0;padding-inline-end:0}` +
				`y-element{padding-inline-start:10px;padding-inline-end:10px}` +
				`z-element{padding-inline-start:5px;padding-inline-end:10px}` +
			`}`
		)
	})
}) // prettier-ignore
