import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { createStitches } from '../src/index.js'

let RenderOf = (...args) => {
	let Rendered

	void renderer.act(() => {
		Rendered = renderer.create(React.createElement(...args))
	})

	const json = Rendered.toJSON()
	const { props } = json

	for (const prop in props) {
		const value = props[prop]

		// serialize objects as they might appear in a render
		if (typeof value === 'object' && value !== null && value.toString) {
			props[prop] = value.toString()
		}
	}

	return json
}

describe('Issue #555', () => {
	test('an element accepts styles via className prop', () => {
		const { css, toString } = createStitches()

		const el = css({ color: "dodgerblue" })

		expect(
			RenderOf('div', { className: el() })
		).toEqual({
			type: 'div',
			props: {
				className: 'c-jEKtXH',
			},
			children: null,
		})

		expect(toString()).toBe(`--sxs{--sxs:2 c-jEKtXH}@media{.c-jEKtXH{color:dodgerblue}}`)
	})

	test('an element accepts styles via className prop', () => {
		const { css, styled, toString } = createStitches()

		const el = css({ color: "dodgerblue" })
		const Box = styled('div', {})

		expect(
			RenderOf(Box, { className: el() })
		).toEqual({
			type: 'div',
			props: {
				className: 'c-PJLV c-jEKtXH',
			},
			children: null,
		})

		expect(toString()).toBe(`--sxs{--sxs:2 c-jEKtXH c-PJLV}@media{.c-jEKtXH{color:dodgerblue}}`)
	})
}) // prettier-ignore
