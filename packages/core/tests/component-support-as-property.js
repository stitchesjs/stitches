import createCss from '../src/index.js'

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

		expect(component({ as: 'button' }).className).toBe(['sx03kz9', 'sx03kz9r9r9e--as-button'].join(' '))
		expect(component({ as: 'button' }).props.as).toBe('button')
		expect(toString()).toBe(['.sx03kz9r9r9e--as-button{color:dodgerblue;}', '.sx03kz9r9r9d--as-button{color:dodgerblue;}'].join(''))

		expect(component({ as: 'a' }).className).toBe(['sx03kz9', 'sx03kz9a4ldn--as-a'].join(' '))
		expect(component({ as: 'a' }).props.as).toBe('a')
		expect(toString()).toBe(['.sx03kz9r9r9e--as-button{color:dodgerblue;}', '.sx03kz9r9r9d--as-button{color:dodgerblue;}', '.sx03kz9a4ldn--as-a{color:tomato;}', '.sx03kz9a4ldo--as-a{color:tomato;}'].join(''))
	})
})
