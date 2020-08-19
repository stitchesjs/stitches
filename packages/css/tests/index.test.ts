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
    expect(atom.pseudo).toBe("");
    expect(atom.screen).toBe("");
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
    expect(atom.pseudo).toBe("");
    expect(atom.screen).toBe("");
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
  test("should create screens", () => {
    const css = createCss(
      {
        screens: {
          tablet: (rule) => `@media (min-width: 700px) { ${rule} }`,
        },
      },
      null
    );
    const atom = (css({ tablet: { color: "red" } }) as any).atoms[0];
    expect(atom.id).toBe("colortablet");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.pseudo).toBe("");
    expect(atom.screen).toBe("tablet");
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
    expect(atom.pseudo).toBe(":hover");
    expect(atom.screen).toBe("");
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_bHNCzd");
      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._bHNCzd:hover{color:red;}"
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
  test("should handle specificity with different but same pseudo", () => {
    const css = createCss({}, null);
    expect(
      css(
        { "&:hover:disabled": { color: "red" } },
        { "&:disabled:hover": { color: "red" } }
      ).toString()
    ).toBe("_iEPeZH");
  });
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
        screens: {
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
        screens: {
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
      "_hdcIia _cCuGfR _kFCHHa _kFwmfW"
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
      "._0:hover {color: red;}"
    );
  });
  test("should handle screen selector", () => {
    const css = createCss(
      {
        screens: {
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
        screens: {
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
      "/* STITCHES:mobile */\n\n@media(min-width:700px){._cnGHjt:hover{color:red;}}"
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
      expect(atom.toString()).toBe("_iEPeZH");

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._iEPeZH:hover:disabled{color:red;}"
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
  test("should handle border array definition with token", () => {
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
    const atom = css({ border: ["1px", "solid", "primary"] }) as any;

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
  test("should handle box shadow array with token", () => {
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
    const atom = css({ boxShadow: ["1px", "1px", "1px", "primary"] }) as any;

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_jpflsr");

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._jpflsr{box-shadow:1px 1px 1px var(--colors-primary);}"
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
      "@keyframes kNUAiX {0% {background: red;}100% {background: green;}"
    );

    expect(keyFrame.toString()).toBe("kNUAiX");
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

    expect(keyFrame._cssRuleString).toBe(
      "@keyframes hAOsXf {0% {padding-left: 1px;padding-top: 1px;padding-right: 1px;padding-bottom: 1px;}100% {padding-left: 10px;padding-top: 10px;padding-right: 10px;padding-bottom: 10px;}"
    );

    expect(keyFrame.toString()).toBe("hAOsXf");
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
      expect(atom.toString()).toBe("_hVCFgX");
      return "";
    });
    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n@keyframes kNUAiX {0% {background: red;}100% {background: green;}\n._hVCFgX{animation-name:kNUAiX;}"
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
      expect(atom.toString()).toBe("_hVCFgX");
      return "";
    });
    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n@keyframes kNUAiX {0% {background: red;}100% {background: green;}\n._hVCFgX{animation-name:kNUAiX;}"
    );
  });

  test("should yield type errors when tokens are defined", () => {
    const css = createCss({
      tokens: {
        colors: {
          primary: "red",
        },
      },
    });
    css({
      color: "primary",
      // @ts-expect-error
      backgroundColor: "red",
    });
  });

  test("should not yield type errors when a token category is missing", () => {
    const css = createCss({
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
