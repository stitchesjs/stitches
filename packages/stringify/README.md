<h1>stringify <img src="https://jonneal.dev/css-logo.svg" alt="" width="90" height="90" align="right" /></h1>

**stringify** converts a JavaScript object to a CSS string, optionally replacing values if a [replacer](#replacer) function is specified.

```js
import { stringify } from '@voiceflow/stitches-stringify'

stringify({
  body: {
    backgroundColor: 'white',
    color: 'black',

    '& > nav > ul': {
      '@media (min-width: 640px)': {
        margin: 0,
      }
    }
  }
})
```

```css
body {
  background-color: white;
  color: black;
}

@media (min-width: 640px) {
  body > nav > ul {
    margin: 0;
  }
}
```

The actual output will not be formatted as it appears here.

## Usage

From NPM, add **stringify** to your project:

```bash
npm install @voiceflow/stitches-stringify
```

Use **stringify** to serialize your CSS:

```js
import { stringify } from '@voiceflow/stitches-stringify'

stringify({
  body: {
    margin: 0
  }
})
```

## Replacer

The **replacer** is an optional function that alters the behavior of the stringification process, allowing you to replace entire fragments of CSS.

The **replacer** function takes two parameters, the **property** and **value** of a declaration, and returns a JavaScript object representing a fragment of CSS to replace it.

```js
const replacer = (property, value) => (
  // add a prefix to "tab-size" for Firefox
  property === 'tab-size'
    ? {
      ['-moz-' + property]: value,
      [property]: value,
    }
  // add common prefixes for Safari 14
  : /^(appearance|backface-visibility|background-clip|clip-path|hyphens|mask-image|user-select)$/.test(property)
    ? {
      ['-webkit-' + property]: value,
      [property]: value,
    }
  : null
)
```

```js
stringify({
  button: {
    appearance: 'none'
  },
  textarea: {
    tabSize: 2
  }
})
```

```css
button {
  -webkit-appearance: none;
  appearance: none;
}

textarea {
  -moz-tab-size: 2;
  tab-size: 2;
}
```

The **replacer** function prevents recursion by ignoring replacement of the same property-value pairs in a replaced fragment.

## Examples

### Stringify the `content` property

```js
stringify({
  q: {
    '&::before': {
      content: '«'
    },
    '&::after': {
      content: '»'
    }
  }
})
```

```css
q::before {
  content: '«';
}

q::after {
  content: '»';
}
```

### Stringify `@import` rules

Arrays can be used to create multiple declarations or unnested rules with the same name.

```js
stringify({
  '@import': [
    '"https://unpkg.com/sanitize.css"',
    '"https://unpkg.com/sanitize.css/typography.css"'
  ]
})
```

```css
@import 'https://unpkg.com/sanitize.css';
@import 'https://unpkg.com/sanitize.css/typography.css';
```

### Stringify a fallback property

```js
stringify({
  body: {
    background: [
      'white',
      'var(--page-bg, white)'
    ]
  }
})
```

```css
body {
  background: white;
  background: var(--red-color, white);
}
```
