import * as react from 'react'
import * as renderer from 'react-test-renderer'
import createCss from '../src/index'

describe('Stitches React', () => {
	let wrapper = renderer.create(react.createElement(react.Fragment))
	const sheet = createCss()
	let styled = sheet.styled
	let Button = styled('button', {
		backgroundColor: 'gainsboro',
		borderRadius: '9999px',
		fontWeight: 500,
		padding: '0.75em 1em',
		border: 0,
		transition: 'all 200ms ease',

		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: '0 10px 25px rgba(0, 0, 0, .3)',
		},
	})

	test('createCss returns an object with a "styled" function', () => {
		expect(sheet.styled).toBeInstanceOf(Function)
	})

	test('"styled" function returns a Button component', () => {
		expect(Button).toBeInstanceOf(Function)
	})

	test('Button renders', () => {
		if (Button === null) return

		renderer.act(() => {
			wrapper.update(react.createElement(Button as any))
		})

		expect(wrapper.toJSON()).toStrictEqual({ type: 'button', props: { className: 'sgadxkw' }, children: null })

		expect(sheet.toString()).toEqual(
			'.sgadxkw{background-color:gainsboro;border-radius:9999px;font-weight:500;padding:0.75em 1em;border:0;transition:all 200ms ease;}.sgadxkw:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(0, 0, 0, .3);}',
		)
	})
})
