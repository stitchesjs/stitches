import { ICssPropToToken, IScreens, ISheet } from "./types";

export const cssPropToToken: ICssPropToToken = {
  color: "colors",
  backgroundColor: "colors",
  marginTop: "space",
  marginLeft: "space",
  marginRight: "space",
  marginBottom: "space",
  paddingTop: "space",
  paddingLeft: "space",
  paddingRight: "space",
  paddingBottom: "space",
  gridGap: "space",
  gridColumnGap: "space",
  gridRowGap: "space",
  fontSize: "fontSizes",
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
  borderTopWidth: "borderWidths",
  borderLeftWidth: "borderWidths",
  borderRightWidth: "borderWidths",
  borderBottomWidth: "borderWidths",
  borderTopStyle: "borderStyles",
  borderLeftStyle: "borderStyles",
  borderRightStyle: "borderStyles",
  borderBottomStyle: "borderStyles",
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
