import { stringify } from '../src/index.js'

describe('stringify()', () => {
	test('stringify() generates CSS with the replacer function for an at-rule', () => {
		const replaceColor = ({ foreground: color, background: backgroundColor }) => ({ color, backgroundColor })
		const replacer = (property, value) => (property === '@color' ? replaceColor(value) : null)

		expect(
			stringify(
				{
					a: {
						'@color': {
							foreground: 'white',
							background: 'black',
						},
						'margin': 0,
					},
				},
				replacer,
			),
		).toEqual('a{' + 'color:white;' + 'background-color:black;' + 'margin:0;' + '}')
	})

	test('stringify() generates CSS with the replacer function for a nested rule', () => {
		const replacer = (property, value) => (property === '@within' ? { '& *': value } : null)

		expect(
			stringify(
				{
					a: {
						'color': 'white',
						'@within': {
							margin: 0,
						},
						'backgroundColor': 'black',
					},
				},
				replacer,
			),
		).toEqual('a{' + 'color:white;' + '}' + 'a *{' + 'margin:0;' + '}' + 'a{' + 'background-color:black;' + '}')
	})

	test('stringify() generates CSS with the replacer function for a @custom-media at-rule', () => {
		const replacements = Object.create(null)
		const replacer = (property, value) => {
			if (property.startsWith('@custom-media ')) {
				replacements[property.slice(14)] = value
			} else if (property.startsWith('@media ') && property.includes('--')) {
				return {
					[property.replace(/\((--[\w-]+)\)/g, ($0, $1) => replacements[$1] || $1)]: value,
				}
			} else return null
		}

		expect(
			stringify(
				{
					'@custom-media --foo': '(min-width: 640px)',
					'a': {
						'@media (--foo)': {
							margin: 0,
						},
					},
				},
				replacer,
			),
		).toEqual('@media (min-width: 640px){' + 'a{' + 'margin:0;' + '}' + '}')
	})

	test('stringify() generates CSS with the replacer function for a @when at-rule', () => {
		const replacer = (property, value) => {
			if (property.startsWith('@when ')) {
				return {
					['@media' + property.slice(5)]: value,
				}
			} else return null
		}

		expect(
			stringify(
				{
					a: {
						'@when (min-width: 640px)': {
							margin: 0,
						},
					},
				},
				replacer,
			),
		).toEqual('@media (min-width: 640px){' + 'a{' + 'margin:0;' + '}' + '}')
	})
})
