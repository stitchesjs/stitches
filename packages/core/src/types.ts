import { Properties } from './css-types';
import { cssPropToToken } from './utils';

export const ATOM = Symbol('ATOM');

export interface IAtom {
  id: string;
  cssHyphenProp: string;
  value: string;
  selector: string;
  breakpoint: string;
  _isGlobal?: boolean;
  inlineMediaQueries: string[];
  _className?: string;
  toString: (this: IAtom) => string;
  [ATOM]: true;
}

export interface IThemeAtom {
  name: string;
  definition: Partial<ITokensDefinition>;
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
// prettier-ignore
export type TokenScales = | 'colors' | 'space' | 'fontSizes' | 'fonts' | 'fontWeights' | 'lineHeights' | 'letterSpacings' | 'sizes' | 'borderWidths' | 'borderStyles' | 'radii' | 'shadows' | 'zIndices' | 'transitions';

export type ITokenDefinition = Record<string | number, string>;
export type ITokensDefinition = Record<TokenScales, ITokenDefinition>;

export type TUtils<
  Utils extends TUtils = {},
  Breakpoints extends TBreakpoints = {},
  Tokens extends TTokens = {},
  Strict extends boolean = false
> = {
  [k in keyof Utils]: (
    a: any,
    b: { tokens: Tokens; breakpoints: Breakpoints; strict: Strict }
  ) => StitchesCSS<Breakpoints, Tokens, {}, Strict>;
};

export type CSSPropertyKeys = keyof Properties;
export type CSSPropertiesToTokenScale = typeof cssPropToToken;
export type TokenMappedCSSPropertyKeys = keyof CSSPropertiesToTokenScale;
export type TBreakpoints = Record<string, (value: string) => string>;
export type TTokens = { [k in TokenScales]?: Record<string, string> };

// prettier-ignore
export type StitchesCSS<
  Breakpoints extends TBreakpoints = {},
  Tokens extends TTokens = {},
  Utils extends TUtils = {},
  Strict extends boolean = false,
  AllowNesting = true
> = { [k in keyof Properties]?: k extends keyof CSSPropertiesToTokenScale ? CSSPropertiesToTokenScale[k] extends keyof Tokens ?  keyof Tokens[CSSPropertiesToTokenScale[k]] | (Strict extends true ? never : Properties[k]) : Properties[k] : Properties[k]}
  & { [k in keyof Breakpoints]?: StitchesCSS<Breakpoints, Tokens, Utils, Strict, AllowNesting>; }
  & { [k in keyof Utils]?: Utils[k] extends (a: infer A, b: any) => any ? A : never; }
  & { [k in string]?: AllowNesting extends true ? StitchesCSS<Breakpoints, Tokens, Utils, Strict, AllowNesting> | string | number : {} }

export interface IConfig<
  Breakpoints extends TBreakpoints = {},
  Tokens extends TTokens = {},
  strict extends boolean = false,
  showFriendlyClassnames extends boolean = false,
  prefix extends string = '',
  Utils extends TUtils = TUtils
> {
  breakpoints: Breakpoints | TBreakpoints;
  tokens: Tokens &
    Omit<Partial<ITokensDefinition>, keyof Tokens> &
    { [k in Exclude<keyof Tokens, keyof ITokensDefinition>]: never };
  // we don't care about inferring utils as it's the only thing in the config
  // that requires access to the config, so we're giving it special treatment
  // so that it can access the values of its siblings
  utils: Utils | TUtils<Utils, Breakpoints, Tokens, strict>;
  showFriendlyClassnames: showFriendlyClassnames | boolean;
  prefix: prefix | string;
  strict: strict | boolean;
}

export interface TCss<
  A extends TBreakpoints = {},
  B extends TTokens = {},
  D extends boolean = false,
  C extends TUtils = {}
> {
  (...styles: (StitchesCSS<A, B, C, D> | string)[]): string;
  getStyles: (
    callback: () => any
  ) => {
    styles: string[];
    result: any;
  };
  keyframes: (definition: Record<string, StitchesCSS<{}, B, C, D, false>>) => string;
  global: (definition: Record<string, StitchesCSS<A, B, C, D>>) => () => string;
  theme: (
    theme: Partial<
      {
        [TO in keyof B]: Partial<B[TO]>;
      }
    >
  ) => string;
}

export interface ISheet {
  cssRules: any[];
  content: string;
  insertRule(rule: string, index?: number): void;
}
