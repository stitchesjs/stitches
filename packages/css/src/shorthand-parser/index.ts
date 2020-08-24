import { tokenizeValue } from "./value-tokenizer";

const unitMatch = /^[0-9.]+[a-z|%]/;
const easingMatch = /\(.*\)|ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end/;

const setChainedValue = (existingValue: string, value: string) =>
  existingValue ? `${existingValue},${value}` : value;

/*
  The generic CSS prop value parser. Converts any css value into an
  array of chains, where each chain is an array of individual values
*/

const createPropertyParser = (type: any) => (tokens: any, value: string) => {
  const chains = tokenizeValue(value);
  const css = {};

  chains.forEach((chain, chainIndex) => {
    // tslint:disable-next-line
    chain.forEach((value, index) => {
      type(tokens, css, value, index, chain, chainIndex, chains);
    });
  });

  return css;
};

export const background = createPropertyParser(
  (
    tokens: any,
    css: any,
    value: any,
    index: any,
    chain: any,
    chainIndex: any,
    chains: any
  ) => {
    if (value === "/") {
      return;
    } else if (value.match(/scroll|local|fixed/))
      css.backgroundAttachment = setChainedValue(
        css.backgroundAttachment,
        value
      );
    else if (
      value.match(/^url|linear-gradient|element|image|cross-fade|image-set/)
    )
      css.backgroundImage = setChainedValue(css.backgroundImage, value);
    else if (value.match(/border-box|padding-box|content-box|text/)) {
      if (
        chain.filter((chainPart: any) =>
          chainPart.match(/border-box|padding-box|content-box|text/)
        ).length === 1
      ) {
        css.backgroundOrigin = setChainedValue(css.backgroundOrigin, value);
        css.backgroundClip = setChainedValue(css.backgroundClip, value);
      } else if (
        chain.findIndex((chainPart: any) =>
          chainPart.match(/border-box|padding-box|content-box|text/)
        ) === index
      ) {
        css.backgroundOrigin = setChainedValue(css.backgroundOrigin, value);
      } else {
        css.backgroundClip = setChainedValue(css.backgroundClip, value);
      }
    } else if (chain[index - 1] === "/") {
      css.backgroundSize = setChainedValue(
        css.backgroundSize,
        tokens.sizes[value] || value
      );
    } else if (
      value.match(/center|top|right|bottom|left/) ||
      value.match(unitMatch) ||
      tokens.sizes[value]
    )
      css.backgroundPosition = setChainedValue(
        css.backgroundPosition,
        tokens.sizes[value] || value
      );
    else if (value.match(/repeat|no-repeat|repeat-x|repeat-y|space|round/))
      css.backgroundRepeat = setChainedValue(css.backgroundRepeat, value);
    else {
      if (chainIndex !== chains.length - 1) {
        throw new Error("You can only add background colors on the last chain");
      }
      css.backgroundColor = setChainedValue(
        css.backgroundColor,
        tokens.colors[value] || value
      );
    }
  }
);

export const animation = createPropertyParser(
  (_: any, css: any, value: any, index: any, chain: any) => {
    if (value.match(easingMatch)) {
      css.animationTimingFunction = setChainedValue(
        css.animationTimingFunction,
        value
      );
    } else if (value.match(/^\d+$|infinite/)) {
      css.animationIterationCount = setChainedValue(
        css.animationIterationCount,
        value
      );
    } else if (value.match(/normal|reverse|alternate|alternate-reverse/)) {
      css.animationDirection = setChainedValue(css.animationDirection, value);
    } else if (value.match(/none|forward|backwards|both/)) {
      css.animationFillMode = setChainedValue(css.animationFillMode, value);
    } else if (value.match(/running|paused/)) {
      css.animationPlayState = setChainedValue(css.animationPlayState, value);
    } else if (value.match(unitMatch)) {
      if (chain.findIndex((part: any) => part.match(unitMatch)) === index) {
        css.animationDuration = setChainedValue(css.animationDuration, value);
      } else {
        css.animationDelay = setChainedValue(css.animationDelay, value);
      }
    } else {
      css.animationName = setChainedValue(css.animationName, value);
    }
  }
);

export const font = createPropertyParser(
  (tokens: any, css: any, value: any) => {
    if (value.match(/^[0-9.]+deg/)) css.fontStyle += ` ${value}`;
    else if (value.match(/\//)) {
      const [fontSize, lineHeight] = value.split("/");
      css.fontSize = tokens.fontSizes[fontSize] || fontSize;
      css.lineHeight = tokens.lineHeights[lineHeight] || lineHeight;
    } else if (
      value.match(unitMatch) ||
      value.match(
        /xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large/
      ) ||
      tokens.fontSizes[value]
    )
      css.fontSize = tokens.fontSizes[value] || value;
    else if (value.match(/normal|italic|oblique/)) css.fontStyle = value;
    else if (value.match(/normal|bold/) || tokens.fontWeights[value])
      css.fontWeight =
        value === "normal" ? 400 : tokens.fontWeights[value] || 700;
    else if (value.match(unitMatch) || tokens.fontSizes[value])
      css.fontSize = tokens.fontSizes[value] || value;
    else {
      css.fontFamily = setChainedValue(
        css.fontFamily,
        tokens.fonts[value] || value
      );
    }
  }
);

export const transition = createPropertyParser(
  // The whole token is a transition, so need to grab it before passing in here
  (_: any, css: any, value: any, index: any, chain: any) => {
    if (value.match(unitMatch)) {
      if (chain.findIndex((part: any) => part.match(unitMatch)) === index) {
        css.transitionDuration = setChainedValue(css.transitionDuration, value);
      } else {
        css.transitionDelay = setChainedValue(css.transitionDelay, value);
      }
    } else if (value.match(easingMatch)) {
      css.transitionTimingFunction = setChainedValue(
        css.transitionTimingFunction,
        value
      );
    } else {
      css.transitionProperty = setChainedValue(css.transitionProperty, value);
    }
  }
);

export const margin = createPropertyParser(
  (tokens: any, css: any, value: any, index: any) => {
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
  }
);

export const padding = createPropertyParser(
  (tokens: any, css: any, value: any, index: any) => {
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
  }
);

export const border = createPropertyParser(
  (tokens: any, css: any, value: any) => {
    if (
      value.match(
        /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/
      )
    ) {
      css.borderTopStyle = value;
      css.borderRightStyle = value;
      css.borderBottomStyle = value;
      css.borderLeftStyle = value;
    } else if (
      value.match(unitMatch) ||
      tokens.borderWidths[value] ||
      !isNaN(value)
    ) {
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
  }
);

export const borderTop = createPropertyParser(
  (tokens: any, css: any, value: any) => {
    if (
      value.match(
        /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/
      )
    ) {
      css.borderTopStyle = value;
    } else if (value.match(unitMatch) || tokens.borderWidths[value]) {
      css.borderTopWidth = tokens.borderWidths[value] || value;
    } else {
      css.borderTopColor = tokens.colors[value] || value;
    }
  }
);

export const borderRight = createPropertyParser(
  (tokens: any, css: any, value: any) => {
    if (
      value.match(
        /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/
      )
    ) {
      css.borderRightStyle = value;
    } else if (value.match(unitMatch) || tokens.borderWidths[value]) {
      css.borderRightWidth = tokens.borderWidths[value] || value;
    } else {
      css.borderRightColor = tokens.colors[value] || value;
    }
  }
);

export const borderLeft = createPropertyParser(
  (tokens: any, css: any, value: any) => {
    if (
      value.match(
        /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/
      )
    ) {
      css.borderLeftStyle = value;
    } else if (value.match(unitMatch) || tokens.borderWidths[value]) {
      css.borderLeftWidth = tokens.borderWidths[value] || value;
    } else {
      css.borderLeftColor = tokens.colors[value] || value;
    }
  }
);

export const borderBottom = createPropertyParser(
  (tokens: any, css: any, value: any) => {
    if (
      value.match(
        /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/
      )
    ) {
      css.borderBottomStyle = value;
    } else if (value.match(unitMatch) || tokens.borderWidths[value]) {
      css.borderBottomWidth = tokens.borderWidths[value] || value;
    } else {
      css.borderBottomColor = tokens.colors[value] || value;
    }
  }
);

export const borderWidth = createPropertyParser(
  (tokens: any, css: any, value: any, index: any) => {
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
  }
);

export const borderColor = createPropertyParser(
  (tokens: any, css: any, value: any, index: any) => {
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
  }
);

export const borderStyle = createPropertyParser(
  (tokens: any, css: any, value: any, index: any) => {
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
  }
);

export const borderRadius = createPropertyParser(
  (tokens: any, css: any, value: any, index: any) => {
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
  }
);

export const boxShadow = (tokens: any, value: string) => {
  return {
    boxShadow: tokenizeValue(value)
      .map((chain) =>
        chain
          .map((val) => (tokens.colors[val] ? tokens.colors[val] : val))
          .join(" ")
      )
      .join(", "),
  };
};
