import {
  TConfig,
  TDefaultCss,
  TUtilityFirstCss,
  createCss,
  hashString,
  TCss
} from "@stitches/css";
import * as React from "react";

let hasWarnedInlineStyle = false;

type VariantASProps<BreakPoints, VariantsObj> = {
  [V in keyof VariantsObj]?: VariantsObj[V] extends "true" | "false"
    ? boolean | "true" | "false"
    :
        | never
        | VariantsObj[V]
        | {
            [B in keyof BreakPoints]?: VariantsObj[V] extends "true" | "false"
              ? boolean | "true" | "false"
              : never | VariantsObj[V];
          };
};

interface IComponent<
  ComponentOrTag extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
  Variants extends {},
  CSS,
  BREAKPOINTS
> {
  (
    props: React.ComponentPropsWithRef<ComponentOrTag> & {
      as?: never;
      className?: string;
      children?: any;
    } & VariantASProps<BREAKPOINTS, Variants>
  ): any;
  <
    AS extends
      | keyof JSX.IntrinsicElements
      | React.ComponentType<any> = ComponentOrTag
  >(
    props: React.ComponentPropsWithRef<AS> & {
      as?: AS;
      className?: string;
      children?: any;
    } & VariantASProps<BREAKPOINTS, Variants>
  ): any;
  variant: <
    VariantName extends string,
    VariantValues extends {
      [a in string | number]: CSS & { [key in keyof BREAKPOINTS]?: CSS };
    }
  >(
    variant: VariantName,
    possibleValues: VariantValues & VariantValues
  ) => IComponent<
    ComponentOrTag,
    Variants & { [key in VariantName]: keyof VariantValues },
    CSS,
    BREAKPOINTS
  >;
  compoundVariant: (
    variant: { [Key in keyof Variants]?: Variants[Key] },
    possibleValues: CSS & { [key in keyof BREAKPOINTS]?: CSS }
  ) => IComponent<ComponentOrTag, Variants, CSS, BREAKPOINTS>;
}

const createCompoundVariantsMatcher = (breakPoints: any, existingMap?: any) => {
  const map = new Map();
  map.set("", [...(existingMap?.get("") || [])]);
  Object.keys(breakPoints).forEach((breakpoint) =>
    map.set(breakpoint, [...(existingMap?.get(breakpoint) || [])])
  );
  return map;
};
export const createStyled = <
  T extends TConfig,
  CSS = T extends { utilityFirst: true } ? TUtilityFirstCss<T> : TDefaultCss<T>,
  BREAKPOINTS = T["breakpoints"]
>(
  config: T
): {
  css: TCss<T>;
  styled: <
    C extends
      | keyof JSX.IntrinsicElements
      | React.ComponentType<any>
      | IComponent<any, any, CSS, BREAKPOINTS>
  >(
    tag: C,
    baseStyles: CSS & { [key in keyof BREAKPOINTS]?: CSS }
  ) => C extends IComponent<any, any, CSS, BREAKPOINTS>
    ? C
    : IComponent<C, {}, CSS, BREAKPOINTS>;
} => {
  const css = createCss(config);
  const defaultElement = "div";
  const Box = React.forwardRef((props: any, ref: React.Ref<Element>) => {
    const Element = props.as || defaultElement;

    return React.createElement(Element, {
      ref,
      ...props,
      as: undefined
    });
  });

  let currentAs: string | undefined;

  const configBreakpoints = config.breakpoints || {};

  const styledInstance = (
    baseStyling: any = (cssComposer: any) => cssComposer.compose(),
    _variants: { [variant: string]: { [name: string]: any } } = {},
    Component: React.ComponentType<any> = Box
  ) => {
    const as = currentAs;
    const variants = _variants;

    const baseStyles: any = css(baseStyling);
    // compound variants vars & constants:
    // keep track of all compound variants:
    const compoundVariants: any[] = [];
    // a map that keeps track of the required number of matching variants left for each break point:
    const requiredMatches = createCompoundVariantsMatcher(configBreakpoints);
    // keep track of the number of available variants
    let numberOfCompoundVariants = 0;
    const evaluatedVariantMap: Map<
      string,
      Map<string, { [key: string]: string }>
    > = new Map();
    // store pre evaluated variants
    const evaluatedCompoundVariants: Map<
      any,
      { [key: string]: string }
    > = new Map();

    const stitchesComponentId = `scid-${hashString(
      `${JSON.stringify(baseStyling)}${JSON.stringify(variants)}`
    )}`;

    const StitchesComponent = React.forwardRef(
      (props: any, ref: React.Ref<Element>) => {
        // Check the memoCompsition's identity to warn the user
        // remove in production
        if (process.env.NODE_ENV === "development") {
          // we're breaking the rules of hooks on purpose as the env will never change
          // eslint-disable-next-line
          const memoStyled = React.useMemo(() => props.css, []); // We want this to only eval once
          if (memoStyled !== props.css && !hasWarnedInlineStyle) {
            // tslint:disable-next-line
            console.warn(
              "@stitches/styled : The css prop should ideally not be dynamic. Define it outside your component using the css composer, or use a memo hook"
            );
            hasWarnedInlineStyle = true;
          }
        }

        const compositions = [baseStyles];

        const propsWithoutVariantsAndCssProp: any = {};
        // clone the compound variants matcher
        const compoundRequiredMatches = createCompoundVariantsMatcher(
          configBreakpoints,
          requiredMatches
        );
        // keep track of the number of unResolved variants so that we could bail early:
        const numberOfUnResolvedCompoundVariants = {
          current: numberOfCompoundVariants
        };
        for (const key in props) {
          // check if the prop is a variant
          if (key in variants) {
            const evaluatedVariant = evaluatedVariantMap.get(key);
            // normalize the value so that we only have to deal with one structure:
            const keyVal =
              props[key] && typeof props[key] !== "object"
                ? { "": props[key] }
                : props[key];
            for (const breakpoint in keyVal) {
              // check if the variant

              if (
                keyVal[breakpoint] &&
                evaluatedVariant &&
                evaluatedVariant.get(String(keyVal[breakpoint]))
              ) {
                compositions.push(
                  evaluatedVariant.get(String(keyVal[breakpoint]))?.[breakpoint]
                );
              }
              /** Compound variants: */
              if (numberOfUnResolvedCompoundVariants.current) {
                compoundVariants.forEach((compoundVariant, i) => {
                  // if this breakpoint variant matches a compound variant
                  // eslint-disable-next-line
                  if (keyVal[breakpoint] == compoundVariant[key]) {
                    compoundRequiredMatches.get(breakpoint)[i]++;
                  }
                  // when the required matches reach 0 for any compound variant...
                  // we know we have a matched compoundVariant
                  if (
                    compoundRequiredMatches.get(breakpoint)[i] ===
                    Object.keys(compoundVariant).length
                  ) {
                    numberOfUnResolvedCompoundVariants.current--;
                    compositions.push(
                      evaluatedCompoundVariants.get(compoundVariant)?.[
                        breakpoint
                      ]
                    );
                  }
                });
              }
              /** End compound variants */
            }
          } else {
            propsWithoutVariantsAndCssProp[key] = props[key];
          }
        }

        if (propsWithoutVariantsAndCssProp.css) {
          compositions.push(propsWithoutVariantsAndCssProp.css);
          propsWithoutVariantsAndCssProp.css = undefined;
        }

        return React.createElement(Component, {
          ...propsWithoutVariantsAndCssProp,
          as: props.as || as,
          ref,
          className: css(stitchesComponentId, ...compositions, props.className)
        });
      }
    );

    StitchesComponent.toString = () => `.${stitchesComponentId}`;

    (StitchesComponent as any).variant = (
      variantName: string,
      variantsStyles: any
    ) => {
      variants[variantName] = variantsStyles;
      const variantMap: Map<string, { [key: string]: string }> = new Map();
      for (const variant in variants[variantName]) {
        const evaluatedStyles = evaluateStylesForAllBreakpoints(
          variants[variantName][variant],
          configBreakpoints,
          css
        );
        variantMap.set(variant, evaluatedStyles);
      }
      evaluatedVariantMap.set(variantName, variantMap);
      return StitchesComponent;
    };

    (StitchesComponent as any).compoundVariant = (
      compundVariantsObject: any,
      compoundVariantStyles: any
    ) => {
      // Update component level variables:
      numberOfCompoundVariants++;
      compoundVariants.push(compundVariantsObject);
      requiredMatches.forEach((value) => {
        value.push(0);
      });

      const evaluatedStyles = evaluateStylesForAllBreakpoints(
        compoundVariantStyles,
        configBreakpoints,
        css
      );

      evaluatedCompoundVariants.set(compundVariantsObject, evaluatedStyles);
      return StitchesComponent;
    };
    return StitchesComponent;
  };

  // tslint:disable-next-line
  const styledProxy = new Proxy(() => {}, {
    get(_, prop) {
      if (prop === "Box") {
        return Box;
      }
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
    }
  });

  return {
    styled: styledProxy as any,
    css
  };
};
function evaluateStylesForAllBreakpoints(
  styleObject: any,
  configBreakpoints: any,
  css: any
) {
  const breakpoints: { [key: string]: string } = {
    "": css(styleObject)
  };
  if (configBreakpoints) {
    // tslint:disable-next-line
    for (const breakpoint in configBreakpoints) {
      breakpoints[breakpoint] = css({
        [breakpoint]: styleObject
      });
    }
  }
  return breakpoints;
}
