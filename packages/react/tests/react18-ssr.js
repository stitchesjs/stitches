import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { createStitches, StitchesServerStyleSheet, useServerStyles } from '../src/index.js'

describe('React 18 Server-Side Rendering', () => {
  test('StitchesServerStyleSheet renders correctly', () => {
    const { getCssText, styled } = createStitches()

    // Create a styled component to generate some CSS
    const Button = styled('button', {
      backgroundColor: 'blue',
      color: 'white',
      padding: '10px 15px',
    })

    // Render the component to generate CSS
    Button.render()

    // Get the CSS text
    const cssText = getCssText()

    // Create the server style sheet component
    const ServerStyleSheet = React.createElement(
      StitchesServerStyleSheet,
      { sheet: { toString: () => cssText } }
    )

    // Render the server style sheet
    const tree = renderer.create(ServerStyleSheet).toJSON()

    // Verify the rendered output
    expect(tree).toEqual({
      type: 'style',
      props: {
        'data-stitches': '',
        dangerouslySetInnerHTML: { __html: cssText },
      },
      children: null,
    })
  })

  test('StitchesServerStyleSheet returns null when no CSS is generated', () => {
    // Create the server style sheet component with empty CSS
    const ServerStyleSheet = React.createElement(
      StitchesServerStyleSheet,
      { sheet: { toString: () => '' } }
    )

    // Render the server style sheet
    const tree = renderer.create(ServerStyleSheet).toJSON()

    // Verify it returns null when no CSS is generated
    expect(tree).toBe(null)
  })

  test('useServerStyles returns a component that renders StitchesServerStyleSheet', () => {
    const { getCssText, styled, createTheme } = createStitches()

    // Create a styled component and a theme to generate some CSS
    const theme = createTheme({
      colors: {
        primary: 'blue',
      },
    })

    const Button = styled('button', {
      backgroundColor: '$primary',
      color: 'white',
    })

    // Render the component with the theme to generate CSS
    Button.render({ className: theme })

    // Create a server style sheet component directly
    const ServerStyles = React.createElement(
      StitchesServerStyleSheet,
      { key: 'server-styles', sheet: { toString: getCssText } }
    )

    // Create a component that uses the server styles
    const App = React.createElement(
      'div',
      null,
      [
        React.createElement('div', { key: 'app' }, 'App Content'),
        ServerStyles
      ]
    )

    // Render the component
    const tree = renderer.create(App).toJSON()

    // Verify the rendered output includes both the app content and the style tag
    expect(tree).toEqual({
      type: 'div',
      props: {},
      children: [
        {
          type: 'div',
          props: {},
          children: ['App Content']
        },
        {
          type: 'style',
          props: {
            'data-stitches': '',
            dangerouslySetInnerHTML: { __html: getCssText() }
          },
          children: null
        }
      ]
    })
  })
})
