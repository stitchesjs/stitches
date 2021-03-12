import { stringify } from '../src/index.js'

describe('stringify()', () => {
	test('stringify() generates string of nested CSS', () => {
		expect(
			stringify({
				body: {
					backgroundColor: 'white',
					color: 'black',

					'& > nav > ul': {
						'@media (min-width: 640px)': {
							margin: 0,
						},
					},
				},
			}),
		).toEqual(
			// prettier-ignore
			'body' + '{' +
				'background-color:' + 'white' + ';' +
				'color:' + 'black' + ';' +
			'}' +

			'@media (min-width: 640px)' + '{' +
				'body > nav > ul' + '{' +
					'margin:' + '0;' +
				'}' +
			'}',
		)
	})

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
			'q::before' + '{' +
				'content:' + '"«"' + ';' +
			'}' +

			'q::after' + '{' +
				'content:' + '"»"' + ';' +
			'}',
		)
	})

	test('stringify() generates CSS with multiple `@import` rules', () => {
		expect(
			stringify({
				'@import': ['"https://unpkg.com/sanitize.css"', '"https://unpkg.com/sanitize.css/typography.css"'],
			}),
		).toEqual(
			// prettier-ignore
			'@import "https://unpkg.com/sanitize.css"' + ';' +
			'@import "https://unpkg.com/sanitize.css/typography.css"' + ';',
		)
	})

	test('stringify() generates CSS with fallback properties', () => {
		expect(
			stringify({
				body: {
					background: ['white', 'var(--page-bg, white)'],
				},
			}),
		).toEqual(
			// prettier-ignore
			'body' + '{' +
				'background:' + 'white' + ';' +
				'background:' + 'var(--page-bg, white)' + ';' +
			'}',
		)
	})

	test('stringify() generates CSS with the replacer function', () => {
		const replacer = (property, value) =>
			// add a prefix to "tab-size" for Firefox
			property === 'tab-size'
				? { ['-moz-' + property]: value, [property]: value }
				: // add common prefixes for Safari 14
				/^(appearance|backface-visibility|background-clip|clip-path|hyphens|mask-image|user-select)$/.test(property)
				? { ['-webkit-' + property]: value, [property]: value }
				: null

		expect(
			stringify(
				{
					button: {
						appearance: 'none',
					},
					textarea: {
						tabSize: 2,
					},
				},
				replacer,
			),
		).toEqual(
			// prettier-ignore
			'button' + '{' +
				'-webkit-appearance:' + 'none' + ';' +
				'appearance:' + 'none' + ';' +
			'}' +
			'textarea' + '{' +
				'-moz-tab-size:' + '2' + ';' +
				'tab-size:' + '2' + ';' +
			'}',
		)
	})
})
