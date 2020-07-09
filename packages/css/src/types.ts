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

export type TUtility<A extends any[], C extends IConfig> = (
  css: TCss<Omit<C, "utils">>,
  config: C
) => (...args: A) => string;

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

export type TUtilityFirstCss<
  T extends IConfig,
  D = {
    [K in keyof Properties]: (
      value: K extends keyof ICssPropToToken
        ? T["tokens"] extends object
          ? T["tokens"][ICssPropToToken[K]] extends object
            ? keyof T["tokens"][ICssPropToToken[K]] | (string & {})
            : Properties[K]
          : Properties[K]
        : Properties[K],
      pseudo?: string
    ) => string;
  }
> = TUtilityFirstDeclarativeCss<T> & {
  override: D;
} & {
    [S in keyof T["screens"]]: {
      [U in keyof T["utils"]]: T["utils"][U] extends TUtility<any, any>
        ? ReturnType<T["utils"][U]>
        : never;
    } & {
      override: D;
    };
  } &
  {
    [U in keyof T["utils"]]: T["utils"][U] extends TUtility<any, any>
      ? ReturnType<T["utils"][U]>
      : never;
  } & {
    compose: (...compositions: string[]) => string;
    getStyles: (callback: () => any) => { styles: string[]; result: any };
    theme: (
      theme: Partial<
        {
          [TO in keyof T["tokens"]]: Partial<T["tokens"][TO]>;
        }
      >
    ) => string;
  };

export type TUtilityFirstDeclarativeCss<
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
> = (
  styles: {
    override?:
      | D
      | {
          [selector: string]: D;
        };
  } & {
    [S in keyof T["screens"]]: {
      [U in keyof T["utils"]]?: T["utils"][U] extends TUtility<any, any>
        ? ReturnType<T["utils"][U]> extends (...args: infer A) => string
          ? A[0]
          : never
        : never;
    } & {
      override?:
        | D
        | {
            [selector: string]: D;
          };
    };
  } &
    {
      [U in keyof T["utils"]]?: T["utils"][U] extends TUtility<any, any>
        ? ReturnType<T["utils"][U]> extends (...args: infer A) => string
          ? A[0]
          : never
        : never;
    }
) => string;

export type TDeclarativeCss<T extends IConfig> = T extends {
  utilityFirst: true;
}
  ? TUtilityFirstDeclarativeCss<T>
  : TDefaultDeclarativeCss<T>;

export type TDefaultDeclarativeCss<
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
> = (
  styles:
    | (D &
        {
          [U in keyof T["utils"]]?: T["utils"][U] extends TUtility<any, any>
            ? ReturnType<T["utils"][U]> extends (...args: infer A) => string
              ? A[0]
              : never
            : never;
        } &
        {
          [S in keyof T["screens"]]?:
            | ({
                [U in keyof T["utils"]]?: T["utils"][U] extends TUtility<
                  any,
                  any
                >
                  ? ReturnType<T["utils"][U]> extends (
                      ...args: infer A
                    ) => string
                    ? A[0]
                    : never
                  : never;
              } &
                D)
            | {
                [selector: string]: D;
              };
        })
    | {
        [selector: string]: D;
      }
) => string;

export type TCss<T extends IConfig> = T extends { utilityFirst: true }
  ? TUtilityFirstCss<T>
  : TDefaultCss<T>;

export type TDefaultCss<
  T extends IConfig,
  D = {
    [K in keyof Properties]: (
      value: K extends keyof ICssPropToToken
        ? T["tokens"] extends object
          ? T["tokens"][ICssPropToToken[K]] extends object
            ? keyof T["tokens"][ICssPropToToken[K]] | (string & {})
            : Properties[K]
          : Properties[K]
        : Properties[K],
      pseudo?: string
    ) => string;
  }
> = TDefaultDeclarativeCss<T> &
  D &
  {
    [U in keyof T["utils"]]: T["utils"][U] extends TUtility<any, any>
      ? ReturnType<T["utils"][U]>
      : never;
  } &
  {
    [S in keyof T["screens"]]: {
      [U in keyof T["utils"]]: T["utils"][U] extends TUtility<any, any>
        ? ReturnType<T["utils"][U]>
        : never;
    } &
      D;
  } & {
    compose: (...compositions: (string | null | undefined | false)[]) => string;
    getStyles: (callback: () => any) => { styles: string[]; result: any };
    theme: (
      theme: Partial<
        {
          [TO in keyof T["tokens"]]: Partial<T["tokens"][TO]>;
        }
      >
    ) => string;
  };

export interface ISheet {
  cssRules: any[];
  content: string;
  insertRule(rule: string): void;
}
