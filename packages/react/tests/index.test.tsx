import * as react from 'react'
import * as renderer from 'react-test-renderer'
import createCss from '../src/index'

describe('Stitches React', () => {
	let wrapper = renderer.create(react.createElement(react.Fragment))
	let sheet = (null as unknown) as ReactStyledSheet
	let styled = (null as unknown) as (type: string | object, init: anyobject) => ReactStyledRule
	let Button = (null as unknown) as Function

	test('createCss returns an object with a "styled" function', () => {
		sheet = createCss() as ReactStyledSheet

		expect(sheet.styled).toBeInstanceOf(Function)

		styled = sheet.styled
	})

	test('"styled" function returns a Button component', () => {
		Button = styled('button', {
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
