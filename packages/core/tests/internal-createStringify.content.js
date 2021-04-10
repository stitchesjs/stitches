import { createStringify } from '../src/createStringify.js'

describe('stringify() content declaration', () => {
	const stringify = createStringify({ media: {}, themeMap: {}, utils: {} })

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
			'q::before{' +
				'content:"«";' +
			'}' +

			'q::after{' +
				'content:"»";' +
			'}',
		) // prettier-ignore
	})
})
