import {
  Color,
  FlexProperty,
  LineStyle,
  LineWidth,
  Properties,
  MarginProperty,
  MarginTopProperty,
  MarginLeftProperty,
  MarginRightProperty,
  MarginBottomProperty,
  PaddingProperty,
  PaddingTopProperty,
  PaddingLeftProperty,
  PaddingRightProperty,
  PaddingBottomProperty,
  GridGapProperty,
  GridColumnProperty,
  GridRowGapProperty,
  FontSizeProperty,
  BorderColorProperty,
  BorderTopColorProperty,
  BorderLeftColorProperty,
  BorderRightColorProperty,
  BorderBottomColorProperty,
  FontFamilyProperty,
  FontWeightProperty,
  LineHeightProperty,
  LetterSpacingProperty,
  FlexBasisProperty,
  WidthProperty,
  HeightProperty,
  MinWidthProperty,
  MaxWidthProperty,
  MinHeightProperty,
  MaxHeightProperty,
  BorderWidthProperty,
  BorderTopWidthProperty,
  BorderLeftWidthProperty,
  BorderRightWidthProperty,
  BorderBottomWidthProperty,
  BorderStyleProperty,
  BorderTopStyleProperty,
  BorderLeftStyleProperty,
  BorderRightStyleProperty,
  BorderBottomStyleProperty,
  BorderRadiusProperty,
  BorderTopLeftRadiusProperty,
  BorderTopRightRadiusProperty,
  BorderBottomRightRadiusProperty,
  BorderBottomLeftRadiusProperty,
  TextShadowProperty,
  ZIndexProperty,
  TransitionProperty,
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

export type TRecursiveCss<T extends TConfig, D = TFlatCSS<T>> = (
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

export type TFlatCSS<T extends TConfig> = {
  [K in keyof Properties]?: K extends keyof ICssPropToToken<T>
    ? T extends { strict: true }
      ? ICssPropToToken<T>[K]
      : ICssPropToToken<T>[K] | Properties[K]
    : Properties[K];
};

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
      border: [
        LineWidth<(string & {}) | 0>,
        T["tokens"]["borderStyles"] extends object
          ? keyof T["tokens"]["borderStyles"]
          : LineStyle,
        T["tokens"]["colors"] extends object
          ? keyof T["tokens"]["colors"]
          : Color
      ];
      color: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : Color;
      backgroundColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : Color;
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
        : MarginProperty<never>;
      marginTop: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : MarginTopProperty<never>;
      marginLeft: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : MarginLeftProperty<never>;
      marginRight: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : MarginRightProperty<never>;
      marginBottom: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : MarginBottomProperty<never>;
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
        : PaddingProperty<never>;
      paddingTop: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : PaddingTopProperty<never>;
      paddingLeft: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : PaddingLeftProperty<never>;
      paddingRight: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : PaddingRightProperty<never>;
      paddingBottom: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : PaddingBottomProperty<never>;
      gridGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : GridGapProperty<never>;
      gridColumnGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : GridColumnProperty;
      gridRowGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : GridRowGapProperty<never>;
      fontSize: T["tokens"]["fontSizes"] extends object
        ? keyof T["tokens"]["fontSizes"]
        : FontSizeProperty<never>;
      borderColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : BorderColorProperty;
      borderTopColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : BorderTopColorProperty;
      borderLeftColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : BorderLeftColorProperty;
      borderRightColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : BorderRightColorProperty;
      borderBottomColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : BorderBottomColorProperty;
      fontFamily: T["tokens"]["fonts"] extends object
        ? keyof T["tokens"]["fonts"]
        : FontFamilyProperty;
      fontWeight: T["tokens"]["fontWeights"] extends object
        ? keyof T["tokens"]["fontWeights"]
        : FontWeightProperty;
      lineHeight: T["tokens"]["lineHeights"] extends object
        ? keyof T["tokens"]["lineHeights"]
        : LineHeightProperty<never>;
      letterSpacing: T["tokens"]["letterSpacings"] extends object
        ? keyof T["tokens"]["letterSpacings"]
        : LetterSpacingProperty<string>;
      flexBasis: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : FlexBasisProperty<string>;
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
            T["tokens"]["space"] extends object
              ? keyof T["tokens"]["space"]
              : string | number
          ];
      width: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : WidthProperty<never>;
      height: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : HeightProperty<never>;
      minWidth: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : MinWidthProperty<never>;
      maxWidth: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : MaxWidthProperty<never>;
      minHeight: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : MinHeightProperty<never>;
      maxHeight: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : MaxHeightProperty<never>;
      borderWidth: T["tokens"]["borderWidths"] extends object
        ? keyof T["tokens"]["borderWidths"]
        : BorderWidthProperty<never>;
      borderTopWidth: T["tokens"]["borderWidths"] extends object
        ? keyof T["tokens"]["borderWidths"]
        : BorderTopWidthProperty<string>;
      borderLeftWidth: T["tokens"]["borderWidths"] extends object
        ? keyof T["tokens"]["borderWidths"]
        : BorderLeftWidthProperty<string>;
      borderRightWidth: T["tokens"]["borderWidths"] extends object
        ? keyof T["tokens"]["borderWidths"]
        : BorderRightWidthProperty<string>;
      borderBottomWidth: T["tokens"]["borderWidths"] extends object
        ? keyof T["tokens"]["borderWidths"]
        : BorderBottomWidthProperty<string>;
      borderStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : BorderStyleProperty;
      borderTopStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : BorderTopStyleProperty;
      borderLeftStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : BorderLeftStyleProperty;
      borderRightStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : BorderRightStyleProperty;
      borderBottomStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : BorderBottomStyleProperty;
      borderRadius: T["tokens"]["radii"] extends object
        ? keyof T["tokens"]["radii"]
        : BorderRadiusProperty<never>;
      borderTopLeftRadius: T["tokens"]["radii"] extends object
        ? keyof T["tokens"]["radii"]
        : BorderTopLeftRadiusProperty<never>;
      borderTopRightRadius: T["tokens"]["radii"] extends object
        ? keyof T["tokens"]["radii"]
        : BorderTopRightRadiusProperty<never>;
      borderBottomRightRadius: T["tokens"]["radii"] extends object
        ? keyof T["tokens"]["radii"]
        : BorderBottomRightRadiusProperty<never>;
      borderBottomLeftRadius: T["tokens"]["radii"] extends object
        ? keyof T["tokens"]["radii"]
        : BorderBottomLeftRadiusProperty<never>;
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
        : TextShadowProperty;
      zIndex: T["tokens"]["zIndices"] extends object
        ? keyof T["tokens"]["zIndices"]
        : ZIndexProperty;
      transition: T["tokens"]["transitions"] extends object
        ? keyof T["tokens"]["transitions"]
        : TransitionProperty;
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
  strict?: boolean;
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
  insertRule(rule: string): void;
}
