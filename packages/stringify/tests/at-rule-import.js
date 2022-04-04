import { stringify } from '../src/index.js'

describe('at-rule (import)', () => {
	test('stringify() generates CSS with multiple `@import` rules', () => {
		expect(
			stringify({
				'@import': ['"https://unpkg.com/sanitize.css"', '"https://unpkg.com/sanitize.css/typography.css"'],
			}),
		).toEqual('@import "https://unpkg.com/sanitize.css";' + '@import "https://unpkg.com/sanitize.css/typography.css";')
	})
})
