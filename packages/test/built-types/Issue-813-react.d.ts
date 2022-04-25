/// <reference types="react" />
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
            color: {
                readonly [Stitches.$$PropertyValue]: "backgroundColor";
            };
        };
        c: (value: Stitches.ScaleValue<'colors'>) => {
            color: {
                readonly [Stitches.$$ScaleValue]: "colors";
            };
        };
    };
}, styled: <Type extends keyof JSX.IntrinsicElements | import("react").ComponentType<any> | import("@stitches/react/types/util").Function, Composers extends (string | import("react").ComponentType<any> | import("@stitches/react/types/util").Function | {
    [name: string]: unknown;
})[], CSS = import("@stitches/react/types/css-util").CSS<{}, {
    colors: {
        primary: string;
    };
}, import("@stitches/react/types/config").DefaultThemeMap, {
    bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
        color: {
            readonly [Stitches.$$PropertyValue]: "backgroundColor";
        };
    };
    c: (value: Stitches.ScaleValue<'colors'>) => {
        color: {
            readonly [Stitches.$$ScaleValue]: "colors";
        };
    };
}>>(type: Type, ...composers: { [K in keyof Composers]: string extends Composers[K] ? Composers[K] : Composers[K] extends string | import("react").ComponentType<any> | import("@stitches/react/types/util").Function ? Composers[K] : import("@stitches/react/types/stitches").RemoveIndex<CSS> & {
    variants?: {
        [x: string]: {
            [x: string]: CSS;
            [x: number]: CSS;
        };
    } | undefined;
    compoundVariants?: (("variants" extends keyof Composers[K] ? { [Name in keyof Composers[K][keyof Composers[K] & "variants"]]?: import("@stitches/react/types/util").String | import("@stitches/react/types/util").Widen<keyof Composers[K][keyof Composers[K] & "variants"][Name]> | undefined; } : import("@stitches/react/types/util").WideObject) & {
        css: CSS;
    })[] | undefined;
    defaultVariants?: ("variants" extends keyof Composers[K] ? { [Name_1 in keyof Composers[K][keyof Composers[K] & "variants"]]?: import("@stitches/react/types/util").String | import("@stitches/react/types/util").Widen<keyof Composers[K][keyof Composers[K] & "variants"][Name_1]> | undefined; } : import("@stitches/react/types/util").WideObject) | undefined;
} & CSS & { [K2 in keyof Composers[K]]: K2 extends "variants" | "compoundVariants" | "defaultVariants" ? unknown : K2 extends keyof CSS ? CSS[K2] : unknown; }; }) => import("@stitches/react/types/styled-component").StyledComponent<Type, import("@stitches/react/types/styled-component").StyledComponentProps<Composers>, {}, import("@stitches/react/types/css-util").CSS<{}, {
    colors: {
        primary: string;
    };
}, import("@stitches/react/types/config").DefaultThemeMap, {
    bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
        color: {
            readonly [Stitches.$$PropertyValue]: "backgroundColor";
        };
    };
    c: (value: Stitches.ScaleValue<'colors'>) => {
        color: {
            readonly [Stitches.$$ScaleValue]: "colors";
        };
    };
}>>;
export declare const colorValue1: Stitches.PropertyValue<'backgroundColor', typeof config>;
export declare const colorValue2: Stitches.PropertyValue<'backgroundColor', typeof config>;
export declare const colorToken: Stitches.ScaleValue<'colors', typeof config>;
export declare const Box: import("@stitches/react/types/styled-component").StyledComponent<"div", {}, {}, import("@stitches/react/types/css-util").CSS<{}, {
    colors: {
        primary: string;
    };
}, import("@stitches/react/types/config").DefaultThemeMap, {
    bg: (value: Stitches.PropertyValue<'backgroundColor'>) => {
        color: {
            readonly [Stitches.$$PropertyValue]: "backgroundColor";
        };
    };
    c: (value: Stitches.ScaleValue<'colors'>) => {
        color: {
            readonly [Stitches.$$ScaleValue]: "colors";
        };
    };
}>>;
