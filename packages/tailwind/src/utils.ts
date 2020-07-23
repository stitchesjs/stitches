import { IConfig, TUtility } from "@stitches/css";

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
    absolute: TTailwindUtility<true>;
    align: TTailwindUtility<
      "baseline" | "top" | "middle" | "bottom" | "text-top" | "text-bottom"
    >;
    antialiased: TTailwindUtility<true>;
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
    block: TTailwindUtility<true>;
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
    capitalize: TTailwindUtility<true>;
    clear: TTailwindUtility<"right" | "left" | "both" | "none">;
    clearfix: TTailwindUtility<true>;
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
    fixed: TTailwindUtility<true>;
    flex: TTailwindUtility<
      | true
      | "row"
      | "row-reverse"
      | "col"
      | "col-reverse"
      | "no-wrap"
      | "wrap"
      | "wrap-reverse"
    >;
    float: TTailwindUtility<"right" | "left" | "none">;
    flowRoot: TTailwindUtility<true>;
    font: TTailwindUtility;
    gap: TTailwindUtility;
    grid: TTailwindUtility<true>;
    gridCols: TTailwindUtility;
    gridFlow: TTailwindUtility<"row" | "col" | "row-dense" | "col-dense">;
    gridRows: TTailwindUtility;
    grow: TTailwindUtility;
    h: TTailwindUtility;
    hidden: TTailwindUtility<void>;
    inline: TTailwindUtility<void>;
    inlineBlock: TTailwindUtility<true>;
    inlineGrid: TTailwindUtility<true>;
    inlineFlex: TTailwindUtility<true>;
    inset: TTailwindUtility;
    insetX: TTailwindUtility;
    insetY: TTailwindUtility;
    italic: TTailwindUtility<boolean>;
    items: TTailwindUtility<
      "stretch" | "start" | "center" | "end" | "baseline"
    >;
    justify: TTailwindUtility<
      "start" | "center" | "end" | "between" | "around"
    >;
    leading: TTailwindUtility;
    left: TTailwindUtility;
    lineThrough: TTailwindUtility<true>;
    list: TTailwindUtility<"inside" | "outside">;
    lowercase: TTailwindUtility<true>;
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
    normalCase: TTailwindUtility<true>;
    table: TTailwindUtility<
      | true
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
    resize: TTailwindUtility<true | "none" | "y" | "x">;
    relative: TTailwindUtility<true>;
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
    srOnly: TTailwindUtility<boolean>;
    staticPosition: TTailwindUtility<true>;
    sticky: TTailwindUtility<true>;
    stroke: TTailwindUtility;
    subpixelAntialiased: TTailwindUtility<true>;
    text: TTailwindUtility<"left" | "center" | "right" | "justify">;
    top: TTailwindUtility;
    tracking: TTailwindUtility;
    transform: TTailwindUtility<true>;
    transition: TTailwindUtility;
    translateX: TTailwindUtility;
    translateY: TTailwindUtility;
    truncate: TTailwindUtility<true>;
    underline: TTailwindUtility<boolean>;
    uppercase: TTailwindUtility<true>;
    visible: TTailwindUtility<boolean>;
    w: TTailwindUtility;
    whitespace: TTailwindUtility<
      "normal" | "no-wrap" | "pre" | "pre-line" | "pre-wrap"
    >;
    wrap: TTailwindUtility<true | "none" | "reverse">;
    z: TTailwindUtility;
  };
}

export type TTailwindUtility<V extends any = undefined> = TUtility<
  V | V[],
  ITailwindConfig
>;

const createUtility = (
  cb:
    | ((value: any) => { [key: string]: any })
    | ReturnType<ReturnType<TTailwindUtility<any>>>,
  {
    theme,
    values = {},
    emptyValue,
  }: {
    theme?: string;
    values?: {
      [key: string]: string;
    };
    emptyValue?: ReturnType<ReturnType<TTailwindUtility<any>>>;
  } = {}
): TTailwindUtility<any> => {
  return ((config: ITailwindConfig) => (arg: any) => {
    const args = Array.isArray(arg) ? arg : [arg];

    return args.reduce((aggr, value) => {
      const evaluatedTheme = theme ? (config.theme as any)[theme] : {};
      const evaluatedValue =
        evaluatedTheme[value] ||
        evaluatedTheme.default ||
        (typeof values[value] === "function"
          ? (values as any)[value]()
          : values[value]);
      if (evaluatedValue) {
        // @ts-ignore
        return {
          ...aggr,
          ...(typeof cb === "function"
            ? cb(evaluatedValue)
            : (cb as any)[evaluatedValue]),
        };
      } else if (emptyValue) {
        return { ...aggr, ...emptyValue };
      }

      return { ...aggr, ...showWarning(value) };
    }, {});
  }) as any;
};

const showWarning = (value: string) => {
  // tslint:disable-next-line: no-console
  console.warn(
    `@stitches/tailwind - The value "${value}" is not a valid value`
  );

  return {};
};

export const absolute: ITailwindConfig["utils"]["absolute"] = () => () => ({
  position: "absolute",
});

export const align: ITailwindConfig["utils"]["align"] = createUtility(
  (value) => ({ verticalAlign: value }),
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

export const antialiased: ITailwindConfig["utils"]["antialiased"] = () => () => ({
  // @ts-ignore
  WebkitFontSmoothing: "antialiased",
  // @ts-ignore
  MozOsxFontSmoothing: "grayscale",
});

export const appearance: ITailwindConfig["utils"]["appearance"] = () => (
  value: any
) => ({ appearance: value === "none" ? value : showWarning(value) });

export const bg = ((): ITailwindConfig["utils"]["bg"] => {
  const values = {
    fixed: { backgroundAttachment: "fixed" },
    local: { backgroundAttachment: "local" },
    scroll: { backgroundAttachment: "scroll" },
    repeat: { backgroundRepeat: "repeat" },
    "no-repeat": { backgroundRepeat: "no-repeat" },
    "repeat-x": { backgroundRepeat: "repeat-x" },
    "repeat-y": { backgroundRepeat: "repeat-y" },
    "repeat-round": { backgroundRepeat: "round" },
    "repeat-space": { backgroundRepeat: "space" },
  };
  return (config) => (arg) => {
    const args = Array.isArray(arg) ? arg : [arg];

    return args.reduce((aggr, value) => {
      if (config.theme.backgroundColor && config.theme.backgroundColor[value]) {
        return {
          ...aggr,
          backgroundColor: config.theme.backgroundColor[value],
        };
      }
      if (
        config.theme.backgroundPosition &&
        config.theme.backgroundPosition[value]
      ) {
        return {
          ...aggr,
          backgroundPosition: config.theme.backgroundPosition[value],
        };
      }
      if (config.theme.backgroundSize && config.theme.backgroundSize[value]) {
        return { ...aggr, backgroundSize: config.theme.backgroundSize[value] };
      }

      return { ...aggr, ...(values[value] || showWarning(value)) };
    }, {});
  };
})();

export const block: ITailwindConfig["utils"]["block"] = () => () => ({
  display: "block",
});

export const border = ((): ITailwindConfig["utils"]["border"] => {
  const values = {
    solid: { borderStyle: "solid" },
    dashed: { borderStyle: "dashed" },
    dotted: { borderStyle: "dotted" },
    double: { borderStyle: "double" },
    none: { borderStyle: "none" },
    collapse: { borderCollapse: "collapse" },
    separate: { borderCollapse: "separate" },
  };
  // @ts-ignore
  return (config) => (arg) => {
    const args = Array.isArray(arg) ? arg : [arg];

    return args.reduce((aggr, value) => {
      if (config.theme.borderColor && config.theme.borderColor[value]) {
        return { ...aggr, borderColor: config.theme.borderColor[value] };
      }
      if (config.theme.borderWidth && config.theme.borderWidth[value]) {
        return { ...aggr, borderWidth: config.theme.borderWidth[value] };
      }

      return { ...aggr, ...(values[value] || showWarning(value)) };
    }, {});
  };
})();

export const borderB: ITailwindConfig["utils"]["borderB"] = (config) => (
  value: any
) => {
  if (config.theme.borderColor && config.theme.borderColor[value]) {
    return { borderBottomColor: config.theme.borderColor[value] };
  }
  if (config.theme.borderWidth && config.theme.borderWidth[value]) {
    return { borderBottomWidth: config.theme.borderWidth[value] };
  }

  return showWarning(value);
};

export const borderL: ITailwindConfig["utils"]["borderB"] = (config) => (
  value: any
) => {
  if (config.theme.borderColor && config.theme.borderColor[value]) {
    return { borderLeftColor: config.theme.borderColor[value] };
  }
  if (config.theme.borderWidth && config.theme.borderWidth[value]) {
    return { borderLeftWidth: config.theme.borderWidth[value] };
  }

  return showWarning(value);
};

export const borderR: ITailwindConfig["utils"]["borderR"] = (config) => (
  value: any
) => {
  if (config.theme.borderColor && config.theme.borderColor[value]) {
    return { borderRightColor: config.theme.borderColor[value] };
  }
  if (config.theme.borderWidth && config.theme.borderWidth[value]) {
    return { borderRightWidth: config.theme.borderWidth[value] };
  }

  return showWarning(value);
};

export const borderT: ITailwindConfig["utils"]["borderT"] = (config) => (
  value: any
) => {
  if (config.theme.borderColor && config.theme.borderColor[value]) {
    return { borderTopColor: config.theme.borderColor[value] };
  }
  if (config.theme.borderWidth && config.theme.borderWidth[value]) {
    return { borderTopWidth: config.theme.borderWidth[value] };
  }

  return showWarning(value);
};

export const bottom: ITailwindConfig["utils"]["bottom"] = createUtility(
  (value) => ({ bottom: value }),
  {
    theme: "inset",
  }
);

export const box: ITailwindConfig["utils"]["box"] = createUtility(
  (value) => ({ boxSizing: value }),
  {
    values: {
      border: "border-box",
      content: "content-box",
    },
  }
);

export const breakText: ITailwindConfig["utils"]["breakText"] = createUtility({
  normal: { wordBreak: "normal", overflowWrap: "normal" },
  words: { overflowWrap: "break-word" },
  all: { wordBreak: "break-all" } as any,
});

export const capitalize: ITailwindConfig["utils"]["capitalize"] = () => () => ({
  textTransform: "capitalize",
});

export const clear: ITailwindConfig["utils"]["clear"] = createUtility(
  (value) => ({ clear: value }),
  {
    values: {
      left: "left",
      right: "right",
      none: "none",
      both: "both",
    },
  }
);

export const clearfix: ITailwindConfig["utils"]["clearfix"] = () => () => ({
  "::after": {
    content: "",
    display: "table",
    clear: "both",
  },
});

export const col: ITailwindConfig["utils"]["col"] = createUtility(
  (value) => ({ gridColumn: value }),
  {
    theme: "gridColumn",
  }
);

export const colEnd: ITailwindConfig["utils"]["colEnd"] = createUtility(
  (value) => ({ gridColumnEnd: value }),
  {
    theme: "gridColumnEnd",
  }
);

export const colGap: ITailwindConfig["utils"]["colGap"] = createUtility(
  (value) => ({ columnGap: value }),
  {
    theme: "gap",
  }
);

export const colStart: ITailwindConfig["utils"]["colStart"] = createUtility(
  (value) => ({ gridColumnStart: value }),
  {
    theme: "gridColumnStart",
  }
);

export const container = ((): ITailwindConfig["utils"]["container"] => {
  let cachedContainer: any;
  return (config) => () => {
    if (cachedContainer) {
      return cachedContainer;
    }

    const properties: any = { width: "100%" };

    if (config.theme.container && config.theme.container.center) {
      properties.marginLeft = "auto";
      properties.marginRight = "auto";
    }

    if (config.theme.container && config.theme.container.padding) {
      const padding = config.theme.container.padding;
      Object.keys(padding).forEach((key) => {
        if (key === "default") {
          properties.padding = padding[key];
        } else {
          properties[key] = { padding: padding[key] };
        }
      });
    }

    Object.keys(config.theme.screens || {}).forEach((screen) => {
      if (!properties[screen]) {
        properties[screen] = {};
      }
      properties[screen].maxWidth = config.theme.screens![screen];
    });

    return (cachedContainer = properties);
  };
})();

export const content: ITailwindConfig["utils"]["content"] = createUtility(
  (value) => ({ alignContent: value }),
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
  (value) => ({ cursor: value }),
  {
    theme: "cursor",
  }
);

export const delay: ITailwindConfig["utils"]["delay"] = createUtility(
  (value) => ({ transitionDelay: value }),
  {
    theme: "transitionDelay",
  }
);

export const divideBottom: ITailwindConfig["utils"]["divideBottom"] = (
  config
) => (value: any) => {
  const pseudo = ` > * + *`;

  if (config.theme.divideWidth && config.theme.divideWidth[value]) {
    return {
      [pseudo]: {
        borderBottomWidth: config.theme.divideWidth[value],
      },
    };
  }
  if (config.theme.divideColor && config.theme.divideColor[value]) {
    return {
      [pseudo]: {
        borderBottomColor: config.theme.divideColor[value],
      },
    };
  }

  return showWarning(value);
};

export const divideLeft: ITailwindConfig["utils"]["divideLeft"] = (config) => (
  value: any
) => {
  const pseudo = ` > * + *`;

  if (config.theme.divideWidth && config.theme.divideWidth[value]) {
    return {
      [pseudo]: {
        borderLeftWidth: config.theme.divideWidth[value],
      },
    };
  }
  if (config.theme.divideColor && config.theme.divideColor[value]) {
    return {
      [pseudo]: {
        borderLeftColor: config.theme.divideColor[value],
      },
    };
  }

  return showWarning(value);
};

export const divideRight: ITailwindConfig["utils"]["divideRight"] = (
  config
) => (value: any) => {
  const pseudo = ` > * + *`;

  if (config.theme.divideWidth && config.theme.divideWidth[value]) {
    return {
      [pseudo]: {
        borderRightWidth: config.theme.divideWidth[value],
      },
    };
  }
  if (config.theme.divideColor && config.theme.divideColor[value]) {
    return {
      [pseudo]: {
        borderRightColor: config.theme.divideColor[value],
      },
    };
  }

  return showWarning(value);
};

export const divideTop: ITailwindConfig["utils"]["divideTop"] = (config) => (
  value: any
) => {
  const pseudo = ` > * + *`;

  if (config.theme.divideWidth && config.theme.divideWidth[value]) {
    return {
      [pseudo]: {
        borderTopWidth: config.theme.divideWidth[value],
      },
    };
  }
  if (config.theme.divideColor && config.theme.divideColor[value]) {
    return {
      [pseudo]: {
        borderTopColor: config.theme.divideColor[value],
      },
    };
  }

  return showWarning(value);
};

export const duration: ITailwindConfig["utils"]["duration"] = createUtility(
  (value) => ({ transitionDuration: value }),
  {
    theme: "transitionDuration",
  }
);

export const ease: ITailwindConfig["utils"]["ease"] = createUtility(
  (value) => ({ transitionTimingFunction: value }),
  {
    theme: "transitionTimingFunction",
  }
);

export const fill: ITailwindConfig["utils"]["fill"] = createUtility(
  (value) => ({ fill: value }),
  {
    theme: "fill",
  }
);

export const fixed: ITailwindConfig["utils"]["fixed"] = () => () => ({
  position: "fixed",
});

export const flex: ITailwindConfig["utils"]["flex"] = createUtility(
  (value) => ({ flexDirection: value }),
  {
    theme: "flex",
    emptyValue: { display: "flex" },
    values: {
      col: "column",
      "col-reverse": "column-reverse",
    },
  }
);

export const float: ITailwindConfig["utils"]["float"] = createUtility(
  (value) => ({ float: value }),
  {
    values: {
      left: "left",
      right: "right",
      none: "none",
    },
  }
);

export const flowRoot: ITailwindConfig["utils"]["flowRoot"] = () => () => ({
  display: "flow-root",
});

export const font: ITailwindConfig["utils"]["font"] = (config) => (
  value: any
) => {
  if (config.theme.fontFamily && config.theme.fontFamily[value]) {
    return { fontFamily: config.theme.fontFamily[value] as any };
  }
  if (config.theme.fontWeight && config.theme.fontWeight[value]) {
    return { fontWeight: Number(config.theme.fontWeight[value]) };
  }

  return showWarning(value);
};

export const gap: ITailwindConfig["utils"]["gap"] = createUtility(
  (value) => ({ gap: value }),
  {
    theme: "gap",
  }
);

export const grid: ITailwindConfig["utils"]["grid"] = createUtility(() => ({
  display: "grid",
}));

export const gridCols: ITailwindConfig["utils"]["gridCols"] = createUtility(
  (value) => ({ gridTemplateColumns: value }),
  {
    theme: "gridTemplateColumns",
  }
);

export const gridFlow: ITailwindConfig["utils"]["gridFlow"] = createUtility(
  (value) => ({ gridAutoFlow: value }),
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
  (value) => ({ gridTemplateRows: value }),
  {
    theme: "gridTemplateRows",
  }
);

export const grow: ITailwindConfig["utils"]["grow"] = createUtility(
  (value) => ({ flexGrow: value }),
  {
    theme: "flexGrow",
  }
);

export const h: ITailwindConfig["utils"]["h"] = createUtility(
  (value) => ({ height: value }),
  {
    theme: "height",
  }
);

export const hidden: ITailwindConfig["utils"]["hidden"] = () => () => ({
  display: "none",
});

export const inline: ITailwindConfig["utils"]["inline"] = () => () => ({
  display: "inline",
});

export const inlineBlock: ITailwindConfig["utils"]["inlineBlock"] = () => () => ({
  display: "inline-block",
});

export const inlineFlex: ITailwindConfig["utils"]["inlineFlex"] = () => () => ({
  display: "inline-flex",
});

export const inlineGrid: ITailwindConfig["utils"]["inlineGrid"] = () => () => ({
  display: "inline-grid",
});

export const inset: ITailwindConfig["utils"]["inset"] = createUtility(
  (value) => ({
    top: value,
    right: value,
    bottom: value,
    left: value,
  }),
  {
    theme: "inset",
  }
);

export const insetX: ITailwindConfig["utils"]["insetX"] = createUtility(
  (value) => ({
    right: value,
    left: value,
  }),
  {
    theme: "inset",
  }
);

export const insetY: ITailwindConfig["utils"]["insetY"] = createUtility(
  (value) => ({
    top: value,
    bottom: value,
  }),
  {
    theme: "inset",
  }
);

export const italic: ITailwindConfig["utils"]["italic"] = () => (isItalic) => ({
  fontStyle: isItalic ? "italic" : "normal",
});

export const items: ITailwindConfig["utils"]["items"] = createUtility(
  (value) => ({ alignItems: value }),
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
  (value) => ({ justifyContent: value }),
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
  (value) => ({ lineHeight: value }),
  {
    theme: "lineHeight",
  }
);

export const left: ITailwindConfig["utils"]["left"] = createUtility(
  (value) => ({ left: value }),
  {
    theme: "inset",
  }
);

export const lineThrough: ITailwindConfig["utils"]["lineThrough"] = () => () => ({
  textDecoration: "line-through",
});

export const list: ITailwindConfig["utils"]["list"] = (config) => (
  arg: any
) => {
  const args = Array.isArray(arg) ? arg : [arg];

  return args.reduce((aggr, value) => {
    if (config.theme.listStyleType && config.theme.listStyleType[value]) {
      return {
        ...aggr,
        listStyleType: config.theme.listStyleType[value] as any,
      };
    }

    return {
      ...aggr,
      listStylePosition:
        ({
          inside: "inside",
          outside: "outside",
        } as any)[value] || showWarning(value),
    };
  }, {});
};

export const lowercase: ITailwindConfig["utils"]["lowercase"] = () => () => ({
  textTransform: "lowercase",
});

export const m: ITailwindConfig["utils"]["m"] = createUtility(
  (value) => ({
    marginTop: value,
    marginRight: value,
    marginBottom: value,
    marginLeft: value,
  }),
  {
    theme: "margin",
  }
);

export const maxH: ITailwindConfig["utils"]["maxH"] = createUtility(
  (value) => ({ maxHeight: value }),
  {
    theme: "maxHeight",
  }
);

export const maxW: ITailwindConfig["utils"]["maxW"] = createUtility(
  (value) => ({ maxWidth: value }),
  {
    theme: "maxWidth",
  }
);

export const mb: ITailwindConfig["utils"]["mb"] = createUtility(
  (value) => ({ marginBottom: value }),
  {
    theme: "margin",
  }
);

export const minH: ITailwindConfig["utils"]["minH"] = createUtility(
  (value) => ({ minHeight: value }),
  {
    theme: "minHeight",
  }
);

export const minW: ITailwindConfig["utils"]["minW"] = createUtility(
  (value) => ({ minWidth: value }),
  {
    theme: "minWidth",
  }
);

export const ml: ITailwindConfig["utils"]["ml"] = createUtility(
  (value) => ({ marginLeft: value }),
  {
    theme: "margin",
  }
);

export const mr: ITailwindConfig["utils"]["mr"] = createUtility(
  (value) => ({ marginRight: value }),
  {
    theme: "margin",
  }
);

export const mt: ITailwindConfig["utils"]["mt"] = createUtility(
  (value) => ({ marginTop: value }),
  {
    theme: "margin",
  }
);

export const mx: ITailwindConfig["utils"]["mx"] = createUtility(
  (value) => ({
    marginLeft: value,
    marginRight: value,
  }),
  {
    theme: "margin",
  }
);

export const my: ITailwindConfig["utils"]["my"] = createUtility(
  (value) => ({
    marginTop: value,
    marginBottom: value,
  }),
  {
    theme: "margin",
  }
);

export const normalCase: ITailwindConfig["utils"]["normalCase"] = () => () => ({
  textTransform: "none",
});

export const table: ITailwindConfig["utils"]["table"] = createUtility(
  {
    caption: { display: "table-caption" },
    cell: { display: "table-cell" },
    column: { display: "table-column" },
    "footer-group": { display: "table-footer-group" },
    "header-group": { display: "table-header-group" },
    "column-group": { display: "table-column-group" },
    "row-group": { display: "table-row-group" },
    row: { display: "table-row" },
    auto: { tableLayout: "auto" },
    fixed: { tableLayout: "fixed" },
  },
  {
    emptyValue: { display: "table" },
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
  return (config) => (arg) => {
    const args = Array.isArray(arg) ? arg : [arg];

    return args.reduce((aggr, value) => {
      if (config.theme.objectPosition && config.theme.objectPosition[value]) {
        return { ...aggr, objectPosition: config.theme.objectPosition[value] };
      }

      return {
        ...aggr,
        ...(values[value]
          ? { objectFit: (values as any)[value] }
          : showWarning(value)),
      };
    }, {});
  };
})();

export const opacity: ITailwindConfig["utils"]["opacity"] = createUtility(
  (value) => ({ opacity: value }),
  {
    theme: "opacity",
  }
);

export const order: ITailwindConfig["utils"]["order"] = createUtility(
  (value) => ({ order: value }),
  {
    theme: "order",
  }
);

export const origin: ITailwindConfig["utils"]["origin"] = createUtility(
  (value) => ({ transformOrigin: value }),
  {
    theme: "transformOrigin",
  }
);

export const outline: ITailwindConfig["utils"]["outline"] = () => (
  value: any
) => ({ outline: value === "none" ? value : showWarning(value) });

const overflowValues = {
  hidden: "hidden",
  visible: "visible",
  scroll: "scroll",
  auto: "auto",
} as any;

export const overflow: ITailwindConfig["utils"]["overflow"] = createUtility(
  (value) => ({ overflow: value }),
  { values: overflowValues }
);

export const overflowX: ITailwindConfig["utils"]["overflowX"] = createUtility(
  (value) => ({ overflowX: value }),
  { values: overflowValues }
);

export const overflowY: ITailwindConfig["utils"]["overflowY"] = createUtility(
  (value) => ({ overflowY: value }),
  { values: overflowValues }
);

export const p: ITailwindConfig["utils"]["p"] = createUtility(
  (value) => ({
    paddingTop: value,
    paddingRight: value,
    paddingBottom: value,
    paddingLeft: value,
  }),
  {
    theme: "padding",
  }
);

export const pb: ITailwindConfig["utils"]["pb"] = createUtility(
  (value) => ({ paddingBottom: value }),
  {
    theme: "padding",
  }
);

export const pl: ITailwindConfig["utils"]["pl"] = createUtility(
  (value) => ({ paddingLeft: value }),
  {
    theme: "padding",
  }
);

export const placeholder: ITailwindConfig["utils"]["placeholder"] = createUtility(
  (value) => ({ "::placeholder": { color: value } }),
  {
    theme: "placeholderColor",
  }
);

export const pointerEvents: ITailwindConfig["utils"]["pointerEvents"] = createUtility(
  (value) => ({ pointerEvents: value }),
  {
    values: {
      none: "none",
      auto: "auto",
    },
  }
);

export const pr: ITailwindConfig["utils"]["pr"] = createUtility(
  (value) => ({ paddingRight: value }),
  {
    theme: "padding",
  }
);

export const pt: ITailwindConfig["utils"]["pt"] = createUtility(
  (value) => ({ paddingTop: value }),

  {
    theme: "padding",
  }
);

export const px: ITailwindConfig["utils"]["px"] = createUtility(
  (value) => ({
    paddingLeft: value,
    paddingRight: value,
  }),
  {
    theme: "padding",
  }
);

export const py: ITailwindConfig["utils"]["py"] = createUtility(
  (value) => ({
    paddingTop: value,
    paddingBottom: value,
  }),
  {
    theme: "padding",
  }
);

export const resize: ITailwindConfig["utils"]["resize"] = createUtility(
  (value) => ({ resize: value }),
  {
    values: {
      none: "none",
      y: "vertical",
      x: "horizontal",
    },
  }
);

export const relative: ITailwindConfig["utils"]["relative"] = () => () => ({
  position: "relative",
});

export const right: ITailwindConfig["utils"]["right"] = createUtility(
  (value) => ({ right: value }),
  {
    theme: "inset",
  }
);

export const rotate: ITailwindConfig["utils"]["rotate"] = createUtility(
  (value) => ({ ["--transform-rotate"]: value }),
  {
    theme: "rotate",
  }
);

export const rounded: ITailwindConfig["utils"]["rounded"] = createUtility(
  (value) => ({ borderRadius: value }),
  {
    theme: "borderRadius",
  }
);

export const roundedB: ITailwindConfig["utils"]["roundedB"] = createUtility(
  (value) => ({
    borderBottomRightRadius: value,
    borderBottomLeftRadius: value,
  }),
  {
    theme: "borderRadius",
  }
);

export const roundedBL: ITailwindConfig["utils"]["roundedBL"] = createUtility(
  (value) => ({ borderBottomLeftRadius: value }),
  {
    theme: "borderRadius",
  }
);

export const roundedBR: ITailwindConfig["utils"]["roundedBR"] = createUtility(
  (value) => ({ borderBottomRightRadius: value }),
  {
    theme: "borderRadius",
  }
);

export const roundedL: ITailwindConfig["utils"]["roundedL"] = createUtility(
  (value) => ({
    borderTopLeftRadius: value,
    borderBottomLeftRadius: value,
  }),
  {
    theme: "borderRadius",
  }
);

export const roundedR: ITailwindConfig["utils"]["roundedR"] = createUtility(
  (value) => ({
    borderBottomRightRadius: value,
    borderTopRightRadius: value,
  }),
  {
    theme: "borderRadius",
  }
);

export const roundedT: ITailwindConfig["utils"]["roundedT"] = createUtility(
  (value) => ({
    borderTopLeftRadius: value,
    borderTopRightRadius: value,
  }),
  {
    theme: "borderRadius",
  }
);

export const roundedTL: ITailwindConfig["utils"]["roundedTL"] = createUtility(
  (value) => ({ borderTopLeftRadius: value }),
  {
    theme: "borderRadius",
  }
);

export const roundedTR: ITailwindConfig["utils"]["roundedTR"] = createUtility(
  (value) => ({ borderTopRightRadius: value }),
  {
    theme: "borderRadius",
  }
);

export const row: ITailwindConfig["utils"]["row"] = createUtility(
  (value) => ({ gridRow: value }),
  {
    theme: "gridRow",
  }
);

export const rowEnd: ITailwindConfig["utils"]["rowEnd"] = createUtility(
  (value) => ({ gridRowEnd: value }),
  {
    theme: "gridRowEnd",
  }
);

export const rowGap: ITailwindConfig["utils"]["rowGap"] = createUtility(
  (value) => ({ rowGap: value }),
  {
    theme: "gap",
  }
);

export const rowStart: ITailwindConfig["utils"]["rowStart"] = createUtility(
  (value) => ({ gridRowStart: value }),
  {
    theme: "gridRowStart",
  }
);

export const scale: ITailwindConfig["utils"]["scale"] = createUtility(
  (value) => ({
    ["--transform-scale-x"]: value,
    ["--transform-scale-y"]: value,
  }),
  {
    theme: "scale",
  }
);

export const scaleX: ITailwindConfig["utils"]["scaleX"] = createUtility(
  (value) => ({ ["--transform-scale-x"]: value }),
  {
    theme: "scale",
  }
);

export const scaleY: ITailwindConfig["utils"]["scaleY"] = createUtility(
  (value) => ({ ["--transform-scale-y"]: value }),
  {
    theme: "scale",
  }
);

export const scrolling: ITailwindConfig["utils"]["scrolling"] = createUtility(
  (value) => ({
    WebkitOverflowScrolling:
      ({
        touch: "touch",
        auto: "auto",
      } as any)[value] || showWarning(value),
  })
);

export const select: ITailwindConfig["utils"]["select"] = createUtility(
  (value) => ({ userSelect: value }),
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
  (value) => ({ alignSelf: value }),
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
  (value) => ({ boxShadow: value }),
  {
    theme: "boxShadow",
  }
);

export const shrink: ITailwindConfig["utils"]["shrink"] = createUtility(
  (value) => ({ flexShrink: value }),
  {
    theme: "flexShrink",
  }
);

export const skewX: ITailwindConfig["utils"]["skewX"] = createUtility(
  (value) => ({ ["--transform-skew-x"]: value }),
  {
    theme: "skew",
  }
);

export const skewY: ITailwindConfig["utils"]["skewY"] = createUtility(
  (value) => ({ ["--transform-skew-y"]: value }),
  {
    theme: "skew",
  }
);

export const spaceBottom: ITailwindConfig["utils"]["spaceBottom"] = createUtility(
  (value) => ({ " > * + *": { marginBottom: value } }),
  {
    theme: "margin",
  }
);

export const spaceLeft: ITailwindConfig["utils"]["spaceLeft"] = createUtility(
  (value) => ({ " > * + *": { marginLeft: value } }),
  {
    theme: "margin",
  }
);

export const spaceRight: ITailwindConfig["utils"]["spaceRight"] = createUtility(
  (value) => ({ " > * + *": { marginRight: value } }),
  {
    theme: "margin",
  }
);

export const spaceTop: ITailwindConfig["utils"]["spaceTop"] = createUtility(
  (value) => ({ " > * + *": { marginTop: value } }),
  {
    theme: "margin",
  }
);

export const srOnly: ITailwindConfig["utils"]["srOnly"] = () => (isSrOnly) =>
  isSrOnly
    ? {
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0 ,0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }
    : {
        position: "static",
        width: "auto",
        height: "auto",
        padding: 0,
        margin: 0,
        overflow: "visible",
        clip: "auto",
        whiteSpace: "normal",
      };

export const staticPosition: ITailwindConfig["utils"]["staticPosition"] = () => () => ({
  position: "static",
});

export const sticky: ITailwindConfig["utils"]["sticky"] = () => () => ({
  position: "sticky",
});

export const stroke: ITailwindConfig["utils"]["stroke"] = (config) => (
  value: any
) => {
  if (config.theme.stroke && config.theme.stroke[value]) {
    return { stroke: config.theme.stroke[value] };
  }

  if (config.theme.strokeWidth && config.theme.strokeWidth[value]) {
    return { strokeWidth: config.theme.strokeWidth[value] };
  }

  return showWarning(value);
};

export const subpixelAntialiased: ITailwindConfig["utils"]["subpixelAntialiased"] = () => () => ({
  // @ts-ignore
  WebkitFontSmoothing: "auto",
  // @ts-ignore
  MozOsxFontSmoothing: "auto",
});

export const text = ((): ITailwindConfig["utils"]["text"] => {
  const values = {
    left: "left",
    right: "right",
    center: "center",
    justify: "justify",
  };
  return (config) => (value: any) => {
    if (config.theme.textColor && config.theme.textColor[value]) {
      return { color: config.theme.textColor[value] as any };
    }

    if (config.theme.fontSize && config.theme.fontSize[value]) {
      return { fontSize: config.theme.fontSize[value] };
    }

    return { textAlign: (values as any)[value] || showWarning(value) };
  };
})();

export const top: ITailwindConfig["utils"]["top"] = createUtility(
  (value) => ({ top: value }),
  {
    theme: "inset",
  }
);

export const tracking: ITailwindConfig["utils"]["tracking"] = createUtility(
  (value) => ({ letterSpacing: value }),
  {
    theme: "letterSpacing",
  }
);

export const transform: ITailwindConfig["utils"]["transform"] = () => () => ({
  ["--transform-translate-x"]: 0,
  ["--transform-translate-y"]: 0,
  ["--transform-rotate"]: 0,
  ["--transform-skew-x"]: 0,
  ["--transform-skew-y"]: 0,
  ["--transform-scale-x"]: 1,
  ["--transform-scale-y"]: 1,
  transform:
    "translateX(var(--transform-translate-x)) translateY(var(--transform-translate-y)) rotate(var(--transform-rotate)) skewX(var(--transform-skew-x)) skewY(var(--transform-skew-y)) scaleX(var(--transform-scale-x)) scaleY(var(--transform-scale-y))",
});

export const transition: ITailwindConfig["utils"]["transition"] = createUtility(
  (value) => ({ transitionProperty: value }),
  {
    theme: "transitionProperty",
  }
);

export const translateX: ITailwindConfig["utils"]["translateX"] = createUtility(
  (value) => ({ ["--transform-translate-x"]: value }),
  {
    theme: "translate",
  }
);

export const translateY: ITailwindConfig["utils"]["translateY"] = createUtility(
  (value) => ({ ["--transform-translate-y"]: value }),
  {
    theme: "translate",
  }
);

export const truncate: ITailwindConfig["utils"]["truncate"] = () => () => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const underline: ITailwindConfig["utils"]["underline"] = () => (
  hasUnderline
) => ({
  textDecoration: hasUnderline ? "underline" : "none",
});

export const uppercase: ITailwindConfig["utils"]["uppercase"] = () => () => ({
  textTransform: "uppercase",
});

export const visible: ITailwindConfig["utils"]["visible"] = () => (
  isVisible
) => ({
  visibility: isVisible ? "visible" : "hidden",
});

export const w: ITailwindConfig["utils"]["w"] = createUtility(
  (value) => ({ width: value }),
  {
    theme: "width",
  }
);

export const whitespace: ITailwindConfig["utils"]["whitespace"] = createUtility(
  (value) => ({ whiteSpace: value }),
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
  (value) => ({ flexWrap: value }),
  {
    values: {
      none: "none",
      reverse: "wrap-reverse",
    },
    emptyValue: { flexWrap: "wrap" },
  }
);

export const z: ITailwindConfig["utils"]["z"] = createUtility(
  (value) => ({ zIndex: value }),
  {
    theme: "zIndex",
  }
);
