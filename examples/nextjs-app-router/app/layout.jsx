import { createStitches } from '@stitches/react';

const { getCssText } = createStitches({
  theme: {
    colors: {
      primary: 'blue',
      secondary: 'green',
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Stitches with Next.js App Router</title>
        <style 
          id="stitches" 
          dangerouslySetInnerHTML={{ __html: getCssText() }} 
          data-stitches=""
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
