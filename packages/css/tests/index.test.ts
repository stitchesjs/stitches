import {
  createConfig,
  createCss,
  createTokens,
  hotReloadingCache,
} from "../src";
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
    expect(atom.toString()).toBe("_0");
    expect(css.getStyles().length).toBe(1);
    expect(css.getStyles()[0].trim()).toBe("/* STITCHES */\n\n._0{color:red;}");
  });
  test("should compose atoms", () => {
    const css = createCss({}, null);
    expect(
      css.compose(css.color("red"), css.backgroundColor("blue")).toString()
    ).toBe("_0 _1");
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
    expect(atom.value).toBe("tomato");
    expect(atom.toString()).toBe("_0");
    expect(css.getStyles().length).toBe(1);
    expect(css.getStyles()[0].trim()).toBe(
      "/* STITCHES */\n\n._0{color:tomato;}"
    );
  });
  test("should create screens", () => {
    const config = createConfig({
      screens: {
        tablet: (rule) => `@media (min-width: 700px) { ${rule} }`,
      },
    });
    const css = createCss(config, null);
    const atom = (css.tablet.color("red") as unknown) as IAtom;
    expect(atom.id).toBe("colortablet");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.pseudo).toBe(undefined);
    expect(atom.screen).toBe("tablet");
    expect(atom.toString()).toBe("_0");
    expect(css.getStyles().length).toBe(2);
    expect(css.getStyles()[1].trim()).toBe(
      "/* STITCHES:tablet */\n\n@media (min-width: 700px) { ._0{color:red;} }"
    );
  });
  test("should handle pseudos", () => {
    const css = createCss({}, null);
    const atom = (css.color("red", ":hover") as unknown) as IAtom;
    expect(atom.id).toBe("color:hover");
    expect(atom.cssHyphenProp).toEqual("color");
    expect(atom.pseudo).toBe(":hover");
    expect(atom.screen).toBe("");
    expect(atom.toString()).toBe("_0");
    expect(css.getStyles().length).toBe(1);
    expect(css.getStyles()[0].trim()).toBe(
      "/* STITCHES */\n\n._0:hover{color:red;}"
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
    ).toBe("_0 _1");
  });
  test("should insert rule only once", () => {
    const css = createCss({}, null);
    expect(css.color("red").toString()).toBe("_0");
    expect(css.color("red").toString()).toBe("_0");
    expect(css.getStyles().length).toBe(1);
    expect(css.getStyles()[0].trim()).toBe("/* STITCHES */\n\n._0{color:red;}");
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
    ).toBe("_0");
  });
  test("should inject sheet", () => {
    const fakeEnv = createFakeEnv();
    const css = createCss({}, (fakeEnv as unknown) as Window);
    String(css.color("red"));
    expect(fakeEnv.document.styleSheets.length).toBe(1);
    expect(fakeEnv.document.styleSheets[0].cssRules[0].cssText).toBe(
      "._0 {color: red;}"
    );
  });
  test("should inject screen sheets", () => {
    const fakeEnv = createFakeEnv();
    const config = createConfig({
      screens: {
        tablet: (rule) => `@media (min-width: 700px) { ${rule} }`,
      },
    });
    const css = createCss(config, (fakeEnv as unknown) as Window);
    String(css.tablet.color("red"));
    expect(fakeEnv.document.styleSheets.length).toBe(2);
    expect(fakeEnv.document.styleSheets[1].cssRules[0].cssText).toBe(
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
    expect(css.marginX("1rem").toString()).toBe("_0 _1");
  });
  test("should ignore undefined atoms", () => {
    const css = createCss({}, null);
    expect(
      // @ts-ignore
      String(css.compose(undefined, null, false, "", css.color("red")))
    ).toBe("_0");
  });

  test("should allow empty compose call", () => {
    const css = createCss({}, null);
    expect(String(css.compose())).toBe("");
  });

  test("should allow conditional compositions", () => {
    const css = createCss({}, null);
    expect(String(css.compose((false as any) && css.color("red")))).toBe("");
    expect(String(css.compose(true && css.color("red")))).toBe("_0");
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
    ).toBe("foo_0");
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
    ).toBe("_0");
  });
  test("should not inject existing styles", () => {
    const serverCss = createCss({}, null);
    serverCss.color("red").toString();
    const fakeEnv = createFakeEnv(serverCss.getStyles());
    hotReloadingCache.clear();
    const clientCss = createCss({}, fakeEnv as any);
    // Lets see what is already put in
    expect(fakeEnv.document.styleSheets.length).toBe(1);
    expect(fakeEnv.document.styleSheets[0].cssRules.length).toBe(1);
    expect(fakeEnv.document.styleSheets[0].cssRules[0].cssText).toBe(
      "._0 {color: red;}"
    );
    // On the client it will rerun the logic (React hydrate etc.)
    clientCss.color("red").toString();
    // Then we add something new
    clientCss.color("blue").toString();
    // Lets see if it continues on the correct sequence
    expect(fakeEnv.document.styleSheets[0].cssRules.length).toBe(2);
    expect(fakeEnv.document.styleSheets[0].cssRules[0].cssText).toBe(
      "._1 {color: blue;}"
    );
  });
  test("should be able to show friendly classnames", () => {
    const css = createCss(
      {
        showFriendlyClassnames: true,
      },
      null
    );
    css.color("red").toString();
    css.backgroundColor("red").toString();
    expect(css.getStyles()).toEqual([
      `/* STITCHES */\n\n.c_0{color:red;}\n.bc_1{background-color:red;}`,
    ]);
  });
  test("should inject vendor prefix where explicitly stating so", () => {
    const css = createCss(
      {
        showFriendlyClassnames: true,
      },
      null
    );
    // @ts-ignore
    css.WebkitColor("red").toString();
    expect(css.getStyles()).toEqual([
      `/* STITCHES */\n\n.wc_0{-webkit-color:red;}`,
    ]);
  });
  test("should inject vendor prefix environment defines it", () => {
    const fakeEnv = createFakeEnv([], ["-webkit-color"]);
    const css = createCss({}, (fakeEnv as unknown) as Window);
    // @ts-ignore
    css.color("red").toString();
    expect(fakeEnv.document.styleSheets[0].cssRules[0].cssText).toBe(
      "._0 {-webkit-color: red;}"
    );
  });
  test("should use specificity props", () => {
    const css = createCss({}, null);
    expect(String(css.margin("1px"))).toBe("_0 _1 _2 _3");
  });
});
