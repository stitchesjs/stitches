# Stitches Core

Near-zero runtime, server-side rendering, multi-variant support, and best-in-class developer experience.

## Get started

```sh
npm install @stitches/core
```

```js
import createCss from '@stitches/core'

const sheet = createCss({
  theme: {
    colors: {
      black: '#2f2f2f',
      white: '#f3f3f3',
    },
  },
})

const button = sheet.css({
  all: 'unset',
  boxShadow: '0 0 0 1px $black',
  backgroundColor: '$black',
  color: '$white',
  padding: '.5em 1em',
})

const alertButton = sheet.css(button, {
  boxShadow: '0 0 0 1px red',
})

console.log(`<button class="${button}">`) // html will include a unique class name for the button component
console.log(`<style>${sheet}</style>`) // css will include a unique rule for the button component
```

## Configure an instance

```js
import createCss from '@stitches/core'

export const { css } = createCss({
  // adds a prefix to all classnames to avoid clashes
  prefix: 'my-lib',

  // maps tokens to properties
  theme: {
    colors: {
      red: 'tomato',
    },
    space: {
      0: '1rem',
    },
  },

  // creates named media queries
  media: {
    tablet: '(min-width: 700px)',
  },

  // creates css properties
  utils: {
    mX: (value) => ({
      marginLeft: value,
      marginRight: value,
    }),
    mY: (value) => ({
      marginTop: value,
      marginBottom: value,
    }),
  },
})

const colorful = css({
  // assigns a custom property that resolves `tomato`
  color: '$red',

  // assigns `0` to `margin-left` and `margin-right`
  marginX: 0,

  // assign "blue" when the breakpoint is matched
  '@tablet': {
    color: 'blue',
  },
})

document.querySelectorAll('section').forEach((el) => el.classList.add(colorful))
```

## Themes

Create themes to override defaults:

```js
import createCss from '@stitches/core'

export const { theme } = createCss({
  theme: {
    colors: {
      primary: 'tomato',
    },
  },
})

export const curiousTheme = theme({
  colors: {
    primary: 'pink',
  },
})

document.querySelectorAll('.curious').forEach((el) => el.classList.add(curiousTheme))
```
