## Why

- **Atomic mindset**: Each CSS property is a an atomic part of your complete CSS
- **Reusability**: Each CSS property, given the same screen, pseudo and value is considered the same, giving high degree of reusability
- **Optimal injection**: You can compose your styles outside of your UI, but no injection happens until it is actually used
- **Tokenized**: Configure with tokens to give design restrictions
- **Screens**: Define a set of media queries as screens to easily express CSS active within a screen
- **Utils**: Create your own CSS properties
- **Typed**: Fully typed API, even though you are not using Typescript
- **Specificity solved**: No more specificity issues as an atomic mindset opens up a more efficient and straight forward way to solve it
- **Token based theming**: Tokens are CSS variables. Create themes overriding the tokens and expose themes to any parts of your app

[A simple benchmark VS styled-components](https://codesandbox.io/s/benchmark-stitches-vs-styled-components-xi7qh?file=/src/App.js)

## Get started

`npm install @stitches/core`

```ts
import { css } from "@stitches/core";

const button = css({
  color: "gray",
  "&:hover": {
    color: "black",
  },
  borderColor: "black",
  padding: "1rem",
});

const alertButton = css(button, {
  borderColor: "red",
});

const dynamicButton = (disabled = false) =>
  css(
    button,
    disabled && {
      opacity: 0.5,
    }
  );
```

## Configure an instance

```ts
import { createCss } from "@stitches/core";

export const css = createCss({
  // Optinally add a prefix to all classnames to avoid crashes
  prefix: "my-lib",
  // Maps tokens to properties. Follows the system-ui theme specification: https://system-ui.com/theme
  tokens: {
    colors: {
      RED: "tomato",
    },
    space: {
      0: "1rem",
    },
    fontSizes: {},
    fonts: {},
    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {},
    borderStyles: {},
    radii: {},
    shadows: {},
    zIndices: {},
    transitions: {},
  },
  // Create screens with media queries. Note that the media queriy with the
  // highest specificity should go last
  breakpoints: {
    tablet: (rule) => `@media (min-width: 700px) { ${rule} }`,
  },
  // Create your own custom CSS properties. Here the functional syntax
  // shines to handle pseudo selectors
  utils: {
    marginX: (config) => (value: number | string) => ({
      marginLeft: value,
      marginRight: value,
    }),
  },
});

css({
  color: "RED", // Creates "tomato"
  tablet: {
    color: "blue", // Color is "blue" when media query is active
  },
  marginX: 0, // Creates "1rem", as it composes margin, using "space" from tokens
  border: "1px solid RED", // creates a "tomato" border
  border: ["1px", "solid", "RED"], // You can also use array syntax to get typing
  boxShadow: ["1px", "1px", "1px", "RED"], // You can also use array syntax with shadow
});
```

## Utility first

Stitches also allows you to put your utils at the front. That means you can create your very own CSS abstraction, where the underlying CSS properties are secondary.

```ts
import { createCss } from "@stitches/core";

export const css = createCss({
  utilityFirst: true,
  utils: {
    text: (config) => (value: { color?: string; size?: number }) => ({
      ...(color ? { color } : {}),
      ...(size ? { fontSize: size + "rem" } : {}),
    }),
  },
});

css({
  text: {
    color: "red",
    size: 2,
  },
  ":hover": {
    text: {
      color: "blue",
    },
  },
  // Override is a property that allows you to override
  // with specific low level CSS properties
  override: {
    padding: "2rem",
  },
});
```

## Themes

You can create theme instances which overrides tokens:

```ts
import { createCss } from "@stitches/core";

export const css = createCss({
  tokens: {
    colors: {
      primary: "tomato",
    },
  },
});

export const funnyTheme = css.theme({
  colors: {
    primary: "pink",
  },
});
```

This theme represents a classname which can be added at any point in your DOM tree. You can add multiple themes, which overrides each other by the nested level you apply them.

## Server side rendering

The `createCss` factory automatically detects if you are in a browser or server environment. That means when you this factory on the server it will **hash** the classnames (for rehydration abilities) and allow you to collect the styling to include in the responded html:

```ts
import { createCss } from "@stitches/core";

const css = createCss({});
const { result, styles } = css.getStyles(() => renderSomething(css));
```

Note that server produced CSS does not contain vendor prefixes, as there is no browser environment to look at. If you have a server rendered application you can either manually add the vendor prefixes you need:

```ts
css({
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
});
```

Or you can use a [postcss](https://www.npmjs.com/package/postcss) to do the conversion:

```ts
import { createCss } from "@stitches/core";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

const css = createCss({});
const { result, styles } = css.getStyles(() => renderSomething(css));

Promise.all(
  styles.map((style) =>
    postcss([autoprefixer({ browsers: ["> 1%", "last 2 versions"] })]).process(
      style
    )
  )
).then((styles) => {
  // styles with vendor prefixes
});
```
