import { stringify } from '../src/index.js'

describe('media query ranges', () => {
	test('stringify() media query range (feature range value)', () => {
		expect(
			stringify({
				body: {
					'@media (width < 640px)': {
						margin: 0,
					},
					'@media (width <= 640px)': {
						margin: 0,
					},
					'@media (width >= 640px)': {
						margin: 0,
					},
					'@media (width > 640px)': {
						margin: 0,
					},
				},
			}),
		).toEqual(
			// prettier-ignore
			'@media (max-width:639.9375px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (max-width:640px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (min-width:640px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (min-width:640.0625px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}',
		)
	})

	test('stringify() media query range (value range feature)', () => {
		expect(
			stringify({
				body: {
					'@media (640px < width)': {
						margin: 0,
					},
					'@media (640px <= width)': {
						margin: 0,
					},
					'@media (640px >= width)': {
						margin: 0,
					},
					'@media (640px > width)': {
						margin: 0,
					},
				},
			}),
		).toEqual(
			// prettier-ignore
			'@media (min-width:640.0625px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (min-width:640px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (max-width:640px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (max-width:639.9375px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}',
		)
	})

	test('stringify() media query range (value range feature range value)', () => {
		expect(
			stringify({
				body: {
					'@media (640px < width < 1024px)': {
						margin: 0,
					},
					'@media (640px <= width <= 1024px)': {
						margin: 0,
					},
					'@media (640px >= width >= 320px)': {
						margin: 0,
					},
					'@media (640px > width > 320px)': {
						margin: 0,
					},
				},
			}),
		).toEqual(
			// prettier-ignore
			'@media (min-width:640.0625px) and (max-width:1023.9375px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (min-width:640px) and (max-width:1024px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (max-width:640px) and (min-width:320px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (max-width:639.9375px) and (min-width:320.0625px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}',
		)
	})

	test('stringify() media query range (mixed value range feature range value)', () => {
		expect(
			stringify({
				body: {
					'@media (640px < width <= 1024px)': {
						margin: 0,
					},
					'@media (640px <= width < 1024px)': {
						margin: 0,
					},
					'@media (640px >= width > 320px)': {
						margin: 0,
					},
					'@media (640px > width >= 320px)': {
						margin: 0,
					},
				},
			}),
		).toEqual(
			// prettier-ignore
			'@media (min-width:640.0625px) and (max-width:1024px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (min-width:640px) and (max-width:1023.9375px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (max-width:640px) and (min-width:320.0625px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (max-width:639.9375px) and (min-width:320px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}',
		)
	})

	test('stringify() media query range (feature = value) / (value = feature)', () => {
		expect(
			stringify({
				body: {
					'@media (width = 640px)': {
						margin: 0,
					},
					'@media (640px = width)': {
						margin: 0,
					},
				},
			}),
		).toEqual(
			// prettier-ignore
			'@media (width:640px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}' +
			'@media (width:640px){' +
				'body{' +
					'margin:0;' +
				'}' +
			'}',
		)
	})
})
