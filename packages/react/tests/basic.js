import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { createStitches } from '../src/index.js'

describe('Basic', () => {
	test('Functionality of styled()', () => {
		const { styled, getCssText } = createStitches({
			utils: {
				userSelect: () => (value) => ({
					WebkitUserSelector: value,
					userSelect: value,
				}),
			},
		})

		let Button = styled('button', {
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

		const vdom = renderer.create(React.createElement(React.Fragment))

		renderer.act(() => {
			vdom.update(React.createElement(Button, null, 'Hello, World!'))
		})

		expect(vdom.toJSON()).toEqual({
			type: 'button',
			props: {
				className: 'c-iSEgvG',
			},
			children: ['Hello, World!'],
		})

		expect(getCssText()).toBe(
			`--sxs{--sxs:2 c-iSEgvG}@media{.c-iSEgvG{background-color:gainsboro;border-radius:9999px;font-weight:500;padding:0.75em 1em;border:0;transition:all 200ms ease}.c-iSEgvG:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(0, 0, 0, .3)}}`,
		)
	})
})
