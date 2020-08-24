Use stitches to create styled components in React.

Read more about stitches at [@stitches/css](https://github.com/modulz/stitches/tree/master/packages/css).

## Get started

`npm install @stitches/styled`

```tsx
// css.ts
import { createStyled } from "@stitches/styled";

export const { styled, css } = createStyled({
  // CSS config
});
```

```tsx
// App.tsx
import * as React from "react";
import { styled } from "./css";

const Header = styled.h1({
  color: "red",
  margin: "2rem",
});

export const App: React.FC = () => {
  return (
    <div>
      {/*
        You can change the underlying element, which also
        changes the typing of the component
      */}
      <Header as="h2">Hello World!</Header>
    </div>
  );
};
```

## Variants

Instead of providing props to the styled elements, you rather have variants. This fixes two important issues with styled APIs:

1. No invalid props are passed down to the underlying DOM node
2. The css definition has no dynamic behaviour, meaning there is only a single evaluation. This creates a big performance improvement

```tsx
import { styled } from "./css";

export const Button = styled.button(
  {
    borderRadius: 1,
  },
  {
    variant: {
      primary: {
        backgroundColor: "red",
      },
      muted: {
        backgroundColor: "gray",
        opacity: 0.5,
      },
    },
    size: {
      small: {
        fontSize: 2,
      },
      big: {
        fontSize: 4,
      },
    },
  }
);
```

The dynamic behaviour is defined where you consume the styled component:

```tsx
<Button variant="primary" size="small"></Button>

<Button variant={isDisabled ? 'muted' : 'primary'} size="small" disabled={isDisabled}></Button>
```

Variants can also be triggered by screen:

```tsx
<Button
  variant={{
    mobile: "primary",
    tablet: "secondary",
  }}
  size="small"
></Button>
```

## Override

All styled components takes a `css` property. This property allow you to override styles. You should ideally use the **css** factory to create overriding style outside the component or using a memo hook, but you can inline if you really want to. Inlining forces Stitches to evaluate the styling on every render, but this is a tiny overhead not really noticeable in practice.

```tsx
const override = css({
  '&:hover': {
    color: "blue",
  },
});

export const MyComponent = () => {
  return (
    <div>
      <Button variant="primary" css={override}></Button>
      <Button variant="primary" css={{
        '&:hover': {
          color: 'blue'
        }
      }}>
    </div>
  );
};
```

## Composition

The **styled** api can be called directly as well:

```tsx
const Header = styled("h1", {
  color: "red",
  margin: "2rem",
});
```

This gives the same result as earlier. But you can rather pass an existing component:

```tsx
const Header = styled.h1({
  color: "red",
  margin: "2rem",
});

const UltimateHeader = styled(Header, {
  fontSize: "100px",
});
```

Any variants defined by what you compose is typed and made available to the composed styled component.

You can also compose dynamically by doing:

```tsx
<Header as={SomeOtherStyledComponent} />
```

You can also create logical components by using the low level `styled.Box` component:

```tsx
const Alert: PolymorphicComponent<{ isOpen: boolean }, "div"> = styled(
  ({ isOpen, as, ...props }) => {
    const [open, setOpen] = React.useState(isOpen);

    return open ? <styled.Box {...props} as={as || "div"} /> : null;
  }
);
```

Now this component can be used as a normal styled component, you could even have given it a base styling and/or variants.

## Server side rendering

```tsx
import { renderToString } from "react-dom/server";
import { css } from "../css";
import { App } from "../App";

const { styles, result } = css.getStyles(() => renderToString(<App />));
```

**styles** is an array of style contents. Each item in the array should result in a style tag passed to the browser. **result** is just the result of the callback, in this example the string returned from **renderToString**.
