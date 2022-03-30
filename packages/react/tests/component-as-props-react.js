import * as React from 'react'
import * as renderer from 'react-test-renderer'

import { createStitches } from '../src/index.js'

describe('React Component with As prop', () => {
	test('The "as" property works in composition of Styled Components', () => {
		const { styled, getCssText } = createStitches()

		const StyledButton = styled('button', {
			color: 'red',
		})

		const CustomStyledButton = styled(StyledButton, {
			color: 'white',
			backgroundColor: 'blue',
		})

		const vdom = renderer.create(React.createElement(CustomStyledButton, { as: 'a' }, 'Hello, World!'))

		expect(vdom.toJSON()).toEqual({
			type: 'a',
			props: {
				className: 'c-gmqXFB c-jOiKxS',
			},
			children: ['Hello, World!'],
		})

		expect(getCssText()).toBe(`--sxs{--sxs:2 c-gmqXFB c-jOiKxS}@media{.c-gmqXFB{color:red}.c-jOiKxS{color:white;background-color:blue}}`)
	})

	test('The "as" property is forwarded to target Component of Styled Component', () => {
		const { styled, getCssText } = createStitches()

		const StyledButton = styled('button', {
			color: 'red',
		})

		const Button = (props) => {
			return React.createElement(StyledButton, props)
		}

		const CustomStyledButton = styled(Button, {
			backgroundColor: 'blue',
		})

		const vdom = renderer.create(React.createElement(CustomStyledButton, { as: 'a' }, 'Hello, World!'))

		expect(vdom.toJSON()).toEqual({
			type: 'a',
			props: {
				className: 'c-gmqXFB c-fNnBJi',
			},
			children: ['Hello, World!'],
		})

		expect(getCssText()).toBe(`--sxs{--sxs:2 c-fNnBJi c-gmqXFB}@media{.c-gmqXFB{color:red}.c-fNnBJi{background-color:blue}}`)
	})
})
