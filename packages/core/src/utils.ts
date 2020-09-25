import {
  animation,
  background,
  border,
  borderBottom,
  borderColor,
  borderLeft,
  borderRadius,
  borderRight,
  borderStyle,
  borderTop,
  borderWidth,
  boxShadow,
  font,
  gap,
  margin,
  padding,
  transition,
  textDecoration,
  flex,
} from './shorthand-parser';
import { IBreakpoints, ICssPropToToken, ISheet } from './types';

export const MAIN_BREAKPOINT_ID = 'initial';
export type TMainBreakPoint = typeof MAIN_BREAKPOINT_ID;

export const cssPropToToken: ICssPropToToken<any> = {
  gap: 'space',
  gridGap: 'space',
  columnGap: 'space',
  gridColumnGap: 'space',
  rowGap: 'space',
  gridRowGap: 'space',
  inset: 'space',
  insetBlock: 'space',
  insetBlockEnd: 'space',
  insetBlockStart: 'space',
  insetInline: 'space',
  insetInlineEnd: 'space',
  insetInlineStart: 'space',
  margin: 'space',
  marginTop: 'space',
  marginRight: 'space',
  marginBottom: 'space',
  marginLeft: 'space',
  marginBlock: 'space',
  marginBlockEnd: 'space',
  marginBlockStart: 'space',
  marginInline: 'space',
  marginInlineEnd: 'space',
  marginInlineStart: 'space',
  padding: 'space',
  paddingTop: 'space',
  paddingRight: 'space',
  paddingBottom: 'space',
  paddingLeft: 'space',
  paddingBlock: 'space',
  paddingBlockEnd: 'space',
  paddingBlockStart: 'space',
  paddingInline: 'space',
  paddingInlineEnd: 'space',
  paddingInlineStart: 'space',
  top: 'space',
  right: 'space',
  bottom: 'space',
  left: 'space',
  fontSize: 'fontSizes',
  backgroundColor: 'colors',
  border: ['', 'borderStyles', 'colors'],
  borderColor: 'colors',
  borderTopColor: 'colors',
  borderRightColor: 'colors',
  borderBottomColor: 'colors',
  borderLeftColor: 'colors',
  caretColor: 'colors',
  color: 'colors',
  columnRuleColor: 'colors',
  outlineColor: 'colors',
  fill: 'colors',
  stroke: 'colors',
  fontFamily: 'fonts',
  fontWeight: 'fontWeights',
  lineHeight: 'lineHeights',
  letterSpacing: 'letterSpacings',
  blockSize: 'sizes',
  minBlockSize: 'sizes',
  maxBlockSize: 'sizes',
  inlineSize: 'sizes',
  minInlineSize: 'sizes',
  maxInlineSize: 'sizes',
  width: 'sizes',
  minWidth: 'sizes',
  maxWidth: 'sizes',
  height: 'sizes',
  minHeight: 'sizes',
  maxHeight: 'sizes',
  flexBasis: 'sizes',
  borderWidth: 'borderWidths',
  borderTopWidth: 'borderWidths',
  borderLeftWidth: 'borderWidths',
  borderRightWidth: 'borderWidths',
  borderBottomWidth: 'borderWidths',
  borderStyle: 'borderStyles',
  borderTopStyle: 'borderStyles',
  borderLeftStyle: 'borderStyles',
  borderRightStyle: 'borderStyles',
  borderBottomStyle: 'borderStyles',
  borderRadius: 'radii',
  borderTopLeftRadius: 'radii',
  borderTopRightRadius: 'radii',
  borderBottomRightRadius: 'radii',
  borderBottomLeftRadius: 'radii',
  boxShadow: 'shadows',
  textShadow: 'shadows',
  zIndex: 'zIndices',
  transition: 'transitions',
};

export const tokenTypes = [
  'sizes',
  'colors',
  'space',
  'fontSizes',
  'lineHeights',
  'fontWeights',
  'fonts',
  'borderWidths',
  'radii',
] as const;

const enhanceSheet = (sheet: ISheet): ISheet => {
  return {
    content: sheet.content,
    cssRules: sheet.cssRules,
    insertRule: (rule, index) => {
      try {
        sheet.insertRule(rule, index);
        return index;
      } catch {
        return -1;
      }
    },
  };
};

export const createSheets = (env: any, screens: IBreakpoints = {}) => {
  const tags: HTMLStyleElement[] = [];
  if (env && env.document) {
    const head = env.document.querySelector('head');

    if (!head) {
      throw new Error('There is no HEAD element on this document');
    }

    const styles = Array.from<HTMLStyleElement>(head.querySelectorAll('style'));
    const existingStyles = styles.filter((style) =>
      Boolean(style.textContent && style.textContent.startsWith('/* STITCHES'))
    );

    return {
      tags,
      sheets: ['__variables__', '__keyframes__', MAIN_BREAKPOINT_ID]
        .concat(Object.keys(screens))
        .reduce<{ [key: string]: ISheet }>((aggr, key, index) => {
          let style = existingStyles[index];
          if (!style) {
            style = env.document.createElement('style');
            head.appendChild(style);
          }
          tags.push(style);
          aggr[key] = enhanceSheet(style.sheet as any);

          return aggr;
        }, {}),
    };
  }

  return {
    tags,
    sheets: ['__variables__', '__keyframes__', MAIN_BREAKPOINT_ID]
      .concat(Object.keys(screens))
      .reduce<{ [key: string]: ISheet }>((aggr, key) => {
        aggr[key] = enhanceSheet({
          content: '',
          cssRules: [],
          insertRule(content, index = 0) {
            this.cssRules.splice(index, 0, content);
          },
        });

        return aggr;
      }, {}),
  };
};

export const specificityProps: {
  [key: string]: any;
} = {
  border,
  boxShadow,
  overflow: (tokens: any, value: any) => ({
    overflowX: value,
    overflowY: value,
  }),
  margin,
  padding,
  borderRadius,
  borderColor,
  borderStyle,
  borderWidth,
  background,
  animation,
  transition,
  font,
  borderBottom,
  borderLeft,
  borderTop,
  borderRight,
  textDecoration,
  gap,
  flex,
};

export const getVendorPrefixAndProps = (env: any) => {
  const styles = env.getComputedStyle(env.document.documentElement);
  const vendorProps = Array.from(styles).filter((prop) => (prop as string)[0] === '-');
  // @ts-ignore
  const vendorPrefix = (vendorProps.join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];

  return { vendorPrefix: `-${vendorPrefix}-`, vendorProps };
};

export const hashString = (str: string) => {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return generateAlphabeticName(hash >>> 0);
};

/**
 * Converts a hash number to alphabetic representation:
 * Copied from:
 * https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/utils/generateAlphabeticName.js
 */

const AD_REPLACER_R = /(a)(d)/gi;

/* This is the "capacity" of our alphabet i.e. 2x26 for all letters plus their capitalised
 * counterparts */
const charsLength = 52;

/* start at 75 for 'a' until 'z' (25) and then start at 65 for capitalised letters */
const getAlphabeticChar = (code: number): string => String.fromCharCode(code + (code > 25 ? 39 : 97));

/* input a number, usually a hash and convert it to base-52 */
function generateAlphabeticName(code: number): string {
  let name = '';
  let x;

  /* get a char and divide by alphabet-length */
  for (x = Math.abs(code); x > charsLength; x = (x / charsLength) | 0) {
    name = getAlphabeticChar(x % charsLength) + name;
  }

  return (getAlphabeticChar(x % charsLength) + name).replace(AD_REPLACER_R, '$1-$2');
}
