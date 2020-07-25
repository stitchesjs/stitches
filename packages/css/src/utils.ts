import { ICssPropToToken, IScreens, ISheet, TUtility } from "./types";

export const cssPropToToken: ICssPropToToken<any> = {
  border: ["", "borderStyles", "colors"],
  flexBasis: "space",
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
  [key: string]: TUtility<any, any>;
} = {
  border: () => (value) => {
    const parts = Array.isArray(value) ? value : value.split(" ");
    return {
      borderTopWidth: parts[0],
      borderRightWidth: parts[0],
      borderBottomWidth: parts[0],
      borderLeftWidth: parts[0],
      borderTopStyle: parts[1],
      borderRightStyle: parts[1],
      borderBottomStyle: parts[1],
      borderLeftStyle: parts[1],
      borderTopColor: parts[2],
      borderRightColor: parts[2],
      borderBottomColor: parts[2],
      borderLeftColor: parts[2],
    };
  },
  boxShadow: (config) => (value) => ({
    boxShadow: Array.isArray(value)
      ? `${value[0]} ${value[1]} ${value[2]} ${
          config.tokens &&
          config.tokens.colors &&
          config.tokens.colors[value[3]]
            ? config.tokens.colors[value[3]]
            : value[3]
        }`
      : value,
  }),
  flex: () => (value) => {
    if (Array.isArray(value)) {
      if (value.length === 2) {
        return {
          flexGrow: value[0],
          ...(isNaN(value[1])
            ? { flexBasis: value[1] }
            : { flexShrink: value[1] }),
        };
      }
      if (value.length === 3) {
        return {
          flexGrow: value[0],
          flexShrink: value[1],
          flexBasis: value[2],
        };
      }
    }

    return isNaN(value)
      ? {
          flexBasis: value,
        }
      : {
          flexGrow: value,
        };
  },
  overflow: () => (value) => ({ overflowX: value, overflowY: value }),
  margin: () => (value) => {
    if (Array.isArray(value)) {
      if (value.length === 2) {
        return {
          marginLeft: value[1],
          marginTop: value[0],
          marginRight: value[1],
          marginBottom: value[0],
        };
      }
      if (value.length === 3) {
        return {
          marginLeft: value[1],
          marginTop: value[0],
          marginRight: value[1],
          marginBottom: value[2],
        };
      }

      return {
        marginLeft: value[3],
        marginTop: value[0],
        marginRight: value[1],
        marginBottom: value[2],
      };
    }

    return {
      marginLeft: value,
      marginTop: value,
      marginRight: value,
      marginBottom: value,
    };
  },
  padding: () => (value) => {
    if (Array.isArray(value)) {
      if (value.length === 2) {
        return {
          paddingLeft: value[1],
          paddingTop: value[0],
          paddingRight: value[1],
          paddingBottom: value[0],
        };
      }
      if (value.length === 3) {
        return {
          paddingLeft: value[1],
          paddingTop: value[0],
          paddingRight: value[1],
          paddingBottom: value[2],
        };
      }

      return {
        paddingLeft: value[3],
        paddingTop: value[0],
        paddingRight: value[1],
        paddingBottom: value[2],
      };
    }

    return {
      paddingLeft: value,
      paddingTop: value,
      paddingRight: value,
      paddingBottom: value,
    };
  },
  borderRadius: () => (value) => ({
    borderTopLeftRadius: value,
    borderTopRightRadius: value,
    borderBottomLeftRadius: value,
    borderBottomRightRadius: value,
  }),
  borderColor: () => (value) => ({
    borderTopColor: value,
    borderRightColor: value,
    borderBottomColor: value,
    borderLeftColor: value,
  }),
  borderStyle: () => (value) => ({
    borderTopStyle: value,
    borderRightStyle: value,
    borderBottomStyle: value,
    borderLeftStyle: value,
  }),
  borderWidth: () => (value) => ({
    borderTopWidth: value,
    borderRightWidth: value,
    borderBottomWidth: value,
    borderLeftWidth: value,
  }),
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
