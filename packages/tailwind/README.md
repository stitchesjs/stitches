# :thread: @stitches/tailwind

Use stitches to build Tailwind apps

Read more about stitches at [@stitches/css](https://github.com/christianalfoni/stitches/tree/master/packages/css).

## Why

Tailwinds atomic mindset moved to a CSS-IN-JS library:

- No build step, just start using it
- No specificity issues
- Small payload, about 10kb
- Use any pseudo selectors with any utility
- Automatically creates the critical CSS when used with SSR
- Can reduce payload even more with treeshaking utils and theme values
- Typed API, also when creating custom themes

## Get started

Load your page with the normalized CSS of Tailwind: https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.2.0/base.css.

`npm install @stitches/css @stitches/tailwind`

```ts
// index.ts
import { createCss } from "@stitches/css";
import { tailwind } from "@stitches/tailwind";

const css = createCss(tailwind);

css.compose(css.m("12"), css.text("blue-500"));
```

## Configure

You can configure the Tailwind instance to have a custom theme, utils and even add new utils:

```ts
// css.ts
import { createCss } from "@stitches/styled";
import { createConfig } from "@stitches/tailwind";
// Treeshake by including only specific utils
// import { text, flex } from "@stitches/tailwind/utils"
import * as utils from "@stitches/tailwind/utils";
// Treeshake by including only specific theme
// import { colors, spacing } from "@stitches/tailwind/theme"
import * as theme from "@stitches/tailwind/theme";

const config = createConfig({
  screens: {
    tablet: (cssRule) => `@media (min-width: 768px) { ${cssRule} }`,
    laptop: (cssRule) => `@media (min-width: 1024px) { ${cssRule} }`,
  },
  theme: theme,
  utils: utils,
});
```

To understand the properties of the theme and how you can build one yourself, take a look at the [default theme](https://github.com/christianalfoni/stitches/blob/master/packages/tailwind/src/theme.ts)
