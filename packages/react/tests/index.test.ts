// import { create, act } from 'react-test-renderer'
import createCss from '../src/index'

// void create
// void act
// void createCss

describe('Stitches React', () => {
	const { styled } = createCss({
		theme: {
			color: {
				lite: 'gainsboro',
			},
			radii: {
				full: '9999px',
			},
			space: {
				full: '1em',
				tenSixteenth: 'calc(10em / 16)',
			},
		},
	})

	test('basic functionality', () => {
		expect(styled).toBeInstanceOf(Function)

		const Button = styled('button', {
			backgroundColor: '$lite',
			borderRadius: '$full',
			fontWeight: 500,
			padding: '$tenSixteenth $full',
			border: 0,
			transition: 'all 200ms ease',

			'&:hover': {
				transform: 'translateY(-2px)',
				boxShadow: '0 10px 25px rgba(0, 0, 0, .3)',
			},
		})

		expect(Button).toBeInstanceOf(Function)

		const Expression = Button({})

		expect(Expression).toStrictEqual({
			$$typeof: Symbol.for('react.element'),
			key: null,
			props: { className: 's-2j80d3' },
			ref: null,
			type: 'button',
			_owner: null,
		})
	})
})

// 	// create button, write css
// 	const expectHML1 = `<button class="s-2j80d3">Styled Button</button>`
// 	const resultHML1 = `<button class="${buttonClass}">Styled Button</button>`

// 	expect(resultHML1).toBe(expectHML1)

// 	const darkButtonClass = css(buttonClass, {
// 		backgroundColor: 'black',
// 		color: 'white',
// 	})

// 	// create button, write css
// 	const expectHML2 = `<button class="s-ohkga5 s-2j80d3">Styled Button</button>`
// 	const resultHML2 = `<button class="${darkButtonClass}">Styled Button</button>`

// 	expect(resultHML2).toBe(expectHML2)
// })
