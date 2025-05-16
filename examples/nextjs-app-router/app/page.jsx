'use client';

import { styled } from '@stitches/react';

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

const Container = styled('div', {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
});

export default function HomePage() {
  return (
    <Container>
      <h1>Stitches with Next.js App Router</h1>
      <p>This is an example of using Stitches with Next.js 13+ App Router and React 18.</p>
      <Button>Click me</Button>
    </Container>
  );
}
