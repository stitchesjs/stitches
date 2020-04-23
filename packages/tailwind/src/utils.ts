import { IConfig, TCss, TUtility } from "@stitches/css";

export interface IThemeValue {
  [key: string]: string;
  [key: number]: string;
}

export interface ITheme {
  screens?: IThemeValue;
  colors?: IThemeValue;
  spacing?: IThemeValue;
  backgroundColor?: IThemeValue;
  backgroundPosition?: IThemeValue;
  backgroundSize?: IThemeValue;
  borderColor?: IThemeValue;
  borderRadius?: IThemeValue;
  borderWidth?: IThemeValue;
  boxShadow?: IThemeValue;
  container?: IThemeValue;
  cursor?: IThemeValue;
  divideColor?: IThemeValue;
  divideWidth?: IThemeValue;
  fill?: IThemeValue;
  flex?: IThemeValue;
  flexGrow?: IThemeValue;
  flexShrink?: IThemeValue;
  fontFamily?: IThemeValue;
  fontSize?: IThemeValue;
  fontWeight?: IThemeValue;
  height?: IThemeValue;
  inset?: IThemeValue;
  letterSpacing?: IThemeValue;
  lineHeight?: IThemeValue;
  listStyleType?: IThemeValue;
  margin?: IThemeValue;
  maxHeight?: IThemeValue;
  maxWidth?: IThemeValue;
  minHeight?: IThemeValue;
  minWidth?: IThemeValue;
  objectPosition?: IThemeValue;
  opacity?: IThemeValue;
  order?: IThemeValue;
  padding?: IThemeValue;
  placeholderColor?: IThemeValue;
  space?: IThemeValue;
  stroke?: IThemeValue;
  strokeWidth?: IThemeValue;
  textColor?: IThemeValue;
  width?: IThemeValue;
  zIndex?: IThemeValue;
  gap?: IThemeValue;
  gridTemplateColumns?: IThemeValue;
  gridColumn?: IThemeValue;
  gridColumnStart?: IThemeValue;
  gridColumnEnd?: IThemeValue;
  gridTemplateRows?: IThemeValue;
  gridRow?: IThemeValue;
  gridRowStart?: IThemeValue;
  gridRowEnd?: IThemeValue;
  transformOrigin?: IThemeValue;
  scale?: IThemeValue;
  rotate?: IThemeValue;
  translate?: IThemeValue;
  skew?: IThemeValue;
  transitionProperty?: IThemeValue;
  transitionTimingFunction?: IThemeValue;
  transitionDuration?: IThemeValue;
  transitionDelay?: IThemeValue;
}

export interface ITailwindConfig extends IConfig {
  theme: ITheme;
  utils: {
    container: TTailwindUtility<void>;
    box: TTailwindUtility<"border" | "content">;
    hidden: TTailwindUtility<void>;
    block: TTailwindUtility<void>;
    inlineBlock: TTailwindUtility<void>;
    inline: TTailwindUtility<void>;
    inlineFlex: TTailwindUtility<void>;
    table: TTailwindUtility<
      "caption" | "cell" | "column" | "column-group" | "auto" | "fixed" | void
    >;
    float: TTailwindUtility<"right" | "left" | "none">;
    clearfix: TTailwindUtility<void>;
    clear: TTailwindUtility<"left" | "right" | "both" | "none">;
    order: TTailwindUtility;
    object: TTailwindUtility<
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
    >;
    overflow: TTailwindUtility<
      "hidden" | "visible" | "scroll" | "touch" | "auto"
    >;
    overflowX: TTailwindUtility<"hidden" | "visible" | "scroll" | "auto">;
    overflowY: TTailwindUtility<"hidden" | "visible" | "scroll" | "auto">;
    grid: TTailwindUtility<
      void | "flow-row" | "flow-col" | "flow-row-dense" | "flow-col-dense"
    >;
    col: TTailwindUtility;
    row: TTailwindUtility;
    align: TTailwindUtility<
      "baseline" | "top" | "middle" | "bottom" | "text-top" | "text-bottom"
    >;
    whitespace: TTailwindUtility<
      "normal" | "no-wrap" | "pre" | "pre-line" | "pre-wrap"
    >;
    breakText: TTailwindUtility<"normal" | "words" | "all">;
    bg: TTailwindUtility<
      | "fixed"
      | "local"
      | "scroll"
      | "bottom"
      | "center"
      | "left"
      | "left-bottom"
      | "left-top"
      | "right"
      | "right-bottom"
      | "right-top"
      | "top"
      | "repeat"
      | "no-repeat"
      | "repeat-x"
      | "repeat-y"
      | "repeat-round"
      | "repeat-space"
      | "auto"
      | "cover"
      | "contain"
    >;
    appearance: TTailwindUtility<"none">;
    outline: TTailwindUtility<"none">;
    pointerEvents: TTailwindUtility<"none" | "auto">;
    resize: TTailwindUtility<"none" | "x" | "y">;
    staticPosition: TTailwindUtility<void>;
    fixed: TTailwindUtility<void>;
    absolute: TTailwindUtility<void>;
    relative: TTailwindUtility<void>;
    sticky: TTailwindUtility<void>;
    top: TTailwindUtility;
    right: TTailwindUtility;
    bottom: TTailwindUtility;
    left: TTailwindUtility;
    inset: TTailwindUtility;
    insetX: TTailwindUtility;
    insetY: TTailwindUtility;
    visible: TTailwindUtility<void>;
    invisible: TTailwindUtility<void>;
    z: TTailwindUtility;
    flex: TTailwindUtility<
      | void
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
    >;
    items: TTailwindUtility<
      "stretch" | "start" | "center" | "end" | "baseline"
    >;
    content: TTailwindUtility<
      "start" | "center" | "end" | "between" | "around"
    >;
    self: TTailwindUtility<"auto" | "start" | "center" | "end" | "stretch">;
    justify: TTailwindUtility<
      "between" | "start" | "center" | "end" | "around"
    >;
    gap: TTailwindUtility;
    p: TTailwindUtility;
    py: TTailwindUtility;
    px: TTailwindUtility;
    pt: TTailwindUtility;
    pr: TTailwindUtility;
    pb: TTailwindUtility;
    pl: TTailwindUtility;
    m: TTailwindUtility;
    my: TTailwindUtility;
    mx: TTailwindUtility;
    mt: TTailwindUtility;
    mr: TTailwindUtility;
    mb: TTailwindUtility;
    ml: TTailwindUtility;
    w: TTailwindUtility;
    minWidth: TTailwindUtility;
    minHeight: TTailwindUtility;
    maxWidth: TTailwindUtility;
    maxHeight: TTailwindUtility;
    h: TTailwindUtility;
    font: TTailwindUtility;
    text: TTailwindUtility<"left" | "right" | "center" | "justify">;
    antialiased: TTailwindUtility<void>;
    subpixelAntialiased: TTailwindUtility<void>;
    italic: TTailwindUtility<void>;
    notItalic: TTailwindUtility<void>;
    tracking: TTailwindUtility;
    leading: TTailwindUtility;
    list: TTailwindUtility<"inside" | "outside">;
    placeholder: TTailwindUtility;
    underline: TTailwindUtility<void>;
    lineThrough: TTailwindUtility<void>;
    noUnderline: TTailwindUtility<void>;
    uppercase: TTailwindUtility<void>;
    lowercase: TTailwindUtility<void>;
    capitalize: TTailwindUtility<void>;
    normalCase: TTailwindUtility<void>;
    truncate: TTailwindUtility<void>;
    border: TTailwindUtility<
      void | "solid" | "dashed" | "dotted" | "double" | "none"
    >;
    borderT: TTailwindUtility<void>;
    borderR: TTailwindUtility<void>;
    borderB: TTailwindUtility<void>;
    borderL: TTailwindUtility<void>;
    rounded: TTailwindUtility<void>;
    roundedT: TTailwindUtility<void>;
    roundedR: TTailwindUtility<void>;
    roundedB: TTailwindUtility<void>;
    roundedL: TTailwindUtility<void>;
    roundedTL: TTailwindUtility<void>;
    roundedTR: TTailwindUtility<void>;
    roundedBR: TTailwindUtility<void>;
    roundedBL: TTailwindUtility<void>;
    shadow: TTailwindUtility<void>;
    opacity: TTailwindUtility;
    transition: TTailwindUtility<void>;
    duration: TTailwindUtility;
    ease: TTailwindUtility;
    transform: TTailwindUtility<void>;
    scale: TTailwindUtility;
    scaleX: TTailwindUtility;
    scaleY: TTailwindUtility;
    rotate: TTailwindUtility;
    translateX: TTailwindUtility;
    translateY: TTailwindUtility;
    skewX: TTailwindUtility;
    skewY: TTailwindUtility;
    origin: TTailwindUtility;
    cursor: TTailwindUtility<void>;
    select: TTailwindUtility<"none" | "text" | "all" | "auto">;
    fill: TTailwindUtility;
    stroke: TTailwindUtility;
    srOnly: TTailwindUtility;
    notSrOnly: TTailwindUtility;
  };
}

export type TTailwindUtility<V = never> = TUtility<
  [V, string?],
  ITailwindConfig
>;

const createUtilityValues = <
  T extends {
    [key: string]: (css: TCss<ITailwindConfig>, pseudo: string) => string;
  }
>(
  values: T
) => values;

const createUtility = <C = TCss<ITailwindConfig>>(
  cb:
    | ((css: C, value: any, pseudo?: string) => string)
    | {
        [key: string]: (css: C, pseudo?: string) => string;
      },
  {
    theme,
    values = {},
    emptyValue,
  }: {
    theme?: string;
    values?: {
      [key: string]: string;
    };
    emptyValue?: (css: C, pseudo?: string) => string;
  } = {}
) => {
  return (css: C, config: ITailwindConfig) => (value: any, pseudo?: string) => {
    const evaluatedTheme = theme ? (config.theme as any)[theme] : {};
    const evaluatedValue =
      evaluatedTheme[value] ||
      evaluatedTheme.default ||
      (typeof values[value] === "function"
        ? (values as any)[value](css, pseudo)
        : values[value]);
    if (evaluatedValue) {
      return typeof cb === "function"
        ? cb(css, evaluatedValue, pseudo)
        : cb[evaluatedValue](css, pseudo);
    } else if (emptyValue) {
      return emptyValue(css, pseudo);
    }

    return showWarning(value);
  };
};

const showWarning = (value: string) => {
  // tslint:disable-next-line: no-console
  console.warn(
    `@stitches/tailwind - The value "${value}" is not a valid value`
  );

  return "";
};

export const container: ITailwindConfig["utils"]["container"] = (
  css,
  config
) => () =>
  css.compose(
    css.width("100%"),
    ...Object.keys(config.theme.screens || {}).reduce(
      (aggr, screen) =>
        aggr.concat(
          (css as any)[screen].maxWidth(config.theme.screens![screen])
        ),
      []
    )
  );

export const box: ITailwindConfig["utils"]["box"] = createUtility(
  (css, value, pseudo) => css.boxSizing(value, pseudo),
  {
    values: {
      border: "border-box",
      content: "content-box",
    },
  }
);

export const hidden: ITailwindConfig["utils"]["hidden"] = (css) => () =>
  css.visibility("hidden");

export const block: ITailwindConfig["utils"]["block"] = (css) => () =>
  css.display("block");

export const inlineBlock: ITailwindConfig["utils"]["inlineBlock"] = (
  css
) => () => css.display("inline-block");

export const inline: ITailwindConfig["utils"]["inline"] = (css) => () =>
  css.display("inline");

export const inlineFlex: ITailwindConfig["utils"]["inlineFlex"] = (css) => () =>
  css.display("inline-flex");

export const table: ITailwindConfig["utils"]["table"] = createUtility(
  {
    caption: (css, pseudo) => css.display("table-caption", pseudo),
    cell: (css, pseudo) => css.display("table-cell", pseudo),
    column: (css, pseudo) => css.display("table-column", pseudo),
    "column-group": (css, pseudo) => css.display("table-column-group", pseudo),
    auto: (css, pseudo) => css.tableLayout("auto", pseudo),
    fixed: (css, pseudo) => css.tableLayout("fixed", pseudo),
  },
  {
    emptyValue: (css, pseudo) => css.display("table", pseudo),
  }
);

export const float: ITailwindConfig["utils"]["float"] = createUtility(
  (css, value, pseudo) => css.float(value, pseudo),
  {
    values: {
      left: "left",
      right: "right",
      none: "none",
    },
  }
);

export const clearfix: ITailwindConfig["utils"]["clearfix"] = (css) => () =>
  css.compose(
    css.content("", "::after"),
    css.display("table", "::after"),
    css.clear("both", "::after")
  );

export const clear: ITailwindConfig["utils"]["clear"] = createUtility(
  (css, value, pseudo) => css.clear(value, pseudo),
  {
    values: {
      left: "left",
      right: "right",
      none: "none",
      both: "both",
    },
  }
);

export const order: ITailwindConfig["utils"]["order"] = createUtility(
  (css, value, pseudo) => css.order(value, pseudo),
  {
    theme: "order",
  }
);

export const object: ITailwindConfig["utils"]["object"] = createUtility({
  contain: (css, pseudo) => css.objectFit("contain", pseudo),
  cover: (css, pseudo) => css.objectFit("cover", pseudo),
  fill: (css, pseudo) => css.objectFit("fill", pseudo),
  none: (css, pseudo) => css.objectFit("none", pseudo),
  "scale-down": (css, pseudo) => css.objectFit("scale-down", pseudo),
  bottom: (css, pseudo) => css.objectPosition("bottom", pseudo),
  center: (css, pseudo) => css.objectPosition("center", pseudo),
  left: (css, pseudo) => css.objectPosition("left", pseudo),
  "left-bottom": (css, pseudo) => css.objectPosition("left bottom", pseudo),
  "left-top": (css, pseudo) => css.objectPosition("left top", pseudo),
  right: (css, pseudo) => css.objectPosition("right", pseudo),
  "right-bottom": (css, pseudo) => css.objectPosition("right bottom", pseudo),
  "right-top": (css, pseudo) => css.objectPosition("right top", pseudo),
  top: (css, pseudo) => css.objectPosition("top", pseudo),
});

const overflowValues = {
  hidden: "hidden",
  visible: "visible",
  scroll: "scroll",
  auto: "auto",
} as any;

export const overflow: ITailwindConfig["utils"]["overflow"] = createUtility(
  (css, value, pseudo) =>
    value === "touch"
      ? (css as any).WebkitOverflowScrolling(value, pseudo)
      : css.overflow(value, pseudo),
  { values: overflowValues }
);

export const overflowX: ITailwindConfig["utils"]["overflowX"] = createUtility(
  (css, value, pseudo) => css.overflowX(value, pseudo),
  { values: overflowValues }
);

export const overflowY: ITailwindConfig["utils"]["overflowY"] = createUtility(
  (css, value, pseudo) => css.overflowY(value, pseudo),
  { values: overflowValues }
);

export const staticPosition: ITailwindConfig["utils"]["staticPosition"] = (
  css
) => (_, pseudo) => css.position("static", pseudo);

export const fixed: ITailwindConfig["utils"]["fixed"] = (css) => (_, pseudo) =>
  css.position("fixed", pseudo);

export const absolute: ITailwindConfig["utils"]["absolute"] = (css) => (
  _,
  pseudo
) => css.position("absolute", pseudo);

export const relative: ITailwindConfig["utils"]["relative"] = (css) => (
  _,
  pseudo
) => css.position("relative", pseudo);

export const sticky: ITailwindConfig["utils"]["sticky"] = (css) => (
  _,
  pseudo
) => css.position("sticky", pseudo);

export const top: ITailwindConfig["utils"]["top"] = createUtility(
  (css, value, pseudo) => css.top(value, pseudo),
  {
    theme: "inset",
  }
);

export const right: ITailwindConfig["utils"]["right"] = createUtility(
  (css, value, pseudo) => css.right(value, pseudo),
  {
    theme: "inset",
  }
);

export const bottom: ITailwindConfig["utils"]["bottom"] = createUtility(
  (css, value, pseudo) => css.bottom(value, pseudo),
  {
    theme: "inset",
  }
);

export const left: ITailwindConfig["utils"]["left"] = createUtility(
  (css, value, pseudo) => css.left(value, pseudo),
  {
    theme: "inset",
  }
);

export const inset: ITailwindConfig["utils"]["inset"] = createUtility(
  (css, value, pseudo) =>
    css.compose(
      css.top(value, pseudo),
      css.right(value, pseudo),
      css.bottom(value, pseudo),
      css.left(value, pseudo)
    ),
  {
    theme: "inset",
  }
);

export const insetX: ITailwindConfig["utils"]["insetX"] = createUtility(
  (css, value, pseudo) =>
    css.compose(css.right(value, pseudo), css.left(value, pseudo)),
  {
    theme: "inset",
  }
);

export const insetY: ITailwindConfig["utils"]["insetY"] = createUtility(
  (css, value, pseudo) =>
    css.compose(css.top(value, pseudo), css.bottom(value, pseudo)),
  {
    theme: "inset",
  }
);

export const visible: ITailwindConfig["utils"]["visible"] = (css) => (
  _,
  pseudo
) => css.visibility("visible", pseudo);

export const invisible: ITailwindConfig["utils"]["invisible"] = (css) => (
  _,
  pseudo
) => css.visibility("hidden", pseudo);

export const z: ITailwindConfig["utils"]["z"] = createUtility(
  (css, value, pseudo) => css.zIndex(value, pseudo),
  {
    theme: "zIndex",
  }
);

export const flex: ITailwindConfig["utils"]["flex"] = createUtility(
  {
    row: (css, pseudo) => css.flexDirection("row", pseudo),
    "row-reverse": (css, pseudo) => css.flexDirection("row-reverse", pseudo),
    col: (css, pseudo) => css.flexDirection("column", pseudo),
    "col-reverse": (css, pseudo) => css.flexDirection("column-reverse", pseudo),
    "no-wrap": (css, pseudo) => css.flexWrap("nowrap", pseudo),
    wrap: (css, pseudo) => css.flexWrap("wrap", pseudo),
    "wrap-reverse": (css, pseudo) => css.flexWrap("wrap-reverse", pseudo),
    initial: (css, pseudo) =>
      css.compose(
        css.flexGrow(0, pseudo),
        css.flexShrink(1, pseudo),
        css.flexBasis("auto", pseudo)
      ),
    "1": (css, pseudo) =>
      css.compose(
        css.flexGrow(1, pseudo),
        css.flexShrink(1, pseudo),
        css.flexBasis("0%", pseudo)
      ),
    auto: (css, pseudo) =>
      css.compose(
        css.flexGrow(1, pseudo),
        css.flexShrink(1, pseudo),
        css.flexBasis("auto", pseudo)
      ),
    none: (css, pseudo) =>
      css.compose(
        css.flexGrow(0, pseudo),
        css.flexShrink(0, pseudo),
        css.flexBasis("auto", pseudo)
      ),
    grow: (css, pseudo) => css.flexGrow(1, pseudo),
    "grow-0": (css, pseudo) => css.flexGrow(0, pseudo),
    shrink: (css, pseudo) => css.flexShrink(1, pseudo),
    "shrink-0": (css, pseudo) => css.flexShrink(0, pseudo),
  },
  {
    emptyValue: (css, pseudo) => css.display("flex", pseudo),
  }
);

export const items: ITailwindConfig["utils"]["items"] = createUtility(
  (css, value, pseudo) => css.alignItems(value, pseudo),
  {
    values: {
      stretch: "stretch",
      start: "flex-start",
      center: "center",
      end: "flex-end",
      baseline: "baseline",
    },
  }
);

export const content: ITailwindConfig["utils"]["content"] = createUtility(
  (css, value, pseudo) => css.alignContent(value, pseudo),
  {
    values: {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      between: "between",
      around: "around",
    },
  }
);

export const self: ITailwindConfig["utils"]["self"] = createUtility(
  (css, value, pseudo) => css.alignSelf(value, pseudo),
  {
    values: {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      auto: "auto",
      stretch: "stretch",
    },
  }
);

export const justify: ITailwindConfig["utils"]["justify"] = createUtility(
  (css, value, pseudo) => css.justifyContent(value, pseudo),
  {
    values: {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      between: "between",
      around: "around",
    },
  }
);

export const grid: ITailwindConfig["utils"]["grid"] = (css, config) => (
  value,
  pseudo
) => {
  if (!value) {
    return css.display("grid");
  }
  if (
    config.theme.gridTemplateColumns &&
    config.theme.gridTemplateColumns[value]
  ) {
    return css.gridTemplateColumns(
      config.theme.gridTemplateColumns[value],
      pseudo
    );
  }
  if (config.theme.gridTemplateRows && config.theme.gridTemplateRows[value]) {
    return css.gridTemplateRows(config.theme.gridTemplateRows[value], pseudo);
  }

  return css.gridAutoFlow(
    ({
      "flow-row": "row",
      "flow-col": "column",
      "flow-row-dense": "row dense",
      "flow-col-dense": "column dense",
    }[value] as any) || showWarning(value),
    pseudo
  );
};

export const col: ITailwindConfig["utils"]["col"] = (css, config) => (
  value: any,
  pseudo
) => {
  if (config.theme.gridColumn && config.theme.gridColumn[value]) {
    return css.gridColumn(config.theme.gridColumn[value] as any, pseudo);
  }
  if (config.theme.gridColumnStart && config.theme.gridColumnStart[value]) {
    return css.gridColumnStart(
      config.theme.gridColumnStart[value] as any,
      pseudo
    );
  }
  if (config.theme.gridColumnEnd && config.theme.gridColumnEnd[value]) {
    return css.gridColumnEnd(config.theme.gridColumnEnd[value] as any, pseudo);
  }
  if (config.theme.gap && config.theme.gap[value]) {
    return css.columnGap(config.theme.gap[value], pseudo);
  }

  return showWarning(value);
};

export const row: ITailwindConfig["utils"]["row"] = (css, config) => (
  value: any,
  pseudo
) => {
  if (config.theme.gridRow && config.theme.gridRow[value]) {
    return css.gridRow(config.theme.gridRow[value] as any, pseudo);
  }
  if (config.theme.gridRowStart && config.theme.gridRowStart[value]) {
    return css.gridRowStart(config.theme.gridRowStart[value] as any, pseudo);
  }
  if (config.theme.gridRowEnd && config.theme.gridRowEnd[value]) {
    return css.gridRowEnd(config.theme.gridRowEnd[value] as any, pseudo);
  }
  if (config.theme.gap && config.theme.gap[value]) {
    return css.rowGap(config.theme.gap[value], pseudo);
  }

  return showWarning(value);
};

export const gap: ITailwindConfig["utils"]["gap"] = createUtility(
  (css, value, pseudo) => css.gap(value, pseudo),
  {
    theme: "gap",
  }
);

export const p: ITailwindConfig["utils"]["p"] = createUtility(
  (css, value, pseudo) =>
    css.compose(
      css.paddingTop(value, pseudo),
      css.paddingRight(value, pseudo),
      css.paddingBottom(value, pseudo),
      css.paddingLeft(value, pseudo)
    ),
  {
    theme: "padding",
  }
);

export const py: ITailwindConfig["utils"]["py"] = createUtility(
  (css, value, pseudo) =>
    css.compose(
      css.paddingTop(value, pseudo),
      css.paddingBottom(value, pseudo)
    ),
  {
    theme: "padding",
  }
);

export const px: ITailwindConfig["utils"]["px"] = createUtility(
  (css, value, pseudo) =>
    css.compose(
      css.paddingLeft(value, pseudo),
      css.paddingRight(value, pseudo)
    ),
  {
    theme: "padding",
  }
);

export const pt: ITailwindConfig["utils"]["pt"] = createUtility(
  (css, value, pseudo) => css.paddingTop(value, pseudo),

  {
    theme: "padding",
  }
);

export const pr: ITailwindConfig["utils"]["pr"] = createUtility(
  (css, value, pseudo) => css.paddingRight(value, pseudo),
  {
    theme: "padding",
  }
);

export const pb: ITailwindConfig["utils"]["pb"] = createUtility(
  (css, value, pseudo) => css.paddingBottom(value, pseudo),
  {
    theme: "padding",
  }
);

export const pl: ITailwindConfig["utils"]["pl"] = createUtility(
  (css, value, pseudo) => css.paddingLeft(value, pseudo),
  {
    theme: "padding",
  }
);

export const m: ITailwindConfig["utils"]["m"] = createUtility(
  (css, value, pseudo) =>
    css.compose(
      css.marginTop(value, pseudo),
      css.marginRight(value, pseudo),
      css.marginBottom(value, pseudo),
      css.marginLeft(value, pseudo)
    ),
  {
    theme: "margin",
  }
);

export const my: ITailwindConfig["utils"]["my"] = createUtility(
  (css, value, pseudo) =>
    css.compose(css.marginTop(value, pseudo), css.marginBottom(value, pseudo)),
  {
    theme: "margin",
  }
);

export const mx: ITailwindConfig["utils"]["mx"] = createUtility(
  (css, value, pseudo) =>
    css.compose(css.marginLeft(value, pseudo), css.marginRight(value, pseudo)),
  {
    theme: "margin",
  }
);

export const mt: ITailwindConfig["utils"]["mt"] = createUtility(
  (css, value, pseudo) => css.marginTop(value, pseudo),
  {
    theme: "margin",
  }
);

export const mr: ITailwindConfig["utils"]["mr"] = createUtility(
  (css, value, pseudo) => css.marginRight(value, pseudo),
  {
    theme: "margin",
  }
);

export const mb: ITailwindConfig["utils"]["mb"] = createUtility(
  (css, value, pseudo) => css.marginBottom(value, pseudo),
  {
    theme: "margin",
  }
);

export const ml: ITailwindConfig["utils"]["ml"] = createUtility(
  (css, value, pseudo) => css.marginLeft(value, pseudo),
  {
    theme: "margin",
  }
);

export const w: ITailwindConfig["utils"]["w"] = createUtility(
  (css, value, pseudo) => css.width(value, pseudo),
  {
    theme: "width",
  }
);

export const minWidth: ITailwindConfig["utils"]["minWidth"] = createUtility(
  (css, value, pseudo) => css.minWidth(value, pseudo),
  {
    theme: "minWidth",
  }
);

export const minHeight: ITailwindConfig["utils"]["minHeight"] = createUtility(
  (css, value, pseudo) => css.minHeight(value, pseudo),
  {
    theme: "minHeight",
  }
);

export const maxWidth: ITailwindConfig["utils"]["maxWidth"] = createUtility(
  (css, value, pseudo) => css.maxWidth(value, pseudo),
  {
    theme: "maxWidth",
  }
);

export const maxHeight: ITailwindConfig["utils"]["maxHeight"] = createUtility(
  (css, value, pseudo) => css.maxHeight(value, pseudo),
  {
    theme: "maxHeight",
  }
);

export const h: ITailwindConfig["utils"]["h"] = createUtility(
  (css, value, pseudo) => css.height(value, pseudo),
  {
    theme: "height",
  }
);

export const font: ITailwindConfig["utils"]["font"] = (css, config) => (
  value: any,
  pseudo
) => {
  if (config.theme.fontFamily && config.theme.fontFamily[value]) {
    return css.fontFamily(config.theme.fontFamily[value] as any, pseudo);
  }
  if (config.theme.fontWeight && config.theme.fontWeight[value]) {
    return css.fontWeight(Number(config.theme.fontWeight[value]), pseudo);
  }

  return showWarning(value);
};

export const text: ITailwindConfig["utils"]["text"] = (css, config) => (
  value: any,
  pseudo
) => {
  if (config.theme.textColor && config.theme.textColor[value]) {
    return css.color(config.theme.textColor[value] as any, pseudo);
  }

  if (config.theme.fontSize && config.theme.fontSize[value]) {
    return css.fontSize(config.theme.fontSize[value], pseudo);
  }

  return css.textAlign(
    ({
      left: "left",
      right: "right",
      center: "center",
      justify: "justify",
    } as any)[value] || showWarning(value),
    pseudo
  );
};

export const antialiased: ITailwindConfig["utils"]["antialiased"] = (
  css,
  pseudo
) => () =>
  css.compose(
    (css as any).WebkitFontSmoothing("antialiased", pseudo),
    (css as any).MozOsxFontSmoothing("grayscale", pseudo)
  );

export const subpixelAntialiased: ITailwindConfig["utils"]["subpixelAntialiased"] = (
  css,
  pseudo
) => () =>
  css.compose(
    (css as any).WebkitFontSmoothing("auto", pseudo),
    (css as any).MozOsxFontSmoothing("auto", pseudo)
  );

export const italic: ITailwindConfig["utils"]["italic"] = (css) => (
  _,
  pseudo
) => css.fontStyle("italic", pseudo);

export const notItalic: ITailwindConfig["utils"]["notItalic"] = (css) => (
  _,
  pseudo
) => css.fontStyle("normal", pseudo);

export const tracking: ITailwindConfig["utils"]["tracking"] = createUtility(
  (css, value, pseudo) => css.letterSpacing(value, pseudo),
  {
    theme: "letterSpacing",
  }
);

export const leading: ITailwindConfig["utils"]["leading"] = createUtility(
  (css, value, pseudo) => css.lineHeight(value, pseudo),
  {
    theme: "lineHeight",
  }
);

export const list: ITailwindConfig["utils"]["list"] = (css, config) => (
  value: any,
  pseudo
) => {
  if (config.theme.listStyleType && config.theme.listStyleType[value]) {
    return css.listStyleType(config.theme.listStyleType[value] as any, pseudo);
  }

  return css.listStylePosition(
    ({
      inside: "inside",
      outside: "outside",
    } as any)[value] || showWarning(value),
    pseudo
  );
};

export const placeholder: ITailwindConfig["utils"]["placeholder"] = createUtility(
  (css, value, pseudo) => css.color(value, `${pseudo}::placeholder`),
  {
    theme: "placeholderColor",
  }
);

export const underline: ITailwindConfig["utils"]["underline"] = (css) => (
  _,
  pseudo
) => css.textDecoration("underline", pseudo);

export const lineThrough: ITailwindConfig["utils"]["lineThrough"] = (css) => (
  _,
  pseudo
) => css.textDecoration("line-through", pseudo);

export const noUnderline: ITailwindConfig["utils"]["noUnderline"] = (css) => (
  _,
  pseudo
) => css.textDecoration("none", pseudo);

export const uppercase: ITailwindConfig["utils"]["uppercase"] = (css) => (
  _,
  pseudo
) => css.textTransform("uppercase", pseudo);
export const lowercase: ITailwindConfig["utils"]["lowercase"] = (css) => (
  _,
  pseudo
) => css.textTransform("lowercase", pseudo);

export const capitalize: ITailwindConfig["utils"]["capitalize"] = (css) => (
  _,
  pseudo
) => css.textTransform("capitalize", pseudo);

export const normalCase: ITailwindConfig["utils"]["normalCase"] = (css) => (
  _,
  pseudo
) => css.textTransform("none", pseudo);

export const align: ITailwindConfig["utils"]["align"] = createUtility(
  (css, value, pseudo) => css.verticalAlign(value, pseudo),
  {
    values: {
      baseline: "baseline",
      top: "top",
      middle: "middle",
      bottom: "bottom",
      "text-top": "text-top",
      "text-bottom": "text-bottom",
    },
  }
);

export const whitespace: ITailwindConfig["utils"]["whitespace"] = createUtility(
  (css, value, pseudo) => css.whiteSpace(value, pseudo),
  {
    values: {
      normal: "normal",
      "no-wrap": "nowrap",
      pre: "pre",
      "pre-line": "pre-line",
      "pre-wrap": "pre-wrap",
    },
  }
);

export const breakText: ITailwindConfig["utils"]["breakText"] = createUtility({
  normal: (css, pseudo) =>
    css.compose(
      css.wordBreak("normal", pseudo),
      css.overflowWrap("normal", pseudo)
    ),
  words: (css, pseudo) => css.overflowWrap("break-word", pseudo),
  all: (css, pseudo) => css.wordBreak("break-all", pseudo),
});

export const truncate: ITailwindConfig["utils"]["truncate"] = (css) => (
  _,
  pseudo
) =>
  css.compose(
    css.overflow("hidden", pseudo),
    css.textOverflow("ellipsis", pseudo),
    css.whiteSpace("nowrap", pseudo)
  );

export const bg = ((): ITailwindConfig["utils"]["bg"] => {
  const values = createUtilityValues({
    fixed: (css, pseudo) => css.backgroundAttachment("fixed", pseudo),
    local: (css, pseudo) => css.backgroundAttachment("local", pseudo),
    scroll: (css, pseudo) => css.backgroundAttachment("scroll", pseudo),
    bottom: (css, pseudo) => css.backgroundPosition("bottom", pseudo),
    center: (css, pseudo) => css.backgroundPosition("center", pseudo),
    left: (css, pseudo) => css.backgroundPosition("left", pseudo),
    "left-bottom": (css, pseudo) =>
      css.backgroundPosition("left bottom", pseudo),
    "left-top": (css, pseudo) => css.backgroundPosition("left top", pseudo),
    right: (css, pseudo) => css.backgroundPosition("right", pseudo),
    "right-bottom": (css, pseudo) =>
      css.backgroundPosition("right bottom", pseudo),
    "right-top": (css, pseudo) => css.backgroundPosition("right top", pseudo),
    top: (css, pseudo) => css.backgroundPosition("top", pseudo),
    repeat: (css, pseudo) => css.backgroundRepeat("repeat", pseudo),
    "no-repeat": (css, pseudo) => css.backgroundRepeat("no-repeat", pseudo),
    "repeat-x": (css, pseudo) => css.backgroundRepeat("repeat-x", pseudo),
    "repeat-y": (css, pseudo) => css.backgroundRepeat("repeat-y", pseudo),
    "repeat-round": (css, pseudo) => css.backgroundRepeat("round", pseudo),
    "repeat-space": (css, pseudo) => css.backgroundRepeat("space", pseudo),
    auto: (css, pseudo) => css.backgroundSize("auto", pseudo),
    cover: (css, pseudo) => css.backgroundSize("cover", pseudo),
    contain: (css, pseudo) => css.backgroundSize("contain", pseudo),
  });
  return (css, config) => (value, pseudo) =>
    config.theme.backgroundColor && config.theme.backgroundColor[value]
      ? css.backgroundColor(config.theme.backgroundColor[value], pseudo)
      : values[value]
      ? (values as any)[value](css, pseudo)
      : showWarning(value);
})();

export const border = ((): ITailwindConfig["utils"]["border"] => {
  const values = {
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted",
    double: "double",
    none: "none",
  };
  return (css, config) => (value: any, pseudo) => {
    if (config.theme.borderColor && config.theme.borderColor[value]) {
      return css.borderColor(config.theme.borderColor[value], pseudo);
    }
    if (config.theme.borderWidth && config.theme.borderWidth[value]) {
      return css.borderWidth(config.theme.borderWidth[value], pseudo);
    }
    if ((values as any)[value]) {
      return css.borderStyle((values as any)[value], pseudo);
    }

    return config.theme.borderWidth && config.theme.borderWidth.default
      ? css.borderWidth(
          config.theme.borderWidth && config.theme.borderWidth.default,
          pseudo
        )
      : showWarning(value);
  };
})();

export const borderT: ITailwindConfig["utils"]["borderT"] = (css, config) => (
  value: any,
  pseudo
) => {
  if (config.theme.borderColor && config.theme.borderColor[value]) {
    return css.borderTopColor(config.theme.borderColor[value], pseudo);
  }
  if (config.theme.borderWidth && config.theme.borderWidth[value]) {
    return css.borderTopWidth(config.theme.borderWidth[value], pseudo);
  }
  return config.theme.borderWidth && config.theme.borderWidth.default
    ? css.borderTopWidth(
        config.theme.borderWidth && config.theme.borderWidth.default,
        pseudo
      )
    : showWarning(value);
};

export const borderR: ITailwindConfig["utils"]["borderR"] = (css, config) => (
  value: any,
  pseudo
) => {
  if (config.theme.borderColor && config.theme.borderColor[value]) {
    return css.borderRightColor(config.theme.borderColor[value], pseudo);
  }
  if (config.theme.borderWidth && config.theme.borderWidth[value]) {
    return css.borderRightWidth(config.theme.borderWidth[value], pseudo);
  }

  return config.theme.borderWidth && config.theme.borderWidth.default
    ? css.borderRightWidth(config.theme.borderWidth.default, pseudo)
    : showWarning(value);
};

export const borderB: ITailwindConfig["utils"]["borderB"] = (css, config) => (
  value: any,
  pseudo
) => {
  if (config.theme.borderColor && config.theme.borderColor[value]) {
    return css.borderBottomColor(config.theme.borderColor[value], pseudo);
  }
  if (config.theme.borderWidth && config.theme.borderWidth[value]) {
    return css.borderBottomWidth(config.theme.borderWidth[value], pseudo);
  }

  return config.theme.borderWidth && config.theme.borderWidth.default
    ? css.borderBottomWidth(config.theme.borderWidth.default, pseudo)
    : showWarning(value);
};

export const borderL: ITailwindConfig["utils"]["borderB"] = (css, config) => (
  value: any,
  pseudo
) => {
  if (config.theme.borderColor && config.theme.borderColor[value]) {
    return css.borderLeftColor(config.theme.borderColor[value], pseudo);
  }
  if (config.theme.borderWidth && config.theme.borderWidth[value]) {
    return css.borderLeftWidth(config.theme.borderWidth[value], pseudo);
  }

  return config.theme.borderWidth && config.theme.borderWidth.default
    ? css.borderLeftWidth(config.theme.borderWidth.default, pseudo)
    : showWarning(value);
};

export const rounded: ITailwindConfig["utils"]["rounded"] = createUtility(
  (css, value, pseudo) => css.borderRadius(value, pseudo),
  {
    theme: "borderRadius",
  }
);

export const roundedT: ITailwindConfig["utils"]["roundedT"] = createUtility(
  (css, value, pseudo) =>
    css.compose(
      css.borderTopLeftRadius(value, pseudo),
      css.borderTopRightRadius(value, pseudo)
    ),
  {
    theme: "borderRadius",
  }
);

export const roundedR: ITailwindConfig["utils"]["roundedR"] = createUtility(
  (css, value, pseudo) =>
    css.compose(
      css.borderBottomRightRadius(value, pseudo),
      css.borderTopRightRadius(value, pseudo)
    ),
  {
    theme: "borderRadius",
  }
);

export const roundedB: ITailwindConfig["utils"]["roundedB"] = createUtility(
  (css, value, pseudo) =>
    css.compose(
      css.borderBottomRightRadius(value, pseudo),
      css.borderBottomLeftRadius(value, pseudo)
    ),
  {
    theme: "borderRadius",
  }
);

export const roundedL: ITailwindConfig["utils"]["roundedL"] = createUtility(
  (css, value, pseudo) =>
    css.compose(
      css.borderTopLeftRadius(value, pseudo),
      css.borderBottomLeftRadius(value, pseudo)
    ),
  {
    theme: "borderRadius",
  }
);

export const roundedTL: ITailwindConfig["utils"]["roundedTL"] = createUtility(
  (css, value, pseudo) => css.borderTopLeftRadius(value, pseudo),
  {
    theme: "borderRadius",
  }
);

export const roundedTR: ITailwindConfig["utils"]["roundedTR"] = createUtility(
  (css, value, pseudo) => css.borderTopRightRadius(value, pseudo),
  {
    theme: "borderRadius",
  }
);

export const roundedBR: ITailwindConfig["utils"]["roundedBR"] = createUtility(
  (css, value, pseudo) => css.borderBottomRightRadius(value, pseudo),
  {
    theme: "borderRadius",
  }
);

export const roundedBL: ITailwindConfig["utils"]["roundedBL"] = createUtility(
  (css, value, pseudo) => css.borderBottomLeftRadius(value, pseudo),
  {
    theme: "borderRadius",
  }
);

export const shadow: ITailwindConfig["utils"]["shadow"] = createUtility(
  (css, value, pseudo) => css.boxShadow(value, pseudo),
  {
    theme: "boxShadow",
  }
);

export const opacity: ITailwindConfig["utils"]["opacity"] = createUtility(
  (css, value, pseudo) => css.opacity(value, pseudo),
  {
    theme: "opacity",
  }
);

export const transition: ITailwindConfig["utils"]["transition"] = createUtility(
  (css, value, pseudo) => css.transitionProperty(value, pseudo),
  {
    theme: "transitionProperty",
  }
);

export const duration: ITailwindConfig["utils"]["duration"] = createUtility(
  (css, value, pseudo) => css.transitionDuration(value, pseudo),
  {
    theme: "transitionDuration",
  }
);

export const ease: ITailwindConfig["utils"]["ease"] = createUtility(
  (css, value, pseudo) => css.transitionTimingFunction(value, pseudo),
  {
    theme: "transitionTimingFunction",
  }
);

export const transform: ITailwindConfig["utils"]["transform"] = (css) => (
  _,
  pseudo
) =>
  css.compose(
    (css as any)["--transform-translate-x"](0),
    (css as any)["--transform-translate-y"](0),
    (css as any)["--transform-rotate"](0),
    (css as any)["--transform-skew-x"](0),
    (css as any)["--transform-skew-y"](0),
    (css as any)["--transform-scale-x"](1),
    (css as any)["--transform-scale-y"](1),
    css.transform(
      "translateX(var(--transform-translate-x)) translateY(var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
      pseudo
    )
  );

export const scale: ITailwindConfig["utils"]["scale"] = createUtility(
  (css, value, pseudo) =>
    css.compose(
      (css as any)["--transform-scale-x"](value, pseudo),
      (css as any)["--transform-scale-y"](value, pseudo)
    ),
  {
    theme: "scale",
  }
);

export const scaleX: ITailwindConfig["utils"]["scaleX"] = createUtility(
  (css, value, pseudo) => (css as any)["--transform-scale-x"](value, pseudo),
  {
    theme: "scale",
  }
);

export const scaleY: ITailwindConfig["utils"]["scaleY"] = createUtility(
  (css, value, pseudo) => (css as any)["--transform-scale-y"](value, pseudo),
  {
    theme: "scale",
  }
);

export const rotate: ITailwindConfig["utils"]["rotate"] = createUtility(
  (css, value, pseudo) => (css as any)["--transform-rotate"](value, pseudo),
  {
    theme: "rotate",
  }
);

export const translateX: ITailwindConfig["utils"]["translateX"] = createUtility(
  (css, value, pseudo) =>
    (css as any)["--transform-translate-x"](value, pseudo),
  {
    theme: "translate",
  }
);

export const translateY: ITailwindConfig["utils"]["translateY"] = createUtility(
  (css, value, pseudo) =>
    (css as any)["--transform-translate-y"](value, pseudo),
  {
    theme: "translate",
  }
);

export const skewX: ITailwindConfig["utils"]["skewX"] = createUtility(
  (css, value, pseudo) => (css as any)["--transform-skew-x"](value, pseudo),
  {
    theme: "skew",
  }
);

export const skewY: ITailwindConfig["utils"]["skewY"] = createUtility(
  (css, value, pseudo) => (css as any)["--transform-skew-y"](value, pseudo),
  {
    theme: "skew",
  }
);

export const origin: ITailwindConfig["utils"]["origin"] = createUtility(
  (css, value, pseudo) => css.transformOrigin(value, pseudo),
  {
    theme: "transformOrigin",
  }
);

export const appearance: ITailwindConfig["utils"]["appearance"] = (css) => (
  value: any,
  pseudo
) => css.appearance(value === "none" ? value : showWarning(value), pseudo);

export const cursor: ITailwindConfig["utils"]["cursor"] = createUtility(
  (css, value, pseudo) => css.cursor(value, pseudo),
  {
    theme: "cursor",
  }
);

export const outline: ITailwindConfig["utils"]["outline"] = (css) => (
  value: any,
  pseudo
) => css.appearance(value === "none" ? value : showWarning(value), pseudo);

export const pointerEvents: ITailwindConfig["utils"]["pointerEvents"] = createUtility(
  (css, value, pseudo) => css.pointerEvents(value, pseudo),
  {
    values: {
      none: "none",
      auto: "auto",
    },
  }
);

export const resize: ITailwindConfig["utils"]["resize"] = createUtility(
  (css, value, pseudo) => css.resize(value, pseudo),
  {
    values: {
      none: "none",
      y: "vertical",
      x: "horizontal",
    },
  }
);

export const select: ITailwindConfig["utils"]["select"] = createUtility(
  (css, value, pseudo) => css.userSelect(value, pseudo),
  {
    values: {
      none: "none",
      text: "text",
      all: "all",
      auto: "auto",
    },
  }
);

export const fill: ITailwindConfig["utils"]["fill"] = createUtility(
  (css, value, pseudo) => (css as any).fill(value, pseudo),
  {
    theme: "fill",
  }
);

export const stroke: ITailwindConfig["utils"]["stroke"] = (css, config) => (
  value: any,
  pseudo
) => {
  if (config.theme.stroke && config.theme.stroke[value]) {
    return (css as any).stroke(config.theme.stroke[value], pseudo);
  }

  if (config.theme.strokeWidth && config.theme.strokeWidth[value]) {
    return (css as any).strokeWidth(config.theme.strokeWidth[value], pseudo);
  }

  return showWarning(value);
};

export const srOnly: ITailwindConfig["utils"]["srOnly"] = (css) => () =>
  css.compose(
    css.position("absolute"),
    css.width("1px"),
    css.height("1px"),
    css.padding(0),
    css.margin("-1px"),
    css.overflow("hidden"),
    (css as any).clip("rect(0, 0, 0 ,0)"),
    css.whiteSpace("nowrap"),
    css.borderWidth(0)
  );

export const notSrOnly: ITailwindConfig["utils"]["notSrOnly"] = (css) => () =>
  css.compose(
    css.position("static"),
    css.width("auto"),
    css.height("auto"),
    css.padding(0),
    css.margin(0),
    css.overflow("visible"),
    (css as any).clip("auto"),
    css.whiteSpace("normal")
  );
