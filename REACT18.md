# React 18 Support in Stitches

This update adds support for React 18, including server-side rendering (SSR) and React Server Components.

## Key Changes

1. Updated React dependencies to version 18
2. Added support for React 18's concurrent rendering
3. Enhanced server-side rendering to work with React 18's streaming SSR
4. Added new components and hooks for React 18 server components

## Server-Side Rendering with React 18

### Using the `StitchesServerStyleSheet` Component

For traditional SSR applications, you can use the `StitchesServerStyleSheet` component:

```jsx
import { createStitches, StitchesServerStyleSheet } from '@stitches/react';

const { getCssText } = createStitches({
  // your config
});

// In your server-side rendering function
const html = ReactDOMServer.renderToString(
  <>
    <App />
    <StitchesServerStyleSheet sheet={{ toString: getCssText }} />
  </>
);
```

### Using the `useServerStyles` Hook

For React 18 applications using hooks, you can use the `useServerStyles` hook:

```jsx
import { createStitches, useServerStyles } from '@stitches/react';

// In your App component
function App() {
  const ServerStyles = useServerStyles();
  
  return (
    <>
      <YourApp />
      {ServerStyles}
    </>
  );
}
```

### Using with Next.js 13+

For Next.js 13+ applications using the App Router:

```jsx
// app/layout.jsx
import { createStitches, StitchesServerStyleSheet } from '@stitches/react';

const { getCssText } = createStitches({
  // your config
});

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <style 
          id="stitches" 
          dangerouslySetInnerHTML={{ __html: getCssText() }} 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## React Server Components

For React Server Components, you can use the `StitchesServerStyleSheet` component in your server components:

```jsx
// Server Component
import { createStitches, StitchesServerStyleSheet } from '@stitches/react';

const { getCssText, styled } = createStitches({
  // your config
});

const StyledDiv = styled('div', {
  color: 'red',
});

export default function ServerComponent() {
  return (
    <>
      <StyledDiv>Hello from server</StyledDiv>
      <StitchesServerStyleSheet sheet={{ toString: getCssText }} />
    </>
  );
}
```

## Migrating from React 17

1. Update your dependencies:
   ```json
   {
     "dependencies": {
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "@stitches/react": "^1.3.1-1"
     }
   }
   ```

2. Update your SSR implementation to use the new components or hooks.

3. Test your application thoroughly, especially if you're using concurrent features or streaming SSR.
