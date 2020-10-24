import { Properties } from './css-types';

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

export type TokenScales =
  | 'colors'
  | 'space'
  | 'fontSizes'
  | 'fonts'
  | 'fontWeights'
  | 'lineHeights'
  | 'letterSpacings'
  | 'sizes'
  | 'borderWidths'
  | 'borderStyles'
  | 'radii'
  | 'shadows'
  | 'zIndices'
  | 'transitions';

export type ITokenDefinition = Record<string | number, string>;
export type ITokensDefinition = Record<TokenScales, ITokenDefinition>;

export type TUtils<
  Utils extends TUtils = {},
  Breakpoints extends TBreakpoints = {},
  Tokens extends TTokens = {},
  Strict extends boolean = false,
  UtilConfigType = { tokens: Tokens; breakpoints: Breakpoints; strict: Strict }
> = {
  [k in keyof Utils]: (a: any, b: UtilConfigType) => any;
};

export type CSSPropertyKeys = keyof Properties;
export interface CSSPropertiesToTokenScale {
  gap: 'space';
  gridGap: 'space';
  columnGap: 'space';
  gridColumnGap: 'space';
  rowGap: 'space';
  gridRowGap: 'space';
  inset: 'colors';
  insetBlock: 'colors';
  insetBlockEnd: 'colors';
  insetBlockStart: 'colors';
  insetInline: 'colors';
  insetInlineEnd: 'colors';
  insetInlineStart: 'colors';
  margin: 'colors';
  marginTop: 'space';
  marginRight: 'space';
  marginBottom: 'space';
  marginLeft: 'space';
  marginInline: 'space';
  marginInlineEnd: 'space';
  marginInlineStart: 'space';
  marginBlock: 'space';
  marginBlockEnd: 'space';
  marginBlockStart: 'space';
  padding: 'space';
  paddingTop: 'space';
  paddingRight: 'space';
  paddingBottom: 'space';
  paddingLeft: 'space';
  paddingInline: 'space';
  paddingInlineEnd: 'space';
  paddingInlineStart: 'space';
  paddingBlock: 'space';
  paddingBlockEnd: 'space';
  paddingBlockStart: 'space';
  top: 'space';
  right: 'space';
  bottom: 'space';
  left: 'space';
  fontSize: 'fontSizes';
  backgroundColor: 'colors';
  /** Update syntax when ts 4.1 is release */
  // border: ''
  borderColor: 'colors';
  borderTopColor: 'colors';
  borderRightColor: 'colors';
  borderBottomColor: 'colors';
  borderLeftColor: 'colors';
  caretColor: 'colors';
  color: 'colors';
  columnRuleColor: 'colors';
  outlineColor: 'colors';
  fill: 'colors';
  stroke: 'colors';
  fontFamily: 'fonts';
  fontWeight: 'fontWeights';
  lineHeight: 'lineHeights';
  letterSpacing: 'letterSpacings';
  blockSize: 'sizes';
  minBlockSize: 'sizes';
  maxBlockSize: 'sizes';
  inlineSize: 'sizes';
  minInlineSize: 'sizes';
  maxInlineSize: 'sizes';
  width: 'sizes';
  minWidth: 'sizes';
  maxWidth: 'sizes';
  height: 'sizes';
  minHeight: 'sizes';
  maxHeight: 'sizes';
  flexBasis: 'sizes';
  /** Update syntax when ts 4.1 is release */
  // flex:'';
  borderWidth: 'borderWidths';
  borderTopWidth: 'borderWidths';
  borderLeftWidth: 'borderWidths';
  borderRightWidth: 'borderWidths';
  borderBottomWidth: 'borderWidths';
  borderStyle: 'borderStyles';
  borderTopStyle: 'borderStyles';
  borderRightStyle: 'borderStyles';
  borderBottomStyle: 'borderStyles';
  borderLeftStyle: 'borderStyles';
  borderRadius: 'radii';
  borderTopLeftRadius: 'radii';
  borderTopRightRadius: 'radii';
  borderBottomRightRadius: 'radii';
  borderBottomLeftRadius: 'radii';
  /** Update syntax when ts 4.1 is release */
  boxShadow: 'shadows';
  textShadow: 'shadows';
  zIndex: 'zIndices';
  transition: 'transitions';
}
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
> =({ [k in keyof Breakpoints]?: StitchesCSS<Breakpoints, Tokens, Utils, Strict, AllowNesting>; }
  | { [k in keyof Utils]?: Utils[k] extends (a: infer A, b: any) => any ? A : never; }
  | { [k in CSSPropertyKeys]?: k extends TokenMappedCSSPropertyKeys ? keyof Tokens[CSSPropertiesToTokenScale[k]] | (Strict extends true ? never : Properties[k]) : Properties[k]; })
  | { [k: string]: AllowNesting extends true ? StitchesCSS<Breakpoints, Tokens, Utils, Strict, AllowNesting> :  never}

export interface IConfig<
  // Used to type config based on itself
  // these will act as pointers for typescript
  // so that it can infer the types correctly
  Breakpoints extends TBreakpoints = {},
  Tokens extends TTokens = {},
  strict extends boolean = false,
  showFriendlyClassnames extends boolean = false,
  prefix extends string = '',
  Utils extends TUtils = {}
  // we don't care about inferring utils as it's the only thing in the config
  // that requires access to the config, so we're giving it special treatment
  // so that it can access the values of its siblings
> {
  breakpoints: Breakpoints | TBreakpoints;
  tokens: Tokens &
    Omit<Partial<ITokensDefinition>, keyof Tokens> &
    { [k in Exclude<keyof Tokens, keyof ITokensDefinition>]: never };
  utils: TUtils<Utils, Breakpoints, Tokens, strict> | Utils;
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
  (styles: StitchesCSS<A, B, C, D>): string;
  getStyles: (
    callback: () => any
  ) => {
    styles: string[];
    result: any;
  };
  keyframes: (definition: Record<string, StitchesCSS<never, B, C, D, false>>) => string;
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
