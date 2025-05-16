import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { createStitches, StitchesServerStyleSheet } from '../src/index.js'

describe('React 18 Streaming SSR', () => {
  test('StitchesServerStyleSheet can be used in a React component tree', () => {
    const { getCssText, styled } = createStitches()

    // Create a styled component to generate some CSS
    const Button = styled('button', {
      backgroundColor: 'blue',
      color: 'white',
      padding: '10px 15px',
    })

    // Render the component to generate CSS
    Button.render()

    // Create a simple app component with the StitchesServerStyleSheet
    const App = React.createElement(
      'div',
      null,
      [
        React.createElement(Button, { key: 'button' }, 'Click me'),
        React.createElement(
          StitchesServerStyleSheet,
          { key: 'styles', sheet: { toString: getCssText } }
        )
      ]
    )

    // Render the component tree
    const tree = renderer.create(App).toJSON()

    // Verify the rendered output includes both the button and the style tag
    expect(tree.type).toBe('div')
    expect(tree.children.length).toBe(2)

    // Check the button
    const buttonNode = tree.children[0]
    expect(buttonNode.type).toBe('button')
    expect(buttonNode.children).toEqual(['Click me'])
    expect(typeof buttonNode.props.className).toBe('string')
    expect(buttonNode.props.className.startsWith('c-')).toBe(true)

    // Check the style tag
    const styleNode = tree.children[1]
    expect(styleNode.type).toBe('style')
    expect(styleNode.props['data-stitches']).toBe('')
    expect(styleNode.props.dangerouslySetInnerHTML.__html).toBe(getCssText())

    // Verify that the CSS text contains the button styles
    const cssText = getCssText()
    expect(cssText.indexOf('background-color:blue') !== -1).toBe(true)
    expect(cssText.indexOf('color:white') !== -1).toBe(true)
    expect(cssText.indexOf('padding:10px 15px') !== -1).toBe(true)
  })
})
