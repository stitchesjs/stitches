import {
  Color,
  FlexProperty,
  LineStyle,
  LineWidth,
  Properties,
} from "./css-types";

export interface IBreakpoints {
  [key: string]: (css: string) => string;
}

export const ATOM = Symbol("ATOM");

export interface IAtom {
  id: string;
  cssHyphenProp: string;
  value: string;
  selector: string | undefined;
  breakpoint: string;
  inlineMediaQueries: string[] | undefined;
  _className?: string;
  toString: (this: IAtom) => string;
  [ATOM]: true;
}

export interface IThemeAtom {
  name: string;
  definition: ITokensDefinition;
  toString: (this: IThemeAtom) => string;
  [ATOM]: true;
}

export interface IComposedAtom {
  atoms: IAtom[];
  _className?: string;
  toString: (this: IComposedAtom) => string;
  [ATOM]: true;
}

export interface IKeyframesAtom {
  id: string;
  _cssRuleString?: string;
  toString: (this: IKeyframesAtom) => string;
  [ATOM]: true;
}

export type TRecursiveCss<
  T extends TConfig,
  D = {
    [K in keyof Properties]?: K extends keyof ICssPropToToken<T>
      ? ICssPropToToken<T>[K] | Properties[K]
      : Properties[K];
  }
> = (
  | D
  | {
      [pseudo: string]: (
        | D
        | { [pseudo: string]: (D | { [pseudo: string]: D }) & D }
      ) &
        D;
    }
) &
  D;

export type TFlatCSS<
  T extends TConfig,
  D = {
    [K in keyof Properties]?: K extends keyof ICssPropToToken<T>
      ? ICssPropToToken<T>[K] | Properties[K]
      : Properties[K];
  }
> = D;

export type TFlatUtils<
  T extends TConfig,
  UT = {
    [U in keyof T["utils"]]?: T["utils"][U] extends TUtility<any, any>
      ? ReturnType<T["utils"][U]> extends (arg: infer A) => {}
        ? A
        : never
      : never;
  }
> = UT;

export type TRecursiveUtils<
  T extends TConfig,
  UT = {
    [U in keyof T["utils"]]?: T["utils"][U] extends TUtility<any, any>
      ? ReturnType<T["utils"][U]> extends (arg: infer A) => {}
        ? A
        : never
      : never;
  }
> = (
  | UT
  | {
      [pseudo: string]: (
        | UT
        | { [pseudo: string]: (UT | { [pseudo: string]: UT }) & UT }
      ) &
        UT;
    }
) &
  UT;

export type TUtility<A extends any, T extends TConfig> = (
  config: T
) => (arg: A) => TRecursiveCss<T>;

export type ICssPropToToken<T extends TConfig> = T["tokens"] extends object
  ? {
      gap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      gridGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      columnGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      gridColumnGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      rowGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      gridRowGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      inset: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      insetBlock: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      insetBlockEnd: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      insetBlockStart: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      insetInline: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      insetInlineEnd: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      insetInlineStart: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      margin: T["tokens"]["space"] extends object
        ?
            | keyof T["tokens"]["space"]
            | [keyof T["tokens"]["space"], keyof T["tokens"]["space"]]
            | [
                keyof T["tokens"]["space"],
                keyof T["tokens"]["space"],
                keyof T["tokens"]["space"]
              ]
            | [
                keyof T["tokens"]["space"],
                keyof T["tokens"]["space"],
                keyof T["tokens"]["space"],
                keyof T["tokens"]["space"]
              ]
        : never;
      marginTop: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginRight: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginBottom: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginLeft: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginInline: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginInlineEnd: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginInlineStart: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginBlock: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginBlockEnd: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginBlockStart: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      padding: T["tokens"]["space"] extends object
        ?
            | keyof T["tokens"]["space"]
            | [keyof T["tokens"]["space"], keyof T["tokens"]["space"]]
            | [
                keyof T["tokens"]["space"],
                keyof T["tokens"]["space"],
                keyof T["tokens"]["space"]
              ]
            | [
                keyof T["tokens"]["space"],
                keyof T["tokens"]["space"],
                keyof T["tokens"]["space"],
                keyof T["tokens"]["space"]
              ]
        : never;
      paddingTop: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingRight: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingBottom: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingLeft: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingInline: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingInlineEnd: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingInlineStart: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingBlock: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingBlockEnd: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingBlockStart: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      top: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      right: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      bottom: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      left: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      fontSize: T["tokens"]["fontSizes"] extends object
        ? keyof T["tokens"]["fontSizes"]
        : never;
      backgroundColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      border: [
        LineWidth<(string & {}) | 0>,
        T["tokens"]["borderStyles"] extends object
          ? keyof T["tokens"]["borderStyles"]
          : LineStyle,
        T["tokens"]["colors"] extends object
          ? keyof T["tokens"]["colors"]
          : Color
      ];
      borderColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      borderTopColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      borderRightColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      borderBottomColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      borderLeftColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      caretColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      color: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      columnRuleColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      outlineColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      fill: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      stroke: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      fontFamily: T["tokens"]["fonts"] extends object
        ? keyof T["tokens"]["fonts"]
        : never;
      fontWeight: T["tokens"]["fontWeights"] extends object
        ? keyof T["tokens"]["fontWeights"]
        : never;
      lineHeight: T["tokens"]["lineHeights"] extends object
        ? keyof T["tokens"]["lineHeights"]
        : never;
      letterSpacing: T["tokens"]["letterSpacings"] extends object
        ? keyof T["tokens"]["letterSpacings"]
        : never;
      blockSize: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      minBlockSize: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      maxBlockSize: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      inlineSize: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      minInlineSize: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      maxInlineSize: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      width: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      minWidth: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      maxWidth: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      height: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      minHeight: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      maxHeight: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      flexBasis: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      flex:
        | (T["tokens"]["space"] extends object
            ? keyof T["tokens"]["space"]
            : never)
        | [
            number,
            T["tokens"]["space"] extends object
              ? keyof T["tokens"]["space"]
              : string | number
          ]
        | [
            number,
            number,
            T["tokens"]["sizes"] extends object
              ? keyof T["tokens"]["sizes"]
              : string | number
          ];

      borderWidth: T["tokens"]["borderWidths"] extends object
        ? keyof T["tokens"]["borderWidths"]
        : never;
      borderTopWidth: T["tokens"]["borderWidths"] extends object
        ? keyof T["tokens"]["borderWidths"]
        : never;
      borderLeftWidth: T["tokens"]["borderWidths"] extends object
        ? keyof T["tokens"]["borderWidths"]
        : never;
      borderRightWidth: T["tokens"]["borderWidths"] extends object
        ? keyof T["tokens"]["borderWidths"]
        : never;
      borderBottomWidth: T["tokens"]["borderWidths"] extends object
        ? keyof T["tokens"]["borderWidths"]
        : never;
      borderStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : never;
      borderTopStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : never;
      borderRightStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : never;
      borderBottomStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : never;
      borderLeftStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : never;
      borderRadius: T["tokens"]["radii"] extends object
        ? keyof T["tokens"]["radii"]
        : never;
      borderTopLeftRadius: T["tokens"]["radii"] extends object
        ? keyof T["tokens"]["radii"]
        : never;
      borderTopRightRadius: T["tokens"]["radii"] extends object
        ? keyof T["tokens"]["radii"]
        : never;
      borderBottomRightRadius: T["tokens"]["radii"] extends object
        ? keyof T["tokens"]["radii"]
        : never;
      borderBottomLeftRadius: T["tokens"]["radii"] extends object
        ? keyof T["tokens"]["radii"]
        : never;
      boxShadow: T["tokens"]["shadows"] extends object
        ? keyof T["tokens"]["shadows"]
        : [
            string | number,
            string | number,
            string | number,
            T["tokens"]["colors"] extends object
              ? keyof T["tokens"]["colors"]
              : Color
          ];
      textShadow: T["tokens"]["shadows"] extends object
        ? keyof T["tokens"]["shadows"]
        : never;
      zIndex: T["tokens"]["zIndices"] extends object
        ? keyof T["tokens"]["zIndices"]
        : never;
      transition: T["tokens"]["transitions"] extends object
        ? keyof T["tokens"]["transitions"]
        : never;
    }
  : {};

export interface ITokenDefinition {
  [key: string]: string;
  [key: number]: string;
}

export interface ITokensDefinition {
  colors?: ITokenDefinition;
  space?: ITokenDefinition;
  fontSizes?: ITokenDefinition;
  fonts?: ITokenDefinition;
  fontWeights?: ITokenDefinition;
  lineHeights?: ITokenDefinition;
  letterSpacings?: ITokenDefinition;
  sizes?: ITokenDefinition;
  borderWidths?: ITokenDefinition;
  borderStyles?: ITokenDefinition;
  radii?: ITokenDefinition;
  shadows?: ITokenDefinition;
  zIndices?: ITokenDefinition;
  transitions?: ITokenDefinition;
}
export interface IUtils {
  [name: string]: TUtility<any, any>;
}

export type TConfig<STRICT_MODE extends boolean = false> = {
  showFriendlyClassnames?: boolean;
  prefix?: string;
  utilityFirst?: boolean;
} & (STRICT_MODE extends true
  ? { breakpoints: IBreakpoints; tokens: ITokensDefinition; utils: IUtils }
  : {
      breakpoints?: IBreakpoints;
      tokens?: ITokensDefinition;
      utils?: IUtils;
    });

export type TUtilityFirstCss<
  T extends TConfig
> = T["breakpoints"] extends unknown
  ? {
      override?: TRecursiveCss<T>;
    } & TRecursiveUtils<T>
  : {
      override?: TRecursiveCss<T> &
        {
          [S in keyof T["breakpoints"]]?: TRecursiveCss<T>;
        };
    } & {
      [S in keyof T["breakpoints"]]?: TRecursiveUtils<T>;
    } &
      TRecursiveUtils<T>;

export type TDefaultCss<T extends TConfig> = T["breakpoints"] extends object
  ? TRecursiveCss<T> &
      TRecursiveUtils<T> &
      {
        [S in keyof T["breakpoints"]]?: TRecursiveCss<T> & TRecursiveUtils<T>;
      }
  : TRecursiveCss<T> & TRecursiveUtils<T>;

export interface TCssConstructor<
  T extends TConfig,
  S extends TDefaultCss<T> | TUtilityFirstCss<T>
> {
  (...styles: (S | string | boolean | null | undefined)[]): string;
  getStyles: (callback: () => any) => { styles: string[]; result: any };
  keyframes: (
    definition: Record<string, TFlatCSS<T> & TFlatUtils<T>>
  ) => string;
  theme: (
    theme: Partial<
      {
        [TO in keyof T["tokens"]]: Partial<T["tokens"][TO]>;
      }
    >
  ) => string;
}

export type TCss<T extends TConfig> = T extends { utilityFirst: true }
  ? TCssConstructor<T, TUtilityFirstCss<T>>
  : TCssConstructor<T, TDefaultCss<T>>;

export interface ISheet {
  cssRules: any[];
  content: string;
  insertRule(rule: string, index?: number): void;
}
