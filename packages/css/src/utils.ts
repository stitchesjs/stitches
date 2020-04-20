import { AllCssProps } from "./css-types";

import { IConfig, ICssPropToToken, IScreens, ISheet } from "./types";

export const cssPropToToken: ICssPropToToken = {
  color: "colors",
  backgroundColor: "colors",
  margin: "space",
  marginTop: "space",
  marginLeft: "space",
  marginRight: "space",
  marginBottom: "space",
  padding: "space",
  paddingTop: "space",
  paddingLeft: "space",
  paddingRight: "space",
  paddingBottom: "space",
  gridGap: "space",
  gridColumnGap: "space",
  gridRowGap: "space",
  fontSize: "fontSizes",
  borderColor: "colors",
  borderTopColor: "colors",
  borderLeftColor: "colors",
  borderRightColor: "colors",
  borderBottomColor: "colors",
  fontFamily: "fonts",
  fontWeight: "fontWeights",
  lineHeight: "lineHeights",
  letterSpacing: "letterSpacings",
  width: "sizes",
  height: "sizes",
  minWidth: "sizes",
  maxWidth: "sizes",
  minHeight: "sizes",
  maxHeight: "sizes",
  borderWidth: "borderWidths",
  borderTopWidth: "borderWidths",
  borderLeftWidth: "borderWidths",
  borderRightWidth: "borderWidths",
  borderBottomWidth: "borderWidths",
  borderStyle: "borderStyles",
  borderTopStyle: "borderStyles",
  borderLeftStyle: "borderStyles",
  borderRightStyle: "borderStyles",
  borderBottomStyle: "borderStyles",
  borderRadius: "radii",
  borderTopLeftRadius: "radii",
  borderTopRightRadius: "radii",
  borderBottomRightRadius: "radii",
  borderBottomLeftRadius: "radii",
  boxShadow: "shadows",
  textShadow: "shadows",
  zIndex: "zIndices",
  transition: "transitions",
};

export const createSheets = (env: any, screens: IScreens = {}) => {
  if (env && env.document) {
    const head = env.document.querySelector("head");

    if (!head) {
      throw new Error("There is no HEAD element on this document");
    }

    let styleCount = head.querySelectorAll("style").length;
    return [""]
      .concat(Object.keys(screens))
      .reduce<{ [key: string]: ISheet }>((aggr, key) => {
        const style = env.document.createElement("style");
        head.appendChild(style);
        aggr[key] = (env.document.styleSheets[
          styleCount++
        ] as unknown) as ISheet;

        return aggr;
      }, {});
  }

  return [""]
    .concat(Object.keys(screens))
    .reduce<{ [key: string]: ISheet }>((aggr, key) => {
      aggr[key] = {
        content: "",
        cssRules: [],
        insertRule(content) {
          aggr[key].content += `\n${content}`;
        },
      };

      return aggr;
    }, {});
};

export const addDefaultUtils = (config: IConfig) => {
  config.utils = config.utils || {};
  config.utils.overflow = (css) => (
    value: AllCssProps["overflow"],
    pseudo?: string
  ) =>
    css.compose(
      css.overflowX(value as any, pseudo),
      css.overflowY(value as any, pseudo)
    );
  config.utils.margin = (css) => (
    value: AllCssProps["margin"],
    pseudo?: string
  ) =>
    css.compose(
      css.marginLeft(value, pseudo),
      css.marginTop(value, pseudo),
      css.marginRight(value, pseudo),
      css.marginBottom(value, pseudo)
    );
  config.utils.padding = (css) => (
    value: AllCssProps["padding"],
    pseudo?: string
  ) =>
    css.compose(
      css.paddingLeft(value, pseudo),
      css.paddingTop(value, pseudo),
      css.paddingRight(value, pseudo),
      css.paddingBottom(value, pseudo)
    );
  config.utils.borderRadius = (css) => (
    value: AllCssProps["borderRadius"],
    pseudo?: string
  ) =>
    css.compose(
      css.borderTopLeftRadius(value, pseudo),
      css.borderTopRightRadius(value, pseudo),
      css.borderBottomLeftRadius(value, pseudo),
      css.borderBottomRightRadius(value, pseudo)
    );
  config.utils.borderColor = (css) => (
    value: AllCssProps["borderColor"],
    pseudo?: string
  ) =>
    css.compose(
      css.borderTopColor(value, pseudo),
      css.borderRightColor(value, pseudo),
      css.borderBottomColor(value, pseudo),
      css.borderLeftColor(value, pseudo)
    );
  config.utils.borderStyle = (css) => (
    value: AllCssProps["borderStyle"],
    pseudo?: string
  ) =>
    css.compose(
      css.borderTopStyle(value, pseudo),
      css.borderRightStyle(value, pseudo),
      css.borderBottomStyle(value, pseudo),
      css.borderLeftStyle(value, pseudo)
    );
  config.utils.borderWidth = (css) => (
    value: AllCssProps["borderWidth"],
    pseudo?: string
  ) =>
    css.compose(
      css.borderTopWidth(value, pseudo),
      css.borderRightWidth(value, pseudo),
      css.borderBottomWidth(value, pseudo),
      css.borderLeftWidth(value, pseudo)
    );
};
