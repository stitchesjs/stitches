import { StandardLonghandProperties } from "csstype";
export declare type TProps = "animationDelay" | "animationDirection" | "animationDuration" | "animationFillMode" | "animationIterationCount" | "animationName" | "animationPlayState" | "animationTimingFunction" | "backgroundAttachment" | "backgroundBlendMode" | "backgroundClip" | "backgroundColor" | "backgroundImage" | "backgroundOrigin" | "backgroundPosition" | "backgroundRepeat" | "backgroundSize" | "borderBottomColor" | "borderBottomLeftRadius" | "borderBottomRightRadius" | "borderBottomStyle" | "borderBottomWidth" | "borderCollapse" | "borderImageOutset" | "borderImageRepeat" | "borderImageSlice" | "borderImageSource" | "borderImageWidth" | "borderLeftColor" | "borderLeftStyle" | "borderLeftWidth" | "borderRightColor" | "borderRightStyle" | "borderRightWidth" | "borderTopColor" | "borderTopLeftRadius" | "borderTopRightRadius" | "borderTopStyle" | "borderTopWidth" | "bottom" | "boxShadow" | "boxSizing" | "breakAfter" | "breakBefore" | "breakInside" | "captionSide" | "clear" | "clip" | "color" | "content" | "cursor" | "direction" | "display" | "emptyCells" | "float" | "fontFamily" | "fontKerning" | "fontOpticalSizing" | "fontSize" | "fontStretch" | "fontStyle" | "fontVariant" | "fontVariantLigatures" | "fontVariantCaps" | "fontVariantNumeric" | "fontVariantEastAsian" | "fontWeight" | "height" | "imageRendering" | "isolation" | "justifyItems" | "justifySelf" | "left" | "letterSpacing" | "lineHeight" | "listStyleImage" | "listStylePosition" | "listStyleType" | "marginBottom" | "marginLeft" | "marginRight" | "marginTop" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "mixBlendMode" | "objectFit" | "objectPosition" | "offsetDistance" | "offsetPath" | "offsetRotate" | "opacity" | "orphans" | "outlineColor" | "outlineOffset" | "outlineStyle" | "outlineWidth" | "overflowAnchor" | "overflowWrap" | "overflowX" | "overflowY" | "paddingBottom" | "paddingLeft" | "paddingRight" | "paddingTop" | "pointerEvents" | "position" | "resize" | "right" | "scrollBehavior" | "speak" | "tableLayout" | "tabSize" | "textAlign" | "textAlignLast" | "textDecoration" | "textDecorationLine" | "textDecorationStyle" | "textDecorationColor" | "textDecorationSkipInk" | "textUnderlinePosition" | "textIndent" | "textRendering" | "textShadow" | "textSizeAdjust" | "textOverflow" | "textTransform" | "top" | "touchAction" | "transitionDelay" | "transitionDuration" | "transitionProperty" | "transitionTimingFunction" | "unicodeBidi" | "verticalAlign" | "visibility" | "whiteSpace" | "widows" | "width" | "willChange" | "wordBreak" | "wordSpacing" | "zIndex" | "zoom" | "backfaceVisibility" | "columnCount" | "columnGap" | "columnRuleColor" | "columnRuleStyle" | "columnRuleWidth" | "columnSpan" | "columnWidth" | "backdropFilter" | "alignContent" | "alignItems" | "alignSelf" | "flexBasis" | "flexGrow" | "flexShrink" | "flexDirection" | "flexWrap" | "justifyContent" | "gridAutoColumns" | "gridAutoFlow" | "gridAutoRows" | "gridColumnEnd" | "gridColumnStart" | "gridTemplateAreas" | "gridTemplateColumns" | "gridTemplateRows" | "gridRowEnd" | "gridRowStart" | "rowGap" | "hyphens" | "order" | "perspective" | "perspectiveOrigin" | "shapeOutside" | "shapeImageThreshold" | "shapeMargin" | "transform" | "transformOrigin" | "transformStyle" | "userSelect" | "bufferedRendering" | "clipPath" | "clipRule" | "mask" | "filter" | "floodColor" | "floodOpacity" | "lightingColor" | "stopColor" | "stopOpacity" | "colorInterpolation" | "colorInterpolationFilters" | "colorRendering" | "fill" | "fillOpacity" | "fillRule" | "markerEnd" | "markerMid" | "markerStart" | "maskType" | "shapeRendering" | "stroke" | "strokeDasharray" | "strokeDashoffset" | "strokeLinecap" | "strokeLinejoin" | "strokeMiterlimit" | "strokeOpacity" | "strokeWidth" | "alignmentBaseline" | "baselineShift" | "dominantBaseline" | "textAnchor" | "writingMode" | "vectorEffect" | "paintOrder" | "d" | "cx" | "cy" | "x" | "y" | "r" | "rx" | "ry" | "caretColor" | "lineBreak";
export interface IScreens {
    [key: string]: (css: string) => string;
}
export interface IAtom {
    id: string;
    cssPropParts: string[];
    value: string;
    pseudo: string | undefined;
    screen: string;
    tokenValue: string | undefined;
    toString: () => string;
}
export interface IComposedAtom {
    atoms: IAtom[];
    toString: () => string;
}
export interface ICssPropToToken {
    color: "colors";
    backgroundColor: "colors";
    marginTop: "space";
    marginLeft: "space";
    marginRight: "space";
    marginBottom: "space";
    paddingTop: "space";
    paddingLeft: "space";
    paddingRight: "space";
    paddingBottom: "space";
    gridGap: "space";
    gridColumnGap: "space";
    gridRowGap: "space";
    fontSize: "fontSizes";
    borderTopColor: "colors";
    borderLeftColor: "colors";
    borderRightColor: "colors";
    borderBottomColor: "colors";
    fontFamily: "fonts";
    fontWeight: "fontWeights";
    lineHeight: "lineHeights";
    letterSpacing: "letterSpacings";
    width: "sizes";
    height: "sizes";
    minWidth: "sizes";
    maxWidth: "sizes";
    minHeight: "sizes";
    maxHeight: "sizes";
    borderTopWidth: "borderWidths";
    borderLeftWidth: "borderWidths";
    borderRightWidth: "borderWidths";
    borderBottomWidth: "borderWidths";
    borderTopStyle: "borderStyles";
    borderLeftStyle: "borderStyles";
    borderRightStyle: "borderStyles";
    borderBottomStyle: "borderStyles";
    borderTopLeftRadius: "radii";
    borderTopRightRadius: "radii";
    borderBottomRightRadius: "radii";
    borderBottomLeftRadius: "radii";
    boxShadow: "shadows";
    textShadow: "shadows";
    zIndex: "zIndices";
    transition: "transitions";
}
export interface ITokenDefinition {
    [key: string]: string;
    [key: number]: string;
}
export declare type TTokensDefinition = {
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
};
export interface IConfig {
    screens?: IScreens;
    tokens?: TTokensDefinition;
    utils?: {
        [name: string]: (css: TCss<any>) => (...args: any[]) => string;
    };
}
export declare type TCss<T extends IConfig> = {
    [K in TProps]: (value: K extends keyof ICssPropToToken ? T["tokens"] extends object ? T["tokens"][ICssPropToToken[K]] extends object ? keyof T["tokens"][ICssPropToToken[K]] : K extends keyof StandardLonghandProperties ? StandardLonghandProperties[K] : string : K extends keyof StandardLonghandProperties ? StandardLonghandProperties[K] : string : K extends keyof StandardLonghandProperties ? StandardLonghandProperties[K] : string, pseudo?: string) => string;
} & {
    [U in keyof T["utils"]]: T["utils"][U] extends (css: TCss<any>) => (...args: infer P) => string ? (...args: P) => string : never;
} & {
    [S in keyof T["screens"]]: {
        [K in TProps]: (value: K extends keyof ICssPropToToken ? T["tokens"] extends object ? T["tokens"][ICssPropToToken[K]] extends object ? keyof T["tokens"][ICssPropToToken[K]] | string : K extends keyof StandardLonghandProperties ? StandardLonghandProperties[K] : string : K extends keyof StandardLonghandProperties ? StandardLonghandProperties[K] : string : K extends keyof StandardLonghandProperties ? StandardLonghandProperties[K] : string, pseudo?: string) => string;
    };
} & {
    compose: (...compositions: string[]) => string;
    getStyles: () => string;
};
export interface ISheet {
    cssRules: any[];
    content: string;
    insertRule(rule: string): void;
}
