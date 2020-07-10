import {
  IConfig,
  IScreens,
  TCss,
  TDeclarativeCss,
  TDefaultDeclarativeCss,
  createCss,
} from "@stitches/css";
import * as React from "react";

type PropsOf<
  E extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<E, React.ComponentPropsWithRef<E>>;

interface BoxOwnProps<E extends React.ElementType = React.ElementType> {
  as?: E;
}

type BoxProps<E extends React.ElementType> = BoxOwnProps<E> &
  Omit<PropsOf<E>, "as">;

type PolymorphicComponentProps<
  E extends React.ElementType,
  P
> = E extends React.ComponentType<infer PP>
  ? (P | PP) &
      BoxOwnProps<E> &
      Omit<
        PropsOf<E extends PolymorphicComponent<any, infer PE> ? PE : E>,
        "as"
      >
  : P & BoxProps<E>;

export type PolymorphicComponent<P, D extends React.ElementType = "div"> = (<
  E extends React.ElementType = D
>(
  props: PolymorphicComponentProps<E, P>
) => JSX.Element) & {
  propTypes?: React.WeakValidationMap<P>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<P>;
  displayName?: string;
};

const defaultElement = "div";

export const Box = React.forwardRef(
  (props: BoxOwnProps, ref: React.Ref<Element>) => {
    const Element = props.as || defaultElement;

    return React.createElement(Element, {
      ref,
      ...props,
      as: undefined,
    });
  }
) as <E extends React.ElementType = typeof defaultElement>(
  props: BoxProps<E>
) => JSX.Element;

export type CSS<C> = TCss<C> & TDeclarativeCss<C>;

export type CssCallback<C> = (css: CSS<C>) => string;
export type CssObject<C> = TDefaultDeclarativeCss<C> extends (
  styled: infer S
) => string
  ? S
  : never;

export type IBaseStyled<C extends IConfig> = <
  E extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  V extends {
    [propKey: string]: {
      [variantName: string]: CssCallback<C> | CssObject<C>;
    };
  }
>(
  element: E,
  css: CssObject<C> | CssCallback<C>,
  variants?: V
) => PolymorphicComponent<
  | (E extends React.ComponentType<infer CP> ? CP : {})
  | (V extends void
      ? {
          styled?: string;
        }
      : {
          [P in keyof V]?: C["screens"] extends IScreens
            ?
                | keyof V[P]
                | {
                    [S in keyof C["screens"]]?: keyof V[P];
                  }
            : keyof V[P];
        } & {
          styled?: string;
        }),
  E
>;

export type IStyled<C extends IConfig> = {
  [E in keyof JSX.IntrinsicElements]: <
    V extends {
      [propKey: string]: {
        [variantName: string]: CssCallback<C> | CssObject<C>;
      };
    }
  >(
    cb: CssCallback<C> | CssObject<C>,
    variants?: V
  ) => PolymorphicComponent<
    V extends void
      ? {
          styled?: string;
        }
      : {
          [P in keyof V]?: C["screens"] extends IScreens
            ?
                | keyof V[P]
                | {
                    [S in keyof C["screens"]]?: keyof V[P];
                  }
            : keyof V[P];
        } & {
          styled?: string;
        },
    E
  >;
};

let hasWarnedInlineStyle = false;

export const createStyled = <T extends IConfig>(css: TCss<T>) => {
  if (!css) {
    throw new Error("@stitches/styled - you need to pass in your css here");
  }

  const polymorphicCss = (cssFunctionOrObject: any, screen?: string) => {
    if (screen) {
      return typeof cssFunctionOrObject === "function"
        ? cssFunctionOrObject((css as any)[screen])
        : css({ [screen]: cssFunctionOrObject });
    }
    return typeof cssFunctionOrObject === "function"
      ? cssFunctionOrObject(css)
      : (css as any)(cssFunctionOrObject);
  };

  let currentAs: string | undefined;

  const configScreens = (css as any)._config.screens;

  const styledInstance = (
    baseStyling: any,
    variants: { [variant: string]: { [name: string]: any } } = {},
    Component: React.ComponentType<any> = Box
  ) => {
    const as = currentAs;

    const baseStyles: any = polymorphicCss(baseStyling);
    const evaluatedVariantMap: Map<
      string,
      Map<string, { [key: string]: string }>
    > = new Map();
    // tslint:disable-next-line
    for (const variantName in variants) {
      const variantMap: Map<string, { [key: string]: string }> = new Map();
      // tslint:disable-next-line
      for (const variant in variants[variantName]) {
        const screens: { [key: string]: string } = {
          "": polymorphicCss(variants[variantName][variant]),
        };
        if (configScreens) {
          // tslint:disable-next-line
          for (const screen in configScreens) {
            screens[screen] = polymorphicCss(
              variants[variantName][variant],
              screen
            );
          }
        }
        variantMap.set(variant, screens);
      }
      evaluatedVariantMap.set(variantName, variantMap);
    }

    return (props: any) => {
      const memoStyled = React.useMemo(() => props.styled, []); // We want this to only eval once

      // Check the memoCompsition's identity to warn the user
      // remove in production
      if (process.env.NODE_ENV === "development") {
        if (memoStyled !== props.styled && !hasWarnedInlineStyle) {
          // tslint:disable-next-line
          console.warn(
            "@stitches/styled : The styled prop should ideally not be dynamic. Define it outside your component using the css composer"
          );
          hasWarnedInlineStyle = true;
        }
      }
      // Make a copy of the baseComposition
      // e.g. combination of baseStyles + props.styled if present
      const compositions = [baseStyles].concat(props.__compositions__ || []);

      const propsWithoutVariants: any = {};

      for (const propName in props) {
        if (propName in variants) {
          const screens = evaluatedVariantMap.get(propName);

          if (typeof props[propName] === "string") {
            compositions.push(screens?.get(props[propName])![""]);
          } else {
            // tslint:disable-next-line
            for (const screen in props[propName]) {
              compositions.push(screens?.get(props[propName][screen])![screen]);
            }
          }
        } else if (propName !== "__compositions__") {
          propsWithoutVariants[propName] = props[propName];
        }
      }

      if (Component === Box && (!props.as || props.as === "string")) {
        if (props.styled) {
          compositions.push(props.styled);
        }

        const className = css.compose(...compositions);

        return React.createElement(Component, {
          ...propsWithoutVariants,
          as: props.as || as,
          className: props.className
            ? `${props.className} ${className}`
            : className,
        });
      }

      return React.createElement(Component, {
        ...propsWithoutVariants,
        as: props.as || as,
        __compositions__: compositions,
      });
    };
  };

  // tslint:disable-next-line
  const styledProxy = (new Proxy(() => {}, {
    get(_, prop) {
      currentAs = String(prop);
      return styledInstance;
    },
    apply(_, __, [Element, styling, variants]) {
      if (typeof Element === "string") {
        currentAs = Element;
        return styledInstance(styling, variants);
      }
      currentAs = undefined;
      return styledInstance(styling, variants, Element);
    },
  }) as unknown) as IBaseStyled<T> & IStyled<T>;

  return styledProxy;
};
