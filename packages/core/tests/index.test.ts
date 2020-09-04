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

describe('createCss', () => {
  test('should create simple atoms', () => {
    const css = createCss({}, null);
    const atoms = css({ color: 'red' }) as any;
    const atom = atoms.atoms[0];
    expect(atom.id).toMatchInlineSnapshot(`"colorinitial"`);
    expect(atom.cssHyphenProp).toEqual('color');
    expect(atom.selector).toBe('');
    expect(atom.breakpoint).toMatchInlineSnapshot(`"initial"`);
    expect(atom.value).toMatchInlineSnapshot(`"red"`);

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_dzoaVP"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_dzoaVP/*X*/{color:red;}"
    `);
  });

  test('should regenerate styles on ssr', () => {
    const css = createCss({ tokens: { colors: { red100: 'red' } } }, null);
    // tslint:disable-next-line
    console.log = jest.fn();
    const keyframe = css.keyframes({
      from: { backgroundColor: 'red' },
      to: { backgroundColor: 'blue' },
    });
    const atoms = css({ color: 'red100', animationName: keyframe }) as any;
    const atom = atoms.atoms[0];

    const { styles } = css.getStyles(() => {
      atoms.toString();
    });

    const { styles: secondStyles } = css.getStyles(() => {
      atoms.toString();
    });
    expect(styles).toMatchInlineSnapshot(`
      Array [
        "/* STITCHES:__variables__ */
      :root{--colors-red100:red;}",
        "/* STITCHES */
      ./*X*/_eaTrZx/*X*/{color:var(--colors-red100);}
      ./*X*/_dwsMDu/*X*/{animation-name:ftEIjK;}
      @keyframes ftEIjK {from {background-color: red;}to {background-color: blue;}",
      ]
    `);
    expect(secondStyles).toMatchInlineSnapshot(`
      Array [
        "/* STITCHES:__variables__ */
      :root{--colors-red100:red;}",
        "/* STITCHES */
      ./*X*/_eaTrZx/*X*/{color:var(--colors-red100);}
      ./*X*/_dwsMDu/*X*/{animation-name:ftEIjK;}
      @keyframes ftEIjK {from {background-color: red;}to {background-color: blue;}",
      ]
    `);
    expect(styles).toEqual(secondStyles);
  });

  test('should compose atoms', () => {
    const css = createCss({}, null);
    expect(css({ color: 'red', backgroundColor: 'blue' }).toString()).toMatchInlineSnapshot(`"_YfjLh _dzoaVP"`);
  });
  test('should create tokens', () => {
    const tokens = createTokens({
      colors: {
        RED: 'tomato',
      },
    });
    const css = createCss({ tokens }, null);
    const atom = (css({ color: 'RED' }) as any).atoms[0];

    expect(atom.id).toMatchInlineSnapshot(`"colorinitial"`);
    expect(atom.cssHyphenProp).toEqual('color');
    expect(atom.selector).toBe('');
    expect(atom.breakpoint).toMatchInlineSnapshot(`"initial"`);
    expect(atom.value).toMatchInlineSnapshot(`"var(--colors-RED)"`);

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_oNvzU"`);
      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_oNvzU/*X*/{color:var(--colors-RED);}"
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
      expect(atom.toString()).toMatchInlineSnapshot(`"_gYxOEA"`);
      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gYxOEA/*X*/{color:var(--colors-red);}"
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

    expect(styles.length).toBe(2);
    expect(styles[0]).toMatchInlineSnapshot(`
      "/* STITCHES:__variables__ */
      .theme-0{--colors-red:red;}
      :root{--colors-red:tomato;}"
    `);
    expect(styles[1]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gYxOEA/*X*/{color:var(--colors-red);}"
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

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_esPDyf/*X*/{margin-left:calc(var(--space-1) * -1);}
      ./*X*/_dWjnQp/*X*/{letter-spacing:calc(var(--letterSpacings-1) * -1);}
      ./*X*/_gTiRnv/*X*/{width:calc(var(--sizes-1) * -1);}
      ./*X*/_dbupHX/*X*/{z-index:calc(var(--zIndices-1) * -1);}"
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
    expect(atom.id).toMatchInlineSnapshot(`"colortablet"`);
    expect(atom.cssHyphenProp).toEqual('color');
    expect(atom.selector).toBe('');
    expect(atom.breakpoint).toMatchInlineSnapshot(`"tablet"`);
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_hsxGAz"`);
      return '';
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES:tablet */
      @media (min-width: 700px) { ./*X*/_hsxGAz/*X*/{color:red;} }"
    `);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES:tablet */
      @media (min-width: 700px) { ./*X*/_hsxGAz/*X*/{color:red;} }"
    `);
  });
  test('should handle pseudos', () => {
    const css = createCss({}, null);
    const atom = (css({ '&:hover': { color: 'red' } }) as any).atoms[0];

    expect(atom.id).toMatchInlineSnapshot(`"color:hoverinitial"`);
    expect(atom.cssHyphenProp).toEqual('color');
    expect(atom.selector).toMatchInlineSnapshot(`"&&:hover"`);
    expect(atom.breakpoint).toMatchInlineSnapshot(`"initial"`);
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_hXHHYX"`);
      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_hXHHYX/*X*/./*X*/_hXHHYX/*X*/:hover{color:red;}"
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
    ).toMatchInlineSnapshot(`"_loCpsM _dzoaVP"`);
  });
  test('should insert rule only once', () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      expect(css({ color: 'red' }).toString()).toMatchInlineSnapshot(`"_dzoaVP"`);
      expect(css({ color: 'red' }).toString()).toMatchInlineSnapshot(`"_dzoaVP"`);
      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_dzoaVP/*X*/{color:red;}"
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
    expect(fakeEnv.document.styleSheets.length).toBe(3);
    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toMatchInlineSnapshot(
      `"@media (min-width: 700px) {._hsxGAz {color: red;}}"`
    );
  });
  test('should allow utils', () => {
    const css = createCss(
      {
        utils: {
          marginX: () => (value: string) => ({
            marginLeft: value,
            marginRight: value,
          }),
        },
      },
      null
    );
    expect(css({ marginX: '1rem' }).toString()).toMatchInlineSnapshot(`"_fgMgZN _ijwQpS"`);
  });

  test('should allow utils that resolve into nested structures', () => {
    const css = createCss(
      {
        utils: {
          hover: () => (value) => ({
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
      expect(atom.toString()).toMatchInlineSnapshot(`"_hoOxCl _fTflhf"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_fTflhf/*X*/./*X*/_fTflhf/*X*/:hover{color:green;}
      ./*X*/_hoOxCl/*X*/./*X*/_hoOxCl/*X*/./*X*/_hoOxCl/*X*/./*X*/_hoOxCl/*X*/:focus{color:green;}"
    `);
  });

  test('should ignore undefined atoms', () => {
    const css = createCss({}, null);

    expect(
      // @ts-ignore
      String(css(undefined, null, false, '', { color: 'red' }))
    ).toMatchInlineSnapshot(`"_dzoaVP"`);
  });
  test('should allow empty compose call', () => {
    const css = createCss({}, null);
    expect(String(css())).toBe('');
  });
  test('should allow conditional compositions', () => {
    const css = createCss({}, null);
    expect(String(css((false as any) && { color: 'red' }))).toBe('');
    expect(String(css(true && { color: 'red' }))).toMatchInlineSnapshot(`"_dzoaVP"`);
  });
  test('should allow prefixes', () => {
    const css = createCss(
      {
        prefix: 'foo',
      },
      null
    );
    expect(String(css({ color: 'red' }))).toMatchInlineSnapshot(`"foo_dzoaVP"`);
  });
  test('should expose override with utility first', () => {
    const css = createCss(
      {
        utilityFirst: true,
        breakpoints: {
          mobile: () => '',
        },
      },
      null
    );
    expect(String(css({ override: { color: 'red' } }))).toMatchInlineSnapshot(`"_dzoaVP"`);
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
    expect(fakeEnv.document.styleSheets.length).toBe(2);
    expect(fakeEnv.document.styleSheets[1].cssRules.length).toBe(1);
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toMatchInlineSnapshot(`"._dzoaVP {color: red;}"`);
    // On the client it will rerun the logic (React hydrate etc.)
    clientCss({ color: 'red' }).toString();
    // Then we add something new
    clientCss({ color: 'blue' }).toString();
    // Lets see if it continues on the correct sequence
    expect(fakeEnv.document.styleSheets[1].cssRules.length).toBe(2);
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toMatchInlineSnapshot(`"._iTsdWi {color: blue;}"`);
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

    expect(styles[1]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_initial_bc_bieopk/*X*/{background-color:red;}
      ./*X*/_initial_c_dzoaVP/*X*/{color:red;}"
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
      expect(cleanClass).toMatchInlineSnapshot(`"_@mobile_c_jWtRMJ"`);
      return '';
    });
    // make sure that the injected rules are escaped:
    expect(styles[2]).toMatchInlineSnapshot(`
      "/* STITCHES:@mobile */
      @media(min-width:300px){./*X*/_\\\\@mobile_c_jWtRMJ/*X*/{color:red;}}"
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

    expect(fakeEnv.document.styleSheets.length).toBe(3);
    expect(fakeEnv.document.styleSheets[2].cssRules.length).toBe(1);
    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toMatchInlineSnapshot(
      `"@media (min-width:300px) {._\\\\@mobile_c_jWtRMJ {color: red;}}"`
    );
    clientCss({ '@mobile': { color: 'red' } }).toString();
    clientCss({ '@mobile': { color: 'blue' } }).toString();
    clientCss({ color: 'blue' }).toString();
    expect(fakeEnv.document.styleSheets[2].cssRules.length).toBe(2);
    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toMatchInlineSnapshot(
      `"@media (min-width:300px) {._@mobile_c_cxoytQ {color: blue;}}"`
    );
    // this rule was hydrated and cleaned from the server:
    expect(fakeEnv.document.styleSheets[2].cssRules[1].cssText).toMatchInlineSnapshot(
      `"@media (min-width:300px) {._\\\\@mobile_c_jWtRMJ {color: red;}}"`
    );
    // this new one wasn'tjkkk
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

    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toMatchInlineSnapshot(
      `"@media (min-width:300px) {._@mobile_c_jWtRMJ {color: red;}}"`
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

    expect(styles[1]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_initial_c_dzoaVP/*X*/{-webkit-color:red;}"
    `);
  });
  test('should use specificity props', () => {
    const css = createCss({}, null);
    expect(String(css({ margin: '1px' }))).toMatchInlineSnapshot(`"_hXUSyk _bZYdQM _cTIqvn _kYSwIs"`);
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
        "/* STITCHES */
      ./*X*/_fVszNU/*X*/{outline-color:var(--colors-red500);}
      ./*X*/_hyxNOI/*X*/{gap:var(--space-2);}
      ./*X*/_bpzGvB/*X*/{margin-top:var(--space-1);}",
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
    ).toMatchInlineSnapshot(`"_YfjLh _dzoaVP"`);
  });
  test('should handle declarative pseudo selector', () => {
    const fakeEnv = createFakeEnv([], []);
    const css = createCss({}, (fakeEnv as unknown) as Window);
    // @ts-ignore
    css({ '&:hover': { color: 'red' } }).toString();
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toMatchInlineSnapshot(
      `"._hXHHYX._hXHHYX:hover {color: red;}"`
    );
  });

  test('Should handle ampersand correctly when not targeting pseudo selector', () => {
    const fakeEnv = createFakeEnv([], []);
    const css = createCss({}, (fakeEnv as unknown) as Window);
    // @ts-ignore
    css({ '&.red': { color: 'red' } }).toString();
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toMatchInlineSnapshot(`"._jOAMao.red {color: red;}"`);
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
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toMatchInlineSnapshot(`"._kTghTu .red {color: red;}"`);
    expect(fakeEnv.document.styleSheets[1].cssRules[1].cssText).toMatchInlineSnapshot(
      `"._dhhpqe .red .potato {background-color: red;}"`
    );
    expect(fakeEnv.document.styleSheets[1].cssRules[2].cssText).toMatchInlineSnapshot(
      `"._lftrMy._lftrMy .red .potato:hover {background-color: green;}"`
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

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES:mobile */
      @media(min-width:700px){./*X*/_fOxLwJ/*X*/{color:red;}}"
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

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES:mobile */
      @media(min-width:700px){./*X*/_coXxUV/*X*/./*X*/_coXxUV/*X*/:hover{color:red;}}"
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

    expect(styles.length).toBe(2);
    expect(styles[0]).toMatchInlineSnapshot(`
      "/* STITCHES:__variables__ */
      .theme-0{--colors-primary:blue;}
      :root{--colors-primary:tomato;}"
    `);
    expect(styles[1]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gknCVb/*X*/{color:var(--colors-primary);}"
    `);
  });
  test('should allow nested pseudo', () => {
    const css = createCss({}, null);
    const atom = css({ '&:hover': { '&:disabled': { color: 'red' } } }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_bePnWZ"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_bePnWZ/*X*/./*X*/_bePnWZ/*X*/:hover:disabled{color:red;}"
    `);
  });
  test('should handle border specificity', () => {
    const css = createCss({}, null);
    const atom = css({ border: '1px solid red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_kiEsJg _lgRogE _fWbRyP _iLiCSc _lyLPc _hiyybE _bGUEHj _kROsiw _gonZcB _ckYojt _fZMTUa _gQTUlh"`
      );

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gQTUlh/*X*/{border-top-width:1px;}
      ./*X*/_fZMTUa/*X*/{border-right-width:1px;}
      ./*X*/_ckYojt/*X*/{border-bottom-width:1px;}
      ./*X*/_gonZcB/*X*/{border-left-width:1px;}
      ./*X*/_kROsiw/*X*/{border-top-style:solid;}
      ./*X*/_bGUEHj/*X*/{border-right-style:solid;}
      ./*X*/_hiyybE/*X*/{border-bottom-style:solid;}
      ./*X*/_lyLPc/*X*/{border-left-style:solid;}
      ./*X*/_iLiCSc/*X*/{border-top-color:red;}
      ./*X*/_fWbRyP/*X*/{border-right-color:red;}
      ./*X*/_lgRogE/*X*/{border-bottom-color:red;}
      ./*X*/_kiEsJg/*X*/{border-left-color:red;}"
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
        `"_fSAUek _dNVNzk _crCEGH _cYwVAs _lyLPc _hiyybE _bGUEHj _kROsiw _gonZcB _ckYojt _fZMTUa _gQTUlh"`
      );

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gQTUlh/*X*/{border-top-width:1px;}
      ./*X*/_fZMTUa/*X*/{border-right-width:1px;}
      ./*X*/_ckYojt/*X*/{border-bottom-width:1px;}
      ./*X*/_gonZcB/*X*/{border-left-width:1px;}
      ./*X*/_kROsiw/*X*/{border-top-style:solid;}
      ./*X*/_bGUEHj/*X*/{border-right-style:solid;}
      ./*X*/_hiyybE/*X*/{border-bottom-style:solid;}
      ./*X*/_lyLPc/*X*/{border-left-style:solid;}
      ./*X*/_cYwVAs/*X*/{border-top-color:var(--colors-primary);}
      ./*X*/_crCEGH/*X*/{border-right-color:var(--colors-primary);}
      ./*X*/_dNVNzk/*X*/{border-bottom-color:var(--colors-primary);}
      ./*X*/_fSAUek/*X*/{border-left-color:var(--colors-primary);}"
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
      expect(atom.toString()).toMatchInlineSnapshot(`"_jUMaLt"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1]).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jUMaLt/*X*/{box-shadow:1px 1px 1px var(--colors-primary);}"
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
      expect(atom.toString()).toMatchInlineSnapshot(`"_gknCVb theme-0"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gknCVb/*X*/{color:var(--colors-primary);}"
    `);
  });

  test('should generate keyframe atoms', () => {
    const css = createCss({}, null);
    const keyFrame = css.keyframes({
      '0%': { background: 'red' },
      '100%': { background: 'green' },
    }) as any;

    expect(keyFrame._cssRuleString).toBe(
      '@keyframes dmyJCr {0% {background-color: red;}100% {background-color: green;}'
    );

    expect(keyFrame.toString()).toMatchInlineSnapshot(`"dmyJCr"`);
  });

  test('should support utils inside keyframes', () => {
    const css = createCss(
      {
        utils: {
          mx: (config) => (value) => ({
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

    expect(keyFrame._cssRuleString).toBe(
      '@keyframes bFeLcH {0% {margin-left: 1px;margin-right: 1px;}100% {margin-left: 10px;margin-right: 10px;}'
    );

    expect(keyFrame.toString()).toMatchInlineSnapshot(`"bFeLcH"`);
  });

  test('should support specificity props inside keyframes', () => {
    const css = createCss({}, null);
    const keyFrame = css.keyframes({
      '0%': { padding: '1px' },
      '100%': { padding: '10px' },
    }) as any;

    expect(keyFrame._cssRuleString).toMatchInlineSnapshot(
      `"@keyframes bivLJn {0% {padding-top: 1px;padding-right: 1px;padding-bottom: 1px;padding-left: 1px;}100% {padding-top: 10px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px;}"`
    );

    expect(keyFrame.toString()).toMatchInlineSnapshot(`"bivLJn"`);
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
      expect(atom.toString()).toMatchInlineSnapshot(`"_gDSlRG"`);
      return '';
    });
    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gDSlRG/*X*/{animation-name:dmyJCr;}
      @keyframes dmyJCr {0% {background-color: red;}100% {background-color: green;}"
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
      expect(atom.toString()).toMatchInlineSnapshot(`"_gDSlRG"`);
      return '';
    });
    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gDSlRG/*X*/{animation-name:dmyJCr;}
      @keyframes dmyJCr {0% {background-color: red;}100% {background-color: green;}"
    `);
  });
  test('should handle margin shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ margin: '1px 5px' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_hhGSUw _bZYdQM _gtgAOv _kYSwIs"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_kYSwIs/*X*/{margin-top:1px;}
      ./*X*/_gtgAOv/*X*/{margin-right:5px;}
      ./*X*/_bZYdQM/*X*/{margin-bottom:1px;}
      ./*X*/_hhGSUw/*X*/{margin-left:5px;}"
    `);
  });

  test('should handle padding shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ padding: '1px 5px' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_grPRDT _eossbD _iuxmks _jCapLb"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jCapLb/*X*/{padding-top:1px;}
      ./*X*/_iuxmks/*X*/{padding-right:5px;}
      ./*X*/_eossbD/*X*/{padding-bottom:1px;}
      ./*X*/_grPRDT/*X*/{padding-left:5px;}"
    `);
  });

  test('should handle border-top shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderTop: '1px solid red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_iLiCSc _kROsiw _gQTUlh"`);
    });
    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gQTUlh/*X*/{border-top-width:1px;}
      ./*X*/_kROsiw/*X*/{border-top-style:solid;}
      ./*X*/_iLiCSc/*X*/{border-top-color:red;}"
    `);
  });

  test('should allow nested inline media queries', () => {
    const css = createCss({}, null);
    const atom = css({
      '@media (hover:hover)': { '@media screen': { color: 'red' } },
    }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_ieRCSY"`);
    });
  });

  test('should handle border-right shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderRight: '1px solid red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_fWbRyP _bGUEHj _fZMTUa"`);

      return '';
    });

    expect(styles.length).toBe(2);

    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_fZMTUa/*X*/{border-right-width:1px;}
      ./*X*/_bGUEHj/*X*/{border-right-style:solid;}
      ./*X*/_fWbRyP/*X*/{border-right-color:red;}"
    `);
  });
  test('should handle border-bottom shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderBottom: '1px solid red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_lgRogE _hiyybE _ckYojt"`);
    });
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_ckYojt/*X*/{border-bottom-width:1px;}
      ./*X*/_hiyybE/*X*/{border-bottom-style:solid;}
      ./*X*/_lgRogE/*X*/{border-bottom-color:red;}"
    `);
  });
  test('should allow inline media queries', () => {
    const css = createCss({}, null);
    const atom = css({ '@media (hover:hover)': { color: 'red' } }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_eIxNzM"`);
    });
    expect(styles.length).toBe(2);
    expect(styles[1]).toMatchInlineSnapshot(`
      "/* STITCHES */
      @media (hover:hover){./*X*/_eIxNzM/*X*/{color:red;}}"
    `);
  });

  test('should allow injection of classname', () => {
    const css = createCss({}, null);
    const atom = (css({ 'div:hover &': { color: 'red' } }) as any).atoms[0];

    expect(atom.id).toMatchInlineSnapshot(`"color div:hover &initial"`);
    expect(atom.cssHyphenProp).toEqual('color');
    expect(atom.selector).toMatchInlineSnapshot(`" div:hover &"`);
    expect(atom.breakpoint).toMatchInlineSnapshot(`"initial"`);

    const { styles } = css.getStyles(() => {
      atom.toString();
    });
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
       div:hover ./*X*/_fSJjjq/*X*/{color:red;}"
    `);
  });

  test('should handle border-left shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderLeft: '1px solid red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_kiEsJg _lyLPc _gonZcB"`);
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_gonZcB/*X*/{border-left-width:1px;}
      ./*X*/_lyLPc/*X*/{border-left-style:solid;}
      ./*X*/_kiEsJg/*X*/{border-left-color:red;}"
    `);
  });
  test('should handle border-radius shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderRadius: '5px' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_hniQLS _fJjMAS _jwQcuF _jVkGRV"`);
      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jVkGRV/*X*/{border-bottom-left-radius:5px;}
      ./*X*/_jwQcuF/*X*/{border-top-left-radius:5px;}
      ./*X*/_fJjMAS/*X*/{border-top-right-radius:5px;}
      ./*X*/_hniQLS/*X*/{border-bottom-right-radius:5px;}"
    `);
  });

  test('should handle border-color shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderColor: 'red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_kiEsJg _lgRogE _fWbRyP _iLiCSc"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_iLiCSc/*X*/{border-top-color:red;}
      ./*X*/_fWbRyP/*X*/{border-right-color:red;}
      ./*X*/_lgRogE/*X*/{border-bottom-color:red;}
      ./*X*/_kiEsJg/*X*/{border-left-color:red;}"
    `);
  });

  test('should handle border-style shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderStyle: 'solid' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_lyLPc _hiyybE _bGUEHj _kROsiw"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_kROsiw/*X*/{border-top-style:solid;}
      ./*X*/_bGUEHj/*X*/{border-right-style:solid;}
      ./*X*/_hiyybE/*X*/{border-bottom-style:solid;}
      ./*X*/_lyLPc/*X*/{border-left-style:solid;}"
    `);
  });

  test('should handle border-width shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ borderWidth: '2px' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_khlBMi _czVPNi _hYbLMd _jfTurm"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jfTurm/*X*/{border-top-width:2px;}
      ./*X*/_hYbLMd/*X*/{border-right-width:2px;}
      ./*X*/_czVPNi/*X*/{border-bottom-width:2px;}
      ./*X*/_khlBMi/*X*/{border-left-width:2px;}"
    `);
  });

  test('should handle background shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ background: 'red' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_bieopk"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_bieopk/*X*/{background-color:red;}"
    `);
  });

  test('should handle transition shorthand', () => {
    const css = createCss({}, null);
    const atom = css({ transition: 'margin-right 2s ease-in-out' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_bqUgFr _dSdgMo _guSrvz"`);

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_guSrvz/*X*/{transition-property:margin-right;}
      ./*X*/_dSdgMo/*X*/{transition-duration:2s;}
      ./*X*/_bqUgFr/*X*/{transition-timing-function:ease-in-out;}"
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
        `"_evtXhu _kLdlRP _gGNwiM _jJGKqi _ddGabZ _ekzqCb _fSDMVi _ljWgwq _jfSqew _bAQCzH _efCFJv _eMIkUU _ibSieH _fxdrSf _bSnMBq _bjFYEb _iyzbHn _defIGb _dBAIKu _kFHhBs _jKRvhX _jZzWgc _bJWoRY _bByFok _jftlLF"`
      );

      return '';
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jftlLF/*X*/ example-1{font-size:12pt;}
      ./*X*/_bByFok/*X*/ example-1{line-height:14pt;}
      ./*X*/_bJWoRY/*X*/ example-1{font-family:sans-serif;}
      ./*X*/_jZzWgc/*X*/ example-2{font-size:80%;}
      ./*X*/_jKRvhX/*X*/ example-2{font-family:sans-serif;}
      ./*X*/_kFHhBs/*X*/ example-3{font-size:x-large;}
      ./*X*/_dBAIKu/*X*/ example-3{line-height:110%;}
      ./*X*/_defIGb/*X*/ example-3{font-family:\\"new century schoolbook\\",serif;}
      ./*X*/_iyzbHn/*X*/ example-4{font-weight:bold;}
      ./*X*/_bjFYEb/*X*/ example-4{font-style:italic;}
      ./*X*/_bSnMBq/*X*/ example-4{font-size:large;}
      ./*X*/_fxdrSf/*X*/ example-4{font-family:Palatino,serif;}
      ./*X*/_ibSieH/*X*/ example-5{font-variant:small-caps;}
      ./*X*/_eMIkUU/*X*/ example-5{font-size:120%;}
      ./*X*/_efCFJv/*X*/ example-5{line-height:120%;}
      ./*X*/_bAQCzH/*X*/ example-5{font-family:fantasy;}
      ./*X*/_jfSqew/*X*/ example-6{font-stretch:condensed;}
      ./*X*/_ljWgwq/*X*/ example-6{font-style:oblique;}
      ./*X*/_fSDMVi/*X*/ example-6{font-size:12pt;}
      ./*X*/_ekzqCb/*X*/ example-6{font-family:\\"Helvetica Neue\\",serif;}
      ./*X*/_ddGabZ/*X*/ example-7{font-stretch:condensed;}
      ./*X*/_jJGKqi/*X*/ example-7{font-style:oblique 25deg;}
      ./*X*/_gGNwiM/*X*/ example-7{font-weight:753;}
      ./*X*/_kLdlRP/*X*/ example-7{font-size:12pt;}
      ./*X*/_evtXhu/*X*/ example-7{font-family:\\"Helvetica Neue\\",serif;}"
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

    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_jasyBb/*X*/{color:green;}
      ./*X*/_fODNDI/*X*/{background-color:yello;}
      ./*X*/_dzoaVP/*X*/{color:red;}
      ./*X*/_YfjLh/*X*/{background-color:blue;}
      @media (min-width: 700px){./*X*/_bHgrjq/*X*/{color:red;}}
      @media (min-width: 200px){./*X*/_jpNofT/*X*/{color:red;}}"
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

    expect(styles[2].trim()).toMatchInlineSnapshot(`
      "/* STITCHES:large */
      @media(min-width: 300px){./*X*/_kBCYwd/*X*/{color:blue;}}
      @media(min-width: 300px){@supports (color: red){./*X*/_kVIRdt/*X*/{color:red;}}}"
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

    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_hXHHYX/*X*/./*X*/_hXHHYX/*X*/:hover{color:red;}
      ./*X*/_dOwmSv/*X*/./*X*/_dOwmSv/*X*/./*X*/_dOwmSv/*X*/:active{color:red;}
      ./*X*/_jiTAIB/*X*/./*X*/_jiTAIB/*X*/./*X*/_jiTAIB/*X*/./*X*/_jiTAIB/*X*/:focus{color:red;}
      ./*X*/_cQRznS/*X*/./*X*/_cQRznS/*X*/./*X*/_cQRznS/*X*/./*X*/_cQRznS/*X*/:focus-visible{color:red;}
      ./*X*/_cwbTVM/*X*/./*X*/_cwbTVM/*X*/./*X*/_cwbTVM/*X*/./*X*/_cwbTVM/*X*/./*X*/_cwbTVM/*X*/:read-only{color:red;}
      ./*X*/_gXPzmF/*X*/./*X*/_gXPzmF/*X*/./*X*/_gXPzmF/*X*/./*X*/_gXPzmF/*X*/./*X*/_gXPzmF/*X*/./*X*/_gXPzmF/*X*/:disabled{color:red;}"
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

    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_dzoaVP/*X*/{color:red;}"
    `);
  });

  test('should handle global styles', () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      css.global({
        '@media (min-width: 700px)': {
          div: {
            color: 'red',
            backgroundColor: 'white',
            paddingLeft: '10px',
          },
        },
      });
      return '';
    });

    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      @media (min-width: 700px){ div{color:red;}}
      @media (min-width: 700px){ div{background-color:white;}}
      @media (min-width: 700px){ div{padding-left:10px;}}"
    `);
  });

  test('should not re-inject global styles', () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      css.global({
        '@media (min-width: 700px)': { div: { color: 'red' } },
      });

      css.global({
        '@media (min-width: 700px)': { div: { color: 'red' } },
      });
      return '';
    });

    expect(styles[1].trim()).toMatchInlineSnapshot(`
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

    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_dbWduw/*X*/{line-height:1;}
      ./*X*/_hXUSyk/*X*/{margin-left:1px;}
      ./*X*/_clXqwH/*X*/{font-size:1px;}"
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

    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_kYSwIs/*X*/{margin-top:1px;}
      ./*X*/_cTIqvn/*X*/{margin-right:1px;}
      ./*X*/_bZYdQM/*X*/{margin-bottom:1px;}
      ./*X*/_hXUSyk/*X*/{margin-left:1px;}"
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

    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */
      ./*X*/_kYSwIs/*X*/{margin-top:1px;}
      ./*X*/_cTIqvn/*X*/{margin-right:1px;}
      ./*X*/_bZYdQM/*X*/{margin-bottom:1px;}
      ./*X*/_hXUSyk/*X*/{margin-left:1px;}
      ./*X*/_eCjziG/*X*/{padding-top:var(--space-1);}
      ./*X*/_bOBbkJ/*X*/{padding-right:var(--space-1);}
      ./*X*/_gvDHwS/*X*/{padding-bottom:var(--space-1);}
      ./*X*/_bznSbm/*X*/{padding-left:var(--space-1);}"
    `);
  });
});
