import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createStitches, StitchesServerStyleSheet } from '@stitches/react';

// Create your Stitches instance
const { styled, getCssText } = createStitches({
  theme: {
    colors: {
      primary: 'blue',
      secondary: 'green',
    },
  },
});

// Create a styled component
const Button = styled('button', {
  backgroundColor: '$primary',
  color: 'white',
  padding: '10px 15px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  
  '&:hover': {
    backgroundColor: '$secondary',
  },
});

// Your React component
function App() {
  return (
    <div>
      <h1>Hello from Stitches with React 18!</h1>
      <Button>Click me</Button>
    </div>
  );
}

// Server-side rendering function
function renderToString() {
  // Using the new React 18 streaming API
  const stream = ReactDOMServer.renderToPipeableStream(
    <>
      <App />
      <StitchesServerStyleSheet sheet={{ toString: getCssText }} />
    </>,
    {
      onAllReady() {
        // The entire page is now ready
        console.log('All rendering complete');
      },
    }
  );
  
  return stream;
}

// Example usage in a Node.js server
// const http = require('http');
// 
// http.createServer((req, res) => {
//   res.setHeader('Content-Type', 'text/html');
//   res.write('<!DOCTYPE html><html><head><title>Stitches React 18</title></head><body>');
//   
//   const stream = renderToString();
//   stream.pipe(res);
//   
//   stream.on('end', () => {
//     res.write('</body></html>');
//     res.end();
//   });
// }).listen(3000);
