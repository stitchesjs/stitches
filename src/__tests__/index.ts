import { createCss, createTokens, createConfig } from "..";
import { IAtom } from "../types";

function createFakeEnv() {
  return {
    document: {
      styleSheets: [],
      createElement() {},
      // Only used to grab head
      querySelector() {
        return {
          // Used to append the style
          appendChild() {},
          // Only used to count styles
          querySelectorAll() {
            return [];
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
    expect(atom.id).toBe("colorred");
    expect(atom.cssPropParts).toEqual(["color"]);
    expect(atom.pseudo).toBe(undefined);
    expect(atom.screen).toBe("");
    expect(atom.value).toBe("red");
    expect(atom.toString()).toBe("color_red");
    expect(css.getStyles().trim()).toBe(".color_red{color:red;}");
  });
  test("should create tokens", () => {
    const tokens = createTokens({
      colors: {
        RED: "tomato",
      },
    });
    const css = createCss({ tokens }, null);
    const atom = (css.color("RED") as unknown) as IAtom;
    expect(atom.id).toBe("colorRED");
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
    expect(atom.id).toBe("colorred");
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
    expect(atom.id).toBe("colorred:hover");
    expect(atom.cssPropParts).toEqual(["color"]);
    expect(atom.pseudo).toBe(":hover");
    expect(atom.screen).toBe("");
    expect(atom.toString()).toBe("color_red_hover");
    expect(css.getStyles().trim()).toBe(".color_red_hover:hover{color:red;}");
  });
});
