import { IConfig, TCss } from "@stitches/css";

/*
  TODO:
  Fix Webkit properties to -webkit

  Defaults:
    clear
    objectFit
    position
*/

const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

export const container = (css: TCss<any>) => () =>
  css.compose(
    css.width("100%"),
    css.sm.maxWidth(breakpoints.sm),
    css.md.maxWidth(breakpoints.md),
    css.lg.maxWidth(breakpoints.lg),
    css.xl.maxWidth(breakpoints.xl)
  );

export const box = (css: TCss<any>) => (value: "border" | "content") =>
  css.boxSizing(
    {
      border: "border-box",
      content: "content-box",
    }[value] as any
  );

export const hidden = (css: TCss<any>) => () => css.display("hidden");
export const block = (css: TCss<any>) => () => css.display("block");
export const inlineBlock = (css: TCss<any>) => () =>
  css.display("inline-block");
export const inline = (css: TCss<any>) => () => css.display("inline");
export const inlineFlex = (css: TCss<any>) => () => css.display("inline-flex");

export const table = (css: TCss<any>) => (
  value?: "caption" | "cell" | "column" | "column-group"
) => css.display(value || "table");

export const float = (css: TCss<any>) => (value: "right" | "left" | "none") =>
  css.float(value);

export const clearfix = (css: TCss<any>) => () =>
  css.compose(
    css.content("", "::after"),
    css.display("table", "::after"),
    css.clear("both", "::after")
  );

export const clear = (css: TCss<any>) => (
  value: "left" | "right" | "both" | "none"
) => css.clear(value);

export const object = (() => {
  const values = {
    contain: (css: TCss<any>) => css.objectFit("contain"),
    cover: (css: TCss<any>) => css.objectFit("cover"),
    fill: (css: TCss<any>) => css.objectFit("fill"),
    none: (css: TCss<any>) => css.objectFit("none"),
    "scale-down": (css: TCss<any>) => css.objectFit("scale-down"),
    bottom: (css: TCss<any>) => css.objectPosition("bottom"),
    center: (css: TCss<any>) => css.objectPosition("center"),
    left: (css: TCss<any>) => css.objectPosition("left"),
    "left-bottom": (css: TCss<any>) => css.objectPosition("left bottom"),
    "left-top": (css: TCss<any>) => css.objectPosition("left top"),
    right: (css: TCss<any>) => css.objectPosition("right"),
    "right-bottom": (css: TCss<any>) => css.objectPosition("right bottom"),
    "right-top": (css: TCss<any>) => css.objectPosition("right top"),
    top: (css: TCss<any>) => css.objectPosition("top"),
  };
  return (css: TCss<any>) => (
    value:
      | "contain"
      | "cover"
      | "fill"
      | "none"
      | "scale-down"
      | "bottom"
      | "center"
      | "left"
      | "left-bottom"
      | "left-top"
      | "right"
      | "right-bottom"
      | "right-top"
      | "top"
  ) => values[value](css);
})();

export const overflow = (() => {
  const values = {
    hidden: (css: TCss<any>) => css.overflow("hidden"),
    visible: (css: TCss<any>) => css.overflow("visible"),
    scroll: (css: TCss<any>) => css.overflow("scroll"),
    "x-auto": (css: TCss<any>) => css.overflowX("auto"),
    "y-auto": (css: TCss<any>) => css.overflowY("auto"),
    "x-hidden": (css: TCss<any>) => css.overflowX("hidden"),
    "y-hidden": (css: TCss<any>) => css.overflowY("hidden"),
    "x-visible": (css: TCss<any>) => css.overflowX("visible"),
    "y-visible": (css: TCss<any>) => css.overflowY("visible"),
    "x-scroll": (css: TCss<any>) => css.overflowX("scroll"),
    "y-scroll": (css: TCss<any>) => css.overflowY("scroll"),
    touch: (css: TCss<any>) => css.WebkitOverflowScrolling("touch"),
    auto: (css: TCss<any>) => css.overflow("auto"),
  };
  return (css: TCss<any>) => (
    value:
      | "hidden"
      | "visible"
      | "scroll"
      | "x-auto"
      | "y-auto"
      | "x-hidden"
      | "y-hidden"
      | "x-visible"
      | "y-visible"
      | "x-scroll"
      | "y-scroll"
      | "touch"
      | "auto"
  ) => values[value](css) as any;
})();

export const staticPosition = (css: TCss<any>) => () => css.position("static");

export const fixed = (css: TCss<any>) => () => css.position("fixed");

export const absolute = (css: TCss<any>) => () => css.position("absolute");

export const relative = (css: TCss<any>) => () => css.position("relative");

export const sticky = (css: TCss<any>) => () => css.position("sticky");

export const top = (css: TCss<any>) => (value: 0 | "auto") => css.top(value);
export const right = (css: TCss<any>) => (value: 0 | "auto") =>
  css.right(value);
export const bottom = (css: TCss<any>) => (value: 0 | "auto") =>
  css.bottom(value);
export const left = (css: TCss<any>) => (value: 0 | "auto") => css.left(value);

export const inset = (() => {
  const values = {
    "inset-0": (css: TCss<any>) =>
      css.compose(css.top(0), css.right(0), css.bottom(0), css.left(0)),
    "inset-y-0": (css: TCss<any>) => css.compose(css.top(0), css.bottom(0)),
    "inset-x-0": (css: TCss<any>) => css.cmopose(css.right(0), css.left(0)),
    "inset-auto": (css: TCss<any>) =>
      css.compose(
        css.top("auto"),
        css.right("auto"),
        css.bottom("auto"),
        css.left("auto")
      ),
    "inset-y-auto": (css: TCss<any>) =>
      css.compose(css.top("auto"), css.bottom("auto")),
    "inset-x-auto": (css: TCss<any>) =>
      css.compose(css.left("auto"), css.right("auto")),
  };
  return (css: TCss<any>) => (
    value:
      | "inset-0"
      | "inset-y-0"
      | "inset-x-0"
      | "inset-auto"
      | "inset-y-auto"
      | "inset-x-auto"
  ) => values[value](css) as any;
})();

export const visible = (css: TCss<any>) => () => css.visibility("visible");

export const invisible = (css: TCss<any>) => () => css.visibility("hidden");

export const z = (css: TCss<any>) => (
  value: 0 | 10 | 20 | 30 | 40 | 50 | "auto"
) => css.zIndex(value);

export const flex = (() => {
  const values = {
    row: (css: TCss<any>) => css.flexDirection("row"),
    "row-reverse": (css: TCss<any>) => css.flexDirection("row-reverse"),
    col: (css: TCss<any>) => css.flexDirection("column"),
    "col-reverse": (css: TCss<any>) => css.flexDirection("column-reverse"),
    "no-wrap": (css: TCss<any>) => css.flexWrap("nowrap"),
    wrap: (css: TCss<any>) => css.flexWrap("wrap"),
    "wrap-reverse": (css: TCss<any>) => css.flexWrap("wrap-reverse"),
    initial: (css: TCss<any>) =>
      css.compose(css.flexGrow(0), css.flexShrink(1), css.flexBasis("auto")),
    "1": (css: TCss<any>) =>
      css.compose(css.flexGrow(1), css.flexShrink(1), css.flexBasis("0%")),
    auto: (css: TCss<any>) =>
      css.compose(css.flexGrow(1), css.flexShrink(1), css.flexBasis("auto")),
    none: (css: TCss<any>) =>
      css.compose(css.flexGrow(0), css.flexShrink(0), css.flexBasis("auto")),
    grow: (css: TCss<any>) => css.flexGrow(1),
    "grow-0": (css: TCss<any>) => css.flexGrow(0),
    shrink: (css: TCss<any>) => css.flexShrink(1),
    "shrink-0": (css: TCss<any>) => css.flexShrink(0),
  };
  return (css: TCss<any>) => (
    value?:
      | "row"
      | "row-reverse"
      | "col"
      | "col-reverse"
      | "no-wrap"
      | "wrap"
      | "wrap-reverse"
      | "initial"
      | "1"
      | "auto"
      | "none"
      | "grow"
      | "grow-0"
      | "shrink"
      | "shrink-0"
  ) => (value ? values[value](css) : css.display("flex"));
})();

export const items = (() => {
  const values = {
    stretch: (css: TCss<any>) => css.alignItems("stretch"),
    start: (css: TCss<any>) => css.alignItems("flex-start"),
    center: (css: TCss<any>) => css.alignItems("center"),
    end: (css: TCss<any>) => css.alignItems("flex-end"),
    baseline: (css: TCss<any>) => css.alignItems("baseline"),
  };
  return (css: TCss<any>) => (
    value: "stretch" | "start" | "center" | "end" | "baseline"
  ) => values[value](css);
})();

export const content = (() => {
  const values = {
    start: (css: TCss<any>) => css.alignContent("flex-start"),
    center: (css: TCss<any>) => css.alignContent("center"),
    end: (css: TCss<any>) => css.alignContent("flex-end"),
    between: (css: TCss<any>) => css.alignContent("between"),
    around: (css: TCss<any>) => css.alignContent("around"),
  };
  return (css: TCss<any>) => (
    value: "start" | "center" | "end" | "between" | "around"
  ) => values[value](css);
})();

export const self = (() => {
  const values = {
    start: (css: TCss<any>) => css.alignSelf("flex-start"),
    center: (css: TCss<any>) => css.alignSelf("center"),
    end: (css: TCss<any>) => css.alignSelf("flex-end"),
    auto: (css: TCss<any>) => css.alignSelf("auto"),
    stretch: (css: TCss<any>) => css.alignSelf("stretch"),
  };
  return (css: TCss<any>) => (
    value: "auto" | "start" | "center" | "end" | "stretch"
  ) => values[value](css);
})();

export const justify = (() => {
  const values = {
    start: (css: TCss<any>) => css.justifyContent("flex-start"),
    center: (css: TCss<any>) => css.justifyContent("center"),
    end: (css: TCss<any>) => css.justifyContent("flex-end"),
    between: (css: TCss<any>) => css.justifyContent("between"),
    around: (css: TCss<any>) => css.justifyContent("around"),
  };
  return (css: TCss<any>) => (
    value: "between" | "start" | "center" | "end" | "around"
  ) => values[value](css);
})();

export const order = (css: TCss<any>) => (
  value: "first" | "last" | "none" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
) =>
  css.order(
    value === "first"
      ? -9999
      : value === "last"
      ? 9999
      : value === "none"
      ? 0
      : value
  );

export const grid = (() => {
  const values = {
    "cols-1": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(1, minmax(0, 1fr))"),
    "cols-2": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(2, minmax(0, 1fr))"),
    "cols-3": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(3, minmax(0, 1fr))"),
    "cols-4": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(4, minmax(0, 1fr))"),
    "cols-5": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(5, minmax(0, 1fr))"),
    "cols-6": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(6, minmax(0, 1fr))"),
    "cols-7": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(7, minmax(0, 1fr))"),
    "cols-8": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(8, minmax(0, 1fr))"),
    "cols-9": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(9, minmax(0, 1fr))"),
    "cols-10": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(10, minmax(0, 1fr))"),
    "cols-11": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(11, minmax(0, 1fr))"),
    "cols-12": (css: TCss<any>) =>
      css.gridTemplateColumns("repeat(12, minmax(0, 1fr))"),
    "cols-none": (css: TCss<any>) => css.gridTemplateColumns("none"),
    "rows-1": (css: TCss<any>) =>
      css.gridTemplateRows("repeat(1, minmax(0, 1fr))"),
    "rows-2": (css: TCss<any>) =>
      css.gridTemplateRows("repeat(2, minmax(0, 1fr))"),
    "rows-3": (css: TCss<any>) =>
      css.gridTemplateRows("repeat(3, minmax(0, 1fr))"),
    "rows-4": (css: TCss<any>) =>
      css.gridTemplateRows("repeat(4, minmax(0, 1fr))"),
    "rows-5": (css: TCss<any>) =>
      css.gridTemplateRows("repeat(5, minmax(0, 1fr))"),
    "rows-6": (css: TCss<any>) =>
      css.gridTemplateRows("repeat(6, minmax(0, 1fr))"),
    "rows-none": (css: TCss<any>) => css.gridTemplateRows("none"),
    "flow-row": (css: TCss<any>) => css.gridAutoFlow("row"),
    "flow-col": (css: TCss<any>) => css.gridAutoFlow("column"),
    "flow-row-dense": (css: TCss<any>) => css.gridAutoFlow("row dense"),
    "flow-col-dense": (css: TCss<any>) => css.gridAutoFlow("column dense"),
  };
  return (css: TCss<any>) => (
    value?:
      | "cols-1"
      | "cols-2"
      | "cols-3"
      | "cols-4"
      | "cols-5"
      | "cols-6"
      | "cols-7"
      | "cols-8"
      | "cols-9"
      | "cols-10"
      | "cols-11"
      | "cols-12"
      | "cols-none"
      | "rows-1"
      | "rows-2"
      | "rows-3"
      | "rows-4"
      | "rows-5"
      | "rows-6"
      | "rows-none"
      | "flow-row"
      | "flow-col"
      | "flow-row-dense"
      | "flow-col-dense"
  ) => (value ? values[value](css) : css.display("grid"));
})();

export const col = (() => {
  const values = {
    auto: (css: TCss<any>) => css.gridColumn("auto"),
    "span-1": (css: TCss<any>) => css.gridColumn("span 1 / span 1"),
    "span-2": (css: TCss<any>) => css.gridColumn("span 2 / span 2"),
    "span-3": (css: TCss<any>) => css.gridColumn("span 3 / span 3"),
    "span-4": (css: TCss<any>) => css.gridColumn("span 4 / span 4"),
    "span-5": (css: TCss<any>) => css.gridColumn("span 5 / span 5"),
    "span-6": (css: TCss<any>) => css.gridColumn("span 6 / span 6"),
    "span-7": (css: TCss<any>) => css.gridColumn("span 7 / span 7"),
    "span-8": (css: TCss<any>) => css.gridColumn("span 8 / span 8"),
    "span-9": (css: TCss<any>) => css.gridColumn("span 9 / span 9"),
    "span-10": (css: TCss<any>) => css.gridColumn("span 10 / span 10"),
    "span-11": (css: TCss<any>) => css.gridColumn("span 11 / span 11"),
    "span-12": (css: TCss<any>) => css.gridColumn("span 12 / span 12"),
    "start-1": (css: TCss<any>) => css.gridColumnStart(1),
    "start-2": (css: TCss<any>) => css.gridColumnStart(2),
    "start-3": (css: TCss<any>) => css.gridColumnStart(3),
    "start-4": (css: TCss<any>) => css.gridColumnStart(4),
    "start-5": (css: TCss<any>) => css.gridColumnStart(5),
    "start-6": (css: TCss<any>) => css.gridColumnStart(6),
    "start-7": (css: TCss<any>) => css.gridColumnStart(7),
    "start-8": (css: TCss<any>) => css.gridColumnStart(8),
    "start-9": (css: TCss<any>) => css.gridColumnStart(9),
    "start-10": (css: TCss<any>) => css.gridColumnStart(10),
    "start-11": (css: TCss<any>) => css.gridColumnStart(11),
    "start-12": (css: TCss<any>) => css.gridColumnStart(12),
    "start-13": (css: TCss<any>) => css.gridColumnStart(13),
    "start-auto": (css: TCss<any>) => css.gridColumnStart("auto"),
    "end-1": (css: TCss<any>) => css.gridColumnEnd(1),
    "end-2": (css: TCss<any>) => css.gridColumnEnd(2),
    "end-3": (css: TCss<any>) => css.gridColumnEnd(3),
    "end-4": (css: TCss<any>) => css.gridColumnEnd(4),
    "end-5": (css: TCss<any>) => css.gridColumnEnd(5),
    "end-6": (css: TCss<any>) => css.gridColumnEnd(6),
    "end-7": (css: TCss<any>) => css.gridColumnEnd(7),
    "end-8": (css: TCss<any>) => css.gridColumnEnd(8),
    "end-9": (css: TCss<any>) => css.gridColumnEnd(9),
    "end-10": (css: TCss<any>) => css.gridColumnEnd(10),
    "end-11": (css: TCss<any>) => css.gridColumnEnd(11),
    "end-12": (css: TCss<any>) => css.gridColumnEnd(12),
    "end-13": (css: TCss<any>) => css.gridColumnEnd(13),
    "end-auto": (css: TCss<any>) => css.gridColumnEnd("auto"),
    "gap-0": (css: TCss<any>) => css.columnGap(0),
    "gap-1": (css: TCss<any>) => css.columnGap("0.25rem"),
    "gap-2": (css: TCss<any>) => css.columnGap("0.5rem"),
    "gap-3": (css: TCss<any>) => css.columnGap("0.75rem"),
    "gap-4": (css: TCss<any>) => css.columnGap("1rem"),
    "gap-5": (css: TCss<any>) => css.columnGap("1.25rem"),
    "gap-6": (css: TCss<any>) => css.columnGap("1.5rem"),
    "gap-8": (css: TCss<any>) => css.columnGap("2rem"),
    "gap-10": (css: TCss<any>) => css.columnGap("2.5rem"),
    "gap-12": (css: TCss<any>) => css.columnGap("3rem"),
    "gap-16": (css: TCss<any>) => css.columnGap("4rem"),
    "gap-20": (css: TCss<any>) => css.columnGap("5rem"),
    "gap-24": (css: TCss<any>) => css.columnGap("6rem"),
    "gap-32": (css: TCss<any>) => css.columnGap("8rem"),
    "gap-40": (css: TCss<any>) => css.columnGap("10rem"),
    "gap-48": (css: TCss<any>) => css.columnGap("12rem"),
    "gap-56": (css: TCss<any>) => css.columnGap("14rem"),
    "gap-64": (css: TCss<any>) => css.columnGap("16rem"),
    "gap-px": (css: TCss<any>) => css.columnGap("1px"),
  };
  return (css: TCss<any>) => (
    value?:
      | "auto"
      | "span-1"
      | "span-2"
      | "span-3"
      | "span-4"
      | "span-5"
      | "span-6"
      | "span-7"
      | "span-8"
      | "span-9"
      | "span-10"
      | "span-11"
      | "span-12"
      | "start-1"
      | "start-2"
      | "start-3"
      | "start-4"
      | "start-5"
      | "start-6"
      | "start-7"
      | "start-8"
      | "start-9"
      | "start-10"
      | "start-11"
      | "start-12"
      | "start-13"
      | "start-auto"
      | "end-1"
      | "end-2"
      | "end-3"
      | "end-4"
      | "end-5"
      | "end-6"
      | "end-7"
      | "end-8"
      | "end-9"
      | "end-10"
      | "end-11"
      | "end-12"
      | "end-13"
      | "end-auto"
      | "gap-0"
      | "gap-1"
      | "gap-2"
      | "gap-3"
      | "gap-4"
      | "gap-5"
      | "gap-6"
      | "gap-8"
      | "gap-10"
      | "gap-12"
      | "gap-16"
      | "gap-20"
      | "gap-24"
      | "gap-32"
      | "gap-40"
      | "gap-48"
      | "gap-56"
      | "gap-64"
      | "gap-px"
  ) => (value ? values[value](css) : css.display("grid"));
})();

export const row = (() => {
  const values = {
    auto: (css: TCss<any>) => css.gridRow("auto"),
    "span-1": (css: TCss<any>) => css.gridRow("span 1 / span 1"),
    "span-2": (css: TCss<any>) => css.gridRow("span 2 / span 2"),
    "span-3": (css: TCss<any>) => css.gridRow("span 3 / span 3"),
    "span-4": (css: TCss<any>) => css.gridRow("span 4 / span 4"),
    "span-5": (css: TCss<any>) => css.gridRow("span 5 / span 5"),
    "span-6": (css: TCss<any>) => css.gridRow("span 6 / span 6"),
    "start-1": (css: TCss<any>) => css.gridRowStart(1),
    "start-2": (css: TCss<any>) => css.gridRowStart(2),
    "start-3": (css: TCss<any>) => css.gridRowStart(3),
    "start-4": (css: TCss<any>) => css.gridRowStart(4),
    "start-5": (css: TCss<any>) => css.gridRowStart(5),
    "start-6": (css: TCss<any>) => css.gridRowStart(6),
    "start-7": (css: TCss<any>) => css.gridRowStart(7),
    "start-auto": (css: TCss<any>) => css.gridRowStart("auto"),
    "end-1": (css: TCss<any>) => css.gridRowEnd(1),
    "end-2": (css: TCss<any>) => css.gridRowEnd(2),
    "end-3": (css: TCss<any>) => css.gridRowEnd(3),
    "end-4": (css: TCss<any>) => css.gridRowEnd(4),
    "end-5": (css: TCss<any>) => css.gridRowEnd(5),
    "end-6": (css: TCss<any>) => css.gridRowEnd(6),
    "end-7": (css: TCss<any>) => css.gridRowEnd(7),
    "end-auto": (css: TCss<any>) => css.gridColumnEnd("auto"),
    "gap-0": (css: TCss<any>) => css.rowGap(0),
    "gap-1": (css: TCss<any>) => css.rowGap("0.25rem"),
    "gap-2": (css: TCss<any>) => css.rowGap("0.5rem"),
    "gap-3": (css: TCss<any>) => css.rowGap("0.75rem"),
    "gap-4": (css: TCss<any>) => css.rowGap("1rem"),
    "gap-5": (css: TCss<any>) => css.rowGap("1.25rem"),
    "gap-6": (css: TCss<any>) => css.rowGap("1.5rem"),
    "gap-8": (css: TCss<any>) => css.rowGap("2rem"),
    "gap-10": (css: TCss<any>) => css.rowGap("2.5rem"),
    "gap-12": (css: TCss<any>) => css.rowGap("3rem"),
    "gap-16": (css: TCss<any>) => css.rowGap("4rem"),
    "gap-20": (css: TCss<any>) => css.rowGap("5rem"),
    "gap-24": (css: TCss<any>) => css.rowGap("6rem"),
    "gap-32": (css: TCss<any>) => css.rowGap("8rem"),
    "gap-40": (css: TCss<any>) => css.rowGap("10rem"),
    "gap-48": (css: TCss<any>) => css.rowGap("12rem"),
    "gap-56": (css: TCss<any>) => css.rowGap("14rem"),
    "gap-64": (css: TCss<any>) => css.rowGap("16rem"),
    "gap-px": (css: TCss<any>) => css.rowGap("1px"),
  };
  return (css: TCss<any>) => (
    value?:
      | "auto"
      | "span-1"
      | "span-2"
      | "span-3"
      | "span-4"
      | "span-5"
      | "span-6"
      | "start-1"
      | "start-2"
      | "start-3"
      | "start-4"
      | "start-5"
      | "start-6"
      | "start-7"
      | "start-auto"
      | "end-1"
      | "end-2"
      | "end-3"
      | "end-4"
      | "end-5"
      | "end-6"
      | "end-7"
      | "end-auto"
      | "gap-0"
      | "gap-1"
      | "gap-2"
      | "gap-3"
      | "gap-4"
      | "gap-5"
      | "gap-6"
      | "gap-8"
      | "gap-10"
      | "gap-12"
      | "gap-16"
      | "gap-20"
      | "gap-24"
      | "gap-32"
      | "gap-40"
      | "gap-48"
      | "gap-56"
      | "gap-64"
      | "gap-px"
  ) => (value ? values[value](css) : css.display("grid"));
})();

type TSpaceValue =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24
  | 32
  | 40
  | 48
  | 56
  | 64
  | "px";

const spaceValues = {
  0: 0,
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
  px: "1px",
};

export const gap = (css: TCss<any>) => (value: TSpaceValue) =>
  css.gap(spaceValues[value] as any);

export const p = (css: TCss<any>) => (value: TSpaceValue) =>
  css.compose(
    css.paddingTop(spaceValues[value]),
    css.paddingRight(spaceValues[value]),
    css.paddingBottom(spaceValues[value]),
    css.paddingLeft(spaceValues[value])
  );

export const py = (css: TCss<any>) => (value: TSpaceValue) =>
  css.compose(
    css.paddingTop(spaceValues[value]),
    css.paddingBottom(spaceValues[value])
  );

export const px = (css: TCss<any>) => (value: TSpaceValue) =>
  css.compose(
    css.paddingRight(spaceValues[value]),
    css.paddingLeft(spaceValues[value])
  );

export const pt = (css: TCss<any>) => (value: TSpaceValue) =>
  css.paddingTop(spaceValues[value]);

export const pr = (css: TCss<any>) => (value: TSpaceValue) =>
  css.paddingRight(spaceValues[value]);

export const pb = (css: TCss<any>) => (value: TSpaceValue) =>
  css.paddingBottom(spaceValues[value]);

export const pl = (css: TCss<any>) => (value: TSpaceValue) =>
  css.paddingLeft(spaceValues[value]);

type TNegativeSpaceValue =
  | -1
  | -2
  | -3
  | -4
  | -5
  | -6
  | -8
  | -10
  | -12
  | -14
  | -16
  | -20
  | -24
  | -32
  | -40
  | -48
  | -56
  | -64;

const negativeSpaceValues = {
  "-1": "-0.25rem",
  "-2": "-0.5rem",
  "-3": "-0.75rem",
  "-4": "-1rem",
  "-5": "-1.25rem",
  "-6": "-1.5rem",
  "-8": "-2rem",
  "-10": "-2.5rem",
  "-12": "-3rem",
  "-16": "-4rem",
  "-20": "-5rem",
  "-24": "-6rem",
  "-32": "-8rem",
  "-40": "-10rem",
  "-48": "-12rem",
  "-56": "-14rem",
  "-64": "-16rem",
  "-px": "-1px",
};

export const m = (css: TCss<any>) => (
  value: TSpaceValue | TNegativeSpaceValue | "auto"
) =>
  css.compose(
    css.marginTop(
      value === "auto"
        ? "auto"
        : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
    ),
    css.marginRight(
      value === "auto"
        ? "auto"
        : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
    ),
    css.marginBottom(
      value === "auto"
        ? "auto"
        : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
    ),
    css.marginLeft(
      value === "auto"
        ? "auto"
        : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
    )
  );

export const my = (css: TCss<any>) => (
  value: TSpaceValue | TNegativeSpaceValue | "auto"
) =>
  css.compose(
    css.marginTop(
      value === "auto"
        ? "auto"
        : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
    ),
    css.marginBottom(
      value === "auto"
        ? "auto"
        : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
    )
  );

export const mx = (css: TCss<any>) => (
  value: TSpaceValue | TNegativeSpaceValue | "auto"
) =>
  css.compose(
    css.marginRight(
      value === "auto"
        ? "auto"
        : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
    ),

    css.marginLeft(
      value === "auto"
        ? "auto"
        : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
    )
  );

export const mt = (css: TCss<any>) => (
  value: TSpaceValue | TNegativeSpaceValue | "auto"
) =>
  css.marginTop(
    value === "auto"
      ? "auto"
      : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
  );

export const mr = (css: TCss<any>) => (
  value: TSpaceValue | TNegativeSpaceValue | "auto"
) =>
  css.marginRight(
    value === "auto"
      ? "auto"
      : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
  );

export const mb = (css: TCss<any>) => (
  value: TSpaceValue | TNegativeSpaceValue | "auto"
) =>
  css.marginBottom(
    value === "auto"
      ? "auto"
      : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
  );

export const ml = (css: TCss<any>) => (
  value: TSpaceValue | TNegativeSpaceValue | "auto"
) =>
  css.marginLeft(
    value === "auto"
      ? "auto"
      : (spaceValues as any)[value] || (negativeSpaceValues as any)[value]
  );
