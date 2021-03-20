import { createCss } from '../src/index.js'

describe('As prop', () => {
	test('The "as" property is passed through', () => {
		const { css, toString } = createCss({})
		const component = css({
			variants: {
				as: {
					button: {
						color: 'dodgerblue',
					},
					a: {
						color: 'tomato',
					},
				},
			},
		})

		expect(component({ as: 'button' }).className).toBe(`sx1hhcn sx1hhcnr9r9e--as-button`)
		expect(component({ as: 'button' }).props.as).toBe('button')
		expect(toString()).toBe(['.sx1hhcnr9r9e--as-button{color:dodgerblue;}'].join(''))

		expect(component({ as: 'a' }).className).toBe(['sx1hhcn', 'sx1hhcna4ldn--as-a'].join(' '))
		expect(component({ as: 'a' }).props.as).toBe('a')
		expect(toString()).toBe(['.sx1hhcnr9r9e--as-button{color:dodgerblue;}', '.sx1hhcna4ldn--as-a{color:tomato;}'].join(''))
	})
})
