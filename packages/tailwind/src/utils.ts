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
  container?: {
    center?: boolean;
    padding?: IThemeValue;
  };
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
    absolute: TTailwindUtility<void>;
    align: TTailwindUtility<
      "baseline" | "top" | "middle" | "bottom" | "text-top" | "text-bottom"
    >;
    antialiased: TTailwindUtility<void>;
    appearance: TTailwindUtility<"none">;
    bg: TTailwindUtility<
      | "fixed"
      | "local"
      | "scroll"
      | "repeat"
      | "no-repeat"
      | "repeat-x"
      | "repeat-y"
      | "repeat-round"
      | "repeat-space"
    >;
    block: TTailwindUtility<void>;
    border: TTailwindUtility<
      | "collapse"
      | "separate"
      | "solid"
      | "dashed"
      | "dotted"
      | "double"
      | "none"
    >;
    borderB: TTailwindUtility;
    borderL: TTailwindUtility;
    borderR: TTailwindUtility;
    borderT: TTailwindUtility;
    bottom: TTailwindUtility;
    box: TTailwindUtility<"border" | "content">;
    breakText: TTailwindUtility<"normal" | "words" | "all">;
    capitalize: TTailwindUtility<void>;
    clear: TTailwindUtility<"right" | "left" | "both" | "none">;
    clearfix: TTailwindUtility<void>;
    col: TTailwindUtility;
    colEnd: TTailwindUtility;
    colGap: TTailwindUtility;
    colStart: TTailwindUtility;
    container: TTailwindUtility<void>;
    content: TTailwindUtility<
      "start" | "center" | "end" | "space-between" | "around"
    >;
    cursor: TTailwindUtility;
    delay: TTailwindUtility;
    divideBottom: TTailwindUtility;
    divideLeft: TTailwindUtility;
    divideRight: TTailwindUtility;
    divideTop: TTailwindUtility;
    duration: TTailwindUtility;
    ease: TTailwindUtility;
    fill: TTailwindUtility;
    fixed: TTailwindUtility<void>;
    flex: TTailwindUtility<
      | void
      | "row"
      | "row-reverse"
      | "col"
      | "col-reverse"
      | "no-wrap"
      | "wrap"
      | "wrap-reverse"
    >;
    float: TTailwindUtility<"right" | "left" | "none">;
    flowRoot: TTailwindUtility<void>;
    font: TTailwindUtility;
    gap: TTailwindUtility;
    grid: TTailwindUtility<void>;
    gridCols: TTailwindUtility;
    gridFlow: TTailwindUtility<"row" | "col" | "row-dense" | "col-dense">;
    gridRows: TTailwindUtility;
    grow: TTailwindUtility;
    h: TTailwindUtility;
    hidden: TTailwindUtility<void>;
    inline: TTailwindUtility<void>;
    inlineBlock: TTailwindUtility<void>;
    inlineGrid: TTailwindUtility<void>;
    inlineFlex: TTailwindUtility<void>;
    inset: TTailwindUtility;
    insetX: TTailwindUtility;
    insetY: TTailwindUtility;
    invisible: TTailwindUtility<void>;
    italic: TTailwindUtility<void>;
    items: TTailwindUtility<
      "stretch" | "start" | "center" | "end" | "baseline"
    >;
    justify: TTailwindUtility<
      "start" | "center" | "end" | "between" | "around"
    >;
    leading: TTailwindUtility;
    left: TTailwindUtility;
    lineThrough: TTailwindUtility<void>;
    list: TTailwindUtility<"inside" | "outside">;
    lowercase: TTailwindUtility<void>;
    m: TTailwindUtility;
    maxH: TTailwindUtility;
    maxW: TTailwindUtility;
    mb: TTailwindUtility;
    minH: TTailwindUtility;
    minW: TTailwindUtility;
    ml: TTailwindUtility;
    mr: TTailwindUtility;
    mt: TTailwindUtility;
    mx: TTailwindUtility;
    my: TTailwindUtility;
    normalCase: TTailwindUtility<void>;
    notItalic: TTailwindUtility<void>;
    notSrOnly: TTailwindUtility<void>;
    noUnderline: TTailwindUtility<void>;
    table: TTailwindUtility<
      | void
      | "caption"
      | "cell"
      | "col"
      | "col-group"
      | "footer-group"
      | "header-group"
      | "row-group"
      | "row"
      | "auto"
      | "fixed"
    >;
    object: TTailwindUtility<
      "contain" | "cover" | "fill" | "none" | "scale-down"
    >;
    opacity: TTailwindUtility;
    order: TTailwindUtility;
    origin: TTailwindUtility;
    outline: TTailwindUtility<"none">;
    overflow: TTailwindUtility<"auto" | "hidden" | "visible" | "scroll">;
    overflowX: TTailwindUtility<"auto" | "hidden" | "visible" | "scroll">;
    overflowY: TTailwindUtility<"auto" | "hidden" | "visible" | "scroll">;
    p: TTailwindUtility;
    pb: TTailwindUtility;
    pl: TTailwindUtility;
    placeholder: TTailwindUtility;
    pointerEvents: TTailwindUtility<"none" | "auto">;
    pr: TTailwindUtility;
    pt: TTailwindUtility;
    px: TTailwindUtility;
    py: TTailwindUtility;
    resize: TTailwindUtility<void | "none" | "y" | "x">;
    relative: TTailwindUtility<void>;
    right: TTailwindUtility;
    rotate: TTailwindUtility;
    rounded: TTailwindUtility;
    roundedB: TTailwindUtility;
    roundedBL: TTailwindUtility;
    roundedBR: TTailwindUtility;
    roundedL: TTailwindUtility;
    roundedR: TTailwindUtility;
    roundedT: TTailwindUtility;
    roundedTL: TTailwindUtility;
    roundedTR: TTailwindUtility;
    row: TTailwindUtility;
    rowEnd: TTailwindUtility;
    rowGap: TTailwindUtility;
    rowStart: TTailwindUtility;
    scale: TTailwindUtility;
    scaleX: TTailwindUtility;
    scaleY: TTailwindUtility;
    scrolling: TTailwindUtility<"touch" | "auto">;
    select: TTailwindUtility<"none" | "text" | "all" | "auto">;
    self: TTailwindUtility<"auto" | "start" | "center" | "end" | "stretch">;
    shadow: TTailwindUtility;
    shrink: TTailwindUtility;
    skewX: TTailwindUtility;
    skewY: TTailwindUtility;
    spaceBottom: TTailwindUtility;
    spaceLeft: TTailwindUtility;
    spaceRight: TTailwindUtility;
    spaceTop: TTailwindUtility;
    srOnly: TTailwindUtility<void>;
    staticPosition: TTailwindUtility<void>;
    sticky: TTailwindUtility<void>;
    stroke: TTailwindUtility;
    subpixelAntialiased: TTailwindUtility<void>;
    text: TTailwindUtility<"left" | "center" | "right" | "justify">;
    top: TTailwindUtility;
    tracking: TTailwindUtility;
    transform: TTailwindUtility<void>;
    transition: TTailwindUtility;
    translateX: TTailwindUtility;
    translateY: TTailwindUtility;
    truncate: TTailwindUtility<void>;
    underline: TTailwindUtility<void>;
    uppercase: TTailwindUtility<void>;
    visible: TTailwindUtility<void>;
    w: TTailwindUtility;
    whitespace: TTailwindUtility<
      "normal" | "no-wrap" | "pre" | "pre-line" | "pre-wrap"
    >;
    wrap: TTailwindUtility<void | "none" | "reverse">;
    z: TTailwindUtility;
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

export const absolute: ITailwindConfig["utils"]["absolute"] = (css) => (
  _,
  pseudo
) => css.position("absolute", pseudo);

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

export const antialiased: ITailwindConfig["utils"]["antialiased"] = (
  css,
  pseudo
) => () =>
  css.compose(
    (css as any).WebkitFontSmoothing("antialiased", pseudo),
    (css as any).MozOsxFontSmoothing("grayscale", pseudo)
  );

export const appearance: ITailwindConfig["utils"]["appearance"] = (css) => (
  value: any,
  pseudo
) => css.appearance(value === "none" ? value : showWarning(value), pseudo);

export const bg = ((): ITailwindConfig["utils"]["bg"] => {
  const values = createUtilityValues({
    fixed: (css, pseudo) => css.backgroundAttachment("fixed", pseudo),
    local: (css, pseudo) => css.backgroundAttachment("local", pseudo),
    scroll: (css, pseudo) => css.backgroundAttachment("scroll", pseudo),
    repeat: (css, pseudo) => css.backgroundRepeat("repeat", pseudo),
    "no-repeat": (css, pseudo) => css.backgroundRepeat("no-repeat", pseudo),
    "repeat-x": (css, pseudo) => css.backgroundRepeat("repeat-x", pseudo),
    "repeat-y": (css, pseudo) => css.backgroundRepeat("repeat-y", pseudo),
    "repeat-round": (css, pseudo) => css.backgroundRepeat("round", pseudo),
    "repeat-space": (css, pseudo) => css.backgroundRepeat("space", pseudo),
  });
  return (css, config) => (value, pseudo) => {
    if (config.theme.backgroundColor && config.theme.backgroundColor[value]) {
      return css.backgroundColor(config.theme.backgroundColor[value], pseudo);
    }
    if (
      config.theme.backgroundPosition &&
      config.theme.backgroundPosition[value]
    ) {
      return css.backgroundPosition(
        config.theme.backgroundPosition[value],
        pseudo
      );
    }
    if (config.theme.backgroundSize && config.theme.backgroundSize[value]) {
      return css.backgroundSize(config.theme.backgroundSize[value], pseudo);
    }

    return values[value]
      ? (values as any)[value](css, pseudo)
      : showWarning(value);
  };
})();

export const block: ITailwindConfig["utils"]["block"] = (css) => () =>
  css.display("block");

export const border = ((): ITailwindConfig["utils"]["border"] => {
  const values = createUtilityValues({
    solid: (css, pseudo) => css.borderStyle("solid", pseudo),
    dashed: (css, pseudo) => css.borderStyle("dashed", pseudo),
    dotted: (css, pseudo) => css.borderStyle("dotted", pseudo),
    double: (css, pseudo) => css.borderStyle("double", pseudo),
    none: (css, pseudo) => css.borderStyle("none", pseudo),
    collapse: (css, pseudo) => css.borderCollapse("collapse", pseudo),
    separate: (css, pseudo) => css.borderCollapse("separate", pseudo),
  });
  return (css, config) => (value, pseudo) => {
    if (config.theme.borderColor && config.theme.borderColor[value]) {
      return css.borderColor(config.theme.borderColor[value], pseudo);
    }
    if (config.theme.borderWidth && config.theme.borderWidth[value]) {
      return css.borderWidth(config.theme.borderWidth[value], pseudo);
    }

    return values[value]
      ? (values[value] as any)(css, pseudo)
      : showWarning(value);
  };
})();

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

  return showWarning(value);
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

  return showWarning(value);
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

  return showWarning(value);
};

export const borderT: ITailwindConfig["utils"]["borderT"] = (css, config) => (
  value,
  pseudo
) => {
  if (config.theme.borderColor && config.theme.borderColor[value]) {
    return css.borderTopColor(config.theme.borderColor[value], pseudo);
  }
  if (config.theme.borderWidth && config.theme.borderWidth[value]) {
    return css.borderTopWidth(config.theme.borderWidth[value], pseudo);
  }

  return showWarning(value);
};

export const bottom: ITailwindConfig["utils"]["bottom"] = createUtility(
  (css, value, pseudo) => css.bottom(value, pseudo),
  {
    theme: "inset",
  }
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

export const breakText: ITailwindConfig["utils"]["breakText"] = createUtility({
  normal: (css, pseudo) =>
    css.compose(
      css.wordBreak("normal", pseudo),
      css.overflowWrap("normal", pseudo)
    ),
  words: (css, pseudo) => css.overflowWrap("break-word", pseudo),
  all: (css, pseudo) => css.wordBreak("break-all", pseudo),
});

export const capitalize: ITailwindConfig["utils"]["capitalize"] = (css) => (
  _,
  pseudo
) => css.textTransform("capitalize", pseudo);

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

export const clearfix: ITailwindConfig["utils"]["clearfix"] = (css) => () =>
  css.compose(
    css.content("", "::after"),
    css.display("table", "::after"),
    css.clear("both", "::after")
  );

export const col: ITailwindConfig["utils"]["col"] = createUtility(
  (css, value, pseudo) => css.gridColumn(value, pseudo),
  {
    theme: "gridColumn",
  }
);

export const colEnd: ITailwindConfig["utils"]["colEnd"] = createUtility(
  (css, value, pseudo) => css.gridColumnEnd(value, pseudo),
  {
    theme: "gridColumnEnd",
  }
);

export const colGap: ITailwindConfig["utils"]["colGap"] = createUtility(
  (css, value, pseudo) => css.columnGap(value, pseudo),
  {
    theme: "gap",
  }
);

export const colStart: ITailwindConfig["utils"]["colStart"] = createUtility(
  (css, value, pseudo) => css.gridColumnStart(value, pseudo),
  {
    theme: "gridColumnStart",
  }
);

export const container = ((): ITailwindConfig["utils"]["container"] => {
  let cachedContainer: any;
  return (css, config) => () => {
    if (cachedContainer) {
      return cachedContainer;
    }

    const properties: any[] = [css.width("100%")];

    if (config.theme.container && config.theme.container.center) {
      properties.push(css.marginLeft("auto"));
      properties.push(css.marginRight("auto"));
    }

    if (config.theme.container && config.theme.container.padding) {
      const padding = config.theme.container.padding;
      Object.keys(padding).forEach((key) => {
        if (key === "default") {
          properties.push(css.padding(padding[key]));
        }

        (css as any)[key].padding(padding[key]);
      });
    }

    Object.keys(config.theme.screens || {}).forEach((screen) => {
      properties.push(
        (css as any)[screen].maxWidth(config.theme.screens![screen])
      );
    });

    return (cachedContainer = css.compose(...properties));
  };
})();

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

export const cursor: ITailwindConfig["utils"]["cursor"] = createUtility(
  (css, value, pseudo) => css.cursor(value, pseudo),
  {
    theme: "cursor",
  }
);

export const delay: ITailwindConfig["utils"]["delay"] = createUtility(
  (css, value, pseudo) => css.transitionDelay(value, pseudo),
  {
    theme: "transitionDelay",
  }
);

export const divideBottom: ITailwindConfig["utils"]["divideBottom"] = (
  css,
  config
) => (value, pseudo = "") => {
  const composedPseudo = `${pseudo} > * + *`;

  if (config.theme.divideWidth && config.theme.divideWidth[value]) {
    return css.borderBottomWidth(
      config.theme.divideWidth[value],
      composedPseudo
    );
  }
  if (config.theme.divideColor && config.theme.divideColor[value]) {
    return css.borderBottomColor(
      config.theme.divideColor[value],
      composedPseudo
    );
  }

  return showWarning(value);
};

export const divideLeft: ITailwindConfig["utils"]["divideLeft"] = (
  css,
  config
) => (value, pseudo = "") => {
  const composedPseudo = `${pseudo} > * + *`;

  if (config.theme.divideWidth && config.theme.divideWidth[value]) {
    return css.borderLeftWidth(config.theme.divideWidth[value], composedPseudo);
  }
  if (config.theme.divideColor && config.theme.divideColor[value]) {
    return css.borderLeftColor(config.theme.divideColor[value], composedPseudo);
  }

  return showWarning(value);
};

export const divideRight: ITailwindConfig["utils"]["divideRight"] = (
  css,
  config
) => (value, pseudo = "") => {
  const composedPseudo = `${pseudo} > * + *`;

  if (config.theme.divideWidth && config.theme.divideWidth[value]) {
    return css.borderRightWidth(
      config.theme.divideWidth[value],
      composedPseudo
    );
  }
  if (config.theme.divideColor && config.theme.divideColor[value]) {
    return css.borderRightColor(
      config.theme.divideColor[value],
      composedPseudo
    );
  }

  return showWarning(value);
};

export const divideTop: ITailwindConfig["utils"]["divideTop"] = (
  css,
  config
) => (value, pseudo = "") => {
  const composedPseudo = `${pseudo} > * + *`;

  if (config.theme.divideWidth && config.theme.divideWidth[value]) {
    return css.borderTopWidth(config.theme.divideWidth[value], composedPseudo);
  }
  if (config.theme.divideColor && config.theme.divideColor[value]) {
    return css.borderTopColor(config.theme.divideColor[value], composedPseudo);
  }

  return showWarning(value);
};

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

export const fill: ITailwindConfig["utils"]["fill"] = createUtility(
  (css, value, pseudo) => (css as any).fill(value, pseudo),
  {
    theme: "fill",
  }
);

export const fixed: ITailwindConfig["utils"]["fixed"] = (css) => (_, pseudo) =>
  css.position("fixed", pseudo);

export const flex: ITailwindConfig["utils"]["flex"] = createUtility(
  (css, value, pseudo) => css.flexDirection(value, pseudo),
  {
    theme: "flex",
    emptyValue: (css, pseudo) => css.display("flex", pseudo),
    values: {
      col: "column",
      "col-reverse": "column-reverse",
    },
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

export const flowRoot: ITailwindConfig["utils"]["flowRoot"] = (css) => () =>
  css.display("flow-root");

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

export const gap: ITailwindConfig["utils"]["gap"] = createUtility(
  (css, value, pseudo) => css.gap(value, pseudo),
  {
    theme: "gap",
  }
);

export const grid: ITailwindConfig["utils"]["grid"] = createUtility(
  (css, _, pseudo) => css.display("grid", pseudo)
);

export const gridCols: ITailwindConfig["utils"]["gridCols"] = createUtility(
  (css, value, pseudo) => css.gridTemplateColumns(value, pseudo),
  {
    theme: "gridTemplateColumns",
  }
);

export const gridFlow: ITailwindConfig["utils"]["gridFlow"] = createUtility(
  (css, value, pseudo) => css.gridAutoFlow(value, pseudo),
  {
    values: {
      row: "row",
      col: "column",
      "row-dense": "row dense",
      "col-dense": "column dense",
    },
  }
);

export const gridRows: ITailwindConfig["utils"]["gridRows"] = createUtility(
  (css, value, pseudo) => css.gridTemplateRows(value, pseudo),
  {
    theme: "gridTemplateRows",
  }
);

export const grow: ITailwindConfig["utils"]["grow"] = createUtility(
  (css, value, pseudo) => css.flexGrow(value, pseudo),
  {
    theme: "flexGrow",
  }
);

export const h: ITailwindConfig["utils"]["h"] = createUtility(
  (css, value, pseudo) => css.height(value, pseudo),
  {
    theme: "height",
  }
);

export const hidden: ITailwindConfig["utils"]["hidden"] = (css) => (
  _,
  pseudo
) => css.display("none", pseudo);

export const inline: ITailwindConfig["utils"]["inline"] = (css) => (
  _,
  pseudo
) => css.display("inline", pseudo);

export const inlineBlock: ITailwindConfig["utils"]["inlineBlock"] = (css) => (
  _,
  pseudo
) => css.display("inline-block", pseudo);

export const inlineFlex: ITailwindConfig["utils"]["inlineFlex"] = (css) => () =>
  css.display("inline-flex");

export const inlineGrid: ITailwindConfig["utils"]["inlineGrid"] = (css) => () =>
  css.display("inline-grid");

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

export const invisible: ITailwindConfig["utils"]["invisible"] = (css) => (
  _,
  pseudo
) => css.visibility("hidden", pseudo);

export const italic: ITailwindConfig["utils"]["italic"] = (css) => (
  _,
  pseudo
) => css.fontStyle("italic", pseudo);

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

export const leading: ITailwindConfig["utils"]["leading"] = createUtility(
  (css, value, pseudo) => css.lineHeight(value, pseudo),
  {
    theme: "lineHeight",
  }
);

export const left: ITailwindConfig["utils"]["left"] = createUtility(
  (css, value, pseudo) => css.left(value, pseudo),
  {
    theme: "inset",
  }
);

export const lineThrough: ITailwindConfig["utils"]["lineThrough"] = (css) => (
  _,
  pseudo
) => css.textDecoration("line-through", pseudo);

export const list: ITailwindConfig["utils"]["list"] = (css, config) => (
  value,
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

export const lowercase: ITailwindConfig["utils"]["lowercase"] = (css) => (
  _,
  pseudo
) => css.textTransform("lowercase", pseudo);

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

export const maxH: ITailwindConfig["utils"]["maxH"] = createUtility(
  (css, value, pseudo) => css.maxHeight(value, pseudo),
  {
    theme: "maxHeight",
  }
);

export const maxW: ITailwindConfig["utils"]["maxW"] = createUtility(
  (css, value, pseudo) => css.maxWidth(value, pseudo),
  {
    theme: "maxWidth",
  }
);

export const mb: ITailwindConfig["utils"]["mb"] = createUtility(
  (css, value, pseudo) => css.marginBottom(value, pseudo),
  {
    theme: "margin",
  }
);

export const minH: ITailwindConfig["utils"]["minH"] = createUtility(
  (css, value, pseudo) => css.minHeight(value, pseudo),
  {
    theme: "minHeight",
  }
);

export const minW: ITailwindConfig["utils"]["minW"] = createUtility(
  (css, value, pseudo) => css.minWidth(value, pseudo),
  {
    theme: "minWidth",
  }
);

export const ml: ITailwindConfig["utils"]["ml"] = createUtility(
  (css, value, pseudo) => css.marginLeft(value, pseudo),
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

export const mt: ITailwindConfig["utils"]["mt"] = createUtility(
  (css, value, pseudo) => css.marginTop(value, pseudo),
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

export const my: ITailwindConfig["utils"]["my"] = createUtility(
  (css, value, pseudo) =>
    css.compose(css.marginTop(value, pseudo), css.marginBottom(value, pseudo)),
  {
    theme: "margin",
  }
);

export const normalCase: ITailwindConfig["utils"]["normalCase"] = (css) => (
  _,
  pseudo
) => css.textTransform("none", pseudo);

export const notItalic: ITailwindConfig["utils"]["notItalic"] = (css) => (
  _,
  pseudo
) => css.fontStyle("normal", pseudo);

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

export const noUnderline: ITailwindConfig["utils"]["noUnderline"] = (css) => (
  _,
  pseudo
) => css.textDecoration("none", pseudo);

export const table: ITailwindConfig["utils"]["table"] = createUtility(
  {
    caption: (css, pseudo) => css.display("table-caption", pseudo),
    cell: (css, pseudo) => css.display("table-cell", pseudo),
    column: (css, pseudo) => css.display("table-column", pseudo),
    "footer-group": (css, pseudo) => css.display("table-footer-group", pseudo),
    "header-group": (css, pseudo) => css.display("table-header-group", pseudo),
    "column-group": (css, pseudo) => css.display("table-column-group", pseudo),
    "row-group": (css, pseudo) => css.display("table-row-group", pseudo),
    row: (css, pseudo) => css.display("table-row", pseudo),
    auto: (css, pseudo) => css.tableLayout("auto", pseudo),
    fixed: (css, pseudo) => css.tableLayout("fixed", pseudo),
  },
  {
    emptyValue: (css, pseudo) => css.display("table", pseudo),
  }
);

export const object = ((): ITailwindConfig["utils"]["object"] => {
  const values = {
    contain: "contain",
    cover: "cover",
    fill: "fill",
    none: "none",
    "scale-down": "scale-down",
  };
  return (css, config) => (value, pseudo) => {
    if (config.theme.objectPosition && config.theme.objectPosition[value]) {
      return css.objectPosition(config.theme.objectPosition[value], pseudo);
    }

    return values[value]
      ? css.objectFit((values as any)[value])
      : showWarning(value);
  };
})();

export const opacity: ITailwindConfig["utils"]["opacity"] = createUtility(
  (css, value, pseudo) => css.opacity(value, pseudo),
  {
    theme: "opacity",
  }
);

export const order: ITailwindConfig["utils"]["order"] = createUtility(
  (css, value, pseudo) => css.order(value, pseudo),
  {
    theme: "order",
  }
);

export const origin: ITailwindConfig["utils"]["origin"] = createUtility(
  (css, value, pseudo) => css.transformOrigin(value, pseudo),
  {
    theme: "transformOrigin",
  }
);

export const outline: ITailwindConfig["utils"]["outline"] = (css) => (
  value: any,
  pseudo
) => css.outline(value === "none" ? value : showWarning(value), pseudo);

const overflowValues = {
  hidden: "hidden",
  visible: "visible",
  scroll: "scroll",
  auto: "auto",
} as any;

export const overflow: ITailwindConfig["utils"]["overflow"] = createUtility(
  (css, value, pseudo) => css.overflow(value, pseudo),
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

export const placeholder: ITailwindConfig["utils"]["placeholder"] = createUtility(
  (css, value, pseudo) => css.color(value, `${pseudo}::placeholder`),
  {
    theme: "placeholderColor",
  }
);

export const pointerEvents: ITailwindConfig["utils"]["pointerEvents"] = createUtility(
  (css, value, pseudo) => css.pointerEvents(value, pseudo),
  {
    values: {
      none: "none",
      auto: "auto",
    },
  }
);

export const pr: ITailwindConfig["utils"]["pr"] = createUtility(
  (css, value, pseudo) => css.paddingRight(value, pseudo),
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

export const relative: ITailwindConfig["utils"]["relative"] = (css) => (
  _,
  pseudo
) => css.position("relative", pseudo);

export const right: ITailwindConfig["utils"]["right"] = createUtility(
  (css, value, pseudo) => css.right(value, pseudo),
  {
    theme: "inset",
  }
);

export const rotate: ITailwindConfig["utils"]["rotate"] = createUtility(
  (css, value, pseudo) => (css as any)["--transform-rotate"](value, pseudo),
  {
    theme: "rotate",
  }
);

export const rounded: ITailwindConfig["utils"]["rounded"] = createUtility(
  (css, value, pseudo) => css.borderRadius(value, pseudo),
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

export const roundedBL: ITailwindConfig["utils"]["roundedBL"] = createUtility(
  (css, value, pseudo) => css.borderBottomLeftRadius(value, pseudo),
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

export const row: ITailwindConfig["utils"]["row"] = createUtility(
  (css, value, pseudo) => css.gridRow(value, pseudo),
  {
    theme: "gridRow",
  }
);

export const rowEnd: ITailwindConfig["utils"]["rowEnd"] = createUtility(
  (css, value, pseudo) => css.gridRowEnd(value, pseudo),
  {
    theme: "gridRowEnd",
  }
);

export const rowGap: ITailwindConfig["utils"]["rowGap"] = createUtility(
  (css, value, pseudo) => css.rowGap(value, pseudo),
  {
    theme: "gap",
  }
);

export const rowStart: ITailwindConfig["utils"]["rowStart"] = createUtility(
  (css, value, pseudo) => css.gridRowStart(value, pseudo),
  {
    theme: "gridRowStart",
  }
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

export const scrolling: ITailwindConfig["utils"]["scrolling"] = createUtility(
  (css, value, pseudo) =>
    (css as any).WebkitOverflowScrolling(
      ({
        touch: "touch",
        auto: "auto",
      } as any)[value] || showWarning(value),
      pseudo
    )
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

export const shadow: ITailwindConfig["utils"]["shadow"] = createUtility(
  (css, value, pseudo) => css.boxShadow(value, pseudo),
  {
    theme: "boxShadow",
  }
);

export const shrink: ITailwindConfig["utils"]["shrink"] = createUtility(
  (css, value, pseudo) => css.flexShrink(value, pseudo),
  {
    theme: "flexShrink",
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

export const spaceBottom: ITailwindConfig["utils"]["spaceBottom"] = createUtility(
  (css, value, pseudo = "") => css.marginBottom(value, `${pseudo} > * + *`),
  {
    theme: "margin",
  }
);

export const spaceLeft: ITailwindConfig["utils"]["spaceLeft"] = createUtility(
  (css, value, pseudo = "") => css.marginLeft(value, `${pseudo} > * + *`),
  {
    theme: "margin",
  }
);

export const spaceRight: ITailwindConfig["utils"]["spaceRight"] = createUtility(
  (css, value, pseudo = "") => css.marginRight(value, `${pseudo} > * + *`),
  {
    theme: "margin",
  }
);

export const spaceTop: ITailwindConfig["utils"]["spaceTop"] = createUtility(
  (css, value, pseudo = "") => css.marginTop(value, `${pseudo} > * + *`),
  {
    theme: "margin",
  }
);

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

export const staticPosition: ITailwindConfig["utils"]["staticPosition"] = (
  css
) => (_, pseudo) => css.position("static", pseudo);

export const sticky: ITailwindConfig["utils"]["sticky"] = (css) => (
  _,
  pseudo
) => css.position("sticky", pseudo);

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

export const subpixelAntialiased: ITailwindConfig["utils"]["subpixelAntialiased"] = (
  css,
  pseudo
) => () =>
  css.compose(
    (css as any).WebkitFontSmoothing("auto", pseudo),
    (css as any).MozOsxFontSmoothing("auto", pseudo)
  );

export const text = ((): ITailwindConfig["utils"]["text"] => {
  const values = {
    left: "left",
    right: "right",
    center: "center",
    justify: "justify",
  };
  return (css, config) => (value: any, pseudo) => {
    if (config.theme.textColor && config.theme.textColor[value]) {
      return css.color(config.theme.textColor[value] as any, pseudo);
    }

    if (config.theme.fontSize && config.theme.fontSize[value]) {
      return css.fontSize(config.theme.fontSize[value], pseudo);
    }

    return css.textAlign((values as any)[value] || showWarning(value), pseudo);
  };
})();

export const top: ITailwindConfig["utils"]["top"] = createUtility(
  (css, value, pseudo) => css.top(value, pseudo),
  {
    theme: "inset",
  }
);

export const tracking: ITailwindConfig["utils"]["tracking"] = createUtility(
  (css, value, pseudo) => css.letterSpacing(value, pseudo),
  {
    theme: "letterSpacing",
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

export const transition: ITailwindConfig["utils"]["transition"] = createUtility(
  (css, value, pseudo) => css.transitionProperty(value, pseudo),
  {
    theme: "transitionProperty",
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

export const truncate: ITailwindConfig["utils"]["truncate"] = (css) => (
  _,
  pseudo
) =>
  css.compose(
    css.overflow("hidden", pseudo),
    css.textOverflow("ellipsis", pseudo),
    css.whiteSpace("nowrap", pseudo)
  );

export const underline: ITailwindConfig["utils"]["underline"] = (css) => (
  _,
  pseudo
) => css.textDecoration("underline", pseudo);

export const uppercase: ITailwindConfig["utils"]["uppercase"] = (css) => (
  _,
  pseudo
) => css.textTransform("uppercase", pseudo);

export const visible: ITailwindConfig["utils"]["visible"] = (css) => (
  _,
  pseudo
) => css.visibility("visible", pseudo);

export const w: ITailwindConfig["utils"]["w"] = createUtility(
  (css, value, pseudo) => css.width(value, pseudo),
  {
    theme: "width",
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

export const wrap: ITailwindConfig["utils"]["wrap"] = createUtility(
  (css, value, pseudo) => css.flexWrap(value, pseudo),
  {
    values: {
      none: "none",
      reverse: "wrap-reverse",
    },
    emptyValue: (css, pseudo) => css.flexWrap("wrap", pseudo),
  }
);

export const z: ITailwindConfig["utils"]["z"] = createUtility(
  (css, value, pseudo) => css.zIndex(value, pseudo),
  {
    theme: "zIndex",
  }
);
