# @stitches/styled

Use stitches to create styled components in React.

Read more about stitches at [@stitches/css](https://github.com/christianalfoni/stitches/tree/master/packages/css).

## Get started

`npm install @stitches/styled`

```tsx
// index.tsx
import * as React from "react";
import { render } from "react-dom";
import { css } from "@stitches/css";
import { Provider } from "@stitches/styled";
import { App } from "./components/App";

render(
  <Provider css={css}>
    <App />
  </Provider>,
  document.querySelector("#app")
);
```

```tsx
// App.tsx
import * as React from "react";
import { styled } from "@stitches/styled";

// Create a styled element
const Header = styled.h1((css) =>
  css.compose(css.color("red"), css.margin("2rem"))
);

// Create a styled element with default properties.
// The defaults is used for typing and also ensures they are
// not passed down to the underlying element
const Avatar = styled.div(
  {
    imageUrl: "",
  },
  (css, { imageUrl }) =>
    css.compose(
      css.borderRadius("50%"),
      css.backgroundImage(`url(${imageUrl})`)
    )
);

export const App: React.FC = () => {
  return (
    <div>
      {/*
        You can change the underlying element, which also // changes the typing
        of the component
      */}
      <Header as="h2">Hello World!</Header>
      {/*
        This is typed
      */}
      <Avatar imageUrl="https://..." />
    </div>
  );
};
```

## Configure

When you configure `css`, you also want to configure `styled` to ensure proper typing:

```ts
// css.ts
import { createStyled } from "@stitches/styled";
import { createConfig } from "@stitches/css";

const config = createConfig({
  tokens: {},
  screens: {},
  utils: {},
});
const { Provider, useCss, styled } = createStyled<typeof config>();

export { config, Provider, useCss, styled };
```

```tsx
// index.tsx
import * as React from "react";
import { render } from "react-dom";
import { createCss } from "@stitches/css";
import { Provider, config } from "./css";
import { App } from "./components/App";

render(
  <Provider css={createCss(config)}>
    <App />
  </Provider>,
  document.querySelector("#app")
);
```

```tsx
// App.tsx
import * as React from "react";
import { styled, useCss } from "../css";

const Header = styled.h1((css) =>
  css.compose(css.color("red"), css.margin("2rem"))
);

export const App: React.FC = () => {
  // You can also do inline css
  const css = useCss();
  return (
    <div className={css.color("red")}>
      <Header as="h2">Hello World!</Header>
    </div>
  );
};
```

## Server side rendering

```tsx
import { renderToString } from "react-dom/server";
import { createCss } from "@stitches/css";
import { Provider, config } from "../css";
import { App } from "../App";

const css = createCss({});
const html = renderToString(
  <Provider css={css}>
    <App />
  </Provider>
);
const styles = css.getStyles(); // The styles to be passed with the resulting HTML
```
