import { stringify } from '../src/index.js'

describe('replacer (prefixing)', () => {
	test('stringify() generates CSS with the replacer function', () => {
		const replacer = (property, value) =>
			// add a prefix to "tab-size" for Firefox
			property === 'tabSize'
				? { MozTabSize: value, [property]: value }
				: // add common prefixes for Safari 14
				/^(appearance|backface-visibility|background-clip|clip-path|hyphens|mask-image|user-select)$/.test(property)
				? { ['-webkit-' + property]: value, [property]: value }
				: null

		expect(
			stringify(
				{
					button: {
						appearance: 'none',
						color: 'black',
					},
					textarea: {
						tabSize: 2,
					},
				},
				replacer,
			),
		).toEqual(
			// prettier-ignore
			'button{' +
				'-webkit-appearance:none;' +
				'appearance:none;' +
				'color:black;' +
			'}' +
			'textarea{' +
				'-moz-tab-size:2;' +
				'tab-size:2;' +
			'}',
		)
	})
})
