import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { createStitches } from '../src/index.js'

describe('Issue #671 - forwardRef', () => {
	{
		const { styled, getCssText } = createStitches()

		const StyledBase = styled('div', { color: 'black' })
		const ForwardRefReactComponent = React.forwardRef((props, ref) => React.createElement(StyledBase, { ...props, ref }))
		const StitshcesComponentExtendingForwardRefReactComponent = styled(ForwardRefReactComponent, { color: 'white' })

		const App = () => {
			return React.createElement(
				'div',
				null,
				React.createElement(StitshcesComponentExtendingForwardRefReactComponent, {}),
			)
		}

		renderer.act(() => {
			renderer.create(React.createElement(App))
		})

		test('a stitches component extending a forwardRef react component will inject the styles in the correct order', () => {
			expect(getCssText()).toBe(`--sxs{--sxs:2 c-fjEkWJ c-bjcmt}@media{.c-bjcmt{color:black}.c-fjEkWJ{color:white}}`)
		})
	}
})
