import { stringify } from '../src/index.js'

describe('content declaration', () => {
	test('stringify() generates CSS with a quoted `content` attribute', () => {
		expect(
			stringify({
				q: {
					'&::before': {
						content: '«',
					},
					'&::after': {
						content: '»',
					},
				},
			}),
		).toEqual(
			// prettier-ignore
			'q::before{' +
				'content:"«";' +
			'}' +

			'q::after{' +
				'content:"»";' +
			'}',
		)
	})
})
