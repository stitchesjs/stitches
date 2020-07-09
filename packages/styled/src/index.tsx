import {
  IConfig,
  TCss,
  TDeclarativeCss,
  TDefaultDeclarativeCss,
  createCss,
} from "@stitches/css";
import * as React from "react";
import { Box, PolymorphicComponent } from "react-polymorphic-box";

export type CSS<C> = TCss<C> & TDeclarativeCss<C>;

export type CssCallback<C> = (css: CSS<C>) => string;
export type CssObject<C> = TDefaultDeclarativeCss<C> extends (
  styled: infer S
) => string
  ? S
  : never;

export type IBaseStyled<C extends IConfig> = (css: CssObject<C>) => string;

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
    | { [P in keyof V]?: keyof V[P] }
    | ({
        styled?: string;
      } & {}),
    E
  >;
};

let hasWarnedInlineStyle = false;

export const createStyled = <T extends IConfig>(css: TCss<T>) => {
  if (!css) {
    throw new Error("@stitches/styled - you need to pass in your css here");
  }

  const polymorphicCss = (cssFunctionOrObject: any) => {
    return typeof cssFunctionOrObject === "function"
      ? cssFunctionOrObject(css)
      : (css as any)(cssFunctionOrObject);
  };

  let currentAs: string;

  const styledInstance = (
    baseStyling: any,
    variants: { [variant: string]: { [name: string]: any } } = {}
  ) => {
    const as = currentAs;

    const baseStyles: any = polymorphicCss(baseStyling);
    const evaluatedVariantMap: Map<string, Map<string, string>> = new Map();
    // tslint:disable-next-line
    for (const variantName in variants) {
      const variantMap: Map<string, string> = new Map();
      // tslint:disable-next-line
      for (const variant in variants[variantName]) {
        variantMap.set(variant, polymorphicCss(variants[variantName][variant]));
      }
      evaluatedVariantMap.set(variantName, variantMap);
    }

    return (props: any) => {
      const memoComposition = React.useMemo(() => {
        const base = [baseStyles];
        if (props.styled) {
          base.push(polymorphicCss(props.styled));
        }
        return {
          identity: props.styled,
          base,
        }; // eslint-disable-next-line
      }, []); // We want this to only eval once

      // Check the memoCompsition's identity to warn the user
      // remove in production
      if (process.env.NODE_ENV === "development") {
        if (
          memoComposition.identity !== props.styled &&
          !hasWarnedInlineStyle
        ) {
          // tslint:disable-next-line
          console.warn(
            "@stitches/styled : The styled prop should ideally not be dynamic. Define it outside your component using the css composer"
          );
          hasWarnedInlineStyle = true;
        }
      }
      // Make a copy of the baseComposition
      // e.g. combination of baseStyles + props.styled if present
      const compositions = memoComposition.base.slice();

      const propsWithoutVariants: any = {};

      for (const propName in props) {
        if (propName in variants && props[propName] in variants[propName]) {
          const name = evaluatedVariantMap.get(propName)?.get(props[propName]);
          if (name) {
            compositions.push(name);
          }
        } else {
          propsWithoutVariants[propName] = props[propName];
        }
      }

      const className = css.compose(...compositions);

      return React.createElement(Box, {
        as,
        ...propsWithoutVariants,
        className: props.className
          ? `${props.className} ${className}`
          : className,
      });
    };
  };

  // tslint:disable-next-line
  const styledProxy = (new Proxy(() => {}, {
    get(_, prop) {
      currentAs = String(prop);
      return styledInstance;
    },
    apply(_, __, args) {
      return args[0];
    },
  }) as unknown) as IBaseStyled<T> & IStyled<T>;

  return styledProxy;
};
