import { stringify } from '../src/index.js'

describe('nesting rules', () => {
	test('stringify() generates a string of nested CSS', () => {
		expect(
			stringify({
				body: {
					'backgroundColor': 'white',
					'color': 'black',

					'& > nav > ul': {
						'@media (min-width: 640px)': {
							margin: 0,
						},
					},
				},
			}),
		).toEqual(
			'body{' +
				'background-color:white;' +
				'color:black;' +
				'}' +
				'@media (min-width: 640px){' +
				'body > nav > ul{' +
				'margin:0;' +
				'}' +
				'}',
		)
	})

	test('stringify() generates string of reverse-nested CSS', () => {
		expect(
			stringify({
				'nav > ul': {
					'body > &': {
						'@media (min-width: 640px)': {
							margin: 0,
						},
					},
				},
			}),
		).toEqual(
			'@media (min-width: 640px){' +
				'body > nav > ul{' +
				'margin:0;' +
				'}' +
				'}',
		)
	})

	test('stringify() generates a string of implicitly nested CSS', () => {
		expect(
			stringify({
				body: {
					'backgroundColor': 'white',
					'color': 'black',

					'nav > ul': {
						'@media (min-width: 640px)': {
							margin: 0,
						},
					},
				},
			}),
		).toEqual(
			'body{' +
				'background-color:white;' +
				'color:black;' +
				'}' +
				'@media (min-width: 640px){' +
				'body nav > ul{' +
				'margin:0;' +
				'}' +
				'}',
		)
	})

	test('stringify() generates a string of pseudo-expectedly implicitly nested CSS', () => {
		expect(
			stringify({
				body: {
					backgroundColor: 'white',
					color: 'black',

					font: {
						'@media (min-width: 640px)': {
							margin: 0,
						},
					},
				},
			}),
		).toEqual(
			'body{' +
				'background-color:white;' +
				'color:black;' +
				'}' +
				'@media (min-width: 640px){' +
				'body font{' +
				'margin:0;' +
				'}' +
				'}',
		)
	})
})
