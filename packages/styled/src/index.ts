import { IConfig, TCss } from "@stitches/css";
import * as React from "react";
import { Box, PolymorphicComponent } from "react-polymorphic-box";

export type IStyled<
  C extends IConfig,
  E extends keyof JSX.IntrinsicElements
> = (<P extends object = {}>(
  defaults: P,
  cb: (css: TCss<C>, props: P) => string
) => PolymorphicComponent<P, E>) &
  ((cb: (css: TCss<C>) => string) => PolymorphicComponent<{}, E>);

export const createStyled = <C extends IConfig>() => {
  let currentAs: string;

  const context = React.createContext<TCss<C>>(null as any);
  const useCssInstance = () => React.useContext(context);
  const ProviderInstance: React.FC<{ css: TCss<C> }> = ({ css, children }) =>
    React.createElement(
      context.Provider,
      {
        value: css,
      },
      children
    );
  const styledInstance = (...args: any[]) => {
    const as = currentAs;
    return (props: any) => {
      const css = useCssInstance();
      if (!css) {
        throw new Error(
          "@stitches/styled - You do not seem to have added the Provider, please read the documentation for more help"
        );
      }
      const cb = args.length === 1 ? args[0] : args[1];
      const defaults = args.length === 1 ? {} : args[0];
      const propsToPass = Object.keys(props).reduce<any>((aggr, key) => {
        if (key in defaults) {
          return aggr;
        }

        aggr[key] = props[key];

        return aggr;
      }, {});
      const cbProps = { ...defaults, ...props };

      return React.createElement(Box, {
        as,
        className: cb(
          css,
          Object.keys(cbProps).reduce<any>((aggr, key) => {
            if (cbProps[key] === undefined && defaults[key]) {
              aggr[key] = defaults[key];
            } else {
              aggr[key] = cbProps[key];
            }

            return aggr;
          }, {})
        ),
        ...propsToPass,
      });
    };
  };

  const styledProxy = new Proxy(
    {},
    {
      get(_, prop) {
        currentAs = String(prop);
        return styledInstance;
      },
    }
  ) as {
    [E in keyof JSX.IntrinsicElements]: IStyled<C, E>;
  };

  return {
    Provider: ProviderInstance,
    useCss: useCssInstance,
    styled: styledProxy,
  };
};

const { Provider, useCss, styled } = createStyled<{}>();

export { Provider, useCss, styled };
