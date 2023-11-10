import * as Stitches from '@voiceflow/stitches-react';
export declare const config: {
    prefix: "";
    media: {};
    theme: {
        colors: {
            primary: string;
        };
    };
    themeMap: import("@voiceflow/stitches-react/types/config").DefaultThemeMap;
    utils: {
        bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
            color: import("@voiceflow/stitches-react/types/css-util").WithPropertyValue<"backgroundColor">;
        };
        c: (value: Stitches.ScaleValue<'colors'>) => {
            color: import("@voiceflow/stitches-react/types/css-util").WithScaleValue<"colors">;
        };
    };
}, styled: {
    withConfig: (config: {
        componentId?: string | undefined;
        displayName?: string | undefined;
        shouldForwardStitchesProp?: ((prop: "css" | (string & {})) => boolean | void) | undefined;
    }) => import("@voiceflow/stitches-react/types/stitches").StyledFunctionType<{}, {
        colors: {
            primary: string;
        };
    }, import("@voiceflow/stitches-react/types/config").DefaultThemeMap, {
        bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
            color: import("@voiceflow/stitches-react/types/css-util").WithPropertyValue<"backgroundColor">;
        };
        c: (value: Stitches.ScaleValue<'colors'>) => {
            color: import("@voiceflow/stitches-react/types/css-util").WithScaleValue<"colors">;
        };
    }>;
} & import("@voiceflow/stitches-react/types/stitches").StyledFunctionType<{}, {
    colors: {
        primary: string;
    };
}, import("@voiceflow/stitches-react/types/config").DefaultThemeMap, {
    bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
        color: import("@voiceflow/stitches-react/types/css-util").WithPropertyValue<"backgroundColor">;
    };
    c: (value: Stitches.ScaleValue<'colors'>) => {
        color: import("@voiceflow/stitches-react/types/css-util").WithScaleValue<"colors">;
    };
}>;
export declare const colorValue1: Stitches.PropertyValue<'backgroundColor', typeof config>;
export declare const colorValue2: Stitches.PropertyValue<'backgroundColor', typeof config>;
export declare const colorToken: Stitches.ScaleValue<'colors', typeof config>;
export declare const Box: import("@voiceflow/stitches-react/types/styled-component").StyledComponent<"div", {}, {}, import("@voiceflow/stitches-react/types/css-util").CSS<{}, {
    colors: {
        primary: string;
    };
}, import("@voiceflow/stitches-react/types/config").DefaultThemeMap, {
    bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
        color: import("@voiceflow/stitches-react/types/css-util").WithPropertyValue<"backgroundColor">;
    };
    c: (value: Stitches.ScaleValue<'colors'>) => {
        color: import("@voiceflow/stitches-react/types/css-util").WithScaleValue<"colors">;
    };
}>>;
