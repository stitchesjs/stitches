import * as Stitches from '@stitches/react';
export declare const config: {
    prefix: "";
    media: {};
    theme: {
        colors: {
            primary: string;
        };
    };
    themeMap: import("@stitches/react/types/config").DefaultThemeMap;
    utils: {
        bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
            color: import("@stitches/react/types/css-util").WithPropertyValue<"backgroundColor">;
        };
        c: (value: Stitches.ScaleValue<'colors'>) => {
            color: import("@stitches/react/types/css-util").WithScaleValue<"colors">;
        };
    };
}, styled: {
    withConfig: (config: {
        componentId?: string | undefined;
        displayName?: string | undefined;
        shouldForwardStitchesProp?: ((prop: "css" | (string & {})) => boolean | void) | undefined;
    }) => import("@stitches/react/types/stitches").StyledFunctionType<{}, {
        colors: {
            primary: string;
        };
    }, import("@stitches/react/types/config").DefaultThemeMap, {
        bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
            color: import("@stitches/react/types/css-util").WithPropertyValue<"backgroundColor">;
        };
        c: (value: Stitches.ScaleValue<'colors'>) => {
            color: import("@stitches/react/types/css-util").WithScaleValue<"colors">;
        };
    }>;
} & import("@stitches/react/types/stitches").StyledFunctionType<{}, {
    colors: {
        primary: string;
    };
}, import("@stitches/react/types/config").DefaultThemeMap, {
    bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
        color: import("@stitches/react/types/css-util").WithPropertyValue<"backgroundColor">;
    };
    c: (value: Stitches.ScaleValue<'colors'>) => {
        color: import("@stitches/react/types/css-util").WithScaleValue<"colors">;
    };
}>;
export declare const colorValue1: Stitches.PropertyValue<'backgroundColor', typeof config>;
export declare const colorValue2: Stitches.PropertyValue<'backgroundColor', typeof config>;
export declare const colorToken: Stitches.ScaleValue<'colors', typeof config>;
export declare const Box: import("@stitches/react/types/styled-component").StyledComponent<"div", {}, {}, import("@stitches/react/types/css-util").CSS<{}, {
    colors: {
        primary: string;
    };
}, import("@stitches/react/types/config").DefaultThemeMap, {
    bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
        color: import("@stitches/react/types/css-util").WithPropertyValue<"backgroundColor">;
    };
    c: (value: Stitches.ScaleValue<'colors'>) => {
        color: import("@stitches/react/types/css-util").WithScaleValue<"colors">;
    };
}>>;
