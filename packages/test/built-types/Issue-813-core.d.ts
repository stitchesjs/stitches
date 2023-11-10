import * as Stitches from '@voiceflow/stitches-core';
export declare const config: {
    prefix: "";
    media: {};
    theme: {
        colors: {
            primary: string;
        };
    };
    themeMap: import("@voiceflow/stitches-core/types/config").DefaultThemeMap;
    utils: {
        bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
            color: import("@voiceflow/stitches-core/types/css-util").WithPropertyValue<"backgroundColor">;
        };
        c: (value: Stitches.ScaleValue<'colors'>) => {
            color: import("@voiceflow/stitches-core/types/css-util").WithScaleValue<"colors">;
        };
    };
}, css: {
    withConfig: (config: {
        componentId?: string | undefined;
        displayName?: string | undefined;
        shouldForwardStitchesProp?: ((prop: "css" | (string & {})) => boolean | void) | undefined;
    }) => import("@voiceflow/stitches-core/types/stitches").CssFunctionType<{}, {
        colors: {
            primary: string;
        };
    }, import("@voiceflow/stitches-core/types/config").DefaultThemeMap, {
        bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
            color: import("@voiceflow/stitches-core/types/css-util").WithPropertyValue<"backgroundColor">;
        };
        c: (value: Stitches.ScaleValue<'colors'>) => {
            color: import("@voiceflow/stitches-core/types/css-util").WithScaleValue<"colors">;
        };
    }>;
} & import("@voiceflow/stitches-core/types/stitches").CssFunctionType<{}, {
    colors: {
        primary: string;
    };
}, import("@voiceflow/stitches-core/types/config").DefaultThemeMap, {
    bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
        color: import("@voiceflow/stitches-core/types/css-util").WithPropertyValue<"backgroundColor">;
    };
    c: (value: Stitches.ScaleValue<'colors'>) => {
        color: import("@voiceflow/stitches-core/types/css-util").WithScaleValue<"colors">;
    };
}>;
export declare const colorValue1: Stitches.PropertyValue<'backgroundColor', typeof config>;
export declare const colorValue2: Stitches.PropertyValue<'backgroundColor', typeof config>;
export declare const colorToken: Stitches.ScaleValue<'colors', typeof config>;
export declare const box: import("@voiceflow/stitches-core/types/styled-component").CssComponent<never, {}, {}, import("@voiceflow/stitches-core/types/css-util").CSS<{}, {
    colors: {
        primary: string;
    };
}, import("@voiceflow/stitches-core/types/config").DefaultThemeMap, {
    bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
        color: import("@voiceflow/stitches-core/types/css-util").WithPropertyValue<"backgroundColor">;
    };
    c: (value: Stitches.ScaleValue<'colors'>) => {
        color: import("@voiceflow/stitches-core/types/css-util").WithScaleValue<"colors">;
    };
}>>;
