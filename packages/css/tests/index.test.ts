import { createCss, createTokens, hotReloadingCache } from "../src";
import { IAtom } from "../src/types";

function createStyleSheet(textContent: string): CSSStyleSheet {
  const style = createStyleTag(textContent);
  document.querySelector("head")?.appendChild(style);

  return document.styleSheets[document.styleSheets.length - 1] as any;
}

function createStyleTag(textContent: string): HTMLStyleElement {
  const style = document.createElement("style");
  style.textContent = textContent;
  return style;
}

function createFakeEnv(
  styleTags: string[] = [],
  computedStyles: string[] = []
) {
  const styleSheets = styleTags.map(createStyleSheet);

  return {
    getComputedStyle() {
      return computedStyles;
    },
    document: {
      styleSheets,
      // Creates a style tag
      createElement() {
        return {
          textContent: "",
        };
      },
      // Only used to grab head
      querySelector() {
        return {
          // Used to append the style, where
          // we add the stylesheet
          appendChild() {
            styleSheets.push(createStyleSheet(""));
          },
          // Only used to count styles
          querySelectorAll() {
            return styleTags.map(createStyleTag);
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
    const atom = (css.color("red") as unknown) as IAtom;
    expect(atom.id).toBe("color");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.pseudo).toBe(undefined);
    expect(atom.screen).toBe("");
    expect(atom.value).toBe("red");
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_1725676875");

      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe("/* STITCHES */\n\n._1725676875{color:red;}");
  });
  test("should compose atoms", () => {
    const css = createCss({}, null);
    expect(
      css.compose(css.color("red"), css.backgroundColor("blue")).toString()
    ).toBe("_763805413 _1725676875");
  });
  test("should create tokens", () => {
    const tokens = createTokens({
      colors: {
        RED: "tomato",
      },
    });
    const css = createCss({ tokens }, null);
    const atom = (css.color("RED") as unknown) as IAtom;
    expect(atom.id).toBe("color");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.pseudo).toBe(undefined);
    expect(atom.screen).toBe("");
    expect(atom.value).toBe("var(--colors-RED)");
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_3389639116");
      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._3389639116{color:var(--colors-RED);}"
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
    const atom = (css.tablet.color("red") as unknown) as IAtom;
    expect(atom.id).toBe("colortablet");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.pseudo).toBe(undefined);
    expect(atom.screen).toBe("tablet");
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_2796359201");
      return "";
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toBe(
      "/* STITCHES:tablet */\n\n@media (min-width: 700px) { ._2796359201{color:red;} }"
    );
  });
  test("should handle pseudos", () => {
    const css = createCss({}, null);
    const atom = (css.color("red", ":hover") as unknown) as IAtom;
    expect(atom.id).toBe("color:hover");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.pseudo).toBe(":hover");
    expect(atom.screen).toBe("");
    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toBe("_627048087");
      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe(
      "/* STITCHES */\n\n._627048087:hover{color:red;}"
    );
  });
  test("should handle specificity", () => {
    const css = createCss({}, null);
    expect(
      css
        .compose(
          css.color("red"),
          css.backgroundColor("blue"),
          css.backgroundColor("green")
        )
        .toString()
    ).toBe("_736532192 _1725676875");
  });
  test("should insert rule only once", () => {
    const css = createCss({}, null);
    const { styles } = css.getStyles(() => {
      expect(css.color("red").toString()).toBe("_1725676875");
      expect(css.color("red").toString()).toBe("_1725676875");
      return "";
    });

    expect(styles.length).toBe(2);
    expect(styles[1].trim()).toBe("/* STITCHES */\n\n._1725676875{color:red;}");
  });
  test("should handle specificity with different but same pseudo", () => {
    const css = createCss({}, null);
    expect(
      css
        .compose(
          css.color("red", ":hover:disabled"),
          css.color("red", ":disabled:hover")
        )
        .toString()
    ).toBe("_3266759165");
  });
  test("should use simple sequence for classname when browser", () => {
    const fakeEnv = createFakeEnv();
    const css = createCss({}, (fakeEnv as unknown) as Window);
    String(css.color("red"));
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toBe(
      "._0 {color: red;}"
    );
  });
  test("should inject sheet", () => {
    const fakeEnv = createFakeEnv();
    const css = createCss({}, (fakeEnv as unknown) as Window);
    String(css.color("red"));
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
    String(css.tablet.color("red"));
    expect(fakeEnv.document.styleSheets.length).toBe(3);
    expect(fakeEnv.document.styleSheets[2].cssRules[0].cssText).toBe(
      "@media (min-width: 700px) {._0 {color: red;}}"
    );
  });
  test("should allow utils", () => {
    const css = createCss(
      {
        utils: {
          marginX: (utilCss) => (value: string) =>
            utilCss.compose(
              utilCss.marginLeft(value),
              utilCss.marginRight(value)
            ),
        },
      },
      null
    );
    expect(css.marginX("1rem").toString()).toBe("_4081121629 _97196166");
  });
  test("should ignore undefined atoms", () => {
    const css = createCss({}, null);
    expect(
      // @ts-ignore
      String(css.compose(undefined, null, false, "", css.color("red")))
    ).toBe("_1725676875");
  });

  test("should allow empty compose call", () => {
    const css = createCss({}, null);
    expect(String(css.compose())).toBe("");
  });

  test("should allow conditional compositions", () => {
    const css = createCss({}, null);
    expect(String(css.compose((false as any) && css.color("red")))).toBe("");
    expect(String(css.compose(true && css.color("red")))).toBe("_1725676875");
  });

  test("should allow prefixes", () => {
    const css = createCss(
      {
        prefix: "foo",
      },
      null
    );
    expect(
      // @ts-ignore
      String(css.color("red"))
    ).toBe("foo_1725676875");
  });
  test("should expose override with utility first", () => {
    const css = createCss(
      {
        utilityFirst: true,
      },
      null
    );
    expect(
      // @ts-ignore
      String(css.override.color("red"))
    ).toBe("_1725676875");
  });
  test("should not inject existing styles", () => {
    const serverCss = createCss({}, null);
    const { styles } = serverCss.getStyles(() => {
      serverCss.color("red").toString();
      return "";
    });

    const fakeEnv = createFakeEnv(styles);
    hotReloadingCache.clear();
    const clientCss = createCss({}, fakeEnv as any);
    // Lets see what is already put in
    expect(fakeEnv.document.styleSheets.length).toBe(2);
    expect(fakeEnv.document.styleSheets[1].cssRules.length).toBe(1);
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toBe(
      "._1725676875 {color: red;}"
    );
    // On the client it will rerun the logic (React hydrate etc.)
    clientCss.color("red").toString();
    // Then we add something new
    clientCss.color("blue").toString();
    // Lets see if it continues on the correct sequence
    expect(fakeEnv.document.styleSheets[1].cssRules.length).toBe(2);
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toBe(
      "._1757807590 {color: blue;}"
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
      css.color("red").toString();
      css.backgroundColor("red").toString();
      return "";
    });

    expect(styles).toEqual([
      `/* STITCHES:__variables__ */\n\n:root{}`,
      `/* STITCHES */\n\n.c_1725676875{color:red;}\n.bc_1056962344{background-color:red;}`,
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
      css.WebkitColor("red").toString();
      return "";
    });

    expect(styles).toEqual([
      `/* STITCHES:__variables__ */\n\n:root{}`,
      `/* STITCHES */\n\n.c_1725676875{-webkit-color:red;}`,
    ]);
  });
  test("should inject vendor prefix environment defines it", () => {
    const fakeEnv = createFakeEnv([], ["-webkit-color"]);
    const css = createCss({}, (fakeEnv as unknown) as Window);
    // @ts-ignore
    css.color("red").toString();
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toBe(
      "._0 {-webkit-color: red;}"
    );
  });
  test("should use specificity props", () => {
    const css = createCss({}, null);
    expect(String(css.margin("1px"))).toBe(
      "_2683736640 _968032303 _4032728388 _4031826548"
    );
  });
  test("should have declarative api", () => {
    const css = createCss({}, null);
    expect(
      css({
        color: "red",
        backgroundColor: "blue",
      }).toString()
    ).toBe("_763805413 _1725676875");
  });
  test("should handle declarative pseudo selector", () => {
    const fakeEnv = createFakeEnv([], []);
    const css = createCss({}, (fakeEnv as unknown) as Window);
    // @ts-ignore
    css({ ":hover": { color: "red" } }).toString();
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
      "/* STITCHES:mobile */\n\n@media(min-width:700px){._2196820011{color:red;}}"
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
      css({ mobile: { ":hover": { color: "red" } } }).toString();
      return "";
    });

    expect(styles.length).toBe(3);
    expect(styles[2].trim()).toBe(
      "/* STITCHES:mobile */\n\n@media(min-width:700px){._860048247:hover{color:red;}}"
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
      "/* STITCHES */\n\n._221333491{color:var(--colors-primary);}",
    ]);
  });
});
