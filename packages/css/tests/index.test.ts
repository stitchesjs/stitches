import { createCss, createTokens, hotReloadingCache } from "../src";

function createStyleSheet(styleTag: HTMLStyleElement): CSSStyleSheet {
  document.querySelector("head")?.appendChild(styleTag);

  const sheet = document.styleSheets[document.styleSheets.length - 1];
  // @ts-ignore
  sheet.ownerNode = styleTag;
  return sheet as any;
}

function createStyleTag(textContent: string): HTMLStyleElement {
  const style = document.createElement("style");
  style.textContent = textContent;
  return style;
}

function createFakeEnv(
  styleTagContents: string[] = [],
  computedStyles: string[] = []
) {
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
        return createStyleTag("");
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

describe("createCss", () => {
  test("should create simple atoms", () => {
    const css = createCss({}, null);
    const atoms = css({ color: "red" }) as any;
    const atom = atoms.atoms[0];

    expect(atom.id).toBe("color");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.selector).toBe("");
    expect(atom.breakpoint).toBe("");
    expect(atom.value).toBe("red");

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_eCaYfN");

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe("/* STITCHES */\n\n._eCaYfN{color:red;}");
  });
  test("should compose atoms", () => {
    const css = createCss({}, null);
    expect(css({ color: "red", backgroundColor: "blue" }).toString()).toBe(
      "_cayivH _eCaYfN"
    );
  });
  test("should create tokens", () => {
    const tokens = createTokens({
      colors: {
        RED: "tomato",
      },
    });
    const css = createCss({ tokens }, null);
    const atom = (css({ color: "RED" }) as any).atoms[0];

    expect(atom.id).toBe("color");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.selector).toBe("");
    expect(atom.breakpoint).toBe("");
    expect(atom.value).toBe("var(--colors-RED)");

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_iVFaNG");
      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._iVFaNG{color:var(--colors-RED);}"
    );
  });
  test("should remove special characters from tokens", () => {
    const tokens = createTokens({
      colors: {
        "$!@red@!$": "tomato",
      },
    });
    const css = createCss({ tokens }, null);
    const atom = (css({ color: "$!@red@!$" }) as any).atoms[0];

    expect(atom.value).toBe("var(--colors-red)");

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_tLwhG");
      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._tLwhG{color:var(--colors-red);}"
    );
  });
  test("should create breakpoints", () => {
    const css = createCss(
      {
        breakpoints: {
          tablet: (rule) => `@media (min-width: 700px) { ${rule} }`,
        },
      },
      null
    );
    const atom = (css({ tablet: { color: "red" } }) as any).atoms[0];
    expect(atom.id).toBe("colortablet");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.selector).toBe("");
    expect(atom.breakpoint).toBe("tablet");
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_hsxGAz");
      return "";
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toBe(
      "/* STITCHES:tablet */\n\n@media (min-width: 700px) { ._hsxGAz{color:red;} }"
    );
  });
  test("should handle pseudos", () => {
    const css = createCss({}, null);
    const atom = (css({ "&:hover": { color: "red" } }) as any).atoms[0];

    expect(atom.id).toBe("color:hover");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.selector).toBe("&&:hover");
    expect(atom.breakpoint).toBe("");
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_FdHZR");
      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._FdHZR._FdHZR:hover{color:red;}"
    );
  });
  test("should handle specificity", () => {
    const css = createCss({}, null);
    expect(
      css(
        {
          color: "red",
          backgroundColor: "blue",
        },
        {
          backgroundColor: "green",
        }
      ).toString()
    ).toBe("_bWMkiG _eCaYfN");
  });
  test("should insert rule only once", () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      expect(css({ color: "red" }).toString()).toBe("_eCaYfN");
      expect(css({ color: "red" }).toString()).toBe("_eCaYfN");
      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe("/* STITCHES */\n\n._eCaYfN{color:red;}");
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
    ).toBe("_iEPeZH");
  });
  */
  test("should use simple sequence for classname when browser", () => {
    const fakeEnv = createFakeEnv();
    const css = createCss({}, (fakeEnv as unknown) as Window);
    String(css({ color: "red" }));
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toBe(
      "._0 {color: red;}"
    );
  });
  test("should inject sheet", () => {
    const fakeEnv = createFakeEnv();
    const css = createCss({}, (fakeEnv as unknown) as Window);
    String(css({ color: "red" }));
    expect(fakeEnv.document.styleSheets.length).toBe(2);
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toBe(
      "._0 {color: red;}"
    );
  });
  test("should inject screen sheets", () => {
    const fakeEnv = createFakeEnv();
    const css = createCss(
      {
        breakpoints: {
          tablet: (rule) => `@media (min-width: 700px) { ${rule} }`,
        },
      },
      (fakeEnv as unknown) as Window
    );
    String(css({ tablet: { color: "red" } }));
    expect(fakeEnv.document.styleSheets.length).toBe(3);
    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toBe(
      "@media (min-width: 700px) {._0 {color: red;}}"
    );
  });
  test("should allow utils", () => {
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
    expect(css({ marginX: "1rem" }).toString()).toBe("_kMiQCn _npnrc");
  });

  test("should allow utils that resolve into nested structures", () => {
    const css = createCss(
      {
        utils: {
          hover: () => (value) => ({
            ":hover": value,
            ":focus": value,
          }),
        },
      },
      null
    );
    const atom = css({
      hover: {
        color: "green",
      },
    });

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_btUdGL _dGJDNJ");

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._btUdGL._btUdGL:focus{color:green;}
      ._dGJDNJ._dGJDNJ:hover{color:green;}"
    `);
  });

  test("should ignore undefined atoms", () => {
    const css = createCss({}, null);

    expect(
      // @ts-ignore
      String(css(undefined, null, false, "", { color: "red" }))
    ).toBe("_eCaYfN");
  });
  test("should allow empty compose call", () => {
    const css = createCss({}, null);
    expect(String(css())).toBe("");
  });
  test("should allow conditional compositions", () => {
    const css = createCss({}, null);
    expect(String(css((false as any) && { color: "red" }))).toBe("");
    expect(String(css(true && { color: "red" }))).toBe("_eCaYfN");
  });
  test("should allow prefixes", () => {
    const css = createCss(
      {
        prefix: "foo",
      },
      null
    );
    expect(String(css({ color: "red" }))).toBe("foo_eCaYfN");
  });
  test("should expose override with utility first", () => {
    const css = createCss(
      {
        utilityFirst: true,
        breakpoints: {
          mobile: () => "",
        },
      },
      null
    );
    expect(String(css({ override: { color: "red" } }))).toBe("_eCaYfN");
  });
  test("should not inject existing styles", () => {
    const serverCss = createCss({}, null);
    const { styles } = serverCss.getStyles(() => {
      serverCss({ color: "red" }).toString();
      return "";
    });

    const fakeEnv = createFakeEnv(styles);
    hotReloadingCache.clear();
    const clientCss = createCss({}, fakeEnv as any);
    // Lets see what is already put in
    expect(fakeEnv.document.styleSheets.length).toBe(2);
    expect(fakeEnv.document.styleSheets[1].cssRules.length).toBe(1);
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toBe(
      "._eCaYfN {color: red;}"
    );
    // On the client it will rerun the logic (React hydrate etc.)
    clientCss({ color: "red" }).toString();
    // Then we add something new
    clientCss({ color: "blue" }).toString();
    // Lets see if it continues on the correct sequence
    expect(fakeEnv.document.styleSheets[1].cssRules.length).toBe(2);
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toBe(
      "._eGvyOg {color: blue;}"
    );
  });
  test("should be able to show friendly classnames", () => {
    const css = createCss(
      {
        showFriendlyClassnames: true,
      },
      null
    );
    const { styles } = css.getStyles(() => {
      css({ color: "red" }).toString();
      css({ backgroundColor: "red" }).toString();
      return "";
    });

    expect(styles).toEqual([
      `/* STITCHES:__variables__ */\n\n:root{}`,
      `/* STITCHES */\n\n.c_eCaYfN{color:red;}\n.bc_cODewW{background-color:red;}`,
    ]);
  });
  test("should inject vendor prefix where explicitly stating so", () => {
    const css = createCss(
      {
        showFriendlyClassnames: true,
      },
      null
    );
    const { styles } = css.getStyles(() => {
      // @ts-ignore
      css({ WebkitColor: "red" }).toString();
      return "";
    });

    expect(styles).toEqual([
      `/* STITCHES:__variables__ */\n\n:root{}`,
      `/* STITCHES */\n\n.c_eCaYfN{-webkit-color:red;}`,
    ]);
  });
  test("should use specificity props", () => {
    const css = createCss({}, null);
    expect(String(css({ margin: "1px" }))).toBe(
      "_kFwmfW _hdcIia _cCuGfR _kFCHHa"
    );
  });
  test("should have declarative api", () => {
    const css = createCss({}, null);
    expect(
      css({
        color: "red",
        backgroundColor: "blue",
      }).toString()
    ).toBe("_cayivH _eCaYfN");
  });
  test("should handle declarative pseudo selector", () => {
    const fakeEnv = createFakeEnv([], []);
    const css = createCss({}, (fakeEnv as unknown) as Window);
    // @ts-ignore
    css({ "&:hover": { color: "red" } }).toString();
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toBe(
      "._0._0:hover {color: red;}"
    );
  });
  test("should handle screen selector", () => {
    const css = createCss(
      {
        breakpoints: {
          mobile: (className) => `@media(min-width:700px){${className}}`,
        },
      },
      null
    );
    const { styles } = css.getStyles(() => {
      css({ mobile: { color: "red" } }).toString();
      return "";
    });
    // @ts-ignore

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toBe(
      "/* STITCHES:mobile */\n\n@media(min-width:700px){._fOxLwJ{color:red;}}"
    );
  });
  test("should handle pseudo in screen selector", () => {
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
      css({ mobile: { "&:hover": { color: "red" } } }).toString();
      return "";
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toBe(
      "/* STITCHES:mobile */\n\n@media(min-width:700px){._coXxUV._coXxUV:hover{color:red;}}"
    );
  });
  test("should insert themes", () => {
    const css = createCss(
      {
        tokens: {
          colors: {
            primary: "tomato",
          },
        },
      },
      null
    );
    const { styles } = css.getStyles(() => {
      // @ts-ignore
      css({ color: "primary" }).toString();
      expect(
        css
          .theme({
            colors: {
              primary: "blue",
            },
          })
          .toString()
      ).toBe("theme-0");
      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles).toEqual([
      "/* STITCHES:__variables__ */\n\n:root{--colors-primary:tomato;}\n.theme-0{--colors-primary:blue;}",
      "/* STITCHES */\n\n._Eogfp{color:var(--colors-primary);}",
    ]);
  });
  test("should allow nested pseudo", () => {
    const css = createCss({}, null);
    const atom = css({ "&:hover": { "&:disabled": { color: "red" } } }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_imukGD");

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._imukGD._imukGD:hover:disabled{color:red;}"
    );
  });
  test("should handle border specificity", () => {
    const css = createCss({}, null);
    const atom = css({ border: "1px solid red" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe(
        "_jMbiSS _lkwFJC _iqEHZB _frjswu _dKkway _bctHBa _kxkaMR _dZmTIq _fcpRZb _pPCSj _hUxHUo _daMVcf"
      );

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._jMbiSS{border-left-color:red;}\n._lkwFJC{border-bottom-color:red;}\n._iqEHZB{border-right-color:red;}\n._frjswu{border-top-color:red;}\n._dKkway{border-left-style:solid;}\n._bctHBa{border-bottom-style:solid;}\n._kxkaMR{border-right-style:solid;}\n._dZmTIq{border-top-style:solid;}\n._fcpRZb{border-left-width:1px;}\n._pPCSj{border-bottom-width:1px;}\n._hUxHUo{border-right-width:1px;}\n._daMVcf{border-top-width:1px;}"
    );
  });
  test("should handle border shorthand with tokens", () => {
    const css = createCss(
      {
        tokens: {
          colors: {
            primary: "tomato",
          },
        },
      },
      null
    );
    const atom = css({ border: "1px solid primary" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe(
        "_ffzau _jIhVXS _uBwAx _kLWpHW _dKkway _bctHBa _kxkaMR _dZmTIq _fcpRZb _pPCSj _hUxHUo _daMVcf"
      );

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._ffzau{border-left-color:var(--colors-primary);}\n._jIhVXS{border-bottom-color:var(--colors-primary);}\n._uBwAx{border-right-color:var(--colors-primary);}\n._kLWpHW{border-top-color:var(--colors-primary);}\n._dKkway{border-left-style:solid;}\n._bctHBa{border-bottom-style:solid;}\n._kxkaMR{border-right-style:solid;}\n._dZmTIq{border-top-style:solid;}\n._fcpRZb{border-left-width:1px;}\n._pPCSj{border-bottom-width:1px;}\n._hUxHUo{border-right-width:1px;}\n._daMVcf{border-top-width:1px;}"
    );
  });
  test("should handle box shadow with tokens", () => {
    const css = createCss(
      {
        tokens: {
          colors: {
            primary: "tomato",
          },
        },
      },
      null
    );
    const atom = css({ boxShadow: "1px 1px 1px primary" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_diaoUX");

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._diaoUX{box-shadow: 1px 1px 1px var(--colors-primary);}"
    );
  });
  test("should be able to compose themes", () => {
    const css = createCss(
      {
        tokens: {
          colors: {
            primary: "tomato",
          },
        },
      },
      null
    );
    const darkTheme = css.theme({
      colors: {
        primary: "green",
      },
    });
    const atom = css(darkTheme, {
      color: "primary",
    }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_Eogfp theme-0");

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._Eogfp{color:var(--colors-primary);}"
    );
  });

  test("should generate keyframe atoms", () => {
    const css = createCss({}, null);
    const keyFrame = css.keyframes({
      "0%": { background: "red" },
      "100%": { background: "green" },
    }) as any;

    expect(keyFrame._cssRuleString).toBe(
      "@keyframes dmyJCr {0% {background-color: red;}100% {background-color: green;}"
    );

    expect(keyFrame.toString()).toBe("dmyJCr");
  });

  test("should support utils inside keyframes", () => {
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
      "0%": { mx: "1px" },
      "100%": { mx: "10px" },
    }) as any;

    expect(keyFrame._cssRuleString).toBe(
      "@keyframes bFeLcH {0% {margin-left: 1px;margin-right: 1px;}100% {margin-left: 10px;margin-right: 10px;}"
    );

    expect(keyFrame.toString()).toBe("bFeLcH");
  });

  test("should support specificity props inside keyframes", () => {
    const css = createCss({}, null);
    const keyFrame = css.keyframes({
      "0%": { padding: "1px" },
      "100%": { padding: "10px" },
    }) as any;

    expect(keyFrame._cssRuleString).toMatchInlineSnapshot(
      `"@keyframes bivLJn {0% {padding-top: 1px;padding-right: 1px;padding-bottom: 1px;padding-left: 1px;}100% {padding-top: 10px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px;}"`
    );

    expect(keyFrame.toString()).toBe("bivLJn");
  });
  test("should allow keyframes atom to be used as a direct object value", () => {
    const css = createCss({}, null);
    const keyFrame = css.keyframes({
      "0%": { background: "red" },
      "100%": { background: "green" },
    }) as any;
    let atom: any;
    const { styles } = css.getStyles(() => {
      expect(() => (atom = css({ animationName: keyFrame }))).not.toThrow();
      expect(atom.toString()).toBe("_idHIjE");
      return "";
    });
    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n@keyframes dmyJCr {0% {background-color: red;}100% {background-color: green;}\n._idHIjE{animation-name:dmyJCr;}"
    );
  });
  test("should inject styles for animations into sheet", () => {
    const css = createCss({}, null);
    const keyFrame = css.keyframes({
      "0%": { background: "red" },
      "100%": { background: "green" },
    }) as any;
    let atom = css({ animationName: keyFrame }) as any;
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_idHIjE");
      return "";
    });
    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n@keyframes dmyJCr {0% {background-color: red;}100% {background-color: green;}\n._idHIjE{animation-name:dmyJCr;}"
    );
  });
  test("should handle margin shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ margin: "1px 5px" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_jeUhKW _hdcIia _ihMdjN _kFCHHa"`
      );

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._jeUhKW{margin-left:5px;}
      ._hdcIia{margin-bottom:1px;}
      ._ihMdjN{margin-right:5px;}
      ._kFCHHa{margin-top:1px;}"
    `);
  });

  test("should handle padding shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ padding: "1px 5px" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_gyarRZ _kQnasN _gerKhy _cRIZvx"`
      );

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._gyarRZ{padding-left:5px;}
      ._kQnasN{padding-bottom:1px;}
      ._gerKhy{padding-right:5px;}
      ._cRIZvx{padding-top:1px;}"
    `);
  });

  test("should handle border-top shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ borderTop: "1px solid red" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_frjswu _dZmTIq _daMVcf"`
      );
    });
    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._frjswu{border-top-color:red;}
      ._dZmTIq{border-top-style:solid;}
      ._daMVcf{border-top-width:1px;}"
      `);
  });

  test("should allow nested inline media queries", () => {
    const css = createCss({}, null);
    const atom = css({
      "@media (hover:hover)": { "@media screen": { color: "red" } },
    }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_zbUMK");
    });
  });

  test("should handle border-right shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ borderRight: "1px solid red" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_iqEHZB _kxkaMR _hUxHUo"`
      );

      return "";
    });

    expect(styles.length).toBe(2);

    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._iqEHZB{border-right-color:red;}
      ._kxkaMR{border-right-style:solid;}
      ._hUxHUo{border-right-width:1px;}"
    `);
  });
  test("should handle border-bottom shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ borderBottom: "1px solid red" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_lkwFJC _bctHBa _pPCSj"`);
    });
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._lkwFJC{border-bottom-color:red;}
      ._bctHBa{border-bottom-style:solid;}
      ._pPCSj{border-bottom-width:1px;}"
    `);
  });
  test("should allow inline media queries", () => {
    const css = createCss({}, null);
    const atom = css({ "@media (hover:hover)": { color: "red" } }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_hCvELq");
    });
    expect(styles.length).toBe(2);
    expect(styles[1]).toMatchInlineSnapshot(`
      "/* STITCHES */

      @media (hover:hover){._hCvELq{color:red;}}"
    `);
  });

  test("should allow injection of classname", () => {
    const css = createCss({}, null);
    const atom = (css({ "div:hover &": { color: "red" } }) as any).atoms[0];

    expect(atom.id).toBe("colordiv:hover &");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.selector).toBe("div:hover &");
    expect(atom.breakpoint).toBe("");

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_dkzxrg");
    });
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\ndiv:hover ._dkzxrg{color:red;}"
    );
  });

  test("should handle border-left shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ borderLeft: "1px solid red" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_jMbiSS _dKkway _fcpRZb"`
      );
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._jMbiSS{border-left-color:red;}
      ._dKkway{border-left-style:solid;}
      ._fcpRZb{border-left-width:1px;}"
    `);
  });
  test("should handle border-radius shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ borderRadius: "5px" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_kirJLA _gnzyQc _bjAoar _iVJtjr"`
      );
      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._kirJLA{border-bottom-right-radius:5px;}
      ._gnzyQc{border-top-right-radius:5px;}
      ._bjAoar{border-top-left-radius:5px;}
      ._iVJtjr{border-bottom-left-radius:5px;}"
    `);
  });

  test("should handle border-color shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ borderColor: "red" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_jMbiSS _lkwFJC _iqEHZB _frjswu"`
      );

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._jMbiSS{border-left-color:red;}
      ._lkwFJC{border-bottom-color:red;}
      ._iqEHZB{border-right-color:red;}
      ._frjswu{border-top-color:red;}"
    `);
  });

  test("should handle border-style shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ borderStyle: "solid" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_dKkway _bctHBa _kxkaMR _dZmTIq"`
      );

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._dKkway{border-left-style:solid;}
      ._bctHBa{border-bottom-style:solid;}
      ._kxkaMR{border-right-style:solid;}
      ._dZmTIq{border-top-style:solid;}"
    `);
  });

  test("should handle border-width shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ borderWidth: "2px" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_exEWxc _dVrsOA _foDwTX _hlWFhc"`
      );

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._exEWxc{border-left-width:2px;}
      ._dVrsOA{border-bottom-width:2px;}
      ._foDwTX{border-right-width:2px;}
      ._hlWFhc{border-top-width:2px;}"
    `);
  });

  test("should handle background shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ background: "red" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_cODewW"`);

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._cODewW{background-color:red;}"
    `);
  });

  test("should handle transition shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ transition: "margin-right 2s ease-in-out" }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(
        `"_cYJUVx _dkQnca _fMYPIB"`
      );

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._cYJUVx{transition-timing-function:ease-in-out;}
      ._dkQnca{transition-duration:2s;}
      ._fMYPIB{transition-property:margin-right;}"
    `);
  });

  test("should handle font shorthand", () => {
    const css = createCss({}, null);
    const atom = css({ font: '1.2em "Fira Sans", sans-serif' }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_kSPChp _bZKhEt"`);

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toMatchInlineSnapshot(`
      "/* STITCHES */

      ._kSPChp{font-family:\\"Fira Sans\\",sans-serif;}
      ._bZKhEt{font-size:1.2em;}"
    `);
  });

  test("should not yield type errors when raw values are used even though tokens are defined", () => {
    const css = createCss({
      tokens: {
        colors: {
          primary: "red",
        },
      },
    });
    css({
      color: "lime",
    });
  });

  test("should yield type errors in strict mode when tokens are defined but raw values are used", () => {
    const css = createCss({
      strict: true,
      tokens: {
        colors: {
          primary: "red",
        },
      },
    });
    css({
      color: "primary",
      // @ts-ignore
      backgroundColor: "red",
    });
  });

  test("should not yield type errors when a token category is missing", () => {
    const css = createCss({
      strict: true,
      tokens: {
        radii: {
          tiny: "3px",
        },
      },
    });
    css({
      borderRadius: "tiny",
      color: "lime", // allowed since no color tokens are defined
    });
  });
});
