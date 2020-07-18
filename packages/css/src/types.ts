import { Properties } from "./css-types";

export interface IScreens {
  [key: string]: (css: string) => string;
}

export interface IAtom {
  id: string;
  cssHyphenProp: string;
  value: string;
  pseudo: string | undefined;
  screen: string;
  _className?: string;
  toString: (this: IAtom) => string;
}

export interface IThemeAtom {
  name: string;
  definition: ITokensDefinition;
  toString: (this: IThemeAtom) => string;
}

export interface IComposedAtom {
  atoms: IAtom[];
  _className?: string;
  toString: (this: IComposedAtom) => string;
}

export type TRecursiveCss<
  T extends IConfig,
  D = {
    [K in keyof Properties]?: K extends keyof ICssPropToToken
      ? T["tokens"] extends object
        ? T["tokens"][ICssPropToToken[K]] extends object
          ? keyof T["tokens"][ICssPropToToken[K]] | (string & {})
          : Properties[K]
        : Properties[K]
      : Properties[K];
  }
> = D | { [pseudo: string]: TRecursiveCss<T, D> };

export type TRecursiveUtils<
  T extends IConfig,
  UT = {
    [U in keyof T["utils"]]?: T["utils"][U] extends TUtility<any, any>
      ? ReturnType<T["utils"][U]> extends (...args: infer A) => {}
        ? A[0]
        : never
      : never;
  }
> = UT | { [pseudo: string]: TRecursiveUtils<T, UT> };

export type TUtility<A extends any[], T extends IConfig> = (
  config: T
) => (...args: A) => TRecursiveCss<T>;

export interface ICssPropToToken {
  color: "colors";
  backgroundColor: "colors";
  margin: "space";
  marginTop: "space";
  marginLeft: "space";
  marginRight: "space";
  marginBottom: "space";
  padding: "space";
  paddingTop: "space";
  paddingLeft: "space";
  paddingRight: "space";
  paddingBottom: "space";
  gridGap: "space";
  gridColumnGap: "space";
  gridRowGap: "space";
  fontSize: "fontSizes";
  borderColor: "colors";
  borderTopColor: "colors";
  borderLeftColor: "colors";
  borderRightColor: "colors";
  borderBottomColor: "colors";
  fontFamily: "fonts";
  fontWeight: "fontWeights";
  lineHeight: "lineHeights";
  letterSpacing: "letterSpacings";
  width: "sizes";
  height: "sizes";
  minWidth: "sizes";
  maxWidth: "sizes";
  minHeight: "sizes";
  maxHeight: "sizes";
  borderWidth: "borderWidths";
  borderTopWidth: "borderWidths";
  borderLeftWidth: "borderWidths";
  borderRightWidth: "borderWidths";
  borderBottomWidth: "borderWidths";
  borderStyle: "borderStyles";
  borderTopStyle: "borderStyles";
  borderLeftStyle: "borderStyles";
  borderRightStyle: "borderStyles";
  borderBottomStyle: "borderStyles";
  borderRadius: "radii";
  borderTopLeftRadius: "radii";
  borderTopRightRadius: "radii";
  borderBottomRightRadius: "radii";
  borderBottomLeftRadius: "radii";
  boxShadow: "shadows";
  textShadow: "shadows";
  zIndex: "zIndices";
  transition: "transitions";
}

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

export interface IConfig {
  showFriendlyClassnames?: boolean;
  prefix?: string;
  utilityFirst?: boolean;
  screens?: IScreens;
  tokens?: ITokensDefinition;
  utils?: {
    [name: string]: TUtility<any, any>;
  };
}

export type TUtilityFirstCss<T extends IConfig> = {
  override?: TRecursiveCss<T> &
    {
      [S in keyof T["screens"]]?: TRecursiveCss<T>;
    };
} & {
  [S in keyof T["screens"]]?: TRecursiveUtils<T>;
} &
  TRecursiveUtils<T>;

export type TDefaultCss<T extends IConfig> = TRecursiveCss<T> &
  TRecursiveUtils<T> &
  {
    [S in keyof T["screens"]]?: TRecursiveCss<T> & TRecursiveUtils<T>;
  };

export interface TCssConstructor<
  T extends IConfig,
  S extends TDefaultCss<T> | TUtilityFirstCss<T>
> {
  (...styles: (S | string | boolean | null | undefined)[]): string;
  getStyles: (callback: () => any) => { styles: string[]; result: any };
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
