import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { createStitches } from '../src/index.js'

describe('styled.withConfig', () => {
	test('Basic css calls without a config', () => {
		const { styled, getCssText } = createStitches()

		const ComponentToRender = styled.withConfig()('button', { color: 'DodgerBlue' })
		const className = ComponentToRender.render().props.className

		const cssString = getCssText()

		expect(className).toBe('c-dataoT')
		expect(cssString).toBe(`--sxs{--sxs:2 c-dataoT}@media{.c-dataoT{color:DodgerBlue}}`)
	})

	test('Creates the correct className with a componentId', () => {
		const { styled, getCssText } = createStitches()

		const componentConfig = {
			componentId: 'cool-id',
		}
		const ComponentToRender = styled.withConfig(componentConfig)('button', { color: 'red' })
		const className = ComponentToRender.render().props.className

		const cssString = getCssText()

		expect(className).toBe('c-cool-id')
		expect(cssString).toBe(`--sxs{--sxs:2 c-cool-id}@media{.c-cool-id{color:red}}`)
	})

	test('Creates the correct className with a displayName', () => {
		const { styled, getCssText } = createStitches()

		const componentConfig = {
			displayName: 'my-cool-display-name',
		}
		const ComponentToRender = styled.withConfig(componentConfig)('button', { color: 'red' })
		const className = ComponentToRender.render().props.className

		const cssString = getCssText()

		expect(className).toBe('c-my-cool-display-name-gmqXFB')
		expect(cssString).toBe(`--sxs{--sxs:2 c-my-cool-display-name-gmqXFB}@media{.c-my-cool-display-name-gmqXFB{color:red}}`)
	})

	test('Creates the correct className with a displayName and componentId', () => {
		const { styled, getCssText } = createStitches()

		const componentConfig = {
			componentId: 'cool-id',
			displayName: 'my-cool-display-name',
		}
		const ComponentToRender = styled.withConfig(componentConfig)('button', { color: 'red' })
		const className = ComponentToRender.render().props.className

		const cssString = getCssText()

		expect(className).toBe('c-my-cool-display-name-cool-id')
		expect(cssString).toBe(`--sxs{--sxs:2 c-my-cool-display-name-cool-id}@media{.c-my-cool-display-name-cool-id{color:red}}`)
	})

	test('Sets displayName on the component when passed as a componentConfig', () => {
		const { styled } = createStitches()

		const componentConfig = {
			componentId: 'cool-id',
			displayName: 'my-cool-display-name',
		}
		const ComponentToRender = styled.withConfig(componentConfig)('button', { color: 'red' })
		expect(ComponentToRender.displayName).toBe(componentConfig.displayName)
	})

	test('Creates the correct className with a componentConfig while extending components', () => {
		const { styled, getCssText } = createStitches()

		const ComponentToExtend = styled.withConfig({
			componentId: 'component-to-extend-id',
		})({ color: 'red' })
		const ComponentToRender = styled.withConfig({ componentId: 'cool-component-id' })(ComponentToExtend, { color: 'blue' })

		const className = ComponentToRender.render().props.className

		const cssString = getCssText()

		expect(className).toBe('c-component-to-extend-id c-cool-component-id')
		expect(cssString).toBe(`--sxs{--sxs:2 c-component-to-extend-id c-cool-component-id}@media{.c-component-to-extend-id{color:red}.c-cool-component-id{color:blue}}`)
	})
})

describe('shouldForwardStitchesProp', () => {
	test('Forwards the variant to the underlying component when shouldForwardStitchesProp returns true', () => {
		const { styled } = createStitches()

		const ReactComponent = ({ isOpen }) => {
			return React.createElement('div', {}, isOpen ? 'open' : 'closed')
		}

		const componentOneConfig = {
			shouldForwardStitchesProp: () => true,
		}

		const StitchesComponent = styled.withConfig(componentOneConfig)(ReactComponent, {
			variants: {
				isOpen: {
					true: { background: 'red' },
					false: { background: 'blue' },
				},
			},
		})

		let Rendered
		renderer.act(() => {
			Rendered = renderer.create(React.createElement(StitchesComponent, { isOpen: true }))
		})

		expect(Rendered.toJSON().children[0]).toBe('open')
	})

	test('Does not render the underlying ReactComponent when an as prop is provided and shouldForwardStitchesProp returns false', () => {
		const { styled } = createStitches()

		const ReactComponent = ({ as: asProp }) => {
			return React.createElement(asProp || 'button', {}, 'hola from child')
		}

		const componentOneConfig = {
			shouldForwardStitchesProp: () => false,
		}

		const StitchesComponent = styled.withConfig(componentOneConfig)(ReactComponent, {})

		let Rendered
		renderer.act(() => {
			Rendered = renderer.create(React.createElement(StitchesComponent, { as: 'a' }, ['comp']))
		})

		expect(Rendered.toJSON().children[0]).toBe('comp')
	})

	test('Forwards the as prop to the underlying component when shouldForwardStitchesProp returns true and the asp prop was defined', () => {
		const { styled } = createStitches()

		const ReactComponent = ({ as: asProp }) => {
			return React.createElement('div', {}, asProp || 'no-as-prop-found')
		}

		const componentOneConfig = {
			shouldForwardStitchesProp: () => true,
		}
		const StitchesComponent = styled.withConfig(componentOneConfig)(ReactComponent, {})

		let Rendered
		renderer.act(() => {
			Rendered = renderer.create(React.createElement(StitchesComponent))
		})
		expect(Rendered.toJSON().children[0]).toBe('no-as-prop-found')

		renderer.act(() => {
			Rendered.update(React.createElement(StitchesComponent, { as: 'a' }))
		})
		expect(Rendered.toJSON().children[0]).toBe('a')
	})
})
