import { createCss, createTokens } from '../src';

describe('createCss', () => {
  test('create simple atoms', () => {
    const css = createCss({}, null);
    const atoms = css({ color: 'red' }) as any;
    const atom = atoms.atoms[0];

    css.getStyles(() => {
      atom.toString();

      return '';
    });
  });

  test('compose atoms', () => {
    const css = createCss({}, null);
    css({ color: 'red', backgroundColor: 'blue' }).toString();
  });

  test('create tokens', () => {
    const tokens = createTokens({
      colors: {
        RED: 'tomato',
      },
    });
    const css = createCss({ tokens }, null);
    const atom = (css({ color: 'RED' }) as any).atoms[0];

    css.getStyles(() => {
      atom.toString();
      return '';
    });
  });

  test('remove special characters from tokens', () => {
    const tokens = createTokens({
      colors: {
        '$!@red@!$': 'tomato',
      },
    });
    const css = createCss({ tokens }, null);
    const atom = (css({ color: '$!@red@!$' }) as any).atoms[0];

    css.getStyles(() => {
      atom.toString();
      return '';
    });
  });

  test('remove special characters from tokens in themes', () => {
    const css = createCss(
      {
        tokens: {
          colors: {
            '$!@red@!$': 'tomato',
          },
        },
      },
      null
    );

    css.getStyles(() => {
      // @ts-ignore
      css({ color: '$!@red@!$' }).toString();
      css
        .theme({
          colors: {
            '$!@red@!$': 'red',
          },
        })
        .toString();
      return '';
    });
  });

  test('generate negative tokens for numeric scales', () => {
    const tokens = createTokens({
      sizes: {
        '0': '0px',
        '1': '1px',
      },
      space: {
        '0': '0px',
        '1': '1px',
      },
      letterSpacings: {
        '0': '0px',
        '1': '1px',
      },
      zIndices: {
        '0': '0',
        '1': '1',
      },
    });
    const css = createCss({ tokens }, null);
    const atom = css({
      marginLeft: '-1',
      letterSpacing: '-1',
      width: '-1',
      zIndex: '-1',
    }) as any;

    css.getStyles(() => {
      atom.toString();
      return '';
    });
  });

  test('do not generate negative tokens when the user already defined a negative one', () => {
    const tokens = createTokens({
      sizes: {
        '-1': '-1px',
        '1': '1px',
      },
    });

    createCss({ tokens }, null);
  });
});
