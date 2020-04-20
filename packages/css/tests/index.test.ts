import {
  createConfig,
  createCss,
  createTokens,
  hotReloadingCache,
} from "../src";
import { IAtom } from "../src/types";

function createFakeEnv(
  styleSheets: { content: string; insertRule: (rule: string) => void }[] = []
) {
  return {
    document: {
      styleSheets,
      // tslint:disable-next-line: no-empty
      createElement() {},
      // Only used to grab head
      querySelector() {
        return {
          // Used to append the style, where
          // we add the stylesheet
          appendChild() {
            styleSheets.push({
              content: "",
              insertRule(rule: string) {
                this.content += rule;
              },
            });
          },
          // Only used to count styles
          querySelectorAll() {
            return styleSheets;
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
    expect(atom.cssPropParts).toEqual(["color"]);
    expect(atom.pseudo).toBe(undefined);
    expect(atom.screen).toBe("");
    expect(atom.value).toBe("red");
    expect(atom.toString()).toBe("c_0");
    expect(css.getStyles().trim()).toBe(".c_0{color:red;}");
  });
  test("should compose atoms", () => {
    const css = createCss({}, null);
    expect(
      css.compose(css.color("red"), css.backgroundColor("blue")).toString()
    ).toBe("bc_0 c_1");
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
    expect(atom.cssPropParts).toEqual(["color"]);
    expect(atom.pseudo).toBe(undefined);
    expect(atom.screen).toBe("");
    expect(atom.value).toBe("tomato");
    expect(atom.toString()).toBe("c_0");
    expect(css.getStyles().trim()).toBe(".c_0{color:tomato;}");
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
    expect(atom.cssPropParts).toEqual(["color"]);
    expect(atom.pseudo).toBe(undefined);
    expect(atom.screen).toBe("tablet");
    expect(atom.toString()).toBe("tablet_c_0");
    expect(css.getStyles().trim()).toBe(
      "@media (min-width: 700px) { .tablet_c_0{color:red;} }"
    );
  });
  test("should handle pseudos", () => {
    const css = createCss({}, null);
    const atom = (css.color("red", ":hover") as unknown) as IAtom;
    expect(atom.id).toBe("color:hover");
    expect(atom.cssPropParts).toEqual(["color"]);
    expect(atom.pseudo).toBe(":hover");
    expect(atom.screen).toBe("");
    expect(atom.toString()).toBe("c_0");
    expect(css.getStyles().trim()).toBe(".c_0:hover{color:red;}");
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
    ).toBe("bc_0 c_1");
  });
  test("should insert rule only once", () => {
    const css = createCss({}, null);
    expect(css.color("red").toString()).toBe("c_0");
    expect(css.color("red").toString()).toBe("c_0");
    expect(css.getStyles().trim()).toBe(".c_0{color:red;}");
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
    ).toBe("c_0");
  });
  test("should inject sheet", () => {
    const fakeEnv = createFakeEnv();
    const css = createCss({}, (fakeEnv as unknown) as Window);
    String(css.color("red"));
    expect(fakeEnv.document.styleSheets.length).toBe(1);
    expect(fakeEnv.document.styleSheets[0].content).toBe(".c_0{color:red;}");
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
    expect(fakeEnv.document.styleSheets[1].content).toBe(
      "@media (min-width: 700px) { .tablet_c_0{color:red;} }"
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
    expect(css.marginX("1rem").toString()).toBe("mr_0 ml_1");
  });
  test("should ignore undefined atoms", () => {
    const css = createCss({}, null);
    expect(
      // @ts-ignore
      String(css.compose(undefined, null, false, "", css.color("red")))
    ).toBe("c_0");
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
    ).toBe("foo_c_0");
  });
});
