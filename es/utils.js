export var cssPropToToken = {
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
export var createSheets = function (env, screens) {
    if (screens === void 0) { screens = {}; }
    if (env && env.document) {
        var head_1 = env.document.querySelector("head");
        if (!head_1) {
            throw new Error("There is no HEAD element on this document");
        }
        var styleCount_1 = head_1.querySelectorAll("style").length;
        return [""]
            .concat(Object.keys(screens))
            .reduce(function (aggr, key) {
            var style = env.document.createElement("style");
            head_1.appendChild(style);
            aggr[key] = env.document.styleSheets[styleCount_1++];
            return aggr;
        }, {});
    }
    return [""]
        .concat(Object.keys(screens))
        .reduce(function (aggr, key) {
        aggr[key] = {
            content: "",
            cssRules: [],
            insertRule: function (content) {
                aggr[key].content += "\n" + content;
            },
        };
        return aggr;
    }, {});
};
//# sourceMappingURL=utils.js.map