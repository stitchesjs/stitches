import createCss from '../src/index.js'

describe('Logical Properties', () => {
	test('marginBlock', () => {
		const { global, toString } = createCss()

		global({
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
			// prettier-ignore
			'x-element{margin-block-start:0;margin-block-end:0;}' +
			'y-element{margin-block-start:10;margin-block-end:10;}' +
			'z-element{margin-block-start:5px;margin-block-end:10px;}',
		)
	})

	test('marginInline', () => {
		const { global, toString } = createCss()

		global({
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
			// prettier-ignore
			'x-element{margin-inline-start:0;margin-inline-end:0;}' +
			'y-element{margin-inline-start:10;margin-inline-end:10;}' +
			'z-element{margin-inline-start:5px;margin-inline-end:10px;}',
		)
	})
})
