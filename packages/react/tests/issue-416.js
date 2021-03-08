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

		// Box A has an active variant
		expect(boxA.props.className).toBe(`sxvbr6p sxvbr6p9ao8r--foo-bar`)

		// Box B has an active variant, plus the active variant of Box A
		expect(boxB.props.className).toBe(`sxvbr6p sxvbr6p9ao8r--foo-bar sxxk7xo sxxk7xo8d9vp--foo-bar`)

		// Gen Y has no variant, but activates the variants of Box A and Box B
		expect(genY.props.className).toBe(`sxvbr6p sxvbr6p9ao8r--foo-bar sxxk7xo sxxk7xo8d9vp--foo-bar`)

		// Box Z has an active variant, but does not activate the variants of Box A or Box B
		expect(boxZ.props.className).toBe(`sxvbr6p sxxk7xo sxi3g1z sxi3g1z4qa6j--foo-bar`)

		expect(toString()).toBe(`.sxvbr6p9ao8r--foo-bar{--box-a:foo-bar;}.sxxk7xo8d9vp--foo-bar{--box-b:foo-bar;}.sxi3g1z4qa6j--foo-bar{--box-z:foo-bar;}`)
	})
})
