import * as Stitches from '@stitches/core';
export declare const config: {
    prefix: "";
    media: {};
    theme: {
        colors: {
            primary: string;
        };
    };
    themeMap: import("@stitches/core/types/config").DefaultThemeMap;
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
}, css: <Composers extends (string | import("@stitches/core/types/util").Function | {
    [name: string]: unknown;
})[], CSS = import("@stitches/core/types/css-util").CSS<{}, {
    colors: {
        primary: string;
    };
}, import("@stitches/core/types/config").DefaultThemeMap, {
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
}>>(...composers: { [K in keyof Composers]: string extends Composers[K] ? Composers[K] : Composers[K] extends string | import("@stitches/core/types/util").Function ? Composers[K] : import("@stitches/core/types/stitches").RemoveIndex<CSS> & {
    variants?: {
        [x: string]: {
            [x: string]: CSS;
            [x: number]: CSS;
        };
    } | undefined;
    compoundVariants?: (("variants" extends keyof Composers[K] ? { [Name in keyof Composers[K][keyof Composers[K] & "variants"]]?: import("@stitches/core/types/util").String | import("@stitches/core/types/util").Widen<keyof Composers[K][keyof Composers[K] & "variants"][Name]> | undefined; } : import("@stitches/core/types/util").WideObject) & {
        css: CSS;
    })[] | undefined;
    defaultVariants?: ("variants" extends keyof Composers[K] ? { [Name_1 in keyof Composers[K][keyof Composers[K] & "variants"]]?: import("@stitches/core/types/util").String | import("@stitches/core/types/util").Widen<keyof Composers[K][keyof Composers[K] & "variants"][Name_1]> | undefined; } : import("@stitches/core/types/util").WideObject) | undefined;
} & CSS & { [K2 in keyof Composers[K]]: K2 extends "variants" | "compoundVariants" | "defaultVariants" ? unknown : K2 extends keyof CSS ? CSS[K2] : unknown; }; }) => import("@stitches/core/types/styled-component").CssComponent<import("@stitches/core/types/styled-component").StyledComponentType<Composers>, import("@stitches/core/types/styled-component").StyledComponentProps<Composers>, {}, CSS>;
export declare const colorValue1: Stitches.PropertyValue<'backgroundColor', typeof config>;
export declare const colorValue2: Stitches.PropertyValue<'backgroundColor', typeof config>;
export declare const colorToken: Stitches.ScaleValue<'colors', typeof config>;
export declare const box: import("@stitches/core/types/styled-component").CssComponent<never, {}, {}, import("@stitches/core/types/css-util").CSS<{}, {
    colors: {
        primary: string;
    };
}, import("@stitches/core/types/config").DefaultThemeMap, {
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
