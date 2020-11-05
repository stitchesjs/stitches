import { createStyled, StitchesCSS } from '../src/index';
import { Expect } from '@stitches/core/tests/types.test';
import * as React from 'react';

test('React typescript types', () => {
  const config = {
    tokens: {
      colors: {
        $red100: 'tomato',
      },
    },
    breakpoints: {
      bp1: (val: string) => ``,
    },
    utils: {
      mx: (value: string) => {
        return {};
      },
      my: (value: number) => {
        return {};
      },
    },
  } as const;

  const { styled, css } = createStyled(config);

  const Button = styled.button({
    background: 'red',
    backdropFilter: 'initial',
    backfaceVisibility: 'hidden',
    backgroundAttachment: 'fixed',
    backgroundColor: '$red100',
    padding: 3,
    variants: {
      variant: {
        red: {
          backgroundColor: 'red100',
          backdropFilter: 'initial',
          padding: 'inherit',
        },
      },
    },
  });
  const ProxyButton = styled('button', {
    background: 'AppWorkspace',
    backgroundColor: 'aliceblue',
    backdropFilter: 'inherit',
    paddingBlock: 'initial',
    padding: '-moz-initial',
    mx: '',
    my: 2,
    variants: {
      variant: {
        red: {
          background: 'ActiveCaption',
          backgroundColor: 'red',
        },
      },
    },
  });

  styled.button({
    // @ts-expect-error
    my: 'hi',
    // @ts-expect-error
    mx: 2,
  });
  styled('button', {
    // @ts-expect-error
    my: 'hi',
    // @ts-expect-error
    mx: 2,
  });

  type InferStuff = typeof ProxyButton extends (a: { css: infer C; variant: infer V }) => any
    ? { css: C; variant: V }
    : never;

  // Assert variants are typed
  Expect<InferStuff['variant']>().And<'red' | undefined | { bp1?: 'red' }>().toShallowMatch();

  // Assert css object shape is the same
  Expect<InferStuff['css']>()
    .And<StitchesCSS<typeof config.breakpoints, typeof config.tokens, typeof config.utils, false>>()
    .toShallowMatch();

  const App = () => {
    return (
      <>
        <Button variant="red">hello</Button>
        <Button variant={{ bp1: 'red' }}>hello</Button>
        <ProxyButton variant="red">hello</ProxyButton>
        <ProxyButton variant={{ bp1: 'red' }}>hello</ProxyButton>

        <Button as="a" href="hello">
          hello
        </Button>
        {/* @ts-expect-error */}
        <Button href="hello">hello</Button>
        {/* @ts-expect-error */}
        <Button as="fwefw">hello</Button>

        <ProxyButton as="a" href="hello">
          hello
        </ProxyButton>
        {/* @ts-expect-error */}
        <ProxyButton href="hello">hello</ProxyButton>
        {/* @ts-expect-error */}
        <ProxyButton as="hello">hello</ProxyButton>
      </>
    );
  };
});
