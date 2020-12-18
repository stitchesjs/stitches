import createCss from '../src/index'

test('basic functionality', () => {
	const { css } = createCss({
		theme: {
			colors: {
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

	const buttonClass = css({
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

	// create button, write css
	const expectHML1 = `<button class="s-2j80d3">Styled Button</button>`
	const resultHML1 = `<button class="${buttonClass}">Styled Button</button>`

	expect(resultHML1).toBe(expectHML1)

	const darkButtonClass = css(buttonClass, {
		backgroundColor: 'black',
		color: 'white',
	})

	// create button, write css
	const expectHML2 = `<button class="s-ohkga5 s-2j80d3">Styled Button</button>`
	const resultHML2 = `<button class="${darkButtonClass}">Styled Button</button>`

	expect(resultHML2).toBe(expectHML2)
})
