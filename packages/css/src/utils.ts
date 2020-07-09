import { ICssPropToToken, IScreens, ISheet, TCss } from "./types";

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
  const tags: HTMLStyleElement[] = [];
  if (env && env.document) {
    const head = env.document.querySelector("head");

    if (!head) {
      throw new Error("There is no HEAD element on this document");
    }

    const styles = Array.from<HTMLStyleElement>(head.querySelectorAll("style"));
    const existingStyles = styles.filter((style) =>
      Boolean(style.textContent && style.textContent.startsWith("/* STITCHES"))
    );

    return {
      tags,
      sheets: ["__variables__", ""]
        .concat(Object.keys(screens))
        .reduce<{ [key: string]: ISheet }>((aggr, key, index) => {
          let style = existingStyles[index];
          if (!style) {
            style = env.document.createElement("style");
            tags.push(style);
            head.appendChild(style);
          }

          for (let x = 0; x < document.styleSheets.length; x++) {
            if (document.styleSheets[x].ownerNode === style) {
              aggr[key] = document.styleSheets[x] as any;
              break;
            }
          }

          return aggr;
        }, {}),
    };
  }

  return {
    tags,
    sheets: ["__variables__", ""]
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
      }, {}),
  };
};

export const specificityProps: {
  [key: string]: (css: TCss<any>) => (value: any, pseudo?: string) => string;
} = {
  overflow: (css) => (value, pseudo) =>
    css.compose(
      css.overflowX(value as any, pseudo),
      css.overflowY(value as any, pseudo)
    ),
  margin: (css) => (value, pseudo) =>
    css.compose(
      css.marginLeft(value, pseudo),
      css.marginTop(value, pseudo),
      css.marginRight(value, pseudo),
      css.marginBottom(value, pseudo)
    ),
  padding: (css) => (value, pseudo) =>
    css.compose(
      css.paddingLeft(value, pseudo),
      css.paddingTop(value, pseudo),
      css.paddingRight(value, pseudo),
      css.paddingBottom(value, pseudo)
    ),
  borderRadius: (css) => (value, pseudo) =>
    css.compose(
      css.borderTopLeftRadius(value, pseudo),
      css.borderTopRightRadius(value, pseudo),
      css.borderBottomLeftRadius(value, pseudo),
      css.borderBottomRightRadius(value, pseudo)
    ),
  borderColor: (css) => (value, pseudo) =>
    css.compose(
      css.borderTopColor(value, pseudo),
      css.borderRightColor(value, pseudo),
      css.borderBottomColor(value, pseudo),
      css.borderLeftColor(value, pseudo)
    ),
  borderStyle: (css) => (value, pseudo) =>
    css.compose(
      css.borderTopStyle(value, pseudo),
      css.borderRightStyle(value, pseudo),
      css.borderBottomStyle(value, pseudo),
      css.borderLeftStyle(value, pseudo)
    ),
  borderWidth: (css) => (value, pseudo) =>
    css.compose(
      css.borderTopWidth(value, pseudo),
      css.borderRightWidth(value, pseudo),
      css.borderBottomWidth(value, pseudo),
      css.borderLeftWidth(value, pseudo)
    ),
};

export const getVendorPrefixAndProps = (env: any) => {
  const styles = env.getComputedStyle(env.document.documentElement);
  const vendorProps = Array.from(styles).filter(
    (prop) => (prop as string)[0] === "-"
  );
  // @ts-ignore
  const vendorPrefix = (vendorProps.join("").match(/-(moz|webkit|ms)-/) ||
    (styles.OLink === "" && ["", "o"]))[1];

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
  return hash >>> 0;
};
