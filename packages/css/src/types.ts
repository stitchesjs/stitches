import {
  Color,
  FlexProperty,
  LineStyle,
  LineWidth,
  Properties,
} from "./css-types";

export interface IScreens {
  [key: string]: (css: string) => string;
}

export const ATOM = Symbol("ATOM");

export interface IAtom {
  id: string;
  cssHyphenProp: string;
  value: string;
  pseudo: string | undefined;
  screen: string;
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
  T extends IConfig,
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
  T extends IConfig,
  D = {
    [K in keyof Properties]?: K extends keyof ICssPropToToken<T>
      ? ICssPropToToken<T>[K] | Properties[K]
      : Properties[K];
  }
> = D;

export type TFlatUtils<
  T extends IConfig,
  UT = {
    [U in keyof T["utils"]]?: T["utils"][U] extends TUtility<any, any>
      ? ReturnType<T["utils"][U]> extends (arg: infer A) => {}
        ? A
        : never
      : never;
  }
> = UT;

export type TRecursiveUtils<
  T extends IConfig,
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

export type TUtility<A extends any, T extends IConfig> = (
  config: T
) => (arg: A) => TRecursiveCss<T>;

export type ICssPropToToken<T extends IConfig> = T["tokens"] extends object
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
        : never;
      backgroundColor: T["tokens"]["colors"] extends object
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
      marginLeft: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginRight: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      marginBottom: T["tokens"]["space"] extends object
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
      paddingLeft: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingRight: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      paddingBottom: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      gridGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      gridColumnGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      gridRowGap: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
        : never;
      fontSize: T["tokens"]["fontSizes"] extends object
        ? keyof T["tokens"]["fontSizes"]
        : never;
      borderColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      borderTopColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      borderLeftColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      borderRightColor: T["tokens"]["colors"] extends object
        ? keyof T["tokens"]["colors"]
        : never;
      borderBottomColor: T["tokens"]["colors"] extends object
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
      flexBasis: T["tokens"]["space"] extends object
        ? keyof T["tokens"]["space"]
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
            T["tokens"]["space"] extends object
              ? keyof T["tokens"]["space"]
              : string | number
          ];
      width: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      height: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      minWidth: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      maxWidth: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      minHeight: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
      maxHeight: T["tokens"]["sizes"] extends object
        ? keyof T["tokens"]["sizes"]
        : never;
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
      borderLeftStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : never;
      borderRightStyle: T["tokens"]["borderStyles"] extends object
        ? keyof T["tokens"]["borderStyles"]
        : never;
      borderBottomStyle: T["tokens"]["borderStyles"] extends object
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

export interface IConfig<STRICT_MODE extends boolean = false > {
  showFriendlyClassnames?: boolean;
  prefix?: string;
  utilityFirst?: boolean;
  screens: IScreens| (STRICT_MODE extends true ? never : undefined ) ;
  tokens:  ITokensDefinition | (STRICT_MODE extends true ? never : undefined ) ;
  utils: {
    [name: string]: TUtility<any, any>;
  }| (STRICT_MODE extends true ? never : undefined ) ;
}

export type TUtilityFirstCss<T extends IConfig> = T["screens"] extends unknown
  ? {
      override?: TRecursiveCss<T>;
    } & TRecursiveUtils<T>
  : {
      override?: TRecursiveCss<T> &
        {
          [S in keyof T["screens"]]?: TRecursiveCss<T>;
        };
    } & {
      [S in keyof T["screens"]]?: TRecursiveUtils<T>;
    } &
      TRecursiveUtils<T>;

export type TDefaultCss<T extends IConfig> = T["screens"] extends object
  ? TRecursiveCss<T> &
      TRecursiveUtils<T> &
      {
        [S in keyof T["screens"]]?: TRecursiveCss<T> & TRecursiveUtils<T>;
      }
  : TRecursiveCss<T> & TRecursiveUtils<T>;

export interface TCssConstructor<
  T extends IConfig,
  S extends TDefaultCss<T> | TUtilityFirstCss<T>
> {
  (...styles: (S | string | boolean | null | undefined)[]): string;
  getStyles: (callback: () => any) => { styles: string[]; result: any };
  keyframes: (definition: Record<string, TFlatCSS<T> & TFlatUtils<T>>) => string;
  theme: (
    theme: Partial<
      {
        [TO in keyof T["tokens"]]: Partial<T["tokens"][TO]>;
      }
    >
  ) => string;
}

export type TCss<T extends IConfig> = T extends { utilityFirst: true }
  ? TCssConstructor<T, TUtilityFirstCss<T>>
  : TCssConstructor<T, TDefaultCss<T>>;

export interface ISheet {
  cssRules: any[];
  content: string;
  insertRule(rule: string): void;
}
