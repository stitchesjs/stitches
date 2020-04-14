import { createCss, createTokens, createConfig } from "..";
import { IAtom } from "../types";

function createFakeEnv(
  styleSheets: { content: string; insertRule: (rule: string) => void }[] = []
) {
  return {
    document: {
      styleSheets,
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

describe("createCss", () => {
  test("should create simple atoms", () => {
    const css = createCss({}, null);
    const atom = (css.color("red") as unknown) as IAtom;
    expect(atom.id).toBe("color");
    expect(atom.cssPropParts).toEqual(["color"]);
    expect(atom.pseudo).toBe(undefined);
    expect(atom.screen).toBe("");
    expect(atom.value).toBe("red");
    expect(atom.toString()).toBe("color_red");
    expect(css.getStyles().trim()).toBe(".color_red{color:red;}");
  });
  test("should compose atoms", () => {
    const css = createCss({}, null);
    expect(
      css.compose(css.color("red"), css.backgroundColor("blue")).toString()
    ).toBe("background-color_blue color_red");
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
    expect(atom.value).toBe("RED");
    expect(atom.tokenValue).toBe("tomato");
    expect(atom.toString()).toBe("color_RED");
    expect(css.getStyles().trim()).toBe(".color_RED{color:tomato;}");
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
    expect(atom.toString()).toBe("tablet_color_red");
    expect(css.getStyles().trim()).toBe(
      "@media (min-width: 700px) { .tablet_color_red{color:red;} }"
    );
  });
  test("should handle pseudos", () => {
    const css = createCss({}, null);
    const atom = (css.color("red", ":hover") as unknown) as IAtom;
    expect(atom.id).toBe("color:hover");
    expect(atom.cssPropParts).toEqual(["color"]);
    expect(atom.pseudo).toBe(":hover");
    expect(atom.screen).toBe("");
    expect(atom.toString()).toBe("color_red_hover");
    expect(css.getStyles().trim()).toBe(".color_red_hover:hover{color:red;}");
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
    ).toBe("background-color_green color_red");
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
    ).toBe("color_red_disabled_hover");
  });
  test("should inject sheet", () => {
    const fakeEnv = createFakeEnv();
    const css = createCss({}, (fakeEnv as unknown) as Window);
    String(css.color("red"));
    expect(fakeEnv.document.styleSheets.length).toBe(1);
    expect(fakeEnv.document.styleSheets[0].content).toBe(
      ".color_red{color:red;}"
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
    expect(fakeEnv.document.styleSheets[1].content).toBe(
      "@media (min-width: 700px) { .tablet_color_red{color:red;} }"
    );
  });
  test("should allow utils", () => {
    const css = createCss(
      {
        utils: {
          marginX: (css) => (value: string) =>
            css.compose(css.marginLeft(value), css.marginRight(value)),
        },
      },
      null
    );
    expect(css.marginX("1rem").toString()).toBe(
      "margin-right_1rem margin-left_1rem"
    );
  });
});
