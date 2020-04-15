# @stitches/css

## Why

- **Atomic mindset**: Each CSS property is a an atomic part of your complete CSS
- **Reusability**: Each CSS property, given the same screen, pseudo and value is considered the same, giving high degree of reusability
- **Optimal injection**: You can compose your styles outside of your UI, but no injection happens until it is actually used
- **Tokenized**: Configure with tokens to give design restrictions
- **Screens**: Define a set of media queries as screens to easily express CSS active within a screen
- **Utils**: Create your own CSS properties
- **Typed**: Fully typed API, even though you are not using Typescript

## Get started

`npm install @stitches/css`

```ts
import { css } from "@stitches/css";

const button = css.compose(
  css.color("gray"),
  css.color("black", ":hover"),
  css.borderColor("black"),
  css.padding("1rem")
);

const alertButton = css.compose(button, css.borderColor("red"));
```

## Configure

Instead of consuming `css` directly from the package, you can create your own configured instance:

```ts
import { createCss } from "@stitches/css";

export const css = createCss({
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
  screens: {
    tablet: (rule) => `@media (min-width: 700px) { ${rule} }`,
  },
  // Create your own custom CSS properties
  utils: {
    marginX: (utilCss) => (value, pseudo) =>
      utilCss.compose(
        utilsCss.marginLeft(value, pseudo),
        utilCss.marginRight(value, pseudo)
      ),
  },
});

css.color("RED"); // Creates "tomato"
css.tablet.color("blue"); // Color is "blue" when media query is active
css.marginX(0); // Creates "1rem", as it composes margin, using "space" from tokens
```
