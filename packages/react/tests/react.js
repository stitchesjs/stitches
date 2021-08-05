import * as react from 'react'
import * as renderer from 'react-test-renderer'
import { createStitches } from '../src/index.js'

describe('React', () => {
	const sheet = createStitches()

	let wrapper = renderer.create(react.createElement(react.Fragment))
	let Button = sheet.styled('button', {
		'backgroundColor': 'gainsboro',
		'borderRadius': '9999px',
		'fontWeight': 500,
		'padding': '0.75em 1em',
		'border': 0,
		'transition': 'all 200ms ease',

		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: '0 10px 25px rgba(0, 0, 0, .3)',
		},
	})

	test('creates an object with a "styled" function', () => {
		expect(typeof sheet.styled).toBe('function')
	})

	test('styled function returns a component function', () => {
		expect(typeof Button).toBe('object')
	})

	test('component renders', () => {
		if (Button === null) return

		renderer.act(() => {
			wrapper.update(react.createElement(Button))
		})

		expect(wrapper.toJSON()).toEqual({
			type: 'button',
			props: {
				className: 'c-iSEgvG',
			},
			children: null,
		})

		expect(sheet.toString()).toEqual(
			`--sxs{--sxs:2 c-iSEgvG}@media{` +
				`.c-iSEgvG{` +
					`background-color:gainsboro;` +
					`border-radius:9999px;` +
					`font-weight:500;` +
					`padding:0.75em 1em;` +
					`border:0;` +
					`transition:all 200ms ease` +
				`}` +
				`.c-iSEgvG:hover{` +
					`transform:translateY(-2px);` +
					`box-shadow:0 10px 25px rgba(0, 0, 0, .3)` +
				`}` +
			`}`
		)
	})
}) // prettier-ignore
