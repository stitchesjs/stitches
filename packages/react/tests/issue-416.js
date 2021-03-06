import * as React from 'react'
import * as renderer from 'react-test-renderer'
import createCss from '../src/index.js'

describe('Issue #416', () => {
	test('Composition versus Descendancy', () => {
		const { styled, toString } = createCss()

		const BoxA = styled('main', {
			variants: {
				foo: {
					bar: {
						'--box-a': 'foo-bar',
					},
				},
			},
		})

		const BoxB = styled(BoxA, {
			variants: {
				foo: {
					bar: {
						'--box-b': 'foo-bar',
					},
				},
			},
		})

		const GenY = (props) => {
			return React.createElement(BoxB, props)
		}

		const BoxZ = styled(GenY, {
			variants: {
				foo: {
					bar: {
						'--box-z': 'foo-bar',
					},
				},
			},
		})

		const App = () => {
			return React.createElement(
				'div',
				null,
				// children
				React.createElement(BoxA, { foo: 'bar' }),
				React.createElement(BoxB, { foo: 'bar' }),
				React.createElement(GenY, { foo: 'bar' }),
				React.createElement(BoxZ, { foo: 'bar' }),
			)
		}

		let wrapper

		renderer.act(() => {
			wrapper = renderer.create(React.createElement(App))
		})

		const [boxA, boxB, genY, boxZ] = wrapper.toJSON().children

		const boxAClass = 'sx03kze sx03kze9ao8r--foo-bar'
		const boxBClass = 'sx03kze8d9vp--foo-bar'
		const boxZClass = 'sx03kze sx03kze4qa6j--foo-bar'

		// Box A has an active variant
		expect(boxA.props.className).toBe(boxAClass)

		// Box B has an active variant, plus the active variant of Box A
		expect(boxB.props.className).toBe(boxAClass + ' ' + boxBClass)

		// Gen Y has no variant, but activates the variants of Box A and Box B
		expect(genY.props.className).toBe(boxAClass + ' ' + boxBClass)

		// Box Z has an active variant, but does not activate the variants of Box A or Box B
		expect(boxZ.props.className).toBe(boxZClass)

		const boxACss = `.sx03kze9ao8r--foo-bar{--box-a:foo-bar;}`
		const boxBCss = `.sx03kze8d9vp--foo-bar{--box-b:foo-bar;}`
		const boxZCss = `.sx03kze4qa6j--foo-bar{--box-z:foo-bar;}`

		expect(toString()).toBe(boxACss + boxBCss + boxZCss)
	})
})
