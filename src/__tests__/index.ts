import { createCss } from "..";
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
});
