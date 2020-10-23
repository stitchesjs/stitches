import {
  Color,
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
  GridColumnGapProperty,
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
  InsetProperty,
  InsetBlockProperty,
  InsetBlockEndProperty,
  InsetBlockStartProperty,
  InsetInlineEndProperty,
  InsetInlineStartProperty,
  MarginInlineEndProperty,
  MarginInlineProperty,
  MarginInlineStartProperty,
  MarginBlockProperty,
  MarginBlockEndProperty,
  MarginBlockStartProperty,
  PaddingInlineProperty,
  PaddingInlineEndProperty,
  PaddingInlineStartProperty,
  PaddingBlockProperty,
  PaddingBlockEndProperty,
  PaddingBlockStartProperty,
  TopProperty,
  RightProperty,
  BottomProperty,
  LeftProperty,
  BackgroundColorProperty,
  CaretColorProperty,
  ColumnRuleColorProperty,
  OutlineColorProperty,
  FillProperty,
  StrokeProperty,
  BlockSizeProperty,
  MinBlockSizeProperty,
  MaxBlockSizeProperty,
  InlineSizeProperty,
  MinInlineSizeProperty,
  MaxInlineSizeProperty,
} from './css-types';

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

export type ICssPropToToken<T extends Partial<IConfig>> = T['tokens'] extends object
  ? {
      gap: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : GridGapProperty<never>;
      gridGap: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : GridGapProperty<never>;
      columnGap: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : GridColumnGapProperty<never>;
      gridColumnGap: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : GridColumnGapProperty<never>;
      rowGap: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : GridRowGapProperty<never>;
      gridRowGap: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : GridRowGapProperty<never>;
      inset: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : InsetProperty<never>;
      insetBlock: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : InsetBlockProperty<never>;
      insetBlockEnd: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : InsetBlockEndProperty<never>;
      insetBlockStart: T['tokens']['colors'] extends object
        ? keyof T['tokens']['colors']
        : InsetBlockStartProperty<never>;
      insetInline: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : InsetInlineEndProperty<never>;
      insetInlineEnd: T['tokens']['colors'] extends object
        ? keyof T['tokens']['colors']
        : InsetInlineEndProperty<never>;
      insetInlineStart: T['tokens']['colors'] extends object
        ? keyof T['tokens']['colors']
        : InsetInlineStartProperty<never>;
      margin: T['tokens']['space'] extends object
        ?
            | keyof T['tokens']['space']
            | [keyof T['tokens']['space'], keyof T['tokens']['space']]
            | [keyof T['tokens']['space'], keyof T['tokens']['space'], keyof T['tokens']['space']]
            | [
                keyof T['tokens']['space'],
                keyof T['tokens']['space'],
                keyof T['tokens']['space'],
                keyof T['tokens']['space']
              ]
        : MarginProperty<never>;
      marginTop: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : MarginTopProperty<never>;
      marginRight: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : MarginRightProperty<never>;
      marginBottom: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : MarginBottomProperty<never>;
      marginLeft: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : MarginLeftProperty<never>;
      marginInline: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : MarginInlineProperty<never>;
      marginInlineEnd: T['tokens']['space'] extends object
        ? keyof T['tokens']['space']
        : MarginInlineEndProperty<never>;
      marginInlineStart: T['tokens']['space'] extends object
        ? keyof T['tokens']['space']
        : MarginInlineStartProperty<never>;
      marginBlock: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : MarginBlockProperty<never>;
      marginBlockEnd: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : MarginBlockEndProperty<never>;
      marginBlockStart: T['tokens']['space'] extends object
        ? keyof T['tokens']['space']
        : MarginBlockStartProperty<never>;
      padding: T['tokens']['space'] extends object
        ?
            | keyof T['tokens']['space']
            | [keyof T['tokens']['space'], keyof T['tokens']['space']]
            | [keyof T['tokens']['space'], keyof T['tokens']['space'], keyof T['tokens']['space']]
            | [
                keyof T['tokens']['space'],
                keyof T['tokens']['space'],
                keyof T['tokens']['space'],
                keyof T['tokens']['space']
              ]
        : PaddingProperty<never>;
      paddingTop: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : PaddingTopProperty<never>;
      paddingRight: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : PaddingRightProperty<never>;
      paddingBottom: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : PaddingBottomProperty<never>;
      paddingLeft: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : PaddingLeftProperty<never>;
      paddingInline: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : PaddingInlineProperty<never>;
      paddingInlineEnd: T['tokens']['space'] extends object
        ? keyof T['tokens']['space']
        : PaddingInlineEndProperty<never>;
      paddingInlineStart: T['tokens']['space'] extends object
        ? keyof T['tokens']['space']
        : PaddingInlineStartProperty<never>;
      paddingBlock: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : PaddingBlockProperty<never>;
      paddingBlockEnd: T['tokens']['space'] extends object
        ? keyof T['tokens']['space']
        : PaddingBlockEndProperty<never>;
      paddingBlockStart: T['tokens']['space'] extends object
        ? keyof T['tokens']['space']
        : PaddingBlockStartProperty<never>;
      top: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : TopProperty<never>;
      right: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : RightProperty<never>;
      bottom: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : BottomProperty<never>;
      left: T['tokens']['space'] extends object ? keyof T['tokens']['space'] : LeftProperty<never>;
      fontSize: T['tokens']['fontSizes'] extends object ? keyof T['tokens']['fontSizes'] : FontSizeProperty<never>;
      backgroundColor: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : BackgroundColorProperty;
      border: [
        LineWidth<(string & {}) | 0>,
        T['tokens']['borderStyles'] extends object ? keyof T['tokens']['borderStyles'] : LineStyle,
        T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : Color
      ];
      borderColor: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : BorderColorProperty;
      borderTopColor: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : BorderTopColorProperty;
      borderRightColor: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : BorderRightColorProperty;
      borderBottomColor: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : BorderBottomColorProperty;
      borderLeftColor: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : BorderLeftColorProperty;
      caretColor: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : CaretColorProperty;
      color: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : Color;
      columnRuleColor: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : ColumnRuleColorProperty;
      outlineColor: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : OutlineColorProperty;
      fill: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : FillProperty;
      stroke: T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : StrokeProperty;
      fontFamily: T['tokens']['fonts'] extends object ? keyof T['tokens']['fonts'] : FontFamilyProperty;
      fontWeight: T['tokens']['fontWeights'] extends object ? keyof T['tokens']['fontWeights'] : FontWeightProperty;
      lineHeight: T['tokens']['lineHeights'] extends object
        ? keyof T['tokens']['lineHeights']
        : LineHeightProperty<never>;
      letterSpacing: T['tokens']['letterSpacings'] extends object
        ? keyof T['tokens']['letterSpacings']
        : LetterSpacingProperty<never>;
      blockSize: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : BlockSizeProperty<never>;
      minBlockSize: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : MinBlockSizeProperty<never>;
      maxBlockSize: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : MaxBlockSizeProperty<never>;
      inlineSize: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : InlineSizeProperty<never>;
      minInlineSize: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : MinInlineSizeProperty<never>;
      maxInlineSize: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : MaxInlineSizeProperty<never>;
      width: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : WidthProperty<never>;
      minWidth: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : MinWidthProperty<never>;
      maxWidth: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : MaxWidthProperty<never>;
      height: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : HeightProperty<never>;
      minHeight: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : MinHeightProperty<never>;
      maxHeight: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : MaxHeightProperty<never>;
      flexBasis: T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : FlexBasisProperty<never>;
      flex:
        | (T['tokens']['space'] extends object ? keyof T['tokens']['space'] : never)
        | [number, T['tokens']['space'] extends object ? keyof T['tokens']['space'] : string | number]
        | [number, number, T['tokens']['sizes'] extends object ? keyof T['tokens']['sizes'] : string | number];

      borderWidth: T['tokens']['borderWidths'] extends object
        ? keyof T['tokens']['borderWidths']
        : BorderWidthProperty<never>;
      borderTopWidth: T['tokens']['borderWidths'] extends object
        ? keyof T['tokens']['borderWidths']
        : BorderTopWidthProperty<never>;
      borderLeftWidth: T['tokens']['borderWidths'] extends object
        ? keyof T['tokens']['borderWidths']
        : BorderLeftWidthProperty<never>;
      borderRightWidth: T['tokens']['borderWidths'] extends object
        ? keyof T['tokens']['borderWidths']
        : BorderRightWidthProperty<never>;
      borderBottomWidth: T['tokens']['borderWidths'] extends object
        ? keyof T['tokens']['borderWidths']
        : BorderBottomWidthProperty<never>;
      borderStyle: T['tokens']['borderStyles'] extends object ? keyof T['tokens']['borderStyles'] : BorderStyleProperty;
      borderTopStyle: T['tokens']['borderStyles'] extends object
        ? keyof T['tokens']['borderStyles']
        : BorderTopStyleProperty;
      borderRightStyle: T['tokens']['borderStyles'] extends object
        ? keyof T['tokens']['borderStyles']
        : BorderRightStyleProperty;
      borderBottomStyle: T['tokens']['borderStyles'] extends object
        ? keyof T['tokens']['borderStyles']
        : BorderBottomStyleProperty;
      borderLeftStyle: T['tokens']['borderStyles'] extends object
        ? keyof T['tokens']['borderStyles']
        : BorderLeftStyleProperty;
      borderRadius: T['tokens']['radii'] extends object ? keyof T['tokens']['radii'] : BorderRadiusProperty<never>;
      borderTopLeftRadius: T['tokens']['radii'] extends object
        ? keyof T['tokens']['radii']
        : BorderTopLeftRadiusProperty<never>;
      borderTopRightRadius: T['tokens']['radii'] extends object
        ? keyof T['tokens']['radii']
        : BorderTopRightRadiusProperty<never>;
      borderBottomRightRadius: T['tokens']['radii'] extends object
        ? keyof T['tokens']['radii']
        : BorderBottomRightRadiusProperty<never>;
      borderBottomLeftRadius: T['tokens']['radii'] extends object
        ? keyof T['tokens']['radii']
        : BorderBottomLeftRadiusProperty<never>;
      boxShadow: T['tokens']['shadows'] extends object
        ? keyof T['tokens']['shadows']
        : [
            string | number,
            string | number,
            string | number,
            T['tokens']['colors'] extends object ? keyof T['tokens']['colors'] : Color
          ];
      textShadow: T['tokens']['shadows'] extends object ? keyof T['tokens']['shadows'] : TextShadowProperty;
      zIndex: T['tokens']['zIndices'] extends object ? keyof T['tokens']['zIndices'] : ZIndexProperty;
      transition: T['tokens']['transitions'] extends object ? keyof T['tokens']['transitions'] : never;
    }
  : {};

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

export interface ITokenDefinition {
  [key: string]: string;
  [key: number]: string;
}
export type ITokensDefinition = Record<TokenScales, ITokenDefinition>;

export type TUtils<
  Utils extends TUtils = {},
  Breakpoints extends TBreakpoints = {},
  Tokens extends TTokens = {},
  Strict extends boolean = false,
  UtilConfigType = { tokens: Tokens; breakpoints: Breakpoints; strict: Strict }
> =
  | {
      [k: string]: (a: any, b: UtilConfigType) => void;
    }
  | {
      [k in keyof Utils]: (a: any, b: UtilConfigType) => void;
    };

export type CSSPropertyKeys = keyof Properties;
export interface CSSPropertiesToTokenScale {
  backgroundColor: 'colors';
}
export type TokenMappedCSSPropertyKeys = keyof CSSPropertiesToTokenScale;
export type TBreakpoints = Record<string, (value: string) => string>;
export type TTokens = { [k in TokenScales]?: Record<string, string> };

// prettier-ignore
export type StitchesCSS<
  Breakpoints extends TBreakpoints = {},
  Tokens extends TTokens = {},
  Utils extends TUtils= {} ,
  Strict extends boolean = false,
  BreakpointKeys extends string = Extract<keyof Breakpoints, string>,
  UtilKeys extends string = Extract<keyof Utils, string>,
> = {
  [k in | CSSPropertyKeys | BreakpointKeys | UtilKeys]?: k extends BreakpointKeys 
    /** Breakpoint type: */
    ? StitchesCSS<Breakpoints, Tokens, Utils, Strict, BreakpointKeys, UtilKeys> 
    : k extends UtilKeys 
    /** Utils type: */
    ? {} 
    : k extends TokenMappedCSSPropertyKeys
    /** Token mapped value type: */
    ?  Tokens extends TTokens ? keyof Tokens[CSSPropertiesToTokenScale[k]] 
    : k extends CSSPropertyKeys
    /** Normal Css property type: */
    ? Properties[k]
    : never : never;
};

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
  (styles: StitchesCSS<A, B, C, D>): string;
  getStyles: (
    callback: () => any
  ) => {
    styles: string[];
    result: any;
  };
  // keyframes: (definition: Record<string, TFlatCSS<T> & TFlatUtils<T>>) => string;
  // global: (definition: Record<string, TCssProperties<T>>) => () => string;
  // theme: (
  //   theme: Partial<
  //     {
  //       [TO in keyof T['tokens']]: Partial<T['tokens'][TO]>;
  //     }
  //   >
  // ) => string;
}

export interface ISheet {
  cssRules: any[];
  content: string;
  insertRule(rule: string, index?: number): void;
}
