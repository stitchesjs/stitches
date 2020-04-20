import type {
  StandardLonghandProperties,
  StandardShorthandProperties,
} from "csstype";
// tslint:disable-next-line: ordered-imports
import { createCss } from "@stitches/css";

import * as theme from "./theme";
import * as utils from "./utils";
// tslint:disable-next-line: no-duplicate-imports
import { ITailwindConfig, IThemeValue, TTailwindUtility } from "./utils";

type TMergedUtilityPayload<
  U extends TTailwindUtility,
  T extends IThemeValue | undefined
> = U extends TTailwindUtility<infer P>
  ? TTailwindUtility<keyof T extends never ? P : P | keyof T>
  : never;

export const createConfig = <T extends ITailwindConfig>(
  config: T
): {
  theme: T["theme"];
  screens: T["screens"];
  utilityFirst: true;
  utils: T["utils"] & {
    container: TMergedUtilityPayload<
      T["utils"]["container"],
      T["theme"]["container"]
    >;
    order: TMergedUtilityPayload<T["utils"]["order"], T["theme"]["order"]>;
    grid: TMergedUtilityPayload<
      T["utils"]["grid"],
      T["theme"]["gridTemplateColumns"] & T["theme"]["gridTemplateRows"]
    >;
    col: TMergedUtilityPayload<
      T["utils"]["col"],
      T["theme"]["gridColumn"] &
        T["theme"]["gridColumnStart"] &
        T["theme"]["gridColumnEnd"] &
        T["theme"]["gap"]
    >;
    row: TMergedUtilityPayload<
      T["utils"]["col"],
      T["theme"]["gridRow"] &
        T["theme"]["gridRowStart"] &
        T["theme"]["gridRowEnd"] &
        T["theme"]["gap"]
    >;
    gap: TMergedUtilityPayload<T["utils"]["gap"], T["theme"]["gap"]>;
    p: TMergedUtilityPayload<T["utils"]["p"], T["theme"]["padding"]>;
    py: TMergedUtilityPayload<T["utils"]["py"], T["theme"]["padding"]>;
    px: TMergedUtilityPayload<T["utils"]["px"], T["theme"]["padding"]>;
    pt: TMergedUtilityPayload<T["utils"]["pt"], T["theme"]["padding"]>;
    pr: TMergedUtilityPayload<T["utils"]["pr"], T["theme"]["padding"]>;
    pb: TMergedUtilityPayload<T["utils"]["pb"], T["theme"]["padding"]>;
    pl: TMergedUtilityPayload<T["utils"]["pl"], T["theme"]["padding"]>;
    m: TMergedUtilityPayload<T["utils"]["m"], T["theme"]["margin"]>;
    my: TMergedUtilityPayload<T["utils"]["my"], T["theme"]["margin"]>;
    mx: TMergedUtilityPayload<T["utils"]["mx"], T["theme"]["margin"]>;
    mt: TMergedUtilityPayload<T["utils"]["mt"], T["theme"]["margin"]>;
    mr: TMergedUtilityPayload<T["utils"]["mr"], T["theme"]["margin"]>;
    mb: TMergedUtilityPayload<T["utils"]["mb"], T["theme"]["margin"]>;
    ml: TMergedUtilityPayload<T["utils"]["ml"], T["theme"]["margin"]>;
    width: TMergedUtilityPayload<T["utils"]["w"], T["theme"]["width"]>;
    minWidth: TMergedUtilityPayload<
      T["utils"]["minWidth"],
      T["theme"]["minWidth"]
    >;
    minHeight: TMergedUtilityPayload<
      T["utils"]["minHeight"],
      T["theme"]["minHeight"]
    >;
    maxWidth: TMergedUtilityPayload<
      T["utils"]["maxWidth"],
      T["theme"]["maxWidth"]
    >;
    maxHeight: TMergedUtilityPayload<
      T["utils"]["maxHeight"],
      T["theme"]["maxHeight"]
    >;
    h: TMergedUtilityPayload<T["utils"]["h"], T["theme"]["height"]>;
    font: TMergedUtilityPayload<
      T["utils"]["font"],
      T["theme"]["fontFamily"] & T["theme"]["fontWeight"]
    >;
    text: TMergedUtilityPayload<
      T["utils"]["text"],
      T["theme"]["textColor"] & T["theme"]["fontSize"]
    >;
    tracking: TMergedUtilityPayload<
      T["utils"]["tracking"],
      T["theme"]["letterSpacing"]
    >;
    leading: TMergedUtilityPayload<
      T["utils"]["leading"],
      T["theme"]["lineHeight"]
    >;
    list: TMergedUtilityPayload<
      T["utils"]["list"],
      T["theme"]["listStyleType"]
    >;
    placeholder: TMergedUtilityPayload<
      T["utils"]["placeholder"],
      T["theme"]["placeholderColor"]
    >;
    bg: TMergedUtilityPayload<T["utils"]["bg"], T["theme"]["backgroundColor"]>;
    border: TMergedUtilityPayload<
      T["utils"]["border"],
      T["theme"]["borderColor"] &
        T["theme"]["borderWidth"] &
        T["theme"]["borderWidth"]
    >;
    borderT: TMergedUtilityPayload<
      T["utils"]["borderT"],
      T["theme"]["borderColor"] &
        T["theme"]["borderWidth"] &
        T["theme"]["borderWidth"]
    >;
    borderR: TMergedUtilityPayload<
      T["utils"]["borderR"],
      T["theme"]["borderColor"] &
        T["theme"]["borderWidth"] &
        T["theme"]["borderWidth"]
    >;
    borderB: TMergedUtilityPayload<
      T["utils"]["borderB"],
      T["theme"]["borderColor"] &
        T["theme"]["borderWidth"] &
        T["theme"]["borderWidth"]
    >;
    borderL: TMergedUtilityPayload<
      T["utils"]["borderL"],
      T["theme"]["borderColor"] &
        T["theme"]["borderWidth"] &
        T["theme"]["borderWidth"]
    >;
    rounded: TMergedUtilityPayload<
      T["utils"]["rounded"],
      T["theme"]["borderRadius"]
    >;
    roundedT: TMergedUtilityPayload<
      T["utils"]["roundedT"],
      T["theme"]["borderRadius"]
    >;
    roundedR: TMergedUtilityPayload<
      T["utils"]["roundedR"],
      T["theme"]["borderRadius"]
    >;
    roundedL: TMergedUtilityPayload<
      T["utils"]["roundedL"],
      T["theme"]["borderRadius"]
    >;
    roundedB: TMergedUtilityPayload<
      T["utils"]["roundedB"],
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
    roundedBR: TMergedUtilityPayload<
      T["utils"]["roundedBR"],
      T["theme"]["borderRadius"]
    >;
    roundedBL: TMergedUtilityPayload<
      T["utils"]["roundedBL"],
      T["theme"]["borderRadius"]
    >;
    shadow: TMergedUtilityPayload<
      T["utils"]["shadow"],
      T["theme"]["boxShadow"]
    >;
    opacity: TMergedUtilityPayload<
      T["utils"]["opacity"],
      T["theme"]["opacity"]
    >;
    transition: TMergedUtilityPayload<
      T["utils"]["transition"],
      T["theme"]["transitionProperty"]
    >;
    duration: TMergedUtilityPayload<
      T["utils"]["duration"],
      T["theme"]["transitionDuration"]
    >;
    ease: TMergedUtilityPayload<
      T["utils"]["ease"],
      T["theme"]["transitionTimingFunction"]
    >;
    scale: TMergedUtilityPayload<T["utils"]["scale"], T["theme"]["scale"]>;
    scaleX: TMergedUtilityPayload<T["utils"]["scaleX"], T["theme"]["scale"]>;
    scaleY: TMergedUtilityPayload<T["utils"]["scaleY"], T["theme"]["scale"]>;
    rotate: TMergedUtilityPayload<T["utils"]["rotate"], T["theme"]["rotate"]>;
    translateX: TMergedUtilityPayload<
      T["utils"]["translateX"],
      T["theme"]["translate"]
    >;
    translateY: TMergedUtilityPayload<
      T["utils"]["translateY"],
      T["theme"]["translate"]
    >;
    skewX: TMergedUtilityPayload<T["utils"]["skewX"], T["theme"]["skew"]>;
    skewY: TMergedUtilityPayload<T["utils"]["skewY"], T["theme"]["skew"]>;
    origin: TMergedUtilityPayload<
      T["utils"]["origin"],
      T["theme"]["transformOrigin"]
    >;
    cursor: TMergedUtilityPayload<T["utils"]["cursor"], T["theme"]["cursor"]>;
    fill: TMergedUtilityPayload<T["utils"]["fill"], T["theme"]["fill"]>;
    stroke: TMergedUtilityPayload<
      T["utils"]["stroke"],
      T["theme"]["stroke"] & T["theme"]["strokeWidth"]
    >;
  };
} => ({ ...config, utilityFirst: true } as any);

export const tailwind = createConfig({
  screens: {
    sm: (cssRule) => `@media (min-width: ${theme.screens.sm}) { ${cssRule}}`,
    md: (cssRule) => `@media (min-width: ${theme.screens.md}) { ${cssRule}}`,
    lg: (cssRule) => `@media (min-width: ${theme.screens.lg}) { ${cssRule}}`,
    xl: (cssRule) => `@media (min-width: ${theme.screens.xl}) { ${cssRule}}`,
  },
  theme,
  utilityFirst: true,
  utils,
});

export const css = createCss(tailwind);
