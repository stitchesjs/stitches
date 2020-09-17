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

export interface IBreakpoints {
  [key: string]: (css: string) => string;
}

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

export type TTopCss<T extends TConfig> = {
  [K in keyof Properties]?: K extends keyof ICssPropToToken<T>
    ? ICssPropToToken<T>[K] | number | Properties[K]
    : Properties[K] | number;
};

export type TRecursiveCss<T extends TConfig, D = TFlatCSS<T>> = (
  | D
  | {
      [pseudo: string]: (D | { [pseudo: string]: (D | { [pseudo: string]: D }) & D }) & D;
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
    [U in keyof T['utils']]?: T['utils'][U] extends TUtility<any, any>
      ? T['utils'][U] extends (arg: infer A, config: T) => {}
        ? A
        : never
      : never;
  }
> = UT;

export type TTopUtils<T extends TConfig> = {
  [U in keyof T['utils']]?: T['utils'][U] extends TUtility<any, any>
    ? T['utils'][U] extends (arg: infer A, config: T) => {}
      ? A
      : never
    : never;
};

export type TRecursiveUtils<T extends TConfig> =
  | TTopUtils<T>
  | {
      [pseudo: string]: TRecursiveUtils<T>;
    };

export type TUtility<A extends any, T extends TConfig> = (arg: A, config: T) => TRecursiveCss<T>;

export type ICssPropToToken<T extends TConfig> = T['tokens'] extends object
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
  strict?: boolean;
} & (STRICT_MODE extends true
  ? { breakpoints: IBreakpoints; tokens: ITokensDefinition; utils: IUtils }
  : {
      breakpoints?: IBreakpoints;
      tokens?: ITokensDefinition;
      utils?: IUtils;
    });

export type TCssProperties<T extends TConfig> = T['breakpoints'] extends object
  ? TRecursiveCss<T> &
      TRecursiveUtils<T> &
      {
        [S in keyof T['breakpoints']]?: TRecursiveCss<T> & TRecursiveUtils<T>;
      }
  : TRecursiveCss<T> & TRecursiveUtils<T>;

export interface TCss<T extends TConfig> {
  (...styles: (TCssProperties<T> | string | boolean | null | undefined)[]): string;
  getStyles: (
    callback: () => any
  ) => {
    styles: string[];
    result: any;
  };
  keyframes: (definition: Record<string, TFlatCSS<T> & TFlatUtils<T>>) => string;
  global: (definition: Record<string, TCssProperties<T>>) => () => string;
  theme: (
    theme: Partial<
      {
        [TO in keyof T['tokens']]: Partial<T['tokens'][TO]>;
      }
    >
  ) => string;
}

export interface ISheet {
  cssRules: any[];
  content: string;
  insertRule(rule: string, index?: number): void;
}
