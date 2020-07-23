// tslint:disable-next-line: no-duplicate-imports
import { ITailwindConfig, TTailwindUtility } from "./utils";
import { createCss } from "@stitches/css";
import * as theme from "./theme";
import * as utils from "./utils";

type TMergedUtilityPayload<
  U extends TTailwindUtility<any>,
  T extends object | undefined
> = U extends TTailwindUtility<infer P>
  ? TTailwindUtility<T extends void ? P : P | keyof T | (keyof T)[]>
  : never;

export const createTailwindConfig = <T extends ITailwindConfig>(
  config: T
): {
  theme: T["theme"];
  screens: T["screens"] extends unknown ? {} : T["screens"];
  utilityFirst: true;
  utils: T["utils"] & {
    bg: TMergedUtilityPayload<
      T["utils"]["bg"],
      T["theme"]["backgroundPosition"] &
        T["theme"]["backgroundSize"] &
        T["theme"]["backgroundColor"]
    >;
    border: TMergedUtilityPayload<
      T["utils"]["border"],
      T["theme"]["borderWidth"] & T["theme"]["borderColor"]
    >;
    borderB: TMergedUtilityPayload<
      T["utils"]["borderB"],
      T["theme"]["borderWidth"] & T["theme"]["borderColor"]
    >;
    borderL: TMergedUtilityPayload<
      T["utils"]["borderL"],
      T["theme"]["borderWidth"] & T["theme"]["borderColor"]
    >;
    borderR: TMergedUtilityPayload<
      T["utils"]["borderR"],
      T["theme"]["borderWidth"] & T["theme"]["borderColor"]
    >;
    borderT: TMergedUtilityPayload<
      T["utils"]["borderT"],
      T["theme"]["borderWidth"] & T["theme"]["borderColor"]
    >;
    bottom: TMergedUtilityPayload<T["utils"]["bottom"], T["theme"]["inset"]>;
    col: TMergedUtilityPayload<T["utils"]["col"], T["theme"]["gridColumn"]>;
    colGap: TMergedUtilityPayload<T["utils"]["colGap"], T["theme"]["gap"]>;
    colStart: TMergedUtilityPayload<
      T["utils"]["colStart"],
      T["theme"]["gridColumnStart"]
    >;
    cursor: TMergedUtilityPayload<T["utils"]["cursor"], T["theme"]["cursor"]>;
    delay: TMergedUtilityPayload<
      T["utils"]["delay"],
      T["theme"]["transitionDelay"]
    >;
    divideBottom: TMergedUtilityPayload<
      T["utils"]["divideBottom"],
      T["theme"]["divideWidth"] & T["theme"]["divideColor"]
    >;
    divideLeft: TMergedUtilityPayload<
      T["utils"]["divideLeft"],
      T["theme"]["divideWidth"] & T["theme"]["divideColor"]
    >;
    divideRight: TMergedUtilityPayload<
      T["utils"]["divideRight"],
      T["theme"]["divideWidth"] & T["theme"]["divideColor"]
    >;
    divideTop: TMergedUtilityPayload<
      T["utils"]["divideTop"],
      T["theme"]["divideWidth"] & T["theme"]["divideColor"]
    >;
    duration: TMergedUtilityPayload<
      T["utils"]["duration"],
      T["theme"]["transitionDuration"]
    >;
    ease: TMergedUtilityPayload<
      T["utils"]["ease"],
      T["theme"]["transitionTimingFunction"]
    >;
    fill: TMergedUtilityPayload<T["utils"]["fill"], T["theme"]["fill"]>;
    flex: TMergedUtilityPayload<T["utils"]["flex"], T["theme"]["flex"]>;
    font: TMergedUtilityPayload<
      T["utils"]["font"],
      T["theme"]["fontFamily"] & T["theme"]["fontWeight"]
    >;
    gap: TMergedUtilityPayload<T["utils"]["gap"], T["theme"]["gap"]>;
    gridCols: TMergedUtilityPayload<
      T["utils"]["gridCols"],
      T["theme"]["gridTemplateColumns"]
    >;
    gridRows: TMergedUtilityPayload<
      T["utils"]["gridRows"],
      T["theme"]["gridTemplateRows"]
    >;
    grow: TMergedUtilityPayload<T["utils"]["grow"], T["theme"]["flexGrow"]>;
    h: TMergedUtilityPayload<T["utils"]["h"], T["theme"]["height"]>;
    inset: TMergedUtilityPayload<T["utils"]["inset"], T["theme"]["inset"]>;
    insetX: TMergedUtilityPayload<T["utils"]["insetX"], T["theme"]["inset"]>;
    insetY: TMergedUtilityPayload<T["utils"]["insetY"], T["theme"]["inset"]>;
    leading: TMergedUtilityPayload<
      T["utils"]["leading"],
      T["theme"]["lineHeight"]
    >;
    left: TMergedUtilityPayload<T["utils"]["left"], T["theme"]["inset"]>;
    list: TMergedUtilityPayload<
      T["utils"]["list"],
      T["theme"]["listStyleType"]
    >;
    m: TMergedUtilityPayload<T["utils"]["m"], T["theme"]["margin"]>;
    maxH: TMergedUtilityPayload<T["utils"]["maxH"], T["theme"]["maxHeight"]>;
    maxW: TMergedUtilityPayload<T["utils"]["maxW"], T["theme"]["maxWidth"]>;
    mb: TMergedUtilityPayload<T["utils"]["mb"], T["theme"]["margin"]>;
    minH: TMergedUtilityPayload<T["utils"]["minH"], T["theme"]["minHeight"]>;
    minW: TMergedUtilityPayload<T["utils"]["minW"], T["theme"]["minWidth"]>;
    ml: TMergedUtilityPayload<T["utils"]["ml"], T["theme"]["margin"]>;
    mr: TMergedUtilityPayload<T["utils"]["mr"], T["theme"]["margin"]>;
    mt: TMergedUtilityPayload<T["utils"]["mt"], T["theme"]["margin"]>;
    mx: TMergedUtilityPayload<T["utils"]["mx"], T["theme"]["margin"]>;
    my: TMergedUtilityPayload<T["utils"]["my"], T["theme"]["margin"]>;
    object: TMergedUtilityPayload<
      T["utils"]["object"],
      T["theme"]["objectPosition"]
    >;
    opacity: TMergedUtilityPayload<
      T["utils"]["opacity"],
      T["theme"]["opacity"]
    >;
    order: TMergedUtilityPayload<T["utils"]["order"], T["theme"]["order"]>;
    origin: TMergedUtilityPayload<
      T["utils"]["origin"],
      T["theme"]["transformOrigin"]
    >;
    p: TMergedUtilityPayload<T["utils"]["p"], T["theme"]["padding"]>;
    pb: TMergedUtilityPayload<T["utils"]["pb"], T["theme"]["padding"]>;
    pl: TMergedUtilityPayload<T["utils"]["pl"], T["theme"]["padding"]>;
    placeholder: TMergedUtilityPayload<
      T["utils"]["placeholder"],
      T["theme"]["placeholderColor"]
    >;
    pr: TMergedUtilityPayload<T["utils"]["pr"], T["theme"]["padding"]>;
    px: TMergedUtilityPayload<T["utils"]["px"], T["theme"]["padding"]>;
    py: TMergedUtilityPayload<T["utils"]["py"], T["theme"]["padding"]>;
    right: TMergedUtilityPayload<T["utils"]["right"], T["theme"]["inset"]>;
    rotate: TMergedUtilityPayload<T["utils"]["rotate"], T["theme"]["rotate"]>;
    rounded: TMergedUtilityPayload<
      T["utils"]["rounded"],
      T["theme"]["borderRadius"]
    >;
    roundedB: TMergedUtilityPayload<
      T["utils"]["roundedB"],
      T["theme"]["borderRadius"]
    >;
    roundedBL: TMergedUtilityPayload<
      T["utils"]["roundedBL"],
      T["theme"]["borderRadius"]
    >;
    roundedBR: TMergedUtilityPayload<
      T["utils"]["roundedBR"],
      T["theme"]["borderRadius"]
    >;
    roundedL: TMergedUtilityPayload<
      T["utils"]["roundedL"],
      T["theme"]["borderRadius"]
    >;
    roundedR: TMergedUtilityPayload<
      T["utils"]["roundedR"],
      T["theme"]["borderRadius"]
    >;
    roundedT: TMergedUtilityPayload<
      T["utils"]["roundedT"],
      T["theme"]["borderRadius"]
    >;
    roundedTL: TMergedUtilityPayload<
      T["utils"]["roundedTL"],
      T["theme"]["borderRadius"]
    >;
    roundedTR: TMergedUtilityPayload<
      T["utils"]["roundedTR"],
      T["theme"]["borderRadius"]
    >;
    row: TMergedUtilityPayload<T["utils"]["row"], T["theme"]["gridRow"]>;
    rowEnd: TMergedUtilityPayload<
      T["utils"]["rowEnd"],
      T["theme"]["gridRowEnd"]
    >;
    rowGap: TMergedUtilityPayload<T["utils"]["rowGap"], T["theme"]["gap"]>;
    scale: TMergedUtilityPayload<T["utils"]["scale"], T["theme"]["scale"]>;
    scaleX: TMergedUtilityPayload<T["utils"]["scaleX"], T["theme"]["scale"]>;
    scaleY: TMergedUtilityPayload<T["utils"]["scaleY"], T["theme"]["scale"]>;
    shadow: TMergedUtilityPayload<
      T["utils"]["shadow"],
      T["theme"]["boxShadow"]
    >;
    shrink: TMergedUtilityPayload<
      T["utils"]["shrink"],
      T["theme"]["flexShrink"]
    >;
    skewX: TMergedUtilityPayload<T["utils"]["skewX"], T["theme"]["skew"]>;
    skewY: TMergedUtilityPayload<T["utils"]["skewY"], T["theme"]["skew"]>;
    spaceBottom: TMergedUtilityPayload<
      T["utils"]["spaceBottom"],
      T["theme"]["margin"]
    >;
    spaceLeft: TMergedUtilityPayload<
      T["utils"]["spaceLeft"],
      T["theme"]["margin"]
    >;
    spaceRight: TMergedUtilityPayload<
      T["utils"]["spaceRight"],
      T["theme"]["margin"]
    >;
    spaceTop: TMergedUtilityPayload<
      T["utils"]["spaceTop"],
      T["theme"]["margin"]
    >;
    stroke: TMergedUtilityPayload<
      T["utils"]["stroke"],
      T["theme"]["stroke"] & T["theme"]["strokeWidth"]
    >;
    text: TMergedUtilityPayload<
      T["utils"]["text"],
      T["theme"]["textColor"] & T["theme"]["fontSize"]
    >;
    top: TMergedUtilityPayload<T["utils"]["top"], T["theme"]["inset"]>;
    tracking: TMergedUtilityPayload<
      T["utils"]["tracking"],
      T["theme"]["letterSpacing"]
    >;
    transition: TMergedUtilityPayload<
      T["utils"]["transition"],
      T["theme"]["transitionProperty"]
    >;
    translateX: TMergedUtilityPayload<
      T["utils"]["translateX"],
      T["theme"]["translate"]
    >;
    translateY: TMergedUtilityPayload<
      T["utils"]["translateY"],
      T["theme"]["translate"]
    >;
    w: TMergedUtilityPayload<T["utils"]["w"], T["theme"]["width"]>;
    z: TMergedUtilityPayload<T["utils"]["z"], T["theme"]["zIndex"]>;
  };
} => ({ ...config, utilityFirst: true } as any);
