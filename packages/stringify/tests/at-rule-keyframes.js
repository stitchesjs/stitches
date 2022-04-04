import { stringify } from '../src/index.js'

describe('at-rule (font-face)', () => {
	test('stringify() generates CSS with multiple `@import` rules', () => {
		expect(
			stringify({
				'@keyframes': {
					'0%': {
						opacity: '0',
					},
					'1%': {
						opacity: '1',
					},
				},
			}),
		).toEqual('@keyframes{' + '0%{' + 'opacity:0;' + '}' + '1%{' + 'opacity:1;' + '}' + '}')
	})
})
