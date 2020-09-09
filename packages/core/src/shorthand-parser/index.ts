import { tokenTypes } from '../constants';
import { tokenizeValue } from './value-tokenizer';

const unitMatch = /^[0-9.]+[a-z|%]/;
const easingMatch = /\(.*\)|ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end/;

const fontSizeMatch = /^([+-]?[0-9.]+([a-z]+|%)?|large(r)?|medium|small(er)?|x{1,3}-large|x{1,2}-small)(\/[+-]?[0-9.]+([a-z]+|%)?)?$/;
const fontStyleMatch = /^[+-]?[0-9.]+deg$/;
const fontWeightMatch = /^(0*[1-9][0-9]{0,2}|1000|bold(er)?|lighter)$/;

const matchString = (val: number | string, regex: RegExp) => (typeof val === 'number' ? false : val.match(regex));
const setChainedValue = (existingValue: string, value: string, separator = ',') =>
  existingValue ? `${existingValue}${separator}${value}` : value;

const emptyTokens: any = {};
tokenTypes.forEach((type) => (emptyTokens[type] = {}));

/*
  The generic CSS prop value parser. Converts any css value into an
  array of chains, where each chain is an array of individual values
*/

const createPropertyParser = (type: any) => (tokens: any, value: any) => {
  const chains: any[][] = typeof value === 'number' ? [[value]] : tokenizeValue(value);
  const css = {};
  // TODO: refactor this
  const tmpTokens = typeof value === 'number' ? emptyTokens : tokens;

  chains.forEach((chain, chainIndex) => {
    // tslint:disable-next-line
    chain.forEach((_value, index) => {
      type(tmpTokens, css, _value, index, chain, chainIndex, chains);
    });
  });

  return css;
};

export const background = createPropertyParser(
  (tokens: any, css: any, value: any, index: any, chain: any, chainIndex: any, chains: any) => {
    if (value === '/') {
      return;
    } else if (matchString(value, /scroll|local|fixed/))
      css.backgroundAttachment = setChainedValue(css.backgroundAttachment, value);
    else if (matchString(value, /^url|linear-gradient|element|image|cross-fade|image-set/))
      css.backgroundImage = setChainedValue(css.backgroundImage, value);
    else if (matchString(value, /border-box|padding-box|content-box|text/)) {
      if (chain.filter((chainPart: any) => chainPart.match(/border-box|padding-box|content-box|text/)).length === 1) {
        css.backgroundOrigin = setChainedValue(css.backgroundOrigin, value);
        css.backgroundClip = setChainedValue(css.backgroundClip, value);
      } else if (
        chain.findIndex((chainPart: any) => chainPart.match(/border-box|padding-box|content-box|text/)) === index
      ) {
        css.backgroundOrigin = setChainedValue(css.backgroundOrigin, value);
      } else {
        css.backgroundClip = setChainedValue(css.backgroundClip, value);
      }
    } else if (chain[index - 1] === '/') {
      css.backgroundSize = setChainedValue(css.backgroundSize, tokens.sizes[value] || value);
    } else if (
      matchString(value, /center|top|right|bottom|left/) ||
      matchString(value, unitMatch) ||
      tokens.sizes[value]
    )
      css.backgroundPosition = setChainedValue(css.backgroundPosition, tokens.sizes[value] || value);
    else if (matchString(value, /repeat|no-repeat|repeat-x|repeat-y|space|round/))
      css.backgroundRepeat = setChainedValue(css.backgroundRepeat, value);
    else {
      if (chainIndex !== chains.length - 1) {
        throw new Error('You can only add background colors on the last chain');
      }

      css.backgroundColor = setChainedValue(css.backgroundColor, tokens.colors[value] || value);
    }
  }
);

export const animation = createPropertyParser((_: any, css: any, value: any, index: any, chain: any) => {
  if (matchString(value, easingMatch)) {
    css.animationTimingFunction = setChainedValue(css.animationTimingFunction, value);
  } else if (matchString(value, /^\d+$|infinite/)) {
    css.animationIterationCount = setChainedValue(css.animationIterationCount, value);
  } else if (matchString(value, /normal|reverse|alternate|alternate-reverse/)) {
    css.animationDirection = setChainedValue(css.animationDirection, value);
  } else if (matchString(value, /none|forward|backwards|both/)) {
    css.animationFillMode = setChainedValue(css.animationFillMode, value);
  } else if (matchString(value, /running|paused/)) {
    css.animationPlayState = setChainedValue(css.animationPlayState, value);
  } else if (matchString(value, unitMatch)) {
    if (chain.findIndex((part: any) => part.match(unitMatch)) === index) {
      css.animationDuration = setChainedValue(css.animationDuration, value);
    } else {
      css.animationDelay = setChainedValue(css.animationDelay, value);
    }
  } else {
    css.animationName = setChainedValue(css.animationName, value);
  }
});

export const font = createPropertyParser(
  (tokens: any, css: any, value: any, index: any, chain: any, chainIndex: any, chains: any) => {
    if (chains.shouldParseFontFamily) {
      css.fontFamily = setChainedValue(css.fontFamily, tokens.fonts[value] || value);
    } else {
      const lower = value.toLowerCase();

      switch (true) {
        case fontStyleMatch.test(lower):
          css.fontStyle += ` ${value}`;

          break;

        case fontWeightMatch.test(lower):
          css.fontWeight = tokens.fontWeights[value] || value;

          break;

        case fontSizeMatch.test(lower):
          chains.shouldParseFontFamily = true;

          const [fontSize, lineHeight] = value.split('/');
          css.fontSize = tokens.fontSizes[fontSize] || fontSize;

          if (lineHeight) {
            css.lineHeight = tokens.lineHeights[lineHeight] || lineHeight;
          }

          break;

        case lower === 'italic':
        case lower === 'oblique':
          css.fontStyle = value;

          break;

        case lower === 'small-caps':
          css.fontVariant = value;

          break;

        case lower === 'condensed':
        case lower === 'expanded':
        case lower === 'extra-condensed':
        case lower === 'extra-expanded':
        case lower === 'semi-condensed':
        case lower === 'semi-expanded':
        case lower === 'ultra-condensed':
        case lower === 'ultra-expanded':
          css.fontStretch = value;

          break;

        case lower === 'caption':
        case lower === 'icon':
        case lower === 'menu':
        case lower === 'message-box':
        case lower === 'small-caption':
        case lower === 'status-bar':
          chains.shouldParseFontFamily = true;

          css.fontFamily = setChainedValue(css.fontFamily, tokens.fonts[value] || value);

          break;

        default:
          break;
      }
    }
  }
);

export const transition = createPropertyParser(
  // The whole token is a transition, so need to grab it before passing in here
  (_: any, css: any, value: any, index: any, chain: any) => {
    if (matchString(value, unitMatch)) {
      if (chain.findIndex((part: any) => part.match(unitMatch)) === index) {
        css.transitionDuration = setChainedValue(css.transitionDuration, value);
      } else {
        css.transitionDelay = setChainedValue(css.transitionDelay, value);
      }
    } else if (matchString(value, easingMatch)) {
      css.transitionTimingFunction = setChainedValue(css.transitionTimingFunction, value);
    } else {
      css.transitionProperty = setChainedValue(css.transitionProperty, value);
    }
  }
);

export const margin = createPropertyParser((tokens: any, css: any, value: any, index: any) => {
  if (index === 0) {
    css.marginTop = tokens.space[value] || value;
    css.marginRight = tokens.space[value] || value;
    css.marginBottom = tokens.space[value] || value;
    css.marginLeft = tokens.space[value] || value;
  } else if (index === 1) {
    css.marginRight = tokens.space[value] || value;
    css.marginLeft = tokens.space[value] || value;
  } else if (index === 2) {
    css.marginBottom = tokens.space[value] || value;
  } else {
    css.marginLeft = tokens.space[value] || value;
  }
});

export const padding = createPropertyParser((tokens: any, css: any, value: any, index: any) => {
  if (index === 0) {
    css.paddingTop = tokens.space[value] || value;
    css.paddingRight = tokens.space[value] || value;
    css.paddingBottom = tokens.space[value] || value;
    css.paddingLeft = tokens.space[value] || value;
  } else if (index === 1) {
    css.paddingRight = tokens.space[value] || value;
    css.paddingLeft = tokens.space[value] || value;
  } else if (index === 2) {
    css.paddingBottom = tokens.space[value] || value;
  } else {
    css.paddingLeft = tokens.space[value] || value;
  }
});

export const border = createPropertyParser((tokens: any, css: any, value: any) => {
  if (matchString(value, /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/)) {
    css.borderTopStyle = value;
    css.borderRightStyle = value;
    css.borderBottomStyle = value;
    css.borderLeftStyle = value;
  } else if (matchString(value, unitMatch) || tokens.borderWidths[value] || !isNaN(value)) {
    css.borderTopWidth = tokens.borderWidths[value] || value;
    css.borderRightWidth = tokens.borderWidths[value] || value;
    css.borderBottomWidth = tokens.borderWidths[value] || value;
    css.borderLeftWidth = tokens.borderWidths[value] || value;
  } else {
    css.borderTopColor = tokens.colors[value] || value;
    css.borderRightColor = tokens.colors[value] || value;
    css.borderBottomColor = tokens.colors[value] || value;
    css.borderLeftColor = tokens.colors[value] || value;
  }
});

export const borderTop = createPropertyParser((tokens: any, css: any, value: any) => {
  if (matchString(value, /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/)) {
    css.borderTopStyle = value;
  } else if (matchString(value, unitMatch) || tokens.borderWidths[value] || !isNaN(value)) {
    css.borderTopWidth = tokens.borderWidths[value] || value;
  } else {
    css.borderTopColor = tokens.colors[value] || value;
  }
});

export const borderRight = createPropertyParser((tokens: any, css: any, value: any) => {
  if (matchString(value, /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/)) {
    css.borderRightStyle = value;
  } else if (matchString(value, unitMatch) || tokens.borderWidths[value] || !isNaN(value)) {
    css.borderRightWidth = tokens.borderWidths[value] || value;
  } else {
    css.borderRightColor = tokens.colors[value] || value;
  }
});

export const borderLeft = createPropertyParser((tokens: any, css: any, value: any) => {
  if (matchString(value, /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/)) {
    css.borderLeftStyle = value;
  } else if (matchString(value, unitMatch) || tokens.borderWidths[value] || !isNaN(value)) {
    css.borderLeftWidth = tokens.borderWidths[value] || value;
  } else {
    css.borderLeftColor = tokens.colors[value] || value;
  }
});

export const borderBottom = createPropertyParser((tokens: any, css: any, value: any) => {
  if (matchString(value, /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/)) {
    css.borderBottomStyle = value;
  } else if (matchString(value, unitMatch) || tokens.borderWidths[value] || !isNaN(value)) {
    css.borderBottomWidth = tokens.borderWidths[value] || value;
  } else {
    css.borderBottomColor = tokens.colors[value] || value;
  }
});

export const borderWidth = createPropertyParser((tokens: any, css: any, value: any, index: any) => {
  if (index === 0) {
    css.borderTopWidth = tokens.borderWidths[value] || value;
    css.borderRightWidth = tokens.borderWidths[value] || value;
    css.borderBottomWidth = tokens.borderWidths[value] || value;
    css.borderLeftWidth = tokens.borderWidths[value] || value;
  } else if (index === 1) {
    css.borderRightWidth = tokens.borderWidths[value] || value;
    css.borderLeftWidth = tokens.borderWidths[value] || value;
  } else if (index === 2) {
    css.borderBottomWidth = tokens.borderWidths[value] || value;
  } else {
    css.borderLeftWidth = tokens.borderWidths[value] || value;
  }
});

export const borderColor = createPropertyParser((tokens: any, css: any, value: any, index: any) => {
  if (index === 0) {
    css.borderTopColor = tokens.colors[value] || value;
    css.borderRightColor = tokens.colors[value] || value;
    css.borderBottomColor = tokens.colors[value] || value;
    css.borderLeftColor = tokens.colors[value] || value;
  } else if (index === 1) {
    css.borderRightColor = tokens.colors[value] || value;
    css.borderLeftColor = tokens.colors[value] || value;
  } else if (index === 2) {
    css.borderBottomColor = tokens.colors[value] || value;
  } else {
    css.borderLeftColor = tokens.colors[value] || value;
  }
});

export const borderStyle = createPropertyParser((tokens: any, css: any, value: any, index: any) => {
  if (index === 0) {
    css.borderTopStyle = value;
    css.borderRightStyle = value;
    css.borderBottomStyle = value;
    css.borderLeftStyle = value;
  } else if (index === 1) {
    css.borderRightStyle = value;
    css.borderLeftStyle = value;
  } else if (index === 2) {
    css.borderBottomStyle = value;
  } else {
    css.borderLeftStyle = value;
  }
});

export const borderRadius = createPropertyParser((tokens: any, css: any, value: any, index: any) => {
  if (index === 0) {
    css.borderBottomLeftRadius = tokens.radii[value] || value;
    css.borderTopLeftRadius = tokens.radii[value] || value;
    css.borderTopRightRadius = tokens.radii[value] || value;
    css.borderBottomRightRadius = tokens.radii[value] || value;
  } else if (index === 1) {
    css.borderTopRightRadius = tokens.radii[value] || value;
    css.borderBottomLeftRadius = tokens.radii[value] || value;
  } else if (index === 2) {
    css.borderBottomRightRadius = tokens.radii[value] || value;
  } else if (index === 3) {
    css.borderBottomLeftRadius = tokens.radii[value] || value;
  }
});

export const boxShadow = (tokens: any, value: string) => {
  return {
    boxShadow: tokenizeValue(value)
      .map((chain) => chain.map((val) => tokens.colors[val] || val).join(' '))
      .join(', '),
  };
};

export const textDecoration = createPropertyParser((tokens: any, css: any, value: any) => {
  if (matchString(value, /unset/)) {
    css.textDecorationStyle = value;
    css.textDecorationLine = value;
    css.textDecorationColor = value;
    css.textDecorationThickness = value;
  } else if (matchString(value, /solid|double|dotted|dashed|wavy/)) {
    css.textDecorationStyle = value;
  } else if (matchString(value, /none|underline|overline|line-through|blink/)) {
    css.textDecorationLine = setChainedValue(css.textDecorationLine, value, ' ');
  } else if (matchString(value, unitMatch) || matchString(value, /auto|from-font/)) {
    css.textDecorationThickness = value;
  } else {
    css.textDecorationColor = tokens.colors[value] || value;
  }
});
