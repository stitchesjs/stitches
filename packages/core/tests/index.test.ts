import { createCss, createTokens, hotReloadingCache } from '../src';

function createStyleSheet(styleTag: HTMLStyleElement): CSSStyleSheet {
  document.querySelector('head')?.appendChild(styleTag);

  const sheet = document.styleSheets[document.styleSheets.length - 1];
  // @ts-ignore
  sheet.ownerNode = styleTag;
  return sheet as any;
}

function createStyleTag(textContent: string): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = textContent;
  return style;
}

function createFakeEnv(styleTagContents: string[] = [], computedStyles: string[] = []) {
  const styleTags = styleTagContents.map(createStyleTag);
  const styleSheets = styleTags.map(createStyleSheet);

  return {
    getComputedStyle() {
      return computedStyles;
    },
    document: {
      styleSheets,
      // Creates a style tag
      createElement() {
        return createStyleTag('');
      },
      // Only used to grab head
      querySelector() {
        return {
          // Used to append the style, where
          // we add the stylesheet
          appendChild(styleTag: HTMLStyleElement) {
            styleSheets.push(createStyleSheet(styleTag));
          },
          // Only used to count styles
          querySelectorAll() {
            return styleTags;
          },
        };
      },
    },
  };
}

beforeEach(() => {
  hotReloadingCache.clear();
});

describe('createCss: mixed(SSR & Client)', () => {
  test('should create simple atoms', () => {
    const css = createCss({}, null);
    const atoms = css({ color: 'red' }) as any;
    const atom = atoms.atoms[0];
    expect(atom.id).toMatchInlineSnapshot(`"color%initial"`);
    expect(atom.cssHyphenProp).toEqual('color');
    expect(atom.selector).toBe('%');
    expect(atom.breakpoint).toMatchInlineSnapshot(`"initial"`);
    expect(atom.value).toMatchInlineSnapshot(`"red"`);

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_vfarC"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_vfarC/*X*/{color:red;}"
    `);
  });

  test('should compose atoms', () => {
    const css = createCss({}, null);
    expect(css({ color: 'red', backgroundColor: 'blue' }).toString()).toMatchInlineSnapshot(`"_htDnsg _vfarC"`);
  });

  test('should create tokens', () => {
    const tokens = createTokens({
      colors: {
        RED: 'tomato',
      },
    });
    const css = createCss({ tokens }, null);
    const atom = (css({ color: 'RED' }) as any).atoms[0];

    expect(atom.id).toMatchInlineSnapshot(`"color%initial"`);
    expect(atom.cssHyphenProp).toEqual('color');
    expect(atom.selector).toBe('%');
    expect(atom.breakpoint).toMatchInlineSnapshot(`"initial"`);
    expect(atom.value).toMatchInlineSnapshot(`"var(--colors-RED)"`);

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_cvKCax"`);
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_cvKCax/*X*/{color:var(--colors-RED);}"
    `);
  });

  test('should remove special characters from tokens', () => {
    const tokens = createTokens({
      colors: {
        '$!@red@!$': 'tomato',
      },
    });
    const css = createCss({ tokens }, null);
    const atom = (css({ color: '$!@red@!$' }) as any).atoms[0];

    expect(atom.value).toMatchInlineSnapshot(`"var(--colors-red)"`);

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_kTKeUF"`);
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_kTKeUF/*X*/{color:var(--colors-red);}"
    `);
  });

  test('should remove special characters from tokens in themes', () => {
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
    const { styles } = css.getStyles(() => {
      // @ts-ignore
      css({ color: '$!@red@!$' }).toString();
      expect(
        css
          .theme({
            colors: {
              '$!@red@!$': 'red',
            },
          })
          .toString()
      ).toMatchInlineSnapshot(`"theme-0"`);
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[0]).toMatchInlineSnapshot(`
      "/* STITCHES:__variables__ */
      .theme-0{--colors-red:red;}
      :root{--colors-red:tomato;}"
    `);
    expect(styles[2]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_kTKeUF/*X*/{color:var(--colors-red);}"
    `);
  });

  test('Should generate negative tokens for numeric scales', () => {
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

    const { styles } = css.getStyles(() => {
      atom.toString();
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jAzCtu/*X*/{margin-left:calc(var(--space-1) * -1);}
      ./*X*/_ihWrEA/*X*/{letter-spacing:calc(var(--letterSpacings-1) * -1);}
      ./*X*/_cXGKjy/*X*/{width:calc(var(--sizes-1) * -1);}
      ./*X*/_gSisrC/*X*/{z-index:calc(var(--zIndices-1) * -1);}"
    `);
  });

  test('Should not generate negative tokens when the user already defined a negative one', () => {
    const tokens = createTokens({
      sizes: {
        '-1': '-1px',
        '1': '1px',
      },
    });
    const css = createCss({ tokens }, null);
    expect((css as any)._config().tokens.sizes['1']).toBeTruthy();
    expect((css as any)._config().tokens.sizes['-1']).toBeTruthy();
    expect((css as any)._config().tokens.sizes['--1']).toBeFalsy();
  });

  test('should create breakpoints', () => {
    const css = createCss(
      {
        breakpoints: {
          tablet: (rule) => `@media (min-width: 700px) { ${rule} }`,
        },
      },
      null
    );
    const atom = (css({ tablet: { color: 'red' } }) as any).atoms[0];
    expect(atom.id).toMatchInlineSnapshot(`"color%tablet"`);
    expect(atom.cssHyphenProp).toEqual('color');
    expect(atom.selector).toBe('%');
    expect(atom.breakpoint).toMatchInlineSnapshot(`"tablet"`);

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_wRHxO"`);
      return '';
    });

    expect(styles.length).toBe(4);
    expect(styles[3].trim()).toMatchInlineSnapshot(`
      "/* STITCHES:tablet */
      @media (min-width: 700px) { ./*X*/_wRHxO/*X*/{color:red;} }"
    `);
    expect(styles[3].trim()).toMatchInlineSnapshot(`
      "/* STITCHES:tablet */
      @media (min-width: 700px) { ./*X*/_wRHxO/*X*/{color:red;} }"
    `);
  });

  test('should handle pseudos', () => {
    const css = createCss({}, null);
    const atom = (css({ '&:hover': { color: 'red' } }) as any).atoms[0];

    expect(atom.id).toMatchInlineSnapshot(`"color%%:hoverinitial"`);
    expect(atom.cssHyphenProp).toEqual('color');
    expect(atom.selector).toMatchInlineSnapshot(`"%%:hover"`);
    expect(atom.breakpoint).toMatchInlineSnapshot(`"initial"`);
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_eqYDFT"`);
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_eqYDFT/*X*/./*X*/_eqYDFT/*X*/:hover{color:red;}"
    `);
  });

  test('should handle specificity', () => {
    const css = createCss({}, null);
    expect(
      css(
        {
          color: 'red',
          backgroundColor: 'blue',
        },
        {
          backgroundColor: 'green',
        }
      ).toString()
    ).toMatchInlineSnapshot(`"_cIgueR _vfarC"`);
  });

  test('should insert rule only once', () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      expect(css({ color: 'red' }).toString()).toMatchInlineSnapshot(`"_vfarC"`);
      expect(css({ color: 'red' }).toString()).toMatchInlineSnapshot(`"_vfarC"`);
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_vfarC/*X*/{color:red;}"
    `);
  });
  /*
    Not sorting pseudos, rather letting these combinations craete new atoms... take more
    sorting everything than creating "duplicate" atoms like this
  test("should handle specificity with different but same pseudo", () => {
    const css = createCss({}, null);
    expect(
      css(
        { "&:hover:disabled": { color: "red" } },
        { "&:disabled:hover": { color: "red" } }
      ).toString()
    ).toMatchInlineSnapshot();
  });
  */

  test('should inject screen sheets', () => {
    const fakeEnv = createFakeEnv();
    const css = createCss(
      {
        breakpoints: {
          tablet: (rule) => `@media (min-width: 700px) { ${rule} }`,
        },
      },
      (fakeEnv as unknown) as Window
    );
    String(css({ tablet: { color: 'red' } }));
    expect(fakeEnv.document.styleSheets.length).toBe(4);
    expect(fakeEnv.document.styleSheets[3].cssRules[0].cssText).toMatchInlineSnapshot(
      `"@media (min-width: 700px) {._wRHxO {color: red;}}"`
    );
  });

  test('should allow utils', () => {
    const css = createCss(
      {
        utils: {
          marginX: (value: string, config) => ({
            marginLeft: value,
            marginRight: value,
          }),
        },
      },
      null
    );
    expect(css({ marginX: '1rem' }).toString()).toMatchInlineSnapshot(`"_kXWDug _dcoWJH"`);
  });

  test('should allow utils that resolve into nested structures', () => {
    const css = createCss(
      {
        utils: {
          hover: (value, config) => ({
            ':hover': value,
            ':focus': value,
          }),
        },
      },
      null
    );
    const atom = css({
      hover: {
        color: 'green',
      },
    });

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_fFBJtF _kSFrLT"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_kSFrLT/*X*/./*X*/_kSFrLT/*X*/:hover{color:green;}
      ./*X*/_fFBJtF/*X*/./*X*/_fFBJtF/*X*/./*X*/_fFBJtF/*X*/./*X*/_fFBJtF/*X*/:focus{color:green;}"
    `);
  });

  test('should ignore undefined atoms', () => {
    const css = createCss({}, null);

    expect(
      // @ts-ignore
      String(css(undefined, null, false, '', { color: 'red' }))
    ).toMatchInlineSnapshot(`"_vfarC"`);
  });

  test('should allow empty compose call', () => {
    const css = createCss({}, null);
    expect(String(css())).toBe('');
  });

  test('should allow conditional compositions', () => {
    const css = createCss({}, null);
    expect(String(css((false as any) && { color: 'red' }))).toBe('');
    expect(String(css(true && { color: 'red' }))).toMatchInlineSnapshot(`"_vfarC"`);
  });

  test('should allow prefixes', () => {
    const css = createCss(
      {
        prefix: 'foo',
      },
      null
    );
    expect(String(css({ color: 'red' }))).toMatchInlineSnapshot(`"foo_vfarC"`);
  });

  test('should not inject existing styles', () => {
    const serverCss = createCss({}, null);
    const { styles } = serverCss.getStyles(() => {
      serverCss({ color: 'red' }).toString();
      return '';
    });

    const fakeEnv = createFakeEnv(styles);
    hotReloadingCache.clear();
    const clientCss = createCss({}, fakeEnv as any);
    // Lets see what is already put in
    expect(fakeEnv.document.styleSheets.length).toBe(3);
    expect(fakeEnv.document.styleSheets[2].cssRules.length).toBe(1);
    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toMatchInlineSnapshot(`"._vfarC {color: red;}"`);
    // On the client it will rerun the logic (React hydrate etc.)
    clientCss({ color: 'red' }).toString();
    // Then we add something new
    clientCss({ color: 'blue' }).toString();
    // Lets see if it continues on the correct sequence
    expect(fakeEnv.document.styleSheets[2].cssRules.length).toBe(2);
    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toMatchInlineSnapshot(`"._gtxchX {color: blue;}"`);
  });

  test('should be able to show friendly classnames', () => {
    const css = createCss(
      {
        showFriendlyClassnames: true,
      },
      null
    );
    const { styles } = css.getStyles(() => {
      css({ color: 'red' }).toString();
      css({ backgroundColor: 'red' }).toString();
      return '';
    });

    expect(styles[2]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_initial_bc_gwFOTp/*X*/{background-color:red;}
      ./*X*/_initial_c_vfarC/*X*/{color:red;}"
    `);
  });

  test('Jest producing wrong snapshot for escaped characters', () => {
    // the snapshot output is wrong so we're just asserting that it's going to be wrong
    // just for the sake of the next tests
    // https://github.com/facebook/jest/issues/5660
    const fun = () => `\\@should-not-fail-unless-jest-issue-is-fixed`;
    expect(fun()).toMatchInlineSnapshot(`"\\\\@should-not-fail-unless-jest-issue-is-fixed"`);
  });

  test('should escape classname for the cssRule when showFriendlyClassnames is on and is running on the server', () => {
    const css = createCss(
      {
        showFriendlyClassnames: true,
        breakpoints: {
          '@mobile': (rule) => `@media(min-width:300px){${rule}}`,
        },
      },
      null
    );
    const { styles } = css.getStyles(() => {
      const cleanClass = css({ '@mobile': { color: 'red' } }).toString();
      // make sure that the classname from .toString() is clean and un escaped
      expect(cleanClass).toMatchInlineSnapshot(`"_@mobile_c_fmbjMM"`);
      return '';
    });
    // make sure that the injected rules are escaped:
    expect(styles[3]).toMatchInlineSnapshot(`
      "/* STITCHES:@mobile */
      @media(min-width:300px){./*X*/_\\\\@mobile_c_fmbjMM/*X*/{color:red;}}"
    `);
  });

  test('escaping should not produce any hydration issues or double injection of styles', () => {
    const serverCss = createCss(
      {
        showFriendlyClassnames: true,
        breakpoints: {
          '@mobile': (rule: string) => `@media(min-width:300px){${rule}}`,
        },
      },
      null
    );
    const { styles } = serverCss.getStyles(() => {
      serverCss({ '@mobile': { color: 'red' } }).toString();
      return '';
    });

    const fakeEnv = createFakeEnv(styles);
    hotReloadingCache.clear();
    const clientCss = createCss(
      {
        showFriendlyClassnames: true,
        breakpoints: {
          '@mobile': (rule: string) => `@media(min-width:300px){${rule}}`,
        },
      },
      fakeEnv as any
    );

    expect(fakeEnv.document.styleSheets.length).toBe(4);
    expect(fakeEnv.document.styleSheets[3].cssRules.length).toBe(1);
    expect(fakeEnv.document.styleSheets[3].cssRules[0].cssText).toMatchInlineSnapshot(
      `"@media (min-width:300px) {._\\\\@mobile_c_fmbjMM {color: red;}}"`
    );
    clientCss({ '@mobile': { color: 'red' } }).toString();
    clientCss({ '@mobile': { color: 'blue' } }).toString();
    clientCss({ color: 'blue' }).toString();
    expect(fakeEnv.document.styleSheets[3].cssRules.length).toBe(2);
    expect(fakeEnv.document.styleSheets[3].cssRules[0].cssText).toMatchInlineSnapshot(
      `"@media (min-width:300px) {._@mobile_c_foBsOd {color: blue;}}"`
    );
    // this rule was hydrated and cleaned from the server:
    expect(fakeEnv.document.styleSheets[3].cssRules[1].cssText).toMatchInlineSnapshot(
      `"@media (min-width:300px) {._\\\\@mobile_c_fmbjMM {color: red;}}"`
    );
  });

  test('css classes should start with "_" regardless of showFriendlyClassnames', () => {
    // on the client, the insertRule api automatically escapes selectors
    // so this test case just makes sure that the breakpoint isn't going to endup
    // escaped twice:
    const cssWithShowFriendlyClassnames = createCss(
      {
        showFriendlyClassnames: true,
      },
      null
    );
    const cssWithoutShowFriendlyClassnames = createCss({}, null);
    expect(cssWithShowFriendlyClassnames({ '@mobile': { color: 'red' } }).toString()[0]).toBe('_');
    expect(cssWithoutShowFriendlyClassnames({ '@mobile': { color: 'red' } }).toString()[0]).toBe('_');
    expect(cssWithShowFriendlyClassnames({ color: 'red' }).toString()[0]).toBe('_');
    expect(cssWithoutShowFriendlyClassnames({ color: 'red' }).toString()[0]).toBe('_');
  });

  test('should not escape breakpoint rule when running on the client', () => {
    // on the client, the insertRule api automatically escapes selectors
    // so this test case just makes sure that the breakpoint isn't going to endup
    // escaped twice:
    const fakeEnv = createFakeEnv([]);
    const css = createCss(
      {
        showFriendlyClassnames: true,
        breakpoints: {
          '@mobile': (rule) => `@media(min-width:300px){${rule}}`,
        },
      },
      (fakeEnv as any) as Window
    );
    css({ '@mobile': { color: 'red' } }).toString();

    expect(fakeEnv.document.styleSheets[3].cssRules[0].cssText).toMatchInlineSnapshot(
      `"@media (min-width:300px) {._@mobile_c_fmbjMM {color: red;}}"`
    );
  });

  test('should inject vendor prefix where explicitly stating so', () => {
    const css = createCss(
      {
        showFriendlyClassnames: true,
      },
      null
    );
    const { styles } = css.getStyles(() => {
      // @ts-ignore
      css({ WebkitColor: 'red' }).toString();
      return '';
    });

    expect(styles[2]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_initial_c_vfarC/*X*/{-webkit-color:red;}"
    `);
  });

  test('should use specificity props', () => {
    const css = createCss({}, null);
    expect(String(css({ margin: '1px' }))).toMatchInlineSnapshot(`"_fftfXl _iOZlal _laWIba _iGAIiF"`);
  });

  test('should map CSS Properties to Tokens', () => {
    const css = createCss(
      {
        tokens: {
          space: {
            '1': '5px',
            '2': '10px',
          },
          colors: {
            red500: 'tomato',
            blue500: 'royalblue',
          },
        },
      },
      null
    );
    const { styles } = css.getStyles(() => {
      css({ marginTop: '1' }).toString();
      css({ gap: '2' }).toString();
      css({ outlineColor: 'red500' }).toString();
      return '';
    });

    expect(styles).toMatchInlineSnapshot(`
      Array [
        "/* STITCHES:__variables__ */
      :root{--space-1:5px;--space-2:10px;--colors-red500:tomato;--colors-blue500:royalblue;}",
        "/* STITCHES:__keyframes__ */
      ",
        "/* STITCHES */
      ./*X*/_bKAHZJ/*X*/{outline-color:var(--colors-red500);}
      ./*X*/_gTWOjC/*X*/{row-gap:var(--space-2);}
      ./*X*/_liLbrO/*X*/{column-gap:var(--space-2);}
      ./*X*/_jzEHzw/*X*/{margin-top:var(--space-1);}",
      ]
    `);
  });

  test('should have declarative api', () => {
    const css = createCss({}, null);
    expect(
      css({
        color: 'red',
        backgroundColor: 'blue',
      }).toString()
    ).toMatchInlineSnapshot(`"_htDnsg _vfarC"`);
  });

  test('should handle declarative pseudo selector', () => {
    const fakeEnv = createFakeEnv([], []);
    const css = createCss({}, (fakeEnv as unknown) as Window);
    // @ts-ignore
    css({ '&:hover': { color: 'red' } }).toString();
    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toMatchInlineSnapshot(
      `"._eqYDFT._eqYDFT:hover {color: red;}"`
    );
  });

  test('Should handle ampersand correctly when not targeting pseudo selector', () => {
    const fakeEnv = createFakeEnv([], []);
    const css = createCss({}, (fakeEnv as unknown) as Window);
    // @ts-ignore
    css({ '&.red': { color: 'red' } }).toString();
    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toMatchInlineSnapshot(`"._ldUPST.red {color: red;}"`);
  });

  test('Should handle nesting', () => {
    const fakeEnv = createFakeEnv([], []);
    const css = createCss({}, (fakeEnv as unknown) as Window);
    // @ts-ignore
    css({
      '.red': {
        color: 'red',
        '.potato': {
          backgroundColor: 'red',
          ':hover': {
            backgroundColor: 'green',
          },
        },
      },
    }).toString();
    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toMatchInlineSnapshot(`"._fNDTVr .red {color: red;}"`);
    expect(fakeEnv.document.styleSheets[2].cssRules[1].cssText).toMatchInlineSnapshot(
      `"._KmHaH .red .potato {background-color: red;}"`
    );
    expect(fakeEnv.document.styleSheets[2].cssRules[2].cssText).toMatchInlineSnapshot(
      `"._kpUhua._kpUhua .red .potato:hover {background-color: green;}"`
    );
  });

  test('should handle screen selector', () => {
    const css = createCss(
      {
        breakpoints: {
          mobile: (className) => `@media(min-width:700px){${className}}`,
        },
      },
      null
    );
    const { styles } = css.getStyles(() => {
      css({ mobile: { color: 'red' } }).toString();
      return '';
    });
    // @ts-ignore

    expect(styles.length).toBe(4);
    expect(styles[3].trim()).toMatchInlineSnapshot(`
      "/* STITCHES:mobile */
      @media(min-width:700px){./*X*/_kOddJI/*X*/{color:red;}}"
    `);
  });

  test('should handle pseudo in screen selector', () => {
    const css = createCss(
      {
        breakpoints: {
          mobile: (className) => `@media(min-width:700px){${className}}`,
        },
      },
      null
    );
    const { styles } = css.getStyles(() => {
      // @ts-ignore
      css({ mobile: { '&:hover': { color: 'red' } } }).toString();
      return '';
    });

    expect(styles.length).toBe(4);
    expect(styles[3].trim()).toMatchInlineSnapshot(`
      "/* STITCHES:mobile */
      @media(min-width:700px){./*X*/_cUeUHd/*X*/./*X*/_cUeUHd/*X*/:hover{color:red;}}"
    `);
  });

  test('should insert themes', () => {
    const css = createCss(
      {
        tokens: {
          colors: {
            primary: 'tomato',
          },
        },
      },
      null
    );
    const { styles } = css.getStyles(() => {
      // @ts-ignore
      css({ color: 'primary' }).toString();
      expect(
        css
          .theme({
            colors: {
              primary: 'blue',
            },
          })
          .toString()
      ).toMatchInlineSnapshot(`"theme-0"`);
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[0]).toMatchInlineSnapshot(`
      "/* STITCHES:__variables__ */
      .theme-0{--colors-primary:blue;}
      :root{--colors-primary:tomato;}"
    `);
    expect(styles[2]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jOpFbe/*X*/{color:var(--colors-primary);}"
    `);
  });

  test('should allow nested pseudo', () => {
    const css = createCss({}, null);
    const atom = css({ '&:hover': { '&:disabled': { color: 'red' } } }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_jEsxaZ"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jEsxaZ/*X*/./*X*/_jEsxaZ/*X*/:hover:disabled{color:red;}"
    `);
  });

  test('should handle border specificity', () => {
    const css = createCss({}, null);
    const atom = css({ border: '1px solid red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_hzfgoV _gjJLeZ _gOEYoe _iffwNR _fsNLp _iyDEp _jClUIq _bKudwR _dFXvMo _dICIiI _bxAjFr _itFHCM"`
      );

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_itFHCM/*X*/{border-top-width:1px;}
      ./*X*/_bxAjFr/*X*/{border-right-width:1px;}
      ./*X*/_dICIiI/*X*/{border-bottom-width:1px;}
      ./*X*/_dFXvMo/*X*/{border-left-width:1px;}
      ./*X*/_bKudwR/*X*/{border-top-style:solid;}
      ./*X*/_jClUIq/*X*/{border-right-style:solid;}
      ./*X*/_iyDEp/*X*/{border-bottom-style:solid;}
      ./*X*/_fsNLp/*X*/{border-left-style:solid;}
      ./*X*/_iffwNR/*X*/{border-top-color:red;}
      ./*X*/_gOEYoe/*X*/{border-right-color:red;}
      ./*X*/_gjJLeZ/*X*/{border-bottom-color:red;}
      ./*X*/_hzfgoV/*X*/{border-left-color:red;}"
    `);
  });

  test('should handle border shorthand with tokens', () => {
    const css = createCss(
      {
        tokens: {
          colors: {
            primary: 'tomato',
          },
        },
      },
      null
    );
    const atom = css({ border: '1px solid primary' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_eYsoPR _iInlxp _excfDq _eFAuOV _fsNLp _iyDEp _jClUIq _bKudwR _dFXvMo _dICIiI _bxAjFr _itFHCM"`
      );

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_itFHCM/*X*/{border-top-width:1px;}
      ./*X*/_bxAjFr/*X*/{border-right-width:1px;}
      ./*X*/_dICIiI/*X*/{border-bottom-width:1px;}
      ./*X*/_dFXvMo/*X*/{border-left-width:1px;}
      ./*X*/_bKudwR/*X*/{border-top-style:solid;}
      ./*X*/_jClUIq/*X*/{border-right-style:solid;}
      ./*X*/_iyDEp/*X*/{border-bottom-style:solid;}
      ./*X*/_fsNLp/*X*/{border-left-style:solid;}
      ./*X*/_eFAuOV/*X*/{border-top-color:var(--colors-primary);}
      ./*X*/_excfDq/*X*/{border-right-color:var(--colors-primary);}
      ./*X*/_iInlxp/*X*/{border-bottom-color:var(--colors-primary);}
      ./*X*/_eYsoPR/*X*/{border-left-color:var(--colors-primary);}"
    `);
  });

  test('should handle box shadow with tokens', () => {
    const css = createCss(
      {
        tokens: {
          colors: {
            primary: 'tomato',
          },
        },
      },
      null
    );
    const atom = css({ boxShadow: '1px 1px 1px primary' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_bPfRIA"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_bPfRIA/*X*/{box-shadow:1px 1px 1px var(--colors-primary);}"
    `);
  });

  test('should be able to compose themes', () => {
    const css = createCss(
      {
        tokens: {
          colors: {
            primary: 'tomato',
          },
        },
      },
      null
    );
    const darkTheme = css.theme({
      colors: {
        primary: 'green',
      },
    });
    const atom = css(darkTheme, {
      color: 'primary',
    }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_jOpFbe theme-0"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jOpFbe/*X*/{color:var(--colors-primary);}"
    `);
  });

  test('should generate keyframe atoms', () => {
    const css = createCss({}, null);
    const keyFrame = css.keyframes({
      '0%': { background: 'red' },
      '100%': { background: 'green' },
    }) as any;

    expect(keyFrame._cssRuleString).toMatchInlineSnapshot(
      `"@keyframes keYeiS {0% {background-color: red;}100% {background-color: green;}}"`
    );

    expect(keyFrame.toString()).toMatchInlineSnapshot(`"keYeiS"`);
  });

  test('should support utils inside keyframes', () => {
    const css = createCss(
      {
        utils: {
          mx: (value, config) => ({
            marginLeft: value,
            marginRight: value,
          }),
        },
      },
      null
    );
    const keyFrame = css.keyframes({
      '0%': { mx: '1px' },
      '100%': { mx: '10px' },
    }) as any;

    expect(keyFrame._cssRuleString).toMatchInlineSnapshot(
      `"@keyframes jxILgC {0% {margin-left: 1px;margin-right: 1px;}100% {margin-left: 10px;margin-right: 10px;}}"`
    );

    expect(keyFrame.toString()).toMatchInlineSnapshot(`"jxILgC"`);
  });

  test('should support specificity props inside keyframes', () => {
    const css = createCss({}, null);
    const keyFrame = css.keyframes({
      '0%': { padding: '1px' },
      '100%': { padding: '10px' },
    }) as any;

    expect(keyFrame._cssRuleString).toMatchInlineSnapshot(
      `"@keyframes hOBUdi {0% {padding-top: 1px;padding-right: 1px;padding-bottom: 1px;padding-left: 1px;}100% {padding-top: 10px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px;}}"`
    );

    expect(keyFrame.toString()).toMatchInlineSnapshot(`"hOBUdi"`);
  });

  test('should allow keyframes atom to be used as a direct object value', () => {
    const css = createCss({}, null);
    const keyFrame = css.keyframes({
      '0%': { background: 'red' },
      '100%': { background: 'green' },
    }) as any;
    let atom: any;
    const { styles } = css.getStyles(() => {
      expect(() => (atom = css({ animationName: keyFrame }))).not.toThrow();
      expect(atom.toString()).toMatchInlineSnapshot(`"_lghWLg"`);
      return '';
    });
    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_lghWLg/*X*/{animation-name:keYeiS;}
      @keyframes keYeiS {0% {background-color: red;}100% {background-color: green;}}"
    `);
  });

  test('should inject styles for animations into sheet', () => {
    const css = createCss({}, null);
    const keyFrame = css.keyframes({
      '0%': { background: 'red' },
      '100%': { background: 'green' },
    }) as any;
    const atom = css({ animationName: keyFrame }) as any;
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_lghWLg"`);
      return '';
    });
    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_lghWLg/*X*/{animation-name:keYeiS;}
      @keyframes keYeiS {0% {background-color: red;}100% {background-color: green;}}"
    `);
  });

  test('should handle margin shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ margin: '1px 5px' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_bfdzTx _iOZlal _gIAWea _iGAIiF"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_iGAIiF/*X*/{margin-top:1px;}
      ./*X*/_gIAWea/*X*/{margin-right:5px;}
      ./*X*/_iOZlal/*X*/{margin-bottom:1px;}
      ./*X*/_bfdzTx/*X*/{margin-left:5px;}"
    `);
  });

  test('should handle padding shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ padding: '1px 5px' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_kwBuXq _bprxXq _fPyDox _MMkEy"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_MMkEy/*X*/{padding-top:1px;}
      ./*X*/_fPyDox/*X*/{padding-right:5px;}
      ./*X*/_bprxXq/*X*/{padding-bottom:1px;}
      ./*X*/_kwBuXq/*X*/{padding-left:5px;}"
    `);
  });

  test('should handle gap shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ gap: '1px 5px' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_kAGDsw _hFqUCg"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_hFqUCg/*X*/{row-gap:1px;}
      ./*X*/_kAGDsw/*X*/{column-gap:5px;}"
    `);
  });

  test('should handle border-top shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderTop: '1px solid red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_iffwNR _bKudwR _itFHCM"`);
    });
    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_itFHCM/*X*/{border-top-width:1px;}
      ./*X*/_bKudwR/*X*/{border-top-style:solid;}
      ./*X*/_iffwNR/*X*/{border-top-color:red;}"
    `);
  });

  test('should allow nested inline media queries', () => {
    const css = createCss({}, null);
    const atom = css({
      '@media (hover:hover)': { '@media screen': { color: 'red' } },
    }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_tdSbZ"`);
    });
  });

  test('should handle border-right shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderRight: '1px solid red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_gOEYoe _jClUIq _bxAjFr"`);

      return '';
    });

    expect(styles.length).toBe(3);

    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_bxAjFr/*X*/{border-right-width:1px;}
      ./*X*/_jClUIq/*X*/{border-right-style:solid;}
      ./*X*/_gOEYoe/*X*/{border-right-color:red;}"
    `);
  });

  test('should handle border-bottom shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderBottom: '1px solid red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_gjJLeZ _iyDEp _dICIiI"`);
    });
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_dICIiI/*X*/{border-bottom-width:1px;}
      ./*X*/_iyDEp/*X*/{border-bottom-style:solid;}
      ./*X*/_gjJLeZ/*X*/{border-bottom-color:red;}"
    `);
  });

  test('should allow inline media queries', () => {
    const css = createCss({}, null);
    const atom = css({ '@media (hover:hover)': { color: 'red' } }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_cDQzLB"`);
    });
    expect(styles.length).toBe(3);
    expect(styles[2]).toMatchInlineSnapshot(`
      "/* STITCHES */
      @media (hover:hover){./*X*/_cDQzLB/*X*/{color:red;}}"
    `);
  });

  test('should allow injection of classname', () => {
    const css = createCss({}, null);
    const atom = (css({ 'div:hover &': { color: 'red' } }) as any).atoms[0];

    expect(atom.id).toMatchInlineSnapshot(`"colordiv:hover %initial"`);
    expect(atom.cssHyphenProp).toEqual('color');
    expect(atom.selector).toMatchInlineSnapshot(`"div:hover %"`);
    expect(atom.breakpoint).toMatchInlineSnapshot(`"initial"`);

    const { styles } = css.getStyles(() => {
      atom.toString();
    });
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      div:hover ./*X*/_ckTvUp/*X*/{color:red;}"
    `);
  });

  test('should handle border-left shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderLeft: '1px solid red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_hzfgoV _fsNLp _dFXvMo"`);
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_dFXvMo/*X*/{border-left-width:1px;}
      ./*X*/_fsNLp/*X*/{border-left-style:solid;}
      ./*X*/_hzfgoV/*X*/{border-left-color:red;}"
    `);
  });

  test('should handle border-radius shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderRadius: '5px' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_iTMjWf _iVpQMz _iMdbNo _dWbHjQ"`);
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_dWbHjQ/*X*/{border-bottom-left-radius:5px;}
      ./*X*/_iMdbNo/*X*/{border-top-left-radius:5px;}
      ./*X*/_iVpQMz/*X*/{border-top-right-radius:5px;}
      ./*X*/_iTMjWf/*X*/{border-bottom-right-radius:5px;}"
    `);
  });

  test('should handle border-color shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderColor: 'red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_hzfgoV _gjJLeZ _gOEYoe _iffwNR"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_iffwNR/*X*/{border-top-color:red;}
      ./*X*/_gOEYoe/*X*/{border-right-color:red;}
      ./*X*/_gjJLeZ/*X*/{border-bottom-color:red;}
      ./*X*/_hzfgoV/*X*/{border-left-color:red;}"
    `);
  });

  test('should handle border-style shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderStyle: 'solid' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_fsNLp _iyDEp _jClUIq _bKudwR"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_bKudwR/*X*/{border-top-style:solid;}
      ./*X*/_jClUIq/*X*/{border-right-style:solid;}
      ./*X*/_iyDEp/*X*/{border-bottom-style:solid;}
      ./*X*/_fsNLp/*X*/{border-left-style:solid;}"
    `);
  });

  test('should handle border-width shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderWidth: '2px' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_fsebJj _fNZgtf _gTZsgw _ciQgfb"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_ciQgfb/*X*/{border-top-width:2px;}
      ./*X*/_gTZsgw/*X*/{border-right-width:2px;}
      ./*X*/_fNZgtf/*X*/{border-bottom-width:2px;}
      ./*X*/_fsebJj/*X*/{border-left-width:2px;}"
    `);
  });

  test('should handle background shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ background: 'red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_gwFOTp"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gwFOTp/*X*/{background-color:red;}"
    `);
  });

  test('should handle transition shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ transition: 'margin-right 2s ease-in-out' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_bRbaPK _rNWIB _gqYqQa"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gqYqQa/*X*/{transition-property:margin-right;}
      ./*X*/_rNWIB/*X*/{transition-duration:2s;}
      ./*X*/_bRbaPK/*X*/{transition-timing-function:ease-in-out;}"
    `);
  });

  test('should handle text-decoration shorthand', () => {
    const css = createCss(
      {
        tokens: {
          colors: {
            primary: '#222',
          },
        },
      },
      null
    );
    const atom = css({ textDecoration: 'underline overline primary 2px' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_eUgKqn _jyoroV _fOyFCP"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_fOyFCP/*X*/{text-decoration-line:underline overline;}
      ./*X*/_jyoroV/*X*/{text-decoration-color:var(--colors-primary);}
      ./*X*/_eUgKqn/*X*/{text-decoration-thickness:2px;}"
    `);
  });

  test('should handle font shorthand', () => {
    const css = createCss({}, null);
    const atom = css({
      'example-1': {
        font: '12pt/14pt sans-serif',
      },
      'example-2': {
        font: '80% sans-serif',
      },
      'example-3': {
        font: 'x-large/110% "new century schoolbook", serif',
      },
      'example-4': {
        font: 'bold italic large Palatino, serif',
      },
      'example-5': {
        font: 'normal small-caps 120%/120% fantasy',
      },
      'example-6': {
        font: 'condensed oblique 12pt "Helvetica Neue", serif',
      },
      'example-7': {
        font: 'condensed oblique 25deg 753 12pt "Helvetica Neue", serif',
      },
    }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_jUfuYn _eiOiyq _gQlmwl _ihldFX _hQDTVg _bxTEsS _fyegBv _kZntLz _eCkMWJ _fybAy _akfja _TkcKZ _Jwhwm _fGmbFK _iuQxUH _bYaAxW _dYUIDq _iBNCFy _cHbYPT _dCTgBF _knjcOO _hvBPLR _dbzAGl _ivpoFl _kBawpk"`
      );

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_kBawpk/*X*/ example-1{font-size:12pt;}
      ./*X*/_ivpoFl/*X*/ example-1{line-height:14pt;}
      ./*X*/_dbzAGl/*X*/ example-1{font-family:sans-serif;}
      ./*X*/_hvBPLR/*X*/ example-2{font-size:80%;}
      ./*X*/_knjcOO/*X*/ example-2{font-family:sans-serif;}
      ./*X*/_dCTgBF/*X*/ example-3{font-size:x-large;}
      ./*X*/_cHbYPT/*X*/ example-3{line-height:110%;}
      ./*X*/_iBNCFy/*X*/ example-3{font-family:\\"new century schoolbook\\",serif;}
      ./*X*/_dYUIDq/*X*/ example-4{font-weight:bold;}
      ./*X*/_bYaAxW/*X*/ example-4{font-style:italic;}
      ./*X*/_iuQxUH/*X*/ example-4{font-size:large;}
      ./*X*/_fGmbFK/*X*/ example-4{font-family:Palatino,serif;}
      ./*X*/_Jwhwm/*X*/ example-5{font-variant:small-caps;}
      ./*X*/_TkcKZ/*X*/ example-5{font-size:120%;}
      ./*X*/_akfja/*X*/ example-5{line-height:120%;}
      ./*X*/_fybAy/*X*/ example-5{font-family:fantasy;}
      ./*X*/_eCkMWJ/*X*/ example-6{font-stretch:condensed;}
      ./*X*/_kZntLz/*X*/ example-6{font-style:oblique;}
      ./*X*/_fyegBv/*X*/ example-6{font-size:12pt;}
      ./*X*/_bxTEsS/*X*/ example-6{font-family:\\"Helvetica Neue\\",serif;}
      ./*X*/_hQDTVg/*X*/ example-7{font-stretch:condensed;}
      ./*X*/_ihldFX/*X*/ example-7{font-style:oblique 25deg;}
      ./*X*/_gQlmwl/*X*/ example-7{font-weight:753;}
      ./*X*/_eiOiyq/*X*/ example-7{font-size:12pt;}
      ./*X*/_jUfuYn/*X*/ example-7{font-family:\\"Helvetica Neue\\",serif;}"
    `);
  });

  test('should handle flex shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ flex: '1' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_cHjBal _jBlSGq _itEjDe"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_itEjDe/*X*/{flex-grow:1;}
      ./*X*/_jBlSGq/*X*/{flex-shrink:1;}
      ./*X*/_cHjBal/*X*/{flex-basis:0%;}"
    `);
  });

  test('Should warn about potential specificity issues when an inline responsive atom appears in two different css definitions', () => {
    const css = createCss({}, null);
    const mediaString = '@media (min-width: 700px)';
    // tslint:disable-next-line
    console.warn = jest.fn();
    const firstDef = css({
      [mediaString]: { color: 'red' },
    }).toString();

    const secondDef = css({
      [mediaString]: { color: 'red' },
    }).toString();
    // tslint:disable-next-line
    expect(console.warn).toHaveBeenCalledWith(
      `The property "color" with media query ${mediaString} can cause a specificity issue. You should create a breakpoint`
    );
  });

  test('should inject inline media queries after normal rules', () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      css({
        color: 'red',
        '@media (min-width: 700px)': { color: 'red' },
        backgroundColor: 'blue',
      }).toString();
      css({
        color: 'green',
        '@media (min-width: 200px)': { color: 'red' },
        backgroundColor: 'yello',
      }).toString();
      return '';
    });

    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_cazTGi/*X*/{color:green;}
      ./*X*/_kWEtBh/*X*/{background-color:yello;}
      ./*X*/_vfarC/*X*/{color:red;}
      ./*X*/_htDnsg/*X*/{background-color:blue;}
      @media (min-width: 700px){./*X*/_gaorMP/*X*/{color:red;}}
      @media (min-width: 200px){./*X*/_bZjnQC/*X*/{color:red;}}"
    `);
  });

  test('should inject inline media queries after normal rules inside breakpoints', () => {
    const css = createCss(
      {
        breakpoints: {
          large: (rule) => `@media(min-width: 300px){${rule}}`,
        },
      },
      null
    );
    const { styles } = css.getStyles(() => {
      css({
        large: {
          color: 'blue',
          '@supports (color: red)': {
            color: 'red',
          },
        },
      }).toString();
      return '';
    });

    expect(styles[3].trim()).toMatchInlineSnapshot(`
      "/* STITCHES:large */
      @media(min-width: 300px){./*X*/_kjtUTA/*X*/{color:blue;}}
      @media(min-width: 300px){@supports (color: red){./*X*/_hYsiEc/*X*/{color:red;}}}"
    `);
  });

  test('should inject pseudo selectors with increased specificity', () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      css({
        // &&
        ':hover': {
          color: 'red',
        },
        // &&&
        ':active': {
          color: 'red',
        },
        // &&&&
        ':focus': {
          color: 'red',
        },
        // &&&&
        ':focus-visible': {
          color: 'red',
        },
        // &&&&&
        ':read-only': {
          color: 'red',
        },
        // &&&&&&
        ':disabled': {
          color: 'red',
        },
      }).toString();
      return '';
    });

    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_eqYDFT/*X*/./*X*/_eqYDFT/*X*/:hover{color:red;}
      ./*X*/_bvXVSg/*X*/./*X*/_bvXVSg/*X*/./*X*/_bvXVSg/*X*/:active{color:red;}
      ./*X*/_dkIcjV/*X*/./*X*/_dkIcjV/*X*/./*X*/_dkIcjV/*X*/./*X*/_dkIcjV/*X*/:focus{color:red;}
      ./*X*/_bqjfTS/*X*/./*X*/_bqjfTS/*X*/./*X*/_bqjfTS/*X*/./*X*/_bqjfTS/*X*/:focus-visible{color:red;}
      ./*X*/_fmOyoP/*X*/./*X*/_fmOyoP/*X*/./*X*/_fmOyoP/*X*/./*X*/_fmOyoP/*X*/./*X*/_fmOyoP/*X*/:read-only{color:red;}
      ./*X*/_bANtAh/*X*/./*X*/_bANtAh/*X*/./*X*/_bANtAh/*X*/./*X*/_bANtAh/*X*/./*X*/_bANtAh/*X*/./*X*/_bANtAh/*X*/:disabled{color:red;}"
    `);
  });

  test('Should omit undefined css values', () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      css({
        backgroundColor: undefined,
        color: 'red',
      }).toString();
      return '';
    });

    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_vfarC/*X*/{color:red;}"
    `);
  });

  test('should handle global styles', () => {
    const css = createCss({}, null);

    const global = css.global({
      '@media (min-width: 700px)': {
        div: {
          color: 'red',
          backgroundColor: 'white',
          paddingLeft: '10px',
        },
      },
    });

    const { styles } = css.getStyles(() => {
      global();
      return '';
    });

    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      @media (min-width: 700px){ div{padding-left:10px;}}
      @media (min-width: 700px){ div{background-color:white;}}
      @media (min-width: 700px){ div{color:red;}}"
    `);
  });

  test('should not re-inject global styles', () => {
    const css = createCss({}, null);
    const global1 = css.global({
      '@media (min-width: 700px)': { div: { color: 'red' } },
    });
    const global2 = css.global({
      '@media (min-width: 700px)': { div: { color: 'red' } },
    });
    const { styles } = css.getStyles(() => {
      global1();
      global2();
      return '';
    });

    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      @media (min-width: 700px){ div{color:red;}}"
    `);
  });

  test('should error when styles are passed without a selector', () => {
    const css = createCss({}, null);
    expect(() => {
      css.global({
        background: 'red',
      });
    }).toThrow();
  });

  test("Should append px to numbers if they're not unitless", () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      css({
        lineHeight: 1,
        marginLeft: 1,
        fontSize: 1,
      }).toString();
      return '';
    });

    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_cqPkSJ/*X*/{line-height:1;}
      ./*X*/_fftfXl/*X*/{margin-left:1px;}
      ./*X*/_kxWgGC/*X*/{font-size:1px;}"
    `);
  });
  test('Should append px to numbers in shorthands', () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      css({
        margin: 1,
      }).toString();
      return '';
    });

    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_iGAIiF/*X*/{margin-top:1px;}
      ./*X*/_laWIba/*X*/{margin-right:1px;}
      ./*X*/_iOZlal/*X*/{margin-bottom:1px;}
      ./*X*/_fftfXl/*X*/{margin-left:1px;}"
    `);
  });

  test('Numbers should not map to tokens', () => {
    const css = createCss(
      {
        tokens: {
          space: {
            1: '10px',
          },
        },
      },
      null
    );
    const { styles } = css.getStyles(() => {
      css({
        margin: 1,
        padding: '1',
      }).toString();
      return '';
    });

    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_iGAIiF/*X*/{margin-top:1px;}
      ./*X*/_laWIba/*X*/{margin-right:1px;}
      ./*X*/_iOZlal/*X*/{margin-bottom:1px;}
      ./*X*/_fftfXl/*X*/{margin-left:1px;}
      ./*X*/_iPHVKv/*X*/{padding-top:var(--space-1);}
      ./*X*/_kmGPJs/*X*/{padding-right:var(--space-1);}
      ./*X*/_exWIYj/*X*/{padding-bottom:var(--space-1);}
      ./*X*/_fYlBIn/*X*/{padding-left:var(--space-1);}"
    `);
  });

  test('Nesting config breakpoints into each other uses the deepest one for the rule', () => {
    const css = createCss(
      {
        breakpoints: {
          breakpointOne: (rule) => `@media(min-width:400px){${rule}}`,
          breakpointTwo: (rule) => `@media(min-width:800px){${rule}}`,
        },
      },
      null
    );
    const { styles } = css.getStyles(() => {
      css({
        breakpointOne: {
          color: 'red',
          breakpointTwo: {
            color: 'blue',
          },
        },
      }).toString();
      return '';
    });

    expect(styles[3]).toMatchInlineSnapshot(`
      "/* STITCHES:breakpointOne */
      @media(min-width:400px){./*X*/_kuSiuj/*X*/{color:red;}}"
    `);

    expect(styles[4]).toMatchInlineSnapshot(`
      "/* STITCHES:breakpointTwo */
      @media(min-width:800px){./*X*/_bHfEuS/*X*/{color:blue;}}"
    `);
  });
});

describe('strict mode', () => {
  test('should not yield type errors when raw values are used even though tokens are defined', () => {
    const css = createCss({
      tokens: {
        colors: {
          primary: 'red',
        },
      },
    });
    css({
      color: 'lime',
    });
  });

  test('should yield type errors in strict mode when tokens are defined but raw values are used', () => {
    const css = createCss({
      strict: true,
      tokens: {
        colors: {
          primary: 'red',
        },
      },
    });
    css({
      color: 'primary',
      // @ts-expect-error
      backgroundColor: 'red',
    });
  });

  test('should not yield type errors when a token category is missing', () => {
    const css = createCss({
      strict: true,
      tokens: {
        radii: {
          tiny: '3px',
        },
      },
    });
    css({
      borderRadius: 'tiny',
      color: 'lime', // allowed since no color tokens are defined
    });
  });

  test("should generate the correct rule for a comma separated rule that isn't nested", () => {
    const css = createCss({}, null);
    const atom = css({ '.a,.b': { color: 'red' } }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_fbcevw"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_fbcevw/*X*/ .a,./*X*/_fbcevw/*X*/ .b{color:red;}"
    `);
  });

  test("should generate the correct rule for a comma separated rule that isn't nested and handle ampersand", () => {
    const css = createCss({}, null);
    const atom = css({ '&.a,&.b': { color: 'red' } }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_cfhXDM"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_cfhXDM/*X*/.a,./*X*/_cfhXDM/*X*/.b{color:red;}"
    `);
  });

  test('should handle deeply nested comma based rules by generating all possible combinations as a single rule', () => {
    const css = createCss({}, null);
    const atom = css({
      '.one': {
        ' .a, .b': { '.c, .d': { color: 'blue' } },
      },
    }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_cMlZFy"`);
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_cMlZFy/*X*/ .one .a .c,./*X*/_cMlZFy/*X*/ .one .b .c,./*X*/_cMlZFy/*X*/ .one .a .d,./*X*/_cMlZFy/*X*/ .one .b .d{color:blue;}"
    `);
  });

  test('should allow comma separated rules', () => {
    const css = createCss({}, null);
    const atom = css({ '&.parent': { '.a, &.b': { color: 'red' } } }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_jOZzkI"`);

      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jOZzkI/*X*/.parent .a, ./*X*/_jOZzkI/*X*/.parent.b{color:red;}"
    `);
  });

  test('Should handle nested ampersand correctly', () => {
    const css = createCss({}, null);
    const atom = css({
      '.one:hover': {
        '&.two': {
          backgroundColor: 'pink',
        },
      },

      div: {
        h1: {
          '.wow &': {
            color: 'black',
          },
        },
      },
    }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_eLiTcV _dDvPWD"`);
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_dDvPWD/*X*/./*X*/_dDvPWD/*X*/ .one:hover.two{background-color:pink;}
      .wow ./*X*/_eLiTcV/*X*/ div h1{color:black;}"
    `);
  });
});
