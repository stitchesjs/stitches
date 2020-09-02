import { tokenizeValue } from "../src/shorthand-parser/value-tokenizer";

describe("Parse css values into token groups", () => {
  test("Will bail out early if giving a falsy value", () => {
    expect(tokenizeValue(undefined as any)).toEqual([[]]);
  });
  test("Parse space separated values", () => {
    expect(tokenizeValue("solid red")).toEqual([["solid", "red"]]);
  });
  test("Parse space separated values that contain units", () => {
    expect(tokenizeValue("1px 1px")).toEqual([["1px", "1px"]]);
  });
  test("Ignore useless whitespace", () => {
    expect(tokenizeValue(" 1px   1px ")).toEqual([["1px", "1px"]]);
  });

  test("Handles quoted strings", () => {
    expect(tokenizeValue('1.2em "Fira Sans"')).toEqual([
      ["1.2em", '"Fira Sans"'],
    ]);
  });

  test("Handles css functions", () => {
    expect(tokenizeValue("3s cubic-bezier(0.1, -0.6, 0.2, 0) 1s")).toEqual([
      ["3s", "cubic-bezier(0.1, -0.6, 0.2, 0)", "1s"],
    ]);
  });

  test("Handles nested css functions", () => {
    expect(
      tokenizeValue("linear-gradient(red, hsla(120,100%,50%,0.3))")
    ).toEqual([["linear-gradient(red, hsla(120,100%,50%,0.3))"]]);
  });

  test("Handles multiple groups", () => {
    expect(tokenizeValue("ease-in 1s slidein, ease-in 2s")).toEqual([
      ["ease-in", "1s", "slidein"],
      ["ease-in", "2s"],
    ]);
  });

  test("Handles multiple groups with css functions", () => {
    expect(tokenizeValue("linear-gradient(red, blue), red")).toEqual([
      ["linear-gradient(red, blue)"],
      ["red"],
    ]);
  });

  test("handles slashes", () => {
    expect(tokenizeValue("small-caps bold 24px/1 sans-serif")).toEqual([
      ["small-caps", "bold", "24px/1", "sans-serif"],
    ]);
    expect(tokenizeValue("2em / 5em")).toEqual([["2em", "/", "5em"]]);
  });

  test("Handles nested css functions in multiple groups", () => {
    expect(
      tokenizeValue("linear-gradient(red, hsla(120,100%,50%,0.3)), red")
    ).toEqual([["linear-gradient(red, hsla(120,100%,50%,0.3))"], ["red"]]);
  });
});
